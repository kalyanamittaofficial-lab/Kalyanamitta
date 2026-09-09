import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bodhiFactors = [
  { 
    id: 1, 
    title: 'සතර සතිපට්ඨාන', 
    subtitle: 'සිහිය පිහිටුවීමේ පදනම',
    count: 4,
    description: 'අපගේ ශරීරය, හැඟීම්, සිත සහ ධර්මතාවයන් පිළිබඳව නිරන්තර අවධානයෙන් සහ නිවැරදි සිහියෙන් යුතුව වාසය කිරීමයි.',
    items: [
      { name: 'කායානුපස්සනා', desc: 'කය සහ කයේ ක්‍රියාකාරිත්වය පිළිබඳ අවධානය' },
      { name: 'වේදනානුපස්සනා', desc: 'විඳීම් (සැප, දුක්, මධ්‍යස්ථ) පිළිබඳ අවධානය' },
      { name: 'චිත්තානුපස්සනා', desc: 'සිතේ ස්වභාවය පිළිබඳ අවධානය' },
      { name: 'ධම්මානුපස්සනා', desc: 'ධර්මතාවන් පිළිබඳ අවධානය' }
    ]
  },
  { 
    id: 2, 
    title: 'සතර සම්මප්පධාන', 
    subtitle: 'නිවැරදි උත්සාහය',
    count: 4,
    description: 'සිත තුළ අකුසල් දුරු කිරීමටත්, කුසල් දියුණු කිරීමටත් ගන්නා වූ අඛණ්ඩ සහ නිවැරදි වීරියයි.',
    items: [
      { name: 'නූපන් අකුසල් නූපදවීමට', desc: 'තවමත් සිතේ හටනොගත් පාපී සිතිවිලිවලට ඉඩ නොදීම' },
      { name: 'උපන් අකුසල් දුරු කිරීමට', desc: 'සිතේ හටගත් පාපී සිතිවිලි වහා බැහැර කිරීම' },
      { name: 'නූපන් කුසල් ඉපදවීමට', desc: 'සිතේ හටනොගත් යහපත් සිතිවිලි වඩවා ගැනීම' },
      { name: 'උපන් කුසල් වැඩිදියුණු කිරීමට', desc: 'සිතේ ඇති යහපත් සිතිවිලි තවදුරටත් දියුණු කිරීම' }
    ]
  },
  { 
    id: 3, 
    title: 'සතර ඉද්ධිපාද', 
    subtitle: 'සාර්ථකත්වයේ පදනම',
    count: 4,
    description: 'නිවන් අවබෝධය නැමැති උතුම් අරමුණ මුදුන් පමුණුවා ගැනීමට අත්‍යවශ්‍ය වන මානසික ශක්තීන් සතර.',
    items: [
      { name: 'ඡන්ද', desc: 'අරමුණ කෙරෙහි ඇති බලවත් කැමැත්ත' },
      { name: 'චිත්ත', desc: 'අරමුණ කෙරෙහි සිතේ ඇති බලවත් නැඹුරුව' },
      { name: 'විරිය', desc: 'අරමුණ වෙනුවෙන් නොපසුබටව කරන උත්සාහය' },
      { name: 'වීමංසා', desc: 'නුවණින් විමසා බැලීම' }
    ]
  },
  { 
    id: 4, 
    title: 'පංච ඉන්ද්‍රිය', 
    subtitle: 'අධ්‍යාත්මික ඉන්ද්‍රියයන්',
    count: 5,
    description: 'බාහිර අරමුණුවලට නොසැලී, ධර්මය තුළ සිත මනාව පිහිටුවා ගන්නා වූ අධ්‍යාත්මික ඉන්ද්‍රියයන් පහ.',
    items: [
      { name: 'සද්ධා ඉන්ද්‍රිය', desc: 'බුද්ධාදි රත්නත්‍රය කෙරෙහි ඇති නොසැලෙන විශ්වාසය' },
      { name: 'විරිය ඉන්ද්‍රිය', desc: 'කුසලයට ඇති නොපසුබට උත්සාහය' },
      { name: 'සති ඉන්ද්‍රිය', desc: 'මනා වූ සිහිය' },
      { name: 'සමාධි ඉන්ද්‍රිය', desc: 'සිතේ එකඟ බව' },
      { name: 'පඤ්ඤා ඉන්ද්‍රිය', desc: 'අනිත්‍ය, දුක්ඛ, අනාත්ම ලෙස යථාර්ථය දකින නුවණ' }
    ]
  },
  { 
    id: 5, 
    title: 'පංච බල', 
    subtitle: 'අධ්‍යාත්මික බලයන්',
    count: 5,
    description: 'ඉහත කී ඉන්ද්‍රියයන් පහ කිසිවකින් සෙලවිය නොහැකි තරමට බලවත් වූ විට එය "බල" ලෙස හැඳින්වේ.',
    items: [
      { name: 'සද්ධා බලය', desc: 'අශ්‍රද්ධාවෙන් නොසැලෙන විශ්වාසය' },
      { name: 'විරිය බලය', desc: 'කම්මැලිකමෙන් නොසැලෙන උත්සාහය' },
      { name: 'සති බලය', desc: 'මුළාවෙන් නොසැලෙන සිහිය' },
      { name: 'සමාධි බලය', desc: 'වික්ෂිප්ත බවින් නොසැලෙන එකඟකම' },
      { name: 'පඤ්ඤා බලය', desc: 'අවිද්‍යාවෙන් නොසැලෙන නුවණ' }
    ]
  },
  { 
    id: 6, 
    title: 'සප්ත බොජ්ඣංග', 
    subtitle: 'අවබෝධයේ අංග',
    count: 7,
    description: 'චතුරාර්ය සත්‍යය අවබෝධ කිරීම සඳහා සිත තුළ අනිවාර්යයෙන්ම මෝරා වැඩිය යුතු අංග හත.',
    items: [
      { name: 'සති', desc: 'මනා සිහිය' },
      { name: 'ධම්මවිචය', desc: 'නුවණින් ධර්මය විමසීම' },
      { name: 'විරිය', desc: 'නොපසුබට උත්සාහය' },
      { name: 'පීති', desc: 'නිරාමිස සතුට' },
      { name: 'පස්සද්ධි', desc: 'කය සහ සිතේ සංසිඳීම' },
      { name: 'සමාධි', desc: 'සිතේ මනා එකඟබව' },
      { name: 'උපේක්ඛා', desc: 'සිතේ මධ්‍යස්ථ බව' }
    ]
  },
  { 
    id: 7, 
    title: 'ආර්ය අෂ්ටාංගික මාර්ගය', 
    subtitle: 'උතුම් වූ ආර්ය මාර්ගය',
    count: 8,
    description: 'නිවනට මඟ පෙන්වන එකම මාර්ගය. මෙය ප්‍රඥා, ශීල, සමාධි යන ත්‍රිවිධ ශික්ෂාවන්ට ඇතුළත් වේ.',
    items: [
      { name: 'සම්මා දිට්ඨි', desc: 'නිවැරදි දැක්ම' },
      { name: 'සම්මා සංකප්ප', desc: 'නිවැරදි කල්පනාව' },
      { name: 'සම්මා වාචා', desc: 'නිවැරදි වචනය' },
      { name: 'සම්මා කම්මන්ත', desc: 'නිවැරදි කර්මාන්තය' },
      { name: 'සම්මා ආජීව', desc: 'නිවැරදි දිවිපැවැත්ම' },
      { name: 'සම්මා වායාම', desc: 'නිවැරදි උත්සාහය' },
      { name: 'සම්මා සති', desc: 'නිවැරදි සිහිය' },
      { name: 'සම්මා සමාධි', desc: 'නිවැරදි සිතේ එකඟකම' }
    ]
  }
];

