import { upsertLabRow, deleteLabRow, fetchUserLabRows } from './labSyncService';

const HABITS_KEY = 'km_lab_routine_habits_v1';
const LOGS_KEY = 'km_lab_routine_logs_v1';
const CATEGORIES_KEY = 'km_lab_routine_categories_v1';
const ACTIVE_TIMER_KEY = 'km_lab_routine_active_timer_v1';
const DELETED_DEFAULT_CATS_KEY = 'km_lab_routine_deleted_default_cats_v1';
const DELETED_DEFAULT_HABITS_KEY = 'km_lab_routine_deleted_default_habits_v1';

function getDeletedDefaultCatIds() {
  try {
    const raw = localStorage.getItem(DELETED_DEFAULT_CATS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getDeletedDefaultHabitIds() {
  try {
    const raw = localStorage.getItem(DELETED_DEFAULT_HABITS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const DEFAULT_ROUTINE_CATEGORIES = [
  { id: 'dhamma', label: 'Dhamma Practice', color: '#5F6E43' },
  { id: 'education', label: 'Education (School / University)', color: '#C06C47' },
  { id: 'job', label: 'Work & Career', color: '#98A27A' },
  { id: 'family', label: 'Family', color: '#D8C3B0' },
  { id: 'friends', label: 'Friends & Community', color: '#B0B0AC' }
];

const LEGACY_CATEGORY_LABELS_TO_EN = {
  'ධර්ම කටයුතු': 'Dhamma Practice',
  'අධ්‍යාපනය (පාසල / විශ්වවිද්‍යාලය)': 'Education (School / University)',
  'රැකියාව': 'Work & Career',
  'පවුල': 'Family',
  'මිතුරන් හා සම්බන්ධතා': 'Friends & Community'
};

function translateLegacyCategory(cat) {
  if (!cat || typeof cat !== 'object') return cat;
  const translated = LEGACY_CATEGORY_LABELS_TO_EN[cat.label];
  return translated ? { ...cat, label: translated } : cat;
}

export const ROUTINE_CATEGORIES = DEFAULT_ROUTINE_CATEGORIES;

export function getRoutineCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_ROUTINE_CATEGORIES));
      return DEFAULT_ROUTINE_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_ROUTINE_CATEGORIES;
    }
    let changed = false;
    const normalized = parsed.map(c => {
      const next = translateLegacyCategory(c);
      if (next !== c) changed = true;
      return next;
    });
    if (changed) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch {
    return DEFAULT_ROUTINE_CATEGORIES;
  }
}

export function addRoutineCategory({ label, color = '#5F6E43' }) {
  const cleanLabel = String(label || '').trim();
  if (!cleanLabel) return getRoutineCategories();
  const all = getRoutineCategories();
  const item = {
    id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    label: cleanLabel,
    color
  };
  const next = [...all, item];
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
  upsertLabRow('lab_routine_categories', { id: item.id, label: item.label, color: item.color });
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  return next;
}

export function updateRoutineCategory(id, { label, color }) {
  const all = getRoutineCategories();
  let updatedItem = null;
  const next = all.map(c => {
    if (c.id !== id) return c;
    updatedItem = {
      ...c,
      label: label !== undefined ? String(label).trim() || c.label : c.label,
      color: color !== undefined ? color : c.color
    };
    return updatedItem;
  });
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
  if (updatedItem) {
    upsertLabRow('lab_routine_categories', { id: updatedItem.id, label: updatedItem.label, color: updatedItem.color }, 'id');
  }
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  return next;
}

export function deleteRoutineCategory(id) {
  const all = getRoutineCategories();
  if (DEFAULT_ROUTINE_CATEGORIES.some(d => d.id === id)) {
    const deleted = new Set(getDeletedDefaultCatIds());
    deleted.add(id);
    localStorage.setItem(DELETED_DEFAULT_CATS_KEY, JSON.stringify([...deleted]));
  }
  let next = all.filter(c => c.id !== id);
  if (next.length === 0) {
    localStorage.removeItem(DELETED_DEFAULT_CATS_KEY);
    next = [...DEFAULT_ROUTINE_CATEGORIES];
  }
  const fallbackId = next[0].id;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
  deleteLabRow('lab_routine_categories', { id });

  // Reassign any habits pointing to the deleted category
  const habits = getRoutineHabits();
  const updatedHabits = habits.map(h => {
    if (h.category !== id) return h;
    const reassigned = { ...h, category: fallbackId };
    upsertLabRow('lab_routine_habits', {
      id: reassigned.id,
      category_id: reassigned.category,
      title: reassigned.title,
      description: reassigned.description || '',
      minutes: reassigned.minutes,
      citta_type: reassigned.cittaType || 'kusala'
    }, 'id');
    return reassigned;
  });
  localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  return next;
}

export function restoreDefaultRoutineCategories() {
  localStorage.removeItem(DELETED_DEFAULT_CATS_KEY);
  const current = getRoutineCategories();
  const existingIds = new Set(current.map(c => c.id));
  const missingDefaults = DEFAULT_ROUTINE_CATEGORIES.filter(d => !existingIds.has(d.id));
  const next = [...missingDefaults, ...current];
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  return next;
}

const DEFAULT_HABITS = [
  { id: 'hab-morning-vandana', title: 'උදේ බුද්ධ වන්දනාව', category: 'dhamma', minutes: 15, cittaType: 'kusala' },
  { id: 'hab-evening-vandana', title: 'හවස බුද්ධ වන්දනාව', category: 'dhamma', minutes: 15, cittaType: 'kusala' },
  { id: 'hab-meditation', title: 'භාවනාව (ආනාපානසති / මෙත්තා)', category: 'dhamma', minutes: 20, cittaType: 'kusala' },
  { id: 'hab-sutta-study', title: 'සූත්‍ර අධ්‍යයනය', category: 'dhamma', minutes: 20, cittaType: 'kusala' },
  { id: 'hab-sila', title: 'පන්සිල් සිහිපත් කිරීම', category: 'dhamma', minutes: 10, cittaType: 'kusala' }
];

export function getRoutineHabits() {
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    if (!raw) {
      localStorage.setItem(HABITS_KEY, JSON.stringify(DEFAULT_HABITS));
      return DEFAULT_HABITS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_HABITS;
  } catch {
    return DEFAULT_HABITS;
  }
}

export function addRoutineHabit({ title, description = '', category = 'dhamma', minutes = 15, cittaType = 'kusala' }) {
  const all = getRoutineHabits();
  const categories = getRoutineCategories();
  const validCategory = categories.some(c => c.id === category) ? category : categories[0].id;
  const item = {
    id: `hab-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    title: title.trim(),
    description: String(description || '').trim(),
    category: validCategory,
    minutes: Math.max(1, Number(minutes || 15)),
    cittaType: cittaType === 'akusala' ? 'akusala' : 'kusala'
  };
  const next = [...all, item];
  localStorage.setItem(HABITS_KEY, JSON.stringify(next));
  upsertLabRow('lab_routine_habits', {
    id: item.id,
    category_id: item.category,
    title: item.title,
    description: item.description,
    minutes: item.minutes,
    citta_type: item.cittaType
  });
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  return next;
}

export function updateRoutineHabit(id, { title, description, category, minutes }) {
  const all = getRoutineHabits();
  const categories = getRoutineCategories();
  let updatedItem = null;
  const next = all.map(h => {
    if (h.id !== id) return h;
    const validCat = category && categories.some(c => c.id === category) ? category : h.category;
    updatedItem = {
      ...h,
      title: title !== undefined ? String(title).trim() || h.title : h.title,
      description: description !== undefined ? String(description).trim() : h.description,
      category: validCat,
      minutes: minutes !== undefined ? Math.max(1, Number(minutes || 15)) : h.minutes
    };
    return updatedItem;
  });
  localStorage.setItem(HABITS_KEY, JSON.stringify(next));
  if (updatedItem) {
    upsertLabRow('lab_routine_habits', {
      id: updatedItem.id,
      category_id: updatedItem.category,
      title: updatedItem.title,
      description: updatedItem.description || '',
      minutes: updatedItem.minutes,
      citta_type: updatedItem.cittaType || 'kusala'
    }, 'id');
  }
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  return next;
}

export function deleteRoutineHabit(id) {
  if (DEFAULT_HABITS.some(d => d.id === id)) {
    const deleted = new Set(getDeletedDefaultHabitIds());
    deleted.add(id);
    localStorage.setItem(DELETED_DEFAULT_HABITS_KEY, JSON.stringify([...deleted]));
  }
  const next = getRoutineHabits().filter(h => h.id !== id);
  localStorage.setItem(HABITS_KEY, JSON.stringify(next));
  deleteLabRow('lab_routine_habits', { id });
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  return next;
}

export function restoreDefaultRoutineHabits() {
  localStorage.removeItem(DELETED_DEFAULT_HABITS_KEY);
  const current = getRoutineHabits();
  const existingIds = new Set(current.map(h => h.id));
  const missingDefaults = DEFAULT_HABITS.filter(d => !existingIds.has(d.id));
  const next = [...missingDefaults, ...current];
  localStorage.setItem(HABITS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  return next;
}

export function hasMissingDefaultHabits() {
  const existingIds = new Set(getRoutineHabits().map(h => h.id));
  return DEFAULT_HABITS.some(d => !existingIds.has(d.id));
}

export function getAllRoutineLogs() {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getRoutineLogForDate(dateStr) {
  const all = getAllRoutineLogs();
  const entry = all[dateStr];
  if (!entry) {
    return { date: dateStr, wakeTime: '', sleepTime: '', checkedIds: [], taskLogs: {} };
  }
  return {
    ...entry,
    checkedIds: Array.isArray(entry.checkedIds) ? entry.checkedIds : [],
    taskLogs: entry.taskLogs && typeof entry.taskLogs === 'object' ? entry.taskLogs : {}
  };
}

export function saveRoutineWakeSleep(dateStr, { wakeTime, sleepTime }) {
  const all = getAllRoutineLogs();
  const prev = all[dateStr] || { date: dateStr, wakeTime: '', sleepTime: '', checkedIds: [], taskLogs: {} };
  all[dateStr] = {
    ...prev,
    wakeTime: wakeTime !== undefined ? wakeTime : prev.wakeTime,
    sleepTime: sleepTime !== undefined ? sleepTime : prev.sleepTime,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(LOGS_KEY, JSON.stringify(all));
  upsertLabRow(
    'lab_routine_logs',
    {
      log_date: dateStr,
      wake_time: all[dateStr].wakeTime || '',
      sleep_time: all[dateStr].sleepTime || '',
      checked_ids: all[dateStr].checkedIds || [],
      updated_at: all[dateStr].updatedAt
    },
    'user_id,log_date'
  );
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  return all[dateStr];
}

export function getHabitStatusForDay(dayLog, habitId) {
  if (dayLog?.checkedIds?.includes(habitId)) return 'completed';
  const s = dayLog?.taskLogs?.[habitId]?.status;
  if (s === 'ongoing' || s === 'completed' || s === 'pending') return s;
  return 'pending';
}

export function setRoutineTaskStatus(dateStr, habitId, status) {
  const validStatus = status === 'completed' || status === 'ongoing' ? status : 'pending';
  const all = getAllRoutineLogs();
  const prev = all[dateStr] || { date: dateStr, wakeTime: '', sleepTime: '', checkedIds: [], taskLogs: {} };
  const prevChecked = Array.isArray(prev.checkedIds) ? prev.checkedIds : [];
  const nextIds = validStatus === 'completed'
    ? (prevChecked.includes(habitId) ? prevChecked : [...prevChecked, habitId])
    : prevChecked.filter(id => id !== habitId);

  const prevTaskLog = (prev.taskLogs && typeof prev.taskLogs === 'object' ? prev.taskLogs[habitId] : null) || {};
  const nextTaskLogs = {
    ...(prev.taskLogs && typeof prev.taskLogs === 'object' ? prev.taskLogs : {}),
    [habitId]: {
      ...prevTaskLog,
      status: validStatus,
      updatedAt: new Date().toISOString()
    }
  };

  all[dateStr] = {
    ...prev,
    checkedIds: nextIds,
    taskLogs: nextTaskLogs,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(LOGS_KEY, JSON.stringify(all));
  upsertLabRow(
    'lab_routine_logs',
    {
      log_date: dateStr,
      wake_time: all[dateStr].wakeTime || '',
      sleep_time: all[dateStr].sleepTime || '',
      checked_ids: all[dateStr].checkedIds,
      updated_at: all[dateStr].updatedAt
    },
    'user_id,log_date'
  );
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  window.dispatchEvent(new CustomEvent('labCittaLogsUpdated'));
  return all[dateStr];
}

export function saveRoutineTaskLog(dateStr, habitId, { minutes, completedAt, completed = true, status }) {
  const all = getAllRoutineLogs();
  const prev = all[dateStr] || { date: dateStr, wakeTime: '', sleepTime: '', checkedIds: [], taskLogs: {} };
  const prevChecked = Array.isArray(prev.checkedIds) ? prev.checkedIds : [];
  const nextStatus = status || (completed ? 'completed' : 'ongoing');
  const nextIds = nextStatus === 'completed'
    ? (prevChecked.includes(habitId) ? prevChecked : [...prevChecked, habitId])
    : prevChecked.filter(id => id !== habitId);

  const prevTaskLog = (prev.taskLogs && typeof prev.taskLogs === 'object' ? prev.taskLogs[habitId] : null) || {};
  const nextTaskLogs = {
    ...(prev.taskLogs && typeof prev.taskLogs === 'object' ? prev.taskLogs : {}),
    [habitId]: {
      ...prevTaskLog,
      status: nextStatus,
      minutes: Math.max(1, Number(minutes || 15)),
      completedAt: completedAt || '',
      updatedAt: new Date().toISOString()
    }
  };

  all[dateStr] = {
    ...prev,
    checkedIds: nextIds,
    taskLogs: nextTaskLogs,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(LOGS_KEY, JSON.stringify(all));
  upsertLabRow(
    'lab_routine_logs',
    {
      log_date: dateStr,
      wake_time: all[dateStr].wakeTime || '',
      sleep_time: all[dateStr].sleepTime || '',
      checked_ids: all[dateStr].checkedIds,
      updated_at: all[dateStr].updatedAt
    },
    'user_id,log_date'
  );
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  window.dispatchEvent(new CustomEvent('labCittaLogsUpdated'));
  return all[dateStr];
}

export function toggleRoutineHabit(dateStr, habitId) {
  const all = getAllRoutineLogs();
  const prev = all[dateStr] || { date: dateStr, wakeTime: '', sleepTime: '', checkedIds: [], taskLogs: {} };
  const exists = prev.checkedIds.includes(habitId);
  const nextIds = exists
    ? prev.checkedIds.filter(id => id !== habitId)
    : [...prev.checkedIds, habitId];

  const prevTaskLog = (prev.taskLogs && typeof prev.taskLogs === 'object' ? prev.taskLogs[habitId] : null) || {};
  const nextTaskLogs = {
    ...(prev.taskLogs && typeof prev.taskLogs === 'object' ? prev.taskLogs : {}),
    [habitId]: {
      ...prevTaskLog,
      status: exists ? 'pending' : 'completed',
      updatedAt: new Date().toISOString()
    }
  };

  all[dateStr] = {
    ...prev,
    checkedIds: nextIds,
    taskLogs: nextTaskLogs,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(LOGS_KEY, JSON.stringify(all));
  upsertLabRow(
    'lab_routine_logs',
    {
      log_date: dateStr,
      wake_time: all[dateStr].wakeTime || '',
      sleep_time: all[dateStr].sleepTime || '',
      checked_ids: all[dateStr].checkedIds,
      updated_at: all[dateStr].updatedAt
    },
    'user_id,log_date'
  );
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  window.dispatchEvent(new CustomEvent('labCittaLogsUpdated'));
  return all[dateStr];
}

export function addRoutineTaskSession(dateStr, habitId, { minutes, loggedAt } = {}) {
  const mins = Math.max(1, Number(minutes || 5));
  const now = new Date();
  const hhmm = loggedAt || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const all = getAllRoutineLogs();
  const prev = all[dateStr] || { date: dateStr, wakeTime: '', sleepTime: '', checkedIds: [], taskLogs: {} };
  const prevChecked = Array.isArray(prev.checkedIds) ? prev.checkedIds : [];
  const prevTaskLog = (prev.taskLogs && typeof prev.taskLogs === 'object' ? prev.taskLogs[habitId] : null) || {};
  const existingSessions = Array.isArray(prevTaskLog.sessions)
    ? prevTaskLog.sessions
    : (prevTaskLog.minutes ? [{ id: `s-init-${Date.now()}`, minutes: prevTaskLog.minutes, loggedAt: prevTaskLog.completedAt || '' }] : []);

  const nextSessions = [
    ...existingSessions,
    { id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, minutes: mins, loggedAt: hhmm }
  ];
  const totalMinutes = nextSessions.reduce((acc, s) => acc + Math.max(1, Number(s.minutes || 0)), 0);
  const nextStatus = prevChecked.includes(habitId) ? 'completed' : 'ongoing';

  const nextTaskLogs = {
    ...(prev.taskLogs && typeof prev.taskLogs === 'object' ? prev.taskLogs : {}),
    [habitId]: {
      ...prevTaskLog,
      status: nextStatus,
      sessions: nextSessions,
      minutes: totalMinutes,
      completedAt: hhmm,
      updatedAt: now.toISOString()
    }
  };

  all[dateStr] = {
    ...prev,
    checkedIds: prevChecked,
    taskLogs: nextTaskLogs,
    updatedAt: now.toISOString()
  };
  localStorage.setItem(LOGS_KEY, JSON.stringify(all));
  upsertLabRow(
    'lab_routine_logs',
    {
      log_date: dateStr,
      wake_time: all[dateStr].wakeTime || '',
      sleep_time: all[dateStr].sleepTime || '',
      checked_ids: all[dateStr].checkedIds,
      updated_at: all[dateStr].updatedAt
    },
    'user_id,log_date'
  );
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  window.dispatchEvent(new CustomEvent('labCittaLogsUpdated'));
  return all[dateStr];
}

export function removeRoutineTaskSession(dateStr, habitId, sessionId) {
  const all = getAllRoutineLogs();
  const prev = all[dateStr];
  if (!prev || !prev.taskLogs?.[habitId]) return prev;
  const prevTaskLog = prev.taskLogs[habitId];
  const nextSessions = (Array.isArray(prevTaskLog.sessions) ? prevTaskLog.sessions : []).filter(s => s.id !== sessionId);
  const totalMinutes = nextSessions.reduce((acc, s) => acc + Math.max(1, Number(s.minutes || 0)), 0);

  const nextTaskLogs = {
    ...prev.taskLogs,
    [habitId]: {
      ...prevTaskLog,
      sessions: nextSessions,
      minutes: totalMinutes > 0 ? totalMinutes : undefined,
      updatedAt: new Date().toISOString()
    }
  };

  all[dateStr] = {
    ...prev,
    taskLogs: nextTaskLogs,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(LOGS_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  window.dispatchEvent(new CustomEvent('labCittaLogsUpdated'));
  return all[dateStr];
}

export function getActiveRoutineTimer() {
  try {
    const raw = localStorage.getItem(ACTIVE_TIMER_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && parsed.habitId && parsed.startedAt ? parsed : null;
  } catch {
    return null;
  }
}

export function startRoutineTimer(dateStr, habitId) {
  const timer = { dateStr, habitId, startedAt: Date.now() };
  localStorage.setItem(ACTIVE_TIMER_KEY, JSON.stringify(timer));
  setRoutineTaskStatus(dateStr, habitId, 'ongoing');
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  return timer;
}

export function stopRoutineTimer() {
  const timer = getActiveRoutineTimer();
  localStorage.removeItem(ACTIVE_TIMER_KEY);
  if (!timer) return null;
  const elapsedMins = Math.max(1, Math.round((Date.now() - timer.startedAt) / 60000));
  addRoutineTaskSession(timer.dateStr, timer.habitId, { minutes: elapsedMins });
  return { ...timer, elapsedMins };
}

export async function hydrateRoutineFromCloud() {
  const [catRows, habitRows, logRows] = await Promise.all([
    fetchUserLabRows('lab_routine_categories', 'created_at', true),
    fetchUserLabRows('lab_routine_habits', 'created_at', true),
    fetchUserLabRows('lab_routine_logs', 'log_date', false)
  ]);

  if (catRows && catRows.length > 0) {
    const cloudCats = catRows.map(r => translateLegacyCategory({
      id: r.id,
      label: r.label,
      color: r.color || '#5F6E43'
    }));
    const cloudIds = new Set(cloudCats.map(c => c.id));
    const deletedDefaults = new Set(getDeletedDefaultCatIds());
    const missingDefaults = DEFAULT_ROUTINE_CATEGORIES.filter(
      d => !cloudIds.has(d.id) && !deletedDefaults.has(d.id)
    );
    const merged = [...missingDefaults, ...cloudCats];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(merged.length > 0 ? merged : DEFAULT_ROUTINE_CATEGORIES));
  }

  if (habitRows && habitRows.length > 0) {
    const cloudHabits = habitRows.map(r => ({
      id: r.id,
      category: r.category_id || 'dhamma',
      title: r.title,
      description: r.description || '',
      minutes: r.minutes || 15,
      cittaType: r.citta_type || 'kusala'
    }));
    const cloudIds = new Set(cloudHabits.map(h => h.id));
    const deletedDefaults = new Set(getDeletedDefaultHabitIds());
    const missingDefaults = DEFAULT_HABITS.filter(
      d => !cloudIds.has(d.id) && !deletedDefaults.has(d.id)
    );
    const merged = [...missingDefaults, ...cloudHabits];
    localStorage.setItem(HABITS_KEY, JSON.stringify(merged.length > 0 ? merged : DEFAULT_HABITS));
  }

  if (logRows && logRows.length > 0) {
    const existingLocal = getAllRoutineLogs();
    const map = {};
    for (const r of logRows) {
      map[r.log_date] = {
        date: r.log_date,
        wakeTime: r.wake_time || '',
        sleepTime: r.sleep_time || '',
        checkedIds: Array.isArray(r.checked_ids) ? r.checked_ids : [],
        taskLogs: r.task_logs && typeof r.task_logs === 'object'
          ? r.task_logs
          : (existingLocal[r.log_date]?.taskLogs || {}),
        updatedAt: r.updated_at
      };
    }
    localStorage.setItem(LOGS_KEY, JSON.stringify(map));
  }

  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  window.dispatchEvent(new CustomEvent('labCittaLogsUpdated'));
}

export function getRoutineCategoryBreakdown(dateStr, mode = 'auto') {
  const categories = getRoutineCategories();
  const habits = getRoutineHabits();
  const log = getRoutineLogForDate(dateStr);
  const checkedSet = new Set(log.checkedIds || []);
  const useChecked = mode === 'completed' || (mode === 'auto' && checkedSet.size > 0);
  const activeHabits = useChecked ? habits.filter(h => checkedSet.has(h.id)) : habits;

  const fallbackId = categories[0]?.id || 'dhamma';
  const totals = new Map(categories.map(c => [c.id, 0]));
  for (const h of activeHabits) {
    const cat = totals.has(h.category) ? h.category : fallbackId;
    const mins = useChecked && log.taskLogs?.[h.id]?.minutes
      ? log.taskLogs[h.id].minutes
      : h.minutes;
    totals.set(cat, totals.get(cat) + Math.max(1, Number(mins || 15)));
  }

  return {
    isFromChecked: useChecked,
    items: categories.map(c => ({
      ...c,
      value: totals.get(c.id) || 0
    }))
  };
}

export function getRoutineCategorySeries(rangeDays = 14) {
  const categories = getRoutineCategories();
  const fallbackId = categories[0]?.id || 'dhamma';
  const habits = getRoutineHabits();
  const habitById = new Map(habits.map(h => [h.id, h]));
  const allLogs = getAllRoutineLogs();
  const todayStr = new Date().toISOString().slice(0, 10);

  let dates = [];
  if (rangeDays === 'all') {
    const keys = Object.keys(allLogs).sort();
    const start = keys.length > 0 ? keys[0] : todayStr;
    const cursor = new Date(`${start}T00:00:00Z`);
    const end = new Date(`${todayStr}T00:00:00Z`);
    while (cursor <= end) {
      dates.push(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  } else {
    const count = Math.max(1, Number(rangeDays || 14));
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }
  }

  return dates.map(date => {
    const log = allLogs[date];
    const row = {
      date,
      totalMinutes: 0,
      completedCount: Array.isArray(log?.checkedIds) ? log.checkedIds.length : 0,
      wakeTime: log?.wakeTime || '',
      sleepTime: log?.sleepTime || ''
    };
    for (const c of categories) {
      row[c.id] = 0;
    }
    if (log) {
      const countedIds = new Set();
      if (Array.isArray(log.checkedIds)) {
        for (const hid of log.checkedIds) {
          const habit = habitById.get(hid);
          if (!habit) continue;
          countedIds.add(hid);
          const cat = Object.prototype.hasOwnProperty.call(row, habit.category) ? habit.category : fallbackId;
          const mins = Math.max(1, Number(log.taskLogs?.[hid]?.minutes ?? habit.minutes ?? 15));
          row[cat] += mins;
          row.totalMinutes += mins;
        }
      }
      if (log.taskLogs && typeof log.taskLogs === 'object') {
        for (const [hid, tLog] of Object.entries(log.taskLogs)) {
          if (countedIds.has(hid) || !tLog) continue;
          const hasSessions = Array.isArray(tLog.sessions) && tLog.sessions.length > 0;
          if (tLog.status !== 'ongoing' && !hasSessions) continue;
          const habit = habitById.get(hid);
          if (!habit) continue;
          const mins = Number(tLog.minutes || 0);
          if (mins <= 0) continue;
          const cat = Object.prototype.hasOwnProperty.call(row, habit.category) ? habit.category : fallbackId;
          row[cat] += mins;
          row.totalMinutes += mins;
        }
      }
    }
    return row;
  });
}
