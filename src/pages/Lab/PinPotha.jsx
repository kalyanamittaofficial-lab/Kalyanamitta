import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookHeart,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  History,
  Repeat,
  FileUp,
  X,
  Check,
  Layers,
  Calendar,
  Tag,
  Flame,
  Pencil,
  Link2,
  Clock
} from 'lucide-react';
import {
  PIN_POTHA_TYPES,
  getPinPothaEntries,
  addPinPothaEntry,
  updatePinPothaEntry,
  deletePinPothaEntry,
  getDedications,
  getPathReflections
} from '../../services/practiceEcosystemStore';
import { EasyDurationSelector } from '../../components/Lab/TimeSelectors';
import PaginationBar from '../../components/Lab/PaginationBar';
import { addIntention } from '../../services/lifeActivityStore';

function parseBulkPinPothaText(rawText, fallbackDate) {
  const text = String(rawText || '').trim();
  if (!text) return [];

  const dateLineRegex = /^(?:(\d{1,2})\/(\d{1,2})\/(\d{4})|(\d{4})-(\d{2})-(\d{2}))$/;
  const lines = text.split(/\r?\n/);

  const blocks = [];
  let currentDate = null;
  let buffer = [];

  const flushBuffer = () => {
    const joined = buffer.join('\n').trim();
    if (!joined) {
      buffer = [];
      return;
    }
    if (currentDate) {
      blocks.push({ date: currentDate, body: joined });
    } else {
      const paras = joined.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean);
      for (const p of paras) {
        blocks.push({ date: fallbackDate, body: p });
      }
    }
    buffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(dateLineRegex);
    if (match) {
      flushBuffer();
      if (match[1] && match[2] && match[3]) {
        currentDate = `${match[3]}-${String(match[1]).padStart(2, '0')}-${String(match[2]).padStart(2, '0')}`;
      } else if (match[4] && match[5] && match[6]) {
        currentDate = `${match[4]}-${match[5]}-${match[6]}`;
      }
    } else {
      buffer.push(line);
    }
  }
  flushBuffer();

  return blocks.map(b => {
    const firstLine = b.body.split('\n')[0].trim();
    const firstSentence = firstLine.split(/[.|。]/)[0].trim();
    const rawTitle = firstSentence || firstLine;
    const title = rawTitle.length > 68 ? `${rawTitle.slice(0, 65)}...` : rawTitle;
    return {
      entryDate: b.date,
      title,
      reflection: b.body
    };
  });
}

