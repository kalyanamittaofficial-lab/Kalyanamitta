// ================================================================
//  DhammaTracker — React tracking hook
//  Tracks: page visits, active time, scroll depth,
//          paragraph attention (IntersectionObserver), mouse focus.
//  Everything is stored in localStorage — pure client-side.
// ================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  loadJourney, saveJourney,
  loadLastPosition, saveLastPosition,
  getEngagementLevel, getPageMeta,
  getTodayStats, getAllPages, getSessionsWithPages,
  clearAllData, setGlobalLiveStats,
} from './trackerStore';

// Pages we still track visits for but don't deeply observe
const SHALLOW_TRACK = ['/login', '/register', '/onboarding'];

// Scroll check every 500ms — no jank
const SCROLL_THROTTLE_MS = 500;
// Mouse position check every 150ms
const MOUSE_THROTTLE_MS  = 150;
// Panel stats refresh every 2 seconds (live "reading now" display)
const DISPLAY_REFRESH_MS = 2_000;
// IntersectionObserver setup delay after route change (let DOM render)
const OBSERVER_DELAY_MS  = 700;

// Module-level session ID — survives re-renders but resets on full page load
let _sessionId = null;
function getOrCreateSessionId() {
  if (!_sessionId) _sessionId = `sess_${Date.now()}`;
  return _sessionId;
}

