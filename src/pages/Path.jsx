import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { bodhiFactors } from '../data/bodhiFactors';
import { ChevronLeft, ChevronRight, Compass, Sparkles, BookOpen } from 'lucide-react';

// Lightweight, High-Performance GPU-friendly Dharma Chakra (0% CPU load)
const RealisticChakra = memo(() => (
  <svg 
    viewBox="0 0 1000 1000" 
    width="100%" 
    height="100%" 
    style={{ display: 'block', pointerEvents: 'none' }}
  >
    <defs>
      <linearGradient id="gold-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="25%" stopColor="#d4af37" />
        <stop offset="50%" stopColor="#854d0e" />
        <stop offset="75%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#fef08a" />
      </linearGradient>
      
      <linearGradient id="gold-grad-rim" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      
      <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="45%" stopColor="#eab308" />
        <stop offset="80%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#713f12" />
      </radialGradient>

      <radialGradient id="rim-bevel" cx="50%" cy="50%" r="50%">
        <stop offset="86%" stopColor="transparent" />
        <stop offset="93%" stopColor="rgba(255,255,255,0.4)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
      </radialGradient>
    </defs>

    {/* Concentric Gold Rim Layers */}
    <circle cx="500" cy="500" r="454" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="6" />
    <circle cx="500" cy="500" r="450" fill="none" stroke="url(#gold-grad-main)" strokeWidth="46" />
    <circle cx="500" cy="500" r="450" fill="none" stroke="url(#rim-bevel)" strokeWidth="46" />
    <circle cx="500" cy="500" r="425" fill="none" stroke="url(#gold-grad-rim)" strokeWidth="8" />
    <circle cx="500" cy="500" r="475" fill="none" stroke="url(#gold-grad-rim)" strokeWidth="8" />
    <circle cx="500" cy="500" r="450" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />

    {/* 8 Noble Spokes */}
    {[...Array(8)].map((_, i) => {
      const angle = (i * 360) / 8;
      return (
        <g key={`spoke-${i}`} transform={`rotate(${angle} 500 500)`}>
          <path d="M 484 395 L 493 138 L 507 138 L 516 395 Z" fill="url(#gold-grad-main)" />
          <line x1="500" y1="395" x2="500" y2="138" stroke="#fff" strokeWidth="2" opacity="0.4" />
          <polygon points="500,98 474,138 500,158 526,138" fill="url(#gold-grad-rim)" />
          <circle cx="500" cy="118" r="4" fill="#fff" opacity="0.8" />
        </g>
      );
    })}

    {/* Center Hub */}
    <circle cx="500" cy="500" r="102" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="4" />
    <circle cx="500" cy="500" r="100" fill="url(#hub-glow)" />
    <circle cx="500" cy="500" r="80" fill="none" stroke="url(#gold-grad-rim)" strokeWidth="6" />
    <circle cx="500" cy="500" r="79" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.4" />
    <circle cx="500" cy="500" r="42" fill="url(#gold-grad-main)" />
    <circle cx="500" cy="500" r="22" fill="#fff" opacity="0.85" />
    <circle cx="500" cy="500" r="10" fill="url(#gold-grad-rim)" />

    {/* 24 Circumferential Gold Studs */}
    {[...Array(24)].map((_, i) => {
      const angle = (i * 360) / 24;
      return (
        <g key={`stud-${i}`} transform={`rotate(${angle} 500 500)`}>
          <circle cx="500" cy="25" r="12" fill="url(#gold-grad-main)" />
          <circle cx="500" cy="25" r="5" fill="#fff" opacity="0.65" />
        </g>
      );
    })}
  </svg>
));

