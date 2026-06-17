import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Music, Heart, Compass, Sun, Users, Library } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FooterBar() {
  const location = useLocation();

  const navItems = [
    { name: 'මුල් පිටුව', path: '/', icon: <Home size={20} strokeWidth={1.5} /> },
    { name: 'බුදු වදන්', path: '/words', icon: <BookOpen size={20} strokeWidth={1.5} /> },
    { name: 'දේශනා', path: '/sermons', icon: <Music size={20} strokeWidth={1.5} /> },
    { name: 'භාවනා', path: '/meditation', icon: <Heart size={20} strokeWidth={1.5} /> },
    { name: 'ධර්ම මාර්ගය', path: '/path', icon: <Compass size={20} strokeWidth={1.5} /> },
    { name: 'ජීවිතයට ධර්මය', path: '/life', icon: <Sun size={20} strokeWidth={1.5} /> },
    { name: 'ධර්ම දාන', path: '/dharmadhana', icon: <Library size={20} strokeWidth={1.5} /> },
    { name: 'මිත්‍රත්වය', path: '/community', icon: <Users size={20} strokeWidth={1.5} /> },
  ];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="hide-scrollbar"
      style={{
        width: '100%',
        background: 'linear-gradient(to top, rgba(16,18,22,0.95) 0%, rgba(20, 22, 26, 0.8) 100%)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '32px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none',
              color: isActive ? 'var(--gold-primary)' : 'var(--text-muted)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              minWidth: '60px',
              padding: '8px 0',
              marginRight: index === navItems.length - 1 ? '24px' : '0'
            }}
          >
            {/* Active Indicator Glow */}
            {isActive && (
              <motion.div
                layoutId="footer-active-bg"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                  position: 'absolute',
                  top: '0',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(196,152,79,0.15)',
                  borderRadius: '50%',
                  zIndex: -1,
                  boxShadow: '0 0 20px rgba(196,152,79,0.2)'
                }}
              />
            )}
            
            <motion.div 
              animate={{ y: isActive ? -4 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ 
                transform: isActive ? 'scale(1.15)' : 'scale(1)', 
                transition: 'transform 0.4s ease',
                filter: isActive ? 'drop-shadow(0 0 8px rgba(196,152,79,0.5))' : 'none'
              }}
            >
              {item.icon}
            </motion.div>
            
            <span style={{ 
              fontSize: '0.7rem', 
              fontFamily: 'var(--font-sinhala)',
              opacity: isActive ? 1 : 0.6,
              fontWeight: isActive ? '500' : '400',
              whiteSpace: 'nowrap',
              letterSpacing: '0.02em',
              transition: 'all 0.3s ease'
            }}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </motion.div>
  );
}
