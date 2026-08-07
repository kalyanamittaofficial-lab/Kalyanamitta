import React from 'react';
import { motion } from 'framer-motion';

const AcademicSection = ({ num, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="academic-section"
  >
    <div className="academic-marker">
      <span className="academic-num">{num}</span>
    </div>
    <div className="academic-content-block">
      <h2 className="academic-title">{title}</h2>
      <div className="academic-text">
        <p className="academic-placeholder">
          [ මෙම ස්ථානයට අදාළ අන්තර්ගතය (Content) ඇතුළත් කෙරේ. ]
        </p>
      </div>
    </div>
  </motion.div>
);

export default function Community() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', background: 'var(--bg-main)' }}>
      
      {/* Oxford / Stanford Academic CSS */}
      <style>{`
        .academic-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 140px 32px 120px 32px;
        }

        /* Hero Header - Classical Academic */
        .academic-header {
          text-align: center;
          margin-bottom: 80px;
          position: relative;
        }
        
        .academic-header::before,
        .academic-header::after {
          content: '';
          display: block;
          width: 100%;
          height: 1px;
          background: var(--text-main);
          opacity: 0.15;
          margin: 16px 0;
        }

        .academic-header::before {
          border-top: 3px solid var(--primary);
          height: 0;
          background: transparent;
          opacity: 1;
          width: 60px;
          margin: 0 auto 32px auto;
        }

        .academic-hero-title {
          font-size: clamp(3rem, 6vw, 4.5rem);
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--primary);
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .academic-hero-subtitle {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--text-muted);
          font-style: italic;
          margin-top: 16px;
        }

        /* Sections */
        .academic-section {
          display: flex;
          gap: 40px;
          margin-bottom: 64px;
        }
        
        .academic-marker {
          flex-shrink: 0;
          width: 60px;
          display: flex;
          justify-content: flex-end;
          padding-top: 4px; /* Align with title */
        }

        .academic-num {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: var(--primary);
          font-weight: 700;
          opacity: 0.9;
        }

        .academic-content-block {
          flex-grow: 1;
          border-left: 1px solid var(--glass-border);
          padding-left: 40px;
        }

        .academic-title {
          font-size: 1.8rem;
          font-family: var(--font-sinhala);
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 20px 0;
          line-height: 1.4;
          letter-spacing: 0.01em;
        }

        .academic-text {
          font-family: var(--font-sinhala);
          font-size: 1.2rem;
          line-height: 2.1;
          color: var(--text-muted);
          font-weight: 400;
        }

        .academic-placeholder {
          font-style: italic;
          opacity: 0.5;
          margin: 0;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .academic-container {
            padding: 100px 24px 80px 24px;
          }
          .academic-section {
            flex-direction: column;
            gap: 16px;
          }
          .academic-marker {
            width: auto;
            justify-content: flex-start;
          }
          .academic-content-block {
            border-left: none;
            padding-left: 0;
          }
          .academic-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="academic-container">
        
        {/* Hero Header */}
        <div className="academic-header">
          <h1 className="academic-hero-title">කල්‍යාණ මිත්‍රත්වය</h1>
          <div className="academic-hero-subtitle">The Noble Friendship</div>
        </div>

        {/* Sections */}
        <AcademicSection num="I" title="'කල්‍යාණ මිත්‍රයා' යනු?" />
        <AcademicSection num="II" title="අප 'Kalyanamitta' යන නාමය තෝරාගත්තේ ඇයි?" />
        <AcademicSection num="III" title="නිවන් දැකීමේ අවශ්‍යතාවය කුමක් ද?" />
        <AcademicSection num="IV" title="නිවන් දකින්නට කල්‍යාණ මිත්‍රයෙකු වැදගත් වන්නේ ඇයි?" />
        <AcademicSection num="V" title="මඟ පෙන්වීම" />

      </div>
    </div>
  );
}
