import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import WorldsSlider from '../components/WorldsSlider';
import LatestSermons from '../components/LatestSermons';
import FeaturedArticle from '../components/FeaturedArticle';
import UpcomingEvents from '../components/UpcomingEvents';

export default function Home() {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ background: 'var(--bg-main)', minHeight: '100vh' }}
    >
      {/* Main Content (Scrollable) */}
      <div style={{ position: 'relative', zIndex: 10, paddingBottom: '120px' }}>
        <HeroSection />
        <WorldsSlider />
        <LatestSermons />
        <FeaturedArticle />
        <UpcomingEvents />
      </div>
    </motion.div>
  );
}