// Memoized fully visible beautiful Dharma Chakra
const RealisticChakra = memo(() => (
  <svg viewBox="0 0 1000 1000" width="100%" height="100%" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}>
    <defs>
      <linearGradient id="gold-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="25%" stopColor="#d4af37" />
        <stop offset="50%" stopColor="#854d0e" />
        <stop offset="75%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#fef08a" />
      </linearGradient>
      
      <linearGradient id="gold-grad-rim" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a16207" />
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      
      <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#854d0e" />
      </radialGradient>

      <filter id="emboss-3d" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="3" dy="6" stdDeviation="5" floodOpacity="0.3" floodColor="#451a03" />
        <feDropShadow dx="-1" dy="-1" stdDeviation="2" floodOpacity="0.5" floodColor="#ffffff" />
      </filter>
    </defs>

    {/* Outer Rim */}
    <circle cx="500" cy="500" r="450" fill="none" stroke="url(#gold-grad-main)" strokeWidth="50" filter="url(#emboss-3d)" />
    <circle cx="500" cy="500" r="425" fill="none" stroke="url(#gold-grad-rim)" strokeWidth="10" />
    <circle cx="500" cy="500" r="475" fill="none" stroke="url(#gold-grad-rim)" strokeWidth="8" opacity="0.8" />
    
    <circle cx="500" cy="500" r="440" fill="none" stroke="#fff" strokeWidth="2" opacity="0.25" />
    <circle cx="500" cy="500" r="460" fill="none" stroke="#fff" strokeWidth="2" opacity="0.25" />

    {/* 8 Spokes */}
    {[...Array(8)].map((_, i) => {
      const angle = (i * 360) / 8;
      return (
        <g key={`spoke-${i}`} transform={`rotate(${angle} 500 500)`}>
          <path d="M 485 400 L 492 140 L 508 140 L 515 400 Z" fill="url(#gold-grad-main)" filter="url(#emboss-3d)" />
          <line x1="500" y1="400" x2="500" y2="140" stroke="#fff" strokeWidth="2" opacity="0.4" />
          <polygon points="500,100 475,140 500,160 525,140" fill="url(#gold-grad-rim)" filter="url(#emboss-3d)" />
        </g>
      );
    })}

    {/* Hub */}
    <circle cx="500" cy="500" r="100" fill="url(#hub-glow)" filter="url(#emboss-3d)" />
    <circle cx="500" cy="500" r="80" fill="none" stroke="url(#gold-grad-rim)" strokeWidth="6" />
    <circle cx="500" cy="500" r="40" fill="url(#gold-grad-main)" filter="url(#emboss-3d)" />
    <circle cx="500" cy="500" r="20" fill="#fff" opacity="0.8" />

    {/* Traditional Nubs */}
    {[...Array(24)].map((_, i) => {
      const angle = (i * 360) / 24;
      return (
        <circle 
          key={`nub-${i}`} cx="500" cy="25" r="15" 
          fill="url(#gold-grad-main)" transform={`rotate(${angle} 500 500)`} filter="url(#emboss-3d)"
        />
      );
    })}
  </svg>
));

