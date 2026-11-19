import { getPinPothaEntries } from './practiceEcosystemStore';
import { getRoutineHabits, getAllRoutineLogs } from './dailyRoutineStore';

const STORAGE_KEY = 'km_lab_daily_citta_v1';

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Check if a YYYY-MM-DD date falls on a Full Moon (Poya) day using synodic lunar cycle
 * Anchor: 2026-11-24 Full Moon (Il Poya)
 */
export function isPoyaDay(dateStr) {
  const anchor = new Date('2026-11-24T00:00:00Z').getTime();
  const target = new Date(`${dateStr}T00:00:00Z`).getTime();
  const synodicMs = 29.53059 * 24 * 60 * 60 * 1000;
  const diff = Math.abs(target - anchor);
  const mod = diff % synodicMs;
  const distDays = Math.min(mod, synodicMs - mod) / (24 * 60 * 60 * 1000);
  return distDays <= 0.55;
}

function getManualLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function doesPinEntryApplyToDate(entry, dateStr) {
  const start = entry.entryDate;
  if (!start || dateStr < start) return false;
  const today = getTodayKey();
  if (dateStr > today) return false;

  const sched = entry.scheduleType || 'once';
  if (sched === 'once') return dateStr === start;
  if (sched === 'daily') return true;
  if (sched === 'poya') return isPoyaDay(dateStr);
  if (sched === 'range') {
    const end = entry.endDate || start;
    return dateStr <= end;
  }
  return dateStr === start;
}

export function getAllCittaLogs() {
  const manual = getManualLogs();
  const pinEntries = getPinPothaEntries();
  const routineHabits = getRoutineHabits();
  const routineLogs = getAllRoutineLogs();
  const habitById = new Map(routineHabits.map(h => [h.id, h]));

  const byDate = new Map();
  for (const m of manual) {
    byDate.set(m.date, { ...m });
  }

  // Collect all relevant dates from manual logs + pin entries + routine logs
  const today = getTodayKey();
  const dateSet = new Set([...byDate.keys(), ...Object.keys(routineLogs)]);

  for (const p of pinEntries) {
    if (!p.entryDate) continue;
    dateSet.add(p.entryDate);
    if (p.scheduleType === 'daily' || p.scheduleType === 'poya' || p.scheduleType === 'range') {
      const start = new Date(`${p.entryDate}T00:00:00`);
      const maxEnd = p.scheduleType === 'range' && p.endDate && p.endDate < today ? p.endDate : today;
      const end = new Date(`${maxEnd}T00:00:00`);
      const cursor = new Date(start);
      let guard = 0;
      while (cursor <= end && guard < 1825) {
        dateSet.add(cursor.toISOString().slice(0, 10));
        cursor.setDate(cursor.getDate() + 1);
        guard += 1;
      }
    }
  }

  const merged = [];
  for (const dateStr of dateSet) {
    const base = byDate.get(dateStr) || { date: dateStr, kusala: 0, akusala: 0, kusalaMinutes: 0, akusalaMinutes: 0, note: '' };
    let pinKusala = 0;
    let pinAkusala = 0;
    let pinKusalaMins = 0;
    let pinAkusalaMins = 0;
    const pinTitles = [];

    for (const p of pinEntries) {
      if (doesPinEntryApplyToDate(p, dateStr)) {
        const mins = Number(p.durationMinutes || 30);
        if (p.cittaType === 'akusala') {
          pinAkusala += 1;
          pinAkusalaMins += mins;
        } else {
          pinKusala += 1;
          pinKusalaMins += mins;
        }
        pinTitles.push(p.title);
      }
    }

    const rLog = routineLogs[dateStr];
    if (rLog && Array.isArray(rLog.checkedIds)) {
      for (const hid of rLog.checkedIds) {
        const h = habitById.get(hid);
        if (!h) continue;
        const mins = Number(h.minutes || 15);
        if (h.cittaType === 'akusala') {
          pinAkusala += 1;
          pinAkusalaMins += mins;
        } else {
          pinKusala += 1;
          pinKusalaMins += mins;
        }
        pinTitles.push(h.title);
      }
    }

    const totalK = (base.kusala || 0) + pinKusala;
    const totalA = (base.akusala || 0) + pinAkusala;
    if (totalK > 0 || totalA > 0 || base.note) {
      merged.push({
        date: dateStr,
        kusala: totalK,
        akusala: totalA,
        kusalaMinutes: (base.kusalaMinutes || 0) + pinKusalaMins,
        akusalaMinutes: (base.akusalaMinutes || 0) + pinAkusalaMins,
        note: base.note || (pinTitles.length > 0 ? pinTitles.slice(0, 2).join(', ') : '')
      });
    }
  }

  return merged.sort((a, b) => a.date.localeCompare(b.date));
}

export function logDailyCitta({ date = getTodayKey(), type, delta = 1, note = '' }) {
  const all = getManualLogs();
  const idx = all.findIndex(d => d.date === date);
  const existing = idx >= 0 ? all[idx] : { date, kusala: 0, akusala: 0, note: '' };

  const next = {
    ...existing,
    kusala: type === 'kusala' ? Math.max(0, (existing.kusala || 0) + delta) : (existing.kusala || 0),
    akusala: type === 'akusala' ? Math.max(0, (existing.akusala || 0) + delta) : (existing.akusala || 0),
    note: note ? note.trim() : existing.note,
    updatedAt: new Date().toISOString()
  };

  if (idx >= 0) all[idx] = next;
  else all.push(next);

  all.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent('labCittaLogsUpdated'));
  return getAllCittaLogs();
}

export function getCittaSeries(rangeDays = 14) {
  const logs = getAllCittaLogs();
  if (rangeDays === 'all') {
    return logs.length > 0 ? logs : [{ date: getTodayKey(), kusala: 0, akusala: 0, note: '' }];
  }

  const byDate = new Map(logs.map(l => [l.date, l]));
  const result = [];
  const today = new Date();
  for (let i = rangeDays - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push(byDate.get(key) || { date: key, kusala: 0, akusala: 0, kusalaMinutes: 0, akusalaMinutes: 0, note: '' });
  }
  return result;
}
