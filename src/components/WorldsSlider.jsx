import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function WorldsSlider() {
  const navigate = useNavigate();
  
  const cards = [
    { title: 'බුදු වදන්', subtitle: 'දේශිත බුදු වදන් සහ අර්ථය', image: '/bhawana-page/dhammaPage.png', path: '/words' },
    { title: 'දේශනා', subtitle: 'ධර්ම දේශනා සහ සජීවී දේශනා', image: '/bhawana-page/dharmadeshana.png', path: '/sermons' },
    { title: 'භාවනා', subtitle: 'භාවනා මාර්ගෝපදේශ සහ නිශ්ශබ්ද', image: '/bhawana-page/bhawanapageheroimage.png', path: '/meditation' },
    { title: 'ධර්ම මාර්ගය', subtitle: 'ඉදිරියේදී බලාපොරොත්තු වන්න...', image: '/sutta_pitaka.png', path: null },
    { title: 'ජීවිතයට ධර්මය', subtitle: 'ඉදිරියේදී බලාපොරොත්තු වන්න...', image: '/dark_waves.png', path: null },
    { title: 'කල්‍යාණ මිත්‍රත්වය', subtitle: 'ඉදිරියේදී බලාපොරොත්තු වන්න...', image: '/abhidhamma_pitaka.png', path: null },
  ];

  return (
    <div className="mobile-padding" style={{ padding: '0 5vw', width: '100%', maxWidth: '1600px', margin: '80px auto 40px auto' }}>
      
      {/* Section Header */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px', textAlign: 'center' }}
      >
        <div style={{ color: 'var(--gold-primary)', marginBottom: '16px', opacity: 0.8 }}>
          <Compass size={32} strokeWidth={1.5} />
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: 'var(--text-main)', fontWeight: '500', fontFamily: 'var(--font-sinhala)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
          දහම් පිවිසුම
        </h2>
        <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)' }}></div>
      </motion.div>

      {/* Grid Layout */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="portal-grid"
      >
        <style>{`
          .portal-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
          }
          @media (max-width: 1024px) {
            .portal-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
            }
          }
          @media (max-width: 640px) {
            .portal-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
          }
          
          .portal-card {
            position: relative;
            overflow: hidden;
            border-radius: 24px;
            border: 1px solid rgba(255,255,255,0.05);
            background: #0a0c10;
            cursor: pointer;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            /* Aspect ratio approx 4:5 for elegance */
            padding-top: 125%; 
          }
          
          .portal-card:hover {
            border-color: rgba(196,152,79,0.3);
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(196,152,79,0.05);
          }

          .portal-bg-img {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-size: cover;
            background-position: center;
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            opacity: 0.6;
            filter: grayscale(20%);
          }
          
          .portal-card:hover .portal-bg-img {
            transform: scale(1.08);
            opacity: 0.8;
            filter: grayscale(0%);
          }

          .portal-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(to top, rgba(6,7,9,1) 0%, rgba(6,7,9,0.4) 50%, rgba(6,7,9,0.1) 100%);
            transition: background 0.5s ease;
          }
          
          .portal-card:hover .portal-overlay {
            background: linear-gradient(to top, rgba(6,7,9,0.95) 0%, rgba(6,7,9,0.2) 60%, transparent 100%);
          }
          
          .portal-content {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            padding: 30px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .portal-card:hover .portal-content {
            transform: translateY(-5px);
          }

          .portal-arrow {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--gold-primary);
            font-size: 0.9rem;
            font-family: var(--font-sinhala);
            margin-top: 16px;
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .portal-card:hover .portal-arrow {
            opacity: 1;
            transform: translateX(0);
          }
        `}</style>

        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={fadeUp}
            onClick={() => card.path && navigate(card.path)}
            className="portal-card"
          >
            {/* Background Image Layer */}
            <div 
              className="portal-bg-img"
              style={{ backgroundImage: `url(${card.image})` }} 
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="portal-overlay" />

            {/* Content Layer */}
            <div className="portal-content">
              <h4 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '500', marginBottom: '8px', fontFamily: 'var(--font-sinhala)', letterSpacing: '0.02em' }}>
                {card.title}
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: '1.5', fontFamily: 'var(--font-sinhala)' }}>
                {card.subtitle}
              </p>
              
              {/* Arrow Indicator on Hover */}
              <div className="portal-arrow">
                පිවිසෙන්න <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
