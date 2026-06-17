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
        <div style={{ width: '100%', maxWidth: '1200px', padding: '0 24px 24px 24px', pointerEvents: 'auto' }}>
          <FooterBar />
        </div>
      </div>
    </>
  );
}
