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
