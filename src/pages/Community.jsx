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
          padding: 8rem 2rem 4rem;
          text-align: center;
          position: relative;
        }
        .cm-hero h1 {
          font-family: var(--font-serif);
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1.5rem;
          letter-spacing: 0.05em;
        }
        
        .cm-split-section {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 2rem 1.5rem 4rem;
          gap: 3rem;
        }
        .cm-quote-side {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .cm-quote-pali {
          font-family: var(--font-serif);
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.5;
          color: var(--primary);
          margin-bottom: 1.5rem;
          opacity: 0.9;
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        .cm-quote-sinhala {
          font-family: var(--font-sinhala);
          font-size: clamp(1.1rem, 2.5vw, 1.3rem);
          color: var(--text-main);
          font-weight: 500;
          line-height: 1.6;
          padding-left: 1.2rem;
          border-left: 2px solid var(--primary);
        }
        .cm-content-side {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          font-family: var(--font-sinhala);
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          line-height: 1.8;
          opacity: 0.85;
          gap: 2rem;
        }
        
        .cm-divider {
          width: 1px;
          height: 80px;
          background: var(--glass-border);
          margin: 4rem auto;
        }

        .cm-scroll-spacer {
           display: none;
        }

        @media (min-width: 1024px) {
          .cm-hero {
            padding: 12rem 4rem 6rem;
          }
          .cm-split-section {
            flex-direction: row;
            padding: 4rem 6rem 8rem;
            gap: 6rem;
            align-items: flex-start;
          }
          .cm-quote-side {
            position: sticky;
            top: 140px;
            height: fit-content;
          }
          .cm-quote-pali {
            font-size: 2.8rem;
          }
          .cm-quote-sinhala {
            border-left: 3px solid var(--primary);
            padding-left: 2rem;
            font-size: 1.4rem;
          }
          .cm-content-side {
            padding-top: 1rem;
            gap: 3rem;
          }
          .cm-scroll-spacer {
             display: block;
             height: 20vh;
          }
          .cm-divider {
             margin: 6rem auto;
             height: 120px;
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
        </div>

        <div className="cm-split-section">
          <div className="cm-quote-side">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8 }}
              className="cm-quote-pali"
            >
              "සකලමේව හිදං ආනන්ද, බ්‍රහ්මචරියං යදිදං කල්‍යාණමිත්තතා..."
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="cm-quote-sinhala"
            >
              "ආනන්දය, එසේ නොකියන්න. එසේ නොකියන්න. බ්‍රහ්මචරියාවේ අඩක් පමණක් නොව, මුළු බ්‍රහ්මචරියාවම කල්‍යාණ මිත්‍රත්වය මත රඳා පවතී."
              <div style={{ marginTop: '1.2rem', fontSize: '0.9rem', opacity: 0.6, fontWeight: 400, letterSpacing: '0.05em' }}>
                — උපද්ධ සූත්‍රය (සංයුත්ත නිකාය)
              </div>
            </motion.div>
          </div>

          <div className="cm-content-side">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8 }}
            >
              භාග්‍යවතුන් වහන්සේ දේශනා කළ පරිදි, කල්‍යාණ මිත්‍රයෙකු යනු සාමාන්‍ය යහළුවෙකු නොවේ.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8 }}
            >
              ඔබගේ ලෞකික ජීවිතය දියුණු කරන පුද්ගලයෙකුට වඩා, දුකින් මිදෙන මාර්ගය පෙන්වන පුද්ගලයා කල්‍යාණ මිත්‍රයෙකි. ඔහුට ඔබ වෙනුවෙන් නිවන් ලබා දිය නොහැක. නමුත්, ඔබට සත්‍යය දැකගත හැකි මාර්ගය පෙන්වා දිය හැක.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8 }}
              style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '1.1em', marginTop: '0.5rem' }}
            >
              අඳුරු මාර්ගයකදී පහනක් මෙන්, නොමඟ යන විට දිශාව පෙන්වන මඟපෙන්වන්නෙකු මෙන්, කල්‍යාණ මිත්‍රයා ඔබව ධර්මය දෙසට යොමු කරයි.
            </motion.p>

            <div className="cm-scroll-spacer"></div>
          </div>
        </div>

        <div className="cm-divider" />

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 10rem', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          <SimpleSection title="අප 'Kalyanamitta' යන නාමය තෝරාගත්තේ ඇයි?">
            <p>
              අවිද්‍යා අන්ධකාරයෙන් මුළාවට පත් වී සිටින බොහෝ දෙනා, තමන් මේ ඝෝර සංසාරයේ අතරමං වී ඇති බවවත් නොදැන ලෞකික දියුණුව පමණක් හඹා යමින් උතුම් ධර්ම මාර්ගයෙන් ඈත් වෙති. අපගේ අභිලාෂය වන්නේ, එසේ සසර මඟ අතරමං වූ සියලු සත්ත්වයන් උදෙසාම ධර්මයේ ආලෝකය ලබා දෙමින්, ලෞකික ජීවිතය දැහැමිව ගත කරන අතරතුරදීම සංසාර විමුක්තිය හෙවත් නිවන අරමුණු කරගත් කුසල ධර්මයන් දියුණු කරගැනීමට අවශ්‍ය වටපිටාව සකසා දීමයි.
            </p>
            <p style={{ marginTop: '1.2rem' }}>
              ඒ සඳහා ධර්ම දේශනා ශ්‍රවණයට සහ පුණ්‍ය කර්මයන්ට අවස්ථාව සලසා දෙමින්, එකිනෙකාව අකුසලයෙන් වළක්වා කුසලයෙහි පිහිටුවීම අපගේ අපේක්ෂාවයි. මෙසේ අනෙකාට අර්ථය සහ ධර්මය පෙන්වා දෙමින්, මෙලොව පරලොව උභයාර්ථය සලසමින් නිවන් දොරටුව කරා යන ගමනට අත්වැලක් වන උතුම් මිත්‍රයාගේ කාර්යභාරය ඉටු කිරීම උදෙසාම, අපි අපගේ මෙම එකමුතුවට 'Kalyanamitta' යන උතුම් නාමය තෝරා ගත්තෙමු.
            </p>
          </SimpleSection>
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
      fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
      fontFamily: 'var(--font-serif)', 
      fontWeight: '600', 
      color: 'var(--text-main)', 
      marginBottom: '1.5rem',
      lineHeight: '1.4'
    }}>
      {title}
    </h2>
    <div style={{ 
      fontFamily: 'var(--font-sinhala)', 
      fontSize: '1.1rem', 
      lineHeight: '1.8', 
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
