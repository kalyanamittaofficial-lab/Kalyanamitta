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
    <div className="mobile-padding" style={{ padding: '0 5vw', width: '100%', maxWidth: '1400px', margin: '80px auto 40px auto' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '40px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '20px' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', color: 'var(--primary)', fontWeight: '700', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          දහම් පිවිසුම
        </h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontFamily: 'var(--font-sinhala)' }}>
          ධර්ම මාර්ගයේ විවිධ පැතිකඩයන් ගවේෂණය කරන්න
        </div>
      </div>

      {/* Grid Layout */}
      <div className="portal-grid">
        <style>{`
          .portal-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
          }
          @media (max-width: 1024px) {
            .portal-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 30px;
            }
          }
          @media (max-width: 640px) {
            .portal-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
          }
          
          .portal-card {
            display: flex;
            flex-direction: column;
            background: var(--bg-main);
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 4px; /* Minimalistic rounded corners */
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
            overflow: hidden;
            position: relative;
          }
          
          .portal-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.08);
            border-color: var(--primary);
          }

          .portal-img-container {
            width: 100%;
            padding-top: 60%; /* 5:3 Aspect Ratio */
            position: relative;
            background: var(--bg-secondary);
            overflow: hidden;
          }

          .portal-bg-img {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-size: cover;
            background-position: center;
            transition: transform 0.5s ease;
            filter: grayscale(10%);
          }
          
          .portal-card:hover .portal-bg-img {
            transform: scale(1.05);
            filter: grayscale(0%);
          }
          
          .portal-content {
            padding: 24px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
          }

          .portal-arrow {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--primary);
            font-size: 0.95rem;
            font-weight: 600;
            font-family: var(--font-sinhala);
            margin-top: auto;
            padding-top: 16px;
            transition: gap 0.3s ease;
          }

          .portal-card:hover .portal-arrow {
            gap: 12px;
          }
        `}</style>

        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => card.path && navigate(card.path)}
            className="portal-card"
          >
            {/* Image Layer */}
            <div className="portal-img-container">
              <div 
                className="portal-bg-img"
                style={{ backgroundImage: `url(${card.image})` }} 
              />
            </div>

            {/* Content Layer */}
            <div className="portal-content">
              <h4 style={{ color: 'var(--text-main)', fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
                {card.title}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: 'var(--font-sinhala)' }}>
                {card.subtitle}
              </p>
              
              {/* Arrow Indicator */}
              <div className="portal-arrow">
                පිවිසෙන්න <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
