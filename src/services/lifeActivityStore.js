import { addRoutineHabit, startRoutineTimer, saveRoutineTaskLog } from './dailyRoutineStore';
import { addPinPothaEntry } from './practiceEcosystemStore';
import { getTodayKey } from './cittaLogStore';

const INBOX_KEY = 'km_lab_intention_inbox_v1';
const LINKS_KEY = 'km_lab_activity_links_v1';
const VISIT_KEY = 'km_lab_visit_state_v1';
const DISMISSED_SUGGESTIONS_KEY = 'km_lab_dismissed_suggestions_v1';
const TOMORROW_PLAN_KEY = 'km_lab_tomorrow_plan_v1';

function emitLifeActivityUpdate() {
  window.dispatchEvent(new CustomEvent('labLifeActivityUpdated'));
}

// --- Intention Inbox (Save for later without scheduling) ---
export function getIntentionInbox() {
  try {
    const raw = localStorage.getItem(INBOX_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addIntention({
  title,
  category = 'dhamma',
  minutes = 15,
  sourceType = 'manual',
  sourceId = '',
  sourceTitle = '',
  sourceUrl = '',
  excerpt = ''
}) {
  const cleanTitle = String(title || '').trim();
  if (!cleanTitle) return getIntentionInbox();
  const item = {
    id: `int-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: cleanTitle,
    category,
    minutes: Math.max(1, Number(minutes || 15)),
    sourceType,
    sourceId,
    sourceTitle,
    sourceUrl,
    excerpt: String(excerpt || '').slice(0, 220),
    createdAt: new Date().toISOString()
  };
  const next = [item, ...getIntentionInbox()];
  localStorage.setItem(INBOX_KEY, JSON.stringify(next));
  emitLifeActivityUpdate();
  return next;
}

export function removeIntention(id) {
  const next = getIntentionInbox().filter(i => i.id !== id);
  localStorage.setItem(INBOX_KEY, JSON.stringify(next));
  emitLifeActivityUpdate();
  return next;
}

// --- Activity Source Links (connects Routine tasks to Suttas, Notes, Map Nodes, Merit Book) ---
export function getAllActivityLinks() {
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function getActivityLink(habitId) {
  if (!habitId) return null;
  return getAllActivityLinks()[habitId] || null;
}

export function setActivityLink(habitId, linkData) {
  if (!habitId) return;
  const all = getAllActivityLinks();
  all[habitId] = {
    ...(all[habitId] || {}),
    ...linkData,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(LINKS_KEY, JSON.stringify(all));
  emitLifeActivityUpdate();
}

export function createLinkedRoutineActivity({
  title,
  category = 'dhamma',
  minutes = 15,
  mode = 'plan', // 'now' | 'plan'
  sourceType = 'manual',
  sourceId = '',
  sourceTitle = '',
  sourceUrl = '',
  excerpt = ''
}) {
  const updatedHabits = addRoutineHabit({
    title,
    description: excerpt ? String(excerpt).slice(0, 120) : '',
    category,
    minutes,
    cittaType: 'kusala'
  });
  const created = updatedHabits[updatedHabits.length - 1];
  if (created?.id) {
    if (sourceUrl || sourceTitle || sourceType !== 'manual') {
      setActivityLink(created.id, {
        sourceType,
        sourceId,
        sourceTitle,
        sourceUrl,
        excerpt
      });
    }
    if (mode === 'now') {
      startRoutineTimer(getTodayKey(), created.id);
    }
  }
  emitLifeActivityUpdate();
  return created;
}

export function promoteIntentionToRoutine(intentionId, mode = 'plan') {
  const items = getIntentionInbox();
  const target = items.find(i => i.id === intentionId);
  if (!target) return null;
  const created = createLinkedRoutineActivity({
    title: target.title,
    category: target.category,
    minutes: target.minutes,
    mode,
    sourceType: target.sourceType,
    sourceId: target.sourceId,
    sourceTitle: target.sourceTitle,
    sourceUrl: target.sourceUrl,
    excerpt: target.excerpt
  });
  removeIntention(intentionId);
  return created;
}

// --- Retrospective / Unexpected Activity Recording ---
export function recordUnexpectedActivity({
  title,
  category = 'dhamma',
  minutes = 15,
  date = getTodayKey(),
  notes = '',
  alsoAddMeritBook = false
}) {
  const cleanTitle = String(title || '').trim();
  if (!cleanTitle) return null;
  const updatedHabits = addRoutineHabit({
    title: cleanTitle,
    description: notes,
    category,
    minutes,
    cittaType: 'kusala'
  });
  const created = updatedHabits[updatedHabits.length - 1];
  if (created?.id) {
    saveRoutineTaskLog(date, created.id, {
      minutes,
      completed: true,
      status: 'completed'
    });
    if (alsoAddMeritBook) {
      const meritEntry = addPinPothaEntry({
        entryType: category === 'dhamma' ? 'bhavana' : 'dana',
        cittaType: 'kusala',
        scheduleType: 'once',
        durationMinutes: minutes,
        entryDate: date,
        title: cleanTitle,
        reflection: notes || 'Recorded from Daily Life'
      });
      if (meritEntry?.id) {
        setActivityLink(created.id, {
          sourceType: 'merit',
          linkedPinPothaId: meritEntry.id,
          sourceTitle: 'Merit Book',
          sourceUrl: '/lab/pin-potha'
        });
      }
    }
  }
  emitLifeActivityUpdate();
  return created;
}

// --- Tomorrow Plan ---
export function getTomorrowKey() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function getTomorrowPlan(dateKey = getTomorrowKey()) {
  try {
    const raw = localStorage.getItem(TOMORROW_PLAN_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return Array.isArray(parsed?.[dateKey]) ? parsed[dateKey] : [];
  } catch {
    return [];
  }
}

export function addTomorrowPlanItem(item, dateKey = getTomorrowKey()) {
  try {
    const raw = localStorage.getItem(TOMORROW_PLAN_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const list = Array.isArray(parsed?.[dateKey]) ? parsed[dateKey] : [];
    const nextItem = {
      id: `tmw-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      title: String(item.title || '').trim(),
      category: item.category || 'dhamma',
      minutes: Math.max(1, Number(item.minutes || 15))
    };
    if (!nextItem.title) return list;
    parsed[dateKey] = [...list, nextItem];
    localStorage.setItem(TOMORROW_PLAN_KEY, JSON.stringify(parsed));
    emitLifeActivityUpdate();
    return parsed[dateKey];
  } catch {
    return [];
  }
}

export function removeTomorrowPlanItem(id, dateKey = getTomorrowKey()) {
  try {
    const raw = localStorage.getItem(TOMORROW_PLAN_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const list = Array.isArray(parsed?.[dateKey]) ? parsed[dateKey] : [];
    parsed[dateKey] = list.filter(x => x.id !== id);
    localStorage.setItem(TOMORROW_PLAN_KEY, JSON.stringify(parsed));
    emitLifeActivityUpdate();
    return parsed[dateKey];
  } catch {
    return [];
  }
}

// --- Visit State & Gentle Returning Experience ---
export function getVisitContext() {
  const today = getTodayKey();
  try {
    const raw = localStorage.getItem(VISIT_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed) {
      return {
        isFirstVisit: true,
        daysSinceLastVisit: 0,
        isReturningAfterAbsence: false,
        firstVisitDismissed: false
      };
    }
    const lastDate = parsed.lastVisitDate || today;
    const diffMs = new Date(`${today}T00:00:00`).getTime() - new Date(`${lastDate}T00:00:00`).getTime();
    const daysSinceLastVisit = Math.max(0, Math.round(diffMs / 86400000));
    return {
      isFirstVisit: !parsed.firstVisitDismissed && !parsed.hasCompletedAnyAction,
      daysSinceLastVisit,
      isReturningAfterAbsence: daysSinceLastVisit >= 3 && !parsed.welcomeBackDismissedForToday?.[today],
      firstVisitDismissed: Boolean(parsed.firstVisitDismissed)
    };
  } catch {
    return {
      isFirstVisit: false,
      daysSinceLastVisit: 0,
      isReturningAfterAbsence: false,
      firstVisitDismissed: true
    };
  }
}

export function markLabVisit({ dismissFirstVisit = false, dismissWelcomeBack = false, completedAction = false } = {}) {
  const today = getTodayKey();
  try {
    const raw = localStorage.getItem(VISIT_KEY);
    const prev = raw ? JSON.parse(raw) : {};
    const next = {
      ...prev,
      lastVisitDate: today,
      firstVisitDismissed: dismissFirstVisit ? true : Boolean(prev.firstVisitDismissed),
      hasCompletedAnyAction: completedAction ? true : Boolean(prev.hasCompletedAnyAction),
      welcomeBackDismissedForToday: dismissWelcomeBack
        ? { [today]: true }
        : (prev.welcomeBackDismissedForToday || {})
    };
    localStorage.setItem(VISIT_KEY, JSON.stringify(next));
    emitLifeActivityUpdate();
  } catch {
    // ignore storage errors
  }
}

// --- Next Action Resolver (Explainable, Dismissible Suggestions) ---
export function getDismissedSuggestions() {
  try {
    const raw = localStorage.getItem(DISMISSED_SUGGESTIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function dismissSuggestion(id) {
  const prev = getDismissedSuggestions();
  if (!prev.includes(id)) {
    localStorage.setItem(DISMISSED_SUGGESTIONS_KEY, JSON.stringify([...prev, id]));
    emitLifeActivityUpdate();
  }
}

export function getNextActionSuggestions({ checkedCount = 0, inboxCount = 0, totalHabits = 0 }) {
  const dismissed = new Set(getDismissedSuggestions());
  const suggestions = [];

  if (inboxCount > 0 && !dismissed.has('inbox_ready')) {
    suggestions.push({
      id: 'inbox_ready',
      title: `You have ${inboxCount} saved ${inboxCount === 1 ? 'intention' : 'intentions'} waiting`,
      reason: 'Saved from your study or reflection without a fixed schedule.',
      actionLabel: 'Review Intentions',
      tab: 'intentions'
    });
  }

  if (checkedCount > 0 && !dismissed.has('reflect_after_practice')) {
    suggestions.push({
      id: 'reflect_after_practice',
      title: 'Take a moment to reflect on today’s practice?',
      reason: `You completed ${checkedCount} ${checkedCount === 1 ? 'activity' : 'activities'} today.`,
      actionLabel: 'Open Reflection',
      to: '/lab/reflection'
    });
  }

  if (totalHabits === 0 && !dismissed.has('start_small')) {
    suggestions.push({
      id: 'start_small',
      title: 'Begin with one small 10-minute practice',
      reason: 'You do not need a full schedule to start.',
      actionLabel: 'Explore Sutta Library',
      to: '/lab/sutta'
    });
  }

  return suggestions;
}