export default function Path() {
  const [activeId, setActiveId] = useState(1);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'practice'
  const activeFactor = bodhiFactors.find(f => f.id === activeId) || bodhiFactors[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleNext = () => {
    setActiveId(prev => (prev < bodhiFactors.length ? prev + 1 : 1));
    setViewMode('overview');
  };

  const handlePrev = () => {
    setActiveId(prev => (prev > 1 ? prev - 1 : bodhiFactors.length));
    setViewMode('overview');
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', overflowX: 'clip', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <style>{`
        /* GPU-Accelerated Zero-Lag Rotation */
        @keyframes spinChakraGpu {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .chakra-rotating-element {
          animation: spinChakraGpu 160s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }

        .chakra-layout {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 100vh;
          position: relative;
          padding-bottom: 80px;
        }

        /* Top Hero Banner */
        .chakra-hero {
          padding: clamp(90px, 12vh, 120px) 24px 20px;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .chakra-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 30px;
          background: rgba(140, 21, 21, 0.08);
          border: 1px solid rgba(140, 21, 21, 0.2);
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .chakra-hero h1 {
          font-family: var(--font-sinhala);
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          color: var(--text-main);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 12px 0;
          line-height: 1.25;
        }

        .chakra-hero p {
          font-family: var(--font-sinhala);
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: var(--text-muted);
          line-height: 1.7;
          margin: 0 auto;
        }

        /* Horizontal Category Stepper Strip */
        .chakra-nav-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 1400px;
          margin: 20px auto 40px;
          padding: 8px 24px;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .chakra-nav-strip::-webkit-scrollbar {
          display: none;
        }

        .chakra-nav-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 40px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          font-family: var(--font-sinhala);
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }

        .chakra-nav-pill:hover {
          color: var(--text-main);
          border-color: rgba(140, 21, 21, 0.4);
          transform: translateY(-1px);
        }

        .chakra-nav-pill.active {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
          box-shadow: 0 6px 18px rgba(140, 21, 21, 0.35);
          transform: translateY(-1px);
        }

        .chakra-nav-pill .pill-num {
          font-size: 0.8rem;
          opacity: 0.8;
          font-weight: 700;
        }

        .chakra-nav-pill .pill-count {
          font-size: 0.78rem;
          opacity: 0.7;
          padding: 2px 6px;
          background: rgba(0, 0, 0, 0.12);
          border-radius: 12px;
        }
        .chakra-nav-pill.active .pill-count {
          background: rgba(255, 255, 255, 0.22);
        }

        /* Interactive Area */
        .chakra-interactive-area {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 24px;
          gap: 32px;
        }

        @media (min-width: 1024px) {
          .chakra-interactive-area {
            flex-direction: row;
            align-items: flex-start;
            gap: 48px;
          }
        }

        /* Wheel Container */
        .chakra-wheel-side {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 1024px) {
          .chakra-wheel-side {
            flex: 0.95;
            position: -webkit-sticky;
            position: sticky;
            top: 100px;
            align-self: flex-start;
          }
        }

        .wheel-scaler {
          position: relative;
          width: 82vw;
          height: 82vw;
          max-width: 440px;
          max-height: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 15px 35px rgba(196, 152, 79, 0.2));
        }

        /* Interactive Nodes around the Wheel */
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
          background: var(--bg-main);
          border: 3px solid var(--primary);
          color: var(--primary);
          z-index: 50;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          width: 52px;
          height: 52px;
          font-size: 1.15rem;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s, color 0.2s, box-shadow 0.2s;
        }

        @media (min-width: 1024px) {
          .chakra-node {
            width: 62px;
            height: 62px;
            font-size: 1.35rem;
            border-width: 3.5px;
          }
        }

        .chakra-node:hover {
          transform: translate(-50%, -50%) scale(1.15);
          background: var(--primary);
          color: #fff;
          box-shadow: 0 12px 30px rgba(140, 21, 21, 0.35);
        }

        .chakra-node.active {
          background: var(--primary);
          color: #fff;
          transform: translate(-50%, -50%) scale(1.22);
          box-shadow: 0 14px 36px rgba(140, 21, 21, 0.45);
          border-color: #fff;
        }

        .node-pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid var(--primary);
          opacity: 0.6;
          animation: nodePulse 2s infinite ease-out;
          pointer-events: none;
        }

        @keyframes nodePulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        /* Node Tooltip Label */
        .node-tooltip {
          position: absolute;
          bottom: -32px;
          left: 50%;
          transform: translateX(-50%);
          background: #111;
          color: #fff;
          font-family: var(--font-sinhala);
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 12px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 60;
        }
        .chakra-node:hover .node-tooltip,
        .chakra-node.active .node-tooltip {
          opacity: 1;
        }

        /* Sequential Step Controls below the Wheel */
        .wheel-step-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
        }

        .step-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          font-family: var(--font-sinhala);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .step-btn:hover {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .step-counter {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--text-muted);
        }
        .step-counter strong {
          color: var(--primary);
          font-size: 1.3rem;
        }

        /* Right Content Panel */
        .chakra-content-panel {
          flex: 1.25;
          width: 100%;
          max-width: 820px;
          margin: 0 auto;
        }

        .content-glass-card {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: clamp(24px, 4vw, 44px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.04);
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        /* Factor Items Grid */
        .factor-items-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          margin-bottom: 2rem;
        }

        @media (min-width: 640px) {
          .factor-items-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .factor-item-card {
          background: var(--bg-main);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .factor-item-card:hover {
          border-color: rgba(140, 21, 21, 0.35);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
        }

        .factor-item-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .factor-item-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(140, 21, 21, 0.1);
          color: var(--primary);
          font-size: 0.78rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .factor-item-title {
          font-family: var(--font-sinhala);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }

        .factor-item-desc {
          font-family: var(--font-sinhala);
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin: 0;
        }

        /* Practice Action CTA */
        .practice-cta-btn {
          width: 100%;
          padding: 16px 24px;
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 1.05rem;
          font-weight: 700;
          font-family: var(--font-sinhala);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 8px 24px rgba(140, 21, 21, 0.3);
          transition: all 0.2s;
        }

        .practice-cta-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow: 0 12px 28px rgba(140, 21, 21, 0.4);
        }
      `}</style>

      <div className="chakra-layout">
        
        {/* ── Top Hero Title ── */}
        <div className="chakra-hero">
          <div className="chakra-hero-badge">
            <Sparkles size={14} /> බුද්ධ දේශනාව · චතුරාර්ය සත්‍යාවබෝධය පිණිස
          </div>
          <h1>සත්තිස් බෝධිපාක්ෂික ධර්ම</h1>
          <p>
            නිවන් මඟ සම්පූර්ණ කිරීම උදෙසා භාග්‍යවතුන් වහන්සේ විසින් දේශනා කර වදාළ උතුම් ධර්මතා 37 ක් වූ අධ්‍යාත්මික පදනම.
          </p>
        </div>

        {/* ── Category Quick-Selector Strip ── */}
        <div className="chakra-nav-strip">
          {bodhiFactors.map((factor) => {
            const isActive = activeId === factor.id;
            return (
              <button
                key={factor.id}
                onClick={() => { setActiveId(factor.id); setViewMode('overview'); }}
                className={`chakra-nav-pill ${isActive ? 'active' : ''}`}
              >
                <span className="pill-num">0{factor.id}.</span>
                <span>{factor.title}</span>
                <span className="pill-count">{factor.count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Main Interactive Section ── */}
        <div className="chakra-interactive-area">
          
          {/* LEFT: GPU-Accelerated Sticky Golden Wheel */}
          <div className="chakra-wheel-side">
            <div className="wheel-scaler">
              
              {/* Pure GPU-accelerated rotating wheel element */}
              <div 
                className="chakra-rotating-element" 
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
              >
                <RealisticChakra />
              </div>

              {/* 7 Evenly Spaced Factor Nodes */}
              {bodhiFactors.map((factor, i) => {
                const rad = (i * 2 * Math.PI) / 7 - Math.PI / 2;
                const radiusPercent = 58; 
                const left = `calc(50% + ${Math.cos(rad) * radiusPercent}%)`;
                const top = `calc(50% + ${Math.sin(rad) * radiusPercent}%)`;
                const isActive = activeId === factor.id;

                return (
                  <button
                    key={factor.id}
                    className={`chakra-node ${isActive ? 'active' : ''}`}
                    style={{ left, top }}
                    onClick={() => { setActiveId(factor.id); setViewMode('overview'); }}
                    aria-label={factor.title}
                  >
                    <span>0{factor.id}</span>
                    {isActive && <span className="node-pulse-ring" />}
                    <span className="node-tooltip">{factor.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Step Buttons */}
            <div className="wheel-step-controls">
              <button onClick={handlePrev} className="step-btn" title="පෙර ධර්මතාවය">
                <ChevronLeft size={16} /> පෙර
              </button>
              <div className="step-counter">
                <strong>0{activeId}</strong> / 0{bodhiFactors.length}
              </div>
              <button onClick={handleNext} className="step-btn" title="මීළඟ ධර්මතාවය">
                මීළඟ <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT: Factor Content Card */}
          <div className="chakra-content-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="content-glass-card"
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'rgba(140, 21, 21, 0.08)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                        ධර්මතා {activeFactor.count} ක්
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        පියවර 0{activeFactor.id} / 07
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-sinhala)', fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', color: 'var(--text-main)', fontWeight: 800, margin: '0 0 6px 0', lineHeight: 1.25 }}>
                      {activeFactor.title}
                    </h2>
                    
                    {activeFactor.subtitle && (
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--accent-gold)', fontWeight: 600, fontFamily: 'var(--font-sinhala)' }}>
                        ✦ {activeFactor.subtitle}
                      </p>
                    )}
                  </div>

                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', color: 'var(--primary)', opacity: 0.18, lineHeight: 0.8, fontWeight: 300 }}>
                    0{activeFactor.id}
                  </div>
                </div>

                {viewMode === 'overview' ? (
                  <>
                    {/* Description */}
                    <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--text-main)', opacity: 0.9, marginBottom: '2rem' }}>
                      {activeFactor.description}
                    </p>

                    {/* Factor Items Grid */}
                    <div className="factor-items-grid">
                      {activeFactor.items.map((item, idx) => (
                        <div key={idx} className="factor-item-card">
                          <div className="factor-item-header">
                            <span className="factor-item-num">0{idx + 1}</span>
                            <h4 className="factor-item-title">{item.name}</h4>
                          </div>
                          <p className="factor-item-desc">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Practice Guide Action Button */}
                    <button 
                      onClick={() => setViewMode('practice')}
                      className="practice-cta-btn"
                    >
                      <BookOpen size={18} />
                      ප්‍රායෝගික පුහුණුවට පිවිසෙන්න <span>→</span>
                    </button>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.3 }}
                  >
                    <button 
                      onClick={() => setViewMode('overview')} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--primary)', 
                        fontWeight: 700, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        cursor: 'pointer', 
                        padding: 0, 
                        marginBottom: '1.5rem',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-sinhala)'
                      }}
                    >
                      ← ආපසු විස්තරයට (Back to Overview)
                    </button>

                    <h3 style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 700 }}>
                      පුහුණුවීම් සිතියම (Practice Progress Map)
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.95rem', fontFamily: 'var(--font-sinhala)' }}>
                      ඔබගේ දෛනික ජීවිතය තුළ මෙම ධර්මතාවය ප්‍රායෝගිකව දියුණු කරන ආකාරය මෙහි දැක්වේ. පියවරෙන් පියවර සම්පූර්ණ කර සලකුණු කරන්න.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '23px', top: '24px', bottom: '24px', width: '2px', background: 'var(--glass-border)', zIndex: 1 }} />
                      
                      {activeFactor.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '18px', position: 'relative', zIndex: 2 }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'var(--bg-main)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
                            {idx + 1}
                          </div>
                          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '18px 22px', flex: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '16px', fontFamily: 'var(--font-sinhala)' }}>
                              අද දිනයේදී {item.desc} සඳහා කාලය වෙන් කරන්න.
                            </div>
                            
                            <Link to={`/practice/${activeFactor.id}/${idx}`} style={{ textDecoration: 'none' }}>
                              <button 
                                style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '8px', 
                                  cursor: 'pointer', 
                                  background: 'var(--bg-secondary)', 
                                  padding: '10px 18px', 
                                  borderRadius: '10px', 
                                  border: '1px solid var(--primary)', 
                                  color: 'var(--primary)', 
                                  fontWeight: 600, 
                                  fontFamily: 'var(--font-sinhala)', 
                                  fontSize: '0.9rem',
                                  transition: 'all 0.2s' 
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                              >
                                සවිස්තරාත්මක පුහුණුව අරඹන්න <span>→</span>
                              </button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
