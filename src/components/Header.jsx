import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Home, X, Menu } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Mapping nav items to their routes for future-proofing
  const allNavItems = [
    { name: 'මුල් පිටුව', path: '/', icon: <Home size={16} /> },
    { name: 'බුදු වදන්', path: '/words' }, 
    { name: 'දේශනා', path: '/sermons' }, 
    { name: 'භාවනා', path: '/meditation' }, 
    { name: 'ධර්ම මාර්ගය', path: '/path' }, 
    { name: 'ජීවිතයට ධර්මය', path: '/life' }, 
    { name: 'ධර්ම දාන', path: '/dharmadhana' },
    { name: 'කල්‍යාණ මිත්‍රත්වය', path: '/community' }
  ];

  return (
    <>
      <header className="mobile-padding" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isScrolled ? '12px 48px' : '24px 48px',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--bg-main)',
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

        {/* Main Nav Pill (Hidden on Mobile) */}
        <nav className="hide-on-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          {allNavItems.map(item => {
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
                      bottom: '-4px',
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
          <Link 
            to="/login"
            style={{ 
              background: 'var(--primary)', 
              color: '#fff', 
              padding: '8px 24px', 
              borderRadius: '4px', 
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
            ගිණුමට පිවිසෙන්න
          </Link>
          
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
              padding: '24px 48px',
              overflowY: 'auto'
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {allNavItems.map(item => {
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
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(0,0,0,0.05)'
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
        @media (max-width: 768px) {
          .show-on-mobile {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
