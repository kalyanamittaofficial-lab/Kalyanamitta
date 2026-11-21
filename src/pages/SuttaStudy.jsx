import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Columns,
  AlignJustify,
  Plus,
  Minus,
  ChevronRight,
  Sparkles,
  Highlighter,
  Bookmark,
  BookMarked,
  BookOpen,
  FolderOpen,
  Lock,
  Languages,
  X,
  Play,
  Layers,
  List,
  Database,
  Network,
  SlidersHorizontal,
  Pencil,
  Tag,
  Trash2,
  Save,
  FileText,
  Check,
  Globe
} from 'lucide-react';
import PaginationBar from '../components/Lab/PaginationBar';
import {
  loadPopularSuttas,
  getTreeChildren,
  getBreadcrumbs,
  searchSuttas,
  getSuttaContent
} from '../services/tipitakaService';
import {
  getAnnotationsBySutta,
  getAnnotationSummary,
  saveRoadmapItem,
  deleteRoadmapItem,
  NOTE_CATEGORIES
} from '../services/studyRoadmapStore';
import { addAnnotationToKnowledgeMap } from '../services/knowledgeMapStore';
import {
  HIGHLIGHT_COLORS,
  getHighlightsBySutta,
  setSegmentHighlight
} from '../services/highlightStore';
import { tokenizePaliText, lookupPaliWord } from '../services/paliDictionaryService';
import {
  getSuttaProgress,
  getBookmarkedSuttas,
  saveReadingProgress
} from '../services/readingProgressStore';

