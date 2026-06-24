import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import WorldsSlider from '../components/WorldsSlider';
import LatestSermons from '../components/LatestSermons';
import FeaturedArticle from '../components/FeaturedArticle';
import UpcomingEvents from '../components/UpcomingEvents';
import BodhiLeaves from '../components/BodhiLeaves';

export default function Home() {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Native Background Video - 100% Original Quality, No Zoom */}
      <video 
        autoPlay 
        loop 
        muted 
        defaultMuted
        playsInline 
        webkit-playsinline="true"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        className="ambient-background-video"
      >
        <source src="/herovideo.mp4" type="video/mp4" />
      </video>
      <BodhiLeaves />

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
