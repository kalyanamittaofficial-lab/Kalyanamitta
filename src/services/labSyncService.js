import { supabase } from '../utils/supabase';

/**
 * Shared Supabase auth + graceful cloud sync helpers for Sutta Learning Lab.
 * All personal records are private by default (RLS enforced on Supabase).
 * If the user is signed out or offline, localStorage remains functional.
 */

export async function getActiveUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  } catch {
    return null;
  }
}

export async function upsertLabRow(table, row, conflictTarget) {
  const user = await getActiveUser();
  if (!user) return { synced: false, reason: 'unauthenticated' };

  try {
    const payload = { ...row, user_id: user.id };
    const query = conflictTarget
      ? supabase.from(table).upsert(payload, { onConflict: conflictTarget })
      : supabase.from(table).upsert(payload);
    const { error } = await query;
    if (error) {
      console.warn(`[LabSync] ${table} upsert skipped:`, error.message);
      return { synced: false, error: error.message };
    }
    return { synced: true };
  } catch (err) {
    console.warn(`[LabSync] ${table} upsert failed:`, err);
    return { synced: false, error: err?.message };
  }
}

export async function deleteLabRow(table, matchObj) {
  const user = await getActiveUser();
  if (!user) return { synced: false, reason: 'unauthenticated' };

  try {
    let query = supabase.from(table).delete().eq('user_id', user.id);
    for (const [col, val] of Object.entries(matchObj)) {
      query = query.eq(col, val);
    }
    const { error } = await query;
    if (error) {
      console.warn(`[LabSync] ${table} delete skipped:`, error.message);
      return { synced: false, error: error.message };
    }
    return { synced: true };
  } catch (err) {
    console.warn(`[LabSync] ${table} delete failed:`, err);
    return { synced: false, error: err?.message };
  }
}

export async function fetchUserLabRows(table, orderBy = 'created_at', ascending = false) {
  const user = await getActiveUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', user.id)
      .order(orderBy, { ascending });
    if (error) {
      console.warn(`[LabSync] ${table} fetch skipped:`, error.message);
      return null;
    }
    return data || [];
  } catch {
    return null;
  }
}
