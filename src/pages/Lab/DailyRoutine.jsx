import { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Plus,
  Trash2,
  Check,
  X,
  Clock,
  ArrowUpRight,
  Play,
  Square,
  Calendar,
  Layers,
  Zap,
  Target,
  Crosshair,
  Flame,
  Pencil,
  SlidersHorizontal,
  BookHeart,
  ChevronRight
} from 'lucide-react';
import {
  getRoutineCategories,
  addRoutineCategory,
  updateRoutineCategory,
  deleteRoutineCategory,
  restoreDefaultRoutineCategories,
  getRoutineHabits,
  addRoutineHabit,
  updateRoutineHabit,
  deleteRoutineHabit,
  restoreDefaultRoutineHabits,
  hasMissingDefaultHabits,
  getRoutineLogForDate,
  getAllRoutineLogs,
  saveRoutineWakeSleep,
  saveRoutineTaskLog,
  addRoutineTaskSession,
  removeRoutineTaskSession,
  getActiveRoutineTimer,
  startRoutineTimer,
  stopRoutineTimer,
  setRoutineTaskStatus,
  getHabitStatusForDay,
  toggleRoutineHabit,
  getRoutineCategoryBreakdown
} from '../../services/dailyRoutineStore';
import { addPinPothaEntry } from '../../services/practiceEcosystemStore';
import { getTodayKey } from '../../services/cittaLogStore';
import { EasyTimeSelector, EasyDurationSelector } from '../../components/Lab/TimeSelectors';
import PaginationBar from '../../components/Lab/PaginationBar';

const CATEGORY_SWATCHES = ['#173aff', '#84cc16', '#7c3aed', '#0ea5e9', '#f59e0b', '#10b981', '#ec4899', '#64748b'];

const TASK_STATUS_META = {
  pending: { label: 'Pending', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)', border: 'rgba(100, 116, 139, 0.25)' },
  ongoing: { label: 'Ongoing', color: '#173aff', bg: 'rgba(23, 58, 255, 0.12)', border: 'rgba(23, 58, 255, 0.30)' },
  completed: { label: 'Done', color: '#3d4b1b', bg: '#e8fba9', border: 'rgba(132, 204, 22, 0.50)' }
};

function getCurrentTimeHHMM() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function parseHourFloat(hhmm, fallback) {
  if (!hhmm || !hhmm.includes(':')) return fallback;
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return fallback;
  return h + m / 60;
}

function formatDurationEn(mins) {
  const m = Math.max(0, Math.round(Number(mins || 0)));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h > 0 && rem > 0) return `${h}h ${rem}m`;
  if (h > 0) return `${h}h 0m`;
  return `${rem}m`;
}

