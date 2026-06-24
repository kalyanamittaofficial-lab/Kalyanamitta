import React, { useLayoutEffect } from 'react';
import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import Header from './Header';
import FooterBar from './FooterBar';
import { AnimatePresence } from 'framer-motion';

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  // Fix the layout shift / jump issue: Always scroll to top synchronously before paint
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      {/* Portal Banner */}
      <div style={{ backgroundColor: '#800000', color: '#fdfdfc', textAlign: 'center', padding: '12px', fontSize: '14px', fontFamily: '"Noto Sans Sinhala", sans-serif', position: 'relative', zIndex: 100 }}>
        අලුත්ම Kalyanamitta සාමාජික පුවරුව දැන් විවෘතයි! {' '}
        <a href="http://localhost:3000/login" target="_blank" rel="noopener noreferrer" style={{ color: '#c4984f', fontWeight: 'bold', textDecoration: 'underline', marginLeft: '8px' }}>
          මෙහි පිවිසෙන්න
        </a>
      </div>

      {/* Persistent Navigation */}
      <Header />
      
      {/* Dynamic Page Content */}
      <main className="relative-layer mobile-footer-padding">
        <AnimatePresence mode="wait">
          {/* Providing the key to AnimatePresence allows it to track route changes and trigger exit animations properly */}
          <div key={location.pathname} style={{ display: 'contents' }}>
             {outlet}
          </div>
        </AnimatePresence>
      </main>

      {/* Persistent Footer - ONLY visible on Mobile */}
      <div className="mobile-only" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 50, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ width: '100%', maxWidth: '1200px', padding: '0 12px 20px 12px', pointerEvents: 'auto' }}>
          <FooterBar />
        </div>
      </div>
    </>
  );
}
