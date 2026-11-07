/**
 * ====================================================================
 * Kalyanamitta Study Roadmap Store (W3C Stand-off Annotation Engine)
 * 
 * DESIGN PRINCIPLE:
 * "The Dhamma remains the source. The roadmap records the journey of
 * studying it. Neither replaces the other."
 * (ධර්මය ඒ ආකාරයෙන්ම පවතී. අපි සටහන් කරන්නේ එය අධ්‍යයනය කළ ගමනයි.)
 * 
 * Conforms to the W3C Web Annotation Data Model.
 * Anchored via SuttaCentral Bilara segment identifiers (e.g. snp1.8:1.3).
 * ====================================================================
 */

const STORAGE_KEY = 'kalyanamitta_dhamma_study_roadmap_v1';

export const NOTE_CATEGORIES = {
  question: {
    id: 'question',
    label: 'Question — මට ඇති වූ ප්‍රශ්නය',
    shortLabel: 'ප්‍රශ්නය',
    color: '#D97706', // Amber
    bg: 'rgba(217, 119, 6, 0.1)',
    border: 'rgba(217, 119, 6, 0.3)',
    icon: 'HelpCircle',
    actionTag: 'Question'
  },
  resource: {
    id: 'resource',
    label: 'Resource — අධ්‍යයනයට උපකාරී වූ මූලාශ්‍රය',
    shortLabel: 'මූලාශ්‍රය',
    color: '#2563EB', // Blue
    bg: 'rgba(37, 99, 235, 0.1)',
    border: 'rgba(37, 99, 235, 0.3)',
    icon: 'BookOpen',
    actionTag: 'Investigate'
  },
  reflection: {
    id: 'reflection',
    label: 'Personal Reflection — මගේ අධ්‍යයන සටහන',
    shortLabel: 'අධ්‍යයන සටහන',
    color: '#8C1515', // Maroon / Brand red
    bg: 'rgba(140, 21, 21, 0.08)',
    border: 'rgba(140, 21, 21, 0.28)',
    icon: 'FileText',
    actionTag: 'Study Note'
  },
  comparison: {
    id: 'comparison',
    label: 'Textual Comparison — පාඨ සංසන්දනය',
    shortLabel: 'සංසන්දනය',
    color: '#7C3AED', // Purple
    bg: 'rgba(124, 58, 237, 0.1)',
    border: 'rgba(124, 58, 237, 0.3)',
    icon: 'GitCompare',
    actionTag: 'Investigate'
  },
  further_inquiry: {
    id: 'further_inquiry',
    label: 'Further Inquiry — තවදුරටත් විමසිය යුතු දේ',
    shortLabel: 'වැඩිදුර විමසුම',
    color: '#059669', // Emerald
    bg: 'rgba(5, 150, 105, 0.1)',
    border: 'rgba(5, 150, 105, 0.3)',
    icon: 'Compass',
    actionTag: 'Revisit'
  }
};

export const MANDATORY_DISCLAIMER =
  'මෙම සටහන බුද්ධ දේශනාවක් හෝ තහවුරු කළ කැනොනික අර්ථකථනයක් නොවේ. මෙය පෞද්ගලික ධර්ම අධ්‍යයන සටහනක් (Personal Study Reflection) පමණි.';

/**
 * Initial sample study roadmap item matching user's canonical case study
 */
function getInitialSampleData() {
  return [
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      id: 'anno-sample-snp1-8-1',
      type: 'Annotation',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      action: 'Study Note',
      target: {
        source: 'snp1.8',
        suttaTitlePali: 'Karaṇīya Mettā Sutta',
        suttaTitleSinhala: 'කරණීය මෙත්ත සූත්‍රය',
        canonicalRef: 'Snp 1.8 / Khp 9',
        selector: {
          type: 'FragmentSelector',
          value: 'snp1.8:1.3',
          conformsTo: 'http://suttacentral.net/bilara/segment'
        },
        canonicalQuote: 'Sakko ujū ca suhujū ca,',
        translationQuote: 'හේ (කුසල් දහම්හි) සමර්ථයෙක් විය යුතුය, ඍජු (අවංක) විය යුතුය, මනාකොටම ඍජු විය යුතුය'
      },
      body: [
        {
          type: 'TextualBody',
          purpose: 'question',
          category: 'question',
          title: 'Sakko, Ujū, Suhujū යන පද තුන මෙහි භාවිත වන සන්දර්භය කුමක්ද?',
          content: 'Sakko, Ujū, Suhujū යන පද තුන මෙහි භාවිත වන සන්දර්භය කුමක්ද? ගිහි හෝ පැවිදි ජීවිතයේ මෙත් සිත වැඩීමට සෘජු බව සහ අතිශයින් සෘජු බව අත්‍යවශ්‍ය වන්නේ ඇයි?'
        },
        {
          type: 'TextualBody',
          purpose: 'resource',
          category: 'resource',
          title: 'භාවිත කළ මූලාශ්‍ර',
          content: '1. Paramatthajotikā (Sutta Nipāta Aṭṭhakathā)\n2. Bhikkhu Bodhi & Bhikkhu Sujato translations\n3. Buddha Jayanti Tripitaka (BJ 25.44)'
        },
        {
          type: 'TextualBody',
          purpose: 'study_note',
          category: 'reflection',
          title: 'පැහැදිලි කරගත් කරුණු සහ පාඨමය සාක්ෂි',
          content: 'Sakko යනු කුසල් දහම් සම්පාදනයේ සමර්ථ බවයි. Ujū යනු සෘජු බව (කාය-වාග් අවංක බව) වන අතර Suhujū යනු අතිශයින් සෘජු බව (මායා, සාඨෙය්‍ය නැතිව ඇතුළාන්තයෙන්ම කෙලින් ක්‍රියා කිරීම) යන්න අටුවාවේ පැහැදිලි කෙරේ.'
        },
        {
          type: 'TextualBody',
          purpose: 'further_inquiry',
          category: 'further_inquiry',
          title: 'තවදුරටත් විමසිය යුතු දේ',
          content: 'අභිධර්මයේ විභංග ප්‍රකරණයේ එන චිත්ත-උජුකතා (Citta-Ujukatā) චෛතසිකය හා සූත්‍ර පිටකයේ උජූ-සුහුජූ විවරණය අතර ඇති න්‍යායාත්මක සමපාත බව පරීක්ෂා කළ යුතුය.'
        }
      ],
      provenance: {
        layer: 3,
        visibility: 'private',
        reviewStatus: 'unreviewed',
        isCanon: false,
        creator: 'Kalyanamitta Seeker',
        disclaimer: 'Personal study reflection · Snp 1.8. ' + MANDATORY_DISCLAIMER
      }
    }
  ];
}

