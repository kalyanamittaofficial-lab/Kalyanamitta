import { useState, useEffect, useRef } from 'react';
import { Radio, Eye, X, FileText, Clock, Maximize, Minimize, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';
import YouTube from 'react-youtube';

export default function Live() {
  const navigate = useNavigate();
  const [showUI, setShowUI] = useState(true);
  
  // Real data state
  const [isLive, setIsLive] = useState(false);
  const [liveVideoId, setLiveVideoId] = useState('');
  const [nextScheduledTime, setNextScheduledTime] = useState('');
  const [nextTitle, setNextTitle] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [joined, setJoined] = useState(false);
  const [startSeconds, setStartSeconds] = useState(0);

  // Fullscreen & Mobile states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Watch Party State
  const playerRef = useRef(null);
  const [playbackState, setPlaybackState] = useState('paused');
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Handle Screen Rotate (Orientation Lock)
  const toggleRotation = async () => {
    try {
      if (screen.orientation && screen.orientation.lock) {
        if (screen.orientation.type.startsWith('portrait')) {
          await screen.orientation.lock('landscape');
        } else {
          await screen.orientation.lock('portrait');
        }
      } else {
        alert("ඔබගේ දුරකථනයේ මෙම පහසුකම (Auto Rotate API) සක්‍රිය නැත. කරුණාකර දුරකථනය හරවන්න.");
      }
    } catch (err) {
      console.error(err);
      alert("තිරය හැරවීම සඳහා කරුණාකර පළමුව Fullscreen කරන්න.");
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Random viewer count generator for effect (since we can't easily get real YouTube viewers without API key)
  const [viewerCount] = useState(() => Math.floor(Math.random() * 500) + 800);

  useEffect(() => {
    supabase
      .from('live_broadcast')
      .select('is_live, video_id, next_scheduled_time, next_title, playback_state, current_video_time, last_sync_time')
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
          setPlaybackState(data.playback_state || 'paused');
          setCurrentVideoTime(data.current_video_time || 0);
          setLastSyncTime(data.last_sync_time || null);
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
          setPlaybackState(newData.playback_state || 'paused');
          setCurrentVideoTime(newData.current_video_time || 0);
          setLastSyncTime(newData.last_sync_time || null);
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

  // Calculate synchronized start time for initial load
  useEffect(() => {
    if (isLive && playbackState === 'playing' && lastSyncTime) {
      const lastSync = new Date(lastSyncTime).getTime();
      const now = new Date().getTime();
      const diff = Math.floor((now - lastSync) / 1000);
      setStartSeconds(currentVideoTime + diff);
    } else {
      setStartSeconds(currentVideoTime);
    }
  }, [isLive, playbackState, currentVideoTime, lastSyncTime]);

  // Realtime Watch Party Sync
  useEffect(() => {
    if (!playerRef.current) return;
    
    if (playbackState === 'paused') {
      playerRef.current.pauseVideo();
      playerRef.current.seekTo(currentVideoTime);
    } else if (playbackState === 'playing') {
      const lastSync = new Date(lastSyncTime).getTime();
      const now = new Date().getTime();
      const diff = Math.floor((now - lastSync) / 1000);
      
      // Calculate where the video SHOULD be right now
      const targetTime = currentVideoTime + diff;
      const actualTime = playerRef.current.getCurrentTime();
      
      // If we are out of sync by more than 3 seconds, seek to correct time
      if (Math.abs(actualTime - targetTime) > 3) {
        playerRef.current.seekTo(targetTime);
      }
      playerRef.current.playVideo();
    }
  }, [playbackState, currentVideoTime, lastSyncTime]);

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

  const embedUrl = `https://www.youtube.com/embed/${encodeURIComponent(liveVideoId.trim())}?autoplay=1&controls=0&disablekb=1&rel=0&modestbranding=1&playsinline=1&start=${startSeconds}`;

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
    <div 
      ref={containerRef}
      style={{ 
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
      <style>{`
        @media (max-width: 600px) {
          .hide-on-mobile { display: none !important; }
          .viewer-count-container { display: none !important; }
        }
      `}</style>
      
      {/* The Immersive Video Player */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {isLive ? (
          <YouTube
            videoId={liveVideoId.trim()}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                rel: 0,
                modestbranding: 1,
                playsinline: 1,
                start: Math.floor(startSeconds)
              }
            }}
            onReady={(e) => { playerRef.current = e.target; }}
            style={{ width: '100%', height: '100%', border: 'none', objectFit: 'cover' }}
          />
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
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100000, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            {/* Top Bar - Deep Crimson/Black Vignette */}
            <div style={{ 
              width: '100%', 
              padding: 'clamp(16px, 4vw, 32px) 5%', 
              background: 'linear-gradient(to bottom, rgba(15, 0, 0, 0.95) 0%, rgba(10, 0, 0, 0.7) 40%, rgba(0,0,0,0) 100%)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              {/* Left: Exit & Info */}
              <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 32px)', alignItems: 'center' }}>
                <button 
                  onClick={() => navigate('/')} 
                  style={{ pointerEvents: 'auto', background: 'rgba(140, 21, 21, 0.15)', border: '1px solid rgba(140, 21, 21, 0.3)', color: '#fff', width: 'clamp(40px, 10vw, 48px)', height: 'clamp(40px, 10vw, 48px)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backdropFilter: 'blur(12px)', transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(140, 21, 21, 0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <X size={20} />
                </button>
                
                <div>
                  <h1 style={{ color: '#fff', fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 700, margin: '0 0 6px 0', textShadow: '0 4px 12px rgba(0,0,0,0.8)', letterSpacing: '-0.01em' }}>
                    සජීවී ධර්ම දේශනාව
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-sinhala)', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.8)', fontWeight: 300 }}>
                    පූජ්‍ය අගලකඩ සිරිසුමන නාහිමි
                  </p>
                </div>
              </div>

              {/* Right: Controls & Live Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 20px)' }}>
                {/* Mobile Controls: Fullscreen & Rotate */}
                <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
                  <button 
                    onClick={toggleFullscreen}
                    title="Screen Fit"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                  >
                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                  </button>
                  <button 
                    onClick={toggleRotation}
                    title="Rotate Screen"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                  >
                    <Smartphone size={18} />
                  </button>
                </div>

                {isLive && (
                  <>
                    <div className="viewer-count-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', fontWeight: '500', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                      <Eye size={18} color="rgba(255,255,255,0.6)" /> <span className="hide-on-mobile">{viewerCount.toLocaleString()}</span>
                    </div>
                    <motion.div 
                      animate={{ opacity: [1, 0.6, 1], scale: [1, 1.02, 1] }}
                      transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: '#fff', padding: '6px 18px', borderRadius: '24px', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.08em', boxShadow: '0 4px 20px rgba(140, 21, 21, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%', boxShadow: '0 0 8px #fff' }}></div>
                      LIVE
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Bar: Resources */}
            <div style={{ 
              width: '100%', 
              padding: 'clamp(20px, 5vw, 40px) 5%', 
              background: 'linear-gradient(to top, rgba(15, 0, 0, 0.95) 0%, rgba(10, 0, 0, 0.7) 40%, rgba(0,0,0,0) 100%)',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <div style={{ pointerEvents: 'auto', background: 'rgba(20, 5, 5, 0.6)', border: '1px solid rgba(140, 21, 21, 0.2)', padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px, 4vw, 32px)', backdropFilter: 'blur(24px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.95)' }}>
                  <FileText size={20} color="var(--primary)" />
                  <span style={{ fontFamily: 'var(--font-sinhala)', fontSize: 'clamp(0.9rem, 3vw, 1rem)', fontWeight: 500, textAlign: 'center' }}>අද දින දේශනාවට අදාළ සූත්‍රය</span>
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

      {/* JOIN OVERLAY (Must be on top of everything to bypass pointer-events blocks) */}
      <AnimatePresence>
        {isLive && !joined && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
              background: 'radial-gradient(circle at center, #1a0505 0%, #000 100%)', 
              zIndex: 99999, pointerEvents: 'auto' 
            }}
          >
            <h3 style={{ color: '#fff', fontFamily: 'var(--font-sinhala)', fontSize: '2rem', marginBottom: '32px', letterSpacing: '0.05em' }}>සජීවී විකාශය ආරම්භ වී ඇත</h3>
            <button 
              onClick={() => setJoined(true)}
              style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '20px 48px', borderRadius: '40px', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-sinhala)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(140, 21, 21, 0.4)', transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'var(--primary-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'var(--primary)'; }}
            >
              <Eye size={28} /> නැරඹීම සඳහා පිවිසෙන්න
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
