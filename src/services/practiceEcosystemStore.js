import { upsertLabRow, deleteLabRow, fetchUserLabRows } from './labSyncService';

const COMPASS_KEY = 'km_lab_path_compass_v1';
const PIN_POTHA_KEY = 'km_lab_pin_potha_v1';
const DEDICATION_KEY = 'km_lab_dedications_v1';

export const EIGHTFOLD_FACTORS = [
  { id: 'samma_ditthi', pali: 'Sammā Diṭṭhi', sinhala: 'සම්මා දිට්ඨි', english: 'Right View', group: 'Paññā (Wisdom)', color: '#4F46E5' },
  { id: 'samma_sankappa', pali: 'Sammā Saṅkappa', sinhala: 'සම්මා සංකප්ප', english: 'Right Intention', group: 'Paññā (Wisdom)', color: '#6366F1' },
  { id: 'samma_vaca', pali: 'Sammā Vācā', sinhala: 'සම්මා වාචා', english: 'Right Speech', group: 'Sīla (Virtue)', color: '#059669' },
  { id: 'samma_kammanta', pali: 'Sammā Kammanta', sinhala: 'සම්මා කම්මන්ත', english: 'Right Action', group: 'Sīla (Virtue)', color: '#10B981' },
  { id: 'samma_ajiva', pali: 'Sammā Ājīva', sinhala: 'සම්මා ආජීව', english: 'Right Livelihood', group: 'Sīla (Virtue)', color: '#14B8A6' },
  { id: 'samma_vayama', pali: 'Sammā Vāyāma', sinhala: 'සම්මා වායාම', english: 'Right Effort', group: 'Samādhi (Mindfulness)', color: '#D97706' },
  { id: 'samma_sati', pali: 'Sammā Sati', sinhala: 'සම්මා සති', english: 'Right Mindfulness', group: 'Samādhi (Mindfulness)', color: '#F59E0B' },
  { id: 'samma_samadhi', pali: 'Sammā Samādhi', sinhala: 'සම්මා සමාධි', english: 'Right Concentration', group: 'Samādhi (Mindfulness)', color: '#EA580C' }
];

export const PIN_POTHA_TYPES = {
  dana: { id: 'dana', label: 'Dāna (Generosity)', sinhala: 'දාන', color: '#D97706' },
  sila: { id: 'sila', label: 'Sīla (Virtue & Restraint)', sinhala: 'සීල', color: '#059669' },
  bhavana: { id: 'bhavana', label: 'Bhāvanā (Meditation)', sinhala: 'භාවනා', color: '#4F46E5' },
  habit_shift: { id: 'habit_shift', label: 'Habit Shift', sinhala: 'පුරුදු වෙනස්කම', color: '#0EA5E9' },
  veyyavacca: { id: 'veyyavacca', label: 'Veyyāvacca (Service)', sinhala: 'වෙය්‍යාවච්ච', color: '#9333EA' },
  dhamma_study: { id: 'dhamma_study', label: 'Dhamma Study', sinhala: 'ධර්ම අධ්‍යයනය', color: '#E11D48' }
};

export const DEDICATION_TYPES = {
  pattidana: { id: 'pattidana', label: 'Pattidāna (Merit Dedication)', sinhala: 'පත්තිදාන (පින් අනුමෝදනාව)' },
  dhamma_dana: { id: 'dhamma_dana', label: 'Dhamma Dāna (Teaching/Sharing)', sinhala: 'ධර්ම දාන' },
  community_service: { id: 'community_service', label: 'Community Service', sinhala: 'සමාජ සත්කාර' },
  study_offering: { id: 'study_offering', label: 'Study Offering', sinhala: 'අධ්‍යයන පූජාව' }
};

