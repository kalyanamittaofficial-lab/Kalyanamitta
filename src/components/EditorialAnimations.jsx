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
    {/* Lotus - Symbol of purity and Kalyanamitta guiding to bloom */}
    <motion.path d="M 30 75 Q 50 85 70 75" fill="none" stroke={color} strokeWidth="2" variants={draw} custom={0} />
    <motion.path d="M 50 78 C 35 60 40 25 50 15 C 60 25 65 60 50 78 Z" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={1} />
    <motion.path d="M 45 70 C 20 60 15 35 25 30 C 35 25 40 45 45 60" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={2} />
    <motion.path d="M 55 70 C 80 60 85 35 75 30 C 65 25 60 45 55 60" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={3} />
    <motion.path d="M 38 72 C 10 70 5 50 10 45 C 15 40 25 55 35 65" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={4} />
    <motion.path d="M 62 72 C 90 70 95 50 90 45 C 85 40 75 55 65 65" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={5} />
  </motion.svg>
);

export const AnimationTwo = ({ color = 'var(--gold-primary, var(--primary))' }) => (
  <motion.svg width="120" height="120" viewBox="0 0 100 100" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20%" }}>
    {/* Bodhi Leaf - Symbol of Enlightenment / Nirvana */}
    <motion.path d="M 50 80 C 10 80 0 50 15 35 C 30 20 45 20 50 5 C 55 20 70 20 85 35 C 100 50 90 80 50 80 Z" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={0} />
    <motion.path d="M 50 80 C 48 85 45 90 45 95" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={1} />
    <motion.path d="M 50 80 C 52 60 48 30 50 15" fill="none" stroke={color} strokeWidth="1" variants={draw} custom={2} />
    <motion.path d="M 50 65 Q 35 60 25 55 M 50 65 Q 65 60 75 55" fill="none" stroke={color} strokeWidth="0.75" variants={draw} custom={3} />
    <motion.path d="M 50 50 Q 35 45 25 35 M 50 50 Q 65 45 75 35" fill="none" stroke={color} strokeWidth="0.75" variants={draw} custom={4} />
    <motion.path d="M 50 35 Q 40 30 35 25 M 50 35 Q 60 30 65 25" fill="none" stroke={color} strokeWidth="0.75" variants={draw} custom={5} />
  </motion.svg>
);

export const AnimationThree = ({ color = 'var(--gold-primary, var(--primary))' }) => (
  <motion.svg width="120" height="120" viewBox="0 0 100 100" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20%" }}>
    {/* Dharma Chakra - Symbol of the Path and 4 Factors */}
    <motion.circle cx="50" cy="50" r="35" fill="none" stroke={color} strokeWidth="2" variants={draw} custom={0} />
    <motion.circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="1" variants={draw} custom={1} />
    <motion.circle cx="50" cy="50" r="8" fill="none" stroke={color} strokeWidth="2" variants={draw} custom={2} />
    {[...Array(8)].map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x1 = 50 + 8 * Math.cos(angle);
      const y1 = 50 + 8 * Math.sin(angle);
      const x2 = 50 + 30 * Math.cos(angle);
      const y2 = 50 + 30 * Math.sin(angle);
      return <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" variants={draw} custom={3 + (i % 2)} />
    })}
  </motion.svg>
);

export const AnimationFour = ({ color = 'var(--gold-primary, var(--primary))' }) => (
  <motion.svg width="120" height="120" viewBox="0 0 100 100" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20%" }}>
    {/* Stupa - Symbol of the ultimate goal and guidance */}
    <motion.path d="M 20 85 L 80 85" fill="none" stroke={color} strokeWidth="2" variants={draw} custom={0} />
    <motion.path d="M 25 78 L 75 78" fill="none" stroke={color} strokeWidth="2" variants={draw} custom={1} />
    <motion.path d="M 30 71 L 70 71" fill="none" stroke={color} strokeWidth="2" variants={draw} custom={2} />
    <motion.path d="M 30 71 C 30 35 70 35 70 71" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={3} />
    <motion.path d="M 42 41 L 42 32 L 58 32 L 58 41" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={4} />
    <motion.path d="M 45 32 L 45 22 L 55 22 L 55 32" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={5} />
    <motion.path d="M 45 22 L 50 8 L 55 22 Z" fill="none" stroke={color} strokeWidth="1.5" variants={draw} custom={6} />
    <motion.circle cx="50" cy="5" r="2" fill={color} initial={{ opacity: 0 }} whileInView={{ opacity: 0.8 }} transition={{ delay: 3 }} />
  </motion.svg>
);
