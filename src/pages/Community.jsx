import React from 'react';
import { motion } from 'framer-motion';

const SimpleSection = ({ title }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6 }}
    style={{ marginBottom: '48px' }}
  >
    <h2 style={{ 
      fontSize: '1.5rem', 
      fontFamily: 'var(--font-sinhala)', 
      fontWeight: '600', 
      color: 'var(--primary)', 
      marginBottom: '16px',
      lineHeight: '1.4'
    }}>
      {title}
    </h2>
    <div style={{ 
      fontFamily: 'var(--font-sinhala)', 
      fontSize: '1.1rem', 
      lineHeight: '2', 
      color: 'var(--text-main)', 
      fontWeight: '400' 
    }}>
      <p style={{ opacity: 0.5, fontStyle: 'italic', margin: 0 }}>
        [ මෙම ස්ථානයට අදාළ අන්තර්ගතය (Content) ඇතුළත් කෙරේ. ]
      </p>
    </div>
  </motion.div>
);

export default function Community() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)' }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '100px 24px 100px 24px' /* Reduced top padding */
      }}>
        
        {/* Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontFamily: 'var(--font-serif)', 
            fontWeight: '600', /* Reduced from 700 */
            color: 'var(--text-main)', 
            margin: '0', 
            lineHeight: '1.2' 
          }}>
            කල්‍යාණ මිත්‍රත්වය
          </h1>
        </div>

        {/* Sections */}
        <SimpleSection title="'කල්‍යාණ මිත්‍රයා' යනු?" />
        <SimpleSection title="අප 'Kalyanamitta' යන නාමය තෝරාගත්තේ ඇයි?" />
        <SimpleSection title="නිවන් දැකීමේ අවශ්‍යතාවය කුමක් ද?" />
        <SimpleSection title="නිවන් දකින්නට කල්‍යාණ මිත්‍රයෙකු වැදගත් වන්නේ ඇයි?" />
        <SimpleSection title="මඟ පෙන්වීම" />

      </div>
    </div>
  );
}