export function useReadingTracker() {
  const location = useLocation();
  const navigate  = useNavigate();

  // ── Stable mutable refs (no re-renders needed for raw tracking data) ──
  const sessionId        = useRef(getOrCreateSessionId());
  const currentUrl       = useRef(null);
  const enteredAt        = useRef(null);
  const activeTimeMs     = useRef(0);
  const activeStart      = useRef(null);   // null = timer paused
  const scrollDepth      = useRef(0);      // max % reached on current page
  const currentScrollY   = useRef(0);      // live scroll position (for leaveScrollY)
  const paraData         = useRef({});     // { id: { totalMs, mouseMs, text, startTime } }
  const observer         = useRef(null);
  const pendingResume    = useRef(null);   // { url, scrollY } — set by resumeReading()
  const savePageRef      = useRef(null);   // always-current version of savePage callback
  const journeyRef       = useRef(null);   // mirror of journey state, avoids stale closures

  // ── React state — only for display ──────────────────────────────────
  const [journey,      setJourney]      = useState(() => loadJourney());
  const [lastPosition, setLastPosition] = useState(() => loadLastPosition());
  const [liveStats,    setLiveStats]    = useState(null);

  // Keep journeyRef in sync so savePageRef can always read the latest
  useEffect(() => { journeyRef.current = journey; }, [journey]);

  const isShallowTracked = SHALLOW_TRACK.some(p => location.pathname.startsWith(p));

  // ── Active time management ───────────────────────────────────────────
  const pauseActive = useCallback(() => {
    if (activeStart.current !== null) {
      activeTimeMs.current += Date.now() - activeStart.current;
      activeStart.current = null;
    }
  }, []);

  const resumeActive = useCallback(() => {
    if (activeStart.current === null && !document.hidden) {
      activeStart.current = Date.now();
    }
  }, []);

  // Pause/resume when user switches tabs or minimizes window
  useEffect(() => {
    const onChange = () => (document.hidden ? pauseActive() : resumeActive());
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, [pauseActive, resumeActive]);

  // ── Paragraph IntersectionObserver ──────────────────────────────────
  const setupObserver = useCallback(() => {
    // Tear down previous page's observer cleanly
    observer.current?.disconnect();
    paraData.current = {};

    if (isShallowTracked) return;

    setTimeout(() => {
      // Query all meaningful text elements across different page layouts
      const selectors = [
        'main p',
        'main h2', 'main h3', 'main h4',
        'main blockquote',
        'main li',
        '.blog-content p',
        '.blog-content h2',
        '.blog-content h3',
        '.blog-content blockquote',
        // BookReader article content
        'article p',
        'article h2',
        'article h3',
      ].join(', ');

      const elements = [...document.querySelectorAll(selectors)].filter(
        el => el.textContent.trim().length > 20 // skip tiny captions/labels
      );

      if (!elements.length) return;

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const id = entry.target.dataset.trackId;
          if (!id) return;

          if (!paraData.current[id]) {
            paraData.current[id] = {
              totalMs: 0,
              mouseMs: 0,
              text: entry.target.textContent.slice(0, 120),
              startTime: null,
            };
          }

          const d = paraData.current[id];

          if (entry.isIntersecting) {
            // Element came into view — start timing
            d.startTime = Date.now();
          } else if (d.startTime !== null) {
            // Element left view — accumulate time
            d.totalMs += Date.now() - d.startTime;
            d.startTime = null;
          }
        });
      }, {
        threshold: 0.4, // at least 40% of element must be visible
      });

      elements.forEach((el, i) => {
        el.dataset.trackId = `p${i}`;
        obs.observe(el);
      });

      observer.current = obs;
    }, OBSERVER_DELAY_MS);
  }, [isShallowTracked]);

  // ── Mouse attention tracking ─────────────────────────────────────────
  // Adds mouseMs to whichever paragraph the cursor is hovering over
  useEffect(() => {
    let throttle = null;

    const onMouseMove = (e) => {
      if (throttle) return;
      throttle = setTimeout(() => {
        throttle = null;
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const tracked = el?.closest('[data-track-id]');
        const id = tracked?.dataset?.trackId;
        if (id && paraData.current[id]) {
          paraData.current[id].mouseMs = (paraData.current[id].mouseMs || 0) + MOUSE_THROTTLE_MS;
        }
      }, MOUSE_THROTTLE_MS);
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      if (throttle) clearTimeout(throttle);
    };
  }, []);

  // ── Scroll depth + "last position" tracking ──────────────────────────
  useEffect(() => {
    let throttle = null;

    const onScroll = () => {
      if (throttle) return;
      throttle = setTimeout(() => {
        throttle = null;

        const scrolled   = window.scrollY;
        currentScrollY.current = scrolled; // track live position for leaveScrollY

        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          const pct = Math.round((scrolled / docHeight) * 100);
          scrollDepth.current = Math.max(scrollDepth.current, pct);
        }

        // Save "resume position" — skip auth/utility pages
        if (!isShallowTracked) {
          const pos = {
            url:           location.pathname,
            pageName:      getPageMeta(location.pathname).name,
            scrollY:       scrolled,
            scrollPercent: scrollDepth.current,
          };
          saveLastPosition(pos);
          setLastPosition(pos);
        }
      }, SCROLL_THROTTLE_MS);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (throttle) clearTimeout(throttle);
    };
  }, [location.pathname, isShallowTracked]);

  // ── Finalize and persist a page visit ───────────────────────────────
  const savePage = useCallback((url) => {
    if (!url || !enteredAt.current || !sessionId.current) return;

    pauseActive();
    const totalActiveMs = activeTimeMs.current;

    // Finalize any still-visible paragraph timers
    const paragraphs = Object.entries(paraData.current).map(([id, d]) => {
      let ms = d.totalMs;
      if (d.startTime !== null) ms += Date.now() - d.startTime; // still visible
      return {
        id,
        timeOnScreenMs: ms,
        mouseMs:        d.mouseMs,
        text:           d.text,
        // Classify: > 5s = read, > 1.5s = skimmed, else skipped
        engagement: ms > 5_000 ? 'read' : ms > 1_500 ? 'skimmed' : 'skipped',
      };
    }).filter(p => p.timeOnScreenMs > 300); // ignore blink-passes

    const pageRecord = {
      url,
      ...getPageMeta(url),
      enteredAt:       enteredAt.current,
      leftAt:          Date.now(),
      activeTime:      totalActiveMs,
      scrollDepth:     scrollDepth.current,
      leaveScrollY:    currentScrollY.current,
      engagementLevel: getEngagementLevel(totalActiveMs),
      paragraphs,
    };

    setJourney(prev => {
      const sessions = prev.sessions.map(s => {
        if (s.id !== sessionId.current) return s;
        return { ...s, pages: [...s.pages, pageRecord] };
      });
      const updated = {
        ...prev,
        sessions,
        totalReadingTimeMs: (prev.totalReadingTimeMs || 0) + totalActiveMs,
      };
      journeyRef.current = updated;
      saveJourney(updated);
      return updated;
    });
  }, [pauseActive]);

  // Keep savePageRef current so the cleanup effect & beforeunload can use it
  savePageRef.current = () => savePage(currentUrl.current);

  // ── Route change handler ─────────────────────────────────────────────
  useEffect(() => {
    const leaving = currentUrl.current;

    // 1. Save the page we're leaving
    if (leaving && leaving !== location.pathname) {
      savePage(leaving);
    }

    // 2. Ensure this session exists in the journey
    setJourney(prev => {
      const exists = prev.sessions.some(s => s.id === sessionId.current);
      if (exists) return prev;
      const updated = {
        ...prev,
        sessions: [...prev.sessions, { id: sessionId.current, startedAt: Date.now(), pages: [] }],
      };
      journeyRef.current = updated;
      saveJourney(updated);
      return updated;
    });

    // 3. Reset all tracking state for the new page
    currentUrl.current   = location.pathname;
    enteredAt.current    = Date.now();
    activeTimeMs.current = 0;
    scrollDepth.current  = 0;
    paraData.current     = {};
    observer.current?.disconnect();

    // Start active timer (unless tab is hidden)
    activeStart.current = document.hidden ? null : Date.now();

    // 4. Set up paragraph observer for the new page
    setupObserver();

    // 5. Handle pending resume scroll (set by resumeReading())
    if (pendingResume.current?.url === location.pathname) {
      const targetScrollY = pendingResume.current.scrollY;
      pendingResume.current = null;
      setTimeout(() => {
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
      }, 700); // wait for page render
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save on full page close / refresh ───────────────────────────────
  useEffect(() => {
    const onUnload = () => savePageRef.current?.();
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);

  // ── Cleanup on component unmount ─────────────────────────────────────
  // Handles navigation from Layout → BookReader (different layout mounts)
  useEffect(() => {
    return () => {
      savePageRef.current?.();
      observer.current?.disconnect();
    };
  }, []);

  // ── Live display refresh ──────────────────────────────────────────────
  // Updates the "Reading Now" card in the panel every 2s
  useEffect(() => {
    const timer = setInterval(() => {
      const nowActive = activeTimeMs.current +
        (activeStart.current !== null ? Date.now() - activeStart.current : 0);

      // Compute live paragraph data for the "last paused text" feature
      const paragraphs = Object.entries(paraData.current).map(([id, d]) => {
        let ms = d.totalMs;
        if (d.startTime !== null) ms += Date.now() - d.startTime;
        return {
          id,
          timeOnScreenMs: ms,
          mouseMs:        d.mouseMs,
          text:           d.text,
        };
      });

      const stats = {
        url:              location.pathname,
        activeTime:       nowActive,
        scrollDepth:      scrollDepth.current,
        leaveScrollY:     currentScrollY.current,
        engagementLevel:  getEngagementLevel(nowActive),
        paragraphCount:   paragraphs.length,
        readParagraphs:   paragraphs.filter(p => p.timeOnScreenMs > 5_000).length,
        paragraphs,
      };
      
      setLiveStats(stats);
      setGlobalLiveStats(stats);
    }, DISPLAY_REFRESH_MS);

    return () => clearInterval(timer);
  }, [location.pathname]);

  // ── Resume reading ───────────────────────────────────────────────────
  const resumeReading = useCallback(() => {
    if (!lastPosition) return;
    const { url, scrollY } = lastPosition;

    if (location.pathname === url) {
      // Already on that page — just scroll
      window.scrollTo({ top: scrollY, behavior: 'smooth' });
    } else {
      // Store resume target, then navigate
      pendingResume.current = { url, scrollY };
      navigate(url);
    }
  }, [lastPosition, location.pathname, navigate]);

  // ── Clear all data ───────────────────────────────────────────────────
  const clearHistory = useCallback(() => {
    clearAllData();
    setJourney({ sessions: [], totalReadingTimeMs: 0, createdAt: Date.now() });
    setLastPosition(null);
    setLiveStats(null);
    _sessionId = `sess_${Date.now()}`; // new session after clear
    sessionId.current = _sessionId;
  }, []);

  // ── Computed views for UI ────────────────────────────────────────────
  const todayStats = getTodayStats(journey);
  const allPages   = getAllPages(journey);
  const sessions   = getSessionsWithPages(journey);

  return {
    journey,
    lastPosition,
    liveStats,
    todayStats,
    allPages,
    sessions,
    resumeReading,
    clearHistory,
  };
}
