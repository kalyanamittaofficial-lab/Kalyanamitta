/**
 * ====================================================================
 * Kalyanamitta Pali Lexicon & Grammatical Analysis Service
 * Research-grade Pali vocabulary, grammatical tagging, and definitions
 * Sources: Pali Text Society (PTS), A.P. Buddhadatta, Childers, SuttaCentral
 * ====================================================================
 */

export const PALI_LEXICON = {
  // --- Core Doctrinal & Karaṇīya Mettā Sutta Terms ---
  'karaṇīya': {
    pali: 'karaṇīya',
    stem: 'kar',
    pos: 'f.p.p. (gerundive) of karoti',
    meaningEn: 'what ought to be done; duty; obligation; task to be accomplished',
    meaningSi: 'කළ යුත්ත, ඉටු කළ යුතු කාර්යය',
    root: '√kar (to do, to make)',
    source: 'PTS p. 196 / Buddhadatta'
  },
  'atthakusala': {
    pali: 'atthakusala',
    stem: 'attha + kusala',
    pos: 'compound adj.',
    meaningEn: 'skilled in welfare, adept in knowing what is truly beneficial or spiritual good',
    meaningSi: 'තම වැඩෙහි දක්ෂ, පරමාර්ථ සුභසාධනයෙහි දක්ෂ',
    root: 'attha (benefit, goal) + √kus (to embrace, skill)',
    source: 'PTS p. 24'
  },
  'santa': {
    pali: 'santa',
    stem: 'sam',
    pos: 'p.p. of sammati',
    meaningEn: 'calmed, peaceful, tranquil, serene; quieted',
    meaningSi: 'සන්සුන් වූ, ශාන්ත වූ',
    root: '√sam (to be appeased / tranquil)',
    source: 'PTS p. 676'
  },
  'pada': {
    pali: 'pada',
    stem: 'pad',
    pos: 'masc. / neut. noun',
    meaningEn: 'foot, step; state, station, abode; Nibbāna as the deathless state (amatapada)',
    meaningSi: 'පදය, පියවර, ශාන්ත පදය (නිවන)',
    root: '√pad (to go, step)',
    source: 'PTS p. 408'
  },
  'sakka': {
    pali: 'sakka',
    stem: 'sak',
    pos: 'adj. / potential part.',
    meaningEn: 'able, capable, competent, fit',
    meaningSi: 'සමර්ථ වූ, හැකියාව ඇති',
    root: '√sak (to be able)',
    source: 'PTS p. 660'
  },
  'uju': {
    pali: 'uju',
    stem: 'uju',
    pos: 'adj.',
    meaningEn: 'straight, upright, direct, honest, frank',
    meaningSi: 'ඍජු වූ, අවංක වූ',
    root: 'uju / Vedic ṛju',
    source: 'PTS p. 129'
  },
  'suhuju': {
    pali: 'suhuju',
    stem: 'su + uju',
    pos: 'adj. (intensive compound)',
    meaningEn: 'thoroughly upright, perfectly straight, utterly honest and sincere in speech and mind',
    meaningSi: 'මනාකොටම ඍජු වූ, අතිශයින් අවංක වූ',
    root: 'su (well) + uju (upright)',
    source: 'PTS p. 717'
  },
  'suvaca': {
    pali: 'suvaca',
    stem: 'su + vac',
    pos: 'adj.',
    meaningEn: 'easy to speak to, amenable to advice, docile, receptive to admonition',
    meaningSi: 'කීකරු වූ, පහසුවෙන් අවවාද කළ හැකි',
    root: 'su (good) + √vac (to speak)',
    source: 'PTS p. 717'
  },
  'mudu': {
    pali: 'mudu',
    stem: 'mudu',
    pos: 'adj.',
    meaningEn: 'soft, mild, gentle, pliant, supple in character',
    meaningSi: 'මෘදු වූ, මොළොක් ගති ඇති',
    root: '√mrad (soft, tender)',
    source: 'PTS p. 537'
  },
  'anatimānī': {
    pali: 'anatimānī',
    stem: 'an + ati + mānī',
    pos: 'adj. (neg. compound)',
    meaningEn: 'not proud, devoid of arrogance, humble, without conceit',
    meaningSi: 'අහංකාර නැති, නිහතමානී වූ',
    root: 'an- (not) + ati (over) + √man (to think/conceit)',
    source: 'PTS p. 30'
  },
  'santussaka': {
    pali: 'santussaka',
    stem: 'sam + tus',
    pos: 'adj.',
    meaningEn: 'easily contented, satisfied with whatever little one receives',
    meaningSi: 'සතුටු වන සුළු, ලද දෙයින් සතුටු වන',
    root: 'sam (completely) + √tus (to be glad/content)',
    source: 'PTS p. 677'
  },
  'subhara': {
    pali: 'subhara',
    stem: 'su + bhar',
    pos: 'adj.',
    meaningEn: 'easily supported, easy to maintain, frugal, placing little burden on others',
    meaningSi: 'පහසුවෙන් පෝෂණය කළ හැකි, අල්පේච්ඡ',
    root: 'su (well) + √bhar (to support, bear)',
    source: 'PTS p. 717'
  },
  'appakicca': {
    pali: 'appakicca',
    stem: 'appa + kicca',
    pos: 'adj.',
    meaningEn: 'having few duties, free from bustling social entanglement, unburdened by busywork',
    meaningSi: 'අඩු කටයුතු ඇති, කලබලකාරී නොවන',
    root: 'appa (few) + kicca (duties)',
    source: 'PTS p. 55'
  },
  'sallahukavutti': {
    pali: 'sallahukavutti',
    stem: 'sallahu + vutti',
    pos: 'adj. compound',
    meaningEn: 'living lightly, having a light livelihood, minimal material attachments',
    meaningSi: 'සැහැල්ලු පැවතුම් ඇති, බරක් නොවී ජීවත්වන',
    root: 'saṅkhyā-laghu (light) + vutti (livelihood)',
    source: 'PTS p. 700'
  },
  'santindriya': {
    pali: 'santindriya',
    stem: 'santa + indriya',
    pos: 'adj. compound',
    meaningEn: 'having senses calmed, with faculties guarded and tranquilized',
    meaningSi: 'සන්සුන් වූ ඉන්ද්‍රියයන් ඇති',
    root: 'santa (calmed) + indriya (sense faculties)',
    source: 'PTS p. 676'
  },
  'nipaka': {
    pali: 'nipaka',
    stem: 'ni + pak',
    pos: 'adj.',
    meaningEn: 'prudent, wise, intelligent, clear-sighted, circumspect',
    meaningSi: 'නුවණැති, විචක්ෂණශීලී',
    root: 'ni-pakka / √pac (mature, ripe)',
    source: 'PTS p. 357'
  },
  'appagabbha': {
    pali: 'appagabbha',
    stem: 'a + pagabbha',
    pos: 'adj. (neg.)',
    meaningEn: 'not impudent, modest, unobtrusive, respectful, without boldness or insolence',
    meaningSi: 'ප්‍රගල්භ නොවූ, නොහික්මුණු නොවන, සංවර',
    root: 'a- (not) + pagabbha (forward, insolent)',
    source: 'PTS p. 55'
  },
  'kula': {
    pali: 'kula',
    stem: 'kula',
    pos: 'neut. noun',
    meaningEn: 'family, clan, household; supporters',
    meaningSi: 'කුලය, පවුල, දායක පවුල්',
    root: 'kula (assemblage/family)',
    source: 'PTS p. 222'
  },
  'ananugiddha': {
    pali: 'ananugiddha',
    stem: 'an + anu + giddha',
    pos: 'adj. (neg. p.p.)',
    meaningEn: 'not attached, ungreedy, not covetous of households or supporters',
    meaningSi: 'ඇලී නොසිටින, ලොල් නොවූ',
    root: 'an- + anu- + √gidh (to covet)',
    source: 'PTS p. 29'
  },
  'metta': {
    pali: 'mettā',
    stem: 'mitta',
    pos: 'fem. noun / adj.',
    meaningEn: 'loving-kindness, benevolence, universal goodwill, boundless friendliness to all beings',
    meaningSi: 'මෛත්‍රිය, මෙත් සිත, හිතෛෂී බව',
    root: 'mitta (friend) / √mid (to be friendly/moist)',
    source: 'PTS p. 540'
  },
  'karuṇā': {
    pali: 'karuṇā',
    stem: 'karuṇā',
    pos: 'fem. noun',
    meaningEn: 'compassion, deep empathy wishing freedom from suffering for all living beings',
    meaningSi: 'කරුණාව, දුක්ඛිතයන් කෙරෙහි හදවත උණු වීම',
    root: '√kar (to do) or kṛṇoti (groans at pain of others)',
    source: 'PTS p. 196'
  },
  'muditā': {
    pali: 'muditā',
    stem: 'mud',
    pos: 'fem. noun',
    meaningEn: 'sympathetic joy, rejoicing in the happiness and spiritual prosperity of others',
    meaningSi: 'මුදිතාව, අනුන්ගේ සතුට දැක සතුටු වීම',
    root: '√mud (to rejoice, be glad)',
    source: 'PTS p. 537'
  },
  'upekkhā': {
    pali: 'upekkhā',
    stem: 'upa + ikkh',
    pos: 'fem. noun',
    meaningEn: 'equanimity, neutrality, unbiased observation, serene balance of mind',
    meaningSi: 'උපේක්ෂාව, මැදහත් සිත',
    root: 'upa (closely) + √ikkh (to look upon/observe)',
    source: 'PTS p. 150'
  },
  'aparimāṇa': {
    pali: 'aparimāṇa',
    stem: 'a + pari + māṇa',
    pos: 'adj.',
    meaningEn: 'boundless, measureless, immeasurable, infinite in extent',
    meaningSi: 'අප්‍රමාණ වූ, සීමාවක් නැති',
    root: 'a- + pari + √mā (to measure)',
    source: 'PTS p. 52'
  },
  'brahmavihāra': {
    pali: 'brahmavihāra',
    stem: 'brahma + vihāra',
    pos: 'masc. compound noun',
    meaningEn: 'sublime abidings, divine states of mind (mettā, karuṇā, muditā, upekkhā)',
    meaningSi: 'බ්‍රහ්මවිහාර, ශ්‍රේෂ්ඨ වාසය',
    root: 'brahma (noble/divine) + vihāra (dwelling)',
    source: 'PTS p. 493'
  },
  'diṭṭhi': {
    pali: 'diṭṭhi',
    stem: 'dis',
    pos: 'fem. noun',
    meaningEn: 'view, opinion, philosophical dogma, wrong belief when unpurified',
    meaningSi: 'දෘෂ්ටිය, වැරදි දැක්ම, මතවාදය',
    root: '√dis / √dṛś (to see)',
    source: 'PTS p. 321'
  },
  'sīla': {
    pali: 'sīla',
    stem: 'sīla',
    pos: 'neut. noun',
    meaningEn: 'virtue, moral discipline, ethical integrity, foundational purification',
    meaningSi: 'සීලය, විනය, සදාචාරය',
    root: '√sīl (to practice, habitual conduct)',
    source: 'PTS p. 712'
  },
  'dassana': {
    pali: 'dassana',
    stem: 'dis',
    pos: 'neut. noun',
    meaningEn: 'seeing, vision, insight; Stream-entry insight into the Four Noble Truths',
    meaningSi: 'දැක්ම, සෝතාපත්ති ඥානය',
    root: '√dis (to see)',
    source: 'PTS p. 317'
  },
  'sammā': {
    pali: 'sammā',
    stem: 'sam',
    pos: 'indecl. prefix / adv.',
    meaningEn: 'right, proper, true, wholesome, in accordance with reality (as in Noble Eightfold Path)',
    meaningSi: 'සම්මා, යහපත් වූ, නිවැරදි',
    root: 'samyak (properly, rightly)',
    source: 'PTS p. 695'
  },
  'nibbāna': {
    pali: 'nibbāna',
    stem: 'ni + vā',
    pos: 'neut. noun',
    meaningEn: 'extinguishment of greed, hatred, and delusion; the ultimate peace and cessation of dukkha',
    meaningSi: 'නිවන, සියලු කෙලෙසුන් නිවී සැනසීම',
    root: 'nir- (out) + √vā (to blow/extinguish)',
    source: 'PTS p. 362'
  },
  // --- Dhammapada & Canonical Terms ---
  'mano': {
    pali: 'mano',
    stem: 'manas',
    pos: 'masc. / neut. noun',
    meaningEn: 'mind, thought, intention, inner consciousness',
    meaningSi: 'සිත, මනස',
    root: '√man (to think)',
    source: 'PTS p. 520'
  },
  'dhamma': {
    pali: 'dhamma',
    stem: 'dhar',
    pos: 'masc. noun',
    meaningEn: 'truth, teaching, natural law, mental states, phenomena',
    meaningSi: 'ධර්මය, ස්වභාවය, මානසික තත්ත්ව, සත්‍යය',
    root: '√dhar (to bear, uphold)',
    source: 'PTS p. 335'
  },
  'citta': {
    pali: 'citta',
    stem: 'cit',
    pos: 'neut. noun',
    meaningEn: 'mind, consciousness, heart, state of thought',
    meaningSi: 'චිත්තය, සිත',
    root: '√cit (to think, perceive)',
    source: 'PTS p. 268'
  },
  'dukkha': {
    pali: 'dukkha',
    stem: 'du + kha',
    pos: 'adj. / neut. noun',
    meaningEn: 'suffering, dissatisfaction, stress, friction of existence',
    meaningSi: 'දුක, අසහනය, අනාරක්ෂිත බව',
    root: 'du- (bad) + kha (axle-hole/space)',
    source: 'PTS p. 324'
  },
  'anicca': {
    pali: 'anicca',
    stem: 'a + nicca',
    pos: 'adj.',
    meaningEn: 'impermanent, inconstant, unstable, transient',
    meaningSi: 'අනිත්‍ය වූ, වෙනස් වන සුළු',
    root: 'a- + nicca (constant)',
    source: 'PTS p. 34'
  },
  'anattā': {
    pali: 'anattā',
    stem: 'an + attan',
    pos: 'adj. / masc. noun',
    meaningEn: 'non-self, devoid of enduring personal substance or independent ego',
    meaningSi: 'අනාත්ම වූ, ස්ථිර ආත්මයක් නැති',
    root: 'an- + attan (self)',
    source: 'PTS p. 29'
  },
  'samādhi': {
    pali: 'samādhi',
    stem: 'sam + ā + dhā',
    pos: 'masc. noun',
    meaningEn: 'unification of mind, deep concentration, meditative stillness',
    meaningSi: 'සමාධිය, සිතේ එකඟකම',
    root: 'sam (together) + ā + √dhā (to place)',
    source: 'PTS p. 685'
  },
  'paññā': {
    pali: 'paññā',
    stem: 'pa + ñā',
    pos: 'fem. noun',
    meaningEn: 'wisdom, experiential discernment of things as they are',
    meaningSi: 'ප්‍රඥාව, විදර්ශනා නුවණ',
    root: 'pa- + √ñā (to know)',
    source: 'PTS p. 389'
  },
  'sati': {
    pali: 'sati',
    stem: 'sar',
    pos: 'fem. noun',
    meaningEn: 'mindfulness, lucid awareness, presence of mind',
    meaningSi: 'සිහිය, සතිය, සිහිකල්පනාව',
    root: '√sar / smṛ (to remember, bear in mind)',
    source: 'PTS p. 672'
  },
  'appamāda': {
    pali: 'appamāda',
    stem: 'a + pa + mad',
    pos: 'masc. noun',
    meaningEn: 'heedfulness, non-negligence, continuous spiritual vigilance',
    meaningSi: 'අප්‍රමාදය, නොපමාව කුසල්හි යෙදීම',
    root: 'a- + pra- + √mad (to be heedless)',
    source: 'PTS p. 57'
  }
};

