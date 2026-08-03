import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export default function Life() {
  return (
    <div
      style={{
        padding: '120px 48px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        background: 'var(--bg-main)',
        minHeight: '100vh'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary)' }}>
        <Compass size={48} strokeWidth={1.5} />
      </div>
      <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', marginBottom: '16px', color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>
        ජීවිතයට ධර්මය
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', letterSpacing: '0.05em', marginBottom: '60px', lineHeight: '1.6', fontFamily: 'var(--font-sinhala)' }}>
        ජීවිත ගැටලු වලට ධර්මයෙන් පිළිතුරු සොයන්න.
      </p>
      <div style={{
        background: 'var(--bg-secondary)', 
        border: '1px solid rgba(0,0,0,0.05)', borderRadius: '4px',
        padding: '60px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
      }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '16px', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>මෙහි අන්තර්ගතය ගොඩනැගෙමින් පවතී</h2>
      </div>
    </div>
  );
}
