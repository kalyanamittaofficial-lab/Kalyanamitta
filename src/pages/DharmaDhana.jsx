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
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, paddingTop: '50px', paddingBottom: '120px', maxWidth: '1400px', margin: '0 auto', paddingLeft: '5vw', paddingRight: '5vw' }}>
        
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

        {/* Currently Available Books - Library Shelf */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
            gap: '60px 40px',
            marginBottom: '100px',
            padding: '20px 0'
          }}
        >
          {booksData.map((book, index) => (
            <div 
              key={book.id} 
              onClick={() => handleBookClick(book)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative'
              }}
              className="book-card-hover"
            >
              <style>{`
                .book-card-hover {
                  transition: transform 0.4s ease;
                }
                .book-card-hover:hover {
                  transform: translateY(-12px);
                }
                .book-card-hover:hover .book-3d {
                  box-shadow: inset 4px 0 10px rgba(0,0,0,0.1), inset -1px 0 2px rgba(255,255,255,0.4), 12px 12px 25px rgba(0,0,0,0.5) !important;
                  transform: perspective(1000px) rotateY(-5deg) scale(1.02);
                }
                .shelf-wood {
                  position: absolute;
                  bottom: -15px;
                  left: -20px;
                  right: -20px;
                  height: 15px;
                  background: linear-gradient(to bottom, #734a31, #4a2e1d);
                  border-radius: 2px;
                  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
                  z-index: 1;
                }
              `}</style>
              
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', zIndex: 2, marginBottom: '20px' }}>
                 {/* 3D Book Cover */}
                 <div className="book-3d" style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '180px',
                    paddingTop: '145%', // Realistic Portrait Ratio
                    background: index % 2 === 0 ? 'linear-gradient(135deg, #8C1515, #4A0B0B)' : 'linear-gradient(135deg, #c4984f, #8a6730)',
                    borderRadius: '2px 8px 8px 2px',
                    boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.2), inset -1px 0 2px rgba(255,255,255,0.3), 5px 5px 15px rgba(0,0,0,0.4)',
                    transition: 'all 0.4s ease',
                    transformOrigin: 'left center'
                 }}>
                    {/* Spine Crease */}
                    <div style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.15)' }}></div>
                    <div style={{ position: 'absolute', left: '14px', top: 0, bottom: 0, width: '6px', background: 'rgba(0,0,0,0.1)' }}></div>
                    
                    {/* Cover Content */}
                    <div style={{ position: 'absolute', left: '20px', top: '15px', bottom: '15px', right: '10px', border: '1px solid rgba(255,255,255,0.2)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                       <BookOpen size={32} color="rgba(255,255,255,0.9)" style={{ marginBottom: '16px' }} strokeWidth={1} />
                       <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: '8px', fontWeight: '700', lineHeight: '1.2', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                         {book.title}
                       </h3>
                       <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sinhala)', letterSpacing: '0.05em' }}>
                         {book.author}
                       </p>
                    </div>
                 </div>
                 
                 {/* The Wooden Shelf */}
                 <div className="shelf-wood"></div>
              </div>

              {/* Typography Meta (below the shelf) */}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                 <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>{book.title}</p>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', marginTop: '6px' }}>{book.description}</p>
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

        {/* Coming Soon Books - Library Shelf */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
            gap: '60px 40px',
            opacity: 0.7,
            padding: '20px 0'
          }}
        >
          {upcomingBooks.map((book, index) => (
            <div 
              key={book.id} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', zIndex: 2, marginBottom: '20px' }}>
                 {/* 3D Book Cover (Muted for Upcoming) */}
                 <div className="book-3d" style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '180px',
                    paddingTop: '145%', // Realistic Portrait Ratio
                    background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)', // Gray for upcoming
                    borderRadius: '2px 8px 8px 2px',
                    boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.1), inset -1px 0 2px rgba(255,255,255,0.5), 5px 5px 15px rgba(0,0,0,0.2)',
                 }}>
                    {/* Spine Crease */}
                    <div style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '2px', background: 'rgba(0,0,0,0.05)' }}></div>
                    <div style={{ position: 'absolute', left: '14px', top: 0, bottom: 0, width: '6px', background: 'rgba(0,0,0,0.03)' }}></div>
                    
                    {/* Cover Content */}
                    <div style={{ position: 'absolute', left: '20px', top: '15px', bottom: '15px', right: '10px', border: '1px solid rgba(0,0,0,0.1)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                       <BookOpen size={32} color="rgba(0,0,0,0.2)" style={{ marginBottom: '16px' }} strokeWidth={1} />
                       <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700', lineHeight: '1.2' }}>
                         {book.title}
                       </h3>
                    </div>
                    
                    {/* Coming Soon Badge Overlay */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      background: 'rgba(255,255,255,0.4)', borderRadius: '2px 8px 8px 2px', zIndex: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{
                        background: 'var(--primary)',
                        padding: '6px 16px',
                        borderRadius: '30px',
                        color: '#fff',
                        fontFamily: 'var(--font-sinhala)',
                        fontSize: '0.85rem',
                        letterSpacing: '0.05em',
                        fontWeight: '600',
                        boxShadow: '0 4px 10px rgba(140, 21, 21, 0.3)'
                      }}>
                        ඉදිරියේදී
                      </div>
                    </div>
                 </div>
                 
                 {/* The Wooden Shelf */}
                 <div style={{
                  position: 'absolute',
                  bottom: -15px,
                  left: -20px,
                  right: -20px,
                  height: 15px,
                  background: 'linear-gradient(to bottom, #734a31, #4a2e1d)',
                  borderRadius: '2px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                  zIndex: 1
                 }}></div>
              </div>

              {/* Typography Meta (below the shelf) */}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                 <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>{book.title}</p>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', marginTop: '6px' }}>{book.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
