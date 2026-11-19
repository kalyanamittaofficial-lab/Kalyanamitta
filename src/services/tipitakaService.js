const TIPITAKA_BASE = '/data/tipitaka';

let treeCache = null;
let popularCache = null;
const textFileCache = new Map();

function cleanText(text) {
  if (!text) return '';
  return text.replace(/\{\d+\}/g, '').trim();
}

export async function loadSuttaTree() {
  if (treeCache) return treeCache;
  const res = await fetch(`${TIPITAKA_BASE}/sutta-tree.json`);
  if (!res.ok) throw new Error('Failed to load Tipitaka index');
  treeCache = await res.json();
  return treeCache;
}

export async function loadPopularSuttas() {
  if (popularCache) return popularCache;
  const [popRes, tree] = await Promise.all([
    fetch(`${TIPITAKA_BASE}/popular-suttas.json`),
    loadSuttaTree()
  ]);
  if (!popRes.ok) return [];
  const raw = await popRes.json();

  popularCache = raw
    .filter(item => tree[item.key])
    .map(item => {
      const node = tree[item.key];
      return {
        key: item.key,
        paliName: node[0],
        sinhalaName: node[1],
        aliasesSi: item.si || [],
        aliasesRo: item.ro || [],
        weight: item.weight || 0,
        textFile: node[5]
      };
    });

  return popularCache;
}

export async function getNikayas() {
  const tree = await loadSuttaTree();
  const nikayaKeys = ['dn', 'mn', 'sn', 'an', 'kn'];
  return nikayaKeys
    .filter(k => tree[k])
    .map(k => ({
      key: k,
      paliName: tree[k][0],
      sinhalaName: tree[k][1]
    }));
}

export async function getTreeChildren(parentKey) {
  const tree = await loadSuttaTree();
  const children = [];
  const hasChildrenSet = new Set();

  for (const v of Object.values(tree)) {
    if (v[4]) hasChildrenSet.add(v[4]);
  }

  for (const [k, v] of Object.entries(tree)) {
    if (v[4] === parentKey) {
      children.push({
        key: k,
        paliName: v[0],
        sinhalaName: v[1],
        level: v[2],
        pos: v[3],
        textFile: v[5],
        hasChildren: hasChildrenSet.has(k)
      });
    }
  }

  // Sort by textFile order or [pageIdx, entryIdx]
  children.sort((a, b) => {
    if (a.textFile === b.textFile) {
      return a.pos[0] !== b.pos[0] ? a.pos[0] - b.pos[0] : a.pos[1] - b.pos[1];
    }
    return a.key.localeCompare(b.key, undefined, { numeric: true });
  });

  return children;
}

export async function getBreadcrumbs(key) {
  const tree = await loadSuttaTree();
  const crumbs = [];
  let curr = key;
  let guard = 0;

  while (curr && tree[curr] && guard < 10) {
    const node = tree[curr];
    crumbs.unshift({
      key: curr,
      paliName: node[0],
      sinhalaName: node[1]
    });
    if (curr === 'sp' || node[4] === 'root') break;
    curr = node[4];
    guard += 1;
  }

  return crumbs;
}

export async function searchSuttas(query, limit = 40) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];

  const [tree, popular] = await Promise.all([
    loadSuttaTree(),
    loadPopularSuttas()
  ]);

  const seen = new Set();
  const results = [];

  // 1. Prioritize popular suttas matching Sinhala or Romanized aliases
  for (const item of popular) {
    const hit =
      item.sinhalaName.toLowerCase().includes(q) ||
      item.paliName.toLowerCase().includes(q) ||
      item.key.toLowerCase().includes(q) ||
      item.aliasesSi.some(a => a.toLowerCase().includes(q)) ||
      item.aliasesRo.some(a => a.toLowerCase().includes(q));

    if (hit && !seen.has(item.key)) {
      seen.add(item.key);
      results.push({
        key: item.key,
        paliName: item.paliName,
        sinhalaName: item.sinhalaName,
        isPopular: true
      });
    }
  }

  // 2. Search across all 7,655 Sutta Pitaka tree nodes
  for (const [k, v] of Object.entries(tree)) {
    if (results.length >= limit) break;
    if (seen.has(k) || k === 'sp') continue;

    if (
      v[1].toLowerCase().includes(q) ||
      v[0].toLowerCase().includes(q) ||
      k.toLowerCase().includes(q)
    ) {
      seen.add(k);
      results.push({
        key: k,
        paliName: v[0],
        sinhalaName: v[1],
        isPopular: false
      });
    }
  }

  return results.slice(0, limit);
}

async function loadTextFile(textFile) {
  if (textFileCache.has(textFile)) return textFileCache.get(textFile);
  const res = await fetch(`${TIPITAKA_BASE}/text/${textFile}.json`);
  if (!res.ok) throw new Error(`Failed to load ${textFile}.json`);
  const data = await res.json();
  textFileCache.set(textFile, data);
  return data;
}

export async function getSuttaContent(suttaKey) {
  const tree = await loadSuttaTree();
  const node = tree[suttaKey];
  if (!node) throw new Error(`Sutta "${suttaKey}" not found in Tipitaka index`);

  const [paliTitle, sinhalaTitle, level, [startPage, startEntry], , textFile] = node;

  // Determine end boundary in the same textFile
  let endPos = null;
  for (const v of Object.values(tree)) {
    if (v[5] !== textFile) continue;
    const [p1, e1] = v[3];
    if ((p1 > startPage || (p1 === startPage && e1 > startEntry)) && v[2] >= level) {
      if (!endPos || p1 < endPos[0] || (p1 === endPos[0] && e1 < endPos[1])) {
        endPos = [p1, e1];
      }
    }
  }

  const [fileData, breadcrumbs] = await Promise.all([
    loadTextFile(textFile),
    getBreadcrumbs(suttaKey)
  ]);

  const pages = fileData.pages || [];
  const entries = [];

  for (let p = startPage; p < pages.length; p++) {
    if (endPos && p > endPos[0]) break;
    const page = pages[p];
    const paliList = page?.pali?.entries || [];
    const sinhList = page?.sinh?.entries || [];
    const maxLen = Math.max(paliList.length, sinhList.length);

    const fromIdx = p === startPage ? startEntry : 0;
    const toIdx = endPos && p === endPos[0] ? Math.min(endPos[1], maxLen) : maxLen;

    for (let i = fromIdx; i < toIdx; i++) {
      const pEntry = paliList[i];
      const sEntry = sinhList[i];
      const paliText = cleanText(pEntry?.text);
      const sinhText = cleanText(sEntry?.text);

      if (!paliText && !sinhText) continue;

      entries.push({
        id: `${p}-${i}`,
        segmentId: `${suttaKey}:${p}.${i}`,
        pageNum: page.pageNum,
        type: sEntry?.type || pEntry?.type || 'paragraph',
        entryLevel: sEntry?.level || pEntry?.level || 0,
        pali: paliText,
        sinh: sinhText
      });
    }
  }

  return {
    key: suttaKey,
    suttaId: suttaKey,
    paliTitle,
    sinhalaTitle,
    titlePali: paliTitle,
    titleSi: sinhalaTitle,
    textFile,
    breadcrumbs,
    entries
  };
}
