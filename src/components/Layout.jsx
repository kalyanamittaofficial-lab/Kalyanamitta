import React, { useLayoutEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-main)',
      color: 'var(--text-main)',
      position: 'relative',
      fontFamily: 'var(--font-sinhala)'
    }}>
      <Header />
      
      <main style={{
        flex: 1,
        width: '100%',
        paddingTop: '100px', /* Prevent overlap with fixed Header */
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10
      }}>
        <div key={location.pathname} style={{ display: 'contents' }}>
           {outlet}
        </div>
      </main>
    </div>
  );
}