export default function SuttaStudy() {
  const { suttaId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Catalog & Tree Browser State
  const [popularSuttas, setPopularSuttas] = useState([]);
  const [nikayas, setNikayas] = useState([]);
  const browseParentKey = searchParams.get('branch') || null;
  const [browseChildren, setBrowseChildren] = useState([]);
  const [browseBreadcrumbs, setBrowseBreadcrumbs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [libraryPage, setLibraryPage] = useState(1);
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const [featuredFilter, setFeaturedFilter] = useState('all'); // 'all' | 'beginners' | 'practice' | 'deep'

  // Active Sutta State
  const [loadedSutta, setLoadedSutta] = useState(null);
  const [suttaBreadcrumbs, setSuttaBreadcrumbs] = useState([]);
  const [errorState, setErrorState] = useState(null);

  const currentSutta = suttaId && loadedSutta?.key === suttaId ? loadedSutta : null;
  const errorMsg = suttaId && errorState?.key === suttaId ? errorState.message : null;
  const isLoadingSutta = Boolean(suttaId && !currentSutta && !errorMsg);

  // Reader Controls
  const [viewLayout, setViewLayout] = useState('parallel'); // 'parallel' | 'interlinear'
  const [showPali, setShowPali] = useState(true);
  const [showSinhala, setShowSinhala] = useState(true);
  const [onlyHighlighted, setOnlyHighlighted] = useState(false);
  const [lexiconEnabled, setLexiconEnabled] = useState(true);
  const [selectedWordInfo, setSelectedWordInfo] = useState(null);
  const [fontScale, setFontScale] = useState(1.05);

  // Bookmarks & Progress
  const [bookmarkedList, setBookmarkedList] = useState(() => getBookmarkedSuttas());
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Notes & Highlights
  const [suttaAnnotations, setSuttaAnnotations] = useState({});
  const [suttaHighlights, setSuttaHighlights] = useState({});
  const [showNoteDrawer, setShowNoteDrawer] = useState(true);
  const [drawerTab, setDrawerTab] = useState('editor'); // 'editor' | 'list'
  const [selectedSegmentId, setSelectedSegmentId] = useState(null);
  const [drawerFields, setDrawerFields] = useState({
    question: '',
    resource: '',
    reflection: '',
    comparison: '',
    further_inquiry: ''
  });
  const [drawerTitle, setDrawerTitle] = useState('');
  const [drawerYoutubeUrl, setDrawerYoutubeUrl] = useState('');
  const [drawerVisibility, setDrawerVisibility] = useState('private');
  const [drawerTags, setDrawerTags] = useState(['මෙත්තා', 'සියලු සත්වයෝ', 'සමාධිය']);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTagInput, setShowAddTagInput] = useState(false);
  const [drawerSavedMsg, setDrawerSavedMsg] = useState('');

  useEffect(() => {
    loadPopularSuttas().then(list => setPopularSuttas(list.slice(0, 12)));
    getTreeChildren('sp').then(list => setNikayas(list || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (suttaId || !browseParentKey) return;
    let cancelled = false;
    Promise.all([
      getTreeChildren(browseParentKey),
      getBreadcrumbs(browseParentKey)
    ]).then(([children, crumbs]) => {
      if (cancelled) return;
      setBrowseChildren(children);
      setBrowseBreadcrumbs(crumbs);
    });
    return () => { cancelled = true; };
  }, [browseParentKey, suttaId]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      searchSuttas(q, 36).then(res => {
        if (!cancelled) setSearchResults(res);
      });
    }, 140);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!suttaId) return;
    let cancelled = false;

    Promise.all([getSuttaContent(suttaId), getBreadcrumbs(suttaId).catch(() => [])])
      .then(([data, crumbs]) => {
        if (cancelled) return;
        setLoadedSutta(data);
        setSuttaBreadcrumbs(Array.isArray(crumbs) ? crumbs : []);
        setErrorState(null);
        setSuttaAnnotations(getAnnotationsBySutta(suttaId));
        setSuttaHighlights(getHighlightsBySutta(suttaId));
        const prog = getSuttaProgress(suttaId);
        setIsBookmarked(Boolean(prog?.isBookmarked));
        saveReadingProgress({
          suttaKey: suttaId,
          suttaTitlePali: data?.paliTitle || suttaId,
          suttaTitleSinhala: data?.sinhalaTitle || ''
        });
      })
      .catch(err => {
        if (cancelled) return;
        console.error(err);
        setErrorState({
          key: suttaId,
          message: 'සූත්‍ර දත්ත ලබාගැනීමට නොහැකි විය. කරුණාකර වෙනත් සූත්‍රයක් තෝරන්න.'
        });
      });

    return () => { cancelled = true; };
  }, [suttaId]);

  useEffect(() => {
    const handleNotes = () => {
      if (suttaId) setSuttaAnnotations(getAnnotationsBySutta(suttaId));
    };
    const handleHighlights = () => {
      if (suttaId) setSuttaHighlights(getHighlightsBySutta(suttaId));
    };
    const handleProgress = () => {
      setBookmarkedList(getBookmarkedSuttas());
      if (suttaId) {
        const prog = getSuttaProgress(suttaId);
        setIsBookmarked(Boolean(prog?.isBookmarked));
      }
    };
    window.addEventListener('studyRoadmapUpdated', handleNotes);
    window.addEventListener('labHighlightsUpdated', handleHighlights);
    window.addEventListener('labReadingProgressUpdated', handleProgress);
    return () => {
      window.removeEventListener('studyRoadmapUpdated', handleNotes);
      window.removeEventListener('labHighlightsUpdated', handleHighlights);
      window.removeEventListener('labReadingProgressUpdated', handleProgress);
    };
  }, [suttaId]);

  const handleToggleBookmark = () => {
    if (!suttaId) return;
    const next = !isBookmarked;
    setIsBookmarked(next);
    saveReadingProgress({
      suttaKey: suttaId,
      suttaTitlePali: currentSutta?.paliTitle || suttaId,
      suttaTitleSinhala: currentSutta?.sinhalaTitle || '',
      isBookmarked: next
    });
  };

  const handlePaliWordClick = (rawWord, segmentId) => {
    if (!lexiconEnabled) return;
    const info = lookupPaliWord(rawWord);
    if (info) {
      setSelectedWordInfo({ ...info, clickedWord: rawWord, segmentId });
    }
  };

  const DRAWER_NOTE_FIELDS = [
    { id: 'question', purpose: 'question', label: 'ප්‍රශ්නය', placeholder: 'මට ඇති වූ ප්‍රශ්නය මෙහි ලියන්න...', rows: 2 },
    { id: 'resource', purpose: 'resource', label: 'මූලාශ්‍රය', placeholder: 'භාවිත කළ මූලාශ්‍ර / අටුවා / පොත්...', rows: 2 },
    { id: 'reflection', purpose: 'study_note', label: 'අධ්‍යයන සටහන', placeholder: 'ඔබේ අධ්‍යයන සටහන හෝ අවබෝධය මෙහි ලියන්න...', rows: 3 },
    { id: 'comparison', purpose: 'cross_sutta', label: 'සංසන්දනය', placeholder: 'සම්බන්ධිත වෙනත් සූත්‍ර හෝ පාඨ සංසන්දනය (උදා: ම.නි. 21)...', rows: 2 },
    { id: 'further_inquiry', purpose: 'further_inquiry', label: 'වැඩිදුර විමසුම', placeholder: 'තවදුරටත් විමසිය යුතු හෝ සොයා බැලිය යුතු දේ...', rows: 2 }
  ];

  const hasDrawerNoteContent = Boolean(
    drawerTitle.trim() ||
    drawerYoutubeUrl.trim() ||
    Object.values(drawerFields).some(v => v.trim())
  );

  const selectSegmentForDrawer = (entry) => {
    if (!entry) return;
    setSelectedSegmentId(entry.segmentId);
    const existing = suttaAnnotations[entry.segmentId];
    const bodies = Array.isArray(existing?.body) ? existing.body : [];
    const summary = existing ? getAnnotationSummary(existing) : null;
    const ytBody = bodies.find(b => b.purpose === 'youtube');

    const findBodyText = (id, purpose) => {
      const match = bodies.find(b =>
        b.category === id ||
        b.purpose === purpose ||
        (id === 'reflection' && (b.purpose === 'study_note' || b.purpose === 'reflection'))
      );
      return match?.content || '';
    };

    setDrawerFields({
      question: findBodyText('question', 'question'),
      resource: findBodyText('resource', 'resource'),
      reflection: findBodyText('reflection', 'study_note'),
      comparison: findBodyText('comparison', 'cross_sutta'),
      further_inquiry: findBodyText('further_inquiry', 'further_inquiry')
    });
    setDrawerTitle(summary?.title || '');
    setDrawerYoutubeUrl(ytBody?.url || summary?.youtubeUrl || '');
    setDrawerVisibility(existing?.provenance?.visibility || 'private');
    setDrawerTags(
      Array.isArray(bodies[0]?.tags) && bodies[0].tags.length > 0
        ? bodies[0].tags
        : ['මෙත්තා', 'ධර්මය', 'අවබෝධය']
    );
    setDrawerTab('editor');
    setShowNoteDrawer(true);
  };

  const handleSaveDrawerNote = (targetEntry) => {
    if (!targetEntry || !hasDrawerNoteContent) return;
    const existing = suttaAnnotations[targetEntry.segmentId];
    const primaryOrder = ['reflection', 'question', 'comparison', 'further_inquiry', 'resource'];
    const primaryKey = primaryOrder.find(k => drawerFields[k]?.trim()) || 'reflection';
    const catCfg = NOTE_CATEGORIES[primaryKey] || NOTE_CATEGORIES.reflection;
    const firstNonEmptyText = primaryOrder.map(k => drawerFields[k]?.trim()).find(Boolean) || '';
    const resolvedTitle = drawerTitle.trim() || firstNonEmptyText.split('\n')[0].slice(0, 60) || currentSutta?.sinhalaTitle || 'Study Note';

    const bodies = [];
    // Put reflection first if present so getAnnotationSummary picks it as primary, then other filled fields
    const orderedFields = [
      DRAWER_NOTE_FIELDS.find(f => f.id === 'reflection'),
      ...DRAWER_NOTE_FIELDS.filter(f => f.id !== 'reflection')
    ];
    orderedFields.forEach(field => {
      const text = drawerFields[field.id]?.trim();
      if (!text) return;
      bodies.push({
        type: 'TextualBody',
        purpose: field.purpose,
        category: field.id,
        title: bodies.length === 0 ? resolvedTitle : field.label,
        content: text,
        ...(bodies.length === 0 ? { tags: drawerTags } : {})
      });
    });

    if (drawerYoutubeUrl.trim()) {
      bodies.push({
        type: 'TextualBody',
        purpose: 'youtube',
        category: 'resource',
        title: 'YouTube පැහැදිලි කිරීම',
        url: drawerYoutubeUrl.trim(),
        content: '',
        ...(bodies.length === 0 ? { tags: drawerTags } : {})
      });
    }

    if (bodies.length === 0 && drawerTitle.trim()) {
      bodies.push({
        type: 'TextualBody',
        purpose: 'study_note',
        category: 'reflection',
        title: resolvedTitle,
        content: '',
        tags: drawerTags
      });
    }

    saveRoadmapItem({
      id: existing?.id,
      created: existing?.created,
      action: catCfg.actionTag || 'Study Note',
      target: {
        source: suttaId,
        suttaTitlePali: currentSutta?.paliTitle || suttaId,
        suttaTitleSinhala: currentSutta?.sinhalaTitle || '',
        canonicalRef: `${currentSutta?.sinhalaTitle || suttaId} · p.${targetEntry.pageNum || 1}`,
        selector: { type: 'FragmentSelector', value: targetEntry.segmentId },
        canonicalQuote: targetEntry.pali || '',
        translationQuote: targetEntry.sinh || ''
      },
      body: bodies,
      provenance: {
        layer: 3,
        visibility: drawerVisibility,
        reviewStatus: drawerVisibility === 'submit_review' ? 'pending_review' : 'unreviewed'
      }
    });
    setDrawerSavedMsg('සුරකින ලදී');
    setTimeout(() => setDrawerSavedMsg(''), 2200);
  };

  const handleDeleteDrawerNote = (targetEntry) => {
    const existing = targetEntry ? suttaAnnotations[targetEntry.segmentId] : null;
    if (!existing) return;
    deleteRoadmapItem(existing.id);
    setDrawerFields({
      question: '',
      resource: '',
      reflection: '',
      comparison: '',
      further_inquiry: ''
    });
    setDrawerTitle('');
    setDrawerYoutubeUrl('');
    setDrawerSavedMsg('ඉවත් කරන ලදී');
    setTimeout(() => setDrawerSavedMsg(''), 2000);
  };

  const handleToggleHighlight = (entry, color) => {
    setSegmentHighlight({
      suttaKey: suttaId,
      suttaTitle: currentSutta?.sinhalaTitle || currentSutta?.paliTitle || suttaId,
      segmentId: entry.segmentId,
      pali: entry.pali,
      sinh: entry.sinh,
      color
    });
  };

  const isSearching = searchQuery.trim().length > 0;
  const LIB_PER_PAGE = 9;
  const activeSearchOrBranchList = isSearching ? searchResults : browseChildren;
  const libTotalPages = Math.max(1, Math.ceil(activeSearchOrBranchList.length / LIB_PER_PAGE));
  const safeLibPage = Math.min(libraryPage, libTotalPages);
  const pagedLibItems = activeSearchOrBranchList.slice((safeLibPage - 1) * LIB_PER_PAGE, safeLibPage * LIB_PER_PAGE);

  const renderSearchBanner = () => (
    <div
      style={{
        borderRadius: '22px',
        padding: '20px 24px',
        background: 'linear-gradient(125deg, #101216 0%, #171B24 58%, #202736 100%)',
        color: '#F8FAFC',
        boxShadow: '0 12px 30px rgba(15, 17, 21, 0.16)',
        display: 'grid',
        gridTemplateColumns: 'minmax(240px, 1.05fr) minmax(260px, 1.15fr)',
        gap: '18px',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Diagonal Cobalt & Lime Geometric Accent */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: '24%',
        top: '-24px',
        width: '130px',
        height: '220px',
        background: 'var(--po-blue, #0B3BFA)',
        transform: 'skewX(-28deg)',
        pointerEvents: 'none'
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: '-60px',
        top: '-30px',
        width: '280px',
        height: '220px',
        background: '#F4F6FA',
        opacity: 0.94,
        transform: 'skewX(-28deg)',
        pointerEvents: 'none'
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: '-30px',
        bottom: '-24px',
        width: '130px',
        height: '70px',
        borderTop: '4px solid #c6ff24',
        borderLeft: '4px solid #c6ff24',
        transform: 'rotate(-28deg)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 'clamp(1.45rem, 2.2vw, 1.9rem)', fontWeight: '900', margin: '0 0 6px 0', fontFamily: 'var(--font-sinhala)', letterSpacing: '-0.02em' }}>
          සූත්‍ර <span style={{ color: '#c6ff24' }}>පුස්තකාලය</span>
        </h1>
        <div style={{ fontSize: '0.8rem', color: 'rgba(248, 250, 252, 0.84)', fontFamily: 'var(--font-sinhala)', lineHeight: 1.45, maxWidth: '380px' }}>
          පාලි හා සිංහල සූත්‍ර, විවරණ සහ අධ්‍යයන සටහන් සඳහා ඔබේ නිවැරදි මාර්ගෝපදේශක සංග්‍රහය.
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#5B6474'
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setLibraryPage(1);
          }}
          placeholder="සූත්‍ර නාමය හෝ සංකේතය සොයන්න (උදා: සතිපට්ඨාන, Metta)..."
          style={{
            width: '100%',
            padding: '12px 38px 12px 44px',
            borderRadius: '999px',
            border: '1px solid rgba(15, 17, 21, 0.08)',
            background: '#FFFFFF',
            color: '#0F1115',
            fontSize: '0.84rem',
            fontFamily: 'var(--font-sinhala)',
            boxShadow: '0 8px 20px rgba(15, 17, 21, 0.12)',
            outline: 'none'
          }}
        />
        {isSearching && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setLibraryPage(1);
            }}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              color: '#5B6474',
              cursor: 'pointer',
              padding: '2px'
            }}
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );

  const renderSearchResultsPanel = () => (
    <div className="km-lab-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <h2 style={{ fontSize: '0.98rem', fontWeight: '700', fontFamily: 'var(--font-sinhala)', color: 'var(--lab-text)', margin: 0 }}>
          සෙවුම් ප්‍රතිඵල ({searchResults.length})
        </h2>
      </div>

      {searchResults.length === 0 ? (
        <div style={{ padding: '28px', textAlign: 'center', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)', background: 'var(--lab-bg-subtle)', borderRadius: '10px' }}>
          ගැළපෙන සූත්‍ර හමු නොවීය.
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {pagedLibItems.map(item => (
              <div
                key={item.key}
                className="km-lab-card km-lab-card-interactive"
                onClick={() => {
                  setSearchQuery('');
                  setLibraryPage(1);
                  navigate(`/lab/sutta/${item.key}`);
                }}
                style={{
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  background: 'var(--lab-bg-subtle)',
                  borderLeft: '3px solid #5F6E43'
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: '700', color: 'var(--lab-text)', fontSize: '0.9rem', marginBottom: '2px' }}>
                    {item.sinhalaName}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>
                    {item.paliName}
                  </div>
                </div>
                <ChevronRight size={15} color="var(--lab-text-muted)" style={{ flexShrink: 0 }} />
              </div>
            ))}
          </div>
          <PaginationBar page={safeLibPage} totalPages={libTotalPages} onPageChange={setLibraryPage} compact />
        </>
      )}
    </div>
  );

  const renderBreadcrumbsBar = (crumbs, isSuttaLeaf = false) => {
    if (!crumbs || crumbs.length === 0) return null;
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap',
        fontSize: '0.82rem',
        fontFamily: 'var(--font-sinhala)',
        color: 'var(--lab-text-muted)'
      }}>
        <button
          type="button"
          onClick={() => {
            setLibraryPage(1);
            navigate('/lab/sutta');
          }}
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--lab-gold)', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
        >
          පුස්තකාලය
        </button>
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          const isClickable = c.key !== 'sp' && !(isLast && isSuttaLeaf);
          return (
            <span key={c.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ChevronRight size={13} />
              <button
                type="button"
                onClick={() => {
                  if (isClickable) {
                    setLibraryPage(1);
                    navigate(`/lab/sutta?branch=${encodeURIComponent(c.key)}`);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: isLast ? 'var(--lab-text)' : 'var(--lab-text-muted)',
                  fontWeight: isLast ? '700' : '500',
                  cursor: isClickable ? 'pointer' : 'default',
                  fontFamily: 'var(--font-sinhala)',
                  fontSize: '0.82rem'
                }}
              >
                {c.sinhalaName}
              </button>
            </span>
          );
        })}
      </div>
    );
  };

  // ============================================================================
  // VIEW 1: SUTTA CATALOG & TREE BROWSER
  // ============================================================================
  if (!suttaId) {
    const BM_PER_PAGE = 4;
    const bmTotalPages = Math.max(1, Math.ceil(bookmarkedList.length / BM_PER_PAGE));
    const safeBmPage = Math.min(bookmarkPage, bmTotalPages);
    const pagedBookmarks = bookmarkedList.slice((safeBmPage - 1) * BM_PER_PAGE, safeBmPage * BM_PER_PAGE);

    return (
      <div className="km-lab-page" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {renderSearchBanner()}

        {isSearching ? (
          renderSearchResultsPanel()
        ) : browseParentKey ? (
          <div className="km-lab-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {browseBreadcrumbs.length > 0 && (
              <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--lab-border)' }}>
                {renderBreadcrumbsBar(browseBreadcrumbs, false)}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              {pagedLibItems.map(child => (
                <div
                  key={child.key}
                  onClick={() => {
                    setLibraryPage(1);
                    if (child.hasChildren) navigate(`/lab/sutta?branch=${encodeURIComponent(child.key)}`);
                    else navigate(`/lab/sutta/${child.key}`);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'var(--lab-bg-subtle)',
                    border: '1px solid var(--lab-border)',
                    borderLeft: `3px solid ${child.hasChildren ? '#C06C47' : '#5F6E43'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    {child.hasChildren
                      ? <FolderOpen size={16} color="#C06C47" style={{ flexShrink: 0 }} />
                      : <BookOpen size={16} color="#5F6E43" style={{ flexShrink: 0 }} />}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: '600', fontSize: '0.88rem', color: 'var(--lab-text)' }}>
                        {child.sinhalaName}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>
                        {child.paliName}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={15} color="var(--lab-text-muted)" style={{ flexShrink: 0 }} />
                </div>
              ))}
            </div>
            <PaginationBar page={safeLibPage} totalPages={libTotalPages} onPageChange={setLibraryPage} compact />
          </div>
        ) : (
          <>
            {/* 5 Nikāya Quick-Browse Strip */}
            {nikayas.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '10px' }}>
                {nikayas.map((nik, idx) => {
                  const icons = [Layers, BookOpen, Network, List, Database];
                  const NikIcon = icons[idx % icons.length];
                  const isFirst = idx === 0;
                  return (
                    <button
                      key={nik.key}
                      type="button"
                      onClick={() => {
                        setLibraryPage(1);
                        navigate(`/lab/sutta?branch=${encodeURIComponent(nik.key)}`);
                      }}
                      className="km-po-card km-lab-card-interactive"
                      style={{
                        borderRadius: '16px',
                        padding: '11px 13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        border: isFirst ? '1.5px solid #c6ff24' : '1px solid var(--po-card-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        fontFamily: 'var(--font-sinhala)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: isFirst ? 'rgba(198, 255, 36, 0.25)' : 'var(--po-card-subtle)',
                          color: isFirst ? '#4D6114' : 'var(--lab-text)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0
                        }}>
                          <NikIcon size={15} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--lab-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {nik.sinhalaName}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {nik.paliName}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} color="var(--lab-text-muted)" style={{ flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2-Column Library Bottom Grid: Featured & Suggested Suttas + Bookmarks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(270px, 1fr)', gap: '14px', alignItems: 'stretch' }}>
              {/* Featured & Suggested Suttas */}
              <div className="km-po-card" style={{ borderRadius: '22px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={17} color="var(--po-blue, #0B3BFA)" />
                    <div>
                      <h2 style={{ fontSize: '0.96rem', fontWeight: '800', fontFamily: 'var(--font-sinhala)', color: 'var(--lab-text)', margin: 0 }}>
                        විශේෂිත / නිර්දේශිත සූත්‍ර
                      </h2>
                      <div style={{ fontSize: '0.68rem', color: 'var(--lab-text-muted)' }}>Featured & Suggested Suttas</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'beginners', label: 'Beginners' },
                      { id: 'practice', label: 'Practice' },
                      { id: 'deep', label: 'Deep Study' }
                    ].map(f => {
                      const active = featuredFilter === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFeaturedFilter(f.id)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            border: `1px solid ${active ? 'transparent' : 'var(--po-card-border)'}`,
                            background: active ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-subtle)',
                            color: active ? '#FFFFFF' : 'var(--lab-text)',
                            fontSize: '0.68rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                    <span style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid var(--po-card-border)', display: 'grid', placeItems: 'center', color: 'var(--lab-text-muted)' }}>
                      <SlidersHorizontal size={12} />
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {(featuredFilter === 'all' ? popularSuttas : popularSuttas.slice(featuredFilter === 'beginners' ? 0 : featuredFilter === 'practice' ? 3 : 6))
                    .slice(0, 6)
                    .map((sutta, idx) => {
                      const prog = getSuttaProgress(sutta.key);
                      const pct = prog?.percentComplete || 0;
                      const isWarm = idx === 0 || idx === 3 || idx === 5;
                      return (
                        <div
                          key={sutta.key}
                          className="km-lab-card-interactive"
                          onClick={() => navigate(`/lab/sutta/${sutta.key}`)}
                          style={{
                            padding: '11px 13px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            background: isWarm ? 'rgba(198, 255, 36, 0.14)' : 'var(--po-card-subtle)',
                            border: '1px solid var(--po-card-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: '800', fontSize: '0.9rem', color: 'var(--lab-text)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {sutta.sinhalaName}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {sutta.paliName}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                              <span style={{ color: 'var(--lab-text-muted)', padding: '3px' }}>
                                <Bookmark size={13} />
                              </span>
                              <span style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: 'var(--po-card-bg)',
                                border: '1px solid var(--po-card-border)',
                                display: 'grid',
                                placeItems: 'center',
                                color: 'var(--lab-text)'
                              }}>
                                <Play size={10} fill="currentColor" />
                              </span>
                            </div>
                          </div>

                          {pct > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ flex: 1, height: '5px', borderRadius: '999px', background: 'var(--po-track)', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', borderRadius: '999px', background: '#c6ff24' }} />
                              </div>
                              <span style={{ fontSize: '0.66rem', fontWeight: '700', color: 'var(--lab-text-muted)' }}>{pct}%</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Bookmarked Suttas */}
              <div className="km-po-card" style={{ borderRadius: '22px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookMarked size={17} color="var(--po-blue, #0B3BFA)" />
                    <div>
                      <h2 style={{ fontSize: '0.96rem', fontWeight: '800', fontFamily: 'var(--font-sinhala)', color: 'var(--lab-text)', margin: 0 }}>
                        සුරැකි සූත්‍ර ({bookmarkedList.length})
                      </h2>
                      <div style={{ fontSize: '0.68rem', color: 'var(--lab-text-muted)' }}>Bookmarks</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => popularSuttas[0] && navigate(`/lab/sutta/${popularSuttas[0].key}`)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: '1px solid var(--po-card-border)',
                      background: 'var(--po-card-subtle)',
                      color: 'var(--lab-text)',
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Browse →
                  </button>
                </div>

                {bookmarkedList.length === 0 ? (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '20px 14px',
                    borderRadius: '16px',
                    background: 'var(--po-card-subtle)',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '16px',
                      background: 'var(--po-card-bg)',
                      border: '1px solid var(--po-card-border)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--lab-text)',
                      transform: 'rotate(-6deg)'
                    }}>
                      <Bookmark size={22} />
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)' }}>
                      තවම සුරැකි සූත්‍ර නැත.
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)', lineHeight: 1.45, maxWidth: '230px' }}>
                      ඔබ කියවන සූත්‍රයක &lsquo;Bookmark&rsquo; සලකුණ ක්ලික් කර පසුබැසීමකින් ඉක්මනින් ප්‍රවේශ වන්න.
                    </div>
                    <button
                      type="button"
                      onClick={() => popularSuttas[0] && navigate(`/lab/sutta/${popularSuttas[0].key}`)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '999px',
                        border: 'none',
                        background: '#c6ff24',
                        color: '#101214',
                        fontSize: '0.74rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        marginTop: '4px'
                      }}
                    >
                      <Bookmark size={13} />
                      <span>Start Bookmarking →</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {pagedBookmarks.map(bm => (
                        <div
                          key={bm.suttaKey}
                          className="km-po-card km-lab-card-interactive"
                          onClick={() => navigate(`/lab/sutta/${bm.suttaKey}`)}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '14px',
                            cursor: 'pointer',
                            background: 'var(--po-card-subtle)',
                            borderLeft: '3px solid #c6ff24',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px'
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: '700', color: 'var(--lab-text)', fontSize: '0.86rem' }}>
                              {bm.suttaTitleSinhala || bm.suttaKey}
                            </div>
                            <div style={{ fontSize: '0.73rem', color: 'var(--lab-text-muted)' }}>
                              {bm.suttaTitlePali}
                            </div>
                          </div>
                          <ChevronRight size={14} color="var(--lab-text-muted)" style={{ flexShrink: 0 }} />
                        </div>
                      ))}
                    </div>
                    <PaginationBar page={safeBmPage} totalPages={bmTotalPages} onPageChange={setBookmarkPage} compact />
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: APPLE/GOOGLE-GRADE PALI & SINHALA READER WITH 1-CLICK HIGHLIGHTS
  // ============================================================================
  const pillStyle = (active) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    borderRadius: '999px',
    border: `1px solid ${active ? 'var(--lab-accent)' : 'var(--lab-border)'}`,
    background: active ? 'var(--lab-accent-soft)' : 'var(--lab-bg-elevated)',
    color: active ? 'var(--lab-accent)' : 'var(--lab-text-muted)',
    fontSize: '0.88rem',
    fontWeight: '600',
    fontFamily: 'var(--font-sinhala)',
    cursor: 'pointer'
  });

  const allEntries = currentSutta?.entries || [];
  const entries = onlyHighlighted
    ? allEntries.filter(e => Boolean(suttaHighlights[e.segmentId]))
    : allEntries;
  const highlightCount = Object.keys(suttaHighlights).length;
  const suttaNotesList = Object.values(suttaAnnotations);
  const activeDrawerEntry = entries.find(e => e.segmentId === selectedSegmentId)
    || entries.find(e => e.type !== 'heading' && e.type !== 'centered')
    || entries[0]
    || null;
  const showTwoCols = viewLayout === 'parallel' && showPali && showSinhala;

  return (
    <div style={{ paddingBottom: '48px' }}>
      {/* Breadcrumbs Header */}
      {suttaBreadcrumbs.length > 0 && (
        <div className="km-lab-page" style={{ paddingBottom: '6px' }}>
          {renderBreadcrumbsBar(suttaBreadcrumbs, true)}
        </div>
      )}

      {/* Frosted Sticky Toolbar */}
      <div style={{
        position: 'sticky',
        top: '56px',
        zIndex: 25,
        background: 'var(--lab-bg-glass)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--lab-border)',
        padding: '9px clamp(14px, 2.5vw, 24px)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: '800', fontSize: '1.08rem', color: 'var(--lab-text)' }}>
                {currentSutta?.sinhalaTitle || suttaId}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)' }}>
                {currentSutta?.paliTitle || ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setViewLayout(viewLayout === 'parallel' ? 'interlinear' : 'parallel')}
              style={{
                ...pillStyle(true),
                background: 'var(--po-blue, #0B3BFA)',
                borderColor: 'var(--po-blue, #0B3BFA)',
                color: '#FFFFFF'
              }}
            >
              {viewLayout === 'parallel' ? <Columns size={13} /> : <AlignJustify size={13} />}
              <span>{viewLayout === 'parallel' ? 'කියවන්න' : 'පේළි අතර'}</span>
            </button>

            <button onClick={() => setShowPali(v => !v)} style={pillStyle(showPali)}>
              පාලි
            </button>
            <button onClick={() => setShowSinhala(v => !v)} style={pillStyle(showSinhala)}>
              සිංහල
            </button>

            <button
              onClick={() => setShowNoteDrawer(v => !v)}
              style={pillStyle(showNoteDrawer)}
              title="Toggle note-taking drawer"
            >
              <Pencil size={12} />
              <span>සටහන් ({suttaNotesList.length})</span>
            </button>

            <button
              onClick={() => setOnlyHighlighted(v => !v)}
              style={pillStyle(onlyHighlighted)}
              title="සලකුණු කළ කොටස් පමණක් පෙන්වන්න"
            >
              <Highlighter size={13} />
              <span>සලකුණු ({highlightCount})</span>
            </button>

            <button
              onClick={() => {
                setLexiconEnabled(v => !v);
                if (lexiconEnabled) setSelectedWordInfo(null);
              }}
              style={pillStyle(lexiconEnabled)}
              title="පාලි පද විග්‍රහය"
            >
              <Languages size={13} />
              <span>පද විග්‍රහය</span>
            </button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid var(--lab-border)',
              background: 'var(--lab-bg-elevated)',
              borderRadius: '999px',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setFontScale(s => Math.max(0.85, +(s - 0.1).toFixed(2)))}
                style={{ padding: '6px 9px', border: 'none', background: 'transparent', color: 'var(--lab-text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                aria-label="Decrease font size"
              >
                <Minus size={12} />
              </button>
              <span style={{ fontSize: '0.72rem', color: 'var(--lab-text)', padding: '0 4px', fontWeight: '700' }}>
                {Math.round(fontScale * 100)}%
              </span>
              <button
                onClick={() => setFontScale(s => Math.min(1.45, +(s + 0.1).toFixed(2)))}
                style={{ padding: '6px 9px', border: 'none', background: 'transparent', color: 'var(--lab-text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                aria-label="Increase font size"
              >
                <Plus size={12} />
              </button>
            </div>

            <Link
              to="/lab/roadmap"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '999px',
                border: '1px solid var(--lab-border)',
                background: 'var(--lab-bg-elevated)',
                color: 'var(--lab-text-muted)',
                textDecoration: 'none',
                fontSize: '0.76rem',
                fontWeight: '600',
                fontFamily: 'var(--font-sinhala)'
              }}
            >
              <FileText size={12} />
              <span>My Notes</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Reader + Note Drawer */}
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '16px clamp(14px, 2.5vw, 24px)',
        display: 'grid',
        gridTemplateColumns: showNoteDrawer ? 'minmax(0, 1fr) 340px' : 'minmax(0, 1fr)',
        gap: '14px',
        alignItems: 'start'
      }}>
        {/* LEFT READER COLUMN */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isLoadingSutta ? (
            <div className="km-po-card" style={{ borderRadius: '20px', textAlign: 'center', padding: '60px 20px', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
              සූත්‍ර පෙළ පූරණය වෙමින් පවතී...
            </div>
          ) : errorMsg ? (
            <div className="km-po-card" style={{ borderRadius: '20px', padding: '24px', textAlign: 'center', color: 'var(--lab-accent)', fontFamily: 'var(--font-sinhala)' }}>
              {errorMsg}
            </div>
          ) : (
            <>
              {/* Sutta Title Card */}
              <div className="km-po-card" style={{ borderRadius: '20px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ minWidth: 0, flex: '1 1 280px' }}>
                  {currentSutta?.breadcrumbs?.length > 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      flexWrap: 'wrap',
                      fontSize: '0.73rem',
                      color: 'var(--lab-text-muted)',
                      fontFamily: 'var(--font-sinhala)',
                      marginBottom: '5px'
                    }}>
                      {currentSutta.breadcrumbs.map((b, idx) => (
                        <span key={b.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          {idx > 0 && <ChevronRight size={11} />}
                          <span>{b.sinhalaName}</span>
                        </span>
                      ))}
                    </div>
                  )}
                  <h1 style={{
                    fontFamily: 'var(--font-sinhala)',
                    fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)',
                    fontWeight: '800',
                    color: 'var(--lab-text)',
                    margin: '0 0 2px 0'
                  }}>
                    {currentSutta?.sinhalaTitle}
                  </h1>
                  <div style={{ fontSize: '0.86rem', color: 'var(--lab-text-muted)', marginBottom: '6px' }}>
                    {currentSutta?.paliTitle}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
                    මූලාශ්‍රය: බුද්ධ ජයන්ති ත්‍රිපිටකය (පාලි සහ සිංහල)
                  </div>
                </div>

                {/* Right Metadata & Quick Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', padding: '4px 10px', borderRight: '1px solid var(--po-card-border)' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--lab-text-muted)' }}>පිටු / කොටස්</div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--lab-text)' }}>{entries.length}</strong>
                  </div>
                  <div style={{ textAlign: 'center', padding: '4px 10px', borderRight: '1px solid var(--po-card-border)' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--lab-text-muted)' }}>සටහන්</div>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--lab-text)' }}>{suttaNotesList.length}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleBookmark}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 11px',
                      borderRadius: '12px',
                      border: `1px solid ${isBookmarked ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-border)'}`,
                      background: isBookmarked ? 'var(--po-blue-soft)' : 'var(--po-card-subtle)',
                      color: isBookmarked ? 'var(--po-blue, #0B3BFA)' : 'var(--lab-text)',
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {isBookmarked ? <BookMarked size={13} /> : <Bookmark size={13} />}
                    <span>{isBookmarked ? 'සුරැකි' : 'බුක්මාර්ක්'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeDrawerEntry) selectSegmentForDrawer(activeDrawerEntry);
                      else setShowNoteDrawer(true);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#c6ff24',
                      color: '#101214',
                      fontSize: '0.76rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    <Play size={11} fill="currentColor" />
                    <span>සටහන් ලියන්න</span>
                  </button>
                </div>
              </div>

              {/* Parallel Reader Card */}
              {entries.length === 0 ? (
                <div className="km-po-card" style={{ borderRadius: '20px', padding: '36px', textAlign: 'center', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
                  {onlyHighlighted ? 'මෙම සූත්‍රයේ Highlight කළ කොටස් තවම නොමැත.' : 'පෙළ හමු නොවීය.'}
                </div>
              ) : (
                <div className="km-po-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                  {showTwoCols && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '20px',
                      padding: '12px 22px',
                      borderBottom: '1px solid var(--po-card-border)',
                      background: 'var(--po-card-subtle)',
                      fontSize: '0.76rem',
                      fontWeight: '800',
                      color: 'var(--lab-text-muted)',
                      fontFamily: 'var(--font-sinhala)'
                    }}>
                      <div>පාලි මුල් පෙළ · Pāli (Source)</div>
                      <div>සිංහල පරිවර්තනය (අර්ථවත්‍යය)</div>
                    </div>
                  )}

                  {entries.map((entry, idx) => {
                    const isHeading = entry.type === 'heading' || entry.type === 'centered';
                    const isGatha = entry.type === 'gatha';
                    const personalNote = suttaAnnotations[entry.segmentId];
                    const highlight = suttaHighlights[entry.segmentId];
                    const hlColorObj = highlight ? HIGHLIGHT_COLORS[highlight.color] : null;
                    const isLast = idx === entries.length - 1;
                    const isSelectedSeg = activeDrawerEntry?.segmentId === entry.segmentId;

                    return (
                      <div
                        key={entry.id}
                        id={entry.segmentId}
                        onClick={() => !isHeading && selectSegmentForDrawer(entry)}
                        className="km-lab-entry-row"
                        style={{
                          position: 'relative',
                          padding: isHeading ? '14px 22px' : '15px 22px',
                          borderBottom: isLast ? 'none' : '1px solid var(--po-card-border)',
                          background: hlColorObj
                            ? hlColorObj.bgVar
                            : isSelectedSeg && !isHeading
                              ? 'rgba(11, 59, 250, 0.03)'
                              : isHeading
                                ? 'var(--po-card-subtle)'
                                : 'transparent',
                          borderLeft: hlColorObj
                            ? `4px solid ${hlColorObj.dot}`
                            : isSelectedSeg && !isHeading
                              ? '4px solid var(--po-blue, #0B3BFA)'
                              : '4px solid transparent',
                          outline: isSelectedSeg && !isHeading ? '1.5px solid rgba(11, 59, 250, 0.35)' : 'none',
                          outlineOffset: '-2px',
                          cursor: isHeading ? 'default' : 'pointer'
                        }}
                      >
                        {!isHeading && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                            gap: '10px',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
                              p.{entry.pageNum}
                            </span>

                            {/* Floating / Inline Segment Action Pill */}
                            <div
                              className="km-lab-entry-actions"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: isSelectedSeg ? '4px 10px' : '3px 7px',
                                borderRadius: '999px',
                                background: isSelectedSeg ? '#101216' : 'var(--po-card-subtle)',
                                color: isSelectedSeg ? '#FFFFFF' : 'var(--lab-text)',
                                border: '1px solid var(--po-card-border)'
                              }}
                            >
                              {Object.values(HIGHLIGHT_COLORS).map(c => {
                                const selected = highlight?.color === c.id;
                                return (
                                  <button
                                    key={c.id}
                                    onClick={() => handleToggleHighlight(entry, c.id)}
                                    title={selected ? `Remove ${c.label} highlight` : `Highlight ${c.label}`}
                                    style={{
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%',
                                      border: selected ? '2px solid #FFFFFF' : '1px solid transparent',
                                      background: c.dot,
                                      cursor: 'pointer',
                                      padding: 0
                                    }}
                                  />
                                );
                              })}

                              <span style={{ width: '1px', height: '12px', background: isSelectedSeg ? 'rgba(255,255,255,0.2)' : 'var(--po-card-border)' }} />

                              <button
                                onClick={() => selectSegmentForDrawer(entry)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  border: 'none',
                                  background: 'transparent',
                                  color: isSelectedSeg ? '#c6ff24' : 'var(--po-blue, #0B3BFA)',
                                  fontSize: '0.72rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  padding: '0 4px'
                                }}
                              >
                                <Pencil size={11} />
                                <span>{personalNote ? 'සටහන' : 'සටහනක්'}</span>
                              </button>
                            </div>
                          </div>
                        )}

                        <div style={{
                          display: showTwoCols ? 'grid' : 'flex',
                          gridTemplateColumns: showTwoCols ? 'repeat(auto-fit, minmax(260px, 1fr))' : undefined,
                          flexDirection: showTwoCols ? undefined : 'column',
                          gap: showTwoCols ? '22px' : '8px',
                          alignItems: 'start'
                        }}>
                          {showPali && entry.pali && (
                            <div style={{
                              fontFamily: 'var(--font-sinhala)',
                              fontSize: `${(isHeading ? 1.08 : 1.0) * fontScale}rem`,
                              fontWeight: isHeading ? '700' : '400',
                              fontStyle: isGatha ? 'italic' : 'normal',
                              lineHeight: 1.8,
                              color: isHeading ? 'var(--po-blue, #0B3BFA)' : 'var(--lab-text)',
                              whiteSpace: 'pre-line'
                            }}>
                              {lexiconEnabled && !isHeading ? (
                                tokenizePaliText(entry.pali).map(tok =>
                                  tok.isWord ? (
                                    <span
                                      key={tok.id}
                                      role="button"
                                      tabIndex={0}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePaliWordClick(tok.raw, entry.segmentId);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          e.preventDefault();
                                          handlePaliWordClick(tok.raw, entry.segmentId);
                                        }
                                      }}
                                      style={{
                                        cursor: 'pointer',
                                        borderBottom: '1px dotted rgba(11, 59, 250, 0.35)',
                                        borderRadius: '3px',
                                        padding: '0 1px'
                                      }}
                                      title="Click for Pali lexicon lookup"
                                    >
                                      {tok.raw}
                                    </span>
                                  ) : (
                                    <span key={tok.id}>{tok.raw}</span>
                                  )
                                )
                              ) : entry.pali}
                            </div>
                          )}

                          {showSinhala && entry.sinh && (
                            <div style={{
                              fontFamily: 'var(--font-sinhala)',
                              fontSize: `${(isHeading ? 1.08 : 1.0) * fontScale}rem`,
                              fontWeight: isHeading ? '700' : '400',
                              lineHeight: 1.85,
                              color: isHeading ? 'var(--po-blue, #0B3BFA)' : 'var(--lab-text)',
                              whiteSpace: 'pre-line'
                            }}>
                              {entry.sinh}
                            </div>
                          )}
                        </div>

                        {personalNote && (() => {
                          const summary = getAnnotationSummary(personalNote);
                          const catCfg = NOTE_CATEGORIES[summary?.category] || NOTE_CATEGORIES.reflection;
                          return (
                            <div style={{
                              marginTop: '10px',
                              padding: '10px 14px',
                              borderRadius: '12px',
                              background: 'var(--po-card-subtle)',
                              border: '1px solid var(--po-card-border)',
                              borderLeft: `3px solid ${catCfg.color || 'var(--po-blue, #0B3BFA)'}`,
                              fontSize: '0.84rem',
                              color: 'var(--lab-text)',
                              fontFamily: 'var(--font-sinhala)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: catCfg.color || 'var(--po-blue, #0B3BFA)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Lock size={10} /> {catCfg.shortLabel || 'සටහන'}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    selectSegmentForDrawer(entry);
                                  }}
                                  style={{ border: 'none', background: 'transparent', color: 'var(--po-blue, #0B3BFA)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                                >
                                  සංස්කරණය
                                </button>
                              </div>
                              {summary?.content && (
                                <div style={{ color: 'var(--lab-text-muted)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                                  {summary.content}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT NOTE-TAKING DRAWER */}
        {showNoteDrawer && (
          <aside
            className="km-po-card"
            style={{
              position: 'sticky',
              top: '116px',
              borderRadius: '22px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '11px',
              maxHeight: 'calc(100vh - 134px)',
              overflowY: 'auto'
            }}
          >
            {/* Drawer Header Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '4px', background: 'var(--po-card-subtle)', padding: '3px', borderRadius: '999px' }}>
                <button
                  type="button"
                  onClick={() => setDrawerTab('editor')}
                  style={{
                    padding: '6px 11px',
                    borderRadius: '999px',
                    border: 'none',
                    background: drawerTab === 'editor' ? 'var(--po-card-bg)' : 'transparent',
                    color: drawerTab === 'editor' ? 'var(--po-blue, #0B3BFA)' : 'var(--lab-text-muted)',
                    fontSize: '0.86rem',
                    fontWeight: '800',
                    fontFamily: 'var(--font-sinhala)',
                    cursor: 'pointer'
                  }}
                >
                  සටහන් / දැක්ම
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('list')}
                  style={{
                    padding: '6px 11px',
                    borderRadius: '999px',
                    border: 'none',
                    background: drawerTab === 'list' ? 'var(--po-card-bg)' : 'transparent',
                    color: drawerTab === 'list' ? 'var(--po-blue, #0B3BFA)' : 'var(--lab-text-muted)',
                    fontSize: '0.86rem',
                    fontWeight: '800',
                    fontFamily: 'var(--font-sinhala)',
                    cursor: 'pointer'
                  }}
                >
                  මගේ සටහන් ({suttaNotesList.length})
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowNoteDrawer(false)}
                aria-label="Close note drawer"
                style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={15} />
              </button>
            </div>

            {drawerTab === 'editor' ? (
              <>
                {/* Selected Quote */}
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--lab-text)', marginBottom: '6px', fontFamily: 'var(--font-sinhala)' }}>
                    තෝරාගත් උපුටාව
                  </div>
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '14px',
                    background: 'var(--po-card-subtle)',
                    border: '1px solid var(--po-card-border)',
                    fontSize: '0.9rem',
                    lineHeight: 1.55,
                    color: 'var(--lab-text)',
                    fontFamily: 'var(--font-sinhala)',
                    maxHeight: '115px',
                    overflowY: 'auto'
                  }}>
                    {activeDrawerEntry ? (
                      <>
                        <div>“{activeDrawerEntry.sinh || activeDrawerEntry.pali}”</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', marginTop: '4px' }}>
                          — {currentSutta?.sinhalaTitle || suttaId} · p.{activeDrawerEntry.pageNum || 1}
                        </div>
                      </>
                    ) : (
                      <span style={{ color: 'var(--lab-text-muted)' }}>සටහනක් ලිවීමට පෙළ කොටසක් තෝරන්න.</span>
                    )}
                  </div>
                </div>

                {/* Note Title */}
                <div>
                  <input
                    type="text"
                    value={drawerTitle}
                    onChange={(e) => setDrawerTitle(e.target.value)}
                    placeholder="සටහනේ මාතෘකාව (විකල්ප)..."
                    className="km-lab-input"
                    style={{ padding: '8px 11px', fontSize: '0.9rem', fontFamily: 'var(--font-sinhala)' }}
                  />
                </div>

                {/* 5 Separate Study Note Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {DRAWER_NOTE_FIELDS.map(field => {
                    const catCfg = NOTE_CATEGORIES[field.id] || NOTE_CATEGORIES.reflection;
                    const value = drawerFields[field.id] || '';
                    return (
                      <div
                        key={field.id}
                        style={{
                          borderRadius: '12px',
                          border: `1px solid ${value.trim() ? catCfg.border : 'var(--po-card-border)'}`,
                          background: 'var(--po-card-subtle)',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '6px',
                          padding: '6px 10px',
                          borderBottom: '1px solid var(--po-card-border)',
                          background: value.trim() ? catCfg.bg : 'var(--po-card-bg)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '999px',
                              background: catCfg.color,
                              flexShrink: 0
                            }} />
                            <span style={{
                              fontSize: '0.9rem',
                              fontWeight: '800',
                              color: value.trim() ? catCfg.color : 'var(--lab-text)',
                              fontFamily: 'var(--font-sinhala)'
                            }}>
                              {field.label}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--lab-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                            {value.length} / 500
                          </span>
                        </div>
                        <textarea
                          rows={field.rows}
                          maxLength={500}
                          value={value}
                          onChange={(e) => {
                            const next = e.target.value;
                            setDrawerFields(prev => ({ ...prev, [field.id]: next }));
                          }}
                          placeholder={field.placeholder}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            color: 'var(--lab-text)',
                            fontSize: '0.92rem',
                            lineHeight: 1.52,
                            padding: '8px 10px',
                            resize: 'vertical',
                            fontFamily: 'var(--font-sinhala)'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Optional YouTube Link */}
                <div>
                  <input
                    type="url"
                    value={drawerYoutubeUrl}
                    onChange={(e) => setDrawerYoutubeUrl(e.target.value)}
                    placeholder="YouTube පැහැදිලි කිරීමේ Link (විකල්ප)"
                    className="km-lab-input"
                    style={{ padding: '7px 10px', fontSize: '0.86rem', fontFamily: 'var(--font-sinhala)' }}
                  />
                </div>

                {/* Tags */}
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--lab-text)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-sinhala)' }}>
                    <Tag size={13} color="var(--po-blue, #0B3BFA)" /> ටැග් (Tags)
                  </div>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {drawerTags.map((tag, idx) => (
                      <span
                        key={tag}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: idx === 0 ? '#c6ff24' : 'var(--po-card-subtle)',
                          color: idx === 0 ? '#101214' : 'var(--lab-text)',
                          border: idx === 0 ? 'none' : '1px solid var(--po-card-border)',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          fontFamily: 'var(--font-sinhala)'
                        }}
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => setDrawerTags(prev => prev.filter(t => t !== tag))}
                          style={{ border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {showAddTagInput ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const clean = newTagInput.trim();
                          if (clean && !drawerTags.includes(clean)) setDrawerTags(prev => [...prev, clean]);
                          setNewTagInput('');
                          setShowAddTagInput(false);
                        }}
                      >
                        <input
                          autoFocus
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onBlur={() => setShowAddTagInput(false)}
                          placeholder="Tag..."
                          style={{ width: '84px', padding: '3px 9px', borderRadius: '999px', border: '1px solid var(--po-blue, #0B3BFA)', fontSize: '0.82rem', outline: 'none', fontFamily: 'var(--font-sinhala)' }}
                        />
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddTagInput(true)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          border: '1px solid var(--po-card-border)',
                          background: 'transparent',
                          color: 'var(--po-blue, #0B3BFA)',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          fontFamily: 'var(--font-sinhala)',
                          cursor: 'pointer'
                        }}
                      >
                        + ටැග්
                      </button>
                    )}
                  </div>
                </div>

                {/* Visibility */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'private', label: 'පෞද්ගලික', icon: Lock },
                    { id: 'submit_review', label: 'සමාලෝචනයට', icon: Globe }
                  ].map(v => {
                    const VIcon = v.icon;
                    const active = drawerVisibility === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setDrawerVisibility(v.id)}
                        style={{
                          flex: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          padding: '6px 9px',
                          borderRadius: '10px',
                          border: `1px solid ${active ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-border)'}`,
                          background: active ? 'var(--po-blue-soft)' : 'var(--po-card-subtle)',
                          color: active ? 'var(--po-blue, #0B3BFA)' : 'var(--lab-text-muted)',
                          fontSize: '0.84rem',
                          fontWeight: '700',
                          fontFamily: 'var(--font-sinhala)',
                          cursor: 'pointer'
                        }}
                      >
                        <VIcon size={12} />
                        <span>{v.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Related Concepts */}
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--lab-text)', marginBottom: '6px', fontFamily: 'var(--font-sinhala)' }}>
                    ආශ්‍රිත අදහස් (Related)
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const existing = activeDrawerEntry ? suttaAnnotations[activeDrawerEntry.segmentId] : null;
                        if (existing) {
                          addAnnotationToKnowledgeMap(existing);
                          setDrawerSavedMsg('සිතියමට එක් විය');
                          setTimeout(() => setDrawerSavedMsg(''), 2000);
                        } else {
                          navigate('/lab/map');
                        }
                      }}
                      className="km-lab-btn"
                      style={{ padding: '5px 10px', fontSize: '0.82rem', fontFamily: 'var(--font-sinhala)' }}
                    >
                      <Network size={12} /> සිතියමට
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/lab/reflection')}
                      className="km-lab-btn"
                      style={{ padding: '5px 10px', fontSize: '0.82rem' }}
                    >
                      <Sparkles size={12} /> Reflection
                    </button>
                  </div>
                </div>

                {drawerSavedMsg && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem', fontWeight: '700', color: '#059669', fontFamily: 'var(--font-sinhala)' }}>
                    <Check size={14} /> {drawerSavedMsg}
                  </div>
                )}

                {/* Drawer Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--po-card-border)' }}>
                  <button
                    type="button"
                    disabled={!activeDrawerEntry || !suttaAnnotations[activeDrawerEntry.segmentId]}
                    onClick={() => handleDeleteDrawerNote(activeDrawerEntry)}
                    className="km-lab-btn"
                    style={{ padding: '7px 12px', fontSize: '0.86rem', fontFamily: 'var(--font-sinhala)', opacity: activeDrawerEntry && suttaAnnotations[activeDrawerEntry.segmentId] ? 1 : 0.45 }}
                  >
                    <Trash2 size={13} /> ඉවත් කරන්න
                  </button>
                  <button
                    type="button"
                    disabled={!activeDrawerEntry || !hasDrawerNoteContent}
                    onClick={() => handleSaveDrawerNote(activeDrawerEntry)}
                    className="km-lab-btn-primary"
                    style={{ padding: '7px 15px', fontSize: '0.86rem', fontFamily: 'var(--font-sinhala)', opacity: activeDrawerEntry && hasDrawerNoteContent ? 1 : 0.55 }}
                  >
                    <Save size={13} /> සුරකින්න
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {suttaNotesList.length === 0 ? (
                  <div style={{ padding: '24px 12px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--lab-text-muted)', background: 'var(--po-card-subtle)', borderRadius: '14px', fontFamily: 'var(--font-sinhala)' }}>
                    මෙම සූත්‍රය සඳහා තවම සටහන් නොමැත.
                  </div>
                ) : suttaNotesList.map(anno => {
                  const summary = getAnnotationSummary(anno);
                  const segId = anno.target?.selector?.value;
                  return (
                    <button
                      key={anno.id}
                      type="button"
                      onClick={() => {
                        const match = entries.find(e => e.segmentId === segId);
                        if (match) selectSegmentForDrawer(match);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: '1px solid var(--po-card-border)',
                        background: 'var(--po-card-subtle)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--lab-text)', marginBottom: '3px', fontFamily: 'var(--font-sinhala)' }}>
                        {summary?.title || 'Study Note'}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--lab-text-muted)', lineHeight: 1.4, fontFamily: 'var(--font-sinhala)' }}>
                        {summary?.content}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Floating Pali Lexicon Inspector */}
      {selectedWordInfo && (
        <div
          role="dialog"
          aria-label="Pali Lexicon Lookup"
          className="km-lab-card"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: 'min(380px, calc(100vw - 32px))',
            padding: '16px 18px',
            zIndex: 60,
            border: '1px solid var(--lab-accent)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.22)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--lab-accent)' }}>
                Pāli Lexicon · {selectedWordInfo.source}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--lab-text)' }}>
                {selectedWordInfo.pali}
                {selectedWordInfo.pos && (
                  <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--lab-text-muted)', marginLeft: '8px' }}>
                    ({selectedWordInfo.pos})
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedWordInfo(null)}
              aria-label="Close lexicon popup"
              style={{
                background: 'var(--lab-bg-subtle)',
                border: '1px solid var(--lab-border)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--lab-text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          </div>
          {selectedWordInfo.meaningSi && (
            <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-sinhala)', color: 'var(--lab-text)', marginBottom: '6px', lineHeight: 1.55 }}>
              {selectedWordInfo.meaningSi}
            </div>
          )}
          <div style={{ fontSize: '0.84rem', color: 'var(--lab-text-muted)', lineHeight: 1.5, marginBottom: '6px' }}>
            {selectedWordInfo.meaningEn}
          </div>
          {selectedWordInfo.root && (
            <div style={{ fontSize: '0.75rem', color: 'var(--lab-text-muted)', paddingTop: '6px', borderTop: '1px solid var(--lab-border)' }}>
              <strong>Root / Stem:</strong> {selectedWordInfo.root} {selectedWordInfo.stem ? `· ${selectedWordInfo.stem}` : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
