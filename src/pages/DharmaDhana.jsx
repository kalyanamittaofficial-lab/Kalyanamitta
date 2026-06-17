import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { booksData } from '../data/books';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function DharmaDhana() {
  const navigate = useNavigate();

  return (
    <motion.div
      key="dharmadhana"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}
    >
      {/* 1. Standard Minimal Hero Section */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '500px',
        background: 'linear-gradient(to bottom, #060709 0%, #0a0c10 50%, #060709 100%)',
        zIndex: 0
      }}></div>

      {/* Main Content Wrapper */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, paddingTop: '120px', paddingBottom: '120px', maxWidth: '1400px', margin: '0 auto', paddingLeft: '5vw', paddingRight: '5vw' }}>
        
        {/* Hero Text */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-center-mobile" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: '0 auto 60px auto' }}
        >
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '400',
            color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)',
            marginBottom: '16px', letterSpacing: '-0.02em'
          }}>ධර්ම දාන</h1>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '0.05em', fontWeight: '300' }}>
            කල්‍යාණමිත්ත ප්‍රකාශන
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '600px', opacity: 0.8 }}>
            අප විසින් සම්පාදනය කරන ලද ධර්ම ග්‍රන්ථ සහ අත්පොත් මෙහිදී ඔබට පහසුවෙන් කියවිය හැක. ශ්‍රී සද්ධර්මය සැමටම නොමිලේ.
          </p>
        </motion.div>

        {/* Minimalist Premium Editorial Grid */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '40px',
            paddingTop: '20px'
          }}
        >
          {booksData.map((book) => (
            <div 
              key={book.id} 
              onClick={() => window.open(`/read/${book.id}`, '_blank')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(15, 15, 15, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
              className="book-card-hover"
            >
              <style>{`
                .book-card-hover:hover {
                  transform: translateY(-8px);
                  border-color: rgba(196,152,79,0.3) !important;
                  background: rgba(25, 25, 25, 0.6) !important;
                  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }
                .book-card-hover:hover .book-cover-img {
                  transform: scale(1.05);
                }
              `}</style>

              {/* Minimal Cover Image */}
              <div style={{
                position: 'relative',
                paddingTop: '120%', /* Perfect book ratio */
                overflow: 'hidden',
                background: '#11141a',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}>
                <img 
                  className="book-cover-img"
                  src={book.coverImage} 
                  alt={book.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>

              {/* Minimal Typography Meta */}
              <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '12px', fontWeight: '400', lineHeight: '1.4' }}>
                  {book.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {book.author}
                </p>
                <div style={{ width: '40px', height: '1px', background: 'var(--glass-border)', marginBottom: '16px' }}></div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', opacity: 0.8, marginBottom: '24px', flexGrow: 1 }}>
                  {book.description}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-primary)', fontSize: '0.9rem', fontWeight: '500' }}>
                  කියවන්න <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
