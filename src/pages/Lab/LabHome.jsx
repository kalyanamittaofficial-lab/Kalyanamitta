import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings2,
  Lock,
  Hourglass,
  Target,
  Calendar,
  Flame,
  Sun,
  Clock,
  BookOpen,
  ChevronRight,
  BarChart3,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { supabase } from '../../utils/supabase';
import {
  getLifeClockConfig,
  saveLifeClockConfig,
  computeLifeClock,
  LIFE_DOB_KEY
} from '../../services/lifeClockStore';
import { getTodayKey } from '../../services/cittaLogStore';
import { getPinPothaEntries } from '../../services/practiceEcosystemStore';
import {
  getRoutineCategories,
  getRoutineHabits,
  getRoutineLogForDate,
  getRoutineCategoryBreakdown,
  getRoutineCategorySeries
} from '../../services/dailyRoutineStore';
import PaginationBar from '../../components/Lab/PaginationBar';

function formatMinutesAsHours(mins) {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `මි ${m}`;
  if (m === 0) return `පැ ${h}`;
  return `පැ ${h} මි ${m}`;
}

function buildDonutSegments(items, circumference = 2 * Math.PI * 56, fixedTotal = null) {
  const sum = items.reduce((acc, item) => acc + item.value, 0);
  const total = fixedTotal ? Math.max(fixedTotal, sum) : sum;
  if (total <= 0) return [];
  let offset = 0;
  return items
    .filter(item => item.value > 0)
    .map(item => {
      const fraction = item.value / total;
      const length = fraction * circumference;
      const gap = items.filter(x => x.value > 0).length > 1 || (fixedTotal && sum < fixedTotal) ? 2.5 : 0;
      const seg = {
        ...item,
        pct: Math.round(fraction * 100),
        dasharray: `${Math.max(0, length - gap)} ${circumference}`,
        dashoffset: -offset
      };
      offset += length;
      return seg;
    });
}

