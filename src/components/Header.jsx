import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Home, X, Menu, ChevronDown, Sun, Moon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';

const NavDropdown = ({ item, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = item.subItems.some(sub => location.pathname === sub.path);

  return (
    <div 
      style={{ position: 'relative' }} 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.95rem',
          fontWeight: isActive ? '700' : '500',
          color: isActive || isOpen ? 'var(--primary)' : 'var(--text-main)', 
          cursor: 'pointer',
          transition: 'color 0.2s ease',
          fontFamily: 'var(--font-sinhala)',
          padding: '10px 0'
        }}
      >
        <span>{item.name}</span>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', opacity: 0.6 }} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '12px',
              minWidth: '220px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 100
            }}
          >
            {item.subItems.map(sub => {
              const isSubActive = location.pathname === sub.path;
              return (
                <Link
                  key={sub.name}
                  to={sub.path}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: isSubActive ? 'var(--primary)' : 'var(--text-main)',
                    background: isSubActive ? 'var(--hover-overlay)' : 'transparent',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sinhala)',
                    fontSize: '0.95rem',
                    fontWeight: isSubActive ? '700' : '500',
                    transition: 'all 0.2s ease',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-overlay)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = isSubActive ? 'var(--hover-overlay)' : 'transparent'; e.currentTarget.style.color = isSubActive ? 'var(--primary)' : 'var(--text-main)'; }}
                >
                  {sub.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Elite Grouped Nav Structure
  const allNavItems = [
    { name: 'මුල් පිටුව', path: '/' },
    { 
      name: 'දහම් මග', 
      isDropdown: true,
      subItems: [
        { name: 'ධර්ම මාර්ගය', path: '/path' },
        { name: 'ජීවිතයට ධර්මය', path: '/life' }, 
        { name: 'දේශනා', path: '/sermons' }, 
        { name: 'භාවනා', path: '/meditation' }
      ]
    },
    { 
      name: 'සම්පත්', 
      isDropdown: true,
      subItems: [
        { name: 'කල්‍යාණමිත්ත පුස්තකාලය', path: '/words' },
        { name: 'ධර්ම දාන', path: '/dharmadhana' }
      ]
    },
    { name: 'කල්‍යාණ මිත්‍රත්වය', path: '/community' },
    { name: 'ඔබ කවුද?', path: '/lifecycle' }
  ];

  return (
    <>
      <header className={`mobile-header-padding ${isScrolled ? 'scrolled' : ''}`} style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        background: isScrolled ? 'var(--glass-bg)' : 'var(--bg-main)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: '1px solid var(--glass-border)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.03)' : 'none'
      }}>
        {/* Logo Area */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
          <img 
            src="/kalyanamitta-logo.png" 
            alt="Kalyanamitta Logo" 
            style={{ height: isScrolled ? '45px' : '60px', width: 'auto', objectFit: 'contain', transition: 'height 0.3s ease' }} 
          />
          <div className="hide-on-mobile">
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.02em', fontFamily: 'var(--font-serif)' }}>Kalyanamitta</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>කල්‍යාණමිත්ත</div>
          </div>
        </Link>

        {/* Main Nav (Hidden on Mobile) */}
        <nav className="hide-on-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          {allNavItems.map(item => {
            if (item.isDropdown) {
              return <NavDropdown key={item.name} item={item} location={location} />;
            }
            
            const isActive = location.pathname === item.path;
            return (
              <Link 
                to={item.path} 
                key={item.name} 
                style={{ 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--primary)' : 'var(--text-main)', 
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sinhala)'
                }} 
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-main)'; }}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-underline"
                    style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'var(--primary)',
                      borderRadius: '2px'
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Icons & Mobile Toggle */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          
          <button 
            onClick={toggleTheme}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px',
              borderRadius: '50%', transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--glass-border)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            title="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {session ? (
            <Link 
              to="/dashboard"
              style={{ 
                background: 'var(--primary)', 
                color: '#fff', 
                padding: '10px 24px', 
                borderRadius: '6px', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                textDecoration: 'none',
                fontFamily: 'var(--font-sinhala)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; }}
            >
              ගිණුම (Dashboard)
            </Link>
          ) : (
            <Link 
              to="/login"
              style={{ 
                background: 'var(--primary)', 
                color: '#fff', 
                padding: '10px 24px', 
                borderRadius: '6px', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                textDecoration: 'none',
                fontFamily: 'var(--font-sinhala)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; }}
            >
              පිවිසෙන්න
            </Link>
          )}
          
          <button 
            className="show-on-mobile"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              display: 'none' // Controlled by CSS .show-on-mobile
            }}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu-padding"
            style={{
              position: 'fixed',
              top: '80px',
              left: 0,
              width: '100%',
              height: 'calc(100vh - 80px)',
              background: 'var(--bg-main)',
              zIndex: 49,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {allNavItems.map(item => {
                if (item.isDropdown) {
                  return (
                    <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', color: 'var(--primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                        {item.name}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
                        {item.subItems.map(sub => {
                          const isActive = location.pathname === sub.path;
                          return (
                            <Link
                              key={sub.name}
                              to={sub.path}
                              onClick={() => setIsMenuOpen(false)}
                              style={{
                                fontSize: '1.2rem',
                                fontWeight: isActive ? '700' : '500',
                                color: isActive ? 'var(--primary)' : 'var(--text-main)', 
                                textDecoration: 'none',
                                fontFamily: 'var(--font-sinhala)',
                                padding: '8px 0',
                              }}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    to={item.path} 
                    key={item.name} 
                    onClick={() => setIsMenuOpen(false)}
                    style={{ 
                      fontSize: '1.2rem',
                      fontWeight: isActive ? '700' : '500',
                      color: isActive ? 'var(--primary)' : 'var(--text-main)', 
                      textDecoration: 'none',
                      fontFamily: 'var(--font-sinhala)',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--glass-border)'
                    }} 
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .mobile-header-padding {
          padding: 24px 48px;
        }
        .mobile-header-padding.scrolled {
          padding: 12px 48px;
        }
        .mobile-menu-padding {
          padding: 24px 48px;
        }
        
        @media (max-width: 900px) {
          .show-on-mobile {
            display: block !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
          .mobile-header-padding {
            padding: 20px 20px;
          }
          .mobile-header-padding.scrolled {
            padding: 12px 20px;
          }
          .mobile-menu-padding {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}
