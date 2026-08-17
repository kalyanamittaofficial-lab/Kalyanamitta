import React from 'react';
import { motion } from 'framer-motion';

export default function HeroLotusAnimation({ color = 'var(--gold-primary, var(--primary))', size = 260 }) {
  
  // Animation for the drawing effect of the petals
  const petalVariants = {
    hidden: { pathLength: 0, opacity: 0, scale: 0.2 },
    visible: (custom) => ({
      pathLength: 1,
      opacity: 0.85,
      scale: 1,
      transition: {
        pathLength: { delay: custom.delay, duration: 2.5, ease: "easeInOut" },
        opacity: { delay: custom.delay, duration: 0.5 },
        scale: { delay: custom.delay, type: "spring", stiffness: 30, damping: 10 }
      }
    })
  };

  return (
    <div style={{ width: size, height: size, margin: '0 auto', marginBottom: '2rem' }}>
      <motion.svg 
        width="100%" height="100%" 
        viewBox="0 0 200 200" 
        initial="hidden" 
        animate="visible"
        style={{ overflow: 'visible' }}
      >
        
        {/* ============================== */}
        {/* 1. THE WATER RIPPLES (Bottom)  */}
        {/* ============================== */}
        {[
          { cx: 100, cy: 175, rx: 40, delay: 0 },
          { cx: 100, cy: 182, rx: 65, delay: 1 },
          { cx: 100, cy: 189, rx: 90, delay: 2 },
        ].map((ripple, i) => (
          <motion.ellipse
            key={`ripple-${i}`}
            cx={ripple.cx} cy={ripple.cy}
            rx={ripple.rx} ry={2.5}
            fill="none" stroke={color} strokeWidth="1"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: [0, 1.2, 0.8, 1],
              opacity: [0, 0.5, 0.1, 0.4] 
            }}
            transition={{
              delay: ripple.delay,
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}

        {/* ============================== */}
        {/* 2. THE BLOOMING LOTUS (Back)   */}
        {/* ============================== */}
        {/* Stem */}
        <motion.path 
          d="M 100 190 Q 103 175 100 160" 
          fill="none" stroke={color} strokeWidth="2" 
          variants={petalVariants} custom={{ delay: 0.5 }} 
        />
        
        <g style={{ transformOrigin: '100px 160px' }}>
          {/* Back Left Petal */}
          <motion.path 
            d="M 100 160 C 60 150 40 110 65 90 C 80 110 90 140 100 160 Z" 
            fill="none" stroke={color} strokeWidth="1.5" 
            variants={petalVariants} custom={{ delay: 1.5 }} 
          />
          {/* Back Right Petal */}
          <motion.path 
            d="M 100 160 C 140 150 160 110 135 90 C 120 110 110 140 100 160 Z" 
            fill="none" stroke={color} strokeWidth="1.5" 
            variants={petalVariants} custom={{ delay: 1.5 }} 
          />
        </g>

        {/* ============================== */}
        {/* 3. EMERGING DHARMA CHAKRA      */}
        {/* ============================== */}
        <motion.g
          initial={{ y: 60, scale: 0.2, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 0.9, rotate: 360 }}
          transition={{
            y: { delay: 4, duration: 4, ease: [0.2, 0.8, 0.2, 1] },
            scale: { delay: 4, duration: 4, type: "spring", stiffness: 40 },
            opacity: { delay: 4, duration: 2 },
            rotate: { delay: 6, duration: 60, repeat: Infinity, ease: "linear" }
          }}
          style={{ transformOrigin: '100px 80px' }}
        >
          {/* Inner & Outer Rings */}
          <circle cx="100" cy="80" r="35" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="100" cy="80" r="28" fill="none" stroke={color} strokeWidth="1" />
          <circle cx="100" cy="80" r="7" fill="none" stroke={color} strokeWidth="2" />
          
          {/* 8 Spokes */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = 100 + 7 * Math.cos(angle);
            const y1 = 80 + 7 * Math.sin(angle);
            const x2 = 100 + 28 * Math.cos(angle);
            const y2 = 80 + 28 * Math.sin(angle);
            return <line key={`spoke-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" />
          })}
        </motion.g>

        {/* ============================== */}
        {/* 4. THE BLOOMING LOTUS (Front)  */}
        {/* ============================== */}
        <g style={{ transformOrigin: '100px 160px' }}>
          {/* Outer Drooping Left */}
          <motion.path 
            d="M 100 160 C 50 165 25 135 35 115 C 55 135 75 155 100 160" 
            fill="none" stroke={color} strokeWidth="1.5" 
            variants={petalVariants} custom={{ delay: 2.5 }} 
          />
          {/* Outer Drooping Right */}
          <motion.path 
            d="M 100 160 C 150 165 175 135 165 115 C 145 135 125 155 100 160" 
            fill="none" stroke={color} strokeWidth="1.5" 
            variants={petalVariants} custom={{ delay: 2.5 }} 
          />
          
          {/* Inner Front Left */}
          <motion.path 
            d="M 100 160 C 70 140 55 100 70 85 C 85 105 90 140 100 160 Z" 
            fill="none" stroke={color} strokeWidth="1.5" 
            variants={petalVariants} custom={{ delay: 3 }} 
          />
          {/* Inner Front Right */}
          <motion.path 
            d="M 100 160 C 130 140 145 100 130 85 C 115 105 110 140 100 160 Z" 
            fill="none" stroke={color} strokeWidth="1.5" 
            variants={petalVariants} custom={{ delay: 3 }} 
          />
          
          {/* Central Main Petal */}
          <motion.path 
            d="M 100 160 C 80 115 90 60 100 50 C 110 60 120 115 100 160 Z" 
            fill="none" stroke={color} strokeWidth="2.5" 
            variants={petalVariants} custom={{ delay: 3.5 }} 
          />
        </g>
        
      </motion.svg>
    </div>
  );
}
