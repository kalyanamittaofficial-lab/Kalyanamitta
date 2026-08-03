import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturedArticle() {
  return (
    <div className="mobile-padding" style={{ padding: '0 48px', marginTop: '100px', width: '100%', maxWidth: '1400px', margin: '100px auto 0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>විශේෂාංග ලිපි</h3>
        <div style={{ flexGrow: 1, height: '1px', background: 'var(--glass-border)' }}></div>
      </div>
      
      <div 
        style={{ 
        width: '100%', 
        background: 'var(--bg-secondary)', 
        border: '1px solid rgba(0,0,0,0.05)', 
        borderRadius: '4px', 
        padding: '80px 24px', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
      }}>
        <div 
          style={{ 
          width: '80px', height: '80px', borderRadius: '50%', 
          background: 'rgba(140, 21, 21, 0.05)', 
          border: '1px solid rgba(140, 21, 21, 0.1)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px'
        }}>
          <BookOpen size={40} color="var(--primary)" />
        </div>
        <h4 style={{ color: 'var(--text-main)', fontSize: '1.6rem', marginBottom: '12px', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '400px', lineHeight: '1.6', fontFamily: 'var(--font-sinhala)' }}>ධර්ම ලිපි සහ විශේෂාංග ඉතා ඉක්මනින් මෙහි පළ කරනු ලැබේ.</p>
      </div>
    </div>
  );
}
