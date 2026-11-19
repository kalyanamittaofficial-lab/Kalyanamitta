import { getRoadmapItems, getAnnotationSummary } from './studyRoadmapStore';
import { getMapNodes, getKnowledgeMaps } from './knowledgeMapStore';
import { getPinPothaEntries, getPathReflections, getDedications } from './practiceEcosystemStore';

const COLLECTIONS_KEY = 'km_lab_collections_v1';
const ONBOARDING_KEY = 'km_lab_onboarding_v1';

export function getCollections() {
  try {
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCollection({ id, title, description = '', tags = [] }) {
  const all = getCollections();
  const now = new Date().toISOString();
  const nextId = id || `col-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const idx = all.findIndex(c => c.id === nextId);
  const existing = idx >= 0 ? all[idx] : {};

  const record = {
    id: nextId,
    title: title.trim(),
    description: description.trim(),
    tags: Array.isArray(tags) ? tags : [],
    items: existing.items || [],
    visibility: existing.visibility || 'private',
    createdAt: existing.createdAt || now,
    updatedAt: now
  };

  if (idx >= 0) all[idx] = record;
  else all.unshift(record);

  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent('labCollectionsUpdated'));
  return record;
}

export function addItemToCollection(collectionId, item) {
  const all = getCollections();
  const idx = all.findIndex(c => c.id === collectionId);
  if (idx < 0) return null;

  const col = all[idx];
  const exists = col.items.some(i => i.refId === item.refId && i.itemType === item.itemType);
  if (!exists) {
    col.items.unshift({
      id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      itemType: item.itemType, // 'sutta' | 'note' | 'node' | 'passage'
      refId: item.refId,
      title: item.title,
      subtitle: item.subtitle || '',
      route: item.route,
      addedAt: new Date().toISOString()
    });
    col.updatedAt = new Date().toISOString();
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('labCollectionsUpdated'));
  }
  return col;
}

export function removeItemFromCollection(collectionId, itemId) {
  const all = getCollections();
  const idx = all.findIndex(c => c.id === collectionId);
  if (idx < 0) return null;
  all[idx].items = all[idx].items.filter(i => i.id !== itemId);
  all[idx].updatedAt = new Date().toISOString();
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent('labCollectionsUpdated'));
  return all[idx];
}

export function deleteCollection(collectionId) {
  const next = getCollections().filter(c => c.id !== collectionId);
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('labCollectionsUpdated'));
}

// Onboarding state (private starting-point reflections)
export function getOnboardingState() {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    return raw ? JSON.parse(raw) : { completed: false, skipped: false, reflections: {} };
  } catch {
    return { completed: false, skipped: false, reflections: {} };
  }
}

export function saveOnboardingState(nextState) {
  const current = getOnboardingState();
  const merged = { ...current, ...nextState, updatedAt: new Date().toISOString() };
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent('labOnboardingUpdated'));
  return merged;
}

/**
 * Global search across Notes, Map Nodes, Collections, Pin Potha, and Path Reflections
 */
export function searchLabWorkspace(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return { notes: [], nodes: [], collections: [], pinPotha: [], reflections: [] };

  const notes = getRoadmapItems().filter(n => {
    const s = getAnnotationSummary(n);
    return (
      s?.title?.toLowerCase().includes(q) ||
      s?.content?.toLowerCase().includes(q) ||
      n.target?.suttaTitleSinhala?.toLowerCase().includes(q) ||
      n.target?.source?.toLowerCase().includes(q)
    );
  });

  const nodes = getMapNodes().filter(n =>
    n.label?.toLowerCase().includes(q) ||
    n.summary?.toLowerCase().includes(q) ||
    n.sourceRef?.toLowerCase().includes(q)
  );

  const collections = getCollections().filter(c =>
    c.title?.toLowerCase().includes(q) ||
    c.description?.toLowerCase().includes(q)
  );

  const pinPotha = getPinPothaEntries().filter(p =>
    p.title?.toLowerCase().includes(q) ||
    p.reflection?.toLowerCase().includes(q)
  );

  const reflections = getPathReflections().filter(r =>
    r.intention?.toLowerCase().includes(q) ||
    r.observation?.toLowerCase().includes(q)
  );

  const maps = getKnowledgeMaps().filter(m =>
    m.title?.toLowerCase().includes(q)
  );

  const dedications = getDedications().filter(d =>
    d.title?.toLowerCase().includes(q) ||
    d.dedicationText?.toLowerCase().includes(q)
  );

  return { notes, nodes, collections, pinPotha, reflections, maps, dedications };
}
