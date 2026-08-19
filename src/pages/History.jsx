import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { historyData } from '../data/historyData';

export default function History() {
  const [activeId, setActiveId] = useState(historyData[0].id);
  const [hoveredId, setHoveredId] = useState(null);
  const activeData = historyData.find(d => d.id === activeId) || historyData[0];
  const navigate = useNavigate();

  useEffect(() => {
    // Hide overflow on body to prevent scrolling when in this cinematic view
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: 'var(--bg-main)' }}>
      
      {/* ── Dynamic Background Image ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${activeData.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
      </AnimatePresence>

      {/* ── Theme-Aware Overlay ── */}
      {/* This ensures text is readable in both light and dark modes while letting the image peek through */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--bg-main)',
        opacity: 0.65, // Let the image show through
        zIndex: 5
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, var(--bg-main) 0%, transparent 60%)',
        zIndex: 6
      }} />
      
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, var(--bg-main) 0%, transparent 50%)',
        zIndex: 6
      }} />

      {/* ── Main Content Layer ── */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 40px 100px 40px', // Increased bottom padding
        paddingTop: '70px' 
      }}>
        
        {/* Title Area */}
        <div style={{ marginTop: '0px', marginBottom: 'auto' }}>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              fontSize: '3.5rem', 
              color: 'var(--text-main)', 
              margin: 0,
              fontWeight: 700
            }}
          >
            බෞද්ධ ඉතිහාසය
          </motion.h1>
        </div>

        {/* Carousel / Navigation area */}
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
          {historyData.map((category) => {
            const isActive = activeId === category.id;
            const isHovered = hoveredId === category.id;

            return (
              <motion.div
                key={category.id}
                layout
                onClick={() => setActiveId(category.id)}
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  height: '420px',
                  minWidth: isActive ? 'min(600px, 85vw)' : 'min(100px, 15vw)',
                  background: (!isActive && isHovered) ? 'var(--bg-secondary)' : 'var(--glass-bg)',
                  backdropFilter: 'blur(var(--glass-blur, 16px))',
                  border: `1px solid var(--glass-border)`,
                  borderRadius: '16px',
                  cursor: isActive ? 'default' : 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: isActive ? 'column' : 'row',
                  transition: 'background-color 0.3s ease, min-width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              >
                {/* INACTIVE STATE */}
                {!isActive && (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    padding: '20px 0' 
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 700 }}>
                      {category.chapter}
                    </span>
                    <div style={{ flex: 1, position: 'relative', width: '100%' }}>
                      <span style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(-90deg)',
                        whiteSpace: 'nowrap',
                        color: 'var(--text-main)',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        letterSpacing: '2px'
                      }}>
                        {category.title}
                      </span>
                    </div>
                  </div>
                )}

                {/* ACTIVE STATE */}
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <span style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '3px' }}>
                      පරිච්ඡේදය {category.chapter}
                    </span>
                    <h2 style={{ color: 'var(--text-main)', fontSize: '2.2rem', margin: '10px 0 24px 0' }}>
                      {category.title}
                    </h2>

                    <div style={{ flex: 1, paddingRight: '10px' }}>
                      <p style={{ 
                        color: 'var(--text-muted)', 
                        fontSize: '1.1rem', 
                        lineHeight: 1.8, 
                        margin: 0 
                      }}>
                        {category.description}
                      </p>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
                      <button 
                        onClick={() => navigate(`/history/${category.id}`)}
                        style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'transform 0.2s, filter 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        කියවන්න <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
