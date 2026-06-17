import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ title, subtitle, icon, onClick, delay = 0, className = "" }) {
  const isLarge = className.includes('bento-large');
  const isTall = className.includes('bento-tall');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 1.2, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`glass-panel ${className}`}
      onClick={onClick}
      style={{
        padding: isLarge ? '60px 40px' : '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isLarge ? 'flex-start' : 'center',
        justifyContent: isLarge ? 'flex-end' : 'center',
        cursor: 'pointer',
        gap: isLarge ? '20px' : '16px',
        textAlign: isLarge ? 'left' : 'center',
        transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
      whileHover={{
        y: -5,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)'
      }}
      whileTap={{ scale: 0.97 }}
    >
      {icon && (
        <div style={{ 
          color: 'var(--text-primary)', 
          opacity: 0.8,
          marginBottom: isLarge ? '10px' : '0',
          position: isLarge ? 'absolute' : 'static',
          top: isLarge ? '40px' : 'auto',
          left: isLarge ? '40px' : 'auto'
        }}>
          {icon}
        </div>
      )}
      <div style={{ zIndex: 2 }}>
        <h3 style={{ 
          fontSize: isLarge ? '2.5rem' : '1.25rem', 
          fontWeight: isLarge ? '300' : '400', 
          color: 'var(--text-primary)', 
          letterSpacing: '0.02em',
          lineHeight: '1.2'
        }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ 
            fontSize: isLarge ? '1.1rem' : '0.85rem', 
            color: 'var(--text-secondary)', 
            fontWeight: '300', 
            letterSpacing: '0.04em',
            marginTop: '8px'
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {/* Subtle hover glow effect built into the card */}
      <motion.div 
        className="card-glow"
        style={{
          position: 'absolute',
          top: '-50%', left: '-50%',
          width: '200%', height: '200%',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, transparent 60%)',
          opacity: 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
          zIndex: 0
        }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
}
