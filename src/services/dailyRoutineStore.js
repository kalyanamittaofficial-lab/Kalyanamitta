import { upsertLabRow, deleteLabRow, fetchUserLabRows } from './labSyncService';

const HABITS_KEY = 'km_lab_routine_habits_v1';
const LOGS_KEY = 'km_lab_routine_logs_v1';
const CATEGORIES_KEY = 'km_lab_routine_categories_v1';

export const DEFAULT_ROUTINE_CATEGORIES = [
  { id: 'dhamma', label: 'ධර්ම කටයුතු', color: '#5F6E43' },
  { id: 'education', label: 'අධ්‍යාපනය (පාසල / විශ්වවිද්‍යාලය)', color: '#C06C47' },
  { id: 'job', label: 'රැකියාව', color: '#98A27A' },
  { id: 'family', label: 'පවුල', color: '#D8C3B0' },
  { id: 'friends', label: 'මිතුරන් හා සම්බන්ධතා', color: '#B0B0AC' }
];

export const ROUTINE_CATEGORIES = DEFAULT_ROUTINE_CATEGORIES;

export function getRoutineCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_ROUTINE_CATEGORIES));
      return DEFAULT_ROUTINE_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ROUTINE_CATEGORIES;
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
  if (all.length <= 1) return all;
  const next = all.filter(c => c.id !== id);
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
  const next = getRoutineHabits().filter(h => h.id !== id);
  localStorage.setItem(HABITS_KEY, JSON.stringify(next));
  deleteLabRow('lab_routine_habits', { id });
  window.dispatchEvent(new CustomEvent('labRoutineUpdated'));
  return next;
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
  return all[dateStr] || { date: dateStr, wakeTime: '', sleepTime: '', checkedIds: [] };
}

export function saveRoutineWakeSleep(dateStr, { wakeTime, sleepTime }) {
  const all = getAllRoutineLogs();
  const prev = all[dateStr] || { date: dateStr, wakeTime: '', sleepTime: '', checkedIds: [] };
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

export function toggleRoutineHabit(dateStr, habitId) {
  const all = getAllRoutineLogs();
  const prev = all[dateStr] || { date: dateStr, wakeTime: '', sleepTime: '', checkedIds: [] };
  const exists = prev.checkedIds.includes(habitId);
  const nextIds = exists
    ? prev.checkedIds.filter(id => id !== habitId)
    : [...prev.checkedIds, habitId];

  all[dateStr] = {
    ...prev,
    checkedIds: nextIds,
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

export async function hydrateRoutineFromCloud() {
  const [catRows, habitRows, logRows] = await Promise.all([
    fetchUserLabRows('lab_routine_categories', 'created_at', true),
    fetchUserLabRows('lab_routine_habits', 'created_at', true),
    fetchUserLabRows('lab_routine_logs', 'log_date', false)
  ]);

  if (catRows && catRows.length > 0) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(catRows.map(r => ({
      id: r.id,
      label: r.label,
      color: r.color || '#5F6E43'
    }))));
  }

  if (habitRows && habitRows.length > 0) {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habitRows.map(r => ({
      id: r.id,
      category: r.category_id || 'dhamma',
      title: r.title,
      description: r.description || '',
      minutes: r.minutes || 15,
      cittaType: r.citta_type || 'kusala'
    }))));
  }

  if (logRows && logRows.length > 0) {
    const map = {};
    for (const r of logRows) {
      map[r.log_date] = {
        date: r.log_date,
        wakeTime: r.wake_time || '',
        sleepTime: r.sleep_time || '',
        checkedIds: Array.isArray(r.checked_ids) ? r.checked_ids : [],
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
    totals.set(cat, totals.get(cat) + Math.max(1, Number(h.minutes || 15)));
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
    const row = { date, totalMinutes: 0 };
    for (const c of categories) {
      row[c.id] = 0;
    }
    if (log && Array.isArray(log.checkedIds)) {
      for (const hid of log.checkedIds) {
        const habit = habitById.get(hid);
        if (!habit) continue;
        const cat = Object.prototype.hasOwnProperty.call(row, habit.category) ? habit.category : fallbackId;
        const mins = Math.max(1, Number(habit.minutes || 15));
        row[cat] += mins;
        row.totalMinutes += mins;
      }
    }
    return row;
  });
}
