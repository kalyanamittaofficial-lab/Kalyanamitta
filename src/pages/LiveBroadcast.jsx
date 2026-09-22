import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Radio, Calendar, Clock, BellRing, PlayCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveBroadcast() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [isTimeReached, setIsTimeReached] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    fetchLiveStatus();

    // Subscribe to realtime changes!
    const sub = supabase
      .channel('public_live_status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_broadcast', filter: 'id=eq.1' }, payload => {
        setData(payload.new);
        // Reset time reached if admin updates the schedule
        setIsTimeReached(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  useEffect(() => {
    if (!data?.next_scheduled_time) {
      setIsTimeReached(false);
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const scheduledTime = new Date(data.next_scheduled_time).getTime();
      const distance = scheduledTime - now;

      if (distance <= 0) {
        setIsTimeReached(true);
        clearInterval(timer);
        return;
      }

      setIsTimeReached(false);
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    // Initial check
    const now = new Date().getTime();
    if (new Date(data.next_scheduled_time).getTime() - now <= 0) {
      setIsTimeReached(true);
    }

    return () => clearInterval(timer);
  }, [data]);

  const fetchLiveStatus = async () => {
    try {
      const { data: broadcast } = await supabase
        .from('live_broadcast')
        .select('*')
        .eq('id', 1)
        .single();
      setData(broadcast);
    } catch (err) {
      console.error('Failed to load broadcast data', err);
    } finally {
      setLoading(false);
    }
  };

  const shouldShowVideo = data?.is_live || isTimeReached;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-main)' }}>
        <Loader2 className="spin" size={40} color="var(--primary)" />
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 85px)', background: 'var(--bg-main)', color: 'var(--text-main)', padding: '40px 5%' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', textAlign: 'center' }}>
          <motion.div 
            animate={shouldShowVideo ? { opacity: [1, 0.6, 1], scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              background: shouldShowVideo ? 'rgba(220, 38, 38, 0.1)' : 'rgba(128, 128, 128, 0.1)', 
              color: shouldShowVideo ? '#dc2626' : 'var(--text-muted)', 
              padding: '6px 16px', borderRadius: '30px', 
              fontWeight: '700', fontSize: '1rem', marginBottom: '24px',
              border: `1px solid ${shouldShowVideo ? 'rgba(220, 38, 38, 0.3)' : 'var(--glass-border)'}` 
            }}
          >
            <Radio size={20} />
            {shouldShowVideo ? 'LIVE BROADCAST' : 'OFFLINE'}
          </motion.div>

          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', marginBottom: '16px', fontWeight: 'bold' }}>
            {shouldShowVideo ? (data?.next_title || 'සජීවී විකාශය') : 'මීළඟ සජීවී විකාශය'}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', maxWidth: '600px', lineHeight: '1.6' }}>
            කල්‍යාණමිත්ත සජීවී ධර්ම දේශනා සහ භාවනා වැඩසටහන් සමග මෙතැනින් සම්බන්ධ වන්න.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {shouldShowVideo && data?.video_id ? (
            /* LIVE VIDEO PLAYER */
            <motion.div 
              key="live"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' }}
            >
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {!joined ? (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                    <h3 style={{ color: '#fff', fontFamily: 'var(--font-sinhala)', fontSize: '1.5rem', marginBottom: '24px' }}>සජීවී විකාශය ආරම්භ වී ඇත</h3>
                    <button 
                      onClick={() => setJoined(true)}
                      style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'var(--font-sinhala)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(212, 163, 115, 0.4)', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <PlayCircle size={24} /> නැරඹීම සඳහා පිවිසෙන්න
                    </button>
                  </div>
                ) : (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <iframe 
                      src={`https://www.youtube.com/embed/${data.video_id}?autoplay=1&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0&iv_load_policy=3`} 
                      title="Kalyanamitta Live Broadcast" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    ></iframe>
                  </div>
                )}
              </div>
            </motion.div>

          ) : (
            /* COUNTDOWN / OFFLINE STATE */
            <motion.div 
              key="offline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ width: '100%', maxWidth: '700px', margin: '0 auto', background: 'var(--bg-secondary)', padding: '60px 40px', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--glass-border)' }}
            >
              <PlayCircle size={64} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '32px' }} />
              
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', marginBottom: '16px' }}>
                {data?.next_title || 'මීළඟ වැඩසටහන ඉක්මනින් දැනුම් දෙනු ලැබේ'}
              </h2>

              {data?.next_scheduled_time ? (
                <>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', fontFamily: 'var(--font-sinhala)' }}>
                    <Calendar size={18} /> {new Date(data.next_scheduled_time).toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' })}
                    &nbsp;|&nbsp;
                    <Clock size={18} /> {new Date(data.next_scheduled_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div style={{ background: 'var(--bg-main)', padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '12px' }}>Starting In</div>
                    <div style={{ fontSize: '2.5rem', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--primary)' }}>
                      {timeLeft}
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Please stay tuned for our next live broadcast schedule.</p>
              )}

              <button style={{ marginTop: '40px', background: 'var(--text-main)', color: 'var(--bg-main)', border: 'none', padding: '16px 32px', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <BellRing size={20} /> Get Notified
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
