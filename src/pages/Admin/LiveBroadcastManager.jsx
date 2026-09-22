import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Radio, Save, Clock, Video } from 'lucide-react';

export default function LiveBroadcastManager() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    is_live: false,
    video_id: '',
    next_scheduled_time: '',
    next_title: ''
  });

  useEffect(() => {
    supabase
      .from('live_broadcast')
      .select('is_live, video_id, next_scheduled_time, next_title')
      .eq('id', 1)
      .single()
      .then(({ data: broadcast, error }) => {
        if (error) {
          console.error('Failed to load live broadcast settings:', error);
          return;
        }

        if (broadcast) {
          // Format datetime for input type="datetime-local"
          const dateObj = broadcast.next_scheduled_time ? new Date(broadcast.next_scheduled_time) : new Date();
          // Adjust to local time format YYYY-MM-DDTHH:mm
          const localDateTime = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

          setData({
            is_live: broadcast.is_live,
            video_id: broadcast.video_id || '',
            next_scheduled_time: broadcast.next_scheduled_time ? localDateTime : '',
            next_title: broadcast.next_title || ''
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
    // Convert local datetime back to UTC ISO for Supabase
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

  return (
    <div style={{ maxWidth: '800px', padding: '20px' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Radio color="var(--primary)" /> Live Broadcast Control Panel
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Control what viewers see on the /live broadcast page and header indicators.
      </p>

      <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Is Live Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 8px 0', color: data.is_live ? '#dc2626' : 'var(--text-main)' }}>
              {data.is_live ? '🔴 BROADCAST IS LIVE' : '⚪ BROADCAST IS OFFLINE'}
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Turn this on to show the pulsing LIVE button on the main website header.
            </p>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
            <input 
              type="checkbox" 
              checked={data.is_live}
              onChange={e => setData({...data, is_live: e.target.checked})}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: data.is_live ? '#dc2626' : '#ccc',
              transition: '.4s', borderRadius: '34px'
            }}>
              <span style={{
                position: 'absolute', content: '""', height: '26px', width: '26px',
                left: data.is_live ? '30px' : '4px', bottom: '4px',
                backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
              }} />
            </span>
          </label>
        </div>

        {/* Video ID Input */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
            <Video size={18} /> YouTube Live Video ID
          </label>
          <input 
            type="text" 
            value={data.video_id}
            onChange={e => setData({...data, video_id: e.target.value})}
            placeholder="e.g., jfKfPfyJRdk"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
          />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Extract the ID from the YouTube link. (e.g., youtube.com/watch?v=<strong>jfKfPfyJRdk</strong>)
          </p>
        </div>

        {/* Next Scheduled Title */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
            <Radio size={18} /> Next Session Title
          </label>
          <input 
            type="text" 
            value={data.next_title}
            onChange={e => setData({...data, next_title: e.target.value})}
            placeholder="e.g., ධම්මචක්ක පවත්තන සූත්‍ර දේශනාව"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
          />
        </div>

        {/* Next Scheduled Time */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
            <Clock size={18} /> Next Scheduled Time
          </label>
          <input 
            type="datetime-local" 
            value={data.next_scheduled_time}
            onChange={e => setData({...data, next_scheduled_time: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
          />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            This will be used to show the countdown timer on the broadcast page when offline.
          </p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          style={{
            marginTop: '16px',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            padding: '14px',
            borderRadius: '8px',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          <Save size={20} /> {loading ? 'Saving...' : 'Save Settings'}
        </button>

      </div>
    </div>
  );
}
