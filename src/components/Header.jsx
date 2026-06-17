import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Home, X, Menu } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showComingSoonToast = () => {
    setToastMessage('මෙම පහසුකම තවමත් ගොඩනැගෙමින් පවතී');
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

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
        padding: isScrolled ? '16px 48px' : '24px 48px',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        background: isScrolled ? 'rgba(6, 7, 9, 0.8)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}>
        {/* Logo Area */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '24px', textDecoration: 'none' }}>
          <motion.img 
            src="/kalyanamitta-logo.png" 
            alt="Kalyanamitta Logo" 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ height: '70px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(196,152,79,0.5))' }} 
          />
          <div className="hide-on-mobile">
            <div style={{ fontSize: '1.5rem', fontWeight: '400', color: 'var(--gold-primary)', letterSpacing: '0.05em', fontFamily: 'var(--font-serif)' }}>Kalyanamitta</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '0.1em' }}>කල්‍යාණමිත්ත</div>
          </div>
        </Link>

        {/* Main Nav Pill (Hidden on Mobile) */}
        <nav className="hide-on-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(var(--glass-blur))',
          border: '1px solid var(--glass-border)',
          borderRadius: '40px',
          padding: '8px 8px',
          gap: '8px'
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
                  gap: '8px',
                  padding: '8px 16px',
                  fontSize: '0.9rem', 
                  color: isActive ? 'var(--gold-primary)' : 'var(--text-main)', 
                  cursor: 'pointer',
                  opacity: isActive ? 1 : 0.7,
                  transition: 'opacity 0.3s, color 0.3s',
                  textDecoration: 'none',
                  borderRadius: '20px'
                }} 
                onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = 'var(--gold-primary)'; }}
                onMouseLeave={(e) => { 
                  if (!isActive) { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.color = 'var(--text-main)'; }
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-active"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(196, 152, 79, 0.1)',
                      borderRadius: '20px',
                      zIndex: -1
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {item.icon && <span>{item.icon}</span>}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

          {/* Action Icons (Desktop) & Hamburger (Mobile) */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div onClick={showComingSoonToast} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-bg)', backdropFilter: 'blur(var(--glass-blur))', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
            <Search size={18} strokeWidth={1.5} />
          </div>
          <div onClick={showComingSoonToast} className="hide-on-mobile" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-bg)', backdropFilter: 'blur(var(--glass-blur))', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
            <Bell size={18} strokeWidth={1.5} />
          </div>
          <div onClick={showComingSoonToast} className="hide-on-mobile" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-bg)', backdropFilter: 'blur(var(--glass-blur))', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
            <User size={18} strokeWidth={1.5} />
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -50, scale: 0.9, x: '-50%' }}
            style={{
              position: 'fixed',
              top: '90px',
              left: '50%',
              zIndex: 1000,
              background: 'rgba(20, 20, 20, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--gold-primary)',
              padding: '12px 24px',
              borderRadius: '30px',
              color: 'var(--gold-primary)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.95rem'
            }}
          >
            <Bell size={16} /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              zIndex: 100, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20vh'
            }}
          >
            <div style={{ position: 'absolute', top: '40px', right: '48px', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setIsSearchOpen(false)}>
              <X size={32} />
            </div>
            <h2 style={{ color: 'var(--gold-primary)', fontSize: '2rem', marginBottom: '40px', fontFamily: 'var(--font-serif)' }}>සොයන්න</h2>
            <div style={{ position: 'relative', width: '600px', maxWidth: '90%' }}>
              <input 
                autoFocus type="text" placeholder="දේශනා, ලිපි, කතා..." 
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid var(--gold-primary)', color: 'white', fontSize: '2rem', padding: '16px 0', outline: 'none', fontFamily: 'var(--font-sinhala)' }}
              />
              <Search size={32} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