function formatElapsedMMSS(startedAt, nowMs) {
  const secs = Math.max(0, Math.floor((nowMs - startedAt) / 1000));
  return `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
}

function build24hDonutSegments(items, circumference = 2 * Math.PI * 52, fixedTotal = 1440) {
  const sum = items.reduce((acc, item) => acc + item.value, 0);
  const total = Math.max(fixedTotal, sum);
  if (total <= 0) return [];
  let offset = 0;
  return items
    .filter(item => item.value > 0)
    .map(item => {
      const fraction = item.value / total;
      const length = fraction * circumference;
      const gap = items.filter(x => x.value > 0).length > 1 || sum < total ? 2.5 : 0;
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

function getWeekBars(todayDate, totalHabits) {
  const base = new Date(`${todayDate}T00:00:00`);
  const day = base.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(base);
  monday.setDate(base.getDate() + mondayOffset);
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const allLogs = getAllRoutineLogs();
  return labels.map((lbl, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const key = d.toISOString().slice(0, 10);
    const log = allLogs[key];
    const done = log?.checkedIds?.length || 0;
    const pct = totalHabits > 0 ? Math.min(100, Math.round((done / totalHabits) * 100)) : 0;
    const h = Math.max(18, Math.round((Math.max(pct, key === todayDate ? 28 : done > 0 ? 40 : 18) / 100) * 68));
    return { label: lbl, key, isToday: key === todayDate, h };
  });
}

export default function DailyRoutine() {
  const todayDate = getTodayKey();
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'schedule' | 'sessions'

  const [categories, setCategories] = useState(() => getRoutineCategories());
  const [habits, setHabits] = useState(() => getRoutineHabits());
  const [dayLog, setDayLog] = useState(() => getRoutineLogForDate(todayDate));

  // Filter, Donut & Pagination state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [donutMode, setDonutMode] = useState('planned');
  const [donutPage, setDonutPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const [sessionPage, setSessionPage] = useState(1);
  const [catModalPage, setCatModalPage] = useState(1);

  // Category manager state
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatColor, setNewCatColor] = useState(CATEGORY_SWATCHES[0]);
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatLabel, setEditCatLabel] = useState('');
  const [editCatColor, setEditCatColor] = useState(CATEGORY_SWATCHES[0]);

  // Add habit state
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState(() => getRoutineCategories()[0]?.id || 'dhamma');
  const [newMinutes, setNewMinutes] = useState('15');
  const [savedMsg, setSavedMsg] = useState('');

  // Edit habit state
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editHabitTitle, setEditHabitTitle] = useState('');
  const [editHabitDesc, setEditHabitDesc] = useState('');
  const [editHabitCat, setEditHabitCat] = useState('dhamma');
  const [editHabitMins, setEditHabitMins] = useState('15');

  // Wake / Sleep Save & Edit state
  const [editingWake, setEditingWake] = useState(() => !getRoutineLogForDate(todayDate).wakeTime);
  const [wakeDraft, setWakeDraft] = useState(() => getRoutineLogForDate(todayDate).wakeTime || '05:30');
  const [editingSleep, setEditingSleep] = useState(() => !getRoutineLogForDate(todayDate).sleepTime);
  const [sleepDraft, setSleepDraft] = useState(() => getRoutineLogForDate(todayDate).sleepTime || '22:00');

  // Per-task Session & Time Modal state
  const [sessionModalHabitId, setSessionModalHabitId] = useState(null);
  const [taskTimeMinutes, setTaskTimeMinutes] = useState('15');
  const [taskTimeCompletedAt, setTaskTimeCompletedAt] = useState(() => getCurrentTimeHHMM());

  // Live clock, 24h remaining & active task timer
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [activeTimer, setActiveTimer] = useState(() => getActiveRoutineTimer());

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const refresh = () => {
      const nextCats = getRoutineCategories();
      setCategories(nextCats);
      setHabits(getRoutineHabits());
      setDayLog(getRoutineLogForDate(todayDate));
      setActiveTimer(getActiveRoutineTimer());
      setNewCategory(prev => (nextCats.some(c => c.id === prev) ? prev : (nextCats[0]?.id || 'dhamma')));
    };
    window.addEventListener('labRoutineUpdated', refresh);
    return () => window.removeEventListener('labRoutineUpdated', refresh);
  }, [todayDate]);

  const showToast = (msg) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 2800);
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addRoutineHabit({
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      minutes: Number(newMinutes || 15),
      cittaType: 'kusala'
    });
    setNewTitle('');
    setNewDescription('');
    setShowAddTask(false);
    showToast('New activity added.');
  };

  const startEditHabit = (habit) => {
    setEditingHabitId(habit.id);
    setEditHabitTitle(habit.title);
    setEditHabitDesc(habit.description || '');
    setEditHabitCat(habit.category || categories[0]?.id || 'dhamma');
    setEditHabitMins(String(habit.minutes || 15));
  };

  const saveEditHabit = (id) => {
    if (!editHabitTitle.trim()) return;
    updateRoutineHabit(id, {
      title: editHabitTitle.trim(),
      description: editHabitDesc.trim(),
      category: editHabitCat,
      minutes: Number(editHabitMins || 15)
    });
    setEditingHabitId(null);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;
    addRoutineCategory({ label: newCatLabel.trim(), color: newCatColor });
    setNewCatLabel('');
  };

  const openSessionModal = (habit) => {
    const tLog = dayLog.taskLogs?.[habit.id];
    setSessionModalHabitId(habit.id);
    setTaskTimeMinutes(String(tLog?.minutes ?? habit.minutes ?? 15));
    setTaskTimeCompletedAt(tLog?.completedAt || getCurrentTimeHHMM());
  };

  const checkedDhammaHabits = habits.filter(
    h => dayLog.checkedIds.includes(h.id) && (h.category || categories[0]?.id) === 'dhamma'
  );

  const handleSaveToPinPotha = () => {
    if (checkedDhammaHabits.length === 0) return;
    const totalMins = checkedDhammaHabits.reduce(
      (acc, h) => acc + (dayLog.taskLogs?.[h.id]?.minutes ?? h.minutes ?? 15),
      0
    );
    const summaryLines = checkedDhammaHabits
      .map(h => {
        const tLog = dayLog.taskLogs?.[h.id];
        const mins = tLog?.minutes ?? h.minutes;
        const atStr = tLog?.completedAt ? ` · ${tLog.completedAt}` : '';
        return `• ${h.title} (${formatDurationEn(mins)}${atStr})${h.description ? ` — ${h.description}` : ''}`;
      })
      .join('\n');
    const timeInfo = [
      dayLog.wakeTime ? `Wake up: ${dayLog.wakeTime}` : null,
      dayLog.sleepTime ? `Wind down: ${dayLog.sleepTime}` : null
    ].filter(Boolean).join(' · ');

    addPinPothaEntry({
      entryType: 'sila',
      cittaType: 'kusala',
      scheduleType: 'once',
      durationMinutes: totalMins,
      entryDate: todayDate,
      title: `Daily Dhamma Practice (${checkedDhammaHabits.length})`,
      reflection: `${timeInfo ? `${timeInfo}\n` : ''}${summaryLines}`
    });
    showToast('Saved to Merit Book.');
  };

  const checkedCount = dayLog.checkedIds.length;
  const remainingTasksCount = Math.max(0, habits.length - checkedCount);
  const completionPct = habits.length > 0 ? Math.round((checkedCount / habits.length) * 100) : 0;

  // Live Clock & 24h Day Remaining
  const nowDate = new Date(nowMs);
  const currentTimeStr = `${String(nowDate.getHours()).padStart(2, '0')}:${String(nowDate.getMinutes()).padStart(2, '0')}:${String(nowDate.getSeconds()).padStart(2, '0')}`;
  const elapsedSecsToday = nowDate.getHours() * 3600 + nowDate.getMinutes() * 60 + nowDate.getSeconds();
  const remSecsToday = Math.max(0, 86400 - elapsedSecsToday);
  const remHoursToday = Math.floor(remSecsToday / 3600);
  const remMinsToday = Math.floor((remSecsToday % 3600) / 60);

  // 24h Donut & Breakdown
  const breakdown = getRoutineCategoryBreakdown(todayDate, donutMode);
  const totalAllocatedMins = breakdown.items.reduce((acc, item) => acc + item.value, 0);
  const dayTotalMins = Math.max(1440, totalAllocatedMins);
  const donutRadius = 52;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutSegments = build24hDonutSegments(breakdown.items, donutCircumference, dayTotalMins);
  const legendItems = breakdown.items.map(item => ({
    ...item,
    pct: Math.round((item.value / dayTotalMins) * 100)
  }));

  // 24h Hour-by-Hour Rhythm Strip
  const wakeHour = parseHourFloat(dayLog.wakeTime || '05:30', 5.5);
  const sleepHour = parseHourFloat(dayLog.sleepTime || '22:00', 22);
  const hourBlocks = Array.from({ length: 24 }, (_, hr) => {
    const isPracticeHour = hr >= Math.floor(wakeHour) && hr < Math.floor(wakeHour) + Math.max(1, Math.min(6, Math.round(totalAllocatedMins / 60)));
    const isAwake = hr >= Math.floor(wakeHour) && hr < Math.floor(sleepHour);
    return { hr, isPracticeHour, isAwake };
  });

  const filteredHabits = selectedCategoryFilter === 'all'
    ? habits
    : habits.filter(h => (h.category || categories[0]?.id) === selectedCategoryFilter);

  const ITEMS_PER_PAGE = 4;
  const donutTotalPages = Math.max(1, Math.ceil(legendItems.length / ITEMS_PER_PAGE));
  const safeDonutPage = Math.min(donutPage, donutTotalPages);
  const pagedLegendItems = legendItems.slice((safeDonutPage - 1) * ITEMS_PER_PAGE, safeDonutPage * ITEMS_PER_PAGE);

  const taskTotalPages = Math.max(1, Math.ceil(filteredHabits.length / ITEMS_PER_PAGE));
  const safeTaskPage = Math.min(taskPage, taskTotalPages);
  const pagedHabits = filteredHabits.slice((safeTaskPage - 1) * ITEMS_PER_PAGE, safeTaskPage * ITEMS_PER_PAGE);

  const sessionHabits = habits.filter(h => {
    const st = getHabitStatusForDay(dayLog, h.id);
    const tLog = dayLog.taskLogs?.[h.id];
    return st !== 'pending' || (Array.isArray(tLog?.sessions) && tLog.sessions.length > 0) || Boolean(tLog?.minutes);
  });
  const sessionTotalPages = Math.max(1, Math.ceil(sessionHabits.length / ITEMS_PER_PAGE));
  const safeSessionPage = Math.min(sessionPage, sessionTotalPages);
  const pagedSessionHabits = sessionHabits.slice((safeSessionPage - 1) * ITEMS_PER_PAGE, safeSessionPage * ITEMS_PER_PAGE);

  const CAT_MODAL_PER_PAGE = 4;
  const catModalTotalPages = Math.max(1, Math.ceil(categories.length / CAT_MODAL_PER_PAGE));
  const safeCatModalPage = Math.min(catModalPage, catModalTotalPages);
  const pagedModalCategories = categories.slice((safeCatModalPage - 1) * CAT_MODAL_PER_PAGE, safeCatModalPage * CAT_MODAL_PER_PAGE);

  const weekBars = getWeekBars(todayDate, habits.length);
  const activeTimerHabit = activeTimer ? habits.find(h => h.id === activeTimer.habitId) : null;
  const nextRightHabit = activeTimerHabit || habits.find(h => getHabitStatusForDay(dayLog, h.id) !== 'completed') || habits[0] || null;
  const sessionModalHabit = sessionModalHabitId ? habits.find(h => h.id === sessionModalHabitId) : null;
  const sessionModalLog = sessionModalHabit ? dayLog.taskLogs?.[sessionModalHabit.id] : null;

  const routineTabs = [
    { id: 'tasks', label: "Today's Tasks" },
    { id: 'schedule', label: 'Time Allocation' },
    { id: 'sessions', label: 'Sessions & History' }
  ];

  return (
    <div className="km-lab-page" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* TOP SUB-BAR: TABS + LIVE 24H CLOCK + NEW TASK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'inline-flex', background: 'var(--po-card-subtle)', border: '1px solid var(--po-card-border)', borderRadius: '999px', padding: '3px', gap: '3px' }}>
          {routineTabs.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: 'none',
                  background: active ? 'var(--po-blue, #173aff)' : 'transparent',
                  color: active ? '#ffffff' : 'var(--lab-text-muted)',
                  fontSize: '0.74rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {savedMsg && (
            <span style={{ fontSize: '0.73rem', fontWeight: '700', color: '#4d7c0f', background: '#e8fba9', padding: '4px 10px', borderRadius: '999px' }}>
              {savedMsg}
            </span>
          )}
          <div className="km-po-card" style={{ padding: '6px 12px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '0.73rem', fontVariantNumeric: 'tabular-nums' }}>
            <Clock size={13} color="var(--po-blue, #173aff)" />
            <strong>{currentTimeStr}</strong>
            <span style={{ color: 'var(--lab-text-muted)' }}>· Left {remHoursToday}h {String(remMinsToday).padStart(2, '0')}m</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (selectedCategoryFilter !== 'all') setNewCategory(selectedCategoryFilter);
              setShowAddTask(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 14px',
              borderRadius: '14px',
              border: 'none',
              background: '#c6ff24',
              color: '#101010',
              fontSize: '0.75rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <Plus size={14} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* HERO GRID: TRAIN THE RESPONSE + DISCIPLINE METER */}
      <section className="po-hero-grid" aria-label="Overview">
        <div className="km-po-card po-hero-left">
          <div className="po-hero-shape" aria-hidden="true">
            <div className="po-hero-stripe" />
            <div className="po-hero-arc" style={{ width: '190px', height: '190px', left: '28px', top: '75px' }} />
            <div className="po-hero-arc" style={{ width: '145px', height: '145px', left: '50px', top: '98px' }} />
            <div className="po-hero-arc" style={{ width: '100px', height: '100px', left: '72px', top: '120px' }} />
          </div>

          <div className="po-hero-kicker" style={{ position: 'relative', zIndex: 1 }}>THE WARRIOR</div>
          <h1 style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', lineHeight: 1.06, letterSpacing: '-0.04em', margin: '8px 0 4px', fontWeight: '900' }}>
            Train the <span style={{ color: 'var(--po-blue, #173aff)' }}>response</span><span style={{ color: '#94cd20' }}>.</span>
          </h1>
          <p style={{ position: 'relative', zIndex: 1, fontSize: '0.8rem', color: 'var(--lab-text-muted)', margin: '0 0 10px' }}>
            Build the disciplined response to life&apos;s experiences.
          </p>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div className="km-po-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', borderRadius: '16px', padding: '7px 13px' }}>
              <Target size={18} />
              <div style={{ lineHeight: 1.15 }}>
                <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800' }}>Notice</strong>
                <small style={{ fontSize: '0.68rem', color: 'var(--lab-text-muted)' }}>See clearly.</small>
              </div>
            </div>
            <ChevronRight size={16} color="var(--lab-text-muted)" />
            <div className="km-po-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', borderRadius: '16px', padding: '7px 13px' }}>
              <Layers size={18} />
              <div style={{ lineHeight: 1.15 }}>
                <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800' }}>Pause</strong>
                <small style={{ fontSize: '0.68rem', color: 'var(--lab-text-muted)' }}>Create space.</small>
              </div>
            </div>
            <ChevronRight size={16} color="var(--lab-text-muted)" />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', borderRadius: '16px', padding: '7px 14px', background: '#c6ff24', color: '#121416', border: '1px solid #c6ff24' }}>
              <Zap size={18} />
              <div style={{ lineHeight: 1.15 }}>
                <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: '900' }}>Respond</strong>
                <small style={{ fontSize: '0.68rem', color: '#2b3212' }}>Choose wisely.</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Obsidian Discipline Meter */}
        <div className="po-discipline">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Discipline Meter</h2>
              <p style={{ fontSize: '0.75rem', color: '#bec0c2', margin: '2px 0 8px' }}>Consistency on your practice</p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#c6ff24' }}>{checkedCount} / {habits.length}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '18px' }}>
            <div
              className="po-donut"
              style={{ background: `conic-gradient(#c6ff24 ${completionPct}%, #333537 0)` }}
              role="img"
              aria-label={`Discipline meter ${completionPct} percent`}
            >
              <div style={{ zIndex: 1, textAlign: 'center' }}>
                <strong style={{ display: 'block', fontSize: '1.65rem', letterSpacing: '-0.04em', lineHeight: 1 }}>{completionPct}%</strong>
                <span style={{ color: '#afb3b5', fontSize: '0.66rem', fontWeight: '700', display: 'block', marginTop: '4px' }}>TODAY</span>
              </div>
            </div>

            <div style={{ height: '94px', width: '1px', background: '#3a3c3e' }} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#c6ff24', letterSpacing: '-0.03em' }}>
                {checkedCount} done
              </div>
              <div style={{ fontSize: '0.69rem', color: '#b4b7b8', marginTop: '1px' }}>vs. last 7 days</div>
              <div style={{ height: '52px', display: 'flex', alignItems: 'flex-end', gap: '7px', marginTop: '8px' }}>
                {weekBars.map(bar => (
                  <div key={bar.key} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '100%',
                      maxWidth: '24px',
                      height: `${Math.round(bar.h * 0.72)}px`,
                      borderRadius: '6px 6px 4px 4px',
                      background: bar.isToday ? '#c6ff24' : 'linear-gradient(180deg, #e5e7eb, #6b7280)'
                    }} />
                    <small style={{ fontSize: '0.64rem', color: bar.isToday ? '#c6ff24' : '#aeb1b3', fontWeight: '700' }}>{bar.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TAB 1: MODERNIZED 2-COLUMN WORKSPACE (NO SESSION LOG / REFLECTION) */}
      {activeTab === 'tasks' && (
        <section className="po-workspace-2col" aria-label="Daily practice workspace">
          {/* LEFT: MODERNIZED TODAY'S PRACTICE */}
          <article className="km-po-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '9px', minWidth: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                <Calendar size={18} />
                <span>Today&apos;s Practice</span>
              </div>
              <span style={{ fontWeight: '800', border: '1px solid var(--po-card-border)', padding: '3px 11px', borderRadius: '999px', fontSize: '0.76rem', fontVariantNumeric: 'tabular-nums' }}>
                {checkedCount} / {habits.length}
              </span>
            </div>

            {/* Category Chips */}
            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  setTaskPage(1);
                }}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '6px 11px',
                  borderRadius: '999px',
                  border: 'none',
                  background: selectedCategoryFilter === 'all' ? 'var(--po-blue, #173aff)' : 'var(--po-card-subtle)',
                  color: selectedCategoryFilter === 'all' ? '#ffffff' : 'var(--lab-text)',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                All ({habits.length})
              </button>
              {categories.map(cat => {
                const count = habits.filter(h => (h.category || categories[0]?.id) === cat.id).length;
                const active = selectedCategoryFilter === cat.id;
                return (
                  <div
                    key={cat.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      borderRadius: '999px',
                      background: active ? 'var(--po-blue, #173aff)' : 'var(--po-card-subtle)',
                      color: active ? '#ffffff' : 'var(--lab-text)',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategoryFilter(active ? 'all' : cat.id);
                        setTaskPage(1);
                      }}
                      style={{
                        whiteSpace: 'nowrap',
                        padding: '6px 7px 6px 10px',
                        border: 'none',
                        background: 'transparent',
                        color: 'inherit',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {cat.label} ({count})
                    </button>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedCategoryFilter === cat.id) setSelectedCategoryFilter('all');
                          deleteRoutineCategory(cat.id);
                        }}
                        title="Delete category"
                        style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 7px 6px 1px', border: 'none', background: 'transparent', color: 'inherit', opacity: 0.7, cursor: 'pointer' }}
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tasks List */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {pagedHabits.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--lab-text-muted)', background: 'var(--po-card-subtle)', borderRadius: '14px' }}>
                  No tasks in this category yet.
                </div>
              ) : pagedHabits.map((habit, idx) => {
                const checked = dayLog.checkedIds.includes(habit.id);
                const cat = categories.find(c => c.id === habit.category) || categories[0];

                if (editingHabitId === habit.id) {
                  return (
                    <div key={habit.id} style={{ padding: '8px 10px', margin: '4px 0', borderRadius: '12px', background: 'var(--po-card-subtle)', border: '1px solid var(--po-blue, #173aff)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <input type="text" className="km-lab-input" style={{ flex: 1, minWidth: '140px', padding: '5px 8px', fontSize: '0.8rem' }} value={editHabitTitle} onChange={(e) => setEditHabitTitle(e.target.value)} />
                        <select className="km-lab-input" style={{ width: 'auto', padding: '5px 8px', fontSize: '0.78rem' }} value={editHabitCat} onChange={(e) => setEditHabitCat(e.target.value)}>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                        <EasyDurationSelector totalMinutes={Number(editHabitMins)} onChange={(mins) => setEditHabitMins(String(mins))} />
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input type="text" className="km-lab-input" style={{ flex: 1, padding: '5px 8px', fontSize: '0.78rem' }} placeholder="Description (optional)" value={editHabitDesc} onChange={(e) => setEditHabitDesc(e.target.value)} />
                        <button type="button" onClick={() => saveEditHabit(habit.id)} style={{ padding: '5px 10px', borderRadius: '999px', border: 'none', background: 'var(--po-blue, #173aff)', color: '#fff', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => setEditingHabitId(null)} className="km-lab-btn" style={{ padding: '5px 9px', borderRadius: '999px', fontSize: '0.72rem' }}>Cancel</button>
                      </div>
                    </div>
                  );
                }

                const taskLog = dayLog.taskLogs?.[habit.id];
                const taskStatus = getHabitStatusForDay(dayLog, habit.id);
                const statusMeta = TASK_STATUS_META[taskStatus] || TASK_STATUS_META.pending;
                const displayMins = taskLog?.minutes ?? habit.minutes;
                const maxTitleChars = 34;
                const displayTitle = habit.title.length > maxTitleChars
                  ? `${habit.title.slice(0, maxTitleChars).trimEnd()}...`
                  : habit.title;

                return (
                  <div
                    key={habit.id}
                    style={{
                      minHeight: '50px',
                      borderTop: idx === 0 ? 'none' : '1px solid var(--po-card-border)',
                      display: 'grid',
                      gridTemplateColumns: '28px minmax(0, 1fr) auto',
                      gap: '10px',
                      alignItems: 'center',
                      padding: '4px 0'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleRoutineHabit(todayDate, habit.id)}
                      aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
                      style={{
                        width: '28px',
                        height: '28px',
                        flexShrink: 0,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '50%',
                        border: `2px solid ${checked ? '#c6ff24' : '#b2b6ba'}`,
                        background: checked ? '#c6ff24' : 'transparent',
                        color: checked ? '#16181a' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>

                    <div style={{ minWidth: 0, overflow: 'hidden', textAlign: 'left' }} title={habit.title}>
                      <div style={{ fontWeight: '700', fontSize: '1.18rem', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {displayTitle}
                      </div>
                      <small style={{ display: 'block', color: 'var(--lab-text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cat?.label}
                      </small>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <select
                        aria-label={`${habit.title} status`}
                        value={taskStatus}
                        onChange={(e) => setRoutineTaskStatus(todayDate, habit.id, e.target.value)}
                        style={{
                          width: '86px',
                          padding: '3px 7px',
                          borderRadius: '14px',
                          border: `1px solid ${statusMeta.border}`,
                          background: statusMeta.bg,
                          color: statusMeta.color,
                          fontSize: '0.66rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Done</option>
                      </select>

                      <span style={{ width: '38px', textAlign: 'right', fontWeight: '700', fontSize: '0.72rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                        {formatDurationEn(displayMins)}
                      </span>

                      {activeTimer?.habitId === habit.id ? (
                        <button
                          type="button"
                          onClick={() => stopRoutineTimer()}
                          style={{ height: '28px', padding: '0 8px', borderRadius: '999px', border: 'none', background: '#c6ff24', color: '#101010', fontSize: '0.66rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '3px', cursor: 'pointer', fontVariantNumeric: 'tabular-nums' }}
                        >
                          <Square size={8} fill="currentColor" />
                          <span>{formatElapsedMMSS(activeTimer.startedAt, nowMs)}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (activeTimer) stopRoutineTimer();
                            startRoutineTimer(todayDate, habit.id);
                          }}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'var(--po-card-subtle)', color: 'var(--lab-text)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
                          title="Start timer"
                        >
                          <Play size={12} />
                        </button>
                      )}

                      <button type="button" onClick={() => openSessionModal(habit)} className="km-lab-btn" style={{ padding: '2px 7px', borderRadius: '999px', fontSize: '0.66rem' }} title="Log sessions">
                        +s
                      </button>
                      <button type="button" onClick={() => startEditHabit(habit)} title="Edit task" style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '2px' }}>
                        <Pencil size={12} />
                      </button>
                      <button type="button" onClick={() => deleteRoutineHabit(habit.id)} title="Delete task" style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '2px' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <PaginationBar page={safeTaskPage} totalPages={taskTotalPages} onPageChange={setTaskPage} compact prevLabel="Prev" nextLabel="Next" />

            <div>
              <div style={{ height: '9px', background: 'var(--po-track)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#c6ff24', width: `${completionPct}%`, borderRadius: '999px', transition: 'width 0.25s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.71rem', color: 'var(--lab-text-muted)', marginTop: '5px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>Small, meaningful actions each day</span>
                  {hasMissingDefaultHabits() && (
                    <button
                      type="button"
                      onClick={() => restoreDefaultRoutineHabits()}
                      style={{ border: 'none', background: 'transparent', color: 'var(--po-blue, #173aff)', fontSize: '0.71rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                    >
                      Restore defaults →
                    </button>
                  )}
                </div>
                <strong style={{ color: 'var(--lab-text)' }}>{completionPct}% complete</strong>
              </div>
            </div>
          </article>

          {/* RIGHT COLUMN: NEXT RIGHT ACTION + HABIT FOCUS & DAY RHYTHM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
            <article className="po-action-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.04em' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Crosshair size={15} /> NEXT RIGHT ACTION
                </span>
                <ArrowUpRight size={17} />
              </div>

              <h3 style={{ fontSize: 'clamp(1.3rem, 1.8vw, 1.65rem)', lineHeight: 1.22, margin: '8px 0 11px', maxWidth: '300px', letterSpacing: '-0.02em', fontWeight: '800' }}>
                {nextRightHabit ? nextRightHabit.title : 'All practices completed for today.'}
              </h3>

              {nextRightHabit && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {activeTimer?.habitId === nextRightHabit.id ? (
                    <button
                      type="button"
                      onClick={() => stopRoutineTimer()}
                      style={{ background: '#c6ff24', color: '#161616', padding: '7px 13px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '0.75rem', display: 'inline-flex', gap: '6px', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <Square size={11} fill="currentColor" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTimer) stopRoutineTimer();
                        startRoutineTimer(todayDate, nextRightHabit.id);
                      }}
                      style={{ background: '#c6ff24', color: '#161616', padding: '7px 13px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '0.75rem', display: 'inline-flex', gap: '6px', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <Play size={11} fill="currentColor" />
                      <span>Start Now</span>
                    </button>
                  )}

                  <span style={{ color: '#fff', background: 'rgba(255,255,255,0.18)', borderRadius: '14px', padding: '7px 10px', fontWeight: '700', fontSize: '0.73rem', display: 'inline-flex', alignItems: 'center', gap: '5px', fontVariantNumeric: 'tabular-nums' }}>
                    <Clock size={12} />
                    <span>
                      {activeTimer?.habitId === nextRightHabit.id
                        ? formatElapsedMMSS(activeTimer.startedAt, nowMs)
                        : `${String(dayLog.taskLogs?.[nextRightHabit.id]?.minutes ?? nextRightHabit.minutes).padStart(2, '0')}:00`}
                    </span>
                  </span>
                </div>
              )}
            </article>

            {/* HABIT FOCUS & DAY RHYTHM */}
            <article className="km-po-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.96rem', fontWeight: '800' }}>
                  <Target size={16} color="var(--po-blue, #173aff)" />
                  <span>Habit Focus</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--lab-text-muted)', fontWeight: '700' }}>
                  <span>Categories: <strong style={{ color: 'var(--lab-text)' }}>{categories.length}</strong></span>
                  <button
                    type="button"
                    onClick={() => setShowCatManager(true)}
                    style={{ width: '28px', height: '26px', display: 'grid', placeItems: 'center', border: '1px solid var(--po-card-border)', borderRadius: '10px', background: 'transparent', color: 'var(--lab-text)', cursor: 'pointer' }}
                    title="Manage Categories"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px' }}>
                {categories.slice(0, 4).map((cat, idx) => {
                  const active = selectedCategoryFilter === cat.id;
                  const isOutlined = !active && idx === 2;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategoryFilter(active ? 'all' : cat.id);
                        setTaskPage(1);
                      }}
                      style={{
                        borderRadius: '14px',
                        padding: '7px 10px',
                        display: 'inline-flex',
                        gap: '6px',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        background: active ? '#ccff39' : isOutlined ? 'rgba(23, 58, 255, 0.08)' : 'var(--po-card-subtle)',
                        border: isOutlined ? '1px solid var(--po-blue, #173aff)' : '1px solid transparent',
                        color: active ? '#121416' : isOutlined ? 'var(--po-blue, #173aff)' : 'var(--lab-text)',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--po-card-border)', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('schedule')}
                  style={{ padding: '4px 10px', borderRadius: '999px', border: '1px solid var(--po-card-border)', background: 'var(--po-card-subtle)', color: 'var(--lab-text)', fontWeight: '700', fontSize: '0.7rem', cursor: 'pointer' }}
                >
                  Wake {dayLog.wakeTime || '05:30'} · Sleep {dayLog.sleepTime || '22:00'}
                </button>

                {checkedDhammaHabits.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSaveToPinPotha}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 11px',
                      borderRadius: '999px',
                      border: 'none',
                      background: 'var(--po-blue, #173aff)',
                      color: '#fff',
                      fontSize: '0.71rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <BookHeart size={12} />
                    <span>Merit Book ({checkedDhammaHabits.length})</span>
                  </button>
                )}
              </div>
            </article>
          </div>
        </section>
      )}

      {/* TAB 2: TIME ALLOCATION */}
      {activeTab === 'schedule' && (
        <div className="km-po-top-grid">
          <div className="km-po-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: '800', margin: '0 0 2px 0' }}>The rhythm of your day</h2>
                <div style={{ fontSize: '0.73rem', color: 'var(--lab-text-muted)' }}>
                  Intentional time: <strong>{formatDurationEn(totalAllocatedMins)}</strong> / 24h
                </div>
              </div>
              <button type="button" onClick={() => setShowCatManager(true)} className="km-lab-btn" style={{ padding: '5px 11px', borderRadius: '999px', fontSize: '0.72rem' }}>
                <SlidersHorizontal size={12} /> Manage Categories
              </button>
            </div>

            {/* 24-Hour Time Map */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(0, 1fr))', gap: '4px', height: '54px', alignItems: 'stretch' }}>
                {hourBlocks.map(b => (
                  <div
                    key={b.hr}
                    title={`${String(b.hr).padStart(2, '0')}:00`}
                    style={{
                      borderRadius: '6px',
                      background: b.isPracticeHour ? '#c6ff24' : b.isAwake ? 'var(--po-blue, #173aff)' : 'var(--po-track)',
                      opacity: b.isPracticeHour ? 1 : b.isAwake ? 0.5 : 0.65
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--lab-text-muted)', marginTop: '4px', fontFamily: 'monospace' }}>
                <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span>
              </div>
            </div>

            {/* Wake & Sleep Save/Edit */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <div style={{ padding: '10px 12px', borderRadius: '13px', background: 'var(--po-card-subtle)', border: '1px solid var(--po-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '700' }}>
                    <Sun size={14} color="#F59E0B" /> Wake up time
                  </span>
                  {!editingWake && dayLog.wakeTime ? (
                    <button type="button" onClick={() => { setWakeDraft(dayLog.wakeTime); setEditingWake(true); }} className="km-lab-btn" style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.69rem', gap: '3px' }}>
                      <Pencil size={10} /> Edit
                    </button>
                  ) : (
                    <button type="button" onClick={() => setWakeDraft(getCurrentTimeHHMM())} className="km-lab-btn" style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.69rem' }}>
                      Now
                    </button>
                  )}
                </div>
                {!editingWake && dayLog.wakeTime ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', borderRadius: '8px', background: 'rgba(198, 255, 36, 0.25)' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '0.94rem' }}>{dayLog.wakeTime}</span>
                    <span style={{ fontSize: '0.69rem', fontWeight: '800', color: '#3d4b1b' }}>✓ Saved</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <EasyTimeSelector value={wakeDraft} onChange={(val) => setWakeDraft(val)} />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button type="button" onClick={() => { saveRoutineWakeSleep(todayDate, { wakeTime: wakeDraft }); setEditingWake(false); }} style={{ flex: 1, padding: '5px 8px', borderRadius: '999px', border: 'none', background: 'var(--po-blue, #173aff)', color: '#fff', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}>
                        Save
                      </button>
                      {dayLog.wakeTime && <button type="button" onClick={() => setEditingWake(false)} className="km-lab-btn" style={{ padding: '5px 8px', borderRadius: '999px', fontSize: '0.72rem' }}><X size={12} /></button>}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '13px', background: 'var(--po-card-subtle)', border: '1px solid var(--po-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '700' }}>
                    <Moon size={14} color="var(--po-blue, #173aff)" /> Sleep time
                  </span>
                  {!editingSleep && dayLog.sleepTime ? (
                    <button type="button" onClick={() => { setSleepDraft(dayLog.sleepTime); setEditingSleep(true); }} className="km-lab-btn" style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.69rem', gap: '3px' }}>
                      <Pencil size={10} /> Edit
                    </button>
                  ) : (
                    <button type="button" onClick={() => setSleepDraft(getCurrentTimeHHMM())} className="km-lab-btn" style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.69rem' }}>
                      Now
                    </button>
                  )}
                </div>
                {!editingSleep && dayLog.sleepTime ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', borderRadius: '8px', background: 'rgba(198, 255, 36, 0.25)' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '0.94rem' }}>{dayLog.sleepTime}</span>
                    <span style={{ fontSize: '0.69rem', fontWeight: '800', color: '#3d4b1b' }}>✓ Saved</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <EasyTimeSelector value={sleepDraft} onChange={(val) => setSleepDraft(val)} />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button type="button" onClick={() => { saveRoutineWakeSleep(todayDate, { sleepTime: sleepDraft }); setEditingSleep(false); }} style={{ flex: 1, padding: '5px 8px', borderRadius: '999px', border: 'none', background: 'var(--po-blue, #173aff)', color: '#fff', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}>
                        Save
                      </button>
                      {dayLog.sleepTime && <button type="button" onClick={() => setEditingSleep(false)} className="km-lab-btn" style={{ padding: '5px 8px', borderRadius: '999px', fontSize: '0.72rem' }}><X size={12} /></button>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="km-po-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '0.94rem', fontWeight: '800', margin: 0 }}>Practice Overview</h3>
              <div style={{ display: 'inline-flex', background: 'var(--po-card-subtle)', borderRadius: '999px', padding: '2px', gap: '2px' }}>
                {[{ id: 'planned', label: 'Planned' }, { id: 'completed', label: 'Completed' }].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setDonutMode(m.id)}
                    style={{
                      padding: '3px 9px',
                      borderRadius: '999px',
                      border: 'none',
                      background: donutMode === m.id ? 'var(--po-blue, #173aff)' : 'transparent',
                      color: donutMode === m.id ? '#ffffff' : 'var(--lab-text-muted)',
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '96px', height: '96px', flexShrink: 0 }}>
                <svg viewBox="0 0 132 132" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="66" cy="66" r={donutRadius} fill="none" stroke="var(--po-track)" strokeWidth="14" />
                  {donutSegments.map(seg => (
                    <circle key={seg.id} cx="66" cy="66" r={donutRadius} fill="none" stroke={seg.color} strokeWidth="14" strokeDasharray={seg.dasharray} strokeDashoffset={seg.dashoffset} strokeLinecap="butt" />
                  ))}
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{checkedCount} / {habits.length}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>Completed: {checkedCount} · Remaining: {remainingTasksCount}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {pagedLegendItems.map(seg => (
                <div key={seg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.73rem', padding: '4px 8px', borderRadius: '8px', background: 'var(--po-card-subtle)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{seg.label}</span>
                  </span>
                  <span style={{ fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>{formatDurationEn(seg.value)} ({seg.pct}%)</span>
                </div>
              ))}
            </div>
            <PaginationBar page={safeDonutPage} totalPages={donutTotalPages} onPageChange={setDonutPage} compact prevLabel="Prev" nextLabel="Next" />
          </div>
        </div>
      )}

      {/* TAB 3: SESSIONS & HISTORY */}
      {activeTab === 'sessions' && (
        <div className="km-po-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '0.98rem', fontWeight: '800', margin: '0 0 2px 0' }}>Sessions & Activity History ({sessionHabits.length})</h2>
              <div style={{ fontSize: '0.73rem', color: 'var(--lab-text-muted)' }}>Partial sessions and completed practices for {todayDate}</div>
            </div>
            <button type="button" onClick={() => setActiveTab('tasks')} className="km-lab-btn" style={{ padding: '5px 11px', borderRadius: '999px', fontSize: '0.73rem' }}>
              Back to Today&apos;s Tasks
            </button>
          </div>

          {pagedSessionHabits.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', background: 'var(--po-card-subtle)', borderRadius: '12px', fontSize: '0.82rem', color: 'var(--lab-text-muted)' }}>
              No sessions or completed tasks logged yet today.
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {pagedSessionHabits.map(habit => {
                  const tLog = dayLog.taskLogs?.[habit.id];
                  const st = getHabitStatusForDay(dayLog, habit.id);
                  const stMeta = TASK_STATUS_META[st] || TASK_STATUS_META.pending;
                  const totalMins = tLog?.minutes ?? habit.minutes;
                  return (
                    <div key={habit.id} style={{ padding: '9px 12px', borderRadius: '11px', background: 'var(--po-card-subtle)', border: '1px solid var(--po-card-border)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.84rem' }}>{habit.title}</span>
                          <span style={{ padding: '1px 7px', borderRadius: '999px', fontSize: '0.66rem', fontWeight: '700', color: stMeta.color, background: stMeta.bg }}>
                            {stMeta.label}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--po-blue, #173aff)' }}>{formatDurationEn(totalMins)}</span>
                          <button type="button" onClick={() => openSessionModal(habit)} className="km-lab-btn" style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.69rem' }}>
                            + Session
                          </button>
                        </div>
                      </div>
                      {Array.isArray(tLog?.sessions) && tLog.sessions.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                          {tLog.sessions.map(s => (
                            <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '999px', background: 'var(--po-card-bg)', border: '1px solid var(--po-card-border)' }}>
                              <span>{s.loggedAt ? `${s.loggedAt} · ` : ''}{s.minutes}m</span>
                              <button type="button" onClick={() => removeRoutineTaskSession(todayDate, habit.id, s.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#ef4444', display: 'inline-flex' }} title="Remove session">
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <PaginationBar page={safeSessionPage} totalPages={sessionTotalPages} onPageChange={setSessionPage} compact prevLabel="Prev" nextLabel="Next" />
            </>
          )}
        </div>
      )}

      {/* BOTTOM METRICS FOOTER */}
      <footer className="po-bottom-metrics" aria-label="Progress summary">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '2.1rem', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 1 }}>{checkedCount}</div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.73rem', color: 'var(--lab-text-muted)' }}>
            <Flame size={15} color="var(--lab-text)" />
            <span>Tasks Done</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '14px', borderLeft: '1px solid var(--po-card-border)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `conic-gradient(#c6ff24 ${Math.min(100, Math.round((totalAllocatedMins / 1440) * 100))}%, var(--po-track) 0)`, position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', background: 'var(--lab-bg)' }} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', fontVariantNumeric: 'tabular-nums' }}>{formatDurationEn(totalAllocatedMins)}</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>Focused Time</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '14px', borderLeft: '1px solid var(--po-card-border)' }}>
          <div style={{ height: '32px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {[10, 18, 25, 32].map((h, i) => (
              <span key={h} style={{ width: '6px', height: `${h}px`, borderRadius: '3px', background: i === 3 ? 'var(--lab-text)' : 'var(--lab-text-muted)', opacity: i === 3 ? 1 : 0.6 }} />
            ))}
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', fontVariantNumeric: 'tabular-nums' }}>{remHoursToday}h {String(remMinsToday).padStart(2, '0')}m</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>Remaining 24h</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '14px', borderLeft: '1px solid var(--po-card-border)', minHeight: '54px' }}>
          <Layers size={18} color="var(--lab-text-muted)" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontWeight: '800', fontSize: '0.78rem' }}>Path Progress</div>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              {[16, 33, 50, 66, 83, 100].map(step => (
                <span key={step} style={{ height: '10px', flex: 1, borderRadius: '3px', background: completionPct >= step ? 'var(--po-blue, #173aff)' : 'var(--po-track)' }} />
              ))}
              <strong style={{ fontSize: '0.9rem', marginLeft: '6px', fontVariantNumeric: 'tabular-nums' }}>{completionPct}%</strong>
            </div>
          </div>
          <div className="po-corner-art" aria-hidden="true" />
        </div>
      </footer>

      {/* Task Session & Time Modal */}
      {sessionModalHabit && (
        <div onClick={() => setSessionModalHabitId(null)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 17, 21, 0.52)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} className="km-po-card" style={{ width: '100%', maxWidth: '480px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <Clock size={16} color="var(--po-blue, #173aff)" />
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sessionModalHabit.title}</h3>
              </div>
              <button type="button" onClick={() => setSessionModalHabitId(null)} className="km-lab-btn" style={{ padding: '4px 8px', borderRadius: '999px' }} aria-label="Close"><X size={15} /></button>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--po-card-subtle)', border: '1px solid var(--po-card-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-text-muted)' }}>Quick-add sessions (for partial progress)</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[5, 10, 15, 30, 45].map(m => (
                  <button key={m} type="button" onClick={() => addRoutineTaskSession(todayDate, sessionModalHabit.id, { minutes: m })} className="km-lab-btn" style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: '700' }}>
                    + {m}m
                  </button>
                ))}
              </div>
              {Array.isArray(sessionModalLog?.sessions) && sessionModalLog.sessions.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', paddingTop: '5px', borderTop: '1px dashed var(--po-card-border)' }}>
                  {sessionModalLog.sessions.map(s => (
                    <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: 'var(--po-card-bg)', border: '1px solid var(--po-card-border)' }}>
                      <span>{s.loggedAt ? `${s.loggedAt} · ` : ''}{s.minutes}m</span>
                      <button type="button" onClick={() => removeRoutineTaskSession(todayDate, sessionModalHabit.id, s.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#ef4444', display: 'inline-flex' }} title="Remove session"><X size={11} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>Duration:</span>
                <EasyDurationSelector totalMinutes={Number(taskTimeMinutes)} onChange={(mins) => setTaskTimeMinutes(String(mins))} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>Time:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <EasyTimeSelector value={taskTimeCompletedAt} onChange={(val) => setTaskTimeCompletedAt(val)} />
                  <button type="button" onClick={() => setTaskTimeCompletedAt(getCurrentTimeHHMM())} className="km-lab-btn" style={{ padding: '4px 8px', borderRadius: '999px', fontSize: '0.72rem' }}>Now</button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--po-card-border)' }}>
              <button type="button" onClick={() => addRoutineTaskSession(todayDate, sessionModalHabit.id, { minutes: Number(taskTimeMinutes || 15), loggedAt: taskTimeCompletedAt })} className="km-lab-btn" style={{ padding: '6px 12px', borderRadius: '999px', fontSize: '0.76rem' }}>
                <Plus size={13} /> Add Session
              </button>
              <button
                type="button"
                onClick={() => {
                  saveRoutineTaskLog(todayDate, sessionModalHabit.id, { minutes: Number(taskTimeMinutes || sessionModalHabit.minutes || 15), completedAt: taskTimeCompletedAt, completed: true });
                  setSessionModalHabitId(null);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '999px', border: 'none', background: 'var(--po-blue, #173aff)', color: '#ffffff', fontSize: '0.76rem', fontWeight: '700', cursor: 'pointer' }}
              >
                <Check size={13} /> Save (Completed)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Popup Modal */}
      {showCatManager && (
        <div onClick={() => setShowCatManager(false)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 17, 21, 0.52)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} className="km-po-card" style={{ width: '100%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={16} color="var(--po-blue, #173aff)" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Manage Routine Categories</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button type="button" onClick={() => restoreDefaultRoutineCategories()} className="km-lab-btn" style={{ padding: '4px 9px', borderRadius: '999px', fontSize: '0.72rem' }}>Restore Defaults</button>
                <button type="button" onClick={() => setShowCatManager(false)} className="km-lab-btn" style={{ padding: '4px 8px', borderRadius: '999px' }} aria-label="Close"><X size={15} /></button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {pagedModalCategories.map(cat => (
                <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '8px 10px', borderRadius: '11px', background: 'var(--po-card-subtle)', border: '1px solid var(--po-card-border)', flexWrap: 'wrap' }}>
                  {editingCatId === cat.id ? (
                    <>
                      <input type="text" className="km-lab-input" style={{ flex: 1, minWidth: '150px', padding: '5px 8px', fontSize: '0.82rem' }} value={editCatLabel} onChange={(e) => setEditCatLabel(e.target.value)} />
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {CATEGORY_SWATCHES.map(sw => (
                          <button key={sw} type="button" onClick={() => setEditCatColor(sw)} style={{ width: '16px', height: '16px', borderRadius: '50%', background: sw, border: editCatColor === sw ? '2px solid var(--lab-text)' : '1px solid transparent', cursor: 'pointer' }} />
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button type="button" onClick={() => { updateRoutineCategory(cat.id, { label: editCatLabel, color: editCatColor }); setEditingCatId(null); }} style={{ padding: '4px 8px', borderRadius: '999px', border: 'none', background: 'var(--po-blue, #173aff)', color: '#fff', fontSize: '0.74rem', cursor: 'pointer' }} title="Save"><Check size={12} /></button>
                        <button type="button" onClick={() => setEditingCatId(null)} className="km-lab-btn" style={{ padding: '4px 8px', fontSize: '0.74rem' }} title="Cancel"><X size={12} /></button>
                        <button type="button" onClick={() => { if (selectedCategoryFilter === cat.id) setSelectedCategoryFilter('all'); deleteRoutineCategory(cat.id); setEditingCatId(null); }} className="km-lab-btn" style={{ padding: '4px 8px', fontSize: '0.74rem', color: '#ef4444' }} title="Delete category"><Trash2 size={12} /></button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: '600' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }} />
                        <span>{cat.label}</span>
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button type="button" onClick={() => { setEditingCatId(cat.id); setEditCatLabel(cat.label); setEditCatColor(cat.color); }} title="Edit" style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}><Pencil size={13} /></button>
                        <button type="button" onClick={() => { if (selectedCategoryFilter === cat.id) setSelectedCategoryFilter('all'); deleteRoutineCategory(cat.id); }} title="Delete category" style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '4px' }}><Trash2 size={14} /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <PaginationBar page={safeCatModalPage} totalPages={catModalTotalPages} onPageChange={setCatModalPage} compact alwaysShow prevLabel="Prev" nextLabel="Next" />

            <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--po-card-border)' }}>
              <input type="text" className="km-lab-input" style={{ padding: '7px 10px', fontSize: '0.84rem' }} placeholder="Add new category (e.g., Exercise / Rest)" value={newCatLabel} onChange={(e) => setNewCatLabel(e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {CATEGORY_SWATCHES.map(sw => (
                    <button key={sw} type="button" onClick={() => setNewCatColor(sw)} style={{ width: '18px', height: '18px', borderRadius: '50%', background: sw, border: newCatColor === sw ? '2px solid var(--lab-text)' : '1px solid transparent', cursor: 'pointer' }} />
                  ))}
                </div>
                <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '999px', border: 'none', background: 'var(--po-blue, #173aff)', color: '#fff', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                  <Plus size={13} /> Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Task Popup Modal */}
      {showAddTask && (
        <div onClick={() => setShowAddTask(false)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 17, 21, 0.52)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} className="km-po-card" style={{ width: '100%', maxWidth: '500px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} color="var(--po-blue, #173aff)" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Add New Daily Task</h3>
              </div>
              <button type="button" onClick={() => setShowAddTask(false)} className="km-lab-btn" style={{ padding: '4px 8px', borderRadius: '999px' }} aria-label="Close"><X size={15} /></button>
            </div>

            <form onSubmit={handleAddHabit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>Task Name</div>
                <input type="text" required className="km-lab-input" placeholder="e.g., Morning meditation / Dhamma study" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>Description (optional)</div>
                <input type="text" className="km-lab-input" placeholder="e.g., Mindful breathing & reflection" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: '170px' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>Category</div>
                  <select aria-label="Category" className="km-lab-input" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>Duration</div>
                  <EasyDurationSelector totalMinutes={Number(newMinutes)} onChange={(mins) => setNewMinutes(String(mins))} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '6px' }}>
                <button type="button" onClick={() => setShowAddTask(false)} className="km-lab-btn" style={{ padding: '7px 14px', borderRadius: '999px', fontSize: '0.82rem' }}>Cancel</button>
                <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 16px', borderRadius: '999px', border: 'none', background: 'var(--po-blue, #173aff)', color: '#fff', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}>
                  <Plus size={14} /> Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
