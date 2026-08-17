import React from 'react';
import { motion } from 'framer-motion';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => {
    const delay = 0.5 + i * 0.5;
    return {
      pathLength: 1,
      opacity: 0.6,
      transition: {
        pathLength: { delay, type: "tween", duration: 2.5, ease: "easeInOut" },
        opacity: { delay, duration: 0.01 }
      }
    };
  }
};

export const AnimationOne = ({ color = 'var(--gold-primary, var(--primary))' }) => (
  <motion.svg width="120" height="120" viewBox="0 0 100 100" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20%" }}>
    {/* Interlocking Rings - Connection/Kalyanamitta */}
    <motion.circle cx="35" cy="50" r="22" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={0} />
    <motion.circle cx="65" cy="50" r="22" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={1} />
    {/* Central Spark / Light */}
    <motion.path d="M 50 35 L 53 45 L 63 48 L 53 51 L 50 61 L 47 51 L 37 48 L 47 45 Z" fill="none" stroke={color} strokeWidth="1" variants={draw} custom={2} />
    <motion.circle cx="50" cy="48" r="2" fill={color} initial={{ opacity: 0 }} whileInView={{ opacity: 0.8 }} transition={{ delay: 2.5 }} />
  </motion.svg>
);

export const AnimationTwo = ({ color = 'var(--gold-primary, var(--primary))' }) => (
  <motion.svg width="120" height="120" viewBox="0 0 100 100" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20%" }}>
    {/* Samsara Cycle - Endless Knot breaking */}
    <motion.path d="M 30 70 C 10 70, 10 30, 30 30 C 50 30, 50 70, 70 70 C 90 70, 90 30, 70 30 C 60 30, 50 40, 50 50" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={0} />
    {/* Liberation Line pointing Up */}
    <motion.path d="M 50 50 L 50 15 L 45 22 M 50 15 L 55 22" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={1} />
    <motion.circle cx="50" cy="50" r="3" fill={color} initial={{ opacity: 0 }} whileInView={{ opacity: 0.8 }} transition={{ delay: 2 }} />
  </motion.svg>
);

export const AnimationThree = ({ color = 'var(--gold-primary, var(--primary))' }) => (
  <motion.svg width="120" height="120" viewBox="0 0 100 100" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20%" }}>
    {/* 4 Factors of Stream Entry / Compass of Guidance */}
    <motion.circle cx="50" cy="50" r="30" strokeDasharray="3 4" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={0} />
    <motion.line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="1.5" variants={draw} custom={1} />
    <motion.line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="1.5" variants={draw} custom={2} />
    <motion.circle cx="50" cy="50" r="25" fill="none" stroke={color} strokeWidth="0.5" variants={draw} custom={3} />
    <motion.circle cx="50" cy="50" r="5" fill={color} initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }} transition={{ delay: 2.5 }} />
  </motion.svg>
);

export const AnimationFour = ({ color = 'var(--gold-primary, var(--primary))' }) => (
  <motion.svg width="120" height="120" viewBox="0 0 100 100" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20%" }}>
    {/* Noble Eightfold Path / Radiant Eight-Pointed Star */}
    <motion.path d="M 50 15 L 55 42 L 85 50 L 55 58 L 50 85 L 45 58 L 15 50 L 45 42 Z" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={0} />
    <motion.path d="M 25 25 L 42 42 M 75 25 L 58 42 M 75 75 L 58 58 M 25 75 L 42 58" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={1} />
    <motion.circle cx="50" cy="50" r="15" fill="none" stroke={color} strokeWidth="0.5" variants={draw} custom={2} />
  </motion.svg>
);
