import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookMarked, Trash2 } from 'lucide-react';
import { loadJourney, getAllPages, getPageMeta, formatMs, formatTimestamp, clearAllData } from '../DhammaTracker/trackerStore';
import { useReadingTracker } from '../DhammaTracker/useReadingTracker';

// ── Colour system ─────────────────────────────────────────────
// Based on scrollDepth: how far through the page the user got.
// Three states, three shades of red → white.
function getReadState(page) {
  const depth = page.scrollDepth || 0;
  const level = page.engagementLevel;

  if (depth >= 70 || level === 'reading' || level === 'deep') {
    // Fully / deeply read
    return {
      key:         'complete',
      border:      '#8C1515',
      dot:         '#8C1515',
      label:       'Read',
      labelColor:  '#8C1515',
      textOpacity: 1,
    };
  }
  if (depth >= 30 || level === 'skimming') {
    // Halfway through
    return {
      key:         'partial',
      border:      'rgba(140, 21, 21, 0.38)',
      dot:         'rgba(140, 21, 21, 0.45)',
      label:       'Partial',
      labelColor:  'rgba(140, 21, 21, 0.7)',
      textOpacity: 0.75,
    };
  }
  // Skipped / barely opened
  return {
    key:         'skipped',
    border:      'rgba(200, 200, 200, 0.5)',
    dot:         'rgba(180, 180, 180, 0.6)',
    label:       'Skipped',
    labelColor:  'var(--text-muted)',
    textOpacity: 0.45,
  };
}

// ── Extract the "last paused" paragraph text ─────────────────
// Highest mouseMs = where cursor dwelled → most recent focus point.
// Tie-break: highest paragraph index (furthest down the page = how far they got).
function getLastPausedText(page) {
  const paras = page.paragraphs;
  if (!paras || paras.length === 0) return null;

  // Only consider paragraphs actually visible for > 1s
  const meaningful = paras.filter(p => p.timeOnScreenMs > 1000 && p.text?.trim().length > 20);
  if (!meaningful.length) return null;

  // Score: mouse time weighted heavily, then paragraph index (depth in page)
  const sorted = [...meaningful].sort((a, b) => {
    const aIdx = parseInt(a.id?.replace('p', '') || '0', 10);
    const bIdx = parseInt(b.id?.replace('p', '') || '0', 10);
    const aScore = (a.mouseMs || 0) * 3 + aIdx * 100 + (a.timeOnScreenMs || 0);
    const bScore = (b.mouseMs || 0) * 3 + bIdx * 100 + (b.timeOnScreenMs || 0);
    return bScore - aScore;
  });

  const best = sorted[0];
  if (!best?.text) return null;

  const raw = best.text.trim();

  // Extract first complete sentence (up to 90 chars)
  const sentenceMatch = raw.match(/^(.{15,90}?[.!?…])\s/);
  if (sentenceMatch) return `"${sentenceMatch[1]}"`;

  // Fallback: first 75 chars with ellipsis
  return `"${raw.slice(0, 75)}${raw.length > 75 ? '…' : ''}"`;
}

