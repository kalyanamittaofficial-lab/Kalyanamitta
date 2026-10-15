import React from 'react';
import LifeCycleHero from '../components/LifeCycleHero';

export default function LifeCyclePage() {
  return (
    <div style={{ background: 'var(--bg-main)', color: 'var(--text-main)', minHeight: '100vh', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <LifeCycleHero />
    </div>
  );
}
