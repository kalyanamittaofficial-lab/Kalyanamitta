import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Video, Calendar, ArrowRight, MonitorPlay, ExternalLink, Clock, ChevronRight, User, Radio } from 'lucide-react';
import { supabase } from '../utils/supabase';

// Helper to reliably format date strings into { month, day, time }
function parseNoticeDate(dateVal, timeVal) {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  if (!dateVal) {
    const now = new Date();
    return {
      month: months[now.getMonth()],
      day: String(now.getDate()).padStart(2, '0'),
      time: timeVal || '07:00 PM',
    };
  }

  const d = new Date(dateVal);
  if (!isNaN(d.getTime())) {
    return {
      month: months[d.getMonth()],
      day: String(d.getDate()).padStart(2, '0'),
      time: timeVal || d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  }

  // Fallback for strings like '2026-10-15'
  const parts = String(dateVal).split('-');
  if (parts.length === 3) {
    const monthIdx = parseInt(parts[1], 10) - 1;
    return {
      month: months[monthIdx] || 'UPCOMING',
      day: parts[2].padStart(2, '0'),
      time: timeVal || '07:00 PM',
    };
  }

  const now = new Date();
  return {
    month: months[now.getMonth()],
    day: String(now.getDate()).padStart(2, '0'),
    time: timeVal || 'LIVE',
  };
}

export default function NoticeBoard() {
  const [hoveredId, setHoveredId] = useState(null);
  const [liveBroadcast, setLiveBroadcast] = useState(null);
  const [dbNotices, setDbNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch live broadcast settings
    supabase
      .from('live_broadcast')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setLiveBroadcast(data);
      });

    // 2. Fetch notices from table
    supabase
      .from('notices')
      .select('*')
      .order('date', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data && Array.isArray(data)) setDbNotices(data);
        setLoading(false);
      });

    // 3. Realtime subscription on live_broadcast table
    const liveSub = supabase
      .channel('noticeboard_live_sync')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_broadcast', filter: 'id=eq.1' }, (payload) => {
        if (payload.new) setLiveBroadcast(payload.new);
      })
      .subscribe();

    // 4. Realtime subscription on notices table
    const noticesSub = supabase
      .channel('noticeboard_notices_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => {
        supabase
          .from('notices')
          .select('*')
          .order('date', { ascending: false })
          .limit(6)
          .then(({ data }) => {
            if (data && Array.isArray(data)) setDbNotices(data);
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(liveSub);
      supabase.removeChannel(noticesSub);
    };
  }, []);

  // Determine current active or scheduled Live notice for the Featured Card
  let liveNotice;

  if (liveBroadcast?.is_live) {
    // ACTIVE LIVE STREAM
    const liveDate = liveBroadcast.updated_at ? new Date(liveBroadcast.updated_at) : new Date();
    liveNotice = {
      id: 'active-live-broadcast',
      type: 'live',
      date: parseNoticeDate(liveDate, 'LIVE NOW'),
      title: liveBroadcast.sermon_title || liveBroadcast.next_title || 'විශේෂ සජීවී ධර්ම දේශනාව',
      speaker: liveBroadcast.speaker_name || 'ගෞරවනීය ස්වාමීන් වහන්සේ',
      platform: 'Kalyanamitta Live Portal',
      description: liveBroadcast.description || 'නිවන් දැකීමේ අවශ්‍යතාවය සහ කල්‍යාණ මිත්‍රත්වය පිළිබඳ සජීවී ධර්ම දේශනාව. සියලු දෙනාටම විවෘතයි.',
      linkText: 'සජීවී විකාශයට එක්වන්න (Join Live)',
      linkUrl: '/live',
      isLiveNow: true,
    };
  } else if (liveBroadcast?.next_scheduled_time) {
    // SCHEDULED LIVE SESSION
    const schedDate = new Date(liveBroadcast.next_scheduled_time);
    const timeFormatted = schedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    liveNotice = {
      id: 'scheduled-live-broadcast',
      type: 'upcoming-live',
      date: parseNoticeDate(schedDate, timeFormatted),
      title: liveBroadcast.next_title || liveBroadcast.sermon_title || 'සජීවී ධර්ම දේශනාව',
      speaker: liveBroadcast.speaker_name || 'ගෞරවනීය ස්වාමීන් වහන්සේ',
      platform: 'Kalyanamitta Live Portal',
      description: liveBroadcast.description || 'සජීවී ධර්ම දේශනාව සඳහා නියමිත වේලාවට සම්බන්ධ වන්න.',
      linkText: 'සජීවී පිටුව බලන්න (View Live Page)',
      linkUrl: '/live',
      isUpcomingLive: true,
    };
  } else if (dbNotices.length > 0) {
    // Use the first DB notice if no live is configured
    const first = dbNotices[0];
    liveNotice = {
      id: first.id,
      type: first.type,
      date: parseNoticeDate(first.date, first.time),
      title: first.title,
      speaker: first.speaker || 'ගෞරවනීය ස්වාමීන් වහන්සේ',
      platform: first.platform || 'Kalyanamitta Portal',
      description: first.description,
      linkText: first.link_text || 'View Details',
      linkUrl: first.link_url || '/notices',
    };
  } else {
    // Elegant fallback when DB is pristine
    const now = new Date();
    liveNotice = {
      id: 'default-live',
      type: 'upcoming-live',
      date: parseNoticeDate(now, '07:00 PM'),
      title: 'විශේෂ සජීවී ධර්ම දේශනාව',
      speaker: 'පූජ්‍ය අගලකඩ සිරිසුමන නාහිමි',
      platform: 'Kalyanamitta Live Portal',
      description: 'නිවන් දැකීමේ අවශ්‍යතාවය සහ කල්‍යාණ මිත්‍රත්වය පිළිබඳ ගැඹුරු සාකච්ඡාව. සියලු දෙනාටම විවෘතයි.',
      linkText: 'සජීවී විකාශය (Live Broadcast)',
      linkUrl: '/live',
    };
  }

  // Construct other notices from database (excluding the one on featured if matched)
  let otherNotices = dbNotices.filter((n) => n.id !== liveNotice.id).map((n) => ({
    id: n.id,
    type: n.type,
    date: parseNoticeDate(n.date, n.time),
    title: n.title,
    speaker: n.speaker,
    platform: n.platform || 'Kalyanamitta Portal',
    description: n.description,
    linkText: n.link_text || 'View Details',
    linkUrl: n.link_url || '/notices',
  }));

  // If database has no additional notices yet, provide clean recurring platform sessions
  if (otherNotices.length === 0) {
    const today = new Date();
    const nextWeek1 = new Date(today.getTime() + 5 * 86400000);
    const nextWeek2 = new Date(today.getTime() + 12 * 86400000);

    otherNotices = [
      {
        id: 'rec-1',
        type: 'upcoming',
        date: parseNoticeDate(nextWeek1, '06:00 PM'),
        title: 'සතිපට්ඨාන භාවනා පුහුණු වැඩසටහන',
        speaker: 'ගෞරවනීය ස්වාමීන් වහන්සේ',
        platform: 'Kalyanamitta Portal',
        description: 'ප්‍රායෝගික භාවනා පුහුණුව සහ ධර්ම සාකච්ඡාව.',
        linkText: 'View Details',
        linkUrl: '/notices',
      },
      {
        id: 'rec-2',
        type: 'upcoming',
        date: parseNoticeDate(nextWeek2, '07:30 PM'),
        title: 'ධම්මචක්කප්පවත්තන සූත්‍ර දේශනාව',
        speaker: 'ගෞරවනීය ස්වාමීන් වහන්සේ',
        platform: 'Kalyanamitta Portal',
        description: 'සූත්‍ර දේශනා මාලාවේ මීළඟ අදියර.',
        linkText: 'View Details',
        linkUrl: '/notices',
      },
      {
        id: 'rec-3',
        type: 'past',
        date: parseNoticeDate(today, 'Archive'),
        title: 'පසුගිය ධර්ම දේශනාවල පටිගත කිරීම්',
        speaker: 'LMS Library',
        platform: 'Kalyanamitta Library',
        description: 'පසුගිය සතිවල පැවති දේශනාවල ශ්‍රව්‍ය සහ දෘශ්‍ය පටිගත කිරීම්.',
        linkText: 'Access Recording',
        linkUrl: '/notices',
      },
    ];
  }

  return (
    <section style={{ padding: 'clamp(40px, 8vw, 100px) clamp(16px, 4vw, 24px)', backgroundColor: 'var(--bg-main)', position: 'relative' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(24px, 5vw, 40px)', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '4px', height: '32px', backgroundColor: 'var(--primary)' }} />
            <div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>
                Notice Board
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', margin: 0, fontFamily: 'var(--font-sinhala)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                පුවරු නිවේදන සහ කාලසටහන
              </p>
            </div>
          </div>
          <a href="/notices" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', borderBottom: '1px solid transparent', transition: 'border-color 0.3s' }} className="view-all-btn">
            View All Notices <ArrowRight size={16} />
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
              border: `1px solid ${liveNotice.isLiveNow ? 'rgba(220, 38, 38, 0.35)' : 'var(--glass-border)'}`,
              borderRadius: '8px',
              padding: 'clamp(24px, 5vw, 48px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: liveNotice.isLiveNow ? '0 10px 40px rgba(140, 21, 21, 0.12)' : 'none',
            }}
            className="featured-notice-card"
          >
            {/* Pulsing Live Background Accent */}
            {liveNotice.isLiveNow && (
              <div style={{ position: 'absolute', top: 0, right: 0, width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(220, 38, 38, 0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)', pointerEvents: 'none' }} />
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                {/* Date Block */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: liveNotice.isLiveNow ? '#dc2626' : 'var(--primary)', letterSpacing: '2px' }}>
                    {liveNotice.date.month}
                  </span>
                  <span style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)', fontWeight: '300', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', lineHeight: 0.9, marginTop: '8px' }}>
                    {liveNotice.date.day}
                  </span>
                </div>
                
                {/* Status Badge */}
                {liveNotice.isLiveNow ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px', backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.35)', borderRadius: '30px', color: '#dc2626', fontSize: '0.82rem', fontWeight: '800', letterSpacing: '1px' }}>
                    <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
                      <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#dc2626', opacity: 0.75, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                      <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', width: '8px', height: '8px', backgroundColor: '#dc2626' }}></span>
                    </span>
                    LIVE NOW
                  </div>
                ) : liveNotice.isUpcomingLive ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '30px', color: '#d97706', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' }}>
                    <Clock size={12} />
                    UPCOMING LIVE
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '30px', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: '600', textTransform: 'uppercase' }}>
                    {liveNotice.type}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--font-sinhala)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="var(--primary)" /> {liveNotice.date.time}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Video size={14} color="var(--primary)" /> {liveNotice.platform}</span>
                {liveNotice.speaker && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} color="var(--primary)" /> {liveNotice.speaker}</span>
                )}
              </div>

              <h3 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', margin: '0 0 16px 0', fontWeight: '600', lineHeight: 1.3 }}>
                {liveNotice.title}
              </h3>
              
              <p style={{ fontSize: 'clamp(1rem, 3vw, 1.1rem)', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', margin: '0 0 32px 0', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {liveNotice.description}
              </p>
            </div>

            <a 
              href={liveNotice.linkUrl} 
              target={liveNotice.linkUrl.startsWith('/live') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px 32px',
                backgroundColor: liveNotice.isLiveNow ? '#dc2626' : 'var(--text-main)',
                color: liveNotice.isLiveNow ? '#fff' : 'var(--bg-main)',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s',
                alignSelf: 'flex-start',
                border: `1px solid ${liveNotice.isLiveNow ? '#dc2626' : 'var(--text-main)'}`,
                borderRadius: '8px',
                boxShadow: liveNotice.isLiveNow ? '0 4px 20px rgba(220, 38, 38, 0.4)' : 'none',
              }} 
              className="primary-notice-btn"
            >
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
            {otherNotices.map((notice) => (
              <a
                key={notice.id}
                href={notice.linkUrl}
                target={notice.linkUrl.startsWith('http') || notice.linkUrl === '/live' ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredId(notice.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  padding: 'clamp(16px, 3vw, 28px)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid',
                  borderColor: hoveredId === notice.id ? 'var(--primary)' : 'var(--glass-border)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                className="secondary-notice-card"
              >
                {/* Left Line Accent on Hover */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                  backgroundColor: 'var(--primary)',
                  borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px',
                  transform: hoveredId === notice.id ? 'scaleY(1)' : 'scaleY(0)',
                  transition: 'transform 0.3s ease',
                  transformOrigin: 'center'
                }} />

                {/* Date Bubble */}
                <div className="date-bubble" style={{
                  minWidth: '70px', height: '70px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--glass-border)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  marginRight: 'clamp(12px, 3vw, 24px)',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '1px' }}>{notice.date.month}</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', lineHeight: 1 }}>{notice.date.day}</span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    {notice.type === 'upcoming' ? (
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12}/> UPCOMING</span>
                    ) : notice.type === 'live' ? (
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#dc2626', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}><Radio size={12}/> LIVE</span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}><MonitorPlay size={12}/> ARCHIVE</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {notice.date.time}</span>
                    {notice.platform && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {notice.platform}</span>
                    )}
                  </div>
                  
                  <h4 style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontFamily: 'var(--font-sinhala)', color: 'var(--text-main)', margin: '0 0 8px 0', fontWeight: '500', lineHeight: 1.3 }}>
                    {notice.title}
                  </h4>
                  
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                    {notice.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="arrow-icon-wrapper" style={{
                  width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid',
                  borderColor: hoveredId === notice.id ? 'var(--primary)' : 'var(--glass-border)',
                  borderRadius: '50%',
                  color: hoveredId === notice.id ? '#fff' : 'var(--text-main)',
                  backgroundColor: hoveredId === notice.id ? 'var(--primary)' : 'transparent',
                  transition: 'all 0.3s ease',
                  marginLeft: '12px',
                  flexShrink: 0
                }}>
                  <ChevronRight size={16} />
                </div>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Global Styles for this component */}
        <style dangerouslySetInnerHTML={{__html: `
          .notice-grid {
            grid-template-columns: 1fr 1fr;
          }
          .secondary-notice-card {
            align-items: center;
          }
          @media (max-width: 1024px) {
            .notice-grid {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 480px) {
            .secondary-notice-card {
              align-items: flex-start !important;
            }
            .arrow-icon-wrapper {
              display: none !important;
            }
            .date-bubble {
              min-width: 60px !important;
              height: 60px !important;
            }
          }
          .primary-notice-btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
          }
          .view-all-btn:hover {
            border-bottom-color: var(--primary) !important;
          }
        `}} />
      </div>
    </section>
  );
}
