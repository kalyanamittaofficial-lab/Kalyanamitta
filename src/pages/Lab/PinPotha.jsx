import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookHeart, Plus, Trash2, Sparkles, BookOpen, ArrowRight, History, Repeat, FileUp, X, Check } from 'lucide-react';
import {
  PIN_POTHA_TYPES,
  getPinPothaEntries,
  addPinPothaEntry,
  updatePinPothaEntry,
  deletePinPothaEntry,
  getDedications,
  getPathReflections
} from '../../services/practiceEcosystemStore';
import { getLabLang, t } from '../../services/labLangStore';
import { EasyDurationSelector } from '../../components/Lab/TimeSelectors';
import PaginationBar from '../../components/Lab/PaginationBar';

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
  const [lang, setLang] = useState(() => getLabLang());

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
    const onLang = (e) => setLang(e.detail || getLabLang());
    window.addEventListener('labPracticeUpdated', refresh);
    window.addEventListener('labLangUpdated', onLang);
    return () => {
      window.removeEventListener('labPracticeUpdated', refresh);
      window.removeEventListener('labLangUpdated', onLang);
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
        aria-label="කාල රටාව"
        value={mode}
        onChange={(e) => onModeChange(e.target.value)}
        className="km-lab-input"
        style={{ padding: '8px 10px', fontSize: '0.82rem' }}
      >
        <option value="once">එක් දිනක් / වේලාව (පැය : මිනිත්තු)</option>
        <option value="days">දින ගණනක් (දින)</option>
        <option value="weeks">සති ගණනක් (සති)</option>
        <option value="months">මාස ගණනක් (මාස)</option>
        <option value="range">දින පරාසය (අවසන් දිනය)</option>
        <option value="daily">දිනපතා</option>
        <option value="poya">පෝය දිනවල පමණි</option>
      </select>

      {mode === 'once' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap' }}>කාලය:</span>
          <EasyDurationSelector
            totalMinutes={Number(dMinutes)}
            onChange={(mins) => onMinutesChange(String(mins))}
          />
        </div>
      )}

      {mode === 'days' && (
        <select
          aria-label="දින ගණන"
          value={dCount}
          onChange={(e) => onDayCountChange(e.target.value)}
          className="km-lab-input"
          style={{ padding: '8px 10px', fontSize: '0.82rem' }}
        >
          {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
            <option key={d} value={String(d)}>දින {d}</option>
          ))}
        </select>
      )}

      {mode === 'weeks' && (
        <select
          aria-label="සති ගණන"
          value={wCount}
          onChange={(e) => onWeekCountChange(e.target.value)}
          className="km-lab-input"
          style={{ padding: '8px 10px', fontSize: '0.82rem' }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
            <option key={w} value={String(w)}>සති {w} (දින {w * 7})</option>
          ))}
        </select>
      )}

      {mode === 'months' && (
        <select
          aria-label="මාස ගණන"
          value={mCount}
          onChange={(e) => onMonthCountChange(e.target.value)}
          className="km-lab-input"
          style={{ padding: '8px 10px', fontSize: '0.82rem' }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={String(m)}>මාස {m}</option>
          ))}
        </select>
      )}

      {mode === 'range' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap' }}>අවසන් දිනය:</span>
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
    ...entries.map(e => ({ id: e.id, date: e.entryDate, kind: 'පින් පොත', title: e.title, body: e.reflection })),
    ...pathReflections.map(r => ({ id: r.id, date: (r.createdAt || '').slice(0, 10), kind: 'මාර්ග දිශානතිය', title: r.intention, body: r.observation })),
    ...dedications.map(d => ({ id: d.id, date: (d.createdAt || '').slice(0, 10), kind: 'පුණ්‍යානුමෝදනා', title: d.title, body: d.dedicationText }))
  ].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const historyTotalPages = Math.max(1, Math.ceil(historyRows.length / PIN_ITEMS_PER_PAGE));
  const safeHistoryPage = Math.min(historyPage, historyTotalPages);
  const pagedHistoryRows = historyRows.slice((safeHistoryPage - 1) * PIN_ITEMS_PER_PAGE, safeHistoryPage * PIN_ITEMS_PER_PAGE);

  const pinTabs = [
    { id: 'overview', label: t(lang, 'සමස්තය', 'Overview') },
    { id: 'amisa', label: t(lang, 'ආමිස හා දාන', 'Āmisa & Dāna') },
    { id: 'patipatti', label: t(lang, 'ප්‍රතිපත්ති', 'Paṭipatti') },
    { id: 'habits', label: t(lang, 'පුරුදු', 'Habits') },
    { id: 'dedication', label: t(lang, 'වන්දනා හා පූජා', 'Worship & Offerings') },
    { id: 'history', label: t(lang, 'ඉතිහාසය', 'History') }
  ];

  return (
    <div className="km-lab-page" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Terracotta Hero & Tab Bar */}
      <div
        style={{
          borderRadius: '14px',
          padding: '14px 18px',
          background: 'linear-gradient(135deg, #A35B3D 0%, #B86F4E 100%)',
          color: '#FAF8F5',
          boxShadow: '0 6px 20px rgba(163, 91, 61, 0.16)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 3px 0', fontFamily: 'var(--font-sinhala)' }}>
            මගේ පින් පොත ({entries.length})
          </h1>
          <div style={{ fontSize: '0.78rem', color: 'rgba(250, 248, 245, 0.88)', fontFamily: 'var(--font-sinhala)' }}>
            පෞද්ගලික කුසල සටහන්, බුද්ධ පූජා සහ දහම් අධ්‍යයන සටහන්
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.16)', borderRadius: '9px', padding: '3px', gap: '3px', flexWrap: 'wrap' }}>
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
                    padding: '5px 10px',
                    borderRadius: '7px',
                    border: 'none',
                    background: active ? '#FAF8F5' : 'transparent',
                    color: active ? '#231F1B' : '#FAF8F5',
                    fontSize: '0.75rem',
                    fontWeight: active ? '700' : '600',
                    fontFamily: 'var(--font-sinhala)',
                    cursor: 'pointer'
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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 11px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.28)',
              background: 'rgba(255,255,255,0.14)',
              color: '#FAF8F5',
              fontSize: '0.75rem',
              fontWeight: '600',
              fontFamily: 'var(--font-sinhala)',
              cursor: 'pointer'
            }}
          >
            <FileUp size={13} />
            <span>පෙළෙන් එක් කරන්න</span>
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <div className="km-lab-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={17} color="#A35B3D" />
            <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>
              කාලානුක්‍රමික ආවර්ජන ඉතිහාසය ({historyRows.length})
            </h2>
          </div>
          {historyRows.length === 0 ? (
            <p style={{ color: 'var(--lab-text-muted)', fontSize: '0.84rem', margin: 0 }}>
              තවමත් ආවර්ජන ඉතිහාසයක් නොමැත.
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pagedHistoryRows.map(row => (
                  <div key={row.id} style={{ padding: '10px 14px', borderRadius: '9px', background: 'var(--lab-bg-subtle)', border: '1px solid var(--lab-border)', borderLeft: '3px solid #5F6E43' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--lab-text-muted)', marginBottom: '3px' }}>
                      <span style={{ fontWeight: '700', color: '#5F6E43' }}>{row.kind}</span>
                      <span style={{ fontFamily: 'monospace' }}>{row.date}</span>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem', marginBottom: '2px' }}>{row.title}</div>
                    {row.body && <div style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', lineHeight: 1.45 }}>{row.body}</div>}
                  </div>
                ))}
              </div>
              <PaginationBar page={safeHistoryPage} totalPages={historyTotalPages} onPageChange={setHistoryPage} compact />
            </>
          )}
        </div>
      ) : (
      <>
      {activeTab === 'dedication' && (
        <div className="km-lab-card" style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--lab-text-muted)' }}>
            <Repeat size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            පූර්ණ පුණ්‍යානුමෝදනා සහ ධර්ම දාන කළමනාකරණය සඳහා:
          </div>
          <button className="km-lab-btn-primary" onClick={() => navigate('/lab/dedication')} style={{ padding: '6px 12px', fontSize: '0.76rem' }}>
            <Sparkles size={13} />
            <span>පුණ්‍යානුමෝදනා පිටුවට</span>
          </button>
        </div>
      )}

      <div className="km-lab-routine-grid">
        {/* Left: New Pin Potha Entry Form */}
        <form onSubmit={handleSubmit} className="km-lab-card" style={{ padding: '16px 18px' }}>
          <h2 style={{ fontSize: '0.98rem', fontWeight: '700', margin: '0 0 12px 0', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)' }}>
            නව කුසල සටහනක් එක් කරන්න
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 136px', gap: '8px' }}>
              <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value)}
                className="km-lab-input"
                style={{ padding: '8px 10px', fontSize: '0.82rem' }}
              >
                {Object.values(PIN_POTHA_TYPES).map(tp => (
                  <option key={tp.id} value={tp.id}>{tp.sinhala}</option>
                ))}
              </select>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="km-lab-input"
                style={{ padding: '8px 8px', fontSize: '0.8rem' }}
              />
            </div>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="උදා: දන් දීම / බුද්ධ පූජාව"
              className="km-lab-input"
              style={{ padding: '8px 11px', fontSize: '0.84rem', fontFamily: 'var(--font-sinhala)' }}
            />

            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="සිතේ ඇති වූ පැහැදීම හා ප්‍රතිපදා නිරීක්ෂණය..."
              className="km-lab-input"
              style={{ padding: '8px 11px', fontSize: '0.84rem', fontFamily: 'var(--font-sinhala)', resize: 'vertical' }}
            />

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

            <input
              type="text"
              value={linkedSuttaKey}
              onChange={(e) => setLinkedSuttaKey(e.target.value)}
              placeholder="සම්බන්ධ සූත්‍ර කේතය (විකල්ප)"
              className="km-lab-input"
              style={{ padding: '8px 11px', fontSize: '0.8rem' }}
            />

            <button
              type="submit"
              className="km-lab-btn-primary"
              style={{ justifyContent: 'center', padding: '9px', borderRadius: '10px', fontSize: '0.84rem' }}
            >
              <Plus size={15} />
              <span>පින් පොතේ සුරකින්න</span>
            </button>
          </div>
        </form>

        {/* Right: Pin Potha Entries Feed */}
        <div className="km-lab-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setFilterType('all');
                setPinPage(1);
              }}
              className={filterType === 'all' ? 'km-lab-btn-primary' : 'km-lab-btn'}
              style={{ padding: '4px 10px', fontSize: '0.73rem' }}
            >
              සියල්ල ({entries.length})
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
                  className={active ? 'km-lab-btn-primary' : 'km-lab-btn'}
                  style={{ padding: '4px 10px', fontSize: '0.73rem', gap: '5px' }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: active ? '#FAF8F5' : tp.color }} />
                  <span>{tp.sinhala}</span>
                </button>
              );
            })}
          </div>

          {pagedPinEntries.length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)', background: 'var(--lab-bg-subtle)', borderRadius: '10px' }}>
              <BookHeart size={24} style={{ opacity: 0.45, marginBottom: '6px' }} />
              <div style={{ fontSize: '0.84rem' }}>තවමත් පින් පොතේ සටහන් නොමැත.</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pagedPinEntries.map(item => {
                  const typeCfg = PIN_POTHA_TYPES[item.entryType] || PIN_POTHA_TYPES.sila;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setEditingEntry({
                        id: item.id,
                        entryType: item.entryType || 'sila',
                        entryDate: item.entryDate || new Date().toISOString().slice(0, 10),
                        title: item.title || '',
                        reflection: item.reflection || '',
                        durationMinutes: String(item.durationMinutes || 30),
                        linkedSuttaKey: item.linkedSuttaKey || '',
                        ...deriveTimeModeState(item)
                      })}
                      className="km-lab-card-interactive"
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'var(--lab-bg-subtle)',
                        border: '1px solid var(--lab-border)',
                        borderLeft: `4px solid ${typeCfg.color}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: typeCfg.color, background: `${typeCfg.color}18`, padding: '2px 8px', borderRadius: '999px' }}>
                            {typeCfg.sinhala}
                          </span>
                          {item.scheduleType && item.scheduleType !== 'once' && (
                            <span className="km-lab-tag">
                              {item.scheduleType === 'daily' && 'දිනපතා'}
                              {item.scheduleType === 'poya' && 'පෝය දින'}
                              {item.scheduleType === 'range' && (item.endDate ? `${item.entryDate} → ${item.endDate}` : `දින ${item.durationDays || 7}`)}
                            </span>
                          )}
                          <span style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)', fontFamily: 'monospace' }}>
                            {item.entryDate}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePinPothaEntry(item.id);
                          }}
                          style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '2px' }}
                          title="ඉවත් කරන්න"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div style={{
                        fontWeight: '700',
                        fontSize: '0.89rem',
                        color: 'var(--lab-text)',
                        fontFamily: 'var(--font-sinhala)',
                        marginBottom: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.title}
                      </div>
                      {item.reflection && (
                        <p style={{
                          fontSize: '0.77rem',
                          color: 'var(--lab-text-muted)',
                          margin: '0 0 6px 0',
                          lineHeight: 1.4,
                          fontFamily: 'var(--font-sinhala)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.reflection}
                        </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.73rem' }}>
                        {item.linkedSuttaKey && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/lab/sutta/${item.linkedSuttaKey}`);
                            }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: 'transparent', color: 'var(--lab-accent)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                          >
                            <BookOpen size={12} />
                            <span>{item.linkedSuttaKey}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/lab/dedication?pinId=${encodeURIComponent(item.id)}&title=${encodeURIComponent(item.title)}`);
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: 'transparent', color: '#A35B3D', fontWeight: '700', cursor: 'pointer', padding: 0, marginLeft: 'auto' }}
                        >
                          <Sparkles size={12} />
                          <span>පුණ්‍යානුමෝදනා (පත්තිදාන)</span>
                          <ArrowRight size={11} />
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
      </>
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
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>සටහන බලන්න සහ සංස්කරණය කරන්න</h3>
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
                    <option key={tp.id} value={tp.id}>{tp.sinhala}</option>
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
                value={editingEntry.title}
                onChange={(e) => setEditingEntry(prev => ({ ...prev, title: e.target.value }))}
                placeholder="මාතෘකාව"
              />

              <textarea
                rows={7}
                className="km-lab-input"
                style={{ fontFamily: 'var(--font-sinhala)', resize: 'vertical', lineHeight: 1.55 }}
                value={editingEntry.reflection}
                onChange={(e) => setEditingEntry(prev => ({ ...prev, reflection: e.target.value }))}
                placeholder="විස්තරය"
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
                placeholder="සම්බන්ධ සූත්‍ර කේතය (විකල්ප)"
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
                  <Trash2 size={13} /> ඉවත් කරන්න
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setEditingEntry(null)} className="km-lab-btn">
                    වසන්න
                  </button>
                  <button type="submit" className="km-lab-btn-primary">
                    <Check size={14} /> සුරකින්න
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
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>සටහන් එකවර එක් කරන්න</h3>
                </div>
                <button type="button" onClick={() => setShowBulkModal(false)} className="km-lab-btn" style={{ padding: '4px 8px' }}>
                  <X size={15} />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', lineHeight: 1.5 }}>
                ඔබගේ සියලුම සටහන් මෙහි Paste කරන්න. <code>11/04/2026</code> වැනි දින සහිත සටහන් ස්වයංක්‍රීයව එම දිනයටත්, දිනය නොමැති ඡේද පහත තෝරන දිනයටත් වෙන් වෙන් වශයෙන් සුරැකේ.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '10px' }}>
                <select
                  className="km-lab-input"
                  value={bulkType}
                  onChange={(e) => setBulkType(e.target.value)}
                >
                  {Object.values(PIN_POTHA_TYPES).map(tp => (
                    <option key={tp.id} value={tp.id}>{tp.sinhala}</option>
                  ))}
                </select>
                <input
                  type="date"
                  className="km-lab-input"
                  value={bulkDefaultDate}
                  onChange={(e) => setBulkDefaultDate(e.target.value)}
                  title="දිනය නොමැති සටහන් සඳහා දිනය"
                />
              </div>

              <textarea
                rows={8}
                className="km-lab-input"
                style={{ fontFamily: 'var(--font-sinhala)', resize: 'vertical', lineHeight: 1.5 }}
                placeholder="මෙහි ඔබේ පින්කම් සටහන් Paste කරන්න..."
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--lab-border)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--lab-accent)' }}>
                  හඳුනාගත් සටහන්: {parsedEntries.length}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setShowBulkModal(false)} className="km-lab-btn">
                    අවලංගු
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
                    <Plus size={14} /> සියල්ල සුරකින්න ({parsedEntries.length})
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
