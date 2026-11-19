import { upsertLabRow, fetchUserLabRows } from './labSyncService';

const STORAGE_KEY = 'km_lab_reading_progress_v1';

export function getAllReadingProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getSuttaProgress(suttaKey) {
  return getAllReadingProgress().find(p => p.suttaKey === suttaKey) || null;
}

export function getBookmarkedSuttas() {
  return getAllReadingProgress().filter(p => p.isBookmarked);
}

export function saveReadingProgress({ suttaKey, suttaTitlePali, suttaTitleSinhala, lastSegmentId, isBookmarked }) {
  const all = getAllReadingProgress();
  const idx = all.findIndex(p => p.suttaKey === suttaKey);
  const now = new Date().toISOString();
  const prev = idx >= 0 ? all[idx] : {};

  const next = {
    suttaKey,
    suttaTitlePali: suttaTitlePali ?? prev.suttaTitlePali ?? suttaKey,
    suttaTitleSinhala: suttaTitleSinhala ?? prev.suttaTitleSinhala ?? '',
    lastSegmentId: lastSegmentId !== undefined ? lastSegmentId : (prev.lastSegmentId || null),
    isBookmarked: isBookmarked !== undefined ? isBookmarked : Boolean(prev.isBookmarked),
    lastReadAt: now
  };

  if (idx >= 0) {
    all[idx] = next;
  } else {
    all.unshift(next);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  upsertLabRow('lab_reading_progress', {
    sutta_key: next.suttaKey,
    sutta_title_pali: next.suttaTitlePali,
    sutta_title_sinhala: next.suttaTitleSinhala,
    last_segment_id: next.lastSegmentId,
    is_bookmarked: next.isBookmarked,
    last_read_at: now
  }, 'user_id,sutta_key');

  window.dispatchEvent(new CustomEvent('labReadingProgressUpdated'));
  return next;
}

export async function hydrateReadingProgressFromCloud() {
  const rows = await fetchUserLabRows('lab_reading_progress', 'last_read_at', false);
  if (!rows) return getAllReadingProgress();

  const local = getAllReadingProgress();
  const byKey = new Map();

  for (const r of rows) {
    byKey.set(r.sutta_key, {
      suttaKey: r.sutta_key,
      suttaTitlePali: r.sutta_title_pali || '',
      suttaTitleSinhala: r.sutta_title_sinhala || '',
      lastSegmentId: r.last_segment_id || null,
      isBookmarked: Boolean(r.is_bookmarked),
      lastReadAt: r.last_read_at
    });
  }

  for (const item of local) {
    if (!byKey.has(item.suttaKey)) {
      byKey.set(item.suttaKey, item);
    }
  }

  const merged = Array.from(byKey.values());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent('labReadingProgressUpdated'));
  return merged;
}
