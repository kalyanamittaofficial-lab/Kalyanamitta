import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Video, Calendar, ArrowRight, MonitorPlay, ExternalLink } from 'lucide-react';

export default function NoticeBoard() {
  const notices = [
    {
      id: 1,
      type: 'live',
      date: { month: 'SEP', day: '09' },
      title: 'විශේෂ සජීවී ධර්ම දේශනාව (Special Live Sermon)',
      speaker: 'කල්‍යාණමිත්‍ර දේශකතුමා',
      platform: 'Microsoft Teams',
      description: 'නිවන් දැකීමේ අවශ්‍යතාවය සහ කල්‍යාණ මිත්‍රත්වය පිළිබඳ ගැඹුරු සාකච්ඡාව.',
      linkText: 'Join Live Session',
      linkUrl: '#'
    },
    {
      id: 2,
      type: 'upcoming',
      date: { month: 'SEP', day: '15' },
      title: 'සතිපට්ඨාන භාවනා වැඩසටහන',
      speaker: 'කල්‍යාණමිත්‍ර දේශකතුමා',
      platform: 'Microsoft Teams',
      description: 'ප්‍රායෝගික භාවනා පුහුණුව සහ ධර්ම සාකච්ඡාව සඳහා ලියාපදිංචි වන්න.',
      linkText: 'View Details',
      linkUrl: '#'
    },
    {
      id: 3,
      type: 'past',
      date: { month: 'SEP', day: '02' },
      title: 'පසුගිය ධර්ම දේශනාවේ පටිගත කිරීම (LMS Archive)',
      speaker: 'LMS Library',
      platform: 'Kalyanamitta Portal',
      description: 'පසුගිය සතියේ පැවති දේශනාවට අදාළ ශ්‍රව්‍ය/දෘශ්‍ය පටිගත කිරීම් සහ සටහන් දැන් LMS හරහා ලබාගත හැක.',
      linkText: 'Access Recording',
      linkUrl: '/lms'
    }
  ];

  const getStatusBadge = (type) => {
    switch (type) {
      case 'live':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4d4d', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <span style={{ position: 'relative', display: 'flex', width: '10px', height: '10px' }}>
              <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#ff4d4d', opacity: 0.75, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', width: '10px', height: '10px', backgroundColor: '#ff4d4d', boxShadow: '0 0 8px #ff4d4d' }}></span>
            </span>
            LIVE NOW
          </div>
        );
      case 'upcoming':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary, #d4af37)', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <Calendar size={14} /> UPCOMING
          </div>
        );
      case 'past':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <MonitorPlay size={14} /> ARCHIVED
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section style={{ padding: '40px 24px 80px', backgroundColor: 'var(--bg-main)', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Film Box Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: 'relative',
            padding: '40px',
            borderRadius: '16px',
            background: 'linear-gradient(145deg, rgba(15, 15, 15, 0.9), rgba(5, 5, 5, 0.95))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.2)', // Gold border
            boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Inner Glow */}
          <div style={{
            position: 'absolute',
            top: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '60%', height: '100px',
            background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.1), transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 2 }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '8px', 
              background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-primary, #d4af37)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              <Bell size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: '#ffffff', fontWeight: '400', margin: 0, letterSpacing: '1px' }}>
                Notice Board
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', margin: '4px 0 0 0', fontFamily: 'var(--font-sinhala)' }}>
                පුවරු නිවේදන සහ සජීවී විකාශන
              </p>
            </div>
            <div style={{ flexGrow: 1, height: '1px', background: 'linear-gradient(90deg, rgba(212,175,55,0.3), transparent)', marginLeft: '32px' }} />
          </div>

          {/* Notice List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 2 }}>
            {notices.map((notice, index) => (
              <motion.div 
                key={notice.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                style={{
                  display: 'flex',
                  border: notice.type === 'live' ? '1px solid rgba(255, 77, 77, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  backgroundColor: notice.type === 'live' ? 'rgba(255, 77, 77, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                className="film-notice-card"
              >
                {/* Date Column */}
                <div style={{
                  minWidth: '110px',
                  padding: '24px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: notice.type === 'live' ? '1px solid rgba(255, 77, 77, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: notice.type === 'live' ? 'rgba(255, 77, 77, 0.05)' : 'rgba(0,0,0,0.2)',
                }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: notice.type === 'live' ? '#ff4d4d' : 'var(--gold-primary, #d4af37)', letterSpacing: '2px' }}>{notice.date.month}</span>
                  <span style={{ fontSize: '2.4rem', fontWeight: '300', fontFamily: 'var(--font-serif)', color: '#ffffff', lineHeight: 1, marginTop: '8px' }}>{notice.date.day}</span>
                </div>

                {/* Content Column */}
                <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ marginBottom: '12px' }}>
                    {getStatusBadge(notice.type)}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-sinhala)', color: '#ffffff', margin: '0 0 12px 0', fontWeight: '400', letterSpacing: '0.5px' }}>
                    {notice.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--gold-primary, #d4af37)' }} />
                      {notice.speaker}
                    </span>
                    <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Video size={16} color="var(--gold-primary, #d4af37)" />
                      {notice.platform}
                    </span>
                  </div>
                  <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-sinhala)', margin: 0, lineHeight: 1.6, maxWidth: '800px' }}>
                    {notice.description}
                  </p>
                </div>

                {/* Action Column */}
                <div style={{
                  padding: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: notice.type === 'live' ? '1px solid rgba(255, 77, 77, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)'
                }} className="film-action-col">
                  <a href={notice.linkUrl} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    backgroundColor: notice.type === 'live' ? '#ff4d4d' : 'transparent',
                    color: notice.type === 'live' ? 'white' : 'var(--gold-primary, #d4af37)',
                    border: notice.type === 'live' ? 'none' : '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap',
                    boxShadow: notice.type === 'live' ? '0 10px 20px rgba(255, 77, 77, 0.2)' : 'none'
                  }} className="film-btn">
                    {notice.linkText}
                    {notice.type === 'live' ? <ExternalLink size={18} /> : <ArrowRight size={18} />}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Custom CSS for Elite Film Box effects */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          .film-notice-card:hover {
            transform: scale(1.01) translateY(-2px);
            background-color: rgba(255, 255, 255, 0.04) !important;
            border-color: rgba(212, 175, 55, 0.4) !important;
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
          }
          .film-notice-card:hover .film-action-col {
            border-left-color: rgba(212, 175, 55, 0.3) !important;
          }
          .film-btn:hover {
            background-color: var(--gold-primary, #d4af37) !important;
            color: #000 !important;
            border-color: var(--gold-primary, #d4af37) !important;
          }
          @media (max-width: 768px) {
            .film-action-col {
              display: none !important;
            }
          }
        `}} />
      </div>
    </section>
  );
}
