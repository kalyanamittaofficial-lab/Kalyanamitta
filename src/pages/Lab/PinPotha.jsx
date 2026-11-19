import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookHeart, Plus, Trash2, Sparkles, BookOpen, ArrowRight, History, Repeat } from 'lucide-react';
import {
  PIN_POTHA_TYPES,
  EIGHTFOLD_FACTORS,
  getPinPothaEntries,
  addPinPothaEntry,
  deletePinPothaEntry,
  getDedications,
  getPathReflections
} from '../../services/practiceEcosystemStore';
import { getLabLang, t } from '../../services/labLangStore';
import { EasyDurationSelector } from '../../components/Lab/TimeSelectors';
import PaginationBar from '../../components/Lab/PaginationBar';

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

  const [entryType, setEntryType] = useState('dana');
  const [cittaType, setCittaType] = useState('kusala'); // 'kusala' | 'akusala'
  const [scheduleType, setScheduleType] = useState('once'); // 'once' | 'daily' | 'poya' | 'range'
  const [durationDays, setDurationDays] = useState('7');
  const [endDate, setEndDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [title, setTitle] = useState(() => searchParams.get('title') || '');
  const [reflection, setReflection] = useState('');
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [linkedPathFactor, setLinkedPathFactor] = useState(() => searchParams.get('factor') || '');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addPinPothaEntry({
      entryType,
      cittaType,
      scheduleType,
      durationDays: scheduleType === 'range' ? Number(durationDays || 7) : null,
      endDate: scheduleType === 'range' && endDate ? endDate : null,
      durationMinutes: Number(durationMinutes || 30),
      title: title.trim(),
      reflection: reflection.trim(),
      entryDate,
      linkedPathFactor: linkedPathFactor || null,
      linkedSuttaKey: linkedSuttaKey.trim() || null
    });
    setTitle('');
    setReflection('');
  };

  const tabScopedEntries = entries.filter(e => {
    if (activeTab === 'amisa') return e.entryType === 'dana';
    if (activeTab === 'patipatti') return ['sila', 'bhavana', 'dhamma_study'].includes(e.entryType);
    if (activeTab === 'habits') return e.entryType === 'habit_shift';
    if (activeTab === 'dedication') return e.entryType === 'veyyavacca';
    return filterType === 'all' ? true : e.entryType === filterType;
  });

  const filtered = tabScopedEntries;
  const PIN_ITEMS_PER_PAGE = 5;
  const pinTotalPages = Math.max(1, Math.ceil(filtered.length / PIN_ITEMS_PER_PAGE));
  const safePinPage = Math.min(pinPage, pinTotalPages);
  const pagedPinEntries = filtered.slice((safePinPage - 1) * PIN_ITEMS_PER_PAGE, safePinPage * PIN_ITEMS_PER_PAGE);

  const pinTabs = [
    { id: 'overview', label: t(lang, 'සමස්තය', 'Overview') },
    { id: 'amisa', label: t(lang, 'ආමිස හා දාන', 'Āmisa & Dāna') },
    { id: 'patipatti', label: t(lang, 'පටිපත්ති', 'Paṭipatti') },
    { id: 'habits', label: t(lang, 'පුරුදු හා වෙනස්කම්', 'Habits & Changes') },
    { id: 'dedication', label: t(lang, 'දායකත්ව හා අනුමෝදනා', 'Dedication & Contribution') },
    { id: 'history', label: t(lang, 'ආවර්ජන ඉතිහාසය', 'Reflection History') }
  ];

  return (
    <div className="km-lab-page">
      {/* 6 Unified Pin Potha Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {pinTabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'amisa') setEntryType('dana');
                if (tab.id === 'patipatti') setEntryType('sila');
                if (tab.id === 'habits') setEntryType('habit_shift');
                if (tab.id === 'dedication') setEntryType('veyyavacca');
              }}
              className={active ? 'km-lab-btn-primary' : 'km-lab-btn'}
              style={{ borderRadius: '999px', padding: '7px 14px', fontSize: '0.82rem' }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'history' ? (
        <div className="km-lab-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <History size={18} color="var(--lab-accent)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>
              {t(lang, 'කාලානුක්‍රමික ආවර්ජන ඉතිහාසය', 'Chronological Reflection History')}
            </h2>
          </div>
          {entries.length === 0 && pathReflections.length === 0 && dedications.length === 0 ? (
            <p style={{ color: 'var(--lab-text-muted)', fontSize: '0.86rem', margin: 0 }}>
              {t(lang, 'තවමත් ආවර්ජන ඉතිහාසයක් නොමැත.', 'No recorded reflections yet.')}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[...entries.map(e => ({ id: e.id, date: e.entryDate, kind: 'Pin Potha', title: e.title, body: e.reflection })),
                ...pathReflections.map(r => ({ id: r.id, date: (r.createdAt || '').slice(0, 10), kind: 'Path Compass', title: r.intention, body: r.observation })),
                ...dedications.map(d => ({ id: d.id, date: (d.createdAt || '').slice(0, 10), kind: 'Dedication', title: d.title, body: d.dedicationText }))
              ]
                .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
                .map(row => (
                  <div key={row.id} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--lab-bg-subtle)', border: '1px solid var(--lab-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--lab-accent)' }}>{row.kind}</span>
                      <span style={{ fontFamily: 'monospace' }}>{row.date}</span>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '2px' }}>{row.title}</div>
                    {row.body && <div style={{ fontSize: '0.83rem', color: 'var(--lab-text-muted)' }}>{row.body}</div>}
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
      <>
      {activeTab === 'dedication' && (
        <div className="km-lab-card" style={{ padding: '14px 18px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.86rem', color: 'var(--lab-text-muted)' }}>
            <Repeat size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            {t(lang, 'පූර්ණ පුණ්‍යානුමෝදනා සහ ධර්ම දාන කළමනාකරණය සඳහා:', 'For full Pattidāna & Dhamma Sharing records:')}
          </div>
          <button className="km-lab-btn-primary" onClick={() => navigate('/lab/dedication')} style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
            <Sparkles size={13} />
            <span>{t(lang, 'පුණ්‍යානුමෝදනා පිටුවට', 'Open Dedication Studio')}</span>
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', alignItems: 'start' }}>
        {/* New Pin Potha Entry Form */}
        <form onSubmit={handleSubmit} className="km-lab-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 14px 0', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)' }}>
            නව කුසල සටහනක් එක් කරන්න
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px' }}>
              <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value)}
                style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.85rem' }}
              >
                {Object.values(PIN_POTHA_TYPES).map(t => (
                  <option key={t.id} value={t.id}>{t.sinhala}</option>
                ))}
              </select>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                style={{ padding: '9px 10px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.84rem' }}
              />
            </div>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="උදා: දන් දීම / කෝපය පාලනය කර ගැනීම"
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.88rem', fontFamily: 'var(--font-sinhala)' }}
            />

            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="සිතේ ඇති වූ පැහැදීම හා ප්‍රතිපදා නිරීක්ෂණය..."
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.88rem', fontFamily: 'var(--font-sinhala)', resize: 'vertical' }}
            />

            {/* Kusala / Akusala & Schedule (updates Dashboard Graph) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select
                value={cittaType}
                onChange={(e) => setCittaType(e.target.value)}
                style={{ padding: '9px 10px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.84rem' }}
              >
                <option value="kusala">කුසල චිත්ත (දහම් කටයුතු)</option>
                <option value="akusala">අකුසල චිත්ත (ප්‍රමාද)</option>
              </select>

              <select
                value={scheduleType}
                onChange={(e) => setScheduleType(e.target.value)}
                style={{ padding: '9px 10px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.84rem' }}
              >
                <option value="once">එක් දිනක් පමණි</option>
                <option value="daily">දිනපතා (Daily)</option>
                <option value="poya">පෝය දිනවල පමණි</option>
                <option value="range">කාල සීමාවක් / දින ගණනක්</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap' }}>කාලය:</span>
              <EasyDurationSelector
                totalMinutes={Number(durationMinutes)}
                onChange={(mins) => setDurationMinutes(String(mins))}
              />
            </div>

            {scheduleType === 'range' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  style={{ padding: '9px 10px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.84rem' }}
                >
                  {[
                    { v: '3', label: 'දින 3' },
                    { v: '7', label: 'දින 7 (සතියක්)' },
                    { v: '14', label: 'දින 14 (සති 2)' },
                    { v: '21', label: 'දින 21' },
                    { v: '30', label: 'දින 30 (මාසයක්)' },
                    { v: '60', label: 'දින 60 (මාස 2)' },
                    { v: '90', label: 'දින 90 (මාස 3)' }
                  ].map(opt => (
                    <option key={opt.v} value={opt.v}>{opt.label}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  title="අවසන් දිනය (විකල්ප)"
                  style={{ padding: '9px 10px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.84rem' }}
                />
              </div>
            )}

            <select
              value={linkedPathFactor}
              onChange={(e) => setLinkedPathFactor(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.84rem' }}
            >
              <option value="">— මාර්ග අංගයක් සම්බන්ධ කරන්න (විකල්ප) —</option>
              {EIGHTFOLD_FACTORS.map(f => (
                <option key={f.id} value={f.id}>{f.sinhala} ({f.pali})</option>
              ))}
            </select>

            <input
              type="text"
              value={linkedSuttaKey}
              onChange={(e) => setLinkedSuttaKey(e.target.value)}
              placeholder="සම්බන්ධිත සූත්‍ර අංකය (විකල්ප)"
              style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.84rem' }}
            />

            <button
              type="submit"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#059669', color: '#fff', fontWeight: '600', fontSize: '0.86rem', cursor: 'pointer' }}
            >
              <Plus size={15} />
              <span>පෞද්ගලික පින් පොතට සුරකින්න</span>
            </button>
          </div>
        </form>

        {/* Entries List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterType('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                border: `1px solid ${filterType === 'all' ? 'var(--lab-accent)' : 'var(--lab-border)'}`,
                background: filterType === 'all' ? 'var(--lab-accent-soft)' : 'var(--lab-bg-elevated)',
                color: filterType === 'all' ? 'var(--lab-accent)' : 'var(--lab-text-muted)',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              සියල්ල ({entries.length})
            </button>
            {Object.values(PIN_POTHA_TYPES).map(t => (
              <button
                key={t.id}
                onClick={() => setFilterType(t.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: `1px solid ${filterType === t.id ? t.color : 'var(--lab-border)'}`,
                  background: filterType === t.id ? `${t.color}1A` : 'var(--lab-bg-elevated)',
                  color: filterType === t.id ? t.color : 'var(--lab-text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {t.sinhala}
              </button>
            ))}
          </div>

          {pagedPinEntries.length === 0 ? (
            <div className="km-lab-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
              <BookHeart size={28} style={{ opacity: 0.4, marginBottom: '8px' }} />
              <div>තවමත් පින් පොතේ සටහන් නොමැත.</div>
            </div>
          ) : (
            <>
              {pagedPinEntries.map(item => {
              const typeCfg = PIN_POTHA_TYPES[item.entryType] || PIN_POTHA_TYPES.sila;
              const factorCfg = EIGHTFOLD_FACTORS.find(f => f.id === item.linkedPathFactor);
              return (
                <div key={item.id} className="km-lab-card" style={{ padding: '16px 18px', borderLeft: `4px solid ${typeCfg.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: typeCfg.color, background: `${typeCfg.color}18`, padding: '2px 8px', borderRadius: '999px' }}>
                        {typeCfg.sinhala}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: item.cittaType === 'akusala' ? '#E11D48' : '#059669', background: item.cittaType === 'akusala' ? 'rgba(225,29,72,0.1)' : 'rgba(5,150,105,0.1)', padding: '2px 7px', borderRadius: '999px' }}>
                        {item.cittaType === 'akusala' ? 'අකුසල' : 'කුසල'}
                      </span>
                      {item.scheduleType && item.scheduleType !== 'once' && (
                        <span className="km-lab-tag">
                          {item.scheduleType === 'daily' && 'දිනපතා'}
                          {item.scheduleType === 'poya' && 'පෝය දින'}
                          {item.scheduleType === 'range' && (item.endDate ? `${item.entryDate} → ${item.endDate}` : `දින ${item.durationDays || 7}`)}
                        </span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: 'var(--lab-text-muted)', fontFamily: 'monospace' }}>
                        {item.entryDate}
                      </span>
                    </div>
                    <button onClick={() => deletePinPothaEntry(item.id)} style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer' }} title="Delete entry">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ fontWeight: '700', fontSize: '0.96rem', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)', marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  {item.reflection && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--lab-text-muted)', margin: '0 0 10px 0', lineHeight: 1.6, fontFamily: 'var(--font-sinhala)' }}>
                      {item.reflection}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.76rem' }}>
                    {factorCfg && (
                      <span style={{ color: factorCfg.color, fontWeight: '600' }}>
                        Path: {factorCfg.pali}
                      </span>
                    )}
                    {item.linkedSuttaKey && (
                      <button
                        onClick={() => navigate(`/lab/sutta/${item.linkedSuttaKey}`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: 'transparent', color: 'var(--lab-accent)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                      >
                        <BookOpen size={12} />
                        <span>{item.linkedSuttaKey}</span>
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/lab/dedication?pinId=${encodeURIComponent(item.id)}&title=${encodeURIComponent(item.title)}`)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: 'transparent', color: '#D97706', fontWeight: '700', cursor: 'pointer', padding: 0, marginLeft: 'auto' }}
                    >
                      <Sparkles size={12} />
                      <span>Dedicate Merit (පත්තිදාන)</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
              <PaginationBar
                page={safePinPage}
                totalPages={pinTotalPages}
                onPageChange={setPinPage}
              />
            </>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
