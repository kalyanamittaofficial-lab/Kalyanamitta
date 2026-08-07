import React from 'react';
import { motion } from 'framer-motion';

export default function Community() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)' }}>
      <style>{`
        .cm-wrapper {
          width: 100%;
          color: var(--text-main);
        }
        .cm-hero {
          width: 100%;
          padding: 12rem 2rem 6rem;
          text-align: center;
          position: relative;
        }
        .cm-hero h1 {
          font-family: var(--font-serif);
          font-size: clamp(3.5rem, 8vw, 6rem);
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
        }
        .cm-hero-subtitle {
          font-family: var(--font-sinhala);
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          opacity: 0.7;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.8;
        }
        .cm-split-section {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 4rem 2rem;
          gap: 4rem;
        }
        .cm-quote-side {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .cm-quote-pali {
          font-family: var(--font-sinhala);
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          font-weight: 700;
          line-height: 1.4;
          color: var(--text-main);
          margin-bottom: 2.5rem;
          opacity: 0.9;
        }
        .cm-quote-sinhala {
          font-family: var(--font-sinhala);
          font-size: clamp(1.2rem, 2vw, 1.6rem);
          color: var(--primary);
          font-weight: 500;
          line-height: 1.8;
          padding-left: 2rem;
          border-left: 3px solid var(--primary);
        }
        .cm-content-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-family: var(--font-sinhala);
          font-size: clamp(1.2rem, 1.8vw, 1.5rem);
          line-height: 2;
          opacity: 0.8;
          gap: 2rem;
        }
        .cm-divider {
          width: 1px;
          height: 100px;
          background: var(--glass-border);
          margin: 8rem auto;
        }
        @media (min-width: 1024px) {
          .cm-split-section {
            flex-direction: row;
            padding: 8rem 6rem;
            gap: 8rem;
            align-items: center;
          }
          .cm-hero {
            padding: 14rem 4rem 8rem;
          }
        }
      `}</style>
      
      <div className="cm-wrapper">
        <div className="cm-hero">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            කල්‍යාණ මිත්‍රත්වය
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="cm-hero-subtitle"
          >
            සසර ගමනේ දිශාව පෙන්වන සැබෑ මඟපෙන්වීම.
          </motion.div>
        </div>

        <div className="cm-split-section">
          <motion.div 
            className="cm-quote-side"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="cm-quote-pali">
              "සකලමේව හිදං ආනන්ද, බ්‍රහ්මචරියං යදිදං කල්‍යාණමිත්තතා..."
            </div>
            <div className="cm-quote-sinhala">
              "ආනන්දය, එසේ නොකියන්න. එසේ නොකියන්න. බ්‍රහ්මචරියාවේ අඩක් පමණක් නොව, මුළු බ්‍රහ්මචරියාවම කල්‍යාණ මිත්‍රත්වය මත රඳා පවතී."
              <div style={{ marginTop: '1.5rem', fontSize: '1rem', opacity: 0.6, fontWeight: 400, letterSpacing: '0.05em' }}>
                — උපද්ධ සූත්‍රය (සංයුත්ත නිකාය)
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="cm-content-side"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>
              බුදුරජාණන් වහන්සේට අනුව කල්‍යාණ මිත්‍රයෙකු යනු සාමාන්‍ය යහළුවෙකු නොවේ.
            </p>
            <p>
              ඔබගේ ලෞකික ජීවිතය දියුණු කරන පුද්ගලයෙකුට වඩා, දුකින් මිදෙන මාර්ගය පෙන්වන පුද්ගලයා කල්‍යාණ මිත්‍රයෙකි. ඔහු ඔබ වෙනුවෙන් නිවන් ලබා දිය නොහැක. නමුත්, ඔබට සත්‍යය දැකගත හැකි මාර්ගය පෙන්වා දිය හැක.
            </p>
            <p style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '1.1em', marginTop: '1rem' }}>
              අඳුරු මාර්ගයකදී පහනක් මෙන්, නොමඟ යන විට දිශාව පෙන්වන මඟපෙන්වන්නෙකු මෙන්, කල්‍යාණ මිත්‍රයා ඔබව ධර්මය දෙසට යොමු කරයි.
            </p>
          </motion.div>
        </div>

        <div className="cm-divider" />

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 12rem', display: 'flex', flexDirection: 'column', gap: '8rem' }}>
          <SimpleSection title="අප 'Kalyanamitta' යන නාමය තෝරාගත්තේ ඇයි?" />
          <SimpleSection title="නිවන් දැකීමේ අවශ්‍යතාවය කුමක් ද?" />
          <SimpleSection title="නිවන් දකින්නට කල්‍යාණ මිත්‍රයෙකු වැදගත් වන්නේ ඇයි?" />
          <SimpleSection title="මඟ පෙන්වීම" />
        </div>

      </div>
    </div>
  );
}

const SimpleSection = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    style={{ textAlign: 'center' }}
  >
    <h2 style={{ 
      fontSize: 'clamp(2rem, 4vw, 3rem)', 
      fontFamily: 'var(--font-serif)', 
      fontWeight: '600', 
      color: 'var(--text-main)', 
      marginBottom: '2rem',
      lineHeight: '1.4'
    }}>
      {title}
    </h2>
    <div style={{ 
      fontFamily: 'var(--font-sinhala)', 
      fontSize: '1.2rem', 
      lineHeight: '2', 
      color: 'var(--text-main)', 
      fontWeight: '400',
      opacity: 0.7
    }}>
      {children ? children : (
        <p style={{ fontStyle: 'italic', margin: 0, opacity: 0.5 }}>
          [ මෙම ස්ථානයට අදාළ අන්තර්ගතය ඇතුළත් කෙරේ ]
        </p>
      )}
    </div>
  </motion.div>
);