// ---------------- PATH COMPASS ----------------
export function getPathReflections() {
  try {
    const raw = localStorage.getItem(COMPASS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPathReflection({ pathFactor, intention, observation, linkedSuttaKey = null, linkedAnnotationId = null }) {
  const all = getPathReflections();
  const now = new Date().toISOString();
  const item = {
    id: `path-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pathFactor,
    intention: intention.trim(),
    observation: observation?.trim() || '',
    linkedSuttaKey: linkedSuttaKey || null,
    linkedAnnotationId: linkedAnnotationId || null,
    createdAt: now
  };
  all.unshift(item);
  localStorage.setItem(COMPASS_KEY, JSON.stringify(all));
  upsertLabRow('lab_path_reflections', {
    id: item.id,
    path_factor: item.pathFactor,
    intention: item.intention,
    observation: item.observation,
    linked_sutta_key: item.linkedSuttaKey,
    linked_annotation_id: item.linkedAnnotationId,
    created_at: item.createdAt
  });
  window.dispatchEvent(new CustomEvent('labPracticeUpdated'));
  return item;
}

export function deletePathReflection(id) {
  const next = getPathReflections().filter(r => r.id !== id);
  localStorage.setItem(COMPASS_KEY, JSON.stringify(next));
  deleteLabRow('lab_path_reflections', { id });
  window.dispatchEvent(new CustomEvent('labPracticeUpdated'));
}

// ---------------- PIN POTHA (STRICTLY PRIVATE) ----------------
export function getPinPothaEntries() {
  try {
    const raw = localStorage.getItem(PIN_POTHA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPinPothaEntry({ entryType, title, reflection, entryDate, linkedSuttaKey = null, linkedPathFactor = null }) {
  const all = getPinPothaEntries();
  const now = new Date().toISOString();
  const item = {
    id: `pin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    entryType: entryType || 'sila',
    title: title.trim(),
    reflection: reflection?.trim() || '',
    entryDate: entryDate || now.slice(0, 10),
    linkedSuttaKey: linkedSuttaKey || null,
    linkedPathFactor: linkedPathFactor || null,
    visibility: 'private', // Always private
    createdAt: now
  };
  all.unshift(item);
  localStorage.setItem(PIN_POTHA_KEY, JSON.stringify(all));
  upsertLabRow('lab_pin_potha_entries', {
    id: item.id,
    entry_type: item.entryType,
    title: item.title,
    reflection: item.reflection,
    entry_date: item.entryDate,
    linked_sutta_key: item.linkedSuttaKey,
    linked_path_factor: item.linkedPathFactor,
    created_at: item.createdAt
  });
  window.dispatchEvent(new CustomEvent('labPracticeUpdated'));
  return item;
}

export function deletePinPothaEntry(id) {
  const next = getPinPothaEntries().filter(p => p.id !== id);
  localStorage.setItem(PIN_POTHA_KEY, JSON.stringify(next));
  deleteLabRow('lab_pin_potha_entries', { id });
  window.dispatchEvent(new CustomEvent('labPracticeUpdated'));
}

// ---------------- DEDICATION & CONTRIBUTION ----------------
export function getDedications() {
  try {
    const raw = localStorage.getItem(DEDICATION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addDedication({ dedicationType, title, dedicationText, linkedPinPothaId = null, visibility = 'private', authorName = 'Kalyanamitta Seeker' }) {
  const all = getDedications();
  const now = new Date().toISOString();
  const item = {
    id: `ded-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    dedicationType: dedicationType || 'pattidana',
    title: title.trim(),
    dedicationText: dedicationText.trim(),
    linkedPinPothaId: linkedPinPothaId || null,
    visibility: visibility === 'public' ? 'public' : 'private',
    authorName: authorName?.trim() || 'Kalyanamitta Seeker',
    createdAt: now
  };
  all.unshift(item);
  localStorage.setItem(DEDICATION_KEY, JSON.stringify(all));
  upsertLabRow('lab_dedications', {
    id: item.id,
    dedication_type: item.dedicationType,
    title: item.title,
    dedication_text: item.dedicationText,
    linked_pin_potha_id: item.linkedPinPothaId,
    visibility: item.visibility,
    author_name: item.authorName,
    created_at: item.createdAt
  });
  window.dispatchEvent(new CustomEvent('labPracticeUpdated'));
  return item;
}

export function deleteDedication(id) {
  const next = getDedications().filter(d => d.id !== id);
  localStorage.setItem(DEDICATION_KEY, JSON.stringify(next));
  deleteLabRow('lab_dedications', { id });
  window.dispatchEvent(new CustomEvent('labPracticeUpdated'));
}

export async function hydratePracticeEcosystemFromCloud() {
  const [compassRows, pinRows, dedRows] = await Promise.all([
    fetchUserLabRows('lab_path_reflections', 'created_at', false),
    fetchUserLabRows('lab_pin_potha_entries', 'created_at', false),
    fetchUserLabRows('lab_dedications', 'created_at', false)
  ]);

  if (compassRows) {
    localStorage.setItem(COMPASS_KEY, JSON.stringify(compassRows.map(r => ({
      id: r.id,
      pathFactor: r.path_factor,
      intention: r.intention,
      observation: r.observation || '',
      linkedSuttaKey: r.linked_sutta_key,
      linkedAnnotationId: r.linked_annotation_id,
      createdAt: r.created_at
    }))));
  }
  if (pinRows) {
    localStorage.setItem(PIN_POTHA_KEY, JSON.stringify(pinRows.map(r => ({
      id: r.id,
      entryType: r.entry_type,
      title: r.title,
      reflection: r.reflection || '',
      entryDate: r.entry_date,
      linkedSuttaKey: r.linked_sutta_key,
      linkedPathFactor: r.linked_path_factor,
      visibility: 'private',
      createdAt: r.created_at
    }))));
  }
  if (dedRows) {
    localStorage.setItem(DEDICATION_KEY, JSON.stringify(dedRows.map(r => ({
      id: r.id,
      dedicationType: r.dedication_type,
      title: r.title,
      dedicationText: r.dedication_text,
      linkedPinPothaId: r.linked_pin_potha_id,
      visibility: r.visibility || 'private',
      authorName: r.author_name || 'Kalyanamitta Seeker',
      createdAt: r.created_at
    }))));
  }
  window.dispatchEvent(new CustomEvent('labPracticeUpdated'));
}
