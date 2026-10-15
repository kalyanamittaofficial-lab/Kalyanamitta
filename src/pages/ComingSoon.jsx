import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, BookOpen, Headphones, Home, ArrowLeft } from 'lucide-react';

const routeDetailsMap = {
  '/layman': {
    title: 'ගිහි දිවියේ විනය',
    subtitle: 'ගිහි දිවිය ධර්මානුකූලව සහ සාර්ථකව ගත කිරීමේ ප්‍රතිපත්ති මඟ',
    category: 'දිවියට දහම'
  },
  '/wellness': {
    title: 'සිතේ සුවය',
    subtitle: 'මානසික පීඩා දුරු කර අධ්‍යාත්මික සහනය ළඟා කරගැනීම',
    category: 'දිවියට දහම'
  },
  '/discussions': {
    title: 'දහම් සාකච්ඡා',
    subtitle: 'ගැඹුරු ධර්ම කරුණු සාකච්ඡා සහ ප්‍රශ්නෝත්තර මාලා',
    category: 'දේශනා හා භාවනා'
  },
  '/pali': {
    title: 'පාලි භාෂාව',
    subtitle: 'ත්‍රිපිටක පාළි භාෂාවේ මූලික සහ උසස් අධ්‍යයන පාඨමාලා',
    category: 'දහම් අධ්‍යයනය'
  },
  '/sutta': {
    title: 'සූත්‍ර අධ්‍යයනය',
    subtitle: 'උතුම් සූත්‍ර දේශනා අර්ථ විවරණ සහ ගැටපද විවරණ සහිතව හැදෑරීම',
    category: 'දහම් අධ්‍යයනය'
  },
  '/pdf-books': {
    title: 'PDF ධර්ම ග්‍රන්ථ',
    subtitle: 'නොමිලේ කියවිය හැකි සහ බාගත හැකි උසස් ධර්ම ග්‍රන්ථ එකතුව',
    category: 'සම්පත් · ඩිජිටල් පුස්තකාලය'
  },
  '/magazines': {
    title: 'මාසික සඟරා',
    subtitle: 'කල්‍යාණමිත්ත මාසික ධර්ම ප්‍රකාශන සහ සඟරා සංග්‍රහය',
    category: 'සම්පත් · ඩිජිටල් පුස්තකාලය'
  },
  '/temple-dev': {
    title: 'විහාරස්ථාන සංවර්ධන',
    subtitle: 'අවශ්‍යතා සහිත දුෂ්කර ආරණ්‍ය සේනාසන හා වෙහෙර විහාර ප්‍රතිසංස්කරණ පුණ්‍යකර්ම',
    category: 'සම්පත් · පුණ්‍යකර්ම'
  },
  '/kids': {
    title: 'ළමා වැඩසටහන්',
    subtitle: 'දහම් ගුණ වඩන දරු දැරියන් වෙනුවෙන් විශේෂ ළමා ධර්ම වැඩසටහන්',
    category: 'සම්පත් · වෙනත් සේවා'
  },
  '/social': {
    title: 'සමාජ සත්කාර',
    subtitle: 'කරුණාව සහ මෛත්‍රිය පෙරදැරි කරගත් සමාජ සුබසාධන මෙහෙවර',
    category: 'සම්පත් · වෙනත් සේවා'
  }
};

