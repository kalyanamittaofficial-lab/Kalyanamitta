import React from 'react';
import { motion } from 'framer-motion';

const SimpleSection = ({ title, children }) => (
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
      {children ? children : (
        <p style={{ opacity: 0.5, fontStyle: 'italic', margin: 0 }}>
          [ මෙම ස්ථානයට අදාළ අන්තර්ගතය (Content) ඇතුළත් කෙරේ. ]
        </p>
      )}
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
        <SimpleSection title="'කල්‍යාණ මිත්‍රයා' යනු?">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontStyle: 'italic', opacity: 0.9 }}>
              "සකලමේව හිදං ආනන්ද, බ්‍රහ්මචරියං යදිදං කල්‍යාණමිත්තතා..."
            </p>
            <p style={{ fontWeight: '500', color: 'var(--primary)', opacity: 0.9 }}>
              "ආනන්දය, එසේ නොකියන්න. එසේ නොකියන්න. බ්‍රහ්මචරියාවේ අඩක් පමණක් නොව, මුළු බ්‍රහ්මචරියාවම කල්‍යාණ මිත්‍රත්වය මත රඳා පවතී."
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '-8px' }}>
              — උපද්ධ සූත්‍රය (සංයුත්ත නිකාය)
            </p>

            <p style={{ marginTop: '16px' }}>
              බුදුරජාණන් වහන්සේට අනුව කල්‍යාණ මිත්‍රයෙකු යනු සාමාන්‍ය යහළුවෙකු නොවේ.
            </p>
            <p>
              ඔබගේ ලෞකික ජීවිතය දියුණු කරන පුද්ගලයෙකුට වඩා, දුකින් මිදෙන මාර්ගය පෙන්වන පුද්ගලයා කල්‍යාණ මිත්‍රයෙකි.
            </p>
            <p style={{ opacity: 0.9 }}>
              ඔහු ඔබ වෙනුවෙන් නිවන් ලබා දිය නොහැක. නමුත්, ඔබට සත්‍යය දැකගත හැකි මාර්ගය පෙන්වා දිය හැක. අඳුරු මාර්ගයකදී පහනක් මෙන්, නොමඟ යන විට දිශාව පෙන්වන මඟපෙන්වන්නෙකු මෙන්, කල්‍යාණ මිත්‍රයා ඔබව ධර්මය දෙසට යොමු කරයි.
            </p>
          </div>
        </SimpleSection>
        <SimpleSection title="අප 'Kalyanamitta' යන නාමය තෝරාගත්තේ ඇයි?" />
        <SimpleSection title="නිවන් දැකීමේ අවශ්‍යතාවය කුමක් ද?" />
        <SimpleSection title="නිවන් දකින්නට කල්‍යාණ මිත්‍රයෙකු වැදගත් වන්නේ ඇයි?" />
        <SimpleSection title="මඟ පෙන්වීම" />

      </div>
    </div>
  );
}
