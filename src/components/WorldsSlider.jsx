import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function WorldsSlider() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  
  const cards = [
    { title: 'බුදු වදන්', subtitle: 'දේශිත බුදු වදන් සහ අර්ථය', image: '/bhawana-page/dhammaPage.png', path: '/words' },
    { title: 'දේශනා', subtitle: 'ධර්ම දේශනා සහ සජීවී දේශනා', image: '/bhawana-page/dharmadeshana.png', path: '/sermons' },
    { title: 'භාවනා', subtitle: 'භාවනා මාර්ගෝපදේශ සහ නිශ්ශබ්ද', image: '/bhawana-page/bhawanapageheroimage.png', path: '/meditation' },
    { title: 'ධර්ම මාර්ගය', subtitle: 'ඉදිරියේදී බලාපොරොත්තු වන්න...', image: '/sutta_pitaka.png', path: null },
    { title: 'ජීවිතයට ධර්මය', subtitle: 'ඉදිරියේදී බලාපොරොත්තු වන්න...', image: '/dark_waves.png', path: null },
    { title: 'කල්‍යාණ මිත්‍රත්වය', subtitle: 'ඉදිරියේදී බලාපොරොත්තු වන්න...', image: '/abhidhamma_pitaka.png', path: null },
  ];

  // Number of cards to scroll at a time (1 by 1)
  // Max index is calculated so we don't scroll into empty space.
  // Assuming a standard screen fits about 3-4 cards. 
  // We'll calculate maxIndex based on total cards. Let's say we leave 3 cards visible at the end.
  const maxIndex = Math.max(0, cards.length - 3);

  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) return 0; // Rewind to start smoothly
        return prev + 1;
      });
    }, 4000);
    
    return () => clearInterval(timer);
  }, [isHovered, maxIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="mobile-padding"
      style={{ padding: '0 48px', marginTop: '60px', width: '100%', maxWidth: '1600px', margin: '60px auto 0 auto' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'var(--gold-primary)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C12 22 4 16 4 10C4 6 7 2 12 2C17 2 20 6 20 10C20 16 12 22 12 22ZM12 18C15 14 17 10 17 8C17 5.5 15 4 12 4C9 4 7 5.5 7 8C7 10 9 14 12 18Z" opacity="0.3"/>
              <path d="M12 22C12 22 8 16 8 11C8 8 9.5 6 12 6C14.5 6 16 8 16 11C16 16 12 22 12 22Z"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: '400', fontFamily: 'var(--font-serif)' }}>ධර්ම ලෝකයන්</h3>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handlePrev} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={handleNext} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Overflow container for the track */}
      <motion.div ref={containerRef} style={{ width: '100%', overflow: 'hidden', paddingBottom: '20px', cursor: 'grab' }} whileTap={{ cursor: 'grabbing' }}>
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x;
            if (swipe < -10000) handleNext();
            else if (swipe > 10000) handlePrev();
          }}
          animate={{ x: -(currentIndex * 260) }} // 240px width + 20px gap
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.6 }}
          style={{ display: 'flex', gap: '20px', width: 'max-content' }}
        >
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              onClick={() => card.path && navigate(card.path)}
              style={{
                width: '240px',
                height: '280px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '24px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background: '#11141a' // fallback
              }}
              className="carousel-card"
            >
              {/* Background Image Layer */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${card.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.5s ease'
              }} className="card-bg-img" />

              {/* Gradient Overlay for Text Readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.9) 100%)',
                zIndex: 1
              }} />

              <div style={{ position: 'relative', zIndex: 2 }}>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: '400', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>{card.title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.4' }}>{card.subtitle}</p>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-main)', backdropFilter: 'blur(4px)'
                }}>
                  <ChevronRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
