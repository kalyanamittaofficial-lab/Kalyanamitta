import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  BookHeart,
  Lock,
  SlidersHorizontal,
  Pencil,
  Check,
  X,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  getRoutineCategories,
  addRoutineCategory,
  updateRoutineCategory,
  deleteRoutineCategory,
  getRoutineHabits,
  addRoutineHabit,
  updateRoutineHabit,
  deleteRoutineHabit,
  getRoutineLogForDate,
  saveRoutineWakeSleep,
  toggleRoutineHabit,
  getRoutineCategoryBreakdown
} from '../../services/dailyRoutineStore';
import { addPinPothaEntry } from '../../services/practiceEcosystemStore';
import { getTodayKey } from '../../services/cittaLogStore';
import { EasyTimeSelector, EasyDurationSelector } from '../../components/Lab/TimeSelectors';
import PaginationBar from '../../components/Lab/PaginationBar';

const CATEGORY_SWATCHES = ['#5F6E43', '#C06C47', '#98A27A', '#D8C3B0', '#B0B0AC', '#7A6855', '#4F6D7A', '#A35B3D'];

function getCurrentTimeHHMM() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function computeAwakeDuration(wake, sleep) {
  if (!wake || !sleep) return null;
  const [wh, wm] = wake.split(':').map(Number);
  const [sh, sm] = sleep.split(':').map(Number);
  if (Number.isNaN(wh) || Number.isNaN(sh)) return null;
  let diffMins = (sh * 60 + sm) - (wh * 60 + wm);
  if (diffMins < 0) diffMins += 24 * 60;
  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;
  return `පැ ${h} මි ${m}`;
}

function formatDurationLabel(mins) {
  const m = Number(mins || 0);
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return rem > 0 ? `පැ ${h} මි ${rem}` : `පැ ${h}`;
  }
  return `මි ${m}`;
}

