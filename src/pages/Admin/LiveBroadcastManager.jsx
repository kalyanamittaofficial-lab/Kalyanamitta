import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Radio, Save, Clock, Video } from 'lucide-react';
import YouTube from 'react-youtube';

export default function LiveBroadcastManager() {
  const [loading, setLoading] = useState(false);
  const [player, setPlayer] = useState(null);
  const [data, setData] = useState({
    is_live: false,
    video_id: '',
    next_scheduled_time: '',
    next_title: ''
  });

  useEffect(() => {
    supabase
      .from('live_broadcast')
      .select('is_live, video_id, next_scheduled_time, next_title, current_video_time')
      .eq('id', 1)
      .single()
      .then(({ data: broadcast, error }) => {
        if (error) {
          console.error('Failed to load live broadcast settings:', error);
          return;
        }

        if (broadcast) {
          const dateObj = broadcast.next_scheduled_time ? new Date(broadcast.next_scheduled_time) : new Date();
          const localDateTime = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

          setData({
            is_live: broadcast.is_live,
            video_id: broadcast.video_id || '',
            next_scheduled_time: broadcast.next_scheduled_time ? localDateTime : '',
            next_title: broadcast.next_title || '',
            current_video_time: broadcast.current_video_time || 0
          });
        }
      });
  }, []);

  const handleSave = async () => {
    const normalizedVideoId = data.video_id.trim();
    const isValidVideoId = /^[A-Za-z0-9_-]{11}$/.test(normalizedVideoId);

    if ((data.is_live || normalizedVideoId) && !isValidVideoId) {
      alert('Please enter a valid 11-character YouTube video ID.');
      return;
    }

    setLoading(true);
    const isoDate = data.next_scheduled_time ? new Date(data.next_scheduled_time).toISOString() : null;

    const { error } = await supabase
      .from('live_broadcast')
      .update({
        is_live: data.is_live,
        video_id: normalizedVideoId,
        next_scheduled_time: isoDate,
        next_title: data.next_title,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

      setLoading(false);
    if (error) {
      alert('Failed to update live settings');
      console.error(error);
    } else {
      alert('Live broadcast settings updated successfully!');
    }
  };

  const handlePlayerStateChange = async (event) => {
    const ytState = event.data;
    let stateString = 'paused';
    if (ytState === 1 || ytState === 3) stateString = 'playing';
    else if (ytState === 2 || ytState === 0) stateString = 'paused';
    else return;
    
    const currentTime = await event.target.getCurrentTime();

    await supabase
      .from('live_broadcast')
      .update({
        playback_state: stateString,
        current_video_time: currentTime,
        last_sync_time: new Date().toISOString()
      })
      .eq('id', 1);
  };

  const handleToggleLive = async (e) => {
    const isChecked = e.target.checked;
    const confirmMessage = isChecked 
      ? "Are you sure you want to turn ON the live broadcast? This will show the LIVE indicator to all visitors."
      : "Are you sure you want to turn OFF the live broadcast? This will immediately disconnect all current viewers.";
    
    if (window.confirm(confirmMessage)) {
      setData({...data, is_live: isChecked});
      
      // Instantly save to DB
      await supabase
        .from('live_broadcast')
        .update({
          is_live: isChecked,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', padding: '40px 20px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2rem', margin: '0 0 8px 0' }}>
          <Radio size={32} color="var(--primary)" /> Live Broadcast Control Panel
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.05rem' }}>
          Manage global live streams, sync master playback, and configure watch parties.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
        
        {/* LEFT: Control Form */}
        <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
        
        {/* Master Switch */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderRadius: '12px', background: data.is_live ? 'rgba(220, 38, 38, 0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${data.is_live ? 'rgba(220, 38, 38, 0.2)' : 'var(--glass-border)'}` }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 6px 0', color: data.is_live ? '#dc2626' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {data.is_live ? <><div style={{width: 8, height: 8, borderRadius: '50%', background: '#dc2626', boxShadow: '0 0 10px #dc2626'}}></div> BROADCAST IS LIVE</> : <><div style={{width: 8, height: 8, borderRadius: '50%', background: '#666'}}></div> BROADCAST IS OFFLINE</>}
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {data.is_live ? 'Global visibility is ON. Users are synchronized.' : 'Global visibility is OFF.'}
            </p>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '30px' }}>
            <input 
              type="checkbox" 
              checked={data.is_live}
              onChange={handleToggleLive}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: data.is_live ? '#dc2626' : 'rgba(255,255,255,0.1)',
              transition: '.4s', borderRadius: '34px', border: data.is_live ? 'none' : '1px solid rgba(255,255,255,0.2)'
            }}>
              <span style={{
                position: 'absolute', content: '""', height: '22px', width: '22px',
                left: data.is_live ? '30px' : '3px', bottom: '3px',
                backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }} />
            </span>
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Video ID Input */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '0.02em' }}>
              <Video size={18} color="var(--text-muted)" /> YouTube Live Video ID
            </label>
            <input 
              type="text" 
              value={data.video_id}
              onChange={e => setData({...data, video_id: e.target.value})}
              placeholder="e.g., jfKfPfyJRdk"
              style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', fontSize: '1rem', transition: 'border-color 0.3s', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Extract the ID from the YouTube link. (e.g., youtube.com/watch?v=<strong style={{color: 'var(--text-main)'}}>jfKfPfyJRdk</strong>)
            </p>
          </div>

          {/* Next Scheduled Title */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '0.02em' }}>
              <Radio size={18} color="var(--text-muted)" /> Next Session Title
            </label>
            <input 
              type="text" 
              value={data.next_title}
              onChange={e => setData({...data, next_title: e.target.value})}
              placeholder="e.g., ධම්මචක්ක පවත්තන සූත්‍ර දේශනාව"
              style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', fontSize: '1rem', transition: 'border-color 0.3s', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          {/* Next Scheduled Time */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '0.02em' }}>
              <Clock size={18} color="var(--text-muted)" /> Next Scheduled Time
            </label>
            <input 
              type="datetime-local" 
              value={data.next_scheduled_time}
              onChange={e => setData({...data, next_scheduled_time: e.target.value})}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', fontSize: '1rem', transition: 'border-color 0.3s', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              This will be used to show the countdown timer on the broadcast page when offline.
            </p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          style={{
            marginTop: '8px',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            padding: '16px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: '0.03em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(140, 21, 21, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(140, 21, 21, 0.5)'; } }}
          onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(140, 21, 21, 0.4)'; } }}
        >
          <Save size={20} /> {loading ? 'Saving...' : 'Save Settings'}
        </button>

      </div>

      {/* RIGHT: Live Preview Screen */}
      <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Video size={20} color="var(--text-muted)" /> Master Preview Player
          </h3>
          {data.is_live && (
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#dc2626', background: 'rgba(220, 38, 38, 0.1)', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{width: 6, height: 6, borderRadius: '50%', background: '#dc2626', animation: 'pulse 2s infinite'}}></div>
              SYNC ACTIVE
            </span>
          )}
        </div>
        
        <div style={{ width: '100%', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {data.video_id ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <YouTube 
                videoId={data.video_id}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    start: Math.floor(data.current_video_time || 0)
                  }
                }}
                onReady={(e) => setPlayer(e.target)}
                onStateChange={handlePlayerStateChange}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Video size={48} style={{ opacity: 0.2 }} />
              <span>Enter a Video ID to see preview</span>
            </div>
          )}
        </div>

        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <p style={{ margin: '0 0 12px 0', fontWeight: '600', color: 'var(--text-main)', letterSpacing: '0.02em' }}>How Watch Party works:</p>
          <ul style={{ margin: 0, paddingLeft: '24px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>You (the Admin) are the Master. Viewers cannot pause, rewind, or skip.</li>
            <li>If you Pause the video here, it pauses for all viewers instantly.</li>
            <li>If you seek to a new time, all viewers instantly jump to that exact time.</li>
            <li>Viewers joining late will automatically synchronize to your current playback time.</li>
          </ul>
        </div>
      </div>

    </div>
    </div>
  );
}
