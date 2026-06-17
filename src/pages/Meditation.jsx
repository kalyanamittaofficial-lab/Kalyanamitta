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
    <motion.div
      key="meditation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', background: '#060709' }}
    >
      {/* 1. Cinematic Hero Section */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '95vh',
        backgroundImage: 'url("/bhawana-page/bhawanapageheroimage.png")',
        backgroundSize: 'cover', backgroundPosition: 'center 20%', zIndex: 0
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to bottom, rgba(6,7,9,0.3) 0%, rgba(6,7,9,0.85) 60%, #060709 100%)'
        }}></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, padding: '20vh 48px 120px 48px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Hero Text */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-center-mobile" style={{ maxWidth: '650px', marginBottom: '15vh', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
          <h1 style={{
            fontSize: 'clamp(4.5rem, 8vw, 7.5rem)', fontWeight: '400',
            color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)',
            marginBottom: '16px', letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(0,0,0,0.5)', lineHeight: '1.1'
          }}>භාවනා</h1>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', textAlign: 'center', background: 'rgba(10, 12, 16, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '60px 24px', marginBottom: '100px' }}>
          <div style={{ color: 'var(--gold-primary)', marginBottom: '24px', transform: 'scale(1.5)' }}>
            <Moon />
          </div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', lineHeight: '1.6' }}>
            මෙම පිටුවේ අන්තර්ගතය මේ දිනවල සකස් වෙමින් පවතී. ඉතා ඉක්මනින් භාවනා උපදෙස් සහ භාවනා මාර්ගෝපදේශ මෙහි යාවත්කාලීන කරනු ඇත.
          </p>
        </motion.div>

      </div>

      <style>{`
        .hover-scale { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .hover-bg-light:hover { background: rgba(25, 25, 25, 0.6) !important; border-color: rgba(196,152,79,0.2) !important; }
        .group:hover .hover-scale { transform: scale(1.05); }
      `}</style>
    </motion.div>
  );
}
