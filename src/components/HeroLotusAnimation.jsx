import React from 'react';
import { motion } from 'framer-motion';

export default function HeroLotusAnimation({ color = 'var(--gold-primary, var(--primary))', size = '100%' }) {
  
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
    <div style={{ width: size, maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
      <motion.svg 
        width="100%" height="100%" 
        viewBox="0 -100 1000 400" 
        initial="hidden" 
        animate="visible"
        style={{ overflow: 'visible' }}
      >
        
        {/* ============================== */}
        {/* 1. THE WATER RIPPLES (Bottom)  */}
        {/* ============================== */}
        {[
          { cx: 500, cy: 250, rx: 120, delay: 0 },
          { cx: 500, cy: 258, rx: 180, delay: 1 },
          { cx: 500, cy: 266, rx: 240, delay: 2 },
          // Ripples under left lotus
          { cx: 150, cy: 250, rx: 60, delay: 7.5 },
          { cx: 150, cy: 258, rx: 90, delay: 8.5 },
          // Ripples under right lotus
          { cx: 850, cy: 250, rx: 60, delay: 8.5 },
          { cx: 850, cy: 258, rx: 90, delay: 9.5 },
        ].map((ripple, i) => (
          <motion.ellipse
            key={`ripple-${i}`}
            cx={ripple.cx} cy={ripple.cy}
            rx={ripple.rx} ry={5}
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
        <motion.path d="M 150 250 Q 145 200 150 150" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={{ delay: 8, op: 0.7 }} />
        {/* Right Secondary Lotus Stem */}
        <motion.path d="M 850 250 Q 855 200 850 150" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={{ delay: 9, op: 0.7 }} />
        
        {/* Side Lotuses placed far left and right */}
        <Lotus x={150} y={150} scale={0.7} delay={9} opacity={0.8} />
        <Lotus x={850} y={150} scale={0.7} delay={10} opacity={0.8} />

        {/* ============================== */}
        {/* 3. PRIMARY LOTUS (Center)      */}
        {/* ============================== */}
        {/* Main Tall Stem */}
        <motion.path 
          d="M 500 250 Q 505 185 500 120" 
          fill="none" stroke={color} strokeWidth="2.5" 
          variants={draw} custom={{ delay: 0.5 }} 
        />
        
        {/* Primary Lotus Blooms */}
        <Lotus x={500} y={120} scale={1.1} delay={2} />

        {/* ============================== */}
        {/* 4. EMERGING DHARMA CHAKRA      */}
        {/* ============================== */}
        {/* Chakra rises COMPLETELY out of the main lotus. */}
        {/* Top of lotus is roughly y = -1 (120 - 110*1.1). Chakra center ends at y = -50, bottom is -15, leaving a gap! */}
        <motion.g
          initial={{ y: 170, scale: 0.2, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 0.9, rotate: 360 }}
          transition={{
            y: { delay: 5.5, duration: 4, ease: [0.2, 0.8, 0.2, 1] },
            scale: { delay: 5.5, duration: 4, type: "spring", stiffness: 30 },
            opacity: { delay: 5.5, duration: 2 },
            rotate: { delay: 8, duration: 40, repeat: Infinity, ease: "linear" }
          }}
          style={{ transformOrigin: '500px -50px' }}
        >
          <circle cx="500" cy="-50" r="35" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="500" cy="-50" r="28" fill="none" stroke={color} strokeWidth="1" />
          <circle cx="500" cy="-50" r="7" fill="none" stroke={color} strokeWidth="2" />
          
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = 500 + 7 * Math.cos(angle);
            const y1 = -50 + 7 * Math.sin(angle);
            const x2 = 500 + 28 * Math.cos(angle);
            const y2 = -50 + 28 * Math.sin(angle);
            return <line key={`spoke-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" />
          })}
        </motion.g>
        
      </motion.svg>
    </div>
  );
}
