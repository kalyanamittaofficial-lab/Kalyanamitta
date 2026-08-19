// ================================================================
//  DhammaTracker — Data persistence layer
//  All data lives in localStorage — no backend, no AI, no account.
// ================================================================

const JOURNEY_KEY = 'dhamma_journey_v1';
const POSITION_KEY = 'dhamma_last_pos_v1';

// ── Engagement classification ────────────────────────────────
// Based purely on active (tab-visible) milliseconds spent on page
export const ENGAGEMENT = {
  passing:  { label: 'Just Passing',  sinhala: 'ඉක්මනින් ගිය',         color: '#9CA3AF', emoji: '🏃', maxMs: 8_000   },
  glanced:  { label: 'Glanced',       sinhala: 'ඇස ගැවසිය',            color: '#F59E0B', emoji: '👀', maxMs: 30_000  },
  skimming: { label: 'Skimming',      sinhala: 'ගලා කියෙව්වා',         color: '#3B82F6', emoji: '📖', maxMs: 120_000 },
  reading:  { label: 'Reading',       sinhala: 'හොඳට කියෙව්වා',        color: '#10B981', emoji: '📚', maxMs: 300_000 },
  deep:     { label: 'Deep Study',    sinhala: 'ගැඹුරු අධ්‍යයනය',  color: '#8B5CF6', emoji: '🧘', maxMs: Infinity },
};

// ── Page metadata — Sinhala names match Header nav exactly ──
export const PAGE_META = {
  '/':                { name: 'Home',            sinhala: 'මුල් පිටුව',               icon: '🏠' },
  '/community':       { name: 'Community',       sinhala: 'කල්‍යාණ මිත්‍රත්වය',     icon: '🤝' },
  '/lifecycle':       { name: 'Life Cycle',      sinhala: 'ඔබ කවුද?',                icon: '☸️' },
  '/life':            { name: 'Blog Archive',    sinhala: 'ජීවිතයට ධර්මය',          icon: '📰' },
  '/words':           { name: 'Dhamma Words',    sinhala: 'කල්‍යාණමිත්ත පුස්තකාලය', icon: '📿' },
  '/sermons':         { name: 'Sermons',         sinhala: 'දේශනා',                   icon: '🎙️' },
  '/path':            { name: 'Noble Path',      sinhala: 'ධර්ම මාර්ගය',            icon: '🛤️' },
  '/meditation':      { name: 'Meditation',      sinhala: 'භාවනා',                   icon: '🧘' },
  '/history':         { name: 'Buddhist History',sinhala: 'බෞද්ධ ඉතිහාසය',          icon: '📜' },
  '/history/life-of-buddha': { name: 'Life of Buddha', sinhala: 'බුද්ධ චරිතය',          icon: '✨' },
  '/history/arahants':       { name: 'Arahants',       sinhala: 'අසූ මහා ශ්‍රාවකයන්',   icon: '📿' },
  '/history/sacred-relics':  { name: 'Sacred Relics',  sinhala: 'ධාතූන් වහන්සේලා',      icon: '🏛️' },
  '/history/buddhist-councils': { name: 'Buddhist Councils', sinhala: 'ධර්ම සංගායනා', icon: '🗣️' },
  '/history/sri-lanka-history': { name: 'Sri Lankan History', sinhala: 'ශ්‍රී ලංකාවේ බෞද්ධ ඉතිහාසය', icon: '🇱🇰' },
  '/history/sacred-sites':   { name: 'Sacred Sites',   sinhala: 'බෞද්ධ සිද්ධස්ථාන',     icon: '🗺️' },
  '/dharmadhana':     { name: 'Dharma Dana',     sinhala: 'ධර්ම දාන',               icon: '🙏' },
  '/other-chantings': { name: 'Chantings',       sinhala: 'පිරිත්',                  icon: '🔔' },
  '/profile':         { name: 'Profile',         sinhala: 'පැතිකඩ',                 icon: '👤' },
  '/dashboard':       { name: 'Dashboard',       sinhala: 'ඩැෂ්බෝඩ්',              icon: '📊' },
  '/login':           { name: 'Login',           sinhala: 'පිවිසීම',                 icon: '🔑' },
  '/register':        { name: 'Register',        sinhala: 'ලියාපදිංචිය',            icon: '✍️' },
  '/onboarding':      { name: 'Onboarding',      sinhala: 'ආරම්භය',                 icon: '🌱' },
};

export function getPageMeta(pathname) {
  if (PAGE_META[pathname]) return PAGE_META[pathname];
  if (pathname.startsWith('/life/')) {
    const slug = pathname.replace('/life/', '').replace(/-/g, ' ');
    return { name: slug.charAt(0).toUpperCase() + slug.slice(1), sinhala: 'ලිපිය', icon: '📄' };
  }
  if (pathname.startsWith('/library/')) return { name: 'Library Resource', sinhala: 'පුස්තකාලය', icon: '📚' };
  if (pathname.startsWith('/read/')) {
    const id = pathname.replace('/read/', '').replace(/-/g, ' ');
    return { name: id.charAt(0).toUpperCase() + id.slice(1) || 'Book Reader', sinhala: 'ග්‍රන්ථය', icon: '📖' };
  }
  return { name: pathname, sinhala: '', icon: '📄' };
}

