import React from 'react';
import { motion } from 'framer-motion';

export default function HeroLotusAnimation({ color = 'var(--gold-primary, var(--primary))', size = 500 }) {
  
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom) => ({
      pathLength: 1,
      opacity: custom.op || 0.85,
      transition: {
        pathLength: { delay: custom.delay, duration: 2.5, ease: "easeInOut" },
        opacity: { delay: custom.delay, duration: 0.5 }
      }
    })
  };

  const petalVariants = {
    hidden: { pathLength: 0, opacity: 0, scale: 0.2 },
    visible: (custom) => ({
      pathLength: 1,
      opacity: 0.85,
      scale: 1,
      transition: {
        pathLength: { delay: custom.delay, duration: 2.5, ease: "easeInOut" },
        opacity: { delay: custom.delay, duration: 0.5 },
        scale: { delay: custom.delay, duration: 3, type: "spring", stiffness: 30, damping: 10 }
      }
    })
  };

  // Reusable Lotus Component
  const Lotus = ({ x, y, delay, scale = 1, opacity = 1 }) => (
    <motion.g 
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ delay: delay, duration: 1 }}
      style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }}
    >
      <g style={{ transformOrigin: '0px 0px' }}>
        {/* Back Petals */}
        <motion.path d="M 0 0 C -40 -10 -60 -50 -35 -70 C -20 -50 -10 -20 0 0 Z" fill="none" stroke={color} strokeWidth="1.5" variants={petalVariants} custom={{ delay: delay + 0.5 }} />
        <motion.path d="M 0 0 C 40 -10 60 -50 35 -70 C 20 -50 10 -20 0 0 Z" fill="none" stroke={color} strokeWidth="1.5" variants={petalVariants} custom={{ delay: delay + 0.5 }} />
        
        {/* Outer Drooping */}
        <motion.path d="M 0 0 C -50 5 -75 -25 -65 -45 C -45 -25 -25 -5 0 0" fill="none" stroke={color} strokeWidth="1.5" variants={petalVariants} custom={{ delay: delay + 1.5 }} />
        <motion.path d="M 0 0 C 50 5 75 -25 65 -45 C 45 -25 25 -5 0 0" fill="none" stroke={color} strokeWidth="1.5" variants={petalVariants} custom={{ delay: delay + 1.5 }} />
        
        {/* Inner Front */}
        <motion.path d="M 0 0 C -30 -20 -45 -60 -30 -75 C -15 -55 -10 -20 0 0 Z" fill="none" stroke={color} strokeWidth="1.5" variants={petalVariants} custom={{ delay: delay + 2 }} />
        <motion.path d="M 0 0 C 30 -20 45 -60 30 -75 C 15 -55 10 -20 0 0 Z" fill="none" stroke={color} strokeWidth="1.5" variants={petalVariants} custom={{ delay: delay + 2 }} />
        
        {/* Central Main */}
        <motion.path d="M 0 0 C -20 -45 -10 -100 0 -110 C 10 -100 20 -45 0 0 Z" fill="none" stroke={color} strokeWidth="2.5" variants={petalVariants} custom={{ delay: delay + 2.5 }} />
      </g>
    </motion.g>
  );

  return (
    <div style={{ width: '100%', maxWidth: size, margin: '0 auto', marginBottom: '2rem' }}>
      <motion.svg 
        width="100%" height="100%" 
        viewBox="0 0 400 300" 
        initial="hidden" 
        animate="visible"
        style={{ overflow: 'visible' }}
      >
        
        {/* ============================== */}
        {/* 1. THE WATER RIPPLES (Bottom)  */}
        {/* ============================== */}
        {[
          { cx: 200, cy: 280, rx: 80, delay: 0 },
          { cx: 200, cy: 288, rx: 120, delay: 1 },
          { cx: 200, cy: 296, rx: 160, delay: 2 },
        ].map((ripple, i) => (
          <motion.ellipse
            key={`ripple-${i}`}
            cx={ripple.cx} cy={ripple.cy}
            rx={ripple.rx} ry={4}
            fill="none" stroke={color} strokeWidth="1"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1.2, 0.8, 1], opacity: [0, 0.5, 0.1, 0.4] }}
            transition={{ delay: ripple.delay, duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        ))}

        {/* ============================== */}
        {/* 2. SECONDARY LOTUSES (Bottom)  */}
        {/* ============================== */}
        {/* Left Secondary Lotus Stem */}
        <motion.path d="M 80 280 Q 75 230 80 180" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={{ delay: 8, op: 0.6 }} />
        {/* Right Secondary Lotus Stem */}
        <motion.path d="M 320 280 Q 325 230 320 180" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={{ delay: 9, op: 0.6 }} />
        
        <Lotus x={80} y={180} scale={0.65} delay={9} opacity={0.7} />
        <Lotus x={320} y={180} scale={0.65} delay={10} opacity={0.7} />

        {/* ============================== */}
        {/* 3. PRIMARY LOTUS (Center Top)  */}
        {/* ============================== */}
        {/* Main Tall Stem */}
        <motion.path 
          d="M 200 280 Q 205 200 200 120" 
          fill="none" stroke={color} strokeWidth="2.5" 
          variants={draw} custom={{ delay: 0.5 }} 
        />
        
        {/* Primary Lotus Blooms at y=120 */}
        <Lotus x={200} y={120} scale={1.1} delay={2} />

        {/* ============================== */}
        {/* 4. EMERGING DHARMA CHAKRA      */}
        {/* ============================== */}
        {/* It rises completely out of the lotus (from y=100 up to y=10) */}
        <motion.g
          initial={{ y: 100, scale: 0.2, opacity: 0 }}
          animate={{ y: -30, scale: 1, opacity: 0.9, rotate: 360 }}
          transition={{
            y: { delay: 5.5, duration: 4, ease: [0.2, 0.8, 0.2, 1] },
            scale: { delay: 5.5, duration: 4, type: "spring", stiffness: 30 },
            opacity: { delay: 5.5, duration: 2 },
            rotate: { delay: 8, duration: 40, repeat: Infinity, ease: "linear" }
          }}
          style={{ transformOrigin: '200px 40px' }}
        >
          <circle cx="200" cy="40" r="35" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="200" cy="40" r="28" fill="none" stroke={color} strokeWidth="1" />
          <circle cx="200" cy="40" r="7" fill="none" stroke={color} strokeWidth="2" />
          
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = 200 + 7 * Math.cos(angle);
            const y1 = 40 + 7 * Math.sin(angle);
            const x2 = 200 + 28 * Math.cos(angle);
            const y2 = 40 + 28 * Math.sin(angle);
            return <line key={`spoke-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" />
          })}
        </motion.g>
        
      </motion.svg>
    </div>
  );
}
