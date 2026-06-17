import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Moon, Sun, BookOpen, Settings, Check, Type, Play, Pause, Minus, Plus } from 'lucide-react';
import { booksData } from '../data/books';

export default function BookReader() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  
  // Reader Settings State
  const [fontSize, setFontSize] = useState(1.4);
  const [lineHeight, setLineHeight] = useState(2.2);
  const [theme, setTheme] = useState('dark'); // 'dark' | 'sepia' | 'light'
  
  // Auto-Scroll State
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(3); // 1 (slow) to 10 (fast)
  const autoScrollRef = useRef(null);
  const accumulatedScroll = useRef(0); // To handle fractional pixels for buttery smooth scrolling

  // UI State
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const settingsRef = useRef(null);

  // Interactive Options State
  const [selectedOptions, setSelectedOptions] = useState({});
  const [pirithSelections, setPirithSelections] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({ url: '', type: 'external' });
  const interactiveRefs = useRef({});

  const handleOptionToggle = (sectionId, optionId) => {
    setSelectedOptions(prev => {
      const currentSelected = prev[sectionId] || [];
      if (currentSelected.includes(optionId)) {
        return { ...prev, [sectionId]: currentSelected.filter(id => id !== optionId) };
      }
      return { ...prev, [sectionId]: [...currentSelected, optionId] };
    });
  };

  const renderContentItem = (item, itemIndex, prefix = '') => {
    const lines = item.text.split('\n');
    return (
      <motion.div 
        key={`${prefix}${itemIndex}`}
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{ 
          marginBottom: `${lineHeight * 1.2}em`, 
          textAlign: 'center',
          fontFamily: 'var(--font-serif)',
          letterSpacing: '0.03em',
          opacity: item.type === 'paragraph' ? 0.75 : 1
        }}
      >
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} style={{ 
            display: 'block', 
            marginBottom: lineIndex < lines.length - 1 ? '12px' : '0',
            fontWeight: item.type === 'paragraph' ? '300' : '400',
            fontSize: item.type === 'paragraph' ? '0.9em' : '1em'
          }}>
            {line}
          </span>
        ))}
      </motion.div>
    );
  };

  useEffect(() => {
    const foundBook = booksData.find(b => b.id === parseInt(bookId));
    if (foundBook) {
      setBook(foundBook);
      document.title = `${foundBook.title} - Kalyanamitta`;
    }
  }, [bookId]);

  // Handle click outside to close settings menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [settingsRef]);

  // Removed auto-hide top controls on scroll as requested by user.
  // Settings menu will still close if clicking outside.
  useEffect(() => {
    const handleScroll = () => {
      setLastScrollY(window.scrollY);
      setShowSettings(false); // Only close the settings popup on scroll
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pausedSections = useRef(new Set());

  // Pause auto-scroll when reaching an interactive section
  useEffect(() => {
    if (!isAutoScrolling) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !pausedSections.current.has(entry.target)) {
          setIsAutoScrolling(false);
          pausedSections.current.add(entry.target);
          observer.unobserve(entry.target); // Only pause once per section
        }
      });
    }, { threshold: 0.3 }); // Trigger when 30% visible

    Object.values(interactiveRefs.current).forEach(node => {
      if (node && !pausedSections.current.has(node)) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [isAutoScrolling]);

  // The Smooth Auto-Scroll Engine (Fixed for natural speed and buttery smoothness)
  useEffect(() => {
    let lastTime = 0;

    const scrollStep = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      
      // Speed 1 = very slow (15px/sec), Speed 10 = fast (150px/sec)
      // This formula is much more natural for reading.
      const pixelsPerSecond = scrollSpeed * 15; 
      const pixelsToScroll = (pixelsPerSecond * deltaTime) / 1000;
      
      // Browsers often ignore fractional scrollBy values (like 0.3px), causing terrible jitter.
      // We must accumulate fractions and only scroll when it equals 1 whole pixel or more!
      accumulatedScroll.current += pixelsToScroll;
      
      if (accumulatedScroll.current >= 1) {
        const scrollAmount = Math.floor(accumulatedScroll.current);
        window.scrollBy(0, scrollAmount);
        accumulatedScroll.current -= scrollAmount;
      }

      lastTime = timestamp;
      
      if (isAutoScrolling) {
        autoScrollRef.current = requestAnimationFrame(scrollStep);
      }
    };

    if (isAutoScrolling) {
      setShowControls(false); 
      setShowSettings(false);
      accumulatedScroll.current = 0; // Reset accumulator on start
      autoScrollRef.current = requestAnimationFrame(scrollStep);
    } else {
      if (autoScrollRef.current) cancelAnimationFrame(autoScrollRef.current);
    }

    return () => {
      if (autoScrollRef.current) cancelAnimationFrame(autoScrollRef.current);
    };
  }, [isAutoScrolling, scrollSpeed]);

  if (!book) return <div style={{ minHeight: '100vh', background: '#060709' }}></div>;

  const themeStyles = {
    dark: { bg: '#060709', text: '#f0ebd8', topbar: 'rgba(6,7,9,0.98)', menuBg: '#11141a', border: 'rgba(255,255,255,0.1)' },
    sepia: { bg: '#fbf0d9', text: '#433422', topbar: 'rgba(251,240,217,0.98)', menuBg: '#f4e5c3', border: 'rgba(0,0,0,0.1)' },
    light: { bg: '#ffffff', text: '#111111', topbar: 'rgba(255,255,255,0.98)', menuBg: '#f5f5f5', border: 'rgba(0,0,0,0.1)' }
  };

  const currentTheme = themeStyles[theme];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: '100vh',
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.4s ease, color 0.4s ease',
        paddingBottom: '120px' 
      }}
    >
      {/* Top Controls Bar - Permanently Visible with Title */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          padding: '16px 5vw',
          background: currentTheme.topbar,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${currentTheme.border}`,
          zIndex: 50,
          boxShadow: '0 4px 30px rgba(0,0,0,0.05)',
          transition: 'background 0.4s ease, border-color 0.4s ease'
        }}
      >
        {/* Left Side: Back Button */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <button 
            onClick={() => window.close()} 
            style={{ background: 'none', border: 'none', color: currentTheme.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}
          >
            <ArrowLeft size={20} />
            <span style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1rem' }} className="hide-on-mobile">ආපසු</span>
          </button>
        </div>

        {/* Center: Book Title & Author (Premium Style) */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '1.2rem', 
            fontFamily: 'var(--font-serif)', 
            color: theme === 'dark' ? 'var(--gold-primary)' : currentTheme.text,
            margin: 0,
            letterSpacing: '0.02em',
            fontWeight: '500'
          }}>
            {book.title}
          </h1>
          <span style={{ 
            fontSize: '0.75rem', 
            fontFamily: 'var(--font-sinhala)', 
            color: currentTheme.text, 
            opacity: 0.6,
            letterSpacing: '0.1em',
            marginTop: '2px',
            textTransform: 'uppercase'
          }}>
            {book.author}
          </span>
        </div>

        {/* Right Side: Settings Button */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', position: 'relative' }} ref={settingsRef}>
          <button 
            onClick={() => {
              if (!isAutoScrolling) setShowSettings(!showSettings);
            }}
            disabled={isAutoScrolling}
            style={{ 
              background: showSettings ? 'var(--gold-primary)' : 'transparent',
              color: showSettings ? '#000' : currentTheme.text,
              border: `1px solid ${showSettings ? 'var(--gold-primary)' : currentTheme.border}`,
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: isAutoScrolling ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'sans-serif',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              opacity: isAutoScrolling ? 0.3 : 1,
              pointerEvents: isAutoScrolling ? 'none' : 'auto'
            }}
          >
            <Type size={18} />
            <span>Aa</span>
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '50px',
                  right: 0,
                  width: '280px',
                  background: currentTheme.menuBg,
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                  border: `1px solid ${currentTheme.border}`,
                  zIndex: 100
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', opacity: 0.7 }}>Theme</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[
                      { id: 'light', icon: <Sun size={18} />, bg: '#ffffff', color: '#000' },
                      { id: 'sepia', icon: <BookOpen size={18} />, bg: '#fbf0d9', color: '#433422' },
                      { id: 'dark', icon: <Moon size={18} />, bg: '#060709', color: '#fff' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        style={{
                          flex: 1,
                          padding: '12px 0',
                          borderRadius: '8px',
                          border: theme === t.id ? '2px solid var(--gold-primary)' : `1px solid ${currentTheme.border}`,
                          background: t.bg,
                          color: t.color,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {t.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', opacity: 0.7 }}>Text Size</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(128,128,128,0.1)', borderRadius: '8px', padding: '4px' }}>
                    <button onClick={() => setFontSize(Math.max(0.9, fontSize - 0.1))} style={{ flex: 1, padding: '8px', background: 'transparent', border: 'none', color: currentTheme.text, cursor: 'pointer', fontSize: '1.2rem' }}>A-</button>
                    <div style={{ width: '1px', height: '20px', background: currentTheme.text, opacity: 0.2 }}></div>
                    <button onClick={() => setFontSize(Math.min(2.5, fontSize + 0.1))} style={{ flex: 1, padding: '8px', background: 'transparent', border: 'none', color: currentTheme.text, cursor: 'pointer', fontSize: '1.4rem' }}>A+</button>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', opacity: 0.7 }}>Spacing</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(128,128,128,0.1)', borderRadius: '8px', padding: '4px' }}>
                    {[1.6, 2.2, 2.8].map(lh => (
                      <button 
                        key={lh}
                        onClick={() => setLineHeight(lh)} 
                        style={{ 
                          flex: 1, 
                          padding: '10px 0', 
                          background: lineHeight === lh ? 'var(--gold-primary)' : 'transparent', 
                          color: lineHeight === lh ? '#000' : currentTheme.text,
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ width: '16px', height: '2px', background: 'currentColor', opacity: 0.8 }}></div>
                        <div style={{ width: '16px', height: '2px', background: 'currentColor', opacity: 0.8 }}></div>
                        <div style={{ width: '16px', height: '2px', background: 'currentColor', opacity: 0.8 }}></div>
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Auto-Scroll Controls */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '8px 24px',
          background: isAutoScrolling ? 'rgba(196,152,79,0.95)' : currentTheme.topbar,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '40px',
          boxShadow: isAutoScrolling ? '0 10px 30px rgba(196,152,79,0.3)' : '0 10px 30px rgba(0,0,0,0.5)',
          border: `1px solid ${isAutoScrolling ? 'rgba(255,255,255,0.2)' : currentTheme.border}`,
          transition: 'all 0.3s ease'
        }}
      >
        <button 
          onClick={() => setIsAutoScrolling(!isAutoScrolling)}
          style={{
            background: 'none',
            border: 'none',
            color: isAutoScrolling ? '#000' : currentTheme.text,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px'
          }}
        >
          {isAutoScrolling ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setScrollSpeed(Math.max(1, scrollSpeed - 1))}
            style={{ background: 'none', border: 'none', color: isAutoScrolling ? '#000' : currentTheme.text, cursor: 'pointer', opacity: 0.8 }}
          >
            <Minus size={18} />
          </button>
          <span style={{ 
            fontFamily: 'monospace', 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            color: isAutoScrolling ? '#000' : currentTheme.text,
            width: '20px',
            textAlign: 'center'
          }}>
            {scrollSpeed}
          </span>
          <button 
            onClick={() => setScrollSpeed(Math.min(10, scrollSpeed + 1))}
            style={{ background: 'none', border: 'none', color: isAutoScrolling ? '#000' : currentTheme.text, cursor: 'pointer', opacity: 0.8 }}
          >
            <Plus size={18} />
          </button>
        </div>
      </motion.div>

      {/* Clean, Distraction-Free Reading Area */}
      <div style={{ 
        flex: 1, 
        padding: '140px 5vw 40px 5vw', // Increased top padding from 120px to 140px to prevent overlap with the fixed header
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        <article style={{
          maxWidth: '740px', 
          width: '100%',
          fontFamily: 'var(--font-serif)',
          fontSize: `${fontSize}rem`,
          lineHeight: lineHeight,
          letterSpacing: '0.02em',
          color: currentTheme.text,
          transition: 'font-size 0.2s ease, line-height 0.2s ease'
        }}>
          
          {/* Main Content - Clean Chanting Format */}
          <div style={{ opacity: 0.9 }}>
            {book.content && book.content.length > 0 ? (
              book.content.map((section, secIndex) => {
                if (section.type === 'pirith-router') {
                  const currentSelection = pirithSelections[section.id];
                  
                  return (
                    <div key={section.id || secIndex} ref={el => interactiveRefs.current[section.id] = el} style={{ marginTop: '80px', marginBottom: '80px' }}>
                      {/* Section Title */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        style={{ marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                      >
                        {secIndex !== 0 && (
                          <div style={{ color: 'var(--gold-primary)', opacity: 0.5, marginBottom: '8px' }}>✧ ✧ ✧</div>
                        )}
                        <h2 style={{ fontSize: `${fontSize * 1.5}rem`, color: theme === 'dark' ? 'var(--gold-primary)' : currentTheme.text, margin: 0, fontWeight: '600' }}>
                          {section.title}
                        </h2>
                      </motion.div>

                      {/* Intro Text */}
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ 
                          textAlign: 'center', 
                          fontSize: `${fontSize * 1.1}rem`, 
                          marginBottom: '40px',
                          color: currentTheme.text,
                          opacity: 0.9,
                          fontFamily: 'var(--font-sinhala)',
                          lineHeight: '1.6'
                        }}
                      >
                        {section.introText}
                      </motion.p>

                      {/* Options Grid */}
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px', 
                        margin: '40px 0', 
                        padding: '0 10px' 
                      }}>
                        {section.options && section.options.map((opt) => {
                          const isSelected = currentSelection === opt.id;
                          return (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              key={opt.id}
                              onClick={() => setPirithSelections(prev => ({ ...prev, [section.id]: opt.id }))}
                              style={{
                                position: 'relative',
                                padding: '20px 30px',
                                borderRadius: '16px',
                                background: isSelected 
                                  ? (theme === 'dark' ? 'rgba(196,152,79,0.15)' : 'rgba(196,152,79,0.1)') 
                                  : (theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                                border: `1px solid ${isSelected ? 'var(--gold-primary)' : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                                color: isSelected ? 'var(--gold-primary)' : currentTheme.text,
                                fontFamily: 'var(--font-sinhala)',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: isSelected ? '0 8px 32px rgba(196,152,79,0.15)' : 'none',
                                fontWeight: isSelected ? '600' : '400',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                overflow: 'hidden',
                                width: '100%',
                                maxWidth: '500px',
                                textAlign: 'center'
                              }}
                            >
                              <span style={{ zIndex: 2, width: '100%' }}>{opt.title}</span>
                              
                              {/* Glowing background for selected state */}
                              {isSelected && (
                                <div style={{
                                  position: 'absolute',
                                  top: 0, left: 0, right: 0, bottom: 0,
                                  background: 'linear-gradient(45deg, transparent, rgba(196,152,79,0.1), transparent)',
                                  zIndex: 1
                                }} />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Common Component (Devatha Aradhanawa) */}
                      <AnimatePresence>
                        {currentSelection && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            style={{ overflow: 'hidden', marginTop: '40px', padding: '40px 20px', background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderRadius: '20px', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
                          >
                            <h3 style={{ textAlign: 'center', color: 'var(--gold-primary)', marginBottom: '40px', fontSize: `${fontSize * 1.3}rem`, fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                              <span style={{ opacity: 0.5 }}>✧</span>
                              {section.options.find(o => o.id === currentSelection)?.component?.title}
                              <span style={{ opacity: 0.5 }}>✧</span>
                            </h3>
                            
                            {section.options.find(o => o.id === currentSelection)?.component?.items.map((item, i) => renderContentItem(item, i, 'devatha-'))}
                            
                            {/* Final Redirect Button */}
                            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  const selectedOpt = section.options.find(o => o.id === currentSelection);
                                  if (selectedOpt && selectedOpt.externalLink) {
                                    if (selectedOpt.externalLink.startsWith('http')) {
                                      setConfirmData({ url: selectedOpt.externalLink, type: 'external' });
                                      setShowConfirmModal(true);
                                    } else {
                                      navigate(selectedOpt.externalLink);
                                    }
                                  }
                                }}
                                style={{
                                  padding: '16px 40px',
                                  background: 'linear-gradient(135deg, var(--gold-primary), #D4AF37)',
                                  color: '#000',
                                  border: 'none',
                                  borderRadius: '30px',
                                  fontFamily: 'var(--font-sinhala)',
                                  fontSize: '1.2rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  boxShadow: '0 10px 25px rgba(196,152,79,0.4)'
                                }}
                              >
                                පිරිත් දේශනාවට යන්න (Continue)
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Skip/Continue Action */}
                      <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <button
                          onClick={() => setIsAutoScrolling(true)}
                          style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            color: currentTheme.text,
                            border: `1px solid ${currentTheme.border}`,
                            borderRadius: '20px',
                            fontFamily: 'var(--font-sinhala)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            opacity: 0.6,
                            transition: 'opacity 0.3s'
                          }}
                          onMouseEnter={(e) => e.target.style.opacity = 1}
                          onMouseLeave={(e) => e.target.style.opacity = 0.6}
                        >
                          නැත, ඉදිරියට යන්න (Skip)
                        </button>
                      </div>
                    </div>
                  );
                }

                if (section.type === 'interactive-options') {
                  const currentSelected = selectedOptions[section.id] || [];
                  return (
                    <div key={section.id || secIndex} ref={el => interactiveRefs.current[section.id] = el} style={{ marginTop: '80px', marginBottom: '80px' }}>
                      {/* Section Title */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        style={{ marginTop: secIndex === 0 ? '20px' : '80px', marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
                      >
                        {secIndex !== 0 && (
                          <div style={{ color: 'var(--gold-primary)', opacity: 0.5, marginBottom: '8px' }}>✧ ✧ ✧</div>
                        )}
                        <h2 style={{ fontSize: `${fontSize * 1.5}rem`, color: theme === 'dark' ? 'var(--gold-primary)' : currentTheme.text, margin: 0, fontWeight: '600' }}>
                          {section.title}
                        </h2>
                      </motion.div>

                      {/* Intro Items */}
                      {section.introItems && section.introItems.map((item, i) => renderContentItem(item, i))}

                      {/* Interactive Options Grid - Premium Glassmorphic Cards */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                        gap: '16px', 
                        margin: '60px 0', 
                        padding: '0 10px' 
                      }}>
                        {section.options && section.options.map((opt) => {
                          const isSelected = currentSelected.includes(opt.id);
                          return (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              key={opt.id}
                              onClick={() => handleOptionToggle(section.id, opt.id)}
                              style={{
                                position: 'relative',
                                padding: '16px 20px',
                                borderRadius: '16px',
                                background: isSelected 
                                  ? (theme === 'dark' ? 'rgba(196,152,79,0.15)' : 'rgba(196,152,79,0.1)') 
                                  : (theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                                border: `1px solid ${isSelected ? 'var(--gold-primary)' : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                                color: isSelected ? 'var(--gold-primary)' : currentTheme.text,
                                fontFamily: 'var(--font-sinhala)',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: isSelected ? '0 8px 32px rgba(196,152,79,0.15)' : 'none',
                                fontWeight: isSelected ? '500' : '400',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                overflow: 'hidden',
                                textAlign: 'left'
                              }}
                            >
                              <span style={{ zIndex: 2 }}>{opt.title}</span>
                              {isSelected && (
                                <motion.div 
                                  initial={{ scale: 0, rotate: -45 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  style={{ zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <Check size={20} color="var(--gold-primary)" />
                                </motion.div>
                              )}
                              
                              {/* Glowing background for selected state */}
                              {isSelected && (
                                <div style={{
                                  position: 'absolute',
                                  top: 0, left: 0, right: 0, bottom: 0,
                                  background: 'linear-gradient(45deg, transparent, rgba(196,152,79,0.1), transparent)',
                                  zIndex: 1
                                }} />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Render Selected Content */}
                      <AnimatePresence>
                        {currentSelected.map(optId => {
                          const optData = section.options.find(o => o.id === optId);
                          if (!optData) return null;
                          return (
                            <motion.div
                              key={optId}
                              initial={{ opacity: 0, height: 0, y: -20 }}
                              animate={{ opacity: 1, height: 'auto', y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -20 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              style={{ overflow: 'hidden', marginTop: '40px', padding: '30px 20px', background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderRadius: '20px', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
                            >
                              <h4 style={{ textAlign: 'center', color: 'var(--gold-primary)', marginBottom: '30px', fontSize: `${fontSize * 1.2}rem`, fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                <span style={{ opacity: 0.5 }}>✧</span>
                                {optData.title}
                                <span style={{ opacity: 0.5 }}>✧</span>
                              </h4>
                              {optData.items.map((item, i) => renderContentItem(item, i, `${optId}-`))}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>

                      {/* Skip/Continue Action */}
                      <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <button
                          onClick={() => setIsAutoScrolling(true)}
                          style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            color: currentTheme.text,
                            border: `1px solid ${currentTheme.border}`,
                            borderRadius: '20px',
                            fontFamily: 'var(--font-sinhala)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            opacity: 0.7,
                            transition: 'opacity 0.3s'
                          }}
                          onMouseEnter={(e) => e.target.style.opacity = 1}
                          onMouseLeave={(e) => e.target.style.opacity = 0.7}
                        >
                          ඉදිරියට යන්න (Continue / Skip)
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={section.id || secIndex}>
                  {/* Section Title */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    style={{ 
                      marginTop: secIndex === 0 ? '20px' : '80px',
                      marginBottom: '40px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    {/* Clean Golden Separator */}
                    {secIndex !== 0 && (
                      <div style={{ color: 'var(--gold-primary)', opacity: 0.5, marginBottom: '8px' }}>✧ ✧ ✧</div>
                    )}
                    <h2 style={{ 
                      fontSize: `${fontSize * 1.5}rem`,
                      color: theme === 'dark' ? 'var(--gold-primary)' : currentTheme.text,
                      margin: 0,
                      fontWeight: '600'
                    }}>
                      {section.title}
                    </h2>
                  </motion.div>

                  {/* Section Items */}
                  {section.items && section.items.map((item, itemIndex) => {
                    // Check if it's a subsection
                    if (item.type === 'subsection') {
                      return (
                        <div key={item.id || itemIndex} style={{ marginTop: '60px', marginBottom: '30px' }}>
                          <motion.h3
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            style={{ 
                              fontSize: `${fontSize * 1.2}rem`, 
                              textAlign: 'center', 
                              color: theme === 'dark' ? 'rgba(196,152,79,0.8)' : currentTheme.text,
                              marginBottom: '30px',
                              fontWeight: '500'
                            }}
                          >
                            {item.title}
                          </motion.h3>
                          
                          {/* Subsection Items */}
                          {item.items && item.items.map((subItem, subIndex) => {
                            const subLines = subItem.text.split('\n');
                            return (
                              <motion.div 
                                key={subIndex}
                                initial={{ opacity: 0, filter: 'blur(4px)' }}
                                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                style={{ 
                                  marginBottom: `${lineHeight * 1.2}em`, 
                                  textAlign: 'center',
                                  fontFamily: 'var(--font-serif)',
                                  letterSpacing: '0.03em',
                                  opacity: subItem.type === 'paragraph' ? 0.75 : 1
                                }}
                              >
                                {subLines.map((line, lineIndex) => (
                                  <span key={lineIndex} style={{ 
                                    display: 'block', 
                                    marginBottom: lineIndex < subLines.length - 1 ? '12px' : '0',
                                    fontWeight: subItem.type === 'paragraph' ? '300' : '400',
                                    fontSize: subItem.type === 'paragraph' ? '0.9em' : '1em'
                                  }}>
                                    {line}
                                  </span>
                                ))}
                              </motion.div>
                            );
                          })}
                        </div>
                      );
                    }

                    // Render regular section item
                    const lines = item.text.split('\n');
                    return (
                      <motion.div 
                        key={itemIndex}
                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ 
                          marginBottom: `${lineHeight * 1.2}em`, 
                          textAlign: 'center',
                          fontFamily: 'var(--font-serif)',
                          letterSpacing: '0.03em',
                          opacity: item.type === 'paragraph' ? 0.75 : 1
                        }}
                      >
                        {lines.map((line, lineIndex) => (
                          <span key={lineIndex} style={{ 
                            display: 'block', 
                            marginBottom: lineIndex < lines.length - 1 ? '12px' : '0',
                            fontWeight: item.type === 'paragraph' ? '300' : '400',
                            fontSize: item.type === 'paragraph' ? '0.9em' : '1em'
                          }}>
                            {line}
                          </span>
                        ))}
                      </motion.div>
                    );
                  })}
                </div>
              );
            })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <BookOpen size={48} color="var(--gold-primary)" style={{ marginBottom: '24px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.5rem', color: currentTheme.text, marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>ඉදිරියේදී බලාපොරොත්තු වන්න</h3>
                <p style={{ fontSize: '1.1rem', color: currentTheme.text, opacity: 0.7, maxWidth: '500px', lineHeight: '1.6' }}>
                  {book.description || 'මෙම ග්‍රන්ථයේ අන්තර්ගතය මේ දිනවල සකස් වෙමින් පවතී. ඉතා ඉක්මනින් මෙහි යාවත්කාලීන කරනු ඇත.'}
                </p>
              </motion.div>
            )}
          </div>

          {/* End Mark */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', opacity: 0.2 }}>
            <div style={{ width: '40px', height: '1px', background: currentTheme.text }}></div>
          </div>
          
          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirmModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.8)',
                  backdropFilter: 'blur(10px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  style={{
                    background: 'rgba(20,20,20,0.95)',
                    border: '1px solid rgba(196,152,79,0.3)',
                    borderRadius: '24px',
                    padding: '40px',
                    maxWidth: '450px',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                  }}
                >
                  <div style={{ 
                    width: '60px', height: '60px', 
                    borderRadius: '50%', 
                    background: 'rgba(196,152,79,0.1)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: 'var(--gold-primary)'
                  }}>
                    <BookOpen size={28} />
                  </div>
                  
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--gold-primary)', marginBottom: '16px', fontFamily: 'var(--font-sinhala)' }}>
                    {confirmData.type === 'external' ? 'කල්‍යාණමිත්ත Google Drive' : 'බාහිර වෙබ් අඩවියක්'}
                  </h3>
                  
                  <p style={{ color: '#fff', opacity: 0.8, fontSize: '1.1rem', marginBottom: '32px', fontFamily: 'var(--font-sinhala)', lineHeight: '1.6' }}>
                    {confirmData.type === 'external' 
                      ? 'ඔබව Kalyanamitta Pirith Google Folder එක වෙත රැගෙන යාමට සූදානම්. ඔබට එය විවෘත කිරීමට අවශ්‍යද?' 
                      : 'ඔබ මෙම පිටුවෙන් ඉවත් වී බාහිර වෙබ් අඩවියකට ගමන් කිරීමට සූදානම්. ඔබට ඉදිරියට යාමට අවශ්‍යද?'}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        fontFamily: 'var(--font-sinhala)',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      අවලංගු කරන්න (Cancel)
                    </button>
                    <button
                      onClick={() => {
                        window.open(confirmData.url, '_blank');
                        setShowConfirmModal(false);
                      }}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--gold-primary), #D4AF37)',
                        border: 'none',
                        color: '#000',
                        fontFamily: 'var(--font-sinhala)',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      විවෘත කරන්න (Confirm)
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </article>
      </div>
    </motion.div>
  );
}
