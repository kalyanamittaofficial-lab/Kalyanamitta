import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';

// --- Premium Elite Nav Data ---
const allNavItems = [
  { name: 'මුල් පිටුව', path: '/' },
  { name: 'ඔබ කවුද?', path: '/lifecycle' },
  { name: 'ධර්ම මාර්ගය', path: '/path' },
  { name: 'කල්‍යාණ මිත්‍රත්වය', path: '/community' },
  { 
    name: 'දහම් මග', 
    isMegaMenu: true,
    columns: [
      {
        title: 'ප්‍රායෝගික ධර්මය',
        items: [
          { name: 'ජීවිතයට ධර්මය', path: '/life' },
          { name: 'ගිහි විනය', path: '/layman', isPlaceholder: true },
          { name: 'මානසික සුවය', path: '/wellness', isPlaceholder: true }
        ]
      },
      {
        title: 'දේශනා සහ භාවනා',
        items: [
          { name: 'ධර්ම දේශනා', path: '/sermons' },
          { name: 'භාවනා වැඩසටහන්', path: '/meditation' },
          { name: 'විශේෂ සාකච්ඡා', path: '/discussions', isPlaceholder: true }
        ]
      },
      {
        title: 'අධ්‍යයන අංශය',
        items: [
          { name: 'බෞද්ධ ඉතිහාසය', path: '/history' },
          { name: 'පාලි භාෂා අධ්‍යයනය', path: '/pali', isPlaceholder: true },
          { name: 'සූත්‍ර විවරණ', path: '/sutta', isPlaceholder: true }
        ]
      }
    ]
  },
  { 
    name: 'සම්පත්', 
    isMegaMenu: true,
    columns: [
      {
        title: 'ඩිජිටල් පුස්තකාලය',
        items: [
          { name: 'කල්‍යාණමිත්ත පුස්තකාලය', path: '/words', disabled: true },
          { name: 'PDF ග්‍රන්ථ', path: '/pdf-books', isPlaceholder: true },
          { name: 'මාසික සඟරා', path: '/magazines', isPlaceholder: true }
        ]
      },
      {
        title: 'පුණ්‍යකර්ම',
        items: [
          { name: 'ධර්ම දාන', path: '/dharmadhana' },
          { name: 'විහාරස්ථාන සංවර්ධන', path: '/temple-dev', isPlaceholder: true }
        ]
      },
      {
        title: 'වෙනත් සේවා',
        items: [
          { name: 'ළමා වැඩසටහන්', path: '/kids', isPlaceholder: true },
          { name: 'සමාජ සත්කාර', path: '/social', isPlaceholder: true }
        ]
      }
    ]
  },
  { name: 'ශාසනය සුරකිමු', path: '/sasanaya' }
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState('light');
  
  // Mega menu state
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const headerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Initialize theme and Auth (Runs ONLY ONCE)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handle Scroll and Click Outside (Optimized to prevent heavy re-renders)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          setActiveMegaMenu(null); // Close menu on scroll
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveMegaMenu(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array! We don't want to re-attach listeners on every hover.

  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleMouseEnter = (item) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (item.isMegaMenu) {
      setActiveMegaMenu(item);
    } else {
      // Grace period: don't instantly close if the user accidentally swipes across a normal link 
      // while trying to move their mouse down into the Mega Menu.
      timeoutRef.current = setTimeout(() => {
        setActiveMegaMenu(null);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 300); // 300ms delay for smooth UX when leaving the header
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'rgba(25, 25, 25, 0.98)' : 'rgba(255, 255, 255, 0.98)';
  const solidBg = isDark ? '#191919' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#0a0a0a';
  const textMuted = isDark ? '#8a8a8a' : '#666666';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  
  const isAnyMegaMenuOpen = activeMegaMenu !== null;

  return (
    <>
      <style>{`
        .premium-header-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: ${isAnyMegaMenuOpen ? solidBg : (isScrolled ? bgColor : 'transparent')};
          /* Removed heavy backdrop-filter blur for immense performance boost while scrolling */
          border-bottom: 1px solid ${isScrolled || isAnyMegaMenuOpen ? borderColor : 'transparent'};
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        .premium-header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 5%;
          height: 85px;
          max-width: 1920px;
          margin: 0 auto;
        }

        .premium-desktop-nav {
          display: none;
          height: 100%;
          align-items: center;
          gap: 36px;
        }

        @media (min-width: 1100px) {
          .premium-desktop-nav {
            display: flex;
          }
          .premium-mobile-toggle {
            display: none !important;
          }
        }

        .premium-mobile-toggle {
          display: flex;
          background: transparent;
          border: none;
          color: ${textColor};
          cursor: pointer;
          padding: 10px;
        }

        .premium-nav-item {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          font-family: var(--font-sinhala);
          font-size: 1.05rem;
          font-weight: 500;
          color: ${textColor};
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s ease;
          letter-spacing: -0.01em;
        }

        .premium-nav-item:hover, .premium-nav-item.active {
          color: var(--primary);
        }

        .premium-nav-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: var(--primary);
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
        }

        .premium-mega-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: ${solidBg};
          border-bottom: 1px solid ${borderColor};
          box-shadow: 0 40px 80px rgba(0,0,0,0.06);
          padding: 60px 5% 80px 5%;
          overflow: hidden;
          z-index: 999;
        }

        .mega-menu-backdrop {
          position: fixed;
          top: 85px;
          left: 0;
          width: 100%;
          height: calc(100vh - 85px);
          background: rgba(0,0,0,0.4);
          /* Removed backdrop filter blur here as well for performance */
          z-index: 998;
        }
      `}</style>

      <div 
        className="premium-header-wrapper" 
        ref={headerRef}
        onMouseLeave={handleMouseLeave}
      >
        <div className="premium-header-container">
          
          {/* Elite Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }} onClick={() => setActiveMegaMenu(null)}>
            <img src="/kalyanamitta-logo.png" alt="Logo" style={{ height: '48px', width: 'auto' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: textColor, letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
                Kalyanamitta
              </div>
              <div style={{ fontSize: '0.9rem', color: textMuted, letterSpacing: '0.04em', fontFamily: 'var(--font-sinhala)', fontWeight: 500, opacity: 0.8 }}>
                කල්‍යාණමිත්ත
              </div>
            </div>
          </Link>

          {/* Premium Desktop Navigation */}
          <nav className="premium-desktop-nav">
            {allNavItems.map(item => {
              const isMegaOpen = activeMegaMenu?.name === item.name;
              const isActiveRoute = !item.isMegaMenu && location.pathname === item.path;
              const isActive = isMegaOpen || isActiveRoute;

              return (
                <div 
                  key={item.name} 
                  style={{ height: '100%' }}
                  onMouseEnter={() => handleMouseEnter(item)}
                >
                  {item.isMegaMenu ? (
                    <div className={`premium-nav-item ${isActive ? 'active' : ''}`}>
                      {item.name}
                      {isActive && (
                        <motion.div layoutId="premiumNavIndicator" className="premium-nav-indicator" />
                      )}
                    </div>
                  ) : (
                    <Link 
                      to={item.path} 
                      className={`premium-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveMegaMenu(null)}
                    >
                      {item.name}
                      {isActive && (
                        <motion.div layoutId="premiumNavIndicator" className="premium-nav-indicator" />
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Premium Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: textColor, cursor: 'pointer', opacity: 0.7, padding: 0, display: 'flex', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            {session ? (
              <Link to="/dashboard" className="premium-desktop-nav" style={{ color: textColor, textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                Profile
              </Link>
            ) : (
              <Link to="/login" className="premium-desktop-nav" style={{ color: textColor, textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                Login
              </Link>
            )}

            <button 
              className="premium-mobile-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={30} strokeWidth={1.5} /> : <Menu size={30} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* --- Flawless Mega Menu --- */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="premium-mega-menu"
              onMouseEnter={() => handleMouseEnter(activeMegaMenu)}
              onMouseLeave={handleMouseLeave}
            >
              <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Title Area */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '32px', marginBottom: '48px' }}>
                  <div style={{ fontSize: '2rem', fontFamily: 'var(--font-sinhala)', color: textColor, fontWeight: 700, letterSpacing: '-0.01em' }}>
                    {activeMegaMenu.name}
                  </div>
                  <button onClick={() => setActiveMegaMenu(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = textColor} onMouseLeave={e => e.currentTarget.style.color = textMuted}>
                    <X size={32} strokeWidth={1} />
                  </button>
                </div>

                {/* Columns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '80px' }}>
                  {activeMegaMenu.columns.map((col, idx) => (
                    <div key={idx}>
                      <h3 style={{ 
                        fontSize: '1.2rem', 
                        fontFamily: 'var(--font-sinhala)', 
                        color: textColor,
                        fontWeight: 700,
                        marginBottom: '28px',
                        letterSpacing: '-0.01em'
                      }}>
                        {col.title}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {col.items.map((item, i) => (
                          item.disabled ? (
                            <div key={i} style={{ color: textMuted, fontSize: '1.05rem', fontFamily: 'var(--font-sinhala)', display: 'flex', justifyContent: 'space-between', opacity: 0.5, fontWeight: 400 }}>
                              {item.name}
                            </div>
                          ) : (
                            <Link 
                              key={i}
                              to={item.path}
                              onClick={() => setActiveMegaMenu(null)}
                              style={{
                                color: item.isPlaceholder ? textMuted : textColor,
                                textDecoration: 'none',
                                fontSize: '1.05rem',
                                fontFamily: 'var(--font-sinhala)',
                                fontWeight: 500,
                                transition: 'color 0.2s, transform 0.2s',
                                display: 'inline-block'
                              }}
                              onMouseEnter={(e) => { 
                                e.currentTarget.style.color = 'var(--primary)'; 
                                e.currentTarget.style.transform = 'translateX(4px)';
                              }}
                              onMouseLeave={(e) => { 
                                e.currentTarget.style.color = item.isPlaceholder ? textMuted : textColor; 
                                e.currentTarget.style.transform = 'translateX(0)';
                              }}
                            >
                              {item.name}
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop overlay for mega menu */}
      <AnimatePresence>
        {isAnyMegaMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.2 }}
            className="mega-menu-backdrop" 
          />
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div style={{ height: '85px' }} />

      {/* Full-Screen Premium Mobile Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: '85px',
              left: 0,
              width: '100%',
              height: 'calc(100vh - 85px)',
              background: solidBg,
              zIndex: 999,
              padding: '40px 6%',
              overflowY: 'auto'
            }}
          >
            {allNavItems.map((item) => (
              <div key={item.name} style={{ borderBottom: `1px solid ${borderColor}`, padding: '24px 0' }}>
                {item.isMegaMenu ? (
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: textColor, fontFamily: 'var(--font-sinhala)', marginBottom: '24px' }}>
                      {item.name}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      {item.columns.map((col, cIdx) => (
                        <div key={cIdx}>
                          <div style={{ fontSize: '1rem', color: textMuted, fontWeight: 700, marginBottom: '16px' }}>{col.title}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {col.items.map(subItem => (
                              <Link 
                                key={subItem.name} 
                                to={subItem.path}
                                onClick={() => setIsMenuOpen(false)}
                                style={{ color: textColor, textDecoration: 'none', fontSize: '1.1rem', fontFamily: 'var(--font-sinhala)', fontWeight: 500 }}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link 
                    to={item.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    style={{ display: 'block', fontSize: '1.4rem', fontWeight: 700, color: textColor, textDecoration: 'none', fontFamily: 'var(--font-sinhala)' }}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