/**
 * Clean and normalize a word for lookup
 */
export function normalizePaliWord(str) {
  if (!str) return '';
  // Strip punctuation, quotes, footnote numbers
  return str
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'“”‘’]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Remove diacritics for fuzzy fallback matching
 */
export function stripDiacritics(str) {
  return str
    .replace(/[āĀ]/g, 'a')
    .replace(/[īĪ]/g, 'i')
    .replace(/[ūŪ]/g, 'u')
    .replace(/[ṇṆ]/g, 'n')
    .replace(/[ñÑ]/g, 'n')
    .replace(/[ṅṄ]/g, 'n')
    .replace(/[ṁṀṃṂ]/g, 'm')
    .replace(/[ṭṬ]/g, 't')
    .replace(/[ḍḌ]/g, 'd')
    .replace(/[ḷḶ]/g, 'l');
}

/**
 * Lookup Pali word in canonical lexicon
 * Supports exact match, prefix match, and diacritic-insensitive fallback
 */
export function lookupPaliWord(rawWord) {
  const clean = normalizePaliWord(rawWord);
  if (!clean) return null;

  // 1. Direct exact match
  if (PALI_LEXICON[clean]) {
    return PALI_LEXICON[clean];
  }

  // 2. Direct match with keys
  const keys = Object.keys(PALI_LEXICON);
  for (const k of keys) {
    if (clean === k || clean.startsWith(k) || k.startsWith(clean)) {
      return PALI_LEXICON[k];
    }
  }

  // 3. Fallback without diacritics
  const strippedClean = stripDiacritics(clean);
  for (const k of keys) {
    if (stripDiacritics(k) === strippedClean) {
      return PALI_LEXICON[k];
    }
  }

  return {
    pali: clean,
    stem: clean,
    pos: 'Pali term',
    meaningEn: `Canonical term referenced in text.`,
    meaningSi: 'පාළි පෙළෙහි සඳහන් පදයකි.',
    root: 'Consult PTS Dictionary',
    source: 'SuttaCentral Bilara Segment'
  };
}

/**
 * Break a Pali sentence/segment into interactive tokens
 */
export function tokenizePaliText(text) {
  if (!text) return [];
  // Tokenize preserving spaces
  const parts = text.split(/(\s+|[.,;—!?])/);
  return parts.map((part, index) => {
    const isWord = /[a-zA-ZāīūṇñṅṁṃṭḍḷĀĪŪṆÑṄṀṂṬḌḶ]/.test(part);
    return {
      id: `tok-${index}`,
      raw: part,
      isWord,
      clean: isWord ? normalizePaliWord(part) : null
    };
  });
}
