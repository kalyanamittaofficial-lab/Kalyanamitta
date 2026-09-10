import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, FileText, Download, Clock, Calendar } from 'lucide-react';
import Header from '../components/Header';

export default function LMS() {
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', name: 'සියලුම දේශනා' },
    { id: 'satipatthana', name: 'සතිපට්ඨාන භාවනාව' },
    { id: 'sutta', name: 'සූත්‍ර දේශනා' },
    { id: 'special', name: 'විශේෂ සාකච්ඡා' },
  ];

  const content = [
    {
      id: 1,
      category: 'satipatthana',
      title: 'කායානුපස්සනාව - පළමු කොටස',
      date: '2023-09-01',
      duration: '1h 45m',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2940&auto=format&fit=crop',
      hasNotes: true
    },
    {
      id: 2,
      category: 'satipatthana',
      title: 'කායානුපස්සනාව - දෙවන කොටස',
      date: '2023-09-08',
      duration: '2h 10m',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=2940&auto=format&fit=crop',
      hasNotes: true
    },
    {
      id: 3,
      category: 'sutta',
      title: 'ධම්මචක්කප්පවත්තන සූත්‍රය',
      date: '2023-08-15',
      duration: '1h 30m',
      type: 'audio',
      thumbnail: 'https://images.unsplash.com/photo-1577402636906-8d5f308ce61d?q=80&w=2940&auto=format&fit=crop',
      hasNotes: false
    },
    {
      id: 4,
      category: 'special',
      title: 'කල්‍යාණ මිත්‍රත්වය යනු කුමක්ද?',
      date: '2023-07-20',
      duration: '55m',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1528310263305-e110bb5444da?q=80&w=2940&auto=format&fit=crop',
      hasNotes: true
    }
  ];

  const filteredContent = activeTab === 'all' ? content : content.filter(c => c.category === activeTab);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)' }}>
      {/* Background elements for elite aesthetic */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '40vh', background: 'linear-gradient(180deg, rgba(140, 21, 21, 0.03) 0%, transparent 100%)', pointerEvents: 'none' }} />
      
      {/* Page Header */}
      <div style={{ paddingTop: '160px', paddingBottom: '60px', textAlign: 'center', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '16px', fontWeight: '300' }}>
            LMS Library
          </h1>
          <div style={{ width: '60px', height: '1px', background: 'var(--primary)', margin: '0 auto 24px auto' }} />
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            පසුගිය ධර්ම දේශනා, සටහන් සහ අධ්‍යයන මූලාශ්‍ර සියල්ල මෙතැනින් ලබාගත හැක.
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px 120px 40px', display: 'flex', gap: '48px' }} className="lms-container">
        
        {/* Sidebar Tabs */}
        <div style={{ width: '280px', flexShrink: 0 }} className="lms-sidebar">
          <div style={{ position: 'sticky', top: '120px' }}>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Categories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  style={{
                    background: activeTab === cat.id ? 'var(--bg-secondary)' : 'transparent',
                    border: '1px solid',
                    borderColor: activeTab === cat.id ? 'var(--glass-border)' : 'transparent',
                    color: activeTab === cat.id ? 'var(--primary)' : 'var(--text-muted)',
                    padding: '16px 20px',
                    textAlign: 'left',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sinhala)',
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: activeTab === cat.id ? '600' : '400',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  className="lms-tab-btn"
                >
                  {activeTab === cat.id && <motion.div layoutId="activeTabIndicator" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} />}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', margin: 0 }}>
              {categories.find(c => c.id === activeTab)?.name}
            </h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{filteredContent.length} results</span>
          </div>

          <motion.div 
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredContent.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer'
                  }}
                  className="lms-card"
                >
                  {/* Thumbnail Area */}
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                      backgroundImage: \`url(\${item.thumbnail})\`, 
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      opacity: 0.8
                    }} className="lms-card-img" />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />
                    
                    {/* Play Icon Overlay */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(255,255,255,0.8)' }} className="lms-play-icon">
                      <PlayCircle size={48} strokeWidth={1.5} />
                    </div>

                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: 'white', backdropFilter: 'blur(4px)' }}>
                      {item.duration}
                    </div>
                  </div>

                  {/* Details Area */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {item.date}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', margin: '0 0 16px 0', lineHeight: 1.4, flex: 1 }}>
                      {item.title}
                    </h3>
                    
                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                      <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600' }}>Watch Now</span>
                      {item.hasNotes && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }} className="lms-action-btn">
                            <FileText size={16} /> Notes
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: \`
        .lms-tab-btn:hover {
          color: var(--primary) !important;
          background: rgba(140, 21, 21, 0.02) !important;
        }
        .lms-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border-color: rgba(140, 21, 21, 0.2) !important;
        }
        .lms-card-img {
          transition: transform 0.5s ease;
        }
        .lms-card:hover .lms-card-img {
          transform: scale(1.05);
        }
        .lms-play-icon {
          transition: all 0.3s ease;
          transform: translate(-50%, -50%) scale(0.9) !important;
        }
        .lms-card:hover .lms-play-icon {
          color: white !important;
          transform: translate(-50%, -50%) scale(1.1) !important;
        }
        .lms-action-btn:hover {
          color: var(--primary) !important;
        }
        
        @media (max-width: 900px) {
          .lms-container {
            flex-direction: column;
            padding: 0 24px 80px 24px !important;
          }
          .lms-sidebar {
            width: 100% !important;
          }
          .lms-sidebar > div {
            position: relative !important;
            top: 0 !important;
          }
        }
      \`}} />
    </div>
  );
}
