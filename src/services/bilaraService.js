/**
 * ====================================================================
 * Bilara Data Service — SuttaCentral Bilara Data Integration
 * Provides 3-layer textual retrieval:
 *   Layer 1: Canonical Root Text (Pali Mahāsaṅgīti ms)
 *   Layer 2: Scholarly Translations, Variants, References & Commentary
 * ====================================================================
 */

const LOCAL_BILARA_BASE = '/data/bilara';
const SC_API_BASE = 'https://suttacentral.net/api';

/**
 * Fetch list of indexed suttas
 */
export async function getAvailableSuttas() {
  try {
    const res = await fetch(`${LOCAL_BILARA_BASE}/sutta_index.json`);
    if (!res.ok) throw new Error('Could not load sutta index');
    return await res.json();
  } catch (err) {
    console.warn('[bilaraService] Using fallback index:', err);
    return [
      {
        id: 'snp1.8',
        slug: 'snp1.8',
        canonicalRef: 'Snp 1.8 / Khp 9',
        titlePali: 'Mettasutta (Karaṇīya Mettā Sutta)',
        titleSinhala: 'කරණීය මෙත්ත සූත්‍රය',
        titleEnglish: 'Discourse on Loving-Kindness',
        nikaya: 'Khuddaka Nikāya',
        nikayaSinhala: 'ඛුද්දක නිකාය',
        vagga: 'Uragavagga',
        vaggaSinhala: 'උරග වග්ගය',
        segmentCount: 43
      }
    ];
  }
}

/**
 * Load complete segmented data for a specific Sutta
 * Synchronizes Root, English Translation, Sinhala Translation, Comments, Variants, References
 */
export async function getSuttaData(suttaId) {
  const normalizedId = suttaId.toLowerCase().trim();

  // Try local bundled files first
  try {
    const [rootRes, enRes, siRes, commentRes, variantRes, refRes] = await Promise.all([
      fetch(`${LOCAL_BILARA_BASE}/${normalizedId}/root.json`),
      fetch(`${LOCAL_BILARA_BASE}/${normalizedId}/translation-en.json`),
      fetch(`${LOCAL_BILARA_BASE}/${normalizedId}/translation-si.json`).catch(() => null),
      fetch(`${LOCAL_BILARA_BASE}/${normalizedId}/comment.json`).catch(() => null),
      fetch(`${LOCAL_BILARA_BASE}/${normalizedId}/variant.json`).catch(() => null),
      fetch(`${LOCAL_BILARA_BASE}/${normalizedId}/reference.json`).catch(() => null),
    ]);

    if (!rootRes.ok) {
      throw new Error(`Local bundle for ${suttaId} not found, falling back`);
    }

    const rootData = await rootRes.json();
    const enData = enRes.ok ? await enRes.json() : {};
    const siData = (siRes && siRes.ok) ? await siRes.json() : {};
    const commentData = (commentRes && commentRes.ok) ? await commentRes.json() : {};
    const variantData = (variantRes && variantRes.ok) ? await variantRes.json() : {};
    const refData = (refRes && refRes.ok) ? await refRes.json() : {};

    return buildUnifiedSuttaPayload(normalizedId, rootData, enData, siData, commentData, variantData, refData);
  } catch (localErr) {
    console.info(`[bilaraService] Local fetch failed for ${suttaId}, attempting SuttaCentral API`, localErr);
    return fetchFromSuttaCentralApi(normalizedId);
  }
}

/**
 * Merge raw bilara segment maps into an ordered structured array
 */
function buildUnifiedSuttaPayload(suttaId, rootData, enData, siData, commentData, variantData, refData) {
  const segmentKeys = Object.keys(rootData);

  // Extract sutta title info if segment 0.1/0.2 exists
  const titlePali = (rootData[`${suttaId}:0.2`] || rootData[`${suttaId}:0.1`] || suttaId).trim();
  const titleEn = (enData[`${suttaId}:0.2`] || enData[`${suttaId}:0.1`] || '').trim();
  const titleSi = (siData[`${suttaId}:0.2`] || siData[`${suttaId}:0.1`] || '').trim();

  const segments = segmentKeys.map((segId) => {
    const rootText = (rootData[segId] || '').trim();
    const enText = (enData[segId] || '').trim();
    const siText = (siData[segId] || '').trim();
    const comment = (commentData[segId] || '').trim();
    const variant = (variantData[segId] || '').trim();
    const reference = (refData[segId] || '').trim();

    // Parse segment numbers (e.g. snp1.8:1.3 -> major: 1, minor: 3)
    const parts = segId.split(':');
    const subParts = (parts[1] || '0.0').split('.');
    const major = parseInt(subParts[0], 10) || 0;
    const minor = parseInt(subParts[1], 10) || 0;
    const isHeading = major === 0;

    return {
      segmentId: segId,
      suttaId,
      major,
      minor,
      isHeading,
      rootPali: rootText,
      translationEn: enText,
      translationSi: siText,
      comment,
      variant,
      reference,
      hasScholarlyExtras: Boolean(comment || variant || reference)
    };
  });

  return {
    suttaId,
    titlePali,
    titleEn,
    titleSi,
    provenance: {
      layer1: 'Mahāsaṅgīti Tipiṭaka Buddhavasse 2500 (MS Pali)',
      layer2Translations: [
        { lang: 'en', author: 'Bhikkhu Sujato', license: 'CC0' },
        { lang: 'si', author: 'Scholarly Sinhala (Buddha Jayanti / AP de Zoysa)', license: 'Public Domain / Free Dhamma' }
      ]
    },
    segments
  };
}

/**
 * Fallback to SuttaCentral live Bilara API
 */
async function fetchFromSuttaCentralApi(suttaId) {
  try {
    const res = await fetch(`${SC_API_BASE}/bilarasuttas/${suttaId}/sujato?lang=en`);
    if (!res.ok) throw new Error(`SuttaCentral API error: ${res.status}`);
    const data = await res.json();

    const rootData = data.root_text || {};
    const enData = data.translation_text || {};
    const commentData = data.comment_text || {};
    const variantData = data.variant_text || {};
    const refData = data.reference_text || {};

    return buildUnifiedSuttaPayload(suttaId, rootData, enData, {}, commentData, variantData, refData);
  } catch (err) {
    console.error(`[bilaraService] Failed to load from SuttaCentral API:`, err);
    throw new Error(`සූත්‍ර දත්ත ලබාගැනීමට නොහැකි විය (${suttaId})`);
  }
}
