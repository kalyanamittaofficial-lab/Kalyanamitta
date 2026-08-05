import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function Community() {
  return (
    <div
      style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', background: 'var(--bg-main)' }}
    >
      {/* Main Content Wrapper */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, padding: '5vh 48px 120px 48px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Hero Text */}
        <div 
          className="text-center-mobile" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: '0 auto 10vh auto', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '40px' }}
        >
          <h1 style={{
            fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: '700',
            color: 'var(--primary)', fontFamily: 'var(--font-serif)',
            marginBottom: '16px', letterSpacing: '-0.02em'
          }}>කල්‍යාණ මිත්‍රත්වය</h1>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '32px', letterSpacing: '0.05em', fontWeight: '600', fontFamily: 'var(--font-sinhala)' }}>
            ධර්ම සාකච්ඡා සහ සංවාද.
          </p>

          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', fontFamily: 'var(--font-sinhala)', maxWidth: '650px' }}>
            <p>
              සමාන අදහස් ඇති ධර්ම මිතුරන් සමඟ එක්ව අදහස් හුවමාරු කරගන්න. ධර්මය සාකච්ඡා කරමින් දහම් මඟෙහි ඉදිරියටම යන්න.
            </p>
          </div>
        </div>
      <div style={{
        background: 'var(--bg-secondary)', 
        border: '1px solid rgba(0,0,0,0.05)', borderRadius: '4px',
        padding: '60px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
      }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '16px', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>මෙහි අන්තර්ගතය ගොඩනැගෙමින් පවතී</h2>
      </div>
      </div>
    </div>
  );
}
