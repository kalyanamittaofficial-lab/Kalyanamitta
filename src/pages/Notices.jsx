import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, FileText, Calendar, Clock, MonitorPlay, Video } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function Notices() {
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', name: 'සියලුම නිවේදන' },
    { id: 'upcoming', name: 'ඉදිරි දේශනා (Upcoming)' },
    { id: 'past', name: 'පටිගත කිරීම් (Archive)' },
    { id: 'special', name: 'විශේෂ නිවේදන (Special)' },
  ];

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error && data) {
      setContent(data);
    }
    setLoading(false);
  };

  const filteredContent = activeTab === 'all' ? content : content.filter(c => c.type === activeTab);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)' }}>
      
      {/* Editorial Page Header */}
      <div style={{ paddingTop: '160px', paddingBottom: '60px', textAlign: 'center', borderBottom: '1px solid var(--glass-border)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '16px', fontWeight: '400', letterSpacing: '-0.5px' }}>
            Notices & Archive
          </h1>
          <div style={{ width: '40px', height: '2px', background: 'var(--primary)', margin: '0 auto 24px auto' }} />
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            ඉදිරි දේශනා සඳහා නිවේදන සහ පසුගිය දේශනාවල පටිගත කිරීම් සියල්ල මෙතැනින්.
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 40px 120px 40px', display: 'flex', gap: '64px' }} className="elite-container">
        
        {/* Minimalist Sidebar */}
        <div style={{ width: '280px', flexShrink: 0 }} className="elite-sidebar">
          <div style={{ position: 'sticky', top: '120px' }}>
            <h3 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-serif)', color: 'var(--text-muted)', marginBottom: '24px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '700' }}>
              Categories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderLeft: activeTab === cat.id ? '2px solid var(--primary)' : '2px solid transparent',
                    color: activeTab === cat.id ? 'var(--text-main)' : 'var(--text-muted)',
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sinhala)',
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: activeTab === cat.id ? '600' : '400',
                  }}
                  className="elite-tab-btn"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', margin: 0, fontWeight: '500' }}>
              {categories.find(c => c.id === activeTab)?.name}
            </h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--font-serif)' }}>{filteredContent.length} Results</span>
          </div>

          <motion.div 
            layout
            style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredContent.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: 'flex',
                    borderTop: '1px solid var(--glass-border)',
                    padding: '40px 0',
                    transition: 'background-color 0.3s',
                    backgroundColor: item.type === 'live' ? 'rgba(140, 21, 21, 0.02)' : 'transparent',
                  }}
                  className="elite-list-row"
                >
                  {/* Left: Thumbnail/Date Block */}
                  <div style={{ width: '240px', flexShrink: 0, marginRight: '40px' }}>
                    {item.type === 'upcoming' || item.type === 'live' ? (
                       <div style={{ 
                         width: '100%', height: '160px', 
                         backgroundColor: item.type === 'live' ? 'rgba(140, 21, 21, 0.05)' : 'var(--bg-secondary)', 
                         border: '1px solid', borderColor: item.type === 'live' ? 'rgba(140, 21, 21, 0.2)' : 'var(--glass-border)',
                         display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                       }}>
                          <span style={{ fontSize: '1rem', fontWeight: '700', color: item.type === 'live' ? '#8c1515' : 'var(--primary)', letterSpacing: '2px' }}>SEP</span>
                          <span style={{ fontSize: '3.5rem', fontWeight: '300', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', lineHeight: 1, marginTop: '8px' }}>{item.date.split('-')[2]}</span>
                       </div>
                    ) : (
                      <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                        <div style={{ 
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                          backgroundImage: `url(${item.thumbnail})`, 
                          backgroundSize: 'cover', backgroundPosition: 'center',
                          transition: 'transform 0.5s ease'
                        }} className="elite-row-img" />
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)' }} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
                          <PlayCircle size={40} strokeWidth={1} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      {item.type === 'live' && (
                        <span style={{ backgroundColor: 'rgba(140, 21, 21, 0.1)', color: '#8c1515', padding: '4px 8px', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', border: '1px solid rgba(140,21,21,0.2)' }}>LIVE NOW</span>
                      )}
                      {item.type === 'upcoming' && (
                        <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14}/> UPCOMING</span>
                      )}
                      {item.type === 'past' && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}><MonitorPlay size={14}/> ARCHIVED</span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}><Clock size={14} /> {item.time}</span>
                    </div>

                    <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', margin: '0 0 16px 0', fontWeight: '500', lineHeight: 1.4 }}>
                      {item.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: 'auto' }}>
                      <button style={{ 
                        background: item.type === 'upcoming' || item.type === 'live' ? 'var(--text-main)' : 'transparent', 
                        color: item.type === 'upcoming' || item.type === 'live' ? 'var(--bg-main)' : 'var(--text-main)', 
                        border: '1px solid var(--text-main)', 
                        padding: '10px 24px', 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }} className="elite-action-btn">
                        {item.type === 'upcoming' || item.type === 'live' ? 'Join Session' : 'Watch Recording'}
                      </button>
                      
                      {item.hasNotes && (
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '500' }} className="elite-notes-btn">
                          <FileText size={16} /> Download Notes
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .elite-tab-btn:hover {
          color: var(--primary) !important;
          background-color: var(--bg-secondary) !important;
        }
        .elite-list-row:hover {
          background-color: var(--bg-secondary);
        }
        .elite-list-row:last-child {
          border-bottom: 1px solid var(--glass-border);
        }
        .elite-list-row:hover .elite-row-img {
          transform: scale(1.05);
        }
        .elite-action-btn:hover {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          color: white !important;
        }
        .elite-notes-btn:hover {
          color: var(--text-main) !important;
        }
        
        @media (max-width: 900px) {
          .elite-container {
            flex-direction: column;
            padding: 40px 24px 80px 24px !important;
            gap: 40px !important;
          }
          .elite-sidebar {
            width: 100% !important;
            border-bottom: 1px solid var(--glass-border);
            padding-bottom: 24px;
          }
          .elite-sidebar > div {
            position: relative !important;
            top: 0 !important;
          }
          .elite-list-row {
            flex-direction: column;
          }
          .elite-list-row > div:first-child {
            width: 100% !important;
            margin-right: 0 !important;
            margin-bottom: 24px;
          }
        }
      `}} />
    </div>
  );
}
