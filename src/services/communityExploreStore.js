import { supabase } from '../utils/supabase';
import { getActiveUser, upsertLabRow } from './labSyncService';
import { getKnowledgeMaps, getMapNodes, getMapEdges } from './knowledgeMapStore';
import { getDedications } from './practiceEcosystemStore';

const PROFILE_KEY = 'km_lab_public_profile_v1';

export function getMyPublicProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : {
      displayName: 'Kalyanamitta Seeker',
      bio: '',
      studyFocus: 'Sutta Study & Mettā Bhāvanā',
      isPublic: false
    };
  } catch {
    return {
      displayName: 'Kalyanamitta Seeker',
      bio: '',
      studyFocus: '',
      isPublic: false
    };
  }
}

export async function saveMyPublicProfile(profile) {
  const next = {
    displayName: profile.displayName?.trim() || 'Kalyanamitta Seeker',
    bio: profile.bio?.trim() || '',
    studyFocus: profile.studyFocus?.trim() || '',
    isPublic: Boolean(profile.isPublic),
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next));

  const user = await getActiveUser();
  if (user) {
    await upsertLabRow('lab_public_profiles', {
      user_id: user.id,
      display_name: next.displayName,
      bio: next.bio,
      study_focus: next.studyFocus,
      is_public: next.isPublic,
      updated_at: next.updatedAt
    }, 'user_id');
  }
  window.dispatchEvent(new CustomEvent('labCommunityUpdated'));
  return next;
}

export async function hydrateMyPublicProfileFromCloud() {
  const user = await getActiveUser();
  if (!user) return getMyPublicProfile();
  try {
    const { data, error } = await supabase
      .from('lab_public_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error || !data) return getMyPublicProfile();
    const mapped = {
      displayName: data.display_name,
      bio: data.bio || '',
      studyFocus: data.study_focus || '',
      isPublic: Boolean(data.is_public),
      updatedAt: data.updated_at
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(mapped));
    return mapped;
  } catch {
    return getMyPublicProfile();
  }
}

export async function fetchPublicCommunityData() {
  // Combine cloud public records + user's own local public items
  const localPublicMaps = getKnowledgeMaps().filter(m => m.visibility === 'public');
  const localPublicDedications = getDedications().filter(d => d.visibility === 'public');
  const myProfile = getMyPublicProfile();

  let cloudMaps = [];
  let cloudProfiles = [];
  let cloudDedications = [];

  try {
    const [mRes, pRes, dRes] = await Promise.all([
      supabase.from('lab_knowledge_maps').select('*').eq('visibility', 'public').order('updated_at', { ascending: false }).limit(24),
      supabase.from('lab_public_profiles').select('*').eq('is_public', true).order('updated_at', { ascending: false }).limit(24),
      supabase.from('lab_dedications').select('*').eq('visibility', 'public').order('created_at', { ascending: false }).limit(24)
    ]);

    if (!mRes.error && mRes.data) {
      cloudMaps = mRes.data.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description || '',
        authorName: m.author_name || 'Kalyanamitta Seeker',
        visibility: m.visibility,
        updatedAt: m.updated_at
      }));
    }
    if (!pRes.error && pRes.data) {
      cloudProfiles = pRes.data.map(p => ({
        userId: p.user_id,
        displayName: p.display_name,
        bio: p.bio || '',
        studyFocus: p.study_focus || ''
      }));
    }
    if (!dRes.error && dRes.data) {
      cloudDedications = dRes.data.map(d => ({
        id: d.id,
        dedicationType: d.dedication_type,
        title: d.title,
        dedicationText: d.dedication_text,
        authorName: d.author_name || 'Kalyanamitta Seeker',
        createdAt: d.created_at
      }));
    }
  } catch {
    // Offline fallback uses local public records
  }

  const mapById = new Map();
  for (const m of [...cloudMaps, ...localPublicMaps]) {
    if (!mapById.has(m.id)) mapById.set(m.id, m);
  }

  const dedById = new Map();
  for (const d of [...cloudDedications, ...localPublicDedications]) {
    if (!dedById.has(d.id)) dedById.set(d.id, d);
  }

  const profiles = [...cloudProfiles];
  if (myProfile.isPublic && profiles.length === 0) {
    profiles.push({
      userId: 'local-me',
      displayName: myProfile.displayName,
      bio: myProfile.bio,
      studyFocus: myProfile.studyFocus
    });
  }

  return {
    maps: Array.from(mapById.values()),
    profiles,
    dedications: Array.from(dedById.values())
  };
}

export async function fetchPublicMapById(mapId) {
  // Check local maps first if public
  const localMap = getKnowledgeMaps().find(m => m.id === mapId && m.visibility === 'public');
  if (localMap) {
    return {
      map: localMap,
      nodes: getMapNodes(mapId),
      edges: getMapEdges(mapId)
    };
  }

  try {
    const { data: m, error } = await supabase
      .from('lab_knowledge_maps')
      .select('*')
      .eq('id', mapId)
      .eq('visibility', 'public')
      .maybeSingle();

    if (error || !m) return null;

    const [nRes, eRes] = await Promise.all([
      supabase.from('lab_map_nodes').select('*').eq('map_id', mapId),
      supabase.from('lab_map_edges').select('*').eq('map_id', mapId)
    ]);

    return {
      map: {
        id: m.id,
        title: m.title,
        description: m.description || '',
        authorName: m.author_name || 'Kalyanamitta Seeker',
        visibility: m.visibility,
        updatedAt: m.updated_at
      },
      nodes: (nRes.data || []).map(n => ({
        id: n.id,
        mapId: n.map_id,
        nodeType: n.node_type,
        label: n.label,
        summary: n.summary || '',
        sourceRef: n.source_ref || '',
        suttaKey: n.sutta_key,
        posX: n.pos_x,
        posY: n.pos_y,
        color: n.color
      })),
      edges: (eRes.data || []).map(e => ({
        id: e.id,
        mapId: e.map_id,
        sourceNodeId: e.source_node_id,
        targetNodeId: e.target_node_id,
        relationLabel: e.relation_label
      }))
    };
  } catch {
    return null;
  }
}
