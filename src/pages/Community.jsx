import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function Community() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '120px 48px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: 'var(--gold-primary)' }}>
        <Users size={48} strokeWidth={1} />
      </div>
      <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', marginBottom: '16px', color: 'var(--gold-primary)' }}>
        කල්‍යාණ මිත්‍රත්වය
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', letterSpacing: '0.05em', marginBottom: '60px', lineHeight: '1.6' }}>
        ධර්ම සාකච්ඡා සහ සංවාද.
      </p>
      <div style={{
        background: 'var(--glass-bg)', backdropFilter: 'blur(var(--glass-blur))',
        border: '1px solid var(--glass-border)', borderRadius: '24px',
        padding: '60px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
      }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '16px' }}>මෙහි අන්තර්ගතය ගොඩනැගෙමින් පවතී</h2>
      </div>
    </motion.div>
  );
}
