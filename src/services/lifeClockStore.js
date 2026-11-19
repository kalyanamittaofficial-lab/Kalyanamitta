import { upsertLabRow, fetchUserLabRows } from './labSyncService';

export const LIFE_DOB_KEY = 'km_lab_life_dob_v1';
export const LIFE_SPAN_KEY = 'km_lab_life_span_v1';
export const LIFE_MODE_KEY = 'km_lab_life_mode_v1';

export function getLifeClockConfig() {
  return {
    dob: localStorage.getItem(LIFE_DOB_KEY) || '1996-01-01',
    lifespan: Number(localStorage.getItem(LIFE_SPAN_KEY) || 75),
    mode: localStorage.getItem(LIFE_MODE_KEY) === 'lived' ? 'lived' : 'remaining'
  };
}

export function saveLifeClockConfig({ dob, lifespan, mode }) {
  if (dob !== undefined) localStorage.setItem(LIFE_DOB_KEY, dob);
  if (lifespan !== undefined) localStorage.setItem(LIFE_SPAN_KEY, String(lifespan));
  if (mode !== undefined) localStorage.setItem(LIFE_MODE_KEY, mode);

  const current = getLifeClockConfig();
  upsertLabRow(
    'lab_life_clock_config',
    {
      dob: current.dob,
      lifespan_years: current.lifespan,
      clock_mode: current.mode,
      updated_at: new Date().toISOString()
    },
    'user_id'
  );
  window.dispatchEvent(new CustomEvent('labLifeClockUpdated'));
}

export async function hydrateLifeClockFromCloud() {
  const rows = await fetchUserLabRows('lab_life_clock_config', 'updated_at', false);
  if (!rows || rows.length === 0) return;
  const row = rows[0];
  if (row.dob) localStorage.setItem(LIFE_DOB_KEY, row.dob);
  if (row.lifespan_years) localStorage.setItem(LIFE_SPAN_KEY, String(row.lifespan_years));
  if (row.clock_mode) localStorage.setItem(LIFE_MODE_KEY, row.clock_mode);
  window.dispatchEvent(new CustomEvent('labLifeClockUpdated'));
}

export function computeLifeClock(dobStr, lifespanYears, mode = 'remaining') {
  const dob = new Date(dobStr || '1996-01-01T00:00:00');
  const end = new Date(dob.getTime());
  end.setFullYear(end.getFullYear() + Number(lifespanYears || 75));

  const now = new Date();
  const totalMs = Math.max(1, end.getTime() - dob.getTime());
  const livedMs = Math.min(totalMs, Math.max(0, now.getTime() - dob.getTime()));
  const remainingMs = Math.max(0, totalMs - livedMs);
  const remainingPct = Math.round((remainingMs / totalMs) * 100);
  const livedPct = Math.max(0, 100 - remainingPct);

  let diffMs = mode === 'lived' ? livedMs : remainingMs;

  const msPerSec = 1000;
  const msPerMin = msPerSec * 60;
  const msPerHour = msPerMin * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30.436875;
  const msPerYear = msPerDay * 365.2425;

  const years = Math.floor(diffMs / msPerYear);
  diffMs -= years * msPerYear;
  const months = Math.floor(diffMs / msPerMonth);
  diffMs -= months * msPerMonth;
  const days = Math.floor(diffMs / msPerDay);
  diffMs -= days * msPerDay;
  const hours = Math.floor(diffMs / msPerHour);
  diffMs -= hours * msPerHour;
  const minutes = Math.floor(diffMs / msPerMin);
  diffMs -= minutes * msPerMin;
  const seconds = Math.floor(diffMs / msPerSec);

  return { years, months, days, hours, minutes, seconds, remainingPct, livedPct };
}
