import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import {
  Radio, Save, Clock, Video, User, FileText,
  AlignLeft, CheckCircle, AlertCircle, Loader2,
  Eye, ExternalLink, Copy, Play, Pause, RefreshCw,
  Sparkles, Check, Globe
} from 'lucide-react';
import YouTube from 'react-youtube';

const INITIAL_DATA = {
  is_live: false,
  video_id: '',
  next_scheduled_time: '',
  next_title: '',
  sermon_title: '',
  speaker_name: '',
  description: '',
  pdf_url: '',
  current_video_time: 0,
};

// Helper: Auto-extract 11-character YouTube video ID from any format
function extractYouTubeId(urlOrId) {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  // If it's already an 11-char ID
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;

  // Match youtube.com/watch?v=ID, youtu.be/ID, youtube.com/live/ID, youtube.com/embed/ID
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match ? match[1] : trimmed;
}

export default function LiveBroadcastManager() {
  const { userRole, showToast, openConfirmModal } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(INITIAL_DATA);
  const [activeViewerCount, setActiveViewerCount] = useState(0);
  const [rawVideoInput, setRawVideoInput] = useState('');
  const playerRef = useRef(null);
  const syncChannelRef = useRef(null);

  // Real-time live viewer presence
  useEffect(() => {
    const presenceChannel = supabase.channel('live_broadcast_presence');

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        let total = 0;
        for (const key in state) {
          total += state[key]?.length || 1;
        }
        setActiveViewerCount(total);
      })
      .subscribe();

    // WebSocket Broadcast Channel for sub-50ms sync to all viewers
    const syncChannel = supabase.channel('live_stream_sync_room', {
      config: { broadcast: { self: false } },
    });
    syncChannelRef.current = syncChannel;
    syncChannel.subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
      supabase.removeChannel(syncChannel);
    };
  }, []);

  // Fetch broadcast settings
  useEffect(() => {
    (async () => {
      try {
        const { data: broadcast, error } = await supabase
          .from('live_broadcast')
          .select('*')
          .eq('id', 1)
          .single();

        if (error) {
          showToast?.('error', 'Failed to load broadcast settings.');
          setLoading(false);
          return;
        }

        if (broadcast) {
          const dateObj = broadcast.next_scheduled_time ? new Date(broadcast.next_scheduled_time) : null;
          const localDateTime = dateObj
            ? new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
            : '';

          setData({
            is_live: broadcast.is_live ?? false,
            video_id: broadcast.video_id || '',
            next_scheduled_time: localDateTime,
            next_title: broadcast.next_title || '',
            sermon_title: broadcast.sermon_title || '',
            speaker_name: broadcast.speaker_name || '',
            description: broadcast.description || '',
            pdf_url: broadcast.pdf_url || '',
            current_video_time: broadcast.current_video_time || 0,
          });
          setRawVideoInput(broadcast.video_id || '');
        }
      } catch (err) {
        showToast?.('error', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  const handleVideoInputChange = (e) => {
    const val = e.target.value;
    setRawVideoInput(val);
    const extracted = extractYouTubeId(val);
    setData((prev) => ({ ...prev, video_id: extracted }));
  };

  const setField = (key) => (e) => {
    setData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = async () => {
    const normalizedVideoId = extractYouTubeId(data.video_id.trim());
    const isValidVideoId = normalizedVideoId === '' || /^[A-Za-z0-9_-]{11}$/.test(normalizedVideoId);

    if (!isValidVideoId) {
      showToast?.('error', 'Please enter a valid 11-character YouTube video ID, or leave it empty.');
      return;
    }

    setSaving(true);
    const isoDate = data.next_scheduled_time ? new Date(data.next_scheduled_time).toISOString() : null;

    try {
      const { error } = await supabase
        .from('live_broadcast')
        .update({
          video_id: normalizedVideoId,
          next_scheduled_time: isoDate,
          next_title: data.next_title.trim(),
          sermon_title: data.sermon_title.trim(),
          speaker_name: data.speaker_name.trim(),
          description: data.description.trim(),
          pdf_url: data.pdf_url.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);

      if (error) throw error;
      showToast?.('success', 'Broadcast settings saved successfully!');
    } catch (err) {
      showToast?.('error', `Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLive = () => {
    const nextState = !data.is_live;

    openConfirmModal?.({
      title: nextState ? 'Go Live to All Viewers?' : 'Turn Off Live Broadcast?',
      message: nextState
        ? 'Activating Live will spotlight the broadcast on the Home Notice Board and enable the live player for all visitors immediately.'
        : 'Turning off Live will transition all active viewers to the offline countdown screen.',
      confirmText: nextState ? 'Turn Live ON' : 'Turn Live OFF',
      danger: !nextState,
      onConfirm: async () => {
        setData((prev) => ({ ...prev, is_live: nextState }));

        const { error } = await supabase
          .from('live_broadcast')
          .update({ is_live: nextState, updated_at: new Date().toISOString() })
          .eq('id', 1);

        if (error) {
          setData((prev) => ({ ...prev, is_live: !nextState }));
          throw error;
        }

        showToast?.('success', nextState ? '🔴 Broadcast is now LIVE for all visitors.' : '⚫ Broadcast turned OFFLINE.');
      },
    });
  };

  const broadcastAndSavePlayback = async (stateString, currentTime) => {
    const timeToSync = typeof currentTime === 'number'
      ? currentTime
      : (typeof playerRef.current?.getCurrentTime === 'function' ? playerRef.current.getCurrentTime() : 0);

    const syncPayload = {
      playback_state: stateString,
      current_video_time: timeToSync,
      last_sync_time: new Date().toISOString(),
    };

    // Instant WebSocket broadcast directly to all live viewers (< 50ms)
    try {
      if (syncChannelRef.current) {
        syncChannelRef.current.send({
          type: 'broadcast',
          event: 'player_sync',
          payload: syncPayload,
        });
      }
    } catch (err) {
      console.warn('Realtime sync broadcast notice:', err);
    }

    // Persist to DB for users joining or refreshing later
    try {
      await supabase
        .from('live_broadcast')
        .update(syncPayload)
        .eq('id', 1);
    } catch (err) {
      console.warn('DB sync update notice:', err);
    }
  };

  const handlePlayerStateChange = async (event) => {
    const ytState = event.data;
    // 1 = playing, 2 = paused, 0 = ended, 3 = buffering
    if (ytState !== 1 && ytState !== 2 && ytState !== 0 && ytState !== 3) return;

    const stateString = (ytState === 1 || ytState === 3) ? 'playing' : 'paused';
    const currentTime = typeof event.target.getCurrentTime === 'function' ? event.target.getCurrentTime() : 0;

    await broadcastAndSavePlayback(stateString, currentTime);
  };

  const copyLiveLink = () => {
    const liveUrl = `${window.location.origin}/live`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(liveUrl);
      showToast?.('success', 'Live stream URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '12px', color: 'var(--adm-text-muted)' }}>
        <Loader2 size={32} className="adm-spin" />
        <span>Loading broadcast control settings…</span>
      </div>
    );
  }

  const isValidId = data.video_id && /^[A-Za-z0-9_-]{11}$/.test(data.video_id);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '50px' }}>
      {/* ── Studio Header ── */}
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className={`adm-badge ${data.is_live ? 'adm-badge-live' : 'adm-badge-neutral'}`}>
              <span
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}
                className={data.is_live ? 'adm-pulse' : ''}
              />
              {data.is_live ? 'BROADCAST IS LIVE' : 'BROADCAST IS OFFLINE'}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--adm-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} /> {activeViewerCount} active {activeViewerCount === 1 ? 'viewer' : 'viewers'}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--adm-text-main)', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            Live Broadcast Studio
          </h1>
          <p style={{ color: 'var(--adm-text-muted)', margin: 0, fontSize: '0.95rem' }}>
            Master controls for YouTube stream playback, global sync, sermon information, and countdown scheduling.
          </p>
        </div>

        {/* Quick Share & Preview Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={copyLiveLink} className="adm-btn adm-btn-secondary" title="Copy public live link">
            <Copy size={16} /> Copy Public Link
          </button>

          <a
            href="/live"
            target="_blank"
            rel="noopener noreferrer"
            className="adm-btn adm-btn-secondary"
            title="Open viewer live page"
          >
            <ExternalLink size={16} /> Open Viewer Page
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="adm-btn adm-btn-primary"
            style={{ padding: '11px 22px' }}
          >
            {saving ? (
              <><Loader2 size={16} className="adm-spin" /> Saving…</>
            ) : (
              <><Save size={16} /> Save All Settings</>
            )}
          </button>
        </div>
      </div>

      {/* ── Studio Main Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '32px' }}>
        
        {/* ── LEFT COLUMN: Configuration Forms ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Master Live Switch Card */}
          <div
            className="adm-card"
            style={{
              background: data.is_live
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(20, 20, 24, 0.95) 100%)'
                : 'var(--adm-bg-card)',
              border: `1px solid ${data.is_live ? 'rgba(239, 68, 68, 0.4)' : 'var(--adm-border)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 28px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className={`adm-badge ${data.is_live ? 'adm-badge-live' : 'adm-badge-neutral'}`}>
                  {data.is_live ? 'GLOBAL STREAM ACTIVE' : 'OFFLINE MODE'}
                </span>
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: 'var(--adm-text-main)', fontWeight: 700 }}>
                Master Broadcast Status
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--adm-text-muted)' }}>
                {data.is_live
                  ? 'All site visitors currently see the LIVE beacon and synchronized stream.'
                  : 'Visitors currently see the offline screen and countdown.'}
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={handleToggleLive}
              title={data.is_live ? 'Click to turn offline' : 'Click to go live'}
              style={{
                position: 'relative',
                width: '64px',
                height: '34px',
                borderRadius: '17px',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background: data.is_live ? 'var(--adm-live)' : 'rgba(255, 255, 255, 0.15)',
                transition: 'background 0.25s ease',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: data.is_live ? '34px' : '4px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              />
            </button>
          </div>

          {/* Video Stream Settings */}
          <div className="adm-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: '14px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--adm-text-main)', fontWeight: 700 }}>
                1. Stream & YouTube Configuration
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--adm-text-muted)' }}>
                Paste any YouTube URL or 11-character video ID.
              </p>
            </div>

            {/* Smart Video ID Input */}
            <div className="adm-input-group">
              <label className="adm-label">
                <Video size={16} color="var(--adm-primary)" />
                YouTube Video ID or Full Link
              </label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. https://www.youtube.com/watch?v=jfKfPfyJRdk or jfKfPfyJRdk"
                value={rawVideoInput}
                onChange={handleVideoInputChange}
              />
              {data.video_id && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginTop: '4px' }}>
                  {isValidId ? (
                    <span style={{ color: 'var(--adm-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> Active Video ID: <strong style={{ color: '#fff' }}>{data.video_id}</strong>
                    </span>
                  ) : (
                    <span style={{ color: 'var(--adm-live)' }}>
                      ⚠️ Invalid ID detected ({data.video_id}). Must be 11 characters.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Sermon Title */}
            <div className="adm-input-group">
              <label className="adm-label">
                <Radio size={16} color="var(--adm-primary)" />
                Sermon Title (Sinhala) — Header Title
              </label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. සිද්ධියට එළඹීමම ප්‍රමාණවත් | අකම්පිත"
                value={data.sermon_title}
                onChange={setField('sermon_title')}
                style={{ fontFamily: 'var(--adm-font-sinhala)' }}
              />
            </div>

            {/* Speaker Monk */}
            <div className="adm-input-group">
              <label className="adm-label">
                <User size={16} color="var(--adm-primary)" />
                Venerable Speaker (Monk Name)
              </label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. පූජ්‍ය ගොතටුවේ රේවත හිමි"
                value={data.speaker_name}
                onChange={setField('speaker_name')}
                style={{ fontFamily: 'var(--adm-font-sinhala)' }}
              />
            </div>

            {/* Description */}
            <div className="adm-input-group">
              <label className="adm-label">
                <AlignLeft size={16} color="var(--adm-primary)" />
                Sermon Excerpt / Sutta Description
              </label>
              <textarea
                rows={3}
                className="adm-textarea"
                placeholder="දේශනාව පිළිබඳ කෙටි හැඳින්වීමක්..."
                value={data.description}
                onChange={setField('description')}
                style={{ fontFamily: 'var(--adm-font-sinhala)', lineHeight: 1.6 }}
              />
            </div>

            {/* PDF URL */}
            <div className="adm-input-group">
              <label className="adm-label">
                <FileText size={16} color="var(--adm-primary)" />
                Related Sutta PDF Download URL (Optional)
              </label>
              <input
                type="url"
                className="adm-input"
                placeholder="https://drive.google.com/... or https://.../sutta.pdf"
                value={data.pdf_url}
                onChange={setField('pdf_url')}
              />
            </div>
          </div>

          {/* Schedule Settings */}
          <div className="adm-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: '14px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--adm-text-main)', fontWeight: 700 }}>
                2. Offline Schedule & Countdown
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--adm-text-muted)' }}>
                Displayed to visitors on `/live` when the stream is offline.
              </p>
            </div>

            <div className="adm-input-group">
              <label className="adm-label">
                <Clock size={16} color="var(--adm-warning)" />
                Next Scheduled Sermon Title
              </label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. ධම්මචක්ක පවත්තන සූත්‍ර දේශනාව"
                value={data.next_title}
                onChange={setField('next_title')}
                style={{ fontFamily: 'var(--adm-font-sinhala)' }}
              />
            </div>

            <div className="adm-input-group">
              <label className="adm-label">
                <Clock size={16} color="var(--adm-warning)" />
                Next Scheduled Date & Time
              </label>
              <input
                type="datetime-local"
                className="adm-input"
                value={data.next_scheduled_time}
                onChange={setField('next_scheduled_time')}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Master Preview Player Studio ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="adm-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={18} color="var(--adm-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--adm-text-main)', fontWeight: 700 }}>
                  Master Video Player
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="adm-badge adm-badge-info" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
                  <Eye size={12} /> {activeViewerCount} Viewers
                </span>
                {data.is_live && (
                  <span className="adm-badge adm-badge-live" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} className="adm-pulse" />
                    SYNC ON
                  </span>
                )}
              </div>
            </div>

            {/* Video Player Box */}
            <div
              style={{
                background: '#000',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--adm-border)',
                position: 'relative',
              }}
            >
              {isValidId ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <YouTube
                    videoId={data.video_id.trim()}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 0,
                        controls: 1,
                        modestbranding: 1,
                        rel: 0,
                        start: Math.floor(data.current_video_time || 0),
                      },
                    }}
                    onReady={(e) => {
                      playerRef.current = e.target;
                    }}
                    onStateChange={handlePlayerStateChange}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                </div>
              ) : (
                <div style={{ padding: '70px 20px', textAlign: 'center', color: 'var(--adm-text-muted)' }}>
                  <Video size={44} style={{ opacity: 0.25, margin: '0 auto 12px auto' }} />
                  <div style={{ fontSize: '0.95rem' }}>Enter a valid YouTube Video ID or URL to initialize the player</div>
                </div>
              )}
            </div>

            {/* Direct Master Control Buttons */}
            {isValidId && (
              <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={async () => {
                    if (playerRef.current) {
                      playerRef.current.pauseVideo();
                      const curr = typeof playerRef.current.getCurrentTime === 'function' ? playerRef.current.getCurrentTime() : 0;
                      await broadcastAndSavePlayback('paused', curr);
                      showToast?.('success', '⏸️ Broadcast PAUSED for all viewers instantly!');
                    }
                  }}
                  className="adm-btn adm-btn-danger"
                  style={{ padding: '12px', borderRadius: '10px' }}
                >
                  <Pause size={17} /> Pause Viewers
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (playerRef.current) {
                      playerRef.current.playVideo();
                      const curr = typeof playerRef.current.getCurrentTime === 'function' ? playerRef.current.getCurrentTime() : 0;
                      await broadcastAndSavePlayback('playing', curr);
                      showToast?.('success', '▶️ Broadcast PLAYING for all viewers!');
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Play size={17} /> Resume Viewers
                </button>
              </div>
            )}
          </div>

          {/* Sync Behavior Instructions */}
          <div className="adm-card" style={{ fontSize: '0.88rem', color: 'var(--adm-text-muted)', lineHeight: 1.7 }}>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--adm-text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--adm-gold)" /> How Master Watch-Party Sync Operates
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                You control the Master player. Viewers have no individual play/pause control on their screen.
              </li>
              <li>
                When you <strong>pause</strong> or <strong>seek</strong>, all viewers receive sub-50ms WebSocket commands to sync immediately.
              </li>
              <li>
                Late-joining visitors automatically start playing from your current broadcast second.
              </li>
              <li>
                Ensure you click <strong>Save All Settings</strong> before flipping the Live switch ON.
              </li>
            </ul>
          </div>

          {/* Live Viewer Telemetry Inspector */}
          <div className="adm-card">
            <h4 style={{ margin: '0 0 14px 0', color: 'var(--adm-text-main)', fontSize: '0.95rem' }}>
              Current Broadcast Metadata Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--adm-border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--adm-text-dim)' }}>Title:</span>
                <span style={{ color: 'var(--adm-text-main)', fontWeight: 600, fontFamily: 'var(--adm-font-sinhala)' }}>
                  {data.sermon_title || '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--adm-border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--adm-text-dim)' }}>Speaker:</span>
                <span style={{ color: 'var(--adm-gold)', fontWeight: 600, fontFamily: 'var(--adm-font-sinhala)' }}>
                  {data.speaker_name || '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--adm-border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--adm-text-dim)' }}>PDF Notes:</span>
                <span style={{ color: data.pdf_url ? 'var(--adm-success)' : 'var(--adm-text-dim)' }}>
                  {data.pdf_url ? 'Configured' : 'None'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--adm-text-dim)' }}>Live Stream Status:</span>
                <span style={{ color: data.is_live ? 'var(--adm-live)' : 'var(--adm-text-muted)', fontWeight: 700 }}>
                  {data.is_live ? '🔴 BROADCAST ACTIVE' : '⚫ OFFLINE'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
