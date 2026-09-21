import React, { useState, useEffect } from 'react';
import { Radio, Users, Eye, ArrowLeft, X, Maximize, Calendar, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Live() {
  const navigate = useNavigate();
  const [showUI, setShowUI] = useState(true);
  
  // Mock data
  const isLive = true;
  const liveVideoId = "jfKfPfyJRdk"; // Replace with actual live video ID
  const viewerCount = 1240;

  // The YouTube URL with strict parameters
  // controls=0: Hides bottom player controls (play/pause/timeline)
  // disablekb=1: Disables keyboard controls (spacebar, arrows)
  // rel=0: No related videos from other channels
  // modestbranding=1: Minimal YouTube branding
  // autoplay=1: Autoplay the stream
  const embedUrl = `https://www.youtube.com/embed/${liveVideoId}?autoplay=1&controls=0&disablekb=1&rel=0&modestbranding=1&playsinline=1`;

  // Auto-hide UI when mouse is still (cinematic mode)
  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowUI(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowUI(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    // Initial hide timer
    timeout = setTimeout(() => setShowUI(false), 4000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Radio size={48} style={{ opacity: 0.3, marginBottom: '24px' }} />
            <h2 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '2rem', fontWeight: 300, letterSpacing: '0.05em' }}>මේ මොහොතේ සජීවී විකාශයක් නොමැත</h2>
          </div>
        )}
      </div>

      {/* Invisible overlay to strictly block any clicks on the video */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}></div>

      {/* Cinematic UI Overlay */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            {/* Top Bar */}
            <div style={{ 
              width: '100%', 
              padding: '32px 5%', 
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              {/* Left: Exit & Info */}
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <button 
                  onClick={() => navigate('/')} 
                  style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <X size={24} />
                </button>
                
                <div>
                  <h1 style={{ color: '#fff', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    සජීවී ධර්ම දේශනාව
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem', margin: 0, textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
                    පූජ්‍ය අගලකඩ සිරිසුමන නාහිමි
                  </p>
                </div>
              </div>

              {/* Right: Live Status */}
              {isLive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', fontWeight: '600', textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
                    <Eye size={18} /> {viewerCount.toLocaleString()}
                  </div>
                  <motion.div 
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(220, 38, 38, 0.8)', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.05em', boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)', backdropFilter: 'blur(10px)' }}
                  >
                    <div style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%' }}></div>
                    LIVE
                  </motion.div>
                </div>
              )}
            </div>

            {/* Bottom Bar: Resources */}
            <div style={{ 
              width: '100%', 
              padding: '40px 5%', 
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <div style={{ pointerEvents: 'auto', background: 'rgba(25,25,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '24px', backdropFilter: 'blur(20px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.9)' }}>
                  <FileText size={20} color="var(--primary)" />
                  <span style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem' }}>අද දින දේශනාවට අදාළ සූත්‍රය</span>
                </div>
                <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontFamily: 'var(--font-sinhala)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
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
