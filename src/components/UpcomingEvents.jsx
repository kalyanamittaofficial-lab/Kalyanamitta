import React from 'react';
import { Calendar, Video, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UpcomingEvents() {
  const events = [
    { date: 'අද 07:00 PM', title: 'සජීවී ධර්ම දේශනාව', type: 'Live Stream', icon: <Video size={16} /> },
    { date: 'හෙට 05:00 AM', title: 'උදෑසන භාවනා වැඩසටහන', type: 'Zoom', icon: <Video size={16} /> },
    { date: 'ඉරිදා 09:00 AM', title: 'සිල් සමාදන් වීමේ වැඩසටහන', type: 'Physical', icon: <MapPin size={16} /> },
  ];

  return (
    <div className="mobile-padding" style={{ padding: '0 48px', margin: '100px auto 100px auto', width: '100%', maxWidth: '1600px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '2rem', color: 'var(--text-main)', fontWeight: '400', fontFamily: 'var(--font-serif)' }}>ඉදිරි සජීවී වැඩසටහන්</h3>
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
          <Calendar size={40} color="var(--gold-primary)" />
        </motion.div>
        <h4 style={{ color: 'var(--text-main)', fontSize: '1.6rem', marginBottom: '12px', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '400px', lineHeight: '1.6' }}>සජීවී වැඩසටහන් සහ සිදුවීම් පිළිබඳ තොරතුරු ඉතා ඉක්මනින් මෙහි යාවත්කාලීන කරනු ලැබේ.</p>
      </motion.div>
    </div>
  );
}
