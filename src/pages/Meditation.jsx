import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Leaf, Wind, Heart, Eye, Droplets, Sun, Calendar, 
  ArrowRight, Play, Pause, Headphones, Sparkles, Moon, Volume2, Maximize2 
} from 'lucide-react';

// Ultra-stable animations
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Meditation() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', background: 'var(--bg-main)' }}
    >
      {/* Main Content Wrapper */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, padding: '5vh 48px 120px 48px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Hero Text */}
        <div 
          className="text-center-mobile" style={{ maxWidth: '650px', marginBottom: '10vh', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '40px' }}
        >
          <h1 style={{
            fontSize: 'clamp(3.5rem, 6vw, 6.5rem)', fontWeight: '700',
            color: 'var(--primary)', fontFamily: 'var(--font-serif)',
            marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: '1.1'
          }}>භාවනා</h1>
        </div>

        {/* Coming Soon Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '30vh', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '4px', padding: '60px 24px', marginBottom: '100px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '24px', transform: 'scale(1.5)' }}>
            <Moon />
          </div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: '700', marginBottom: '16px' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', lineHeight: '1.6', fontFamily: 'var(--font-sinhala)' }}>
            මෙම පිටුවේ අන්තර්ගතය මේ දිනවල සකස් වෙමින් පවතී. ඉතා ඉක්මනින් භාවනා උපදෙස් සහ භාවනා මාර්ගෝපදේශ මෙහි යාවත්කාලීන කරනු ඇත.
          </p>
        </div>

      </div>

      <style>{`
        .hover-scale { transition: transform 0.3s ease; }
        .hover-bg-light:hover { background: rgba(0,0,0,0.02) !important; border-color: var(--primary) !important; }
        .group:hover .hover-scale { transform: scale(1.05); }
      `}</style>
    </div>
  );
}
