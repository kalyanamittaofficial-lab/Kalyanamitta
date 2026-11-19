import { upsertLabRow, deleteLabRow, fetchUserLabRows } from './labSyncService';
import { getAnnotationSummary } from './studyRoadmapStore';

const MAPS_KEY = 'km_lab_knowledge_maps_v1';
const NODES_KEY = 'km_lab_map_nodes_v1';
const EDGES_KEY = 'km_lab_map_edges_v1';

export const NODE_TYPES = {
  concept: { id: 'concept', label: 'ධර්ම සංකල්පය', enLabel: 'Dhamma Concept', color: '#4F46E5' },
  sutta: { id: 'sutta', label: 'සූත්‍ර මූලාශ්‍රය', enLabel: 'Tipiṭaka Sutta', color: '#059669' },
  annotation: { id: 'annotation', label: 'අධ්‍යයන සටහන', enLabel: 'Study Note', color: '#D97706' },
  practice: { id: 'practice', label: 'ප්‍රතිපදා අංගය', enLabel: 'Path Practice', color: '#0EA5E9' },
  insight: { id: 'insight', label: 'පෞද්ගලික අවබෝධය', enLabel: 'Personal Reflection', color: '#9333EA' }
};

export const EDGE_RELATIONS = [
  'grounded in',
  'relates to',
  'supports',
  'leads to practice',
  'contrasts with',
  'elaborates'
];

function ensureDefaultMap() {
  try {
    const raw = localStorage.getItem(MAPS_KEY);
    const maps = raw ? JSON.parse(raw) : [];
    if (maps.length > 0) return maps;
  } catch {
    // ignore parse error
  }

  const now = new Date().toISOString();
  const defaultMap = {
    id: 'map-default-personal',
    title: 'My Dhamma Knowledge Map',
    description: 'Connecting canonical suttas, personal study annotations, and daily practice.',
    authorName: 'Kalyanamitta Seeker',
    visibility: 'private',
    createdAt: now,
    updatedAt: now
  };
  localStorage.setItem(MAPS_KEY, JSON.stringify([defaultMap]));

  const initialNodes = [
    {
      id: 'node-seed-metta',
      mapId: defaultMap.id,
      nodeType: 'sutta',
      label: 'Karaṇīya Mettā Sutta',
      summary: 'Cultivating boundless goodwill and uprightness (ujū ca suhujū ca).',
      sourceRef: 'Snp 1.8 / Khp 9',
      suttaKey: 'kn-khp-9',
      posX: 140,
      posY: 130,
      color: NODE_TYPES.sutta.color,
      createdAt: now
    },
    {
      id: 'node-seed-compass',
      mapId: defaultMap.id,
      nodeType: 'concept',
      label: 'Sammā Saṅkappa (Right Intention)',
      summary: 'Non-ill-will (avyāpāda) and harmlessness (avihiṁsā) as active mental orientation.',
      sourceRef: 'MN 117 / Noble Eightfold Path',
      suttaKey: 'sn-5-12-2-1',
      posX: 460,
      posY: 130,
      color: NODE_TYPES.concept.color,
      createdAt: now
    }
  ];
  const initialEdges = [
    {
      id: 'edge-seed-1',
      mapId: defaultMap.id,
      sourceNodeId: 'node-seed-metta',
      targetNodeId: 'node-seed-compass',
      relationLabel: 'leads to practice',
      createdAt: now
    }
  ];

  localStorage.setItem(NODES_KEY, JSON.stringify(initialNodes));
  localStorage.setItem(EDGES_KEY, JSON.stringify(initialEdges));
  return [defaultMap];
}

export function getKnowledgeMaps() {
  return ensureDefaultMap();
}

export function getMapNodes(mapId) {
  ensureDefaultMap();
  try {
    const raw = localStorage.getItem(NODES_KEY);
    const all = raw ? JSON.parse(raw) : [];
    return mapId ? all.filter(n => n.mapId === mapId) : all;
  } catch {
    return [];
  }
}

export function getMapEdges(mapId) {
  ensureDefaultMap();
  try {
    const raw = localStorage.getItem(EDGES_KEY);
    const all = raw ? JSON.parse(raw) : [];
    return mapId ? all.filter(e => e.mapId === mapId) : all;
  } catch {
    return [];
  }
}

