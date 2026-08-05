import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Stable SVG Icons
const PlayIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;

// Categories
const categories = ['සියලුම දේශනා', 'සූත්‍ර සාකච්ඡා', 'භාවනා උපදෙස්', 'ධර්ම ගැටලු', 'අභිධර්මය'];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Sermons() {
  return (
    <div
      style={{ minHeight: '100vh', width: '100%', overflowX: 'hidden', background: 'var(--bg-main)', position: 'relative' }}
    >
      
      {/* Hero Header Content */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, padding: '5vh 5vw 5vh 5vw', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <h1 style={{
          fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: '700',
          color: 'var(--primary)', fontFamily: 'var(--font-serif)',
          marginBottom: '16px', letterSpacing: '-0.02em'
        }}>සද්ධර්ම ශ්‍රවණය</h1>
        
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', letterSpacing: '0.05em', fontWeight: '400', maxWidth: '650px', margin: '0 auto 40px auto', fontFamily: 'var(--font-sinhala)', lineHeight: '1.8' }}>
          විශ්වාසදායක මූලාශ්‍ර වෙතින් ගෙනෙන පිරිසිදු ධර්ම දේශනා, සූත්‍ර සාකච්ඡා සහ භාවනා උපදෙස් ඇතුළත් දහම් පුස්තකාලය.
        </p>
      </div>

      {/* Main Content Area - Coming Soon */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: '60px 5vw 120px 5vw' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '30vh', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '4px', padding: '60px 24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '24px', transform: 'scale(1.5)' }}>
            <PlayIcon />
          </div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: '700', marginBottom: '16px' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', lineHeight: '1.6', fontFamily: 'var(--font-sinhala)' }}>
            මෙම පිටුවේ අන්තර්ගතය මේ දිනවල සකස් වෙමින් පවතී. ඉතා ඉක්මනින් සජීවී දේශනා සහ පටිගත කළ දේශනා මෙහි යාවත්කාලීන කරනු ඇත.
          </p>
        </div>
      </div>
    </div>
  );
}
