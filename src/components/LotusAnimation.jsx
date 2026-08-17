import React from 'react';
import { motion } from 'framer-motion';

export default function LotusAnimation({ width = 120, height = 120, color = 'var(--primary)' }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => {
      const delay = 0.5 + i * 0.4;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration: 2.5, bounce: 0 },
          opacity: { delay, duration: 0.01 }
        }
      };
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ overflow: 'visible' }}
      >
        {/* Base / Water line */}
        <motion.path
          d="M 20 95 L 80 95"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          custom={4}
          variants={draw}
        />

        {/* Center Petal */}
        <motion.path
          d="M 50 15 C 65 40, 70 70, 50 90 C 30 70, 35 40, 50 15 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          custom={0}
          variants={draw}
        />
        
        {/* Left Petal 1 */}
        <motion.path
          d="M 50 90 C 20 80, 10 50, 20 35 C 30 45, 40 60, 50 90 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          custom={1}
          variants={draw}
        />
        
        {/* Right Petal 1 */}
        <motion.path
          d="M 50 90 C 80 80, 90 50, 80 35 C 70 45, 60 60, 50 90 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          custom={1}
          variants={draw}
        />
        
        {/* Left Petal 2 */}
        <motion.path
          d="M 50 90 C 10 85, -5 65, 5 55 C 15 65, 30 80, 50 90 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          custom={2}
          variants={draw}
        />
        
        {/* Right Petal 2 */}
        <motion.path
          d="M 50 90 C 90 85, 105 65, 95 55 C 85 65, 70 80, 50 90 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          custom={2}
          variants={draw}
        />

        {/* Subtle glowing fill after drawing */}
        <motion.path
          d="M 50 15 C 65 40, 70 70, 50 90 C 30 70, 35 40, 50 15 Z M 50 90 C 20 80, 10 50, 20 35 C 30 45, 40 60, 50 90 Z M 50 90 C 80 80, 90 50, 80 35 C 70 45, 60 60, 50 90 Z"
          fill={color}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.08 }}
          viewport={{ once: true }}
          transition={{ delay: 3, duration: 2 }}
        />
      </motion.svg>
    </div>
  );
}