export default function PinPotha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'amisa' | 'patipatti' | 'habits' | 'dedication' | 'history'
  const [entries, setEntries] = useState(() => getPinPothaEntries());
  const [dedications, setDedications] = useState(() => getDedications());
  const [pathReflections, setPathReflections] = useState(() => getPathReflections());
  const [filterType, setFilterType] = useState('all');
  const [pinPage, setPinPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  // Bulk import modal state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkType, setBulkType] = useState('sila');
  const [bulkDefaultDate, setBulkDefaultDate] = useState(() => new Date().toISOString().slice(0, 10));

  // View & Edit entry modal state
  const [editingEntry, setEditingEntry] = useState(null);

  const [entryType, setEntryType] = useState('dana');
  const [timeMode, setTimeMode] = useState('once'); // 'once' | 'daily' | 'poya' | 'days' | 'weeks' | 'months' | 'range'
  const [dayCount, setDayCount] = useState('3');
  const [weekCount, setWeekCount] = useState('1');
  const [monthCount, setMonthCount] = useState('1');
  const [endDate, setEndDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [title, setTitle] = useState(() => searchParams.get('title') || '');
  const [reflection, setReflection] = useState('');
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [linkedSuttaKey, setLinkedSuttaKey] = useState(() => searchParams.get('sutta') || '');

  useEffect(() => {
    const refresh = () => {
      setEntries(getPinPothaEntries());
      setDedications(getDedications());
      setPathReflections(getPathReflections());
    };
    window.addEventListener('labPracticeUpdated', refresh);
    return () => {
      window.removeEventListener('labPracticeUpdated', refresh);
    };
  }, []);

  const deriveTimeModeState = (item) => {
    const sched = item.scheduleType || 'once';
    const dDays = Number(item.durationDays || 0);
    if (sched === 'daily' || sched === 'poya' || sched === 'once') {
      return { timeMode: sched, dayCount: '3', weekCount: '1', monthCount: '1', endDate: '' };
    }
    if (dDays > 0 && dDays % 30 === 0 && dDays / 30 <= 12) {
      return { timeMode: 'months', dayCount: '3', weekCount: '1', monthCount: String(dDays / 30), endDate: '' };
    }
    if (dDays > 0 && dDays % 7 === 0 && dDays / 7 <= 12) {
      return { timeMode: 'weeks', dayCount: '3', weekCount: String(dDays / 7), monthCount: '1', endDate: '' };
    }
    if (dDays > 0 && dDays <= 30) {
      return { timeMode: 'days', dayCount: String(dDays), weekCount: '1', monthCount: '1', endDate: '' };
    }
    return { timeMode: 'range', dayCount: '3', weekCount: '1', monthCount: '1', endDate: item.endDate || '' };
  };

  const resolveSchedulePayload = ({ mode, dCount, wCount, mCount, eDate, dMinutes }) => {
    const isMultiRange = ['days', 'weeks', 'months', 'range'].includes(mode);
    const resolvedScheduleType = isMultiRange ? 'range' : mode;
    let resolvedDays = null;
    if (mode === 'days') resolvedDays = Number(dCount || 1);
    else if (mode === 'weeks') resolvedDays = Number(wCount || 1) * 7;
    else if (mode === 'months') resolvedDays = Number(mCount || 1) * 30;
    return {
      scheduleType: resolvedScheduleType,
      durationDays: resolvedDays,
      endDate: mode === 'range' && eDate ? eDate : null,
      durationMinutes: mode === 'once' ? Number(dMinutes || 30) : 30
    };
  };

  const renderTimeModeFields = ({
    mode, onModeChange,
    dCount, onDayCountChange,
    wCount, onWeekCountChange,
    mCount, onMonthCountChange,
    eDate, onEndDateChange,
    minEndDate,
    dMinutes, onMinutesChange
  }) => (
    <>
      <select
        aria-label="Schedule pattern"
        value={mode}
        onChange={(e) => onModeChange(e.target.value)}
        className="km-lab-input"
        style={{ padding: '8px 10px', fontSize: '0.82rem' }}
      >
        <option value="once">Single Day / Duration (hrs : mins)</option>
        <option value="days">Number of Days</option>
        <option value="weeks">Number of Weeks</option>
        <option value="months">Number of Months</option>
        <option value="range">Date Range (End Date)</option>
        <option value="daily">Daily</option>
        <option value="poya">Poya Days Only</option>
      </select>

      {mode === 'once' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap' }}>Duration:</span>
          <EasyDurationSelector
            totalMinutes={Number(dMinutes)}
            onChange={(mins) => onMinutesChange(String(mins))}
          />
        </div>
      )}

      {mode === 'days' && (
        <select
          aria-label="Number of days"
          value={dCount}
          onChange={(e) => onDayCountChange(e.target.value)}
          className="km-lab-input"
          style={{ padding: '8px 10px', fontSize: '0.82rem' }}
        >
          {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
            <option key={d} value={String(d)}>{d} {d === 1 ? 'day' : 'days'}</option>
          ))}
        </select>
      )}

      {mode === 'weeks' && (
        <select
          aria-label="Number of weeks"
          value={wCount}
          onChange={(e) => onWeekCountChange(e.target.value)}
          className="km-lab-input"
          style={{ padding: '8px 10px', fontSize: '0.82rem' }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
            <option key={w} value={String(w)}>{w} {w === 1 ? 'week' : 'weeks'} ({w * 7} days)</option>
          ))}
        </select>
      )}

      {mode === 'months' && (
        <select
          aria-label="Number of months"
          value={mCount}
          onChange={(e) => onMonthCountChange(e.target.value)}
          className="km-lab-input"
          style={{ padding: '8px 10px', fontSize: '0.82rem' }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={String(m)}>{m} {m === 1 ? 'month' : 'months'}</option>
          ))}
        </select>
      )}

      {mode === 'range' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap' }}>End date:</span>
          <input
            type="date"
            required
            value={eDate}
            min={minEndDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="km-lab-input"
            style={{ flex: 1, padding: '8px 8px', fontSize: '0.8rem' }}
          />
        </div>
      )}
    </>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const schedPayload = resolveSchedulePayload({
      mode: timeMode,
      dCount: dayCount,
      wCount: weekCount,
      mCount: monthCount,
      eDate: endDate,
      dMinutes: durationMinutes
    });

    addPinPothaEntry({
      entryType,
      ...schedPayload,
      title: title.trim(),
      reflection: reflection.trim(),
      entryDate,
      linkedSuttaKey: linkedSuttaKey.trim() || null
    });
    setTitle('');
    setReflection('');
  };

  const tabScopedEntries = entries.filter(e => {
    if (activeTab === 'amisa') return e.entryType === 'dana';
    if (activeTab === 'patipatti') return ['sila', 'bhavana', 'dhamma_study'].includes(e.entryType);
    if (activeTab === 'habits') return e.entryType === 'habit_shift';
    if (activeTab === 'dedication') return e.entryType === 'buddha_vandana' || e.entryType === 'sambuddha_puja' || e.entryType === 'veyyavacca';
    return filterType === 'all' ? true : e.entryType === filterType;
  });

  const filtered = tabScopedEntries;
  const PIN_ITEMS_PER_PAGE = 5;
  const pinTotalPages = Math.max(1, Math.ceil(filtered.length / PIN_ITEMS_PER_PAGE));
  const safePinPage = Math.min(pinPage, pinTotalPages);
  const pagedPinEntries = filtered.slice((safePinPage - 1) * PIN_ITEMS_PER_PAGE, safePinPage * PIN_ITEMS_PER_PAGE);

  const historyRows = [
    ...entries.map(e => ({ id: e.id, date: e.entryDate, kind: 'Merit Book', title: e.title, body: e.reflection })),
    ...pathReflections.map(r => ({ id: r.id, date: (r.createdAt || '').slice(0, 10), kind: 'Path Compass', title: r.intention, body: r.observation })),
    ...dedications.map(d => ({ id: d.id, date: (d.createdAt || '').slice(0, 10), kind: 'Dedication', title: d.title, body: d.dedicationText }))
  ].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const historyTotalPages = Math.max(1, Math.ceil(historyRows.length / PIN_ITEMS_PER_PAGE));
  const safeHistoryPage = Math.min(historyPage, historyTotalPages);
  const pagedHistoryRows = historyRows.slice((safeHistoryPage - 1) * PIN_ITEMS_PER_PAGE, safeHistoryPage * PIN_ITEMS_PER_PAGE);

  const { thisWeekCount, weekPct, mostActiveCategory, streakDays } = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const prevWeekStart = new Date(now);
    prevWeekStart.setDate(now.getDate() - 14);
    const sevenStr = sevenDaysAgo.toISOString().slice(0, 10);
    const prevStr = prevWeekStart.toISOString().slice(0, 10);

    let weekActs = 0;
    let prevActs = 0;
    const catCounts = {};
    const dateSet = new Set();

    entries.forEach(item => {
      const d = item.entryDate || '';
      if (d) dateSet.add(d);
      if (d >= sevenStr) weekActs += 1;
      else if (d >= prevStr && d < sevenStr) prevActs += 1;
      const key = item.entryType || 'sila';
      catCounts[key] = (catCounts[key] || 0) + 1;
    });

    const topKey = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topLabel = topKey ? (PIN_POTHA_TYPES[topKey]?.label || topKey) : '—';
    const pct = prevActs > 0
      ? Math.round(((weekActs - prevActs) / prevActs) * 100)
      : (weekActs > 0 ? 100 : 0);

    // Consecutive or recent active days streak
    const sortedDates = Array.from(dateSet).sort((a, b) => b.localeCompare(a));
    let streak = 0;
    if (sortedDates.length > 0) {
      streak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevD = new Date(sortedDates[i - 1]);
        const currD = new Date(sortedDates[i]);
        const diffDays = Math.round((prevD - currD) / 86400000);
        if (diffDays === 1) streak += 1;
        else break;
      }
      // If entries exist but aren't consecutive, show active days count if > 1 only when consecutive; otherwise 1-day or total unique days
      if (streak === 1 && sortedDates.length > 1) {
        streak = sortedDates.length;
      }
    }

    return {
      thisWeekCount: weekActs,
      weekPct: pct,
      mostActiveCategory: topLabel,
      streakDays: streak
    };
  }, [entries]);

  const pinTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'amisa', label: 'Āmisa & Dāna' },
    { id: 'patipatti', label: 'Paṭipatti' },
    { id: 'habits', label: 'Habits' },
    { id: 'dedication', label: 'Worship & Offerings' },
    { id: 'history', label: 'History' }
  ];

  return (
    <div className="km-lab-page" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* PATH/OS Hero Header */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '4px 2px 2px',
        overflow: 'hidden'
      }}>
        {/* Subtle geometric decorative shapes */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          right: '140px',
          top: '-6px',
          width: '74px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(235, 224, 206, 0.55)',
          transform: 'skewX(-28deg)',
          pointerEvents: 'none'
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute',
          right: '38px',
          top: '-4px',
          width: '92px',
          height: '40px',
          borderRadius: '10px',
          background: 'rgba(198, 255, 36, 0.72)',
          transform: 'skewX(-28deg)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
          <span style={{
            width: '4px',
            height: '30px',
            borderRadius: '999px',
            background: 'var(--po-lime, #c6ff24)',
            flexShrink: 0
          }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: '900', letterSpacing: '-0.03em', margin: 0, color: 'var(--lab-text)' }}>
                My Merit Book
              </h1>
              <span style={{
                padding: '2px 9px',
                borderRadius: '999px',
                background: 'rgba(198, 255, 36, 0.45)',
                color: '#1b1d20',
                fontSize: '0.82rem',
                fontWeight: '800'
              }}>
                ({entries.length})
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: 'var(--lab-text-muted)' }}>
              Personal wholesome deeds, Buddha Pūjā, and Dhamma study journal.
            </p>
          </div>
        </div>

        {/* Tab Bar & Import Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px',
            borderRadius: '999px',
            background: 'var(--po-card-bg)',
            border: '1px solid var(--po-card-border)',
            flexWrap: 'wrap'
          }}>
            {pinTabs.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPinPage(1);
                    if (tab.id === 'amisa') setEntryType('dana');
                    if (tab.id === 'patipatti') setEntryType('sila');
                    if (tab.id === 'habits') setEntryType('habit_shift');
                    if (tab.id === 'dedication') setEntryType('buddha_vandana');
                  }}
                  style={{
                    padding: '6px 13px',
                    borderRadius: '999px',
                    border: 'none',
                    background: active ? 'var(--po-blue, #0B3BFA)' : 'transparent',
                    color: active ? '#FFFFFF' : 'var(--lab-text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: active ? '700' : '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowBulkModal(true)}
            className="km-po-card"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '999px',
              color: 'var(--lab-text)',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <FileUp size={14} />
            <span>Import from Text</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '10px'
      }}>
        <div className="km-po-card" style={{ borderRadius: '18px', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: '11px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(11, 59, 250, 0.1)', color: 'var(--po-blue, #0B3BFA)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Layers size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '1.05rem', fontWeight: '850', color: 'var(--lab-text)', lineHeight: 1.1 }}>{entries.length}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)', marginTop: '2px' }}>Total Entries</div>
          </div>
        </div>

        <div className="km-po-card" style={{ borderRadius: '18px', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: '11px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Calendar size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '850', color: 'var(--lab-text)', lineHeight: 1.1 }}>{thisWeekCount}</span>
              {weekPct !== 0 && (
                <span style={{ padding: '2px 7px', borderRadius: '999px', background: 'rgba(198, 255, 36, 0.45)', color: '#166534', fontSize: '0.68rem', fontWeight: '800' }}>
                  {weekPct > 0 ? `+${weekPct}%` : `${weekPct}%`}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)', marginTop: '2px' }}>This Week&apos;s Acts</div>
          </div>
        </div>

        <div className="km-po-card" style={{ borderRadius: '18px', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: '11px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Tag size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.92rem', fontWeight: '850', color: 'var(--lab-text)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {mostActiveCategory}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)', marginTop: '2px' }}>Most Active Category</div>
          </div>
        </div>

        <div className="km-po-card" style={{ borderRadius: '18px', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: '11px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Flame size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '1rem', fontWeight: '850', color: 'var(--lab-text)', lineHeight: 1.1 }}>{streakDays}-Day Streak</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)', marginTop: '2px' }}>Consistency</div>
          </div>
        </div>
      </div>

      {/* Dedication Strip */}
      <div className="km-po-card" style={{
        borderRadius: '14px',
        padding: '8px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--lab-text-muted)' }}>
          <Repeat size={13} color="var(--lab-text-muted)" />
          <span>For full merit dedications and Dhamma Dāna management:</span>
        </div>
        <button
          type="button"
          className="km-lab-btn-primary"
          onClick={() => navigate('/lab/dedication')}
          style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}
        >
          <Sparkles size={13} />
          <span>Dedication Page</span>
        </button>
      </div>

      {activeTab === 'history' ? (
        <div className="km-po-card" style={{ borderRadius: '22px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={16} color="var(--po-blue, #0B3BFA)" />
            <h2 style={{ fontSize: '0.96rem', fontWeight: '800', margin: 0 }}>
              Chronological Reflection History ({historyRows.length})
            </h2>
          </div>
          {historyRows.length === 0 ? (
            <p style={{ color: 'var(--lab-text-muted)', fontSize: '0.84rem', margin: 0 }}>
              No reflection history yet.
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {pagedHistoryRows.map(row => (
                  <div key={row.id} style={{ padding: '9px 12px', borderRadius: '12px', background: 'var(--po-card-subtle)', border: '1px solid var(--po-card-border)', borderLeft: '4px solid #5F6E43' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--lab-text-muted)', marginBottom: '2px' }}>
                      <span style={{ fontWeight: '700', color: '#5F6E43' }}>{row.kind}</span>
                      <span style={{ fontFamily: 'monospace' }}>{row.date}</span>
                    </div>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1rem', lineHeight: 1.4, fontFamily: 'var(--font-sinhala)' }}>
                      <span style={{ fontWeight: '700', color: 'var(--lab-text)' }}>{row.title}</span>
                      {row.body && <span style={{ fontSize: '0.92rem', color: 'var(--lab-text-muted)' }}> — {row.body}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <PaginationBar page={safeHistoryPage} totalPages={historyTotalPages} onPageChange={setHistoryPage} compact />
            </>
          )}
        </div>
      ) : (
      <div className="km-lab-routine-grid" style={{ gap: '14px', alignItems: 'start' }}>
        {/* Left: Add New Merit Entry Form */}
        <form onSubmit={handleSubmit} className="km-po-card" style={{ borderRadius: '22px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '11px', background: 'rgba(11, 59, 250, 0.1)', color: 'var(--po-blue, #0B3BFA)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Pencil size={15} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.96rem', fontWeight: '850', margin: 0, color: 'var(--lab-text)' }}>
                Add New Merit Entry
              </h2>
              <p style={{ margin: '1px 0 0 0', fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
                Record a wholesome action, offering, practice, study or reflection.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 132px', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value)}
                  className="km-lab-input"
                  style={{ padding: '7px 9px', fontSize: '0.8rem', borderRadius: '10px' }}
                >
                  {Object.values(PIN_POTHA_TYPES).map(tp => (
                    <option key={tp.id} value={tp.id}>{tp.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '4px' }}>
                  Date
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="km-lab-input"
                  style={{ padding: '7px 8px', fontSize: '0.78rem', borderRadius: '10px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '4px' }}>
                Title (optional)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Offering Dāna / Buddha Pūjā"
                className="km-lab-input"
                style={{ padding: '8px 10px', fontSize: '0.88rem', fontFamily: 'var(--font-sinhala)', borderRadius: '10px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '4px' }}>
                Reflection
              </label>
              <textarea
                rows={2}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Clarity of mind & practice reflection..."
                className="km-lab-input"
                style={{ padding: '8px 10px', fontSize: '0.86rem', fontFamily: 'var(--font-sinhala)', resize: 'vertical', borderRadius: '10px' }}
              />
            </div>

            {renderTimeModeFields({
              mode: timeMode,
              onModeChange: setTimeMode,
              dCount: dayCount,
              onDayCountChange: setDayCount,
              wCount: weekCount,
              onWeekCountChange: setWeekCount,
              mCount: monthCount,
              onMonthCountChange: setMonthCount,
              eDate: endDate,
              onEndDateChange: setEndDate,
              minEndDate: entryDate,
              dMinutes: durationMinutes,
              onMinutesChange: setDurationMinutes
            })}

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '4px' }}>
                Linked Sutta Key (optional)
              </label>
              <div style={{ position: 'relative' }}>
                <Link2 size={13} color="var(--lab-text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={linkedSuttaKey}
                  onChange={(e) => setLinkedSuttaKey(e.target.value)}
                  placeholder="e.g., Dhammacakkappavattana Sutta (SN 56.11)"
                  className="km-lab-input"
                  style={{ padding: '7px 10px 7px 30px', fontSize: '0.78rem', borderRadius: '10px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="km-lab-btn-primary"
              style={{ justifyContent: 'center', padding: '9px 12px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '700', marginTop: '2px' }}
            >
              <Plus size={15} />
              <span>Save to Merit Book</span>
            </button>
          </div>
        </form>

        {/* Right: Merit Entries Feed */}
        <div className="km-po-card" style={{ borderRadius: '22px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '11px', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '11px', background: 'var(--po-card-subtle)', color: 'var(--lab-text)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Layers size={15} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.96rem', fontWeight: '850', margin: 0, color: 'var(--lab-text)' }}>
                Merit Entries
              </h2>
              <p style={{ margin: '1px 0 0 0', fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
                Your recorded wholesome deeds, practice, study and offerings.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setFilterType('all');
                setPinPage(1);
              }}
              style={{
                padding: '4px 11px',
                borderRadius: '999px',
                border: filterType === 'all' ? '1px solid var(--po-blue, #0B3BFA)' : '1px solid var(--po-card-border)',
                background: filterType === 'all' ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-subtle)',
                color: filterType === 'all' ? '#FFFFFF' : 'var(--lab-text-muted)',
                fontSize: '0.71rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              All ({entries.length})
            </button>
            {Object.values(PIN_POTHA_TYPES).map(tp => {
              const active = filterType === tp.id;
              return (
                <button
                  key={tp.id}
                  type="button"
                  onClick={() => {
                    setFilterType(active ? 'all' : tp.id);
                    setPinPage(1);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    border: `1px solid ${active ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-border)'}`,
                    background: active ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-subtle)',
                    color: active ? '#FFFFFF' : 'var(--lab-text-muted)',
                    fontSize: '0.71rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: active ? '#FFFFFF' : tp.color }} />
                  <span>{tp.label}</span>
                </button>
              );
            })}
          </div>

          {pagedPinEntries.length === 0 ? (
            <div style={{ padding: '26px 14px', textAlign: 'center', color: 'var(--lab-text-muted)', background: 'var(--po-card-subtle)', borderRadius: '14px' }}>
              <BookHeart size={24} style={{ opacity: 0.45, marginBottom: '6px' }} />
              <div style={{ fontSize: '0.84rem' }}>No entries in your Merit Book yet.</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pagedPinEntries.map(item => {
                  const typeCfg = PIN_POTHA_TYPES[item.entryType] || PIN_POTHA_TYPES.sila;
                  const openEdit = () => setEditingEntry({
                    id: item.id,
                    entryType: item.entryType || 'sila',
                    entryDate: item.entryDate || new Date().toISOString().slice(0, 10),
                    title: item.title || '',
                    reflection: item.reflection || '',
                    durationMinutes: String(item.durationMinutes || 30),
                    linkedSuttaKey: item.linkedSuttaKey || '',
                    ...deriveTimeModeState(item)
                  });
                  return (
                    <div
                      key={item.id}
                      onClick={openEdit}
                      style={{
                        padding: '10px 13px',
                        borderRadius: '14px',
                        background: 'var(--po-card-bg)',
                        border: '1px solid var(--po-card-border)',
                        borderLeft: `4px solid ${typeCfg.color}`,
                        boxShadow: '0 2px 8px rgba(15, 17, 21, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.69rem', fontWeight: '700', color: typeCfg.color, background: `${typeCfg.color}18`, padding: '2px 8px', borderRadius: '999px' }}>
                            {typeCfg.label}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--lab-text-muted)', fontFamily: 'monospace' }}>
                            <Calendar size={11} />
                            {item.scheduleType === 'range' && item.endDate
                              ? `${item.entryDate} → ${item.endDate}`
                              : item.entryDate}
                          </span>
                          {item.scheduleType && item.scheduleType !== 'once' && item.scheduleType !== 'range' && (
                            <span className="km-lab-tag" style={{ fontSize: '0.67rem', padding: '1px 7px' }}>
                              {item.scheduleType === 'daily' ? 'Daily' : 'Poya Days'}
                            </span>
                          )}
                          {(item.durationMinutes || 30) > 0 && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--lab-text-muted)' }}>
                              <Clock size={11} />
                              {item.durationMinutes || 30} mins
                            </span>
                          )}
                          {item.linkedSuttaKey && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/lab/sutta/${item.linkedSuttaKey}`);
                              }}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', border: 'none', background: 'transparent', color: 'var(--po-blue, #0B3BFA)', fontWeight: '600', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
                            >
                              <BookOpen size={11} />
                              <span>{item.linkedSuttaKey}</span>
                            </button>
                          )}
                        </div>

                        <div style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontFamily: 'var(--font-sinhala)',
                          fontSize: '0.96rem',
                          lineHeight: 1.4
                        }}>
                          <span style={{ fontWeight: '700', color: 'var(--lab-text)' }}>{item.title}</span>
                          {item.reflection && (
                            <span style={{ fontSize: '0.9rem', color: 'var(--lab-text-muted)', fontWeight: '400' }}>
                              {' '}— {item.reflection}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addIntention({
                              title: item.title,
                              category: 'dhamma',
                              minutes: item.durationMinutes || 15,
                              sourceType: 'merit',
                              sourceId: item.id,
                              sourceTitle: 'Merit Book',
                              sourceUrl: '/lab/pin-potha',
                              excerpt: item.reflection || ''
                            });
                            navigate('/lab/daily-routine?tab=intentions');
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 10px',
                            borderRadius: '999px',
                            border: '1px solid var(--po-card-border)',
                            background: 'var(--po-card-subtle)',
                            color: 'var(--lab-text)',
                            fontWeight: '700',
                            fontSize: '0.71rem',
                            cursor: 'pointer'
                          }}
                          title="Repeat as an intention in Daily Routine"
                        >
                          <Repeat size={11} />
                          <span>Repeat</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/lab/dedication?pinId=${encodeURIComponent(item.id)}&title=${encodeURIComponent(item.title)}`);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '5px 10px',
                            borderRadius: '999px',
                            border: '1px solid rgba(11, 59, 250, 0.25)',
                            background: 'rgba(11, 59, 250, 0.06)',
                            color: 'var(--po-blue, #0B3BFA)',
                            fontWeight: '700',
                            fontSize: '0.71rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Sparkles size={11} />
                          <span>Dedicate Merit</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit();
                          }}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            border: '1px solid var(--po-card-border)',
                            background: 'var(--po-card-subtle)',
                            color: 'var(--lab-text-muted)',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer'
                          }}
                          title="Edit"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePinPothaEntry(item.id);
                          }}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            border: '1px solid var(--po-card-border)',
                            background: 'var(--po-card-subtle)',
                            color: 'var(--lab-text-muted)',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer'
                          }}
                          title="Remove"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <PaginationBar
                page={safePinPage}
                totalPages={pinTotalPages}
                onPageChange={setPinPage}
                compact
              />
            </>
          )}
        </div>
      </div>
      )}

      {/* View & Edit Entry Popup Modal */}
      {editingEntry && (
        <div
          onClick={() => setEditingEntry(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(35, 31, 27, 0.48)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="km-lab-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '88vh',
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookHeart size={17} color="var(--lab-gold)" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>View & Edit Entry</h3>
              </div>
              <button type="button" onClick={() => setEditingEntry(null)} className="km-lab-btn" style={{ padding: '4px 8px' }}>
                <X size={15} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingEntry.title.trim()) return;
                const schedPayload = resolveSchedulePayload({
                  mode: editingEntry.timeMode,
                  dCount: editingEntry.dayCount,
                  wCount: editingEntry.weekCount,
                  mCount: editingEntry.monthCount,
                  eDate: editingEntry.endDate,
                  dMinutes: editingEntry.durationMinutes
                });
                updatePinPothaEntry(editingEntry.id, {
                  entryType: editingEntry.entryType,
                  entryDate: editingEntry.entryDate,
                  title: editingEntry.title.trim(),
                  reflection: editingEntry.reflection,
                  ...schedPayload,
                  linkedSuttaKey: editingEntry.linkedSuttaKey.trim() || null
                });
                setEditingEntry(null);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 145px', gap: '8px' }}>
                <select
                  className="km-lab-input"
                  value={editingEntry.entryType}
                  onChange={(e) => setEditingEntry(prev => ({ ...prev, entryType: e.target.value }))}
                >
                  {Object.values(PIN_POTHA_TYPES).map(tp => (
                    <option key={tp.id} value={tp.id}>{tp.label}</option>
                  ))}
                </select>
                <input
                  type="date"
                  className="km-lab-input"
                  value={editingEntry.entryDate}
                  onChange={(e) => setEditingEntry(prev => ({ ...prev, entryDate: e.target.value }))}
                />
              </div>

              <input
                type="text"
                required
                className="km-lab-input"
                style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.18rem' }}
                value={editingEntry.title}
                onChange={(e) => setEditingEntry(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Title"
              />

              <textarea
                rows={7}
                className="km-lab-input"
                style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.08rem', resize: 'vertical', lineHeight: 1.55 }}
                value={editingEntry.reflection}
                onChange={(e) => setEditingEntry(prev => ({ ...prev, reflection: e.target.value }))}
                placeholder="Description / Reflection"
              />

              {renderTimeModeFields({
                mode: editingEntry.timeMode,
                onModeChange: (val) => setEditingEntry(prev => ({ ...prev, timeMode: val })),
                dCount: editingEntry.dayCount,
                onDayCountChange: (val) => setEditingEntry(prev => ({ ...prev, dayCount: val })),
                wCount: editingEntry.weekCount,
                onWeekCountChange: (val) => setEditingEntry(prev => ({ ...prev, weekCount: val })),
                mCount: editingEntry.monthCount,
                onMonthCountChange: (val) => setEditingEntry(prev => ({ ...prev, monthCount: val })),
                eDate: editingEntry.endDate,
                onEndDateChange: (val) => setEditingEntry(prev => ({ ...prev, endDate: val })),
                minEndDate: editingEntry.entryDate,
                dMinutes: editingEntry.durationMinutes,
                onMinutesChange: (val) => setEditingEntry(prev => ({ ...prev, durationMinutes: val }))
              })}

              <input
                type="text"
                className="km-lab-input"
                value={editingEntry.linkedSuttaKey}
                onChange={(e) => setEditingEntry(prev => ({ ...prev, linkedSuttaKey: e.target.value }))}
                placeholder="Linked Sutta Key (optional)"
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--lab-border)' }}>
                <button
                  type="button"
                  onClick={() => {
                    deletePinPothaEntry(editingEntry.id);
                    setEditingEntry(null);
                  }}
                  className="km-lab-btn"
                  style={{ color: '#B91C1C' }}
                >
                  <Trash2 size={13} /> Remove
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setEditingEntry(null)} className="km-lab-btn">
                    Close
                  </button>
                  <button type="submit" className="km-lab-btn-primary">
                    <Check size={14} /> Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Text Import Modal */}
      {showBulkModal && (() => {
        const parsedEntries = parseBulkPinPothaText(bulkText, bulkDefaultDate);
        return (
          <div
            onClick={() => setShowBulkModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(35, 31, 27, 0.48)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="km-lab-card"
              style={{
                width: '100%',
                maxWidth: '580px',
                maxHeight: '88vh',
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileUp size={17} color="var(--lab-gold)" />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Bulk Import Entries</h3>
                </div>
                <button type="button" onClick={() => setShowBulkModal(false)} className="km-lab-btn" style={{ padding: '4px 8px' }}>
                  <X size={15} />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', lineHeight: 1.5 }}>
                Paste all your notes here. Entries preceded by a date such as <code>11/04/2026</code> or <code>2026-04-11</code> will be saved under that date, while undated paragraphs will use the fallback date selected below.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '10px' }}>
                <select
                  className="km-lab-input"
                  value={bulkType}
                  onChange={(e) => setBulkType(e.target.value)}
                >
                  {Object.values(PIN_POTHA_TYPES).map(tp => (
                    <option key={tp.id} value={tp.id}>{tp.label}</option>
                  ))}
                </select>
                <input
                  type="date"
                  className="km-lab-input"
                  value={bulkDefaultDate}
                  onChange={(e) => setBulkDefaultDate(e.target.value)}
                  title="Fallback date for undated entries"
                />
              </div>

              <textarea
                rows={8}
                className="km-lab-input"
                style={{ fontFamily: 'var(--font-sinhala)', resize: 'vertical', lineHeight: 1.5 }}
                placeholder="Paste your merit journal entries here..."
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--lab-border)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--lab-accent)' }}>
                  Detected entries: {parsedEntries.length}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setShowBulkModal(false)} className="km-lab-btn">
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={parsedEntries.length === 0}
                    onClick={() => {
                      for (const item of parsedEntries) {
                        addPinPothaEntry({
                          entryType: bulkType,
                          scheduleType: 'once',
                          durationMinutes: 30,
                          entryDate: item.entryDate,
                          title: item.title,
                          reflection: item.reflection
                        });
                      }
                      setBulkText('');
                      setShowBulkModal(false);
                    }}
                    className="km-lab-btn-primary"
                    style={{ opacity: parsedEntries.length === 0 ? 0.5 : 1 }}
                  >
                    <Plus size={14} /> Save All ({parsedEntries.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
