import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Video, Calendar, ArrowRight, MonitorPlay, ExternalLink } from 'lucide-react';

export default function NoticeBoard() {
  const notices = [
    {
      id: 1,
      type: 'live',
      date: { month: 'SEP', day: '09' },
      title: 'විශේෂ සජීවී ධර්ම දේශනාව',
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
      title: 'පසුගිය ධර්ම දේශනාවේ පටිගත කිරීම',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8c1515', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
              <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#8c1515', opacity: 0.75, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', width: '8px', height: '8px', backgroundColor: '#8c1515' }}></span>
            </span>
            LIVE NOW
          </div>
        );
      case 'upcoming':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            <Calendar size={14} /> UPCOMING
          </div>
        );
      case 'past':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            <MonitorPlay size={14} /> ARCHIVED
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section style={{ padding: '80px 24px', backgroundColor: 'var(--bg-main)', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Editorial Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '60px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', fontWeight: '400', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
              Notice Board
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-sinhala)' }}>
              පුවරු නිවේදන සහ සජීවී විකාශන
            </p>
          </div>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '50%', 
            background: 'var(--bg-secondary)', color: 'var(--primary)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            border: '1px solid var(--glass-border)'
          }}>
            <Bell size={20} strokeWidth={1.5} />
          </div>
        </div>

        {/* Minimalist Notice List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {notices.map((notice, index) => (
            <motion.div 
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--glass-border)',
                backgroundColor: notice.type === 'live' ? 'rgba(140, 21, 21, 0.02)' : 'transparent',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              className="editorial-notice-row"
            >
              {/* Date Column */}
              <div style={{
                width: '120px',
                padding: '40px 24px 40px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                borderRight: '1px solid var(--glass-border)',
                marginRight: '32px'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: notice.type === 'live' ? '#8c1515' : 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>{notice.date.month}</span>
                <span style={{ fontSize: '2.5rem', fontWeight: '300', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', lineHeight: 1, marginTop: '8px' }}>{notice.date.day}</span>
              </div>

              {/* Content Column */}
              <div style={{ flex: 1, padding: '40px 32px 40px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ marginBottom: '16px' }}>
                  {getStatusBadge(notice.type)}
                </div>
                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', margin: '0 0 12px 0', fontWeight: '500', lineHeight: 1.4 }}>
                  {notice.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sinhala)' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                    {notice.speaker}
                  </span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Video size={14} color="var(--primary)" />
                    {notice.platform}
                  </span>
                </div>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', margin: 0, lineHeight: 1.7, maxWidth: '700px' }}>
                  {notice.description}
                </p>
              </div>

              {/* Action Column */}
              <div style={{
                padding: '40px 0 40px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }} className="editorial-action-col">
                <a href={notice.linkUrl} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: notice.type === 'live' ? 'var(--primary)' : 'transparent',
                  color: notice.type === 'live' ? 'white' : 'var(--text-main)',
                  border: notice.type === 'live' ? 'none' : '1px solid var(--glass-border)',
                  borderRadius: '0px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }} className="editorial-btn">
                  {notice.linkText}
                  {notice.type === 'live' ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Custom CSS for Editorial effects */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          .editorial-notice-row:hover {
            background-color: var(--bg-secondary) !important;
          }
          .editorial-btn:hover {
            background-color: var(--text-main) !important;
            color: var(--bg-main) !important;
            border-color: var(--text-main) !important;
          }
          @media (max-width: 768px) {
            .editorial-notice-row {
              flex-direction: column;
            }
            .editorial-notice-row > div:first-child {
              width: 100% !important;
              border-right: none !important;
              border-bottom: 1px solid var(--glass-border);
              margin-right: 0 !important;
              padding: 24px 0 !important;
              flex-direction: row !important;
              align-items: center !important;
              gap: 16px;
            }
            .editorial-notice-row > div:first-child span {
              margin-top: 0 !important;
            }
            .editorial-action-col {
              justify-content: flex-start !important;
              padding: 0 0 32px 0 !important;
            }
          }
        `}} />
      </div>
    </section>
  );
}