export function saveKnowledgeMap(mapData) {
  const maps = getKnowledgeMaps();
  const now = new Date().toISOString();
  const id = mapData.id || `map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const idx = maps.findIndex(m => m.id === id);
  const existing = idx >= 0 ? maps[idx] : {};

  const record = {
    id,
    title: mapData.title?.trim() || existing.title || 'Untitled Knowledge Map',
    description: mapData.description ?? existing.description ?? '',
    authorName: mapData.authorName?.trim() || existing.authorName || 'Kalyanamitta Seeker',
    visibility: mapData.visibility === 'public' ? 'public' : 'private',
    createdAt: existing.createdAt || now,
    updatedAt: now
  };

  if (idx >= 0) maps[idx] = record;
  else maps.unshift(record);

  localStorage.setItem(MAPS_KEY, JSON.stringify(maps));
  upsertLabRow('lab_knowledge_maps', {
    id: record.id,
    title: record.title,
    description: record.description,
    author_name: record.authorName,
    visibility: record.visibility,
    created_at: record.createdAt,
    updated_at: record.updatedAt
  });
  window.dispatchEvent(new CustomEvent('labKnowledgeMapUpdated'));
  return record;
}

export function addMapNode(nodeData) {
  const all = getMapNodes();
  const now = new Date().toISOString();
  const typeCfg = NODE_TYPES[nodeData.nodeType] || NODE_TYPES.concept;
  const node = {
    id: nodeData.id || `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    mapId: nodeData.mapId || getKnowledgeMaps()[0].id,
    nodeType: typeCfg.id,
    label: nodeData.label?.trim() || 'Untitled Node',
    summary: nodeData.summary || '',
    sourceRef: nodeData.sourceRef || '',
    suttaKey: nodeData.suttaKey || null,
    segmentId: nodeData.segmentId || null,
    annotationId: nodeData.annotationId || null,
    posX: typeof nodeData.posX === 'number' ? nodeData.posX : 140 + (all.length % 4) * 180,
    posY: typeof nodeData.posY === 'number' ? nodeData.posY : 110 + Math.floor(all.length / 4) * 140,
    color: nodeData.color || typeCfg.color,
    createdAt: now
  };

  all.push(node);
  localStorage.setItem(NODES_KEY, JSON.stringify(all));
  upsertLabRow('lab_map_nodes', {
    id: node.id,
    map_id: node.mapId,
    node_type: node.nodeType,
    label: node.label,
    summary: node.summary,
    source_ref: node.sourceRef,
    sutta_key: node.suttaKey,
    segment_id: node.segmentId,
    annotation_id: node.annotationId,
    pos_x: node.posX,
    pos_y: node.posY,
    color: node.color,
    created_at: node.createdAt
  });
  window.dispatchEvent(new CustomEvent('labKnowledgeMapUpdated'));
  return node;
}

export function updateMapNodePosition(nodeId, posX, posY) {
  const all = getMapNodes();
  const idx = all.findIndex(n => n.id === nodeId);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], posX, posY };
  localStorage.setItem(NODES_KEY, JSON.stringify(all));
  const n = all[idx];
  upsertLabRow('lab_map_nodes', {
    id: n.id,
    map_id: n.mapId,
    node_type: n.nodeType,
    label: n.label,
    summary: n.summary,
    source_ref: n.sourceRef,
    sutta_key: n.suttaKey,
    segment_id: n.segmentId,
    annotation_id: n.annotationId,
    pos_x: n.posX,
    pos_y: n.posY,
    color: n.color,
    created_at: n.createdAt
  });
  window.dispatchEvent(new CustomEvent('labKnowledgeMapUpdated'));
  return n;
}

export function deleteMapNode(nodeId) {
  const nextNodes = getMapNodes().filter(n => n.id !== nodeId);
  const nextEdges = getMapEdges().filter(e => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId);
  localStorage.setItem(NODES_KEY, JSON.stringify(nextNodes));
  localStorage.setItem(EDGES_KEY, JSON.stringify(nextEdges));
  deleteLabRow('lab_map_nodes', { id: nodeId });
  window.dispatchEvent(new CustomEvent('labKnowledgeMapUpdated'));
}

