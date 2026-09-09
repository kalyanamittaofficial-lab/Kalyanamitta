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
      linkUrl: '#' // Replace with actual MS Teams link
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
      linkUrl: '/library'
    }
  ];

  const getStatusBadge = (type) => {
    switch (type) {
      case 'live':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e53e3e', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
              <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#e53e3e', opacity: 0.75, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', width: '8px', height: '8px', backgroundColor: '#e53e3e' }}></span>
            </span>
            LIVE NOW
          </div>
        );
      case 'upcoming':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary, #b8860b)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            <Calendar size={14} /> UPCOMING
          </div>
        );
      case 'past':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            <MonitorPlay size={14} /> ARCHIVED
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section style={{ padding: '80px 24px', backgroundColor: 'var(--bg-main)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '4px', 
            background: 'var(--primary)', color: 'white',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <Bell size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', fontWeight: '600', margin: 0, lineHeight: 1 }}>Notice Board</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '4px 0 0 0', fontFamily: 'var(--font-sinhala)' }}>පුවරු නිවේදන සහ සජීවී විකාශන</p>
          </div>
          <div style={{ flexGrow: 1, height: '1px', background: 'var(--glass-border)', marginLeft: '24px' }} />
        </div>

        {/* Notice List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notices.map((notice, index) => (
            <motion.div 
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{
                display: 'flex',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                backgroundColor: notice.type === 'live' ? 'rgba(229, 62, 62, 0.02)' : 'var(--bg-secondary)',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              className="notice-card-hover"
            >
              {/* Date Column */}
              <div style={{
                minWidth: '100px',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid var(--glass-border)',
                backgroundColor: notice.type === 'live' ? 'rgba(229, 62, 62, 0.05)' : 'rgba(0,0,0,0.02)',
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: notice.type === 'live' ? '#e53e3e' : 'var(--text-muted)', letterSpacing: '1px' }}>{notice.date.month}</span>
                <span style={{ fontSize: '2rem', fontWeight: '300', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', lineHeight: 1, marginTop: '4px' }}>{notice.date.day}</span>
              </div>

              {/* Content Column */}
              <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ marginBottom: '8px' }}>
                  {getStatusBadge(notice.type)}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', margin: '0 0 8px 0', fontWeight: '600' }}>
                  {notice.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
                    {notice.speaker}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Video size={14} />
                    {notice.platform}
                  </span>
                </div>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', margin: 0, lineHeight: 1.6, maxWidth: '800px' }}>
                  {notice.description}
                </p>
              </div>

              {/* Action Column (Desktop mostly, flex wraps on mobile if configured, but keeping simple here) */}
              <div style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderLeft: '1px solid var(--glass-border)'
              }} className="notice-action-col">
                <a href={notice.linkUrl} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: notice.type === 'live' ? '#e53e3e' : 'transparent',
                  color: notice.type === 'live' ? 'white' : 'var(--text-main)',
                  border: notice.type === 'live' ? 'none' : '1px solid var(--text-main)',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }} className="notice-btn">
                  {notice.linkText}
                  {notice.type === 'live' ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Custom CSS for hover effects */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          .notice-card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border-color: rgba(0,0,0,0.1);
          }
          .notice-btn:hover {
            background-color: var(--text-main) !important;
            color: white !important;
          }
          @media (max-width: 768px) {
            .notice-action-col {
              display: none !important; /* Hide right col on very small screens, make whole card clickable instead if needed */
            }
          }
        `}} />
      </div>
    </section>
  );
}
