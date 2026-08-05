import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import LatestSermons from '../components/LatestSermons';
import FeaturedArticle from '../components/FeaturedArticle';
import UpcomingEvents from '../components/UpcomingEvents';

export default function Home() {
  return (
    <div
      className="fade-in"
      style={{ background: 'var(--bg-main)', minHeight: '100vh' }}
    >
      {/* Main Content (Scrollable) */}
      <div style={{ position: 'relative', zIndex: 10, paddingBottom: '120px' }}>
        <HeroSection />
        <LatestSermons />
        <FeaturedArticle />
        <UpcomingEvents />
      </div>
    </div>
  );
}
