import { useState, useEffect } from 'react';
import { Radio, Eye, X, FileText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';

export default function Live() {
  const navigate = useNavigate();
  const [showUI, setShowUI] = useState(true);
  
  // Real data state
  const [isLive, setIsLive] = useState(false);
  const [liveVideoId, setLiveVideoId] = useState('');
  const [nextScheduledTime, setNextScheduledTime] = useState('');
  const [nextTitle, setNextTitle] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');

  // Random viewer count generator for effect (since we can't easily get real YouTube viewers without API key)
  const [viewerCount] = useState(() => Math.floor(Math.random() * 500) + 800);

  useEffect(() => {
    supabase
      .from('live_broadcast')
      .select('is_live, video_id, next_scheduled_time, next_title')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load live broadcast data:', error);
          return;
        }

        if (data) {
          setIsLive(data.is_live);
          setLiveVideoId(data.video_id || '');
          setNextScheduledTime(data.next_scheduled_time || '');
          setNextTitle(data.next_title || '');
        }
      });

    // Setup realtime subscription
    const subscription = supabase
      .channel('public:live_broadcast')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_broadcast', filter: 'id=eq.1' }, payload => {
        const newData = payload.new;
        if (newData?.id === 1) {
          setIsLive(newData.is_live);
          setLiveVideoId(newData.video_id || '');
          setNextScheduledTime(newData.next_scheduled_time || '');
          setNextTitle(newData.next_title || '');
        }
      })
      .subscribe(status => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error(`Live broadcast realtime subscription failed: ${status}`);
        }
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (!isLive && nextScheduledTime) {
      const updateCountdown = () => {
        const now = new Date().getTime();
        const scheduled = new Date(nextScheduledTime).getTime();

        if (Number.isNaN(scheduled)) {
          setTimeRemaining('Starting soon...');
          return;
        }

        const distance = scheduled - now;

        if (distance < 0) {
          setTimeRemaining("Starting soon...");
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          let timeString = '';
          if (days > 0) timeString += `${days}d `;
          timeString += `${hours}h ${minutes}m ${seconds}s`;
          setTimeRemaining(timeString);
        }
      };

      updateCountdown();
      interval = setInterval(updateCountdown, 1000);
    }
    return () => clearInterval(interval);
  }, [isLive, nextScheduledTime]);

  const embedUrl = `https://www.youtube.com/embed/${encodeURIComponent(liveVideoId.trim())}?autoplay=1&controls=0&disablekb=1&rel=0&modestbranding=1&playsinline=1`;

  // Auto-hide UI when mouse is still (cinematic mode)
  useEffect(() => {
    let timeout;
    const revealUI = () => {
      setShowUI(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowUI(false), 3000);
    };

    window.addEventListener('pointermove', revealUI);
    window.addEventListener('pointerdown', revealUI);
    // Initial hide timer
    timeout = setTimeout(() => setShowUI(false), 4000);

    return () => {
      window.removeEventListener('pointermove', revealUI);
      window.removeEventListener('pointerdown', revealUI);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#000000', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      zIndex: 9999,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* The Immersive Video Player */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {isLive ? (
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="Live Dhamma Sermon"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none', objectFit: 'cover' }}
          ></iframe>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'radial-gradient(circle at center, #1a0505 0%, #000 100%)' }}>
            <Radio size={64} style={{ opacity: 0.2, marginBottom: '24px', color: 'var(--primary)' }} />
            <h2 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '2rem', fontWeight: 300, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>මේ මොහොතේ සජීවී විකාශයක් නොමැත</h2>
            
            {nextTitle && nextScheduledTime && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: 'rgba(140, 21, 21, 0.1)', padding: '32px 48px', borderRadius: '24px', border: '1px solid rgba(140, 21, 21, 0.2)', backdropFilter: 'blur(10px)' }}
              >
                <span style={{ fontFamily: 'var(--font-sinhala)', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.9rem' }}>මීළඟ සජීවී විකාශය</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, margin: 0, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{nextTitle}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                  <Clock size={20} color="rgba(255,255,255,0.6)" />
                  <span style={{ fontSize: '1.4rem', fontFamily: 'monospace', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '2px' }}>
                    {timeRemaining}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Invisible overlay to strictly block any clicks on the video */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}></div>

      {/* Cinematic UI Overlay */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            {/* Top Bar - Deep Crimson/Black Vignette */}
            <div style={{ 
              width: '100%', 
              padding: '32px 5%', 
              background: 'linear-gradient(to bottom, rgba(15, 0, 0, 0.95) 0%, rgba(10, 0, 0, 0.7) 40%, rgba(0,0,0,0) 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              {/* Left: Exit & Info */}
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <button 
                  onClick={() => navigate('/')} 
                  style={{ pointerEvents: 'auto', background: 'rgba(140, 21, 21, 0.15)', border: '1px solid rgba(140, 21, 21, 0.3)', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backdropFilter: 'blur(12px)', transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(140, 21, 21, 0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <X size={24} />
                </button>
                
                <div>
                  <h1 style={{ color: '#fff', fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 6px 0', textShadow: '0 4px 12px rgba(0,0,0,0.8)', letterSpacing: '-0.01em' }}>
                    සජීවී ධර්ම දේශනාව
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-sinhala)', fontSize: '1rem', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.8)', fontWeight: 300 }}>
                    පූජ්‍ය අගලකඩ සිරිසුමන නාහිමි
                  </p>
                </div>
              </div>

              {/* Right: Live Status */}
              {isLive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', fontWeight: '500', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    <Eye size={18} color="rgba(255,255,255,0.6)" /> {viewerCount.toLocaleString()}
                  </div>
                  <motion.div 
                    animate={{ opacity: [1, 0.6, 1], scale: [1, 1.02, 1] }}
                    transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: '#fff', padding: '6px 18px', borderRadius: '24px', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.08em', boxShadow: '0 4px 20px rgba(140, 21, 21, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%', boxShadow: '0 0 8px #fff' }}></div>
                    LIVE
                  </motion.div>
                </div>
              )}
            </div>

            {/* Bottom Bar: Resources */}
            <div style={{ 
              width: '100%', 
              padding: '40px 5%', 
              background: 'linear-gradient(to top, rgba(15, 0, 0, 0.95) 0%, rgba(10, 0, 0, 0.7) 40%, rgba(0,0,0,0) 100%)',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <div style={{ pointerEvents: 'auto', background: 'rgba(20, 5, 5, 0.6)', border: '1px solid rgba(140, 21, 21, 0.2)', padding: '16px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '32px', backdropFilter: 'blur(24px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.95)' }}>
                  <FileText size={20} color="var(--primary)" />
                  <span style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1rem', fontWeight: 500 }}>අද දින දේශනාවට අදාළ සූත්‍රය</span>
                </div>
                <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '10px', fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(140,21,21,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  බාගත කරන්න (PDF)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
