import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/supabase';
import { Radio, Save, Clock, Video, User, FileText, AlignLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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

function InputField({ label, icon, children, hint }) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '0.02em' }}>
        {icon} {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: `1px solid ${focused ? 'var(--primary)' : 'var(--glass-border)'}`,
        background: 'rgba(0,0,0,0.15)',
        color: 'var(--text-main)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
      }}
    />
  );
}

function TextareaInput({ value, onChange, placeholder, rows = 3 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: `1px solid ${focused ? 'var(--primary)' : 'var(--glass-border)'}`,
        background: 'rgba(0,0,0,0.15)',
        color: 'var(--text-main)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        resize: 'vertical',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
      }}
    />
  );
}

export default function LiveBroadcastManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
  const [data, setData] = useState(INITIAL_DATA);
  const playerRef = useRef(null);

  // Show toast then auto-hide
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const set = (key) => (e) => setData((prev) => ({ ...prev, [key]: e.target.value }));

  useEffect(() => {
    (async () => {
      const { data: broadcast, error } = await supabase
        .from('live_broadcast')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        showToast('error', 'Failed to load broadcast settings.');
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
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    const normalizedVideoId = data.video_id.trim();
    const isValidVideoId = normalizedVideoId === '' || /^[A-Za-z0-9_-]{11}$/.test(normalizedVideoId);

    if (!isValidVideoId) {
      showToast('error', 'Please enter a valid 11-character YouTube video ID, or leave it empty.');
      return;
    }

    setSaving(true);
    const isoDate = data.next_scheduled_time ? new Date(data.next_scheduled_time).toISOString() : null;

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

    setSaving(false);
    if (error) {
      showToast('error', `Failed to save: ${error.message}`);
    } else {
      showToast('success', 'Broadcast settings saved successfully!');
    }
  };

  const handleToggleLive = async () => {
    const next = !data.is_live;
    const msg = next
      ? 'Turn ON live broadcast? All visitors will see the LIVE indicator immediately.'
      : 'Turn OFF live broadcast? All viewers will be disconnected immediately.';

    if (!window.confirm(msg)) return;

    setData((prev) => ({ ...prev, is_live: next }));

    const { error } = await supabase
      .from('live_broadcast')
      .update({ is_live: next, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (error) {
      setData((prev) => ({ ...prev, is_live: !next })); // revert
      showToast('error', 'Failed to toggle live status.');
    } else {
      showToast('success', next ? '🔴 Broadcast is now LIVE.' : '⚫ Broadcast turned OFF.');
    }
  };

  const handlePlayerStateChange = async (event) => {
    const ytState = event.data;
    // 1 = playing, 2 = paused, 0 = ended, 3 = buffering
    if (ytState !== 1 && ytState !== 2 && ytState !== 0) return;

    const stateString = ytState === 1 || ytState === 3 ? 'playing' : 'paused';
    const currentTime = event.target.getCurrentTime();

    await supabase
      .from('live_broadcast')
      .update({
        playback_state: stateString,
        current_video_time: currentTime,
        last_sync_time: new Date().toISOString(),
      })
      .eq('id', 1);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '12px', color: 'var(--text-muted)' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <span>Loading broadcast settings…</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', padding: '40px 20px', position: 'relative' }}>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '12px',
          background: toast.type === 'success' ? 'rgba(22, 163, 74, 0.95)' : 'rgba(220, 38, 38, 0.95)',
          color: '#fff', padding: '14px 20px', borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
          fontSize: '0.95rem', fontWeight: 500, maxWidth: '360px',
        }}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '40px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2rem', margin: '0 0 8px 0' }}>
          <Radio size={32} color="var(--primary)" /> Live Broadcast Control Panel
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem' }}>
          Manage live streams, watch-party sync, scheduled countdowns, and all viewer-facing content.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>

        {/* ─── LEFT: Control Form ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Master On/Off Toggle */}
          <div style={{
            background: 'var(--bg-secondary)', padding: '28px', borderRadius: '16px',
            border: `1px solid ${data.is_live ? 'rgba(220,38,38,0.35)' : 'var(--glass-border)'}`,
            transition: 'border-color 0.3s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 6px 0', color: data.is_live ? '#dc2626' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: data.is_live ? '#dc2626' : '#555', boxShadow: data.is_live ? '0 0 8px #dc2626' : 'none', transition: 'all 0.3s' }} />
                  {data.is_live ? 'BROADCAST IS LIVE' : 'BROADCAST IS OFFLINE'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {data.is_live ? 'All visitors can see the LIVE player and indicator.' : 'Visitors see the countdown / offline screen.'}
                </p>
              </div>
              {/* Toggle Switch */}
              <button
                onClick={handleToggleLive}
                title={data.is_live ? 'Click to go Offline' : 'Click to go Live'}
                style={{
                  position: 'relative', width: '56px', height: '30px', borderRadius: '15px',
                  border: 'none', cursor: 'pointer', padding: 0,
                  background: data.is_live ? '#dc2626' : 'rgba(120,120,120,0.3)',
                  transition: 'background 0.3s', flexShrink: 0,
                }}
              >
                <span style={{
                  position: 'absolute', top: '4px',
                  left: data.is_live ? '28px' : '4px',
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: '#fff', transition: 'left 0.3s',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }} />
              </button>
            </div>
          </div>

          {/* Content Settings Card */}
          <div style={{ background: 'var(--bg-secondary)', padding: '28px', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700 }}>📺 Video Settings</h3>

            <InputField
              label="YouTube Video ID"
              icon={<Video size={16} color="var(--text-muted)" />}
              hint={<>Extract from the YouTube URL. e.g., youtube.com/watch?v=<strong style={{ color: 'var(--text-main)' }}>jfKfPfyJRdk</strong>. Leave empty if not set yet.</>}
            >
              <TextInput
                value={data.video_id}
                onChange={set('video_id')}
                placeholder="e.g., jfKfPfyJRdk"
              />
            </InputField>

            <InputField
              label="Sermon Title (Sinhala) — shown in Live player header"
              icon={<Radio size={16} color="var(--text-muted)" />}
              hint="Displayed as the main title inside the immersive live viewer."
            >
              <TextInput
                value={data.sermon_title}
                onChange={set('sermon_title')}
                placeholder="e.g., සජීවී ධර්ම දේශනාව"
              />
            </InputField>

            <InputField
              label="Speaker / Monk Name — shown below the title"
              icon={<User size={16} color="var(--text-muted)" />}
              hint="Displayed as a subtitle in the live viewer (e.g., monk's name)."
            >
              <TextInput
                value={data.speaker_name}
                onChange={set('speaker_name')}
                placeholder="e.g., පූජ්‍ය අගලකඩ සිරිසුමන නාහිමි"
              />
            </InputField>

            <InputField
              label="Session Description"
              icon={<AlignLeft size={16} color="var(--text-muted)" />}
              hint="Optional short description shown on the broadcast landing page."
            >
              <TextareaInput
                value={data.description}
                onChange={set('description')}
                placeholder="e.g., ධම්මචක්ක සූත්‍රය ඇසුරෙන් ආර්ය අෂ්ටාංගික මාර්ගය..."
              />
            </InputField>

            <InputField
              label="Related PDF / Sutta Download URL"
              icon={<FileText size={16} color="var(--text-muted)" />}
              hint="Direct link to a PDF (Google Drive, Supabase Storage, etc.). Shown in the live player as a download button."
            >
              <TextInput
                value={data.pdf_url}
                onChange={set('pdf_url')}
                placeholder="https://example.com/sutta.pdf"
              />
            </InputField>
          </div>

          {/* Schedule Card */}
          <div style={{ background: 'var(--bg-secondary)', padding: '28px', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700 }}>📅 Schedule (Offline Countdown)</h3>

            <InputField
              label="Next Session Title — shown on countdown screen"
              icon={<Radio size={16} color="var(--text-muted)" />}
            >
              <TextInput
                value={data.next_title}
                onChange={set('next_title')}
                placeholder="e.g., ධම්මචක්ක පවත්තන සූත්‍ර දේශනාව"
              />
            </InputField>

            <InputField
              label="Next Scheduled Date & Time"
              icon={<Clock size={16} color="var(--text-muted)" />}
              hint="When offline, a live countdown is shown to visitors until this time."
            >
              <TextInput
                value={data.next_scheduled_time}
                onChange={set('next_scheduled_time')}
                type="datetime-local"
              />
            </InputField>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? 'rgba(140,21,21,0.5)' : 'var(--primary)',
              color: '#fff', border: 'none', padding: '16px 24px',
              borderRadius: '12px', fontWeight: 700, fontSize: '1rem',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: '10px', cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : '0 4px 14px rgba(140,21,21,0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {saving
              ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
              : <><Save size={20} /> Save All Settings</>
            }
          </button>
        </div>

        {/* ─── RIGHT: Master Preview Player ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '28px', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Video size={20} color="var(--text-muted)" /> Master Preview Player
              </h3>
              {data.is_live && (
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', background: 'rgba(220,38,38,0.1)', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(220,38,38,0.3)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', animation: 'pulse 2s infinite' }} />
                  SYNC ACTIVE
                  <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }`}</style>
                </span>
              )}
            </div>

            <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              {data.video_id.trim() ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <YouTube
                    videoId={data.video_id.trim()}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: { autoplay: 0, controls: 1, modestbranding: 1, rel: 0, start: Math.floor(data.current_video_time || 0) },
                    }}
                    onReady={(e) => { playerRef.current = e.target; }}
                    onStateChange={handlePlayerStateChange}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                </div>
              ) : (
                <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <Video size={48} style={{ opacity: 0.2 }} />
                  <span style={{ fontSize: '0.95rem' }}>Enter a Video ID above to see the preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Watch Party Instructions */}
          <div style={{ background: 'var(--bg-secondary)', padding: '24px 28px', borderRadius: '16px', border: '1px solid var(--glass-border)', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
            <p style={{ margin: '0 0 14px 0', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              🎭 How Watch-Party Sync Works
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>You (Admin) control the Master player above. Viewers cannot pause, seek, or rewind.</li>
              <li>When you <strong>pause</strong>, all viewers are instantly paused at the same frame.</li>
              <li>When you <strong>seek</strong>, all viewers jump to that exact timestamp.</li>
              <li>Viewers joining late automatically sync to your current playback position.</li>
              <li>Toggle <strong>LIVE ON</strong> only after setting the Video ID and saving settings.</li>
            </ul>
          </div>

          {/* Live Viewer Content Preview */}
          <div style={{ background: 'var(--bg-secondary)', padding: '24px 28px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <p style={{ margin: '0 0 16px 0', fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>
              👁 What Viewers See
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--text-muted)', minWidth: '120px' }}>Player Title:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{data.sermon_title || <em style={{ opacity: 0.5 }}>Not set</em>}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--text-muted)', minWidth: '120px' }}>Speaker:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{data.speaker_name || <em style={{ opacity: 0.5 }}>Not set</em>}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--text-muted)', minWidth: '120px' }}>PDF Download:</span>
                <span style={{ color: data.pdf_url ? '#16a34a' : 'var(--text-muted)', fontWeight: 500 }}>
                  {data.pdf_url ? '✓ URL configured' : <em style={{ opacity: 0.5 }}>Not set (button hidden)</em>}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--text-muted)', minWidth: '120px' }}>Countdown:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                  {data.next_title && data.next_scheduled_time
                    ? `${data.next_title} @ ${new Date(data.next_scheduled_time).toLocaleString()}`
                    : <em style={{ opacity: 0.5 }}>Not configured</em>
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
