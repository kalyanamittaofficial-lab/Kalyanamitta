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
    <div className="editorial-left">
      <span className="editorial-num">{num}</span>
      <h2 className="editorial-title">{title}</h2>
    </div>
    <div className="editorial-right">
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
          max-width: 1100px;
          margin: 0 auto;
          padding: 12vh 48px 150px 48px;
        }

        /* Hero Header */
        .editorial-header {
          text-align: center;
          margin-bottom: 100px;
          border-top: 1px solid var(--text-main);
          border-bottom: 1px solid var(--text-main);
          padding: 40px 0;
        }
        .editorial-hero-title {
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-family: var(--font-serif);
          font-weight: 400;
          color: var(--text-main);
          letter-spacing: -0.02em;
          margin: 0;
          line-height: 1.1;
        }
        .editorial-hero-subtitle {
          font-size: 1rem;
          font-family: var(--font-sinhala);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-top: 24px;
        }

        /* Sections Grid */
        .editorial-section {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 60px;
          padding: 60px 0;
          border-top: 1px solid var(--glass-border);
        }
        
        .editorial-left {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .editorial-num {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--primary);
          font-weight: 600;
        }
        
        .editorial-title {
          font-size: 1.75rem;
          font-family: var(--font-sinhala);
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.3;
          margin: 0;
        }

        .editorial-right {
          font-family: var(--font-sinhala);
          font-size: 1.15rem;
          line-height: 2;
          color: var(--text-muted);
          font-weight: 400;
          display: flex;
          align-items: center;
        }

        .editorial-placeholder {
          font-style: italic;
          opacity: 0.6;
        }

        @media (max-width: 900px) {
          .editorial-container {
            padding: 8vh 24px 100px 24px;
          }
          .editorial-section {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 40px 0;
          }
          .editorial-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="editorial-container">
        
        {/* Hero Header */}
        <div className="editorial-header">
          <h1 className="editorial-hero-title">කල්‍යාණ මිත්‍රත්වය</h1>
          <div className="editorial-hero-subtitle">Volume I &mdash; The Path to Liberation</div>
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