// ── Single log row ─────────────────────────────────────────────
function LogRow({ page, isLast, onClick }) {
  const state  = getReadState(page);
  const meta   = getPageMeta(page.url);
  const paused = getLastPausedText(page);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={onClick ? { x: 4, backgroundColor: 'rgba(255,255,255,0.03)' } : {}}
      transition={{ duration: 0.2 }}
      onClick={() => onClick && onClick(page)}
      style={{
        display:        'flex',
        gap:            '12px',
        alignItems:     'flex-start',
        padding:        '11px 8px',
        margin:         '0 -8px',
        borderRadius:   '8px',
        cursor:         onClick ? 'pointer' : 'default',
        borderBottom:   isLast ? 'none' : '1px solid var(--glass-border)',
        opacity:        state.textOpacity,
      }}
    >
      {/* Left: colour strip + connector line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '3px' }}>
        {/* Colour dot */}
        <div style={{
          width:        '10px',
          height:       '10px',
          borderRadius: '50%',
          background:   state.dot,
          border:       `2px solid ${state.border}`,
          flexShrink:   0,
        }} />
        {/* Vertical connector */}
        {!isLast && (
          <div style={{
            width:      '1.5px',
            flex:       1,
            minHeight:  '20px',
            background: 'var(--glass-border)',
            marginTop:  '4px',
          }} />
        )}
      </div>

      {/* Center: page title + last-paused text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Page name */}
        <div style={{
          fontSize:     '0.95rem', // Slightly larger since it's just the Sinhala text now
          fontWeight:   600,
          color:        'var(--text-main)',
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          lineHeight:   1.3,
        }}>
          {meta.icon} {meta.sinhala || meta.name}
        </div>

        {/* Last-paused paragraph text */}
        {paused && (
          <div style={{
            fontSize:   '0.72rem',
            color:      'var(--text-muted)',
            fontStyle:  'italic',
            marginTop:  '3px',
            lineHeight: 1.4,
            // Allow wrapping for paragraph snippet
            wordBreak:  'break-word',
          }}>
            {paused}
          </div>
        )}

        {/* Read state badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
          <span style={{
            fontSize:     '0.63rem',
            fontWeight:   700,
            color:        state.labelColor,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}>
            {state.label}
          </span>
          {page.scrollDepth > 0 && (
            <span style={{ fontSize: '0.63rem', color: 'var(--text-muted)' }}>
              · {page.scrollDepth}% scrolled
            </span>
          )}
        </div>
      </div>

      {/* Right: time + date */}
      <div style={{ flexShrink: 0, textAlign: 'right', paddingTop: '2px' }}>
        <div style={{
          fontSize:   '0.82rem',
          fontWeight: 600,
          color:      'var(--text-main)',
          whiteSpace: 'nowrap',
        }}>
          {formatMs(page.activeTime)}
        </div>
        <div style={{
          fontSize:  '0.65rem',
          color:     'var(--text-muted)',
          marginTop: '2px',
          whiteSpace: 'nowrap',
        }}>
          {formatTimestamp(page.enteredAt)}
        </div>
      </div>
    </motion.div>
  );
}

