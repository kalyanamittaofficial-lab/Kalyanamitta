import React from 'react';
import { motion } from 'framer-motion';

const EditorialSection = ({ num, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className="editorial-section"
  >
    <h2 className="editorial-title">
      <span className="editorial-num">{num}.</span> {title}
    </h2>
    <div className="editorial-content">
      <p className="editorial-placeholder">
        [ මෙම ස්ථානයට අදාළ අන්තර්ගතය (Content) ඇතුළත් කෙරේ. ]
      </p>
    </div>
  </motion.div>
);

export default function Community() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', background: 'var(--bg-main)' }}>
      
      {/* Editorial CSS */}
      <style>{`
        .editorial-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 120px 24px 120px 24px;
        }

        /* Hero Header */
        .editorial-header {
          text-align: center;
          margin-bottom: 60px;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 40px;
        }
        
        .editorial-hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--primary);
          margin: 0;
          line-height: 1.2;
        }

        /* Sections */
        .editorial-section {
          margin-bottom: 50px;
        }
        
        .editorial-title {
          font-size: 1.5rem;
          font-family: var(--font-sinhala);
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 16px;
          display: flex;
          align-items: baseline;
          gap: 12px;
          line-height: 1.4;
        }
        
        .editorial-num {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: var(--primary);
          font-weight: 700;
        }

        .editorial-content {
          font-family: var(--font-sinhala);
          font-size: 1.15rem;
          line-height: 2;
          color: var(--text-muted);
          font-weight: 400;
          padding-left: 32px;
        }

        .editorial-placeholder {
          font-style: italic;
          opacity: 0.5;
          margin: 0;
        }

        @media (max-width: 768px) {
          .editorial-container {
            padding: 100px 20px 80px 20px;
          }
          .editorial-content {
            padding-left: 0;
          }
          .editorial-title {
            font-size: 1.3rem;
          }
        }
      `}</style>

      <div className="editorial-container">
        
        {/* Hero Header */}
        <div className="editorial-header">
          <h1 className="editorial-hero-title">කල්‍යාණ මිත්‍රත්වය</h1>
        </div>

        {/* Sections */}
        <EditorialSection num="I" title="'කල්‍යාණ මිත්‍රයා' යනු?" />
        <EditorialSection num="II" title="අප 'Kalyanamitta' යන නාමය තෝරාගත්තේ ඇයි?" />
        <EditorialSection num="III" title="නිවන් දැකීමේ අවශ්‍යතාවය කුමක් ද?" />
        <EditorialSection num="IV" title="නිවන් දකින්නට කල්‍යාණ මිත්‍රයෙකු වැදගත් වන්නේ ඇයි?" />
        <EditorialSection num="V" title="මඟ පෙන්වීම" />

      </div>
    </div>
  );
}