function build24hDonutSegments(items, circumference = 2 * Math.PI * 56, fixedTotal = 1440) {
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

export default function DailyRoutine() {
  const navigate = useNavigate();
  const todayDate = getTodayKey();
  const [categories, setCategories] = useState(() => getRoutineCategories());
  const [habits, setHabits] = useState(() => getRoutineHabits());
  const [dayLog, setDayLog] = useState(() => getRoutineLogForDate(todayDate));

  // Filter, Donut & Pagination state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [donutMode, setDonutMode] = useState('planned'); // 'planned' | 'completed'
  const [donutPage, setDonutPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
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
  const [savedPinMsg, setSavedPinMsg] = useState('');

  // Edit habit state
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editHabitTitle, setEditHabitTitle] = useState('');
  const [editHabitDesc, setEditHabitDesc] = useState('');
  const [editHabitCat, setEditHabitCat] = useState('dhamma');
  const [editHabitMins, setEditHabitMins] = useState('15');

  useEffect(() => {
    const refresh = () => {
      const nextCats = getRoutineCategories();
      setCategories(nextCats);
      setHabits(getRoutineHabits());
      setDayLog(getRoutineLogForDate(todayDate));
      setNewCategory(prev => (nextCats.some(c => c.id === prev) ? prev : (nextCats[0]?.id || 'dhamma')));
    };
    window.addEventListener('labRoutineUpdated', refresh);
    return () => window.removeEventListener('labRoutineUpdated', refresh);
  }, [todayDate]);

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

  const checkedDhammaHabits = habits.filter(
    h => dayLog.checkedIds.includes(h.id) && (h.category || categories[0]?.id) === 'dhamma'
  );

  const handleSaveToPinPotha = () => {
    if (checkedDhammaHabits.length === 0) return;
    const totalMins = checkedDhammaHabits.reduce((acc, h) => acc + (h.minutes || 15), 0);
    const summaryLines = checkedDhammaHabits
      .map(h => `• ${h.title} (${formatDurationLabel(h.minutes)})${h.description ? ` — ${h.description}` : ''}`)
      .join('\n');
    const timeInfo = [
      dayLog.wakeTime ? `අවදි වීම: ${dayLog.wakeTime}` : null,
      dayLog.sleepTime ? `නින්දට යාම: ${dayLog.sleepTime}` : null
    ].filter(Boolean).join(' · ');

    addPinPothaEntry({
      entryType: 'sila',
      cittaType: 'kusala',
      scheduleType: 'once',
      durationMinutes: totalMins,
      entryDate: todayDate,
      title: `දෛනික ධර්ම කටයුතු (${checkedDhammaHabits.length})`,
      reflection: `${timeInfo ? `${timeInfo}\n` : ''}${summaryLines}`
    });
    setSavedPinMsg('පින් පොතට සුරකින ලදී.');
    setTimeout(() => setSavedPinMsg(''), 3000);
  };

  const awakeStr = computeAwakeDuration(dayLog.wakeTime, dayLog.sleepTime);
  const checkedCount = dayLog.checkedIds.length;
  const completionPct = habits.length > 0 ? Math.round((checkedCount / habits.length) * 100) : 0;

  // 24h Donut Data
  const breakdown = getRoutineCategoryBreakdown(todayDate, donutMode);
  const totalAllocatedMins = breakdown.items.reduce((acc, item) => acc + item.value, 0);
  const dayTotalMins = Math.max(1440, totalAllocatedMins);
  const donutRadius = 56;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutSegments = build24hDonutSegments(breakdown.items, donutCircumference, dayTotalMins);
  const legendItems = breakdown.items.map(item => ({
    ...item,
    pct: Math.round((item.value / dayTotalMins) * 100)
  }));

  const filteredHabits = selectedCategoryFilter === 'all'
    ? habits
    : habits.filter(h => (h.category || categories[0]?.id) === selectedCategoryFilter);

  const ITEMS_PER_PAGE = 5;
  const donutTotalPages = Math.max(1, Math.ceil(legendItems.length / ITEMS_PER_PAGE));
  const safeDonutPage = Math.min(donutPage, donutTotalPages);
  const pagedLegendItems = legendItems.slice((safeDonutPage - 1) * ITEMS_PER_PAGE, safeDonutPage * ITEMS_PER_PAGE);

  const taskTotalPages = Math.max(1, Math.ceil(filteredHabits.length / ITEMS_PER_PAGE));
  const safeTaskPage = Math.min(taskPage, taskTotalPages);
  const pagedHabits = filteredHabits.slice((safeTaskPage - 1) * ITEMS_PER_PAGE, safeTaskPage * ITEMS_PER_PAGE);

  const catModalTotalPages = Math.max(1, Math.ceil(categories.length / ITEMS_PER_PAGE));
  const safeCatModalPage = Math.min(catModalPage, catModalTotalPages);
  const pagedModalCategories = categories.slice((safeCatModalPage - 1) * ITEMS_PER_PAGE, safeCatModalPage * ITEMS_PER_PAGE);

  return (
    <div className="km-lab-page" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* TOP MODERN SCHEDULE & WAKE/SLEEP HEADER */}
      <div
        style={{
          borderRadius: '14px',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #A35B3D 0%, #B86F4E 100%)',
          color: '#FAF8F5',
          boxShadow: '0 6px 20px rgba(163, 91, 61, 0.16)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
          alignItems: 'center'
        }}
      >
        {/* Left Title & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, fontFamily: 'var(--font-sinhala)' }}>
              දෛනික දහම් හා ජීවන රටාව
            </h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.16)',
              fontSize: '0.7rem',
              fontWeight: '600'
            }}>
              <Lock size={10} /> {todayDate}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'rgba(250,248,245,0.9)' }}>
            <span>සම්පූර්ණ කළ කාර්ය: <strong>{checkedCount} / {habits.length} ({completionPct}%)</strong></span>
            {awakeStr && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> අවදි කාලය: <strong>{awakeStr}</strong>
              </span>
            )}
          </div>

          <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.22)', overflow: 'hidden', maxWidth: '340px' }}>
            <div style={{ width: `${completionPct}%`, height: '100%', background: '#FAF8F5', borderRadius: '999px', transition: 'width 0.25s ease' }} />
          </div>
        </div>

        {/* Right Wake & Sleep Time Pill Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px' }}>
          <div style={{ padding: '10px 12px', borderRadius: '12px', background: '#FAF8F5', color: '#231F1B' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '700' }}>
                <Sun size={14} color="#C06C47" /> අවදි වූ වේලාව
              </span>
              <button
                type="button"
                onClick={() => saveRoutineWakeSleep(todayDate, { wakeTime: getCurrentTimeHHMM() })}
                className="km-lab-btn"
                style={{ padding: '2px 8px', fontSize: '0.7rem' }}
              >
                දැන්
              </button>
            </div>
            <EasyTimeSelector
              value={dayLog.wakeTime || '05:30'}
              onChange={(val) => saveRoutineWakeSleep(todayDate, { wakeTime: val })}
            />
          </div>

          <div style={{ padding: '10px 12px', borderRadius: '12px', background: '#FAF8F5', color: '#231F1B' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '700' }}>
                <Moon size={14} color="#5F6E43" /> නින්දට යන වේලාව
              </span>
              <button
                type="button"
                onClick={() => saveRoutineWakeSleep(todayDate, { sleepTime: getCurrentTimeHHMM() })}
                className="km-lab-btn"
                style={{ padding: '2px 8px', fontSize: '0.7rem' }}
              >
                දැන්
              </button>
            </div>
            <EasyTimeSelector
              value={dayLog.sleepTime || '22:00'}
              onChange={(val) => saveRoutineWakeSleep(todayDate, { sleepTime: val })}
            />
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN WORKSPACE */}
      <div className="km-lab-routine-grid">
        {/* LEFT COLUMN: 24-Hour Donut & Category Studio */}
        <div className="km-lab-card" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.94rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Target size={15} color="var(--lab-gold)" /> පැය 24 කාල බෙදීම
            </span>

            <div style={{ display: 'inline-flex', border: '1px solid var(--lab-border)', borderRadius: '8px', overflow: 'hidden' }}>
              {[
                { id: 'planned', label: 'සැලසුම් කළ' },
                { id: 'completed', label: 'අද සිදු කළ' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setDonutMode(m.id)}
                  style={{
                    padding: '4px 9px',
                    border: 'none',
                    background: donutMode === m.id ? 'var(--lab-accent)' : 'var(--lab-bg-elevated)',
                    color: donutMode === m.id ? 'var(--lab-accent-fg)' : 'var(--lab-text-muted)',
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Donut Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '108px', height: '108px' }}>
              <svg viewBox="0 0 144 144" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle
                  cx="72"
                  cy="72"
                  r={donutRadius}
                  fill="none"
                  stroke="var(--lab-bg-subtle)"
                  strokeWidth="16"
                />
                {donutSegments.map(seg => {
                  const isDimmed = selectedCategoryFilter !== 'all' && selectedCategoryFilter !== seg.id;
                  return (
                    <circle
                      key={seg.id}
                      cx="72"
                      cy="72"
                      r={donutRadius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="16"
                      strokeOpacity={isDimmed ? 0.25 : 1}
                      strokeDasharray={seg.dasharray}
                      strokeDashoffset={seg.dashoffset}
                      strokeLinecap="butt"
                      style={{ cursor: 'pointer', transition: 'stroke-opacity 0.15s ease' }}
                      onClick={() => setSelectedCategoryFilter(prev => (prev === seg.id ? 'all' : seg.id))}
                    />
                  );
                })}
              </svg>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--lab-text-muted)' }}>
              වෙන් කළ මුළු කාලය: <strong style={{ color: 'var(--lab-text)' }}>{formatDurationLabel(totalAllocatedMins)}</strong> / පැ 24
            </div>
          </div>

          {/* Interactive Category Legend (Click to filter tasks) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {pagedLegendItems.map(seg => {
              const isSelected = selectedCategoryFilter === seg.id;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryFilter(prev => (prev === seg.id ? 'all' : seg.id));
                    setTaskPage(1);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '5px 8px',
                    borderRadius: '7px',
                    border: `1px solid ${isSelected ? seg.color : 'transparent'}`,
                    background: isSelected ? `${seg.color}18` : 'var(--lab-bg-subtle)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sinhala)',
                    fontSize: '0.73rem',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'var(--lab-text)', minWidth: 0 }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: isSelected ? '700' : '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {seg.label}
                    </span>
                  </span>
                  <span style={{ fontWeight: '700', color: 'var(--lab-text)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                    {formatDurationLabel(seg.value)} ({seg.pct}%)
                  </span>
                </button>
              );
            })}
          </div>

          <PaginationBar
            page={safeDonutPage}
            totalPages={donutTotalPages}
            onPageChange={setDonutPage}
            compact
          />

          {/* Customize Categories Modal Trigger */}
          <button
            type="button"
            onClick={() => setShowCatManager(true)}
            className="km-lab-btn"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
          >
            <SlidersHorizontal size={13} />
            <span>අංශ කළමනාකරණය / අලුත් අංශ</span>
          </button>
        </div>

        {/* RIGHT COLUMN: Tasks Management & Checklist */}
        <div className="km-lab-card" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Tasks Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.04rem', fontWeight: '700', margin: '0 0 2px 0' }}>
                දෛනික කාර්ය ලැයිස්තුව ({filteredHabits.length})
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)' }}>
                සලකුණු කරන කාර්යයන් ප්‍රධාන පුවරුවේ පැය 24 ප්‍රස්තාරයට ස්වයංක්‍රීයව එක් වේ.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {savedPinMsg && (
                <span style={{ fontSize: '0.78rem', color: '#5F6E43', fontWeight: '700' }}>{savedPinMsg}</span>
              )}
              <button
                type="button"
                onClick={() => {
                  if (selectedCategoryFilter !== 'all') {
                    setNewCategory(selectedCategoryFilter);
                  }
                  setShowAddTask(true);
                }}
                className="km-lab-btn"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <Plus size={14} />
                <span>නව කාර්යයක්</span>
              </button>
              {(selectedCategoryFilter === 'all' || selectedCategoryFilter === 'dhamma') && checkedDhammaHabits.length > 0 && (
                <button
                  type="button"
                  onClick={handleSaveToPinPotha}
                  className="km-lab-btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  <BookHeart size={14} />
                  <span>පින් පොතට සුරකින්න ({checkedDhammaHabits.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryFilter('all');
                setTaskPage(1);
              }}
              className={selectedCategoryFilter === 'all' ? 'km-lab-btn-primary' : 'km-lab-btn'}
              style={{ padding: '4px 10px', fontSize: '0.73rem' }}
            >
              සියල්ල ({habits.length})
            </button>
            {categories.map(cat => {
              const count = habits.filter(h => (h.category || categories[0]?.id) === cat.id).length;
              const active = selectedCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryFilter(active ? 'all' : cat.id);
                    setTaskPage(1);
                  }}
                  className={active ? 'km-lab-btn-primary' : 'km-lab-btn'}
                  style={{ padding: '4px 10px', fontSize: '0.73rem', gap: '5px' }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: active ? '#FAF8F5' : cat.color }} />
                  <span>{cat.label} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Checklist Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pagedHabits.length === 0 ? (
              <div style={{ padding: '22px', textAlign: 'center', fontSize: '0.84rem', color: 'var(--lab-text-muted)', background: 'var(--lab-bg-subtle)', borderRadius: '10px' }}>
                මෙම අංශය සඳහා තවම කාර්යයන් එක් කර නැත. ඉහත &ldquo;නව කාර්යයක්&rdquo; බොත්තමෙන් එක් කරන්න.
              </div>
            ) : pagedHabits.map(habit => {
              const checked = dayLog.checkedIds.includes(habit.id);
              const cat = categories.find(c => c.id === habit.category) || categories[0];

              if (editingHabitId === habit.id) {
                return (
                  <div
                    key={habit.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'var(--lab-bg-subtle)',
                      border: '1px solid var(--lab-accent)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="km-lab-input"
                        style={{ flex: 1, minWidth: '180px' }}
                        value={editHabitTitle}
                        onChange={(e) => setEditHabitTitle(e.target.value)}
                      />
                      <select
                        className="km-lab-input"
                        style={{ width: 'auto', minWidth: '150px' }}
                        value={editHabitCat}
                        onChange={(e) => setEditHabitCat(e.target.value)}
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                      <EasyDurationSelector
                        totalMinutes={Number(editHabitMins)}
                        onChange={(mins) => setEditHabitMins(String(mins))}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        className="km-lab-input"
                        style={{ flex: 1, minWidth: '180px' }}
                        placeholder="විස්තරය (විකල්පයි)"
                        value={editHabitDesc}
                        onChange={(e) => setEditHabitDesc(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => saveEditHabit(habit.id)}
                        className="km-lab-btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Check size={13} /> සුරකින්න
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingHabitId(null)}
                        className="km-lab-btn"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <X size={13} /> අවලංගු
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={habit.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '9px',
                    background: checked ? 'rgba(95, 110, 67, 0.10)' : 'var(--lab-bg-subtle)',
                    border: `1px solid ${checked ? 'rgba(95, 110, 67, 0.35)' : 'var(--lab-border)'}`,
                    borderLeft: `4px solid ${cat ? cat.color : 'var(--lab-accent)'}`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleRoutineHabit(todayDate, habit.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--lab-text)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      padding: 0,
                      fontFamily: 'var(--font-sinhala)'
                    }}
                  >
                    {checked
                      ? <CheckCircle2 size={18} color="#5F6E43" style={{ flexShrink: 0 }} />
                      : <Circle size={18} color="var(--lab-text-muted)" style={{ flexShrink: 0 }} />
                    }
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{
                        fontSize: '0.86rem',
                        fontWeight: checked ? '700' : '600'
                      }}>
                        {habit.title}
                      </span>
                      {habit.description && (
                        <span style={{
                          fontSize: '0.72rem',
                          color: 'var(--lab-text-muted)',
                          lineHeight: 1.35
                        }}>
                          {habit.description}
                        </span>
                      )}
                    </div>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {cat && (
                      <span
                        className="km-lab-tag"
                        style={{
                          borderColor: `${cat.color}44`,
                          color: cat.color,
                          background: `${cat.color}12`
                        }}
                      >
                        {cat.label}
                      </span>
                    )}
                    <span style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--lab-text-muted)' }}>
                      {formatDurationLabel(habit.minutes)}
                    </span>
                    <button
                      type="button"
                      onClick={() => startEditHabit(habit)}
                      title="සංස්කරණය කරන්න"
                      style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRoutineHabit(habit.id)}
                      title="ඉවත් කරන්න"
                      style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <PaginationBar
            page={safeTaskPage}
            totalPages={taskTotalPages}
            onPageChange={setTaskPage}
            compact
          />

          <div style={{ paddingTop: '6px', borderTop: '1px solid var(--lab-border)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/lab')}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--lab-text-muted)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>ප්‍රධාන පුවරුවේ ප්‍රස්තාරය බලන්න</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Management Popup Modal */}
      {showCatManager && (
        <div
          onClick={() => setShowCatManager(false)}
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
              maxWidth: '480px',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={16} color="var(--lab-gold)" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>දින චර්යා අංශ කළමනාකරණය</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCatManager(false)}
                className="km-lab-btn"
                style={{ padding: '4px 8px' }}
                aria-label="වසන්න"
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {pagedModalCategories.map(cat => (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'var(--lab-bg-subtle)',
                    border: '1px solid var(--lab-border)',
                    flexWrap: 'wrap'
                  }}
                >
                  {editingCatId === cat.id ? (
                    <>
                      <input
                        type="text"
                        className="km-lab-input"
                        style={{ flex: 1, minWidth: '150px', padding: '5px 8px', fontSize: '0.82rem' }}
                        value={editCatLabel}
                        onChange={(e) => setEditCatLabel(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {CATEGORY_SWATCHES.map(sw => (
                          <button
                            key={sw}
                            type="button"
                            onClick={() => setEditCatColor(sw)}
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              background: sw,
                              border: editCatColor === sw ? '2px solid var(--lab-text)' : '1px solid transparent',
                              cursor: 'pointer'
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            updateRoutineCategory(cat.id, { label: editCatLabel, color: editCatColor });
                            setEditingCatId(null);
                          }}
                          className="km-lab-btn-primary"
                          style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                        >
                          <Check size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          className="km-lab-btn"
                          style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: '600' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }} />
                        <span>{cat.label}</span>
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setEditCatLabel(cat.label);
                            setEditCatColor(cat.color);
                          }}
                          title="සංස්කරණය කරන්න"
                          style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}
                        >
                          <Pencil size={13} />
                        </button>
                        {categories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedCategoryFilter === cat.id) setSelectedCategoryFilter('all');
                              deleteRoutineCategory(cat.id);
                            }}
                            title="ඉවත් කරන්න"
                            style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <PaginationBar
              page={safeCatModalPage}
              totalPages={catModalTotalPages}
              onPageChange={setCatModalPage}
              compact
            />

            <form
              onSubmit={handleAddCategory}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingTop: '10px',
                borderTop: '1px solid var(--lab-border)'
              }}
            >
              <input
                type="text"
                className="km-lab-input"
                style={{ padding: '7px 10px', fontSize: '0.84rem' }}
                placeholder="නව අංශයක් එක් කරන්න (උදා: ව්‍යායාම / විවේකය)"
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {CATEGORY_SWATCHES.map(sw => (
                    <button
                      key={sw}
                      type="button"
                      onClick={() => setNewCatColor(sw)}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: sw,
                        border: newCatColor === sw ? '2px solid var(--lab-text)' : '1px solid transparent',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
                <button type="submit" className="km-lab-btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                  <Plus size={13} /> එක් කරන්න
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Task Popup Modal */}
      {showAddTask && (
        <div
          onClick={() => setShowAddTask(false)}
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
              maxWidth: '500px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} color="var(--lab-gold)" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>නව දෛනික කාර්යයක් එක් කරන්න</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="km-lab-btn"
                style={{ padding: '4px 8px' }}
                aria-label="වසන්න"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddHabit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>
                  කාර්යයේ නම
                </div>
                <input
                  type="text"
                  required
                  className="km-lab-input"
                  placeholder="උදා: විශ්වවිද්‍යාල අධ්‍යයනය / පිරිත් සජ්ඣායනාව"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>
                  විස්තරය (විකල්පයි)
                </div>
                <input
                  type="text"
                  className="km-lab-input"
                  placeholder="උදා: කරණීය මෙත්ත සූත්‍රය හා මෛත්‍රී භාවනාව"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: '170px' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>
                    අංශය
                  </div>
                  <select
                    aria-label="අංශය"
                    className="km-lab-input"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>
                    කාලය
                  </div>
                  <EasyDurationSelector
                    totalMinutes={Number(newMinutes)}
                    onChange={(mins) => setNewMinutes(String(mins))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--lab-border)' }}>
                <button type="button" onClick={() => setShowAddTask(false)} className="km-lab-btn">
                  අවලංගු කරන්න
                </button>
                <button type="submit" className="km-lab-btn-primary">
                  <Plus size={14} /> එක් කරන්න
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
