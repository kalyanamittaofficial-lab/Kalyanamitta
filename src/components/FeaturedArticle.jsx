import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturedArticle() {
  return (
    <div className="mobile-padding" style={{ padding: '0 48px', marginTop: '100px', width: '100%', maxWidth: '1600px', margin: '100px auto 0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '2rem', color: 'var(--text-main)', fontWeight: '400', fontFamily: 'var(--font-serif)' }}>විශේෂාංග ලිපි</h3>
        <div style={{ flexGrow: 1, height: '1px', background: 'linear-gradient(90deg, var(--glass-border), transparent)' }}></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ 
        width: '100%', 
        background: 'rgba(15, 15, 15, 0.4)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: '32px', 
        padding: '80px 24px', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <motion.div 
          animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 0 rgba(196,152,79,0)', '0 0 20px rgba(196,152,79,0.2)', '0 0 0 rgba(196,152,79,0)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
          width: '80px', height: '80px', borderRadius: '50%', 
          background: 'linear-gradient(135deg, rgba(196, 152, 79, 0.15), rgba(196, 152, 79, 0.05))', 
          border: '1px solid rgba(196, 152, 79, 0.3)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px'
        }}>
          <BookOpen size={40} color="var(--gold-primary)" />
        </motion.div>
        <h4 style={{ color: 'var(--text-main)', fontSize: '1.6rem', marginBottom: '12px', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '400px', lineHeight: '1.6' }}>ධර්ම ලිපි සහ විශේෂාංග ඉතා ඉක්මනින් මෙහි පළ කරනු ලැබේ.</p>
      </motion.div>
    </div>
  );
}
