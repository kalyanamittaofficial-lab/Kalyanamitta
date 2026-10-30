import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { bodhiFactors } from '../data/bodhiFactors';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  Award
} from 'lucide-react';

// Lightweight, High-Performance GPU-friendly Dharma Chakra Seal
const RealisticChakra = memo(({ size = 120 }) => (
  <svg 
    viewBox="0 0 1000 1000" 
    width={size} 
    height={size} 
    style={{ display: 'block', pointerEvents: 'none', filter: 'drop-shadow(0 8px 24px rgba(212, 175, 55, 0.35))' }}
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

  const prevFactor = bodhiFactors.find(f => f.id === (activeId > 1 ? activeId - 1 : bodhiFactors.length));
  const nextFactor = bodhiFactors.find(f => f.id === (activeId < bodhiFactors.length ? activeId + 1 : 1));

  return (
    <div style={{ 
      background: 'var(--bg-main)', 
      minHeight: '100vh', 
      overflowX: 'clip', 
      transition: 'background-color 0.3s ease, color 0.3s ease' 
    }}>
      <style>{`
        /* Smooth Rotating Chakra */
        @keyframes spinChakraGpu {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .chakra-rotating-seal {
          animation: spinChakraGpu 120s linear infinite;
          will-change: transform;
        }

        /* Responsive Layout Container */
        .path-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: clamp(36px, 6vh, 56px) 24px 100px;
        }

        /* Noble Dignified Header */
        .path-header-section {
          text-align: center;
          max-width: 860px;
          margin: 0 auto 36px;
        }

        .path-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(196, 152, 79, 0.1);
          border: 1px solid rgba(196, 152, 79, 0.3);
          color: var(--accent-gold);
          font-size: 0.84rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .path-main-title {
          font-family: var(--font-serif);
          font-size: clamp(2.4rem, 4.5vw, 3.6rem);
          color: var(--text-main);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 12px 0;
          line-height: 1.2;
        }

        .path-sub-desc {
          font-family: var(--font-sinhala);
          font-size: clamp(0.98rem, 1.6vw, 1.12rem);
          color: var(--text-muted);
          line-height: 1.75;
          max-width: 680px;
          margin: 0 auto 18px;
        }

        .path-stats-pill {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          padding: 6px 18px;
          border-radius: 30px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .path-stats-pill strong {
          color: var(--primary);
        }

        /* ── 7-Stage Horizontal Bodhi Track ── */
        .bodhi-track-wrapper {
          margin-bottom: 36px;
          position: relative;
        }

        .bodhi-track {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 1024px) {
          .bodhi-track {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 12px;
            gap: 12px;
            -webkit-overflow-scrolling: touch;
          }
          .bodhi-track-item {
            min-width: 170px;
            flex-shrink: 0;
            scroll-snap-align: start;
          }
        }

        .bodhi-track-item {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 14px 14px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 88px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .bodhi-track-item:hover {
          border-color: rgba(196, 152, 79, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        }

        .bodhi-track-item.active {
          background: var(--primary);
          border-color: var(--accent-gold);
          color: #ffffff !important;
          transform: translateY(-3px);
          box-shadow: 0 10px 26px rgba(140, 21, 21, 0.32);
        }

        .bodhi-track-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .bodhi-track-num {
          font-family: var(--font-serif);
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--accent-gold);
          opacity: 0.9;
        }

        .bodhi-track-item.active .bodhi-track-num {
          color: #fef08a;
        }

        .bodhi-track-chip {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.05);
          color: var(--text-muted);
        }

        .bodhi-track-item.active .bodhi-track-chip {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .bodhi-track-title {
          font-family: var(--font-sinhala);
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.35;
          margin: 0;
        }

        .bodhi-track-item.active .bodhi-track-title {
          color: #ffffff;
        }

        /* ── Main Stage Canvas Card ── */
        .stage-canvas {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: clamp(24px, 4vw, 44px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.04);
          position: relative;
        }

        /* Stage Header Banner */
        .stage-header-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-bottom: 28px;
          margin-bottom: 32px;
          border-bottom: 1px solid var(--glass-border);
          flex-wrap: wrap;
        }

        .stage-meta-info {
          flex: 1;
          min-width: 280px;
        }

        .stage-step-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          background: rgba(140, 21, 21, 0.08);
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 12px;
        }

        .stage-heading {
          font-family: var(--font-sinhala);
          font-size: clamp(1.9rem, 3.2vw, 2.6rem);
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 6px 0;
          line-height: 1.25;
        }

        .stage-subheading {
          font-family: var(--font-sinhala);
          font-size: 1.05rem;
          color: var(--accent-gold);
          font-weight: 600;
          margin: 0 0 14px 0;
        }

        .stage-description {
          font-family: var(--font-sinhala);
          font-size: 1.08rem;
          line-height: 1.8;
          color: var(--text-main);
          opacity: 0.92;
          margin: 0;
          max-width: 820px;
        }

        .stage-seal-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
          flex-shrink: 0;
          background: radial-gradient(circle, rgba(196, 152, 79, 0.12) 0%, transparent 70%);
          border-radius: 50%;
        }

        @media (max-width: 640px) {
          .stage-seal-wrapper {
            display: none;
          }
        }

        /* View Mode Switcher Tabs */
        .stage-tabs-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .view-toggle-group {
          display: inline-flex;
          align-items: center;
          background: var(--bg-main);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 4px;
        }

        .view-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 8px;
          font-family: var(--font-sinhala);
          font-size: 0.88rem;
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-toggle-btn.active {
          background: var(--primary);
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(140, 21, 21, 0.2);
        }

        /* ── Factor Items Grid ── */
        .factor-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
          margin-bottom: 36px;
        }

        .factor-card {
          background: var(--bg-main);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }

        .factor-card:hover {
          border-color: rgba(140, 21, 21, 0.35);
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
        }

        .factor-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .factor-num-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(140, 21, 21, 0.08);
          color: var(--primary);
          font-size: 0.86rem;
          font-weight: 800;
          font-family: var(--font-serif);
        }

        .factor-card-name {
          font-family: var(--font-sinhala);
          font-size: 1.18rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 8px 0;
          line-height: 1.35;
        }

        .factor-card-desc {
          font-family: var(--font-sinhala);
          font-size: 0.94rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0 0 16px 0;
          flex-grow: 1;
        }

        .factor-card-guide-box {
          background: var(--bg-secondary);
          border-left: 3px solid var(--accent-gold);
          border-radius: 0 8px 8px 0;
          padding: 10px 14px;
          font-family: var(--font-sinhala);
          font-size: 0.86rem;
          color: var(--text-main);
          line-height: 1.55;
          margin-bottom: 16px;
        }

        .factor-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-sinhala);
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--primary);
          text-decoration: none;
          transition: gap 0.2s ease, color 0.2s;
        }

        .factor-card-cta:hover {
          gap: 10px;
          color: var(--primary-hover);
        }

        /* ── Bottom Stage Navigation Bar ── */
        .stage-bottom-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 28px;
          border-top: 1px solid var(--glass-border);
          flex-wrap: wrap;
          gap: 16px;
        }

        .nav-stage-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border-radius: 12px;
          background: var(--bg-main);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          font-family: var(--font-sinhala);
          font-size: 0.94rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-stage-btn:hover {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(140, 21, 21, 0.25);
        }

        .stage-indicator-dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stage-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--glass-border);
          cursor: pointer;
          transition: all 0.2s;
        }

        .stage-dot.active {
          width: 24px;
          border-radius: 8px;
          background: var(--primary);
        }
      `}</style>

      <div className="path-container">
        
        {/* ── 1. Dignified Noble Dhamma Header ── */}
        <header className="path-header-section">
          <div className="path-badge">
            <Sparkles size={14} color="var(--accent-gold)" />
            <span>චතුරාර්ය සත්‍යාවබෝධය පිණිස</span>
          </div>

          <h1 className="path-main-title">
            සත්තිස් බෝධිපාක්ෂික ධර්ම
          </h1>

          <p className="path-sub-desc">
            නිවන් මඟ සම්පූර්ණ කිරීම උදෙසා භාග්‍යවතුන් වහන්සේ විසින් දේශනා කර වදාළ උතුම් ධර්මතා 37 ක් වූ අධ්‍යාත්මික පදනම.
          </p>

          <div className="path-stats-pill">
            <span>ප්‍රධාන අදියර <strong>07</strong></span>
            <span>·</span>
            <span>සමස්ත ධර්මතා <strong>37</strong></span>
            <span>·</span>
            <span>වත්මන් පියවර <strong>0{activeFactor.id} / 07</strong></span>
          </div>
        </header>

        {/* ── 2. Master 7-Stage Progression Track ── */}
        <div className="bodhi-track-wrapper">
          <div className="bodhi-track">
            {bodhiFactors.map(factor => {
              const isActive = factor.id === activeId;
              return (
                <div
                  key={factor.id}
                  onClick={() => { setActiveId(factor.id); setViewMode('overview'); }}
                  className={`bodhi-track-item ${isActive ? 'active' : ''}`}
                  title={`${factor.title} - ධර්මතා ${factor.count} ක්`}
                >
                  <div className="bodhi-track-top">
                    <span className="bodhi-track-num">0{factor.id}</span>
                    <span className="bodhi-track-chip">{factor.count} ක්</span>
                  </div>
                  <h3 className="bodhi-track-title">{factor.title}</h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 3. Active Stage Content Canvas ── */}
        <div className="stage-canvas">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* Stage Header Banner */}
              <div className="stage-header-banner">
                <div className="stage-meta-info">
                  <div className="stage-step-pill">
                    <Award size={14} />
                    <span>අදියර 0{activeFactor.id} / 07 · ධර්මතා {activeFactor.count} ක්</span>
                  </div>

                  <h2 className="stage-heading">{activeFactor.title}</h2>
                  
                  {activeFactor.subtitle && (
                    <div className="stage-subheading">
                      ✦ {activeFactor.subtitle}
                    </div>
                  )}

                  <p className="stage-description">
                    {activeFactor.description}
                  </p>
                </div>

                {/* Rotating Gold Chakra Seal */}
                <div className="stage-seal-wrapper">
                  <div className="chakra-rotating-seal">
                    <RealisticChakra size={110} />
                  </div>
                </div>
              </div>

              {/* View Switcher Controls */}
              <div className="stage-tabs-row">
                <div className="view-toggle-group">
                  <button
                    onClick={() => setViewMode('overview')}
                    className={`view-toggle-btn ${viewMode === 'overview' ? 'active' : ''}`}
                  >
                    <Layers size={16} />
                    <span>ධර්මතා විස්තරය (Overview)</span>
                  </button>
                  <button
                    onClick={() => setViewMode('practice')}
                    className={`view-toggle-btn ${viewMode === 'practice' ? 'active' : ''}`}
                  >
                    <BookOpen size={16} />
                    <span>දෛනික පුහුණු සිතියම (Practice Map)</span>
                  </button>
                </div>

                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--font-sinhala)' }}>
                  ධර්මතා {activeFactor.items.length} න් සියල්ල මෙහි දැක්වේ
                </div>
              </div>

              {/* Overview Mode: Responsive Factor Cards Grid */}
              {viewMode === 'overview' ? (
                <div className="factor-cards-grid">
                  {activeFactor.items.map((item, idx) => (
                    <div key={idx} className="factor-card">
                      <div>
                        <div className="factor-card-top">
                          <span className="factor-num-badge">0{idx + 1}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {activeFactor.title}
                          </span>
                        </div>
                        <h4 className="factor-card-name">{item.name}</h4>
                        <p className="factor-card-desc">{item.desc}</p>
                        
                        {item.guide && (
                          <div className="factor-card-guide-box">
                            <strong>පුහුණු මඟපෙන්වීම:</strong> {item.guide}
                          </div>
                        )}
                      </div>

                      <Link 
                        to={`/practice/${activeFactor.id}/${idx}`} 
                        className="factor-card-cta"
                      >
                        <span>පුහුණුවට පිවිසෙන්න</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                /* Practice Map Mode: Sequential Pathway */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
                  {activeFactor.items.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: 'var(--bg-main)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1, minWidth: '260px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: 'rgba(140, 21, 21, 0.08)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          flexShrink: 0
                        }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', lineHeight: 1.5 }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>

                      <Link 
                        to={`/practice/${activeFactor.id}/${idx}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 20px',
                          borderRadius: '10px',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--primary)',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          textDecoration: 'none',
                          fontFamily: 'var(--font-sinhala)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                      >
                        <BookOpen size={16} />
                        <span>පුහුණු උපදෙස්</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* ── 4. Bottom Previous / Next Controls ── */}
              <div className="stage-bottom-nav">
                <button 
                  onClick={handlePrev}
                  className="nav-stage-btn"
                  title={`පෙර අදියර: ${prevFactor.title}`}
                >
                  <ChevronLeft size={18} />
                  <span>පෙර: {prevFactor.title}</span>
                </button>

                <div className="stage-indicator-dots">
                  {bodhiFactors.map(f => (
                    <div 
                      key={f.id}
                      onClick={() => { setActiveId(f.id); setViewMode('overview'); }}
                      className={`stage-dot ${f.id === activeId ? 'active' : ''}`}
                      title={f.title}
                    />
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="nav-stage-btn"
                  title={`මීළඟ අදියර: ${nextFactor.title}`}
                >
                  <span>මීළඟ: {nextFactor.title}</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
