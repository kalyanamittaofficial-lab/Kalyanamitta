import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BodhiLeaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Generate static initial positions to prevent hydration mismatch,
    // but we are pure client side so it's fine.
    const newLeaves = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: -(Math.random() * 100), // start above screen
      duration: 15 + Math.random() * 20, // super slow
      delay: Math.random() * 10,
      scale: 0.3 + Math.random() * 0.4,
      rotation: Math.random() * 360
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5, overflow: 'hidden' }}>
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{
            x: `${leaf.x}vw`,
            y: `${leaf.y}vh`,
            rotate: leaf.rotation,
            opacity: 0,
            scale: leaf.scale
          }}
          animate={{
            y: '120vh',
            x: [`${leaf.x}vw`, `${leaf.x + 5}vw`, `${leaf.x - 5}vw`, `${leaf.x}vw`],
            rotate: leaf.rotation + 360,
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: '30px',
            height: '40px',
            background: 'radial-gradient(ellipse at bottom, rgba(255, 180, 50, 0.4), transparent)',
            borderRadius: '50% 0 50% 50%',
            filter: 'blur(2px)'
          }}
        />
      ))}
    </div>
  );
}
