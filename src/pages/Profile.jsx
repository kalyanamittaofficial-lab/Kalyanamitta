import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function Profile() {
  return (
    <div
      style={{
        padding: '120px 48px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        background: 'var(--bg-main)',
        minHeight: '100vh'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary)' }}>
        <User size={48} strokeWidth={1.5} />
      </div>
      <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', marginBottom: '16px', color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>
        ඔබගේ ගිණුම
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', letterSpacing: '0.05em', marginBottom: '40px', lineHeight: '1.6', fontFamily: 'var(--font-sinhala)' }}>
        පුද්ගලික ධර්ම සටහන් සහ ඉතිහාසය පවත්වා ගන්න.
      </p>
      <div style={{
        background: 'var(--bg-secondary)', 
        border: '1px solid rgba(0,0,0,0.05)', borderRadius: '4px',
        padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
      }}>
        <input type="email" placeholder="විද්‍යුත් තැපෑල (Email)" style={{ width: '100%', padding: '16px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'var(--font-sinhala)', outline: 'none' }} />
        <input type="password" placeholder="මුරපදය (Password)" style={{ width: '100%', padding: '16px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '1rem', fontFamily: 'var(--font-sinhala)', outline: 'none' }} />
        <button style={{ width: '100%', padding: '16px', borderRadius: '4px', background: 'var(--primary)', color: 'white', fontSize: '1.1rem', fontWeight: '600', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sinhala)', transition: 'opacity 0.2s' }}>
          ඇතුල් වන්න
        </button>
      </div>
    </div>
  );
}
