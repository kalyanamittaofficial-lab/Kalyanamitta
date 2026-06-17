import React from 'react';
import { motion } from 'framer-motion';

// Premium Custom SVG Icons
const LeafIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 22 12 12"/></svg>;
const LotusIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c-4-4-8-9-8-14 0-1.5 2-4 4-4s4 2.5 4 4c0-1.5 2-4 4-4s4 2.5 4 4c0 5-4 10-8 14z"/></svg>;
const SunIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const ExternalLinkIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const BookIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
const ArchiveIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/></svg>;

// Ultra-stable animations
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Words() {
  return (
    <motion.div
      key="words"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}
    >
      {/* 1. Cinematic Hero Section */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '80vh',
        backgroundImage: 'url("/bhawana-page/dhammaPage.png")',
        backgroundSize: 'cover', backgroundPosition: 'top center', zIndex: 0
      }}>
        {/* Base top-to-bottom gradient */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to bottom, rgba(6,7,9,0.2) 0%, rgba(6,7,9,0.7) 70%, #060709 100%)'
        }}></div>
        {/* Strong left-to-right gradient for text readability */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '80%', height: '100%',
          background: 'linear-gradient(to right, rgba(6,7,9,0.95) 0%, rgba(6,7,9,0.7) 40%, rgba(6,7,9,0) 100%)'
        }}></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, padding: '20vh 48px 120px 48px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Hero Text */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-center-mobile" style={{ maxWidth: '700px', marginBottom: '15vh', display: 'flex', flexDirection: 'column' }}
        >
          <h1 style={{
            fontSize: 'clamp(4rem, 7vw, 6.5rem)', fontWeight: '400',
            color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)',
            marginBottom: '16px', letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>බුදු වදන්</h1>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '32px', letterSpacing: '0.05em', fontWeight: '300' }}>
            ශ්‍රී සද්ධර්මයේ පිරිසිදුම උල්පත.
          </p>

          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.05rem', lineHeight: '1.8' }}>
            <p>
              ගෞතම බුදුරජාණන් වහන්සේගේ ශ්‍රී මුවින් දේශනා කළ, කිසිදු වෙනසකට ලක් නොවූ 
              පිරිසිදු ත්‍රිපිටක ධර්මය සහ පැරණි අටුවා ග්‍රන්ථ වෙත පිවිසෙන මණ්ඩපය.
            </p>
          </div>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', textAlign: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(var(--glass-blur))', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '60px 24px', marginBottom: '100px' }}>
          <div style={{ color: 'var(--gold-primary)', marginBottom: '24px', transform: 'scale(1.5)' }}>
            <BookIcon />
          </div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', lineHeight: '1.6' }}>
            මෙම පිටුවේ අන්තර්ගතය මේ දිනවල සකස් වෙමින් පවතී. ඉතා ඉක්මනින් සම්පූර්ණ ධර්ම කරුණු මෙහි යාවත්කාලීන කරනු ඇත.
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}
