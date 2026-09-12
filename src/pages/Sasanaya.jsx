import React from 'react';
import { motion } from 'framer-motion';

export default function Sasanaya() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)' }}>
      <style>{`
        .sn-hero {
          width: 100%;
          min-height: 40vh;
          padding: 8rem 2rem 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .sn-hero h1 {
          font-family: var(--font-serif);
          font-size: clamp(3.5rem, 8vw, 6rem);
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0;
          letter-spacing: 0.05em;
          text-shadow: 0 10px 30px rgba(0,0,0,0.1);
          text-align: center;
        }
        .sn-split-section {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 2rem 1.5rem 4rem;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (min-width: 900px) {
          .sn-split-section {
            flex-direction: row;
            padding: 4rem 2rem 6rem;
            gap: 5rem;
          }
          .sn-hero {
            min-height: 50vh;
          }
        }
        .sn-text-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .sn-text-content p {
          font-family: var(--font-sinhala);
          font-size: 1.15rem;
          line-height: 1.8;
          color: var(--text-main);
          margin-bottom: 1.5rem;
          opacity: 0.85;
        }
        .sn-image-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sn-glass-card {
          background: var(--glass-bg, rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Hero Section */}
      <div className="sn-hero">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
             <span style={{ fontSize: '3rem', color: 'var(--primary)' }}>☸</span>
          </motion.div>
          
          <h1>ශාසනය සුරකිමු</h1>
          <div style={{ width: '100px', height: '2px', background: 'var(--primary)', marginTop: '1.5rem', opacity: 0.8 }} />
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="sn-split-section">
        <div className="sn-text-content">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 600 }}>
              සැබෑ ශාසන මාමකත්වය
            </h2>
            <p>
              බුදුරජාණන් වහන්සේගේ ශ්‍රී සද්ධර්මය ලෝක සත්වයාගේ හිත සුව පිණිස අද දක්වාම නොනැසී පවතින්නේ මහා සංඝරත්නය ඇතුළු සිව්වනක් පිරිසේ අප්‍රතිහත ධෛර්යය නිසාවෙනි.
            </p>
            <p>
              ප්‍රතිපත්ති පූජාවෙන් යුක්තව ධර්මයෙහි හැසිරීම ශාසනය සුරැකීමේ උතුම්ම ක්‍රමයයි. ධර්මය හදාරමින්, ඒ අනුව ජීවිතය හැඩගස්වා ගැනීමෙන් අපි සැබෑම ශාසන මාමකයෝ වෙමු.
            </p>
            <p>
              මෙම පිටුව හරහා ශාසනයේ උන්නතිය වෙනුවෙන් කළ හැකි කාර්යයන්, ධර්ම දානමය පුණ්‍යකර්ම සහ ඉදිරි සැලසුම් පිළිබඳව ඔබව දැනුවත් කිරීමට අපි බලාපොරොත්තු වෙමු.
            </p>
            
            <motion.div 
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                borderLeft: '4px solid var(--primary)',
                background: 'var(--glass-bg, rgba(0,0,0,0.03))',
                borderRadius: '0 12px 12px 0'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                "ධම්මෝ හවේ රක්ඛති ධම්මචාරී"
              </div>
              <div style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
                ධර්මයෙහි හැසිරෙන්නාව ධර්මය විසින්ම රකියි.
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="sn-image-side">
          <motion.div
            className="sn-glass-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ width: '100%', position: 'relative', overflow: 'hidden' }}
          >
            {/* Decorative background element */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(30px)' }} />
            
            <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem', textAlign: 'center' }}>
              ඉදිරියේදී බලාපොරොත්තු වන්න
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
              {[
                "සංඝාවාස හා විහාරස්ථාන සංවර්ධනය",
                "දහම් පාසල් දරුවන්ගේ අධ්‍යාපනය නංවාලීම",
                "දුෂ්කර පළාත්වල ධර්ම ප්‍රචාරක කටයුතු",
                "විශේෂ පුණ්‍යානුමෝදනා වැඩසටහන්"
              ].map((item, idx) => (
                <div key={idx} style={{ 
                  padding: '1rem', 
                  background: 'var(--bg-main)', 
                  borderRadius: '10px',
                  fontFamily: 'var(--font-sinhala)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '1.05rem',
                  opacity: 0.9
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