/**
 * Retrieve all roadmap items
 */
export function getRoadmapItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSampleData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('[studyRoadmapStore] Error reading storage:', err);
    return getInitialSampleData();
  }
}

/**
 * Retrieve annotations grouped by segmentId for a specific sutta
 */
export function getAnnotationsBySutta(suttaId) {
  const all = getRoadmapItems();
  const normalizedSuttaId = suttaId.toLowerCase().trim();
  
  const map = {};
  all.forEach(item => {
    if (item.target?.source?.toLowerCase() === normalizedSuttaId) {
      const segId = item.target?.selector?.value;
      if (segId) {
        if (!map[segId]) map[segId] = [];
        map[segId].push(item);
      }
    }
  });

  return map;
}

/**
 * Retrieve a single roadmap item by id
 */
export function getRoadmapItemById(id) {
  const all = getRoadmapItems();
  return all.find(item => item.id === id) || null;
}

/**
 * Save new or update existing study roadmap item
 */
export function saveRoadmapItem(itemData) {
  const all = getRoadmapItems();
  const id = itemData.id || `anno-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const formattedItem = {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    id,
    type: 'Annotation',
    created: itemData.created || now,
    updated: now,
    action: itemData.action || 'Study Note',
    target: {
      source: itemData.target?.source || '',
      suttaTitlePali: itemData.target?.suttaTitlePali || '',
      suttaTitleSinhala: itemData.target?.suttaTitleSinhala || '',
      canonicalRef: itemData.target?.canonicalRef || '',
      selector: {
        type: 'FragmentSelector',
        value: itemData.target?.selector?.value || itemData.segmentId || '',
        conformsTo: 'http://suttacentral.net/bilara/segment'
      },
      canonicalQuote: itemData.target?.canonicalQuote || '',
      translationQuote: itemData.target?.translationQuote || ''
    },
    body: Array.isArray(itemData.body) ? itemData.body : [],
    provenance: {
      layer: 3,
      visibility: itemData.provenance?.visibility || 'private', // 'private' | 'submit_review' | 'public_trail'
      reviewStatus: itemData.provenance?.reviewStatus || 'unreviewed',
      isCanon: false,
      creator: itemData.provenance?.creator || 'Kalyanamitta Seeker',
      disclaimer: `Personal study reflection · ${itemData.target?.canonicalRef || 'Sutta'}. ${MANDATORY_DISCLAIMER}`
    }
  };

  const existingIdx = all.findIndex(i => i.id === id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = formattedItem;
  } else {
    updated = [formattedItem, ...all];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  // Dispatch custom window event so open readers can reactively update
  window.dispatchEvent(new CustomEvent('studyRoadmapUpdated', { detail: { id, suttaId: formattedItem.target.source } }));
  return formattedItem;
}

/**
 * Delete a study roadmap item
 */
export function deleteRoadmapItem(id) {
  const all = getRoadmapItems();
  const filtered = all.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('studyRoadmapUpdated', { detail: { id, deleted: true } }));
  return true;
}

/**
 * Export study journey as W3C Compliant JSON
 */
export function exportStudyTrail(title = 'My Dhamma Study Trail') {
  const items = getRoadmapItems();
  const exportPayload = {
    title,
    exportedAt: new Date().toISOString(),
    generator: 'Kalyanamitta Personal Study Roadmap v1',
    philosophy: 'The Dhamma remains the source. The roadmap records the journey of studying it. Neither replaces the other.',
    items
  };
  return JSON.stringify(exportPayload, null, 2);
}
