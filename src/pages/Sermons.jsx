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
  const [activeCategory, setActiveCategory] = useState('සියලුම දේශනා');
  const [visibleCount, setVisibleCount] = useState(8);

  // Expanded dummy data to demonstrate Load More UX
  const allVideos = [
    { title: 'මහා සතිපට්ඨාන සූත්‍රය - පළමු කොටස', cat: 'සූත්‍ර සාකච්ඡා', time: '1:12:45', date: 'පෙබරවාරි 20, 2024' },
    { title: 'ආනාපානසති භාවනාවේ මූලික පියවර', cat: 'භාවනා උපදෙස්', time: '45:20', date: 'පෙබරවාරි 15, 2024' },
    { title: 'කර්මය සහ විපාකය නිවැරදිව තේරුම් ගැනීම', cat: 'ධර්ම ගැටලු', time: '58:10', date: 'පෙබරවාරි 10, 2024' },
    { title: 'පටිච්ච සමුප්පාදය සරලව', cat: 'අභිධර්මය', time: '1:30:05', date: 'පෙබරවාරි 05, 2024' },
    { title: 'කරණීය මෙත්ත සූත්‍රයේ අර්ථය', cat: 'සූත්‍ර සාකච්ඡා', time: '35:40', date: 'ජනවාරි 30, 2024' },
    { title: 'මරණානුස්සති භාවනාව', cat: 'භාවනා උපදෙස්', time: '50:15', date: 'ජනවාරි 25, 2024' },
    { title: 'ධම්මචක්කප්පවත්තන සූත්‍රය', cat: 'සූත්‍ර සාකච්ඡා', time: '45:00', date: 'ජනවාරි 10, 2024' },
    { title: 'මෛත්‍රී භාවනාව', cat: 'භාවනා උපදෙස්', time: '30:20', date: 'ජනවාරි 05, 2024' },
    { title: 'අනිත්‍ය දර්ශනය', cat: 'ධර්ම ගැටලු', time: '1:05:00', date: 'දෙසැම්බර් 28, 2023' },
    { title: 'පංච උපාදානස්කන්ධය', cat: 'අභිධර්මය', time: '1:40:15', date: 'දෙසැම්බර් 20, 2023' },
    { title: 'සීලය රැකීමේ අනුසස්', cat: 'ධර්ම ගැටලු', time: '42:10', date: 'දෙසැම්බර් 15, 2023' },
    { title: 'චිත්තානුපස්සනාව', cat: 'භාවනා උපදෙස්', time: '55:30', date: 'දෙසැම්බර් 10, 2023' },
    { title: 'අභිධර්මයේ මූලික කරුණු', cat: 'අභිධර්මය', time: '2:15:00', date: 'නොවැම්බර් 25, 2023' },
    { title: 'බොජ්ඣංග ධර්ම', cat: 'සූත්‍ර සාකච්ඡා', time: '1:10:45', date: 'නොවැම්බර් 15, 2023' }
  ];

  // Filter based on category
  const filteredVideos = activeCategory === 'සියලුම දේශනා' 
    ? allVideos 
    : allVideos.filter(v => v.cat === activeCategory);

  const visibleVideos = filteredVideos.slice(0, visibleCount);
  const hasMore = visibleVideos.length < filteredVideos.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  return (
    <motion.div
      key="sermons"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ minHeight: '100vh', width: '100%', overflowX: 'hidden', background: '#060709', position: 'relative' }}
    >
      
      {/* 1. Cinematic Hero Section */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '80vh',
        backgroundImage: 'url("/bhawana-page/dharmadeshana.png")',
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

      {/* Hero Header Content */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, padding: '20vh 5vw 10vh 5vw', maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h1 style={{
            fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', fontWeight: '400',
            color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)',
            marginBottom: '16px', letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}>සද්ධර්ම ශ්‍රවණය</h1>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '40px', letterSpacing: '0.05em', fontWeight: '300', textShadow: '0 2px 10px rgba(0,0,0,0.8)', maxWidth: '600px', margin: '0 0 40px 0' }}>
            විශ්වාසදායක මූලාශ්‍ර වෙතින් ගෙනෙන පිරිසිදු ධර්ම දේශනා, සූත්‍ර සාකච්ඡා සහ භාවනා උපදෙස් ඇතුළත් දහම් පුස්තකාලය.
          </p>

        </motion.div>
      </div>

      {/* Main Content Area - Coming Soon */}
      <motion.div className="mobile-padding" initial="hidden" animate="visible" variants={fadeUp} style={{ position: 'relative', zIndex: 10, maxWidth: '1600px', margin: '0 auto', padding: '40px 5vw 120px 5vw' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', textAlign: 'center', background: 'rgba(10, 12, 16, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '60px 24px' }}>
          <div style={{ color: 'var(--gold-primary)', marginBottom: '24px', transform: 'scale(1.5)' }}>
            <PlayIcon />
          </div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', lineHeight: '1.6' }}>
            මෙම පිටුවේ අන්තර්ගතය මේ දිනවල සකස් වෙමින් පවතී. ඉතා ඉක්මනින් සජීවී දේශනා සහ පටිගත කළ දේශනා මෙහි යාවත්කාලීන කරනු ඇත.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