export default function ComingSoon({ defaultTitle, defaultSubtitle, defaultCategory }) {
  const location = useLocation();
  const matched = routeDetailsMap[location.pathname] || {};
  
  const title = defaultTitle || matched.title || 'ඉදිරියේදී බලාපොරොත්තු වන්න';
  const subtitle = defaultSubtitle || matched.subtitle || 'මෙම පිටුවේ අන්තර්ගතය දැනට සම්පාදනය වෙමින් පවතී.';
  const category = defaultCategory || matched.category || 'කල්‍යාණමිත්ත';

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: ' clamp(40px, 8vh, 80px) 24px 100px',
      position: 'relative'
    }}>
      <style>{`
        .coming-soon-card {
          width: 100%;
          max-width: 780px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 28px;
          padding: clamp(32px, 6vw, 64px);
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.04);
          position: relative;
          overflow: hidden;
        }

        .cs-lotus-ring {
          position: relative;
          width: 90px;
          height: 90px;
          margin: 0 auto 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(140, 21, 21, 0.06);
          border: 2px solid var(--accent-gold);
          color: var(--accent-gold);
          font-size: 2.5rem;
          box-shadow: 0 8px 30px rgba(196, 152, 79, 0.2);
        }

        .cs-pulse {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px dashed var(--accent-gold);
          opacity: 0.6;
          animation: spinPulse 20s linear infinite;
        }

        @keyframes spinPulse {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cs-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 20px;
          background: rgba(196, 152, 79, 0.12);
          border: 1px solid rgba(196, 152, 79, 0.3);
          color: var(--accent-gold);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .cs-title {
          font-family: var(--font-serif);
          font-size: clamp(2.2rem, 4.5vw, 3.2rem);
          color: var(--text-main);
          font-weight: 800;
          letter-spacing: -0.01em;
          margin: 0 0 12px 0;
          line-height: 1.25;
        }

        .cs-subtitle {
          font-family: var(--font-sinhala);
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: var(--primary);
          font-weight: 600;
          margin: 0 auto 24px;
          max-width: 620px;
          line-height: 1.6;
        }

        .cs-desc {
          font-family: var(--font-sinhala);
          font-size: 0.98rem;
          color: var(--text-muted);
          line-height: 1.8;
          max-width: 600px;
          margin: 0 auto 36px;
        }

        .cs-links-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          max-width: 620px;
          margin: 0 auto 36px;
          text-align: left;
        }

        @media (min-width: 640px) {
          .cs-links-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .cs-link-card {
          background: var(--bg-main);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text-main);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cs-link-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.04);
          color: var(--primary);
        }

        .cs-link-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(140, 21, 21, 0.08);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cs-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 30px;
          background: var(--primary);
          color: #ffffff;
          font-family: var(--font-sinhala);
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(140, 21, 21, 0.25);
        }

        .cs-back-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(140, 21, 21, 0.35);
        }
      `}</style>

      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="coming-soon-card"
      >
        {/* Sacred Dharmachakra Emblem */}
        <div className="cs-lotus-ring">
          <div className="cs-pulse" />
          <span>☸</span>
        </div>

        {/* Category & Eyebrow */}
        <div className="cs-eyebrow">
          <span>{category}</span>
          <span>·</span>
          <span>Coming Soon</span>
        </div>

        {/* Section Title */}
        <h1 className="cs-title">{title}</h1>
        <p className="cs-subtitle">{subtitle}</p>

        {/* Explanation Message */}
        <p className="cs-desc">
          මෙම පිටුව දැනට සංවර්ධනය වෙමින් පවතී. උතුම් ශ්‍රී සද්ධර්මය නිර්මලව සහ ක්‍රමවත්ව ඔබ වෙත ඉදිරිපත් කිරීම සඳහා අප කණ්ඩායම අන්තර්ගතයන් සම්පාදනය කරමින් සිටී. ළඟදීම බලාපොරොත්තු වන්න.
        </p>

        {/* Suggested Active Links */}
        <div className="cs-links-grid">
          <Link to="/path" className="cs-link-card">
            <div className="cs-link-icon">
              <Compass size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-sinhala)' }}>ධර්ම මාර්ගය</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>සත්තිස් බෝධිපාක්ෂික ධර්ම</div>
            </div>
          </Link>

          <Link to="/sermons" className="cs-link-card">
            <div className="cs-link-icon">
              <Headphones size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-sinhala)' }}>දහම් දේශනා</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>දේශනා ශ්‍රවණය කරන්න</div>
            </div>
          </Link>

          <Link to="/life" className="cs-link-card">
            <div className="cs-link-icon">
              <BookOpen size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-sinhala)' }}>දහම සහ ජීවිතය</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ධර්ම ලිපි හා සංග්‍රහ</div>
            </div>
          </Link>

          <Link to="/notices" className="cs-link-card">
            <div className="cs-link-icon">
              <Home size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-sinhala)' }}>දිනදසුන හා නිවේදන</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ඉදිරි ධර්ම වැඩසටහන්</div>
            </div>
          </Link>
        </div>

        {/* Back to Home Button */}
        <Link to="/" className="cs-back-btn">
          <ArrowLeft size={16} />
          <span>මුල් පිටුවට පිවිසෙන්න</span>
        </Link>
      </motion.div>
    </div>
  );
}
