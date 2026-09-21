import React, { useState, useEffect } from 'react';
import { Radio, Users, Eye, ArrowLeft, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Live() {
  // Mock data for the live stream (this would come from Supabase Admin panel)
  const isLive = true;
  const liveVideoId = "jfKfPfyJRdk"; // Replace with actual live video ID (e.g., Lofi girl stream for testing)
  const viewerCount = 1240;

  // The YouTube URL with strict parameters to disable user controls
  // controls=0: Hides bottom player controls (play/pause/timeline)
  // disablekb=1: Disables keyboard controls (spacebar, arrows)
  // rel=0: No related videos from other channels
  // modestbranding=1: Minimal YouTube branding
  // autoplay=1: Autoplay the stream
  // mute=1: Autoplay requires mute on modern browsers initially, but we can let them unmute via a custom button if needed, 
  // OR we can just use controls=0 and they can't even pause.
  
  // Note: For live streams, hiding controls means they can't pause or rewind, strictly watching it live!
  const embedUrl = `https://www.youtube.com/embed/${liveVideoId}?autoplay=1&controls=0&disablekb=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)', paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Header Area */}
      <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '0 5%', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'var(--font-sinhala)', fontWeight: '600' }}>
            <ArrowLeft size={18} /> මුල් පිටුවට (Home)
          </Link>
          
          {isLive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <motion.div 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', padding: '6px 16px', borderRadius: '20px', fontWeight: '700', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', border: '1px solid rgba(220, 38, 38, 0.2)' }}
              >
                <Radio size={16} />
                LIVE NOW
              </motion.div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
                <Eye size={16} /> {viewerCount} අසමින් සිටී
              </div>
            </div>
          )}
        </div>

        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', fontWeight: '700', marginBottom: '16px' }}>
          සජීවී ධර්ම දේශනාව
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontFamily: 'var(--font-sinhala)', maxWidth: '800px', lineHeight: 1.6 }}>
          මේ මොහොතේ විකාශය වන සජීවී ධර්ම දේශනාවට සවන් දෙන්න. දේශනාව අතරතුර එය නැවැත්වීමට (Pause) හෝ පාලනය කිරීමට නොහැක.
        </p>
      </div>

      {/* Video & Info Section */}
      <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '0 5%', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Left: Video Player */}
        <div style={{ flex: '1 1 700px' }}>
          <div style={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            background: '#000', 
            borderRadius: '12px', 
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            position: 'relative',
            // Disable pointer events completely so users cannot click the video to pause it, 
            // open it in YouTube, or interact with it at all!
            pointerEvents: 'none'
          }}>
            {isLive ? (
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title="Live Dhamma Sermon"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
              ></iframe>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Radio size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <h2 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.5rem', fontWeight: 500 }}>මේ මොහොතේ සජීවී විකාශයක් නොමැත</h2>
              </div>
            )}
            
            {/* Invisible overlay to strictly block any clicks just in case */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}></div>
          </div>
        </div>

        {/* Right: Info / Resources / Live Chat placeholder */}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Details Card */}
          <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-sinhala)', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px' }}>
              විස්තරය
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
                <Users size={20} color="var(--primary)" />
                <span style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1rem', lineHeight: 1.4 }}>
                  <strong style={{ color: 'var(--text-main)' }}>දේශකයාණන් වහන්සේ:</strong><br />
                  පූජ්‍ය අගලකඩ සිරිසුමන නාහිමි
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
                <Calendar size={20} color="var(--primary)" />
                <span style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1rem', lineHeight: 1.4 }}>
                  <strong style={{ color: 'var(--text-main)' }}>දිනය සහ වේලාව:</strong><br />
                  සෑම ඉරිදා දිනකම ප.ව. 2.00 ට
                </span>
              </div>
            </div>
          </div>

          {/* Download Resources Card */}
          <div style={{ background: 'rgba(140, 21, 21, 0.03)', padding: '32px', borderRadius: '12px', border: '1px solid rgba(140, 21, 21, 0.1)' }}>
            <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-sinhala)', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px' }}>
              ධර්ම පත්‍රිකා
            </h3>
            <p style={{ fontFamily: 'var(--font-sinhala)', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.5 }}>
              අද දින දේශනාවට අදාළ සූත්‍රය සහ ගාථා මෙතැනින් ලබා ගන්න.
            </p>
            <button style={{ 
              width: '100%', padding: '14px', background: 'var(--primary)', color: '#fff', 
              border: 'none', borderRadius: '8px', fontFamily: 'var(--font-sinhala)', fontSize: '1rem', 
              fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              cursor: 'pointer'
            }}>
              <FileText size={18} />
              PDF පත්‍රිකාව බාගත කරන්න
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
