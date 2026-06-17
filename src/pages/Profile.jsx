import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function Profile() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '120px 48px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: 'var(--gold-primary)' }}>
        <User size={48} strokeWidth={1} />
      </div>
      <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', marginBottom: '16px', color: 'var(--gold-primary)' }}>
        ඔබගේ ගිණුම
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', letterSpacing: '0.05em', marginBottom: '40px', lineHeight: '1.6' }}>
        පුද්ගලික ධර්ම සටහන් සහ ඉතිහාසය පවත්වා ගන්න.
      </p>
      <div style={{
        background: 'var(--glass-bg)', backdropFilter: 'blur(var(--glass-blur))',
        border: '1px solid var(--glass-border)', borderRadius: '24px',
        padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        gap: '20px'
      }}>
        <input type="email" placeholder="විද්‍යුත් තැපෑල (Email)" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '1rem' }} />
        <input type="password" placeholder="මුරපදය (Password)" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '1rem' }} />
        <button style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--gold-primary)', color: 'black', fontSize: '1.1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          ඇතුල් වන්න
        </button>
      </div>
    </motion.div>
  );
}
