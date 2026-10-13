import { useState, useEffect, useRef, useCallback } from 'react';
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

// Robust Helper: Auto-extract 11-character YouTube video ID from any link or format
function extractYouTubeId(urlOrId) {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match ? match[1] : trimmed;
}

export default function LiveBroadcastManager() {
  const context = useOutletContext() || {};
  const { userRole, showToast: contextToast, openConfirmModal: contextConfirm } = context;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(INITIAL_DATA);
  const [activeViewerCount, setActiveViewerCount] = useState(0);
  const [rawVideoInput, setRawVideoInput] = useState('');
  const [localToast, setLocalToast] = useState(null);

  const playerRef = useRef(null);
  const syncChannelRef = useRef(null);

  // Resilient Toast helper (uses parent toast if available, or falls back to local toast)
  const notify = useCallback((type, message) => {
    if (contextToast) {
      contextToast(type, message);
    } else {
      setLocalToast({ type, message });
      setTimeout(() => setLocalToast(null), 4000);
    }
  }, [contextToast]);

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

  // Fetch initial broadcast settings on mount
  useEffect(() => {
    (async () => {
      try {
        const { data: broadcast, error } = await supabase
          .from('live_broadcast')
          .select('*')
          .eq('id', 1)
          .single();

        if (error) {
          notify('error', 'Failed to load broadcast settings.');
          setLoading(false);
          return;
        }

        if (broadcast) {
          const dateObj = broadcast.next_scheduled_time ? new Date(broadcast.next_scheduled_time) : null;
          const localDateTime = dateObj && !isNaN(dateObj.getTime())
            ? new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
            : '';

          const cleanedId = extractYouTubeId(broadcast.video_id || '');

          setData({
            is_live: broadcast.is_live ?? false,
            video_id: cleanedId,
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
        notify('error', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      notify('error', 'Please enter a valid 11-character YouTube video ID or link.');
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
      notify('success', 'Broadcast settings saved successfully!');
    } catch (err) {
      notify('error', `Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const performToggleLive = async (nextState) => {
    setData((prev) => ({ ...prev, is_live: nextState }));

    try {
      const { error } = await supabase
        .from('live_broadcast')
        .update({ is_live: nextState, updated_at: new Date().toISOString() })
        .eq('id', 1);

      if (error) {
        setData((prev) => ({ ...prev, is_live: !nextState }));
        throw error;
      }

      notify('success', nextState ? '🔴 Broadcast is now LIVE for all visitors!' : '⚫ Broadcast turned OFFLINE.');
    } catch (err) {
      notify('error', `Failed to toggle live: ${err.message}`);
    }
  };

  const handleToggleLive = () => {
    const nextState = !data.is_live;

    if (contextConfirm) {
      contextConfirm({
        title: nextState ? 'Go Live to All Viewers?' : 'Turn Off Live Broadcast?',
        message: nextState
          ? 'Activating Live will spotlight the broadcast on the Home Notice Board and enable the live player for all visitors immediately.'
          : 'Turning off Live will transition all active viewers to the offline countdown screen.',
        confirmText: nextState ? 'Turn Live ON' : 'Turn Live OFF',
        danger: !nextState,
        onConfirm: () => performToggleLive(nextState),
      });
    } else {
      const msg = nextState
        ? 'Turn ON live broadcast? All visitors will see the LIVE stream immediately.'
        : 'Turn OFF live broadcast? All viewers will see the offline screen.';
      if (window.confirm(msg)) {
        performToggleLive(nextState);
      }
    }
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
      notify('success', 'Live stream URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '12px', color: 'var(--adm-text-muted)' }}>
        <Loader2 size={32} className="adm-spin" />
        <span>Loading broadcast control studio…</span>
      </div>
    );
  }

  const activeVideoId = extractYouTubeId(data.video_id);
  const hasValidVideo = Boolean(activeVideoId && activeVideoId.length === 11);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Local Fallback Toast */}
      {localToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 10001,
            background: localToast.type === 'success' ? '#064e3b' : '#7f1d1d',
            color: '#fff',
            padding: '12px 18px',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {localToast.message}
        </div>
      )}

      {/* ── Studio Header ── */}
      <div
        style={{
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className={`adm-badge ${data.is_live ? 'adm-badge-live' : 'adm-badge-neutral'}`}>
              <span
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}
                className={data.is_live ? 'adm-pulse' : ''}
              />
              {data.is_live ? 'BROADCAST IS LIVE NOW' : 'BROADCAST IS CURRENTLY OFFLINE'}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--adm-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} color="var(--adm-gold)" /> {activeViewerCount} active {activeViewerCount === 1 ? 'viewer' : 'viewers'}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--adm-text-main)', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            Live Broadcast Studio
          </h1>
          <p style={{ color: 'var(--adm-text-muted)', margin: 0, fontSize: '0.95rem' }}>
            Master controls for live YouTube streaming, viewer synchronization, and sermon broadcast management.
          </p>
        </div>

        {/* Quick Actions */}
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

      {/* ── SECTION 1: MASTER PREVIEW PLAYER & LIVE TOGGLE (TOP PROMINENCE) ── */}
      <div
        className="adm-card"
        style={{
          marginBottom: '32px',
          padding: '28px',
          background: data.is_live
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(20, 20, 24, 0.98) 100%)'
            : 'var(--adm-bg-card)',
          border: `1px solid ${data.is_live ? 'rgba(239, 68, 68, 0.4)' : 'var(--adm-border)'}`,
        }}
      >
        {/* Master Live Switch Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--adm-border)',
            paddingBottom: '20px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className={`adm-badge ${data.is_live ? 'adm-badge-live' : 'adm-badge-neutral'}`}>
                {data.is_live ? 'GLOBAL STREAM IS ACTIVE' : 'STREAM IS OFFLINE'}
              </span>
            </div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: 'var(--adm-text-main)', fontWeight: 700 }}>
              Master Live Broadcast Switch
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--adm-text-muted)' }}>
              {data.is_live
                ? 'Visitors at /live and on the Home Notice Board are seeing this live broadcast.'
                : 'Visitors currently see the offline screen and countdown.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: data.is_live ? 'var(--adm-live)' : 'var(--adm-text-muted)' }}>
              {data.is_live ? 'LIVE ON' : 'OFFLINE'}
            </span>
            <button
              onClick={handleToggleLive}
              title={data.is_live ? 'Click to turn offline' : 'Click to go live'}
              style={{
                position: 'relative',
                width: '68px',
                height: '36px',
                borderRadius: '18px',
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
                  left: data.is_live ? '36px' : '4px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              />
            </button>
          </div>
        </div>

        {/* Master Player Box */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* Video Player Display */}
          <div style={{ flex: 1 }}>
            <div
              className="adm-yt-container"
              style={{
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                border: '1px solid var(--adm-border)',
              }}
            >
              {hasValidVideo ? (
                <YouTube
                  videoId={activeVideoId}
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
                  className="adm-yt-wrapper"
                  iframeClassName="adm-yt-iframe"
                  onReady={(e) => {
                    playerRef.current = e.target;
                  }}
                  onStateChange={handlePlayerStateChange}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--adm-text-muted)',
                  }}
                >
                  <Video size={48} style={{ opacity: 0.25, marginBottom: '12px' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--adm-text-main)' }}>
                    No Video Stream Configured
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>
                    Enter a YouTube Video ID or URL in the form below to initialize the player preview.
                  </p>
                </div>
              )}
            </div>

            {/* Direct Master Control Buttons */}
            {hasValidVideo && (
              <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={async () => {
                    if (playerRef.current) {
                      playerRef.current.pauseVideo();
                      const curr = typeof playerRef.current.getCurrentTime === 'function' ? playerRef.current.getCurrentTime() : 0;
                      await broadcastAndSavePlayback('paused', curr);
                      notify('success', '⏸️ Broadcast PAUSED for all viewers instantly!');
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
                      notify('success', '▶️ Broadcast PLAYING for all viewers!');
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

          {/* Player Quick Info & Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--adm-border-subtle)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--adm-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--adm-gold)" /> Master Watch-Party Synchronization
              </h4>
              <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--adm-text-muted)', fontSize: '0.84rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>This Master player commands all viewers' screens in real time.</li>
                <li>When you <strong>pause</strong>, viewers are paused at the exact timestamp.</li>
                <li>When you <strong>seek</strong>, all viewers jump to your timestamp via WebSocket.</li>
                <li>Late-joining visitors automatically sync to your current broadcast frame.</li>
              </ul>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--adm-border-subtle)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--adm-text-dim)' }}>Video ID:</span>
                <span style={{ color: '#fff', fontWeight: 600, fontFamily: 'monospace' }}>
                  {activeVideoId || 'Not configured'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--adm-text-dim)' }}>Sermon Title:</span>
                <span style={{ color: 'var(--adm-text-main)', fontWeight: 600, fontFamily: 'var(--adm-font-sinhala)' }}>
                  {data.sermon_title || '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--adm-text-dim)' }}>Speaker:</span>
                <span style={{ color: 'var(--adm-gold)', fontWeight: 600, fontFamily: 'var(--adm-font-sinhala)' }}>
                  {data.speaker_name || '—'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 2: METADATA & SCHEDULE CONFIGURATION FORMS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Stream & Sermon Details */}
        <div className="adm-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: '14px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--adm-text-main)', fontWeight: 700 }}>
              Video Stream & Metadata
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--adm-text-muted)' }}>
              Configure the YouTube stream, title, speaker, and Sutta study material.
            </p>
          </div>

          {/* YouTube Video ID / Link */}
          <div className="adm-input-group">
            <label className="adm-label">
              <Video size={16} color="var(--adm-primary)" />
              YouTube Video ID or Full Link *
            </label>
            <input
              type="text"
              className="adm-input"
              placeholder="e.g. -DueZe1zuDo or https://www.youtube.com/watch?v=-DueZe1zuDo"
              value={rawVideoInput}
              onChange={handleVideoInputChange}
            />
            {data.video_id && (
              <div style={{ fontSize: '0.8rem', marginTop: '2px', color: hasValidVideo ? 'var(--adm-success)' : 'var(--adm-live)' }}>
                {hasValidVideo ? `✓ Extracted Video ID: ${activeVideoId}` : '⚠️ Video ID must be 11 characters'}
              </div>
            )}
          </div>

          {/* Sermon Title */}
          <div className="adm-input-group">
            <label className="adm-label">
              <Radio size={16} color="var(--adm-primary)" />
              Sermon Title (Sinhala)
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
              Sutta Excerpt / Description
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
              Related Sutta PDF Download URL
            </label>
            <input
              type="url"
              className="adm-input"
              placeholder="https://drive.google.com/... or https://tipitaka.lk/..."
              value={data.pdf_url}
              onChange={setField('pdf_url')}
            />
          </div>
        </div>

        {/* Offline Schedule & Next Session */}
        <div className="adm-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid var(--adm-border)', paddingBottom: '14px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--adm-text-main)', fontWeight: 700 }}>
              Offline Schedule & Countdown
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--adm-text-muted)' }}>
              Displayed to visitors when the live broadcast is offline.
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

          <div
            style={{
              marginTop: 'auto',
              paddingTop: '20px',
              borderTop: '1px solid var(--adm-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <button
              onClick={handleSave}
              disabled={saving}
              className="adm-btn adm-btn-primary"
              style={{ padding: '14px', width: '100%' }}
            >
              {saving ? (
                <><Loader2 size={18} className="adm-spin" /> Saving Settings…</>
              ) : (
                <><Save size={18} /> Save All Broadcast Settings</>
              )}
            </button>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--adm-text-dim)', textAlign: 'center' }}>
              Ensure settings are saved before flipping the Live switch ON.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
