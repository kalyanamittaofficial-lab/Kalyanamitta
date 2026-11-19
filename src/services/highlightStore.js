import { upsertLabRow, deleteLabRow, fetchUserLabRows } from './labSyncService';

const STORAGE_KEY = 'km_lab_highlights_v1';

export const HIGHLIGHT_COLORS = {
  amber: { id: 'amber', label: 'රන් පැහැය', dot: '#F59E0B', bgVar: 'var(--lab-hl-amber)' },
  mint: { id: 'mint', label: 'කොළ පැහැය', dot: '#10B981', bgVar: 'var(--lab-hl-mint)' },
  sky: { id: 'sky', label: 'නිල් පැහැය', dot: '#0EA5E9', bgVar: 'var(--lab-hl-sky)' },
  rose: { id: 'rose', label: 'රෝස පැහැය', dot: '#F43F5E', bgVar: 'var(--lab-hl-rose)' }
};

export function getAllHighlights() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getHighlightsBySutta(suttaKey) {
  const all = getAllHighlights();
  const map = {};
  for (const item of all) {
    if (item.suttaKey === suttaKey) {
      map[item.segmentId] = item;
    }
  }
  return map;
}

export function setSegmentHighlight({ suttaKey, suttaTitle, segmentId, pali, sinh, color = 'amber' }) {
  const all = getAllHighlights();
  const idx = all.findIndex(h => h.segmentId === segmentId);
  const now = new Date().toISOString();

  // Clicking the same color again removes the highlight
  if (idx >= 0 && all[idx].color === color) {
    all.splice(idx, 1);
    deleteLabRow('lab_highlights', { segment_id: segmentId });
  } else if (idx >= 0) {
    const updated = { ...all[idx], color, updatedAt: now };
    all[idx] = updated;
    upsertLabRow('lab_highlights', {
      id: updated.id,
      sutta_key: updated.suttaKey,
      sutta_title: updated.suttaTitle || '',
      segment_id: updated.segmentId,
      pali: updated.pali || '',
      sinh: updated.sinh || '',
      color: updated.color,
      updated_at: now
    }, 'user_id,segment_id');
  } else {
    const created = {
      id: `hl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      suttaKey,
      suttaTitle,
      segmentId,
      pali: pali || '',
      sinh: sinh || '',
      color,
      createdAt: now,
      updatedAt: now
    };
    all.unshift(created);
    upsertLabRow('lab_highlights', {
      id: created.id,
      sutta_key: created.suttaKey,
      sutta_title: created.suttaTitle || '',
      segment_id: created.segmentId,
      pali: created.pali,
      sinh: created.sinh,
      color: created.color,
      created_at: now,
      updated_at: now
    }, 'user_id,segment_id');
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent('labHighlightsUpdated'));
  return all;
}

export function removeHighlight(segmentId) {
  const next = getAllHighlights().filter(h => h.segmentId !== segmentId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  deleteLabRow('lab_highlights', { segment_id: segmentId });
  window.dispatchEvent(new CustomEvent('labHighlightsUpdated'));
  return next;
}

export async function hydrateHighlightsFromCloud() {
  const rows = await fetchUserLabRows('lab_highlights', 'updated_at', false);
  if (!rows) return getAllHighlights();

  const local = getAllHighlights();
  const mergedBySegment = new Map();

  for (const r of rows) {
    mergedBySegment.set(r.segment_id, {
      id: r.id,
      suttaKey: r.sutta_key,
      suttaTitle: r.sutta_title || '',
      segmentId: r.segment_id,
      pali: r.pali || '',
      sinh: r.sinh || '',
      color: r.color || 'amber',
      createdAt: r.created_at,
      updatedAt: r.updated_at
    });
  }

  for (const item of local) {
    if (!mergedBySegment.has(item.segmentId)) {
      mergedBySegment.set(item.segmentId, item);
      upsertLabRow('lab_highlights', {
        id: item.id,
        sutta_key: item.suttaKey,
        sutta_title: item.suttaTitle || '',
        segment_id: item.segmentId,
        pali: item.pali || '',
        sinh: item.sinh || '',
        color: item.color || 'amber',
        created_at: item.createdAt || new Date().toISOString(),
        updated_at: item.updatedAt || new Date().toISOString()
      }, 'user_id,segment_id');
    }
  }

  const merged = Array.from(mergedBySegment.values());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent('labHighlightsUpdated'));
  return merged;
}