export default function LabHome() {
  const initialCfg = getLifeClockConfig();
  const [dob, setDob] = useState(initialCfg.dob);
  const [lifespan, setLifespan] = useState(initialCfg.lifespan);
  const [clockMode, setClockMode] = useState(initialCfg.mode); // 'remaining' | 'lived'
  const [showLifeConfig, setShowLifeConfig] = useState(false);
  const [clock, setClock] = useState(() => computeLifeClock(initialCfg.dob, initialCfg.lifespan, initialCfg.mode));

  const [cittaRange, setCittaRange] = useState(14); // 7 | 14 | 30 | 'all'
  const [pinEntries, setPinEntries] = useState(() => getPinPothaEntries());
  const [categories, setCategories] = useState(() => getRoutineCategories());
  const [habits, setHabits] = useState(() => getRoutineHabits());
  const [todayRoutine, setTodayRoutine] = useState(() => getRoutineLogForDate(getTodayKey()));
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [homeDonutPage, setHomeDonutPage] = useState(1);

  useEffect(() => {
    const refreshLogs = () => {
      setPinEntries(getPinPothaEntries());
      setCategories(getRoutineCategories());
      setHabits(getRoutineHabits());
      setTodayRoutine(getRoutineLogForDate(getTodayKey()));
    };
    window.addEventListener('labCittaLogsUpdated', refreshLogs);
    window.addEventListener('labPracticeUpdated', refreshLogs);
    window.addEventListener('labRoutineUpdated', refreshLogs);
    return () => {
      window.removeEventListener('labCittaLogsUpdated', refreshLogs);
      window.removeEventListener('labPracticeUpdated', refreshLogs);
      window.removeEventListener('labRoutineUpdated', refreshLogs);
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user?.id) return;
      const { data } = await supabase
        .from('profiles')
        .select('dob')
        .eq('id', session.user.id)
        .maybeSingle();
      if (data?.dob && !localStorage.getItem(LIFE_DOB_KEY)) {
        setDob(data.dob);
        saveLifeClockConfig({ dob: data.dob });
      }
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(computeLifeClock(dob, lifespan, clockMode));
    }, 1000);
    return () => clearInterval(timer);
  }, [dob, lifespan, clockMode]);

  const routineSeries = getRoutineCategorySeries(cittaRange);
  const todayKey = getTodayKey();
  const checkedRoutineCount = todayRoutine?.checkedIds?.length || 0;

  // Remaining life donut segments
  const lifeDonutItems = [
    { id: 'remaining', label: 'ඉතිරි ආයු කාලය', value: clock.remainingPct ?? 0, color: '#A35B3D' },
    { id: 'lived', label: 'ගත වූ කාලය', value: clock.livedPct ?? 0, color: '#D8C3B0' }
  ];
  const donutRadius = 56;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const lifeDonutSegments = buildDonutSegments(lifeDonutItems, donutCircumference);

  // Donut breakdown from daily routine categories out of 24 hours (1440 mins)
  const routineBreakdown = getRoutineCategoryBreakdown(todayKey);
  const routineTotalMins = routineBreakdown.items.reduce((acc, item) => acc + item.value, 0);
  const dayTotalMins = Math.max(1440, routineTotalMins);
  const donutLegendItems = routineBreakdown.items.map(item => ({
    ...item,
    pct: Math.round((item.value / dayTotalMins) * 100)
  }));

  const donutSegments = buildDonutSegments(routineBreakdown.items, donutCircumference, dayTotalMins);
  const homeDonutTotalPages = Math.max(1, Math.ceil(donutLegendItems.length / 5));
  const safeHomeDonutPage = Math.min(homeDonutPage, homeDonutTotalPages);
  const pagedHomeDonutItems = donutLegendItems.slice((safeHomeDonutPage - 1) * 5, safeHomeDonutPage * 5);

  // Stacked Bar Chart dimensions (hours per day across routine categories)
  const chartW = 700;
  const chartH = 148;
  const padX = 34;
  const padY = 18;
  const maxDayHours = Math.max(2, ...routineSeries.map(d => (d.totalMinutes || 0) / 60));
  const slotWidth = (chartW - padX * 2) / Math.max(routineSeries.length, 1);
  const barWidth = Math.max(8, Math.min(24, Math.floor(slotWidth * 0.56)));
  const getBarX = (idx) => padX + idx * slotWidth + (slotWidth - barWidth) / 2;
  const getHeightFromMins = (mins) => (((mins || 0) / 60) / maxDayHours) * (chartH - padY * 2);

  return (
    <div
      className="km-lab-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* TOP HERO ROW: Title (Left) + Remaining Life Donut (Center) + Routine Balance Donut (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px',
        alignItems: 'stretch'
      }}>
        {/* Left Hero Title */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', padding: '4px 2px' }}>
          <h1 style={{
            fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)',
            fontWeight: '800',
            color: 'var(--lab-text)',
            fontFamily: 'var(--font-sinhala)',
            lineHeight: 1.22,
            margin: 0
          }}>
            දුල්ලභෝ මනුස්ස පටිලාභෝ
          </h1>
          <div style={{
            borderLeft: '3px solid var(--lab-gold)',
            paddingLeft: '10px',
            fontSize: '0.82rem',
            color: 'var(--lab-text-muted)',
            lineHeight: 1.45,
            fontFamily: 'var(--font-sinhala)'
          }}>
            මිනිසත් බව ලැබීම දුර්ලභය · ගෙවී යන සෑම තත්පරයක්ම කුසල ධර්මයන් වැඩීමට යොදවන්න.
          </div>
        </div>

        {/* Remaining Life Percentage Donut Card */}
        <div
          className="km-lab-card"
          style={{
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ position: 'relative', width: '112px', height: '112px', flexShrink: 0, margin: '0 auto' }}>
            <svg viewBox="0 0 144 144" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle
                cx="72"
                cy="72"
                r={donutRadius}
                fill="none"
                stroke="var(--lab-bg-subtle)"
                strokeWidth="16"
              />
              {lifeDonutSegments.map(seg => (
                <circle
                  key={seg.id}
                  cx="72"
                  cy="72"
                  r={donutRadius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="16"
                  strokeDasharray={seg.dasharray}
                  strokeDashoffset={seg.dashoffset}
                  strokeLinecap="butt"
                />
              ))}
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '12px'
            }}>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--lab-text)', lineHeight: 1.1 }}>
                {clock.remainingPct ?? 0}%
              </span>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '140px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--lab-text)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Hourglass size={13} color="var(--lab-gold)" /> ආයු කාල ප්‍රතිශතය
            </div>
            {lifeDonutItems.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.73rem',
                  gap: '8px'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--lab-text)' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <span>{item.label}</span>
                </span>
                <span style={{ fontWeight: '700', color: 'var(--lab-text)', fontVariantNumeric: 'tabular-nums' }}>
                  {item.value}%
                </span>
              </div>
            ))}
            <div style={{ fontSize: '0.68rem', color: 'var(--lab-text-muted)', paddingTop: '2px', borderTop: '1px solid var(--lab-border)' }}>
              අපේක්ෂිත ආයු: වසර {lifespan}
            </div>
          </div>
        </div>

        {/* Right Donut Chart Card */}
        <div
          className="km-lab-card"
          style={{
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap'
          }}
        >
          {/* SVG Donut */}
          <div style={{ position: 'relative', width: '118px', height: '118px', flexShrink: 0, margin: '0 auto' }}>
            <svg viewBox="0 0 144 144" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle
                cx="72"
                cy="72"
                r={donutRadius}
                fill="none"
                stroke="var(--lab-bg-subtle)"
                strokeWidth="16"
              />
              {donutSegments.map(seg => (
                <circle
                  key={seg.id}
                  cx="72"
                  cy="72"
                  r={donutRadius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="16"
                  strokeDasharray={seg.dasharray}
                  strokeDashoffset={seg.dashoffset}
                  strokeLinecap="butt"
                />
              ))}
            </svg>
          </div>

          {/* Donut Legend */}
          <div style={{ flex: 1, minWidth: '185px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--lab-text)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Target size={13} color="var(--lab-gold)" /> දින චර්යා සමතුලිතතාවය (පැය 24)
              </span>
            </div>
            {pagedHomeDonutItems.map(seg => (
              <div
                key={seg.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.73rem',
                  gap: '8px'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'var(--lab-text)' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                  <span>{seg.label}</span>
                </span>
                <span style={{ fontWeight: '700', color: 'var(--lab-text)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                  {formatMinutesAsHours(seg.value)} ({seg.pct}%)
                </span>
              </div>
            ))}
            <PaginationBar
              page={safeHomeDonutPage}
              totalPages={homeDonutTotalPages}
              onPageChange={setHomeDonutPage}
              compact
            />
          </div>
        </div>
      </div>

      {/* MIDDLE FULL-WIDTH LIFE CLOCK BANNER */}
      <div
        style={{
          borderRadius: '14px',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #A35B3D 0%, #B86F4E 100%)',
          color: '#FAF8F5',
          boxShadow: '0 6px 18px rgba(163, 91, 61, 0.16)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          alignItems: 'center'
        }}>
          {/* Banner Left Info + Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FAF8F5',
                flexShrink: 0
              }}>
                <Hourglass size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: '700', lineHeight: 1.3 }}>
                  {clockMode === 'remaining' ? 'අපේක්ෂිත ඉතිරි ආයු කාලය' : 'මේ දක්වා ගත වූ ආයු කාලය'}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'rgba(250, 247, 240, 0.78)', lineHeight: 1.45 }}>
                  කාලය නිවැරදිව භාවිතා කර ධර්ම මාර්ගයේ ඉදිරියට යන්න.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  const next = clockMode === 'remaining' ? 'lived' : 'remaining';
                  setClockMode(next);
                  saveLifeClockConfig({ mode: next });
                  setClock(computeLifeClock(dob, lifespan, next));
                }}
                style={{
                  padding: '5px 11px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#FAF7F0',
                  fontSize: '0.74rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {clockMode === 'remaining' ? 'ඉතිරි කාලය' : 'ගත වූ කාලය'}
              </button>

              <button
                type="button"
                onClick={() => setShowLifeConfig(v => !v)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 11px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FAF7F0',
                  fontSize: '0.74rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Settings2 size={12} />
                <span>උපන් දිනය ({lifespan} වසර)</span>
              </button>
            </div>
          </div>

          {/* 6 Ivory Clock Unit Cards */}
          <div className="km-lab-clock-units">
            {[
              { value: String(clock.years).padStart(2, '0'), label: 'වසර', icon: Calendar },
              { value: String(clock.months).padStart(2, '0'), label: 'මාස', icon: Sun },
              { value: String(clock.days).padStart(2, '0'), label: 'දින', icon: Flame },
              { value: String(clock.hours).padStart(2, '0'), label: 'පැය', icon: Clock },
              { value: String(clock.minutes).padStart(2, '0'), label: 'මිනිත්තු', icon: Hourglass },
              { value: String(clock.seconds).padStart(2, '0'), label: 'තත්පර', icon: Target }
            ].map(unit => {
              const UnitIcon = unit.icon;
              return (
                <div
                  key={unit.label}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '10px',
                    background: '#FAF8F5',
                    color: '#231F1B',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{
                    fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)',
                    fontWeight: '800',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1.05,
                    marginBottom: '2px'
                  }}>
                    {unit.value}
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: '#6E655D'
                  }}>
                    <UnitIcon size={11} color="#A35B3D" />
                    <span>{unit.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showLifeConfig && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#FAF7F0' }}>
              උපන් දිනය:
              <input
                type="date"
                value={dob}
                onChange={(e) => {
                  const val = e.target.value;
                  setDob(val);
                  saveLifeClockConfig({ dob: val });
                  setClock(computeLifeClock(val, lifespan, clockMode));
                }}
                className="km-lab-input"
                style={{ width: 'auto', marginLeft: '8px', padding: '5px 8px', fontSize: '0.8rem' }}
              />
            </label>
            <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#FAF7F0' }}>
              අපේක්ෂිත ආයු කාලය (වසර):
              <input
                type="number"
                min={30}
                max={120}
                value={lifespan}
                onChange={(e) => {
                  const val = Math.max(30, Math.min(120, Number(e.target.value) || 75));
                  setLifespan(val);
                  saveLifeClockConfig({ lifespan: val });
                  setClock(computeLifeClock(dob, val, clockMode));
                }}
                className="km-lab-input"
                style={{ width: '76px', marginLeft: '8px', padding: '5px 8px', fontSize: '0.8rem' }}
              />
            </label>
          </div>
        )}
      </div>

      {/* BOTTOM ROW: Stacked Bar Chart (Left) + 3 Action Cards (Right) */}
      <div className="km-lab-bottom-grid">
        {/* Stacked Bar Chart Card */}
        <div className="km-lab-card" style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                <BarChart3 size={17} color="#A35B3D" />
                <h2 style={{ fontSize: '1.04rem', fontWeight: '700', margin: 0, fontFamily: 'var(--font-sinhala)' }}>
                  කාල භාවිතය — දින චර්යා සමතුලිතතාවය
                </h2>
                <span className="km-lab-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={10} /> පෞද්ගලිකයි
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {hoveredIdx !== null && routineSeries[hoveredIdx]
                  ? `${routineSeries[hoveredIdx].date} · මුළු කාලය: ${formatMinutesAsHours(routineSeries[hoveredIdx].totalMinutes || 0)}`
                  : `අද දින: ${formatMinutesAsHours(routineTotalMins)} (${checkedRoutineCount}/${habits.length} කාර්ය)`}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {[
                { id: 7, label: 'දින 7' },
                { id: 14, label: 'දින 14' },
                { id: 30, label: 'දින 30' },
                { id: 'all', label: 'සමස්ත' }
              ].map(r => (
                <button
                  key={String(r.id)}
                  type="button"
                  onClick={() => setCittaRange(r.id)}
                  className={cittaRange === r.id ? 'km-lab-btn-primary' : 'km-lab-btn'}
                  style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stacked Bar Chart SVG */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', minWidth: '420px', height: '148px', display: 'block' }}>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = chartH - padY - ratio * (chartH - padY * 2);
                const labelVal = (ratio * maxDayHours).toFixed(1);
                return (
                  <g key={i}>
                    <line x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="var(--lab-border)" strokeDasharray="3 3" />
                    <text x={padX - 8} y={y + 3} textAnchor="end" fontSize="10" fill="var(--lab-text-muted)">
                      {labelVal}h
                    </text>
                  </g>
                );
              })}

              {routineSeries.map((d, i) => {
                const x = getBarX(i);
                const baseY = chartH - padY;
                const isHover = hoveredIdx === i;
                let yCursor = baseY;

                return (
                  <g
                    key={d.date}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <rect
                      x={x - 3}
                      y={padY}
                      width={barWidth + 6}
                      height={chartH - padY * 2}
                      rx="4"
                      fill={isHover ? 'var(--lab-accent-soft)' : 'transparent'}
                    />
                    {categories.map(cat => {
                      const mins = d[cat.id] || 0;
                      const segH = getHeightFromMins(mins);
                      if (segH <= 0) return null;
                      const segY = yCursor - segH;
                      yCursor = segY - 1;
                      return (
                        <rect
                          key={cat.id}
                          x={x}
                          y={segY}
                          width={barWidth}
                          height={segH}
                          rx="2"
                          fill={cat.color}
                          fillOpacity={isHover ? 1 : 0.9}
                        />
                      );
                    })}
                    {(routineSeries.length <= 14 || i % Math.ceil(routineSeries.length / 8) === 0 || i === routineSeries.length - 1) && (
                      <text x={x + barWidth / 2} y={chartH - 6} textAnchor="middle" fontSize="9.5" fill="var(--lab-text-muted)">
                        {d.date.slice(5)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Chart Legend & Hover Tooltip */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            paddingTop: '10px',
            borderTop: '1px solid var(--lab-border)',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <span key={cat.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '600', color: 'var(--lab-text)' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: cat.color }} />
                  {cat.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 3 Stacked Quick-Action Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'space-between' }}>
          <Link
            to="/lab/daily-routine"
            className="km-lab-card km-lab-card-interactive"
            style={{
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              textDecoration: 'none',
              flex: 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                background: 'rgba(95, 110, 67, 0.14)',
                color: '#5F6E43',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CheckCircle2 size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '1px' }}>
                  අද දින පින් වැඩ (දින චර්යාව)
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
                  අවදි වීම, නින්දට යාම හා දෛනික කාර්ය සලකුණු කරන්න.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <span className="km-lab-tag">{checkedRoutineCount}/{habits.length}</span>
              <ChevronRight size={15} color="var(--lab-text-muted)" />
            </div>
          </Link>

          <Link
            to="/lab/pin-potha"
            className="km-lab-card km-lab-card-interactive"
            style={{
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              textDecoration: 'none',
              flex: 1,
              background: '#EFEAE3'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                background: 'rgba(163, 91, 61, 0.14)',
                color: '#A35B3D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <BookOpen size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '1px' }}>
                  පින් පොත — කුසල / අකුසල සටහන්
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
                  දාන, ශීල, භාවනා හා පොහොය දින සටහන් එක් කරන්න.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <span className="km-lab-tag">{pinEntries.length} සටහන්</span>
              <ChevronRight size={15} color="var(--lab-text-muted)" />
            </div>
          </Link>

          <Link
            to="/lab/compass"
            className="km-lab-card km-lab-card-interactive"
            style={{
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              textDecoration: 'none',
              flex: 1,
              background: 'rgba(95, 110, 67, 0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                background: 'rgba(95, 110, 67, 0.18)',
                color: '#5F6E43',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Compass size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '1px' }}>
                  මාර්ග දිශානතිය හා සිහිගැන්වීම
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
                  අද ඔබේ කාලය හා අවධානය ධර්මයට යොමු වී ඇත්දැයි විමසන්න.
                </div>
              </div>
            </div>
            <ChevronRight size={15} color="var(--lab-text-muted)" />
          </Link>
        </div>
      </div>
    </div>
  );
}
