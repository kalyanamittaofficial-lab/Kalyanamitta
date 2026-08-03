import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [previewBook, setPreviewBook] = useState(null);

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

  const handleBookClick = (book) => {
    navigate(`/read/${book.id}`);
  };

  return (
    <div
      style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', background: 'var(--bg-main)' }}
    >
      {/* Main Content Wrapper */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, paddingTop: '150px', paddingBottom: '120px', maxWidth: '1400px', margin: '0 auto', paddingLeft: '5vw', paddingRight: '5vw' }}>
        
        {/* Hero Text */}
        <div 
          className="text-center-mobile" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: '0 auto 60px auto' }}
        >
          <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            <BookOpen size={32} strokeWidth={1.5} />
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '700',
            color: 'var(--primary)',
            fontFamily: 'var(--font-serif)',
            marginBottom: '12px', letterSpacing: '-0.02em'
          }}>ධර්ම දානය</h1>
          
          <p style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '20px', letterSpacing: '0.1em', fontWeight: '600', textTransform: 'uppercase' }}>
            කල්‍යාණමිත්ත ප්‍රකාශන
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '600px', fontFamily: 'var(--font-sinhala)' }}>
            අප විසින් සම්පාදනය කරන ලද ධර්ම ග්‍රන්ථ සහ අත්පොත් මෙහිදී ඔබට කියවිය හැක.
          </p>
        </div>

        {/* Currently Available Books */}
        <div 
          className="book-grid-responsive"
          style={{ marginBottom: '80px' }}
        >
          {booksData.map((book) => (
            <div 
              key={book.id} 
              onClick={() => handleBookClick(book)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
              }}
              className="book-card-hover"
            >
              <style>{`
                .book-card-hover:hover {
                  transform: translateY(-8px);
                  border-color: var(--primary) !important;
                  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
                }
                .book-card-hover:hover .read-btn {
                  background: var(--primary) !important;
                  color: #fff !important;
                }
              `}</style>

              {/* Cover Text (Text-only Square Cover) */}
              <div style={{
                position: 'relative',
                paddingTop: '100%',
                overflow: 'hidden',
                background: 'var(--glass-bg)',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <BookOpen size={48} color="rgba(140, 21, 21, 0.2)" style={{ marginBottom: '20px' }} strokeWidth={1} />
                  <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '8px', fontWeight: '700', lineHeight: '1.3' }}>
                    {book.title}
                  </h3>
                  <div style={{ width: '40px', height: '2px', background: 'var(--primary)', marginTop: '16px', opacity: 0.3 }}></div>
                </div>
              </div>

              {/* Typography Meta */}
              <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1, zIndex: 2 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '12px', letterSpacing: '0.05em', fontWeight: '600' }}>
                  {book.author}
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px', flexGrow: 1, fontFamily: 'var(--font-sinhala)' }}>
                  {book.description}
                </p>
                
                <div className="read-btn" style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                  color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '600',
                  padding: '10px 20px', borderRadius: '4px',
                  background: 'transparent',
                  border: '1px solid rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--font-sinhala)'
                }}>
                  කියවන්න <span style={{ fontSize: '1.1rem', lineHeight: '1' }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Divider */}
        <div 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '60px' }}
        >
          <div style={{ height: '1px', flex: 1, background: 'var(--glass-border)' }}></div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-muted)', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h2>
          <div style={{ height: '1px', flex: 1, background: 'var(--glass-border)' }}></div>
        </div>

        {/* Coming Soon Books */}
        <div 
          className="book-grid-responsive"
          style={{ 
            opacity: 0.7
          }}
        >
          {upcomingBooks.map((book) => (
            <div 
              key={book.id} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Coming Soon Badge Overlay */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(255,255,255,0.7)', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{
                  background: 'var(--primary)',
                  padding: '8px 24px',
                  borderRadius: '30px',
                  color: '#fff',
                  fontFamily: 'var(--font-sinhala)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  ඉදිරියේදී
                </div>
              </div>

              {/* Text Only Square Cover */}
              <div style={{
                position: 'relative',
                paddingTop: '100%',
                overflow: 'hidden',
                background: 'var(--glass-bg)',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <BookOpen size={48} color="rgba(0,0,0,0.1)" style={{ marginBottom: '20px' }} strokeWidth={1} />
                  <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700', lineHeight: '1.3' }}>
                    {book.title}
                  </h3>
                </div>
              </div>

              {/* Typography Meta */}
              <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.05em' }}>
                  {book.author}
                </p>
                <div style={{ width: '30px', height: '1px', background: 'rgba(0,0,0,0.1)', marginBottom: '16px' }}></div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', flexGrow: 1, fontFamily: 'var(--font-sinhala)' }}>
                  {book.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
