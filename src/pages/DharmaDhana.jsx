import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { booksData } from '../data/books';
import { BookOpen } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function DharmaDhana() {
  const navigate = useNavigate();

  const upcomingBooks = [
    {
      id: 'upcoming-1',
      title: 'බෝධි පූජා අත්පොත',
      author: 'කල්‍යාණමිත්ත',
      coverImage: '/zen_stones.png',
      description: 'නිවැරදිව බෝධි පූජාවක් පවත්වන ආකාරය සහ ගාථා ඇතුළත් අත්පොතකි.'
    },
    {
      id: 'upcoming-2',
      title: 'මහා පිරිත් පොත',
      author: 'කල්‍යාණමිත්ත',
      coverImage: '/lotus_glow.png',
      description: 'එදිනෙදා ජීවිතයට අවශ්‍ය සියලුම පිරිත් දේශනාවන් අන්තර්ගත ග්‍රන්ථයකි.'
    }
  ];

  return (
    <motion.div
      key="dharmadhana"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}
    >
      {/* Dynamic Background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 0%, rgba(30, 25, 15, 0.4) 0%, rgba(5, 5, 5, 1) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <div style={{
        position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%',
        background: 'radial-gradient(circle, rgba(196,152,79,0.05) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 0
      }}></div>

      {/* Main Content Wrapper */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, paddingTop: '150px', paddingBottom: '120px', maxWidth: '1400px', margin: '0 auto', paddingLeft: '5vw', paddingRight: '5vw' }}>
        
        {/* Hero Text */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-center-mobile" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: '0 auto 60px auto' }}
        >
          <div style={{ color: 'var(--gold-primary)', marginBottom: '12px', opacity: 0.8 }}>
            <BookOpen size={28} />
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: '500',
            background: 'linear-gradient(to bottom, #fff, #a0a0a0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'var(--font-sinhala)',
            marginBottom: '12px', letterSpacing: '-0.02em',
            textShadow: '0 10px 30px rgba(255,255,255,0.05)'
          }}>ධර්ම දානය</h1>
          
          <p style={{ fontSize: '1rem', color: 'var(--gold-primary)', marginBottom: '20px', letterSpacing: '0.1em', fontWeight: '400', textTransform: 'uppercase' }}>
            කල්‍යාණමිත්ත ප්‍රකාශන
          </p>
          <p style={{ fontSize: '1rem', color: '#a0a0a0', lineHeight: '1.6', maxWidth: '600px' }}>
            අප විසින් සම්පාදනය කරන ලද ධර්ම ග්‍රන්ථ සහ අත්පොත් මෙහිදී ඔබට කියවිය හැක.
          </p>
        </motion.div>

        {/* Currently Available Books */}
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
            gap: '30px',
            marginBottom: '80px'
          }}
        >
          {booksData.map((book) => (
            <motion.div 
              variants={fadeUp}
              key={book.id} 
              onClick={() => window.open(`/read/${book.id}`, '_blank')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(20, 20, 22, 0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(196,152,79,0.15)',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
              className="book-card-hover"
            >
              <style>{`
                .book-card-hover:hover {
                  transform: translateY(-12px);
                  border-color: rgba(196,152,79,0.4) !important;
                  box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(196,152,79,0.1);
                }
                .book-card-hover:hover .book-cover-img {
                  transform: scale(1.08);
                }
                .book-card-hover:hover .read-btn {
                  background: var(--gold-primary) !important;
                  color: #000 !important;
                }
              `}</style>

              {/* Minimal Cover Image */}
              <div style={{
                position: 'relative',
                paddingTop: '130%', /* Taller ratio for elegant books */
                overflow: 'hidden',
                background: '#0a0c10',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}>
                <img 
                  className="book-cover-img"
                  src={book.coverImage} 
                  alt={book.title}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: 0.9
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }}></div>
              </div>

              {/* Typography Meta */}
              <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1, zIndex: 2 }}>
                <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-sinhala)', color: '#fff', marginBottom: '6px', fontWeight: '500', lineHeight: '1.4' }}>
                  {book.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '16px', letterSpacing: '0.05em' }}>
                  {book.author}
                </p>
                <div style={{ width: '30px', height: '1px', background: 'rgba(196,152,79,0.3)', marginBottom: '16px' }}></div>
                <p style={{ fontSize: '0.9rem', color: '#909090', lineHeight: '1.5', marginBottom: '24px', flexGrow: 1, fontFamily: 'var(--font-sinhala)' }}>
                  {book.description}
                </p>
                
                <div className="read-btn" style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                  color: '#fff', fontSize: '0.9rem', fontWeight: '500',
                  padding: '10px 20px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--font-sinhala)'
                }}>
                  කියවන්න <span style={{ fontSize: '1.1rem', lineHeight: '1' }}>→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Divider */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '60px' }}
        >
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }}></div>
          <h2 style={{ fontSize: '1.5rem', color: '#888', fontFamily: 'var(--font-sinhala)', fontWeight: '400' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h2>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))' }}></div>
        </motion.div>

        {/* Coming Soon Books */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
            gap: '30px',
            opacity: 0.8
          }}
        >
          {upcomingBooks.map((book) => (
            <motion.div 
              variants={fadeUp}
              key={book.id} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(10, 10, 10, 0.4)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Coming Soon Badge Overlay */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.5)', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{
                  background: 'rgba(20,20,20,0.8)',
                  backdropFilter: 'blur(10px)',
                  padding: '8px 24px',
                  borderRadius: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontFamily: 'var(--font-sinhala)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}>
                  ඉදිරියේදී
                </div>
              </div>

              {/* Cover Image */}
              <div style={{
                position: 'relative',
                paddingTop: '130%',
                overflow: 'hidden',
                background: '#0a0c10',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}>
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    objectFit: 'cover',
                    opacity: 0.4,
                    filter: 'grayscale(50%)'
                  }}
                />
              </div>

              {/* Typography Meta */}
              <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-sinhala)', color: '#888', marginBottom: '6px', fontWeight: '500', lineHeight: '1.4' }}>
                  {book.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(196,152,79,0.5)', marginBottom: '16px', letterSpacing: '0.05em' }}>
                  {book.author}
                </p>
                <div style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }}></div>
                <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5', flexGrow: 1, fontFamily: 'var(--font-sinhala)' }}>
                  {book.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
}
