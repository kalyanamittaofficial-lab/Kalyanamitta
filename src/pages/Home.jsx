import React from 'react';
import { motion } from 'framer-motion';
import LifeCycleHero from '../components/LifeCycleHero';
import LatestSermons from '../components/LatestSermons';
import FeaturedArticle from '../components/FeaturedArticle';
import UpcomingEvents from '../components/UpcomingEvents';

export default function Home() {
  return (
    <div
      className="fade-in"
      style={{ background: 'var(--bg-main)', minHeight: '100vh' }}
    >
      {/* 3D Life Cycle Hero Section */}
      <LifeCycleHero />
      
      {/* Main Content (Scrollable) */}
      <div style={{ position: 'relative', zIndex: 10, paddingBottom: '120px' }}>
        <LatestSermons />
        <FeaturedArticle />
        <UpcomingEvents />
      </div>
    </div>
  );
}