export default function Path() {
  const [activeId, setActiveId] = useState(1);
  const activeFactor = bodhiFactors.find(f => f.id === activeId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', overflowX: 'clip' }}>
      <style>{`
        .chakra-layout {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 100vh;
          position: relative;
        }

        .chakra-hero {
          padding: 12vh 20px 4vh;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .chakra-interactive-area {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .chakra-interactive-area {
            flex-direction: row;
            align-items: flex-start;
          }
        }

        /* Wheel Container */
        .chakra-wheel-side {
          position: relative;
          width: 100%;
          height: 90vw;
          max-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }

        @media (min-width: 1024px) {
          .chakra-wheel-side {
            flex: 1;
            position: sticky;
            top: 15vh;
            height: 70vh;
            max-height: 700px;
            margin-bottom: 0;
          }
        }

        /* Fully Visible Scaler */
        .wheel-scaler {
          position: absolute;
          width: 75vw; /* Leave room for buttons on mobile */
          height: 75vw;
          max-width: 450px;
          max-height: 450px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
        }

        @media (min-width: 1024px) {
          .wheel-scaler {
            width: 500px;
            height: 500px;
            max-width: 500px;
            max-height: 500px;
          }
        }

        /* Content Panel */
        .chakra-content-panel {
          padding: 20px 24px 100px;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          z-index: 10;
        }

        @media (min-width: 1024px) {
          .chakra-content-panel {
            flex: 1.2;
            padding: 0 40px 120px 0;
          }
        }

        /* Highly Visible Nodes */
        .chakra-node {
          position: absolute;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          
          /* Strong contrast visibility */
          background: var(--bg-main);
          border: 3px solid var(--primary);
          color: var(--primary);
          z-index: 50; /* Ensure on top of wheel */
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          
          width: 50px;
          height: 50px;
          font-size: 1.1rem;
        }

        @media (min-width: 1024px) {
          .chakra-node {
            width: 65px;
            height: 65px;
            font-size: 1.4rem;
            border-width: 4px;
          }
        }

        .chakra-node:hover {
          transform: translate(-50%, -50%) scale(1.1);
          background: var(--primary);
          color: #fff;
          box-shadow: 0 12px 30px rgba(140, 21, 21, 0.3);
        }

        .chakra-node.active {
          background: var(--primary);
          color: #fff;
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: 0 15px 40px rgba(140, 21, 21, 0.4);
          border-color: #fff;
        }
      `}</style>

      <div className="chakra-layout">
        
        <div className="chakra-hero">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <div style={{
              color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 700,
              marginBottom: '20px', letterSpacing: '0.2em', textTransform: 'uppercase'
            }}>
              Interactive Dharma Chakra
            </div>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ 
              fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              color: 'var(--text-main)', fontWeight: 800, letterSpacing: '-0.02em',
              margin: '0 0 16px 0', lineHeight: 1.2
            }}>
            සත්තිස් බෝධිපාක්ෂික ධර්ම
          </motion.h1>
        </div>

        <div className="chakra-interactive-area">
          
          {/* LEFT: Fully Visible Sticky Wheel */}
          <div className="chakra-wheel-side">
            <div className="wheel-scaler">
              
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
                style={{ width: '100%', height: '100%', position: 'absolute' }}
              >
                <RealisticChakra />
              </motion.div>

              {/* Placed evenly around the fully visible circle */}
              {bodhiFactors.map((factor, i) => {
                // Symmetrical full circle distribution (-90deg is top center)
                const rad = (i * 2 * Math.PI) / 7 - Math.PI / 2;
                // Place nodes *just* outside the wheel (radius is 50%, so 58% puts them outside)
                const radiusPercent = 58; 
                const left = `calc(50% + ${Math.cos(rad) * radiusPercent}%)`;
                const top = `calc(50% + ${Math.sin(rad) * radiusPercent}%)`;

                return (
                  <button
                    key={factor.id}
                    className={`chakra-node ${activeId === factor.id ? 'active' : ''}`}
                    style={{ left, top }}
                    onClick={() => setActiveId(factor.id)}
                  >
                    0{factor.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Dynamic Editorial Content */}
          <div className="chakra-content-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '24px',
                  padding: 'clamp(24px, 4vw, 48px)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <div>
                    <div style={{ fontSize: '1rem', color: 'var(--primary)', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '8px' }}>
                      ධර්මතා {activeFactor.count} ක්
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-sinhala)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
                      {activeFactor.title}
                    </h2>
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 4vw, 4rem)', color: 'var(--primary)', opacity: 0.15, lineHeight: 0.8, fontWeight: 300 }}>
                    0{activeFactor.id}
                  </div>
                </div>

                <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.15rem', lineHeight: 1.9, color: 'var(--text-main)', opacity: 0.9, marginBottom: '2.5rem' }}>
                  {activeFactor.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {activeFactor.items.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (idx * 0.05), duration: 0.4 }}
                      style={{
                        padding: '16px 20px',
                        background: 'rgba(0,0,0,0.02)',
                        borderRadius: '12px',
                        borderLeft: '3px solid var(--primary)'
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.15rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>
                        {item.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {item.desc}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