// ── Engagement classification ────────────────────────────────
export function getEngagementLevel(activeTimeMs) {
  if (activeTimeMs < 8_000)   return 'passing';
  if (activeTimeMs < 30_000)  return 'glanced';
  if (activeTimeMs < 120_000) return 'skimming';
  if (activeTimeMs < 300_000) return 'reading';
  return 'deep';
}

// ── Intent inference from a single page visit ────────────────
// No AI — just pattern rules on the recorded data
export function inferIntent(page) {
  if (!page) return null;
  const { engagementLevel, scrollDepth, activeTime } = page;

  if (engagementLevel === 'passing') {
    if (scrollDepth < 5)  return 'Arrived and left immediately';
    if (scrollDepth < 25) return 'Glanced at the top, moved on';
    return 'Quickly browsed through';
  }
  if (engagementLevel === 'glanced') {
    if (scrollDepth < 20) return 'Peeked in, didn\'t find what they wanted';
    if (scrollDepth > 60) return 'Scrolled fast — scanning for something';
    return 'Short visit, light reading';
  }
  if (engagementLevel === 'skimming') {
    if (scrollDepth > 75) return 'Skimmed most of the page';
    return 'Read parts of it';
  }
  if (engagementLevel === 'reading') return 'Good reading session here ✨';
  if (engagementLevel === 'deep')    return 'Deep Dhamma study 🧘';
  return null;
}

// ── Journey-level pattern detection ─────────────────────────
// Detects patterns across sequences of pages in a session
export function detectJourneyPattern(pages) {
  if (pages.length < 2) return null;

  const last3 = pages.slice(-3);
  const allPassing = last3.every(p => p.engagementLevel === 'passing' || p.engagementLevel === 'glanced');
  if (allPassing && last3.length >= 2) return '🔍 Seems to be searching for something specific';

  const lastPage = pages[pages.length - 1];
  const prevPage = pages[pages.length - 2];
  if (
    (prevPage?.engagementLevel === 'passing') &&
    (lastPage?.engagementLevel === 'reading' || lastPage?.engagementLevel === 'deep')
  ) return '✨ Found what they were looking for!';

  return null;
}

// ── Format helpers ───────────────────────────────────────────
export function formatMs(ms) {
  if (!ms || ms < 500) return '< 1s';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return rs > 0 ? `${m}m ${rs}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

export function formatTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86_400_000;
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');

  if (ts >= todayStart)      return `${hh}:${mm}`;
  if (ts >= yesterdayStart)  return `Yesterday`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ── Storage operations ───────────────────────────────────────
const EMPTY_JOURNEY = () => ({ sessions: [], totalReadingTimeMs: 0, createdAt: Date.now() });

export function loadJourney() {
  try {
    const raw = localStorage.getItem(JOURNEY_KEY);
    return raw ? JSON.parse(raw) : EMPTY_JOURNEY();
  } catch { return EMPTY_JOURNEY(); }
}

export function saveJourney(journey) {
  try {
    const trimmed = { ...journey, sessions: journey.sessions.slice(-30) };
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('[DhammaTracker] localStorage save failed:', e);
  }
}

export function loadLastPosition() {
  try {
    const raw = localStorage.getItem(POSITION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveLastPosition(pos) {
  try {
    localStorage.setItem(POSITION_KEY, JSON.stringify({ ...pos, savedAt: Date.now() }));
  } catch {}
}

export function clearAllData() {
  localStorage.removeItem(JOURNEY_KEY);
  localStorage.removeItem(POSITION_KEY);
}

// ── Analytics computed views ─────────────────────────────────
export function getTodayStats(journey) {
  const todayStart = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); })();
  let totalActiveTime = 0;
  const uniquePages = new Set();

  for (const session of (journey.sessions || [])) {
    for (const page of (session.pages || [])) {
      if ((page.enteredAt || 0) >= todayStart) {
        totalActiveTime += page.activeTime || 0;
        uniquePages.add(page.url);
      }
    }
  }
  return { totalActiveTime, uniquePagesCount: uniquePages.size };
}

// Returns all page visits across all sessions, oldest first
export function getAllPages(journey) {
  return (journey.sessions || []).flatMap(s =>
    (s.pages || []).map(p => ({ ...p, sessionId: s.id }))
  );
}

// Group pages by session for timeline display
export function getSessionsWithPages(journey) {
  return (journey.sessions || [])
    .filter(s => s.pages && s.pages.length > 0)
    .slice(-10); // last 10 sessions
}

// ── Global live-stats bridge ──────────────────────────────────
// DhammaTracker (the tracking hook) writes here every 2s.
// DhammaLog (the display component) reads here — no duplicate hooks needed.
let _globalLiveStats = null;

export function setGlobalLiveStats(stats) {
  _globalLiveStats = stats;
}

export function getGlobalLiveStats() {
  return _globalLiveStats;
}
