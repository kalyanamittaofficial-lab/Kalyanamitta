import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Video, Calendar, ArrowRight, MonitorPlay, ExternalLink, Clock, ChevronRight } from 'lucide-react';

export default function NoticeBoard() {
  const [hoveredId, setHoveredId] = useState(null);

  const notices = [
    {
      id: 1,
      type: 'live',
      date: { month: 'SEP', day: '09', time: '07:00 PM' },
      title: 'විශේෂ සජීවී ධර්ම දේශනාව',
      speaker: 'කල්‍යාණමිත්‍ර දේශකතුමා',
      platform: 'Microsoft Teams',
      description: 'නිවන් දැකීමේ අවශ්‍යතාවය සහ කල්‍යාණ මිත්‍රත්වය පිළිබඳ ගැඹුරු සාකච්ඡාව. සියලු දෙනාටම විවෘතයි.',
      linkText: 'Join Live Session',
      linkUrl: '#'
    },
    {
      id: 2,
      type: 'upcoming',
      date: { month: 'SEP', day: '15', time: '06:00 PM' },
      title: 'සතිපට්ඨාන භාවනා වැඩසටහන',
      speaker: 'කල්‍යාණමිත්‍ර දේශකතුමා',
      platform: 'Microsoft Teams',
      description: 'ප්‍රායෝගික භාවනා පුහුණුව සහ ධර්ම සාකච්ඡාව.',
      linkText: 'View Details',
      linkUrl: '#'
    },
    {
      id: 3,
      type: 'upcoming',
      date: { month: 'SEP', day: '22', time: '07:30 PM' },
      title: 'ධම්මචක්කප්පවත්තන සූත්‍රය',
      speaker: 'කල්‍යාණමිත්‍ර දේශකතුමා',
      platform: 'Microsoft Teams',
      description: 'සූත්‍ර දේශනා මාලාවේ මීළඟ අදියර.',
      linkText: 'View Details',
      linkUrl: '#'
    },
    {
      id: 4,
      type: 'past',
      date: { month: 'SEP', day: '02', time: 'Archive' },
      title: 'පසුගිය ධර්ම දේශනාවේ පටිගත කිරීම',
      speaker: 'LMS Library',
      platform: 'Kalyanamitta Portal',
      description: 'පසුගිය සතියේ පැවති දේශනාවට අදාළ ශ්‍රව්‍ය/දෘශ්‍ය පටිගත කිරීම්.',
      linkText: 'Access Recording',
      linkUrl: '/lms'
    }
  ];

  const liveNotice = notices.find(n => n.type === 'live') || notices[0];
  const otherNotices = notices.filter(n => n.id !== liveNotice.id);

  return (
    <section style={{ padding: '100px 24px', backgroundColor: 'var(--bg-main)', position: 'relative' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '4px', height: '32px', backgroundColor: 'var(--primary)' }} />
            <div>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>
                Notice Board
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, fontFamily: 'var(--font-sinhala)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                පුවරු නිවේදන සහ කාලසටහන
              </p>
            </div>
          </div>
          <a href="/lms" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', borderBottom: '1px solid transparent', transition: 'border-color 0.3s' }} className="view-all-btn">
            View LMS Archive <ArrowRight size={16} />
          </a>
        </div>

        {/* Advanced Elite Grid Layout */}
        <div className="notice-grid" style={{ display: 'grid', gap: '24px' }}>
          
          {/* LEFT: Featured / Live Notice Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '2px', // Very sharp corners for elite editorial look
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="featured-notice-card"
          >
            {/* Pulsing Live Background Accent */}
            {liveNotice.type === 'live' && (
              <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(140, 21, 21, 0.05) 0%, transparent 70%)', transform: 'translate(30%, -30%)', pointerEvents: 'none' }} />
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                {/* Date Block */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary)', letterSpacing: '2px' }}>{liveNotice.date.month}</span>
                  <span style={{ fontSize: '4.5rem', fontWeight: '300', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', lineHeight: 0.9, marginTop: '8px' }}>{liveNotice.date.day}</span>
                </div>
                
                {/* Status Badge */}
                {liveNotice.type === 'live' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(140, 21, 21, 0.05)', border: '1px solid rgba(140, 21, 21, 0.2)', borderRadius: '30px', color: '#8c1515', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' }}>
                    <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
                      <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#8c1515', opacity: 0.75, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                      <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', width: '8px', height: '8px', backgroundColor: '#8c1515' }}></span>
                    </span>
                    LIVE NOW
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--font-sinhala)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {liveNotice.date.time}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Video size={14} /> {liveNotice.platform}</span>
              </div>

              <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', margin: '0 0 16px 0', fontWeight: '500', lineHeight: 1.3 }}>
                {liveNotice.title}
              </h3>
              
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', margin: '0 0 32px 0', lineHeight: 1.7 }}>
                {liveNotice.description}
              </p>
            </div>

            <a href={liveNotice.linkUrl} style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '16px 32px',
              backgroundColor: 'var(--text-main)',
              color: 'var(--bg-main)',
              fontSize: '1rem',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.3s',
              alignSelf: 'flex-start',
              border: '1px solid var(--text-main)'
            }} className="primary-notice-btn">
              {liveNotice.linkText} <ExternalLink size={18} />
            </a>
          </motion.div>

          {/* RIGHT: Timeline / List of other events */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {otherNotices.map((notice, index) => (
              <div 
                key={notice.id}
                onMouseEnter={() => setHoveredId(notice.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '32px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid',
                  borderColor: hoveredId === notice.id ? 'var(--text-main)' : 'var(--glass-border)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                className="secondary-notice-card"
              >
                {/* Left Line Accent on Hover */}
                <div style={{
                  position: 'absolute', left: -1, top: 0, bottom: 0, width: '3px',
                  backgroundColor: 'var(--primary)',
                  transform: hoveredId === notice.id ? 'scaleY(1)' : 'scaleY(0)',
                  transition: 'transform 0.3s ease',
                  transformOrigin: 'center'
                }} />

                {/* Date Bubble */}
                <div style={{
                  minWidth: '80px', height: '80px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--glass-border)',
                  backgroundColor: 'var(--bg-secondary)',
                  marginRight: '24px'
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '1px' }}>{notice.date.month}</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', lineHeight: 1 }}>{notice.date.day}</span>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    {notice.type === 'upcoming' ? (
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-main)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12}/> UPCOMING</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}><MonitorPlay size={12}/> ARCHIVE</span>
                    )}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {notice.date.time}</span>
                  </div>
                  
                  <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', margin: '0 0 8px 0', fontWeight: '500' }}>
                    {notice.title}
                  </h4>
                  
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {notice.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div style={{
                  width: '40px', height: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid',
                  borderColor: hoveredId === notice.id ? 'var(--text-main)' : 'var(--glass-border)',
                  borderRadius: '50%',
                  color: hoveredId === notice.id ? 'var(--bg-main)' : 'var(--text-main)',
                  backgroundColor: hoveredId === notice.id ? 'var(--text-main)' : 'transparent',
                  transition: 'all 0.3s ease'
                }}>
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Global Styles for this component */}
        <style dangerouslySetInnerHTML={{__html: `
          .notice-grid {
            grid-template-columns: 1fr 1fr;
          }
          @media (max-width: 1024px) {
            .notice-grid {
              grid-template-columns: 1fr;
            }
          }
          .primary-notice-btn:hover {
            background-color: transparent !important;
            color: var(--text-main) !important;
          }
          .view-all-btn:hover {
            border-bottom-color: var(--primary) !important;
          }
        `}} />
      </div>
    </section>
  );
}
