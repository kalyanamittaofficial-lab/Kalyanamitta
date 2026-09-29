import { useState, useEffect, useRef } from 'react';
import { Radio, Eye, X, FileText, Clock, Download, MessageSquare } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';
import YouTube from 'react-youtube';
import LiveChat from '../components/LiveChat';

export default function Live() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isWebView = searchParams.get('webview') === 'true';
  const [showUI, setShowUI] = useState(!isWebView);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // ─── Data from Supabase ───
  const [isLive, setIsLive] = useState(false);
  const [liveVideoId, setLiveVideoId] = useState('');
  const [nextScheduledTime, setNextScheduledTime] = useState('');
  const [nextTitle, setNextTitle] = useState('');
  const [sermonTitle, setSermonTitle] = useState('');
  const [speakerName, setSpeakerName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [joined, setJoined] = useState(isWebView);

  // ─── Watch-Party sync state ───
  const playerRef = useRef(null);
  const [playbackState, setPlaybackState] = useState('paused');
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [startSeconds, setStartSeconds] = useState(0);

  // ─── Real-time live viewer count via Supabase Presence ───
  const [viewerCount, setViewerCount] = useState(1);

  useEffect(() => {
    const visitorKey = Math.random().toString(36).substring(2, 10);
    const presenceChannel = supabase.channel('live_broadcast_presence', {
      config: {
        presence: { key: visitorKey },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        let total = 0;
        for (const key in state) {
          total += state[key]?.length || 1;
        }
        setViewerCount(Math.max(1, total));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, []);

  // ─── Load initial data + realtime subscription ───
  useEffect(() => {
    const applyData = (d) => {
      if (!d) return;
      setIsLive(!!d.is_live);
      setLiveVideoId(d.video_id || '');
      setNextScheduledTime(d.next_scheduled_time || '');
      setNextTitle(d.next_title || '');
      setSermonTitle(d.sermon_title || '');
      setSpeakerName(d.speaker_name || '');
      setPdfUrl(d.pdf_url || '');
      setPlaybackState(d.playback_state || 'paused');
      setCurrentVideoTime(d.current_video_time || 0);
      setLastSyncTime(d.last_sync_time || null);
    };

    supabase
      .from('live_broadcast')
      .select('is_live, video_id, next_scheduled_time, next_title, sermon_title, speaker_name, pdf_url, playback_state, current_video_time, last_sync_time')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (error) { console.error('Failed to load live broadcast data:', error); return; }
        applyData(data);
      });

    const subscription = supabase
      .channel('live_viewer_sync')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_broadcast', filter: 'id=eq.1' }, (payload) => {
        applyData(payload.new);
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error(`Live broadcast realtime subscription error: ${status}`);
        }
      });

    return () => { supabase.removeChannel(subscription); };
  }, []);

  // ─── Calculate sync start time when joining ───
  useEffect(() => {
    if (isLive && playbackState === 'playing' && lastSyncTime) {
      const elapsed = Math.floor((Date.now() - new Date(lastSyncTime).getTime()) / 1000);
      setStartSeconds(currentVideoTime + elapsed);
    } else {
      setStartSeconds(currentVideoTime);
    }
  }, [isLive, playbackState, currentVideoTime, lastSyncTime]);

  // ─── Realtime watch-party sync for running player ───
  useEffect(() => {
    if (!playerRef.current) return;

    if (playbackState === 'paused') {
      playerRef.current.pauseVideo();
      playerRef.current.seekTo(currentVideoTime, true);
    } else if (playbackState === 'playing') {
      const elapsed = lastSyncTime
        ? Math.floor((Date.now() - new Date(lastSyncTime).getTime()) / 1000)
        : 0;
      const targetTime = currentVideoTime + elapsed;
      const actualTime = playerRef.current.getCurrentTime();

      if (Math.abs(actualTime - targetTime) > 3) {
        playerRef.current.seekTo(targetTime, true);
      }
      playerRef.current.playVideo();
    }
  }, [playbackState, currentVideoTime, lastSyncTime]);

  // ─── Countdown timer ───
  useEffect(() => {
    if (isLive || !nextScheduledTime) return;

    const update = () => {
      const distance = new Date(nextScheduledTime).getTime() - Date.now();
      if (Number.isNaN(distance) || distance < 0) {
        setTimeRemaining('Starting soon…');
        return;
      }
      const d = Math.floor(distance / 86400000);
      const h = Math.floor((distance % 86400000) / 3600000);
      const m = Math.floor((distance % 3600000) / 60000);
      const s = Math.floor((distance % 60000) / 1000);
      setTimeRemaining(`${d > 0 ? `${d}d ` : ''}${h}h ${m}m ${s}s`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isLive, nextScheduledTime]);

  // ─── Cinematic UI auto-hide ───
  useEffect(() => {
    if (isWebView) {
      setShowUI(false);
      return;
    }
    
    let timeout;
    const reveal = () => {
      setShowUI(true);
      clearTimeout(timeout);
      if (!isChatOpen) {
        timeout = setTimeout(() => setShowUI(false), 3500);
      }
    };
    window.addEventListener('pointermove', reveal);
    window.addEventListener('pointerdown', reveal);
    if (!isChatOpen) {
      timeout = setTimeout(() => setShowUI(false), 4000);
    }
    return () => {
      window.removeEventListener('pointermove', reveal);
      window.removeEventListener('pointerdown', reveal);
      clearTimeout(timeout);
    };
  }, [isWebView, isChatOpen]);

  // ─── Derived display values ───
  const displayTitle = sermonTitle || nextTitle || 'සජීවී ධර්ම දේශනාව';
  const displaySpeaker = speakerName || '';

  return (
    <div style={{
      width: '100vw', height: '100vh', background: '#000',
      position: 'fixed', top: 0, left: 0, zIndex: 9999,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>

      {/* ─── Immersive Video Layer ─── */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {isLive && liveVideoId ? (
          <YouTube
            videoId={liveVideoId.trim()}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                rel: 0,
                modestbranding: 1,
                playsinline: 1,
                start: Math.floor(startSeconds),
              },
            }}
            onReady={(e) => { playerRef.current = e.target; }}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          /* ─── Offline / Waiting Screen ─── */
          <div style={{
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: '#fff',
            background: 'radial-gradient(ellipse at center, #1a0505 0%, #000 100%)',
          }}>
            <Radio size={64} style={{ opacity: 0.15, marginBottom: '24px', color: '#8c1515' }} />
            <h2 style={{
              fontFamily: 'var(--font-sinhala)', fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: 300, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.6)',
              margin: '0 0 8px 0', textAlign: 'center',
            }}>
              මේ මොහොතේ සජීවී විකාශයක් නොමැත
            </h2>

            {nextTitle && nextScheduledTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '40px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '16px',
                  background: 'rgba(140,21,21,0.08)', padding: '32px 48px',
                  borderRadius: '24px', border: '1px solid rgba(140,21,21,0.2)',
                  backdropFilter: 'blur(10px)', textAlign: 'center',
                  maxWidth: '90vw',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-sinhala)', color: '#c0392b',
                  fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase', fontSize: '0.85rem',
                }}>
                  මීළඟ සජීවී විකාශය
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                  fontWeight: 600, margin: 0, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}>
                  {nextTitle}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                  <Clock size={20} color="rgba(255,255,255,0.5)" />
                  <span style={{
                    fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontFamily: 'monospace',
                    fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '2px',
                  }}>
                    {timeRemaining}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* ─── Click-blocker overlay (prevents user interacting with YouTube player) ─── */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }} />

      {/* ─── Cinematic UI Overlay (auto-hides) ─── */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              zIndex: 100, pointerEvents: 'none',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}
          >
            {/* Top Bar */}
            <div style={{
              width: '100%', padding: 'clamp(16px, 4vh, 32px) 5%',
              background: 'linear-gradient(to bottom, rgba(10,0,0,0.92) 0%, rgba(5,0,0,0.5) 50%, transparent 100%)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              {/* Left: Exit + Title */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <button
                  onClick={() => navigate('/')}
                  title="Back to Home"
                  style={{
                    pointerEvents: 'auto',
                    background: 'rgba(140,21,21,0.15)',
                    border: '1px solid rgba(140,21,21,0.3)',
                    color: '#fff', width: '48px', height: '48px',
                    borderRadius: '50%', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', cursor: 'pointer',
                    backdropFilter: 'blur(12px)', transition: 'all 0.3s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#8c1515'; e.currentTarget.style.transform = 'scale(1.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(140,21,21,0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <X size={22} />
                </button>

                <div>
                  <h1 style={{
                    color: '#fff', fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1rem, 2.5vw, 1.6rem)', fontWeight: 700,
                    margin: '0 0 4px 0', textShadow: '0 4px 16px rgba(0,0,0,0.8)',
                  }}>
                    {displayTitle}
                  </h1>
                  {displaySpeaker && (
                    <p style={{
                      color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sinhala)',
                      fontSize: 'clamp(0.8rem, 1.5vw, 1rem)', margin: 0,
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)', fontWeight: 300,
                    }}>
                      {displaySpeaker}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Actions, Live Badge & Viewer Count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                {/* Chat Toggle Button */}
                <button
                  onClick={() => setIsChatOpen((prev) => !prev)}
                  title={isChatOpen ? "Close Live Chat" : "Open Live Chat"}
                  style={{
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: isChatOpen ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${isChatOpen ? 'rgba(220, 38, 38, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    fontFamily: 'var(--font-sinhala)',
                    transition: 'all 0.2s',
                    boxShadow: isChatOpen ? '0 4px 16px rgba(140, 21, 21, 0.4)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isChatOpen) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isChatOpen) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <MessageSquare size={16} color={isChatOpen ? '#fff' : 'var(--primary)'} />
                  <span>කතිකාවත</span>
                </button>

                {isLive && (
                  <>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem',
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    }}>
                      <Eye size={16} color="rgba(255,255,255,0.5)" />
                      <span>{viewerCount.toLocaleString()}</span>
                    </div>
                    <motion.div
                      animate={{ opacity: [1, 0.55, 1] }}
                      transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: '#8c1515', color: '#fff',
                        padding: '5px 14px', borderRadius: '20px',
                        fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.1em',
                        boxShadow: '0 4px 18px rgba(140,21,21,0.5)',
                      }}
                    >
                      <div style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%' }} />
                      LIVE
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Bar: PDF / Resource download — only shown if pdfUrl is configured */}
            {pdfUrl && (
              <div style={{
                width: '100%', padding: 'clamp(20px, 4vh, 40px) 5%',
                background: 'linear-gradient(to top, rgba(10,0,0,0.92) 0%, rgba(5,0,0,0.5) 50%, transparent 100%)',
                display: 'flex', justifyContent: 'center',
              }}>
                <div style={{
                  pointerEvents: 'auto',
                  background: 'rgba(15,3,3,0.6)',
                  border: '1px solid rgba(140,21,21,0.25)',
                  padding: '14px 22px', borderRadius: '14px',
                  display: 'flex', alignItems: 'center', gap: '24px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.9)' }}>
                    <FileText size={20} color="#c0392b" />
                    <span style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.95rem', fontWeight: 500 }}>
                      අද දින දේශනාවට අදාළ සූත්‍රය
                    </span>
                  </div>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#8c1515', color: '#fff', textDecoration: 'none',
                      padding: '9px 20px', borderRadius: '9px',
                      fontFamily: 'var(--font-sinhala)', fontSize: '0.9rem', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '8px',
                      transition: 'all 0.25s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#a01818'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#8c1515'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <Download size={16} />
                    බාගත කරන්න (PDF)
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Join Gate Overlay (shown when live, before user confirms) ─── */}
      <AnimatePresence>
        {isLive && !joined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'radial-gradient(ellipse at center, #1a0505 0%, #000 100%)',
              zIndex: 99999, pointerEvents: 'auto', padding: '24px', boxSizing: 'border-box',
            }}
          >
            {/* Pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                position: 'absolute', width: '180px', height: '180px', borderRadius: '50%',
                border: '2px solid rgba(140,21,21,0.5)',
              }}
            />

            <Radio size={52} color="#8c1515" style={{ marginBottom: '24px', position: 'relative' }} />
            <h3 style={{
              color: '#fff', fontFamily: 'var(--font-sinhala)',
              fontSize: 'clamp(1.2rem, 4vw, 2rem)',
              marginBottom: '8px', textAlign: 'center', position: 'relative',
            }}>
              සජීවී විකාශය ආරම්භ වී ඇත
            </h3>
            {displayTitle && (
              <p style={{
                color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-sinhala)',
                fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', marginBottom: '40px',
                textAlign: 'center', maxWidth: '500px', position: 'relative',
              }}>
                {displayTitle}
              </p>
            )}
            <button
              onClick={() => setJoined(true)}
              style={{
                background: '#8c1515', color: '#fff', border: 'none',
                padding: 'clamp(14px, 3vw, 20px) clamp(28px, 5vw, 48px)',
                borderRadius: '40px', fontSize: 'clamp(1rem, 3vw, 1.4rem)',
                fontWeight: 700, fontFamily: 'var(--font-sinhala)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: '0 8px 30px rgba(140,21,21,0.45)',
                transition: 'all 0.3s', position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = '#a01818'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#8c1515'; }}
            >
              <Eye size={26} /> නැරඹීම සඳහා පිවිසෙන්න
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Live Stream Chat Drawer ─── */}
      <AnimatePresence>
        {isChatOpen && (
          <LiveChat
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            viewerCount={viewerCount}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