export function addMapEdge({ mapId, sourceNodeId, targetNodeId, relationLabel = 'relates to' }) {
  if (!sourceNodeId || !targetNodeId || sourceNodeId === targetNodeId) return null;
  const all = getMapEdges();
  const exists = all.find(
    e => e.mapId === mapId && e.sourceNodeId === sourceNodeId && e.targetNodeId === targetNodeId
  );
  if (exists) return exists;

  const now = new Date().toISOString();
  const edge = {
    id: `edge-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    mapId: mapId || getKnowledgeMaps()[0].id,
    sourceNodeId,
    targetNodeId,
    relationLabel,
    createdAt: now
  };
  all.push(edge);
  localStorage.setItem(EDGES_KEY, JSON.stringify(all));
  upsertLabRow('lab_map_edges', {
    id: edge.id,
    map_id: edge.mapId,
    source_node_id: edge.sourceNodeId,
    target_node_id: edge.targetNodeId,
    relation_label: edge.relationLabel,
    created_at: edge.createdAt
  });
  window.dispatchEvent(new CustomEvent('labKnowledgeMapUpdated'));
  return edge;
}

export function deleteMapEdge(edgeId) {
  const next = getMapEdges().filter(e => e.id !== edgeId);
  localStorage.setItem(EDGES_KEY, JSON.stringify(next));
  deleteLabRow('lab_map_edges', { id: edgeId });
  window.dispatchEvent(new CustomEvent('labKnowledgeMapUpdated'));
}

/**
 * Connect a W3C Study Annotation directly into the user's Knowledge Map
 */
export function addAnnotationToKnowledgeMap(annotation, mapId = null) {
  const targetMapId = mapId || getKnowledgeMaps()[0].id;
  const existing = getMapNodes(targetMapId).find(n => n.annotationId === annotation.id);
  if (existing) return existing;

  const summary = getAnnotationSummary(annotation);
  return addMapNode({
    mapId: targetMapId,
    nodeType: 'annotation',
    label: summary?.title || annotation.target?.suttaTitleSinhala || annotation.target?.source || 'Study Note',
    summary: summary?.content || annotation.target?.translationQuote || annotation.target?.canonicalQuote || '',
    sourceRef: `${annotation.target?.canonicalRef || annotation.target?.source || ''} (${annotation.target?.selector?.value || ''})`.trim(),
    suttaKey: annotation.target?.source || null,
    segmentId: annotation.target?.selector?.value || null,
    annotationId: annotation.id
  });
}

export async function hydrateKnowledgeMapsFromCloud() {
  const [maps, nodes, edges] = await Promise.all([
    fetchUserLabRows('lab_knowledge_maps', 'updated_at', false),
    fetchUserLabRows('lab_map_nodes', 'created_at', true),
    fetchUserLabRows('lab_map_edges', 'created_at', true)
  ]);
  if (!maps || maps.length === 0) return getKnowledgeMaps();

  const mappedMaps = maps.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description || '',
    authorName: m.author_name || 'Kalyanamitta Seeker',
    visibility: m.visibility || 'private',
    createdAt: m.created_at,
    updatedAt: m.updated_at
  }));
  localStorage.setItem(MAPS_KEY, JSON.stringify(mappedMaps));

  if (nodes) {
    localStorage.setItem(NODES_KEY, JSON.stringify(nodes.map(n => ({
      id: n.id,
      mapId: n.map_id,
      nodeType: n.node_type,
      label: n.label,
      summary: n.summary || '',
      sourceRef: n.source_ref || '',
      suttaKey: n.sutta_key,
      segmentId: n.segment_id,
      annotationId: n.annotation_id,
      posX: n.pos_x,
      posY: n.pos_y,
      color: n.color,
      createdAt: n.created_at
    }))));
  }
  if (edges) {
    localStorage.setItem(EDGES_KEY, JSON.stringify(edges.map(e => ({
      id: e.id,
      mapId: e.map_id,
      sourceNodeId: e.source_node_id,
      targetNodeId: e.target_node_id,
      relationLabel: e.relation_label,
      createdAt: e.created_at
    }))));
  }
  window.dispatchEvent(new CustomEvent('labKnowledgeMapUpdated'));
  return mappedMaps;
}