// ── Bookmark button icon ───────────────────────────────────────
function BookmarkIcon({ color = 'white' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 3H19C19.6 3 20 3.4 20 4V21L12 17L4 21V4C4 3.4 4.4 3 5 3Z"
        fill={color}
        fillOpacity="0.9"
      />
      <path
        d="M8 7H16M8 11H13"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ════════════════════════════════════════════════════════════
//  DhammaLog — Client-facing reading log
//  Simple top-to-bottom log, newest first.
//  Red = read · Light red = partial · White = skipped
// ════════════════════════════════════════════════════════════
export default function DhammaLog() {
  const [isOpen, setIsOpen] = useState(false);
  const [pages,  setPages]  = useState([]);
  const navigate = useNavigate();

  // Run the tracking hook locally so tracking continues to happen
  const { liveStats } = useReadingTracker();

  // Read fresh data from localStorage when panel opens
  const handleOpen = useCallback(() => {
    const journey  = loadJourney();
    const allPages = getAllPages(journey);
    // Newest first; skip login/register/onboarding entries
    const filtered = allPages
      .filter(p => !p.url?.match(/^\/(login|register|onboarding)/))
      .slice()
      .reverse();
    setPages(filtered);
    setIsOpen(true);
  }, []);

  const handleRowClick = useCallback((page) => {
    setIsOpen(false);
    navigate(page.url);
    if (page.leaveScrollY > 0) {
      setTimeout(() => {
        window.scrollTo({ top: page.leaveScrollY, behavior: 'smooth' });
      }, 300);
    }
  }, [navigate]);

  // Legend counts
  const completed = pages.filter(p => getReadState(p).key === 'complete').length;
  const partial   = pages.filter(p => getReadState(p).key === 'partial').length;
  const skipped   = pages.filter(p => getReadState(p).key === 'skipped').length;

  return (
    <>
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999 }}>

        {/* ── Floating Bookmark Button ─────────────────────── */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              key="log-fab"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleOpen}
              title="Reading Log"
              style={{
                width:        '52px',
                height:       '52px',
                borderRadius: '50%',
                border:       'none',
                cursor:       'pointer',
                background:   'var(--glass-bg)',
                backdropFilter: 'blur(var(--glass-blur))',
                boxShadow:    '0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px var(--glass-border)',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                outline:      'none',
              }}
            >
              <BookmarkIcon color="var(--primary)" />

              {/* Count badge */}
              {pages.length === 0 && (
                <div style={{
                  position:     'absolute',
                  top:          '-2px',
                  right:        '-2px',
                  width:        '8px',
                  height:       '8px',
                  borderRadius: '50%',
                  background:   '#8C1515',
                  border:       '1.5px solid white',
                }} />
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Log Panel ────────────────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="log-panel"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              style={{
                position:       'absolute',
                bottom:         0,
                right:          0,
                width:          'min(360px, calc(100vw - 32px))',
                maxHeight:      '76vh',
                borderRadius:   '16px',
                background:     'var(--glass-bg)',
                backdropFilter: 'blur(var(--glass-blur))',
                border:         '1px solid var(--glass-border)',
                boxShadow:      '0 20px 60px rgba(0,0,0,0.16)',
                display:        'flex',
                flexDirection:  'column',
                overflow:       'hidden',
                fontFamily:     'var(--font-sinhala)',
              }}
            >
              {/* ── Header ─────────────────────────────────── */}
              <div style={{
                padding:        '14px 18px',
                borderBottom:   '1px solid var(--glass-border)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                flexShrink:     0,
              }}>
                <div>
                  <div style={{
                    fontWeight:  700,
                    fontSize:    '0.95rem',
                    color:       'var(--text-main)',
                    fontFamily:  'var(--font-serif)',
                    lineHeight:  1.2,
                  }}>
                    Reading Log
                  </div>
                  <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {pages.length} pages · newest first
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      if (window.confirm("ඔබට මෙම කියවීම් ඉතිහාසය මකා දැමීමට අවශ්‍යද?")) {
                        clearAllData();
                        setPages([]);
                        // Clear the current active session in the hook by reloading page
                        window.location.reload();
                      }
                    }}
                    style={{
                      background: 'none', border: '1px solid var(--glass-border)', cursor: 'pointer',
                      color: '#ef4444', padding: '6px',
                      borderRadius: '8px', display: 'flex', alignItems: 'center',
                    }}
                    title="ඉතිහාසය මකන්න"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', padding: '4px',
                      borderRadius: '6px', display: 'flex', alignItems: 'center',
                    }}
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* ── Legend ─────────────────────────────────── */}
              {pages.length > 0 && (
                <div style={{
                  display:      'flex',
                  gap:          '16px',
                  padding:      '10px 18px',
                  borderBottom: '1px solid var(--glass-border)',
                  flexShrink:   0,
                }}>
                  {[
                    { dot: '#8C1515',                  label: 'Read',    count: completed },
                    { dot: 'rgba(140,21,21,0.38)',      label: 'Partial', count: partial   },
                    { dot: 'rgba(200,200,200,0.5)',     label: 'Skipped', count: skipped   },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{
                        width:        '8px',
                        height:       '8px',
                        borderRadius: '50%',
                        background:   item.dot,
                        border:       `1.5px solid ${item.dot}`,
                        flexShrink:   0,
                      }} />
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {item.label} <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.count}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Log list ────────────────────────────────── */}
              <div style={{
                overflowY: 'auto',
                flex:      1,
                padding:   '12px 24px 16px',
              }}>
                {pages.length === 0 && !liveStats ? (
                  /* Empty state */
                  <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📖</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                      No reading history yet
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      Browse any page and it will appear here
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Reading Now (Live Stats) */}
                    {liveStats && (
                      <LogRow
                        page={{
                          ...liveStats,
                          enteredAt: Date.now(), // just for display
                          scrollDepth: liveStats.scrollDepth,
                        }}
                        isLast={pages.length === 0}
                        onClick={handleRowClick}
                      />
                    )}

                    {/* Historical pages */}
                    {pages.map((page, i) => (
                      <LogRow
                        key={`${page.url}-${page.enteredAt}-${i}`}
                        page={page}
                        isLast={i === pages.length - 1}
                        onClick={handleRowClick}
                      />
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
