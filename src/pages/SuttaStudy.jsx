import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
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
  Lock,
  Languages,
  X
} from 'lucide-react';
import {
  loadPopularSuttas,
  getTreeChildren,
  getBreadcrumbs,
  searchSuttas,
  getSuttaContent
} from '../services/tipitakaService';
import { getAnnotationsBySutta, getAnnotationSummary, NOTE_CATEGORIES } from '../services/studyRoadmapStore';
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
import AcademicNoteModal from '../components/SuttaStudy/AcademicNoteModal';

export default function SuttaStudy() {
  const { suttaId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Catalog & Tree Browser State
  const [popularSuttas, setPopularSuttas] = useState([]);
  const browseParentKey = searchParams.get('branch') || null;
  const [browseChildren, setBrowseChildren] = useState([]);
  const [browseBreadcrumbs, setBrowseBreadcrumbs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);

  // Active Sutta State
  const [loadedSutta, setLoadedSutta] = useState(null);
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
  const [activeNoteModal, setActiveNoteModal] = useState({
    isOpen: false,
    segment: null,
    existingAnnotation: null
  });

  useEffect(() => {
    loadPopularSuttas().then(list => setPopularSuttas(list.slice(0, 12)));
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

    getSuttaContent(suttaId)
      .then(data => {
        if (cancelled) return;
        setLoadedSutta(data);
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

  const openNoteModal = (entry, existingAnno = null) => {
    setActiveNoteModal({
      isOpen: true,
      segment: {
        segmentId: entry.segmentId,
        rootPali: entry.pali,
        translationSi: entry.sinh
      },
      existingAnnotation: existingAnno
    });
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

  // ============================================================================
  // VIEW 1: SUTTA CATALOG & TREE BROWSER
  // ============================================================================
  if (!suttaId) {
    const isSearching = searchQuery.trim().length > 0;

    return (
      <div className="km-lab-page">
        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '28px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--lab-text-muted)'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="සූත්‍ර නාමයෙන් සොයන්න (උදා: කරණීය මෙත්ත, දම්සක්, karaniya metta, satipatthana)..."
            style={{
              width: '100%',
              padding: '14px 18px 14px 46px',
              borderRadius: '14px',
              border: '1px solid var(--lab-border)',
              background: 'var(--lab-bg-elevated)',
              color: 'var(--lab-text)',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-sinhala)',
              boxShadow: 'var(--lab-shadow)',
              outline: 'none'
            }}
          />
        </div>

        {isSearching ? (
          <div>
            <h2 style={{
              fontSize: '1.02rem',
              fontWeight: '700',
              fontFamily: 'var(--font-sinhala)',
              color: 'var(--lab-text)',
              marginBottom: '14px'
            }}>
              සෙවුම් ප්‍රතිඵල ({searchResults.length})
            </h2>
            {searchResults.length === 0 ? (
              <div className="km-lab-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
                ගැළපෙන සූත්‍ර හමු නොවීය.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {searchResults.map(item => (
                  <div
                    key={item.key}
                    className="km-lab-card km-lab-card-interactive"
                    onClick={() => navigate(`/lab/sutta/${item.key}`)}
                    style={{
                      padding: '16px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: '700', color: 'var(--lab-text)', fontSize: '0.98rem', marginBottom: '3px' }}>
                        {item.sinhalaName}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--lab-text-muted)' }}>
                        {item.paliName}
                      </div>
                    </div>
                    <ChevronRight size={16} color="var(--lab-text-muted)" style={{ flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {!browseParentKey ? (
                  <>
                    {/* Default: Popular Suttas (Top 3) */}
                    <div style={{ marginBottom: '24px' }}>
                      <h2 style={{
                        fontSize: '1.02rem',
                        fontWeight: '700',
                        fontFamily: 'var(--font-sinhala)',
                        color: 'var(--lab-text)',
                        margin: '0 0 12px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <Sparkles size={16} color="var(--lab-gold)" />
                        <span>ජනප්‍රිය සූත්‍ර (Popular Suttas)</span>
                      </h2>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                        {popularSuttas.slice(0, 3).map(sutta => (
                          <div
                            key={sutta.key}
                            className="km-lab-card km-lab-card-interactive"
                            onClick={() => navigate(`/lab/sutta/${sutta.key}`)}
                            style={{ padding: '16px 18px', cursor: 'pointer' }}
                          >
                            <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: '700', fontSize: '0.98rem', color: 'var(--lab-text)', marginBottom: '4px' }}>
                              {sutta.sinhalaName}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--lab-text-muted)' }}>
                              {sutta.paliName}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {bookmarkedList.length > 0 && (
                      <div>
                        <h2 style={{
                          fontSize: '1rem',
                          fontWeight: '700',
                          fontFamily: 'var(--font-sinhala)',
                          color: 'var(--lab-text)',
                          margin: '0 0 12px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <BookMarked size={15} color="var(--lab-accent)" />
                          <span>සුරැකි සූත්‍ර (Bookmarked)</span>
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                          {bookmarkedList.map(bm => (
                            <div
                              key={bm.suttaKey}
                              className="km-lab-card km-lab-card-interactive"
                              onClick={() => navigate(`/lab/sutta/${bm.suttaKey}`)}
                              style={{ padding: '14px 16px', cursor: 'pointer', borderLeft: '3px solid var(--lab-accent)' }}
                            >
                              <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: '700', color: 'var(--lab-text)', fontSize: '0.94rem', marginBottom: '3px' }}>
                                {bm.suttaTitleSinhala || bm.suttaKey}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)' }}>
                                {bm.suttaTitlePali}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="km-lab-card" style={{ padding: '18px 20px' }}>
                    {browseBreadcrumbs.length > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexWrap: 'wrap',
                        marginBottom: '14px',
                        paddingBottom: '10px',
                        borderBottom: '1px solid var(--lab-border)',
                        fontSize: '0.84rem',
                        fontFamily: 'var(--font-sinhala)',
                        color: 'var(--lab-text-muted)'
                      }}>
                        {browseBreadcrumbs.map((c, idx) => (
                          <span key={c.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {idx > 0 && <ChevronRight size={13} />}
                            <button
                              onClick={() => c.key !== 'sp' && navigate(`/lab/sutta?branch=${encodeURIComponent(c.key)}`)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: idx === browseBreadcrumbs.length - 1 ? 'var(--lab-text)' : 'var(--lab-text-muted)',
                                fontWeight: idx === browseBreadcrumbs.length - 1 ? '700' : '500',
                                cursor: c.key === 'sp' ? 'default' : 'pointer',
                                fontFamily: 'var(--font-sinhala)',
                                fontSize: '0.86rem'
                              }}
                            >
                              {c.sinhalaName}
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                      {browseChildren.map(child => (
                        <div
                          key={child.key}
                          onClick={() => {
                            if (child.hasChildren) navigate(`/lab/sutta?branch=${encodeURIComponent(child.key)}`);
                            else navigate(`/lab/sutta/${child.key}`);
                          }}
                          style={{
                            padding: '13px 15px',
                            borderRadius: '10px',
                            background: 'var(--lab-bg-subtle)',
                            border: '1px solid var(--lab-border)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px'
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: '600', fontSize: '0.94rem', color: 'var(--lab-text)' }}>
                              {child.sinhalaName}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--lab-text-muted)' }}>
                              {child.paliName}
                            </div>
                          </div>
                          <ChevronRight size={15} color="var(--lab-text-muted)" style={{ flexShrink: 0 }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
    fontSize: '0.8rem',
    fontWeight: '600',
    fontFamily: 'var(--font-sinhala)',
    cursor: 'pointer'
  });

  const allEntries = currentSutta?.entries || [];
  const entries = onlyHighlighted
    ? allEntries.filter(e => Boolean(suttaHighlights[e.segmentId]))
    : allEntries;
  const highlightCount = Object.keys(suttaHighlights).length;
  const showTwoCols = viewLayout === 'parallel' && showPali && showSinhala;

  return (
    <div style={{ paddingBottom: '72px' }}>
      {/* Frosted Sticky Toolbar */}
      <div style={{
        position: 'sticky',
        top: '56px',
        zIndex: 25,
        background: 'var(--lab-bg-glass)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--lab-border)',
        padding: '10px clamp(14px, 3vw, 28px)'
      }}>
        <div style={{
          maxWidth: '1120px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <button
              onClick={() => navigate('/lab/sutta')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '999px',
                border: '1px solid var(--lab-border)',
                background: 'var(--lab-bg-elevated)',
                color: 'var(--lab-text)',
                fontSize: '0.82rem',
                fontWeight: '600',
                fontFamily: 'var(--font-sinhala)',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={14} />
              <span>සූත්‍ර</span>
            </button>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: '700', fontSize: '0.98rem', color: 'var(--lab-text)' }}>
                {currentSutta?.sinhalaTitle || suttaId}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>
                {currentSutta?.paliTitle || ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setViewLayout(viewLayout === 'parallel' ? 'interlinear' : 'parallel')}
              style={pillStyle(true)}
            >
              {viewLayout === 'parallel' ? <Columns size={13} /> : <AlignJustify size={13} />}
              <span>{viewLayout === 'parallel' ? 'සමපාත' : 'පේළි අතර'}</span>
            </button>

            <button onClick={() => setShowPali(v => !v)} style={pillStyle(showPali)}>
              පාලි
            </button>
            <button onClick={() => setShowSinhala(v => !v)} style={pillStyle(showSinhala)}>
              සිංහල
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

            <button
              onClick={handleToggleBookmark}
              style={pillStyle(isBookmarked)}
              title={isBookmarked ? 'සුරැකුම ඉවත් කරන්න' : 'මෙම සූත්‍රය සුරකින්න'}
              aria-pressed={isBookmarked}
            >
              {isBookmarked ? <BookMarked size={13} /> : <Bookmark size={13} />}
              <span>{isBookmarked ? 'සුරැකි' : 'සුරකින්න'}</span>
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
              >
                <Minus size={13} />
              </button>
              <span style={{ fontSize: '0.74rem', color: 'var(--lab-text-muted)', padding: '0 4px', fontWeight: '600' }}>අ</span>
              <button
                onClick={() => setFontScale(s => Math.min(1.45, +(s + 0.1).toFixed(2)))}
                style={{ padding: '6px 9px', border: 'none', background: 'transparent', color: 'var(--lab-text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Plus size={13} />
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
                fontSize: '0.8rem',
                fontWeight: '600',
                fontFamily: 'var(--font-sinhala)'
              }}
            >
              <Highlighter size={13} />
              <span>All Notes</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Reader */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '24px clamp(14px, 3vw, 28px)' }}>
        {isLoadingSutta ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
            සූත්‍ර පෙළ පූරණය වෙමින් පවතී...
          </div>
        ) : errorMsg ? (
          <div className="km-lab-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--lab-accent)', fontFamily: 'var(--font-sinhala)' }}>
            {errorMsg}
          </div>
        ) : (
          <>
            {/* Sutta Title Card */}
            <div className="km-lab-card" style={{ padding: '22px 26px', marginBottom: '18px' }}>
              {currentSutta?.breadcrumbs?.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                  fontSize: '0.78rem',
                  color: 'var(--lab-text-muted)',
                  fontFamily: 'var(--font-sinhala)',
                  marginBottom: '8px'
                }}>
                  {currentSutta.breadcrumbs.map((b, idx) => (
                    <span key={b.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {idx > 0 && <ChevronRight size={12} />}
                      <span>{b.sinhalaName}</span>
                    </span>
                  ))}
                </div>
              )}
              <h1 style={{
                fontFamily: 'var(--font-sinhala)',
                fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
                fontWeight: '700',
                color: 'var(--lab-text)',
                margin: '0 0 4px 0'
              }}>
                {currentSutta?.sinhalaTitle}
              </h1>
              <div style={{ fontSize: '0.94rem', color: 'var(--lab-text-muted)', marginBottom: '10px' }}>
                {currentSutta?.paliTitle}
              </div>

              <div style={{
                paddingTop: '10px',
                borderTop: '1px solid var(--lab-border)',
                fontSize: '0.78rem',
                color: 'var(--lab-text-muted)',
                fontFamily: 'var(--font-sinhala)'
              }}>
                මූලාශ්‍රය: බුද්ධ ජයන්ති ත්‍රිපිටකය (පාලි සහ සිංහල)
              </div>
            </div>

            {showTwoCols && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                padding: '0 20px 10px 20px',
                fontSize: '0.76rem',
                fontWeight: '700',
                color: 'var(--lab-text-muted)',
                fontFamily: 'var(--font-sinhala)'
              }}>
                <div>පාලි මුල් පෙළ (Pāli)</div>
                <div>සිංහල පරිවර්තනය (Sinhala)</div>
              </div>
            )}

            {entries.length === 0 ? (
              <div className="km-lab-card" style={{ padding: '36px', textAlign: 'center', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
                {onlyHighlighted ? 'මෙම සූත්‍රයේ Highlight කළ කොටස් තවම නොමැත.' : 'පෙළ හමු නොවීය.'}
              </div>
            ) : (
              <div className="km-lab-card" style={{ overflow: 'hidden' }}>
                {entries.map((entry, idx) => {
                  const isHeading = entry.type === 'heading' || entry.type === 'centered';
                  const isGatha = entry.type === 'gatha';
                  const personalNote = suttaAnnotations[entry.segmentId];
                  const highlight = suttaHighlights[entry.segmentId];
                  const hlColorObj = highlight ? HIGHLIGHT_COLORS[highlight.color] : null;
                  const isLast = idx === entries.length - 1;

                  return (
                    <div
                      key={entry.id}
                      id={entry.segmentId}
                      className="km-lab-entry-row"
                      style={{
                        padding: isHeading ? '16px clamp(16px, 3vw, 26px)' : '15px clamp(16px, 3vw, 26px)',
                        borderBottom: isLast ? 'none' : '1px solid var(--lab-border)',
                        background: hlColorObj
                          ? hlColorObj.bgVar
                          : isHeading
                            ? 'var(--lab-bg-subtle)'
                            : 'transparent',
                        borderLeft: hlColorObj ? `4px solid ${hlColorObj.dot}` : '4px solid transparent'
                      }}
                    >
                      {!isHeading && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                          gap: '10px'
                        }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
                            p.{entry.pageNum}
                          </span>

                          {/* 1-Click Highlight Swatches + Note Button */}
                          <div className="km-lab-entry-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 7px',
                              borderRadius: '999px',
                              background: 'var(--lab-bg-elevated)',
                              border: '1px solid var(--lab-border)'
                            }}>
                              {Object.values(HIGHLIGHT_COLORS).map(c => {
                                const selected = highlight?.color === c.id;
                                return (
                                  <button
                                    key={c.id}
                                    onClick={() => handleToggleHighlight(entry, c.id)}
                                    title={selected ? `Remove ${c.label} highlight` : `Highlight ${c.label}`}
                                    style={{
                                      width: '13px',
                                      height: '13px',
                                      borderRadius: '50%',
                                      border: selected ? '2px solid var(--lab-text)' : '1px solid transparent',
                                      background: c.dot,
                                      cursor: 'pointer',
                                      padding: 0,
                                      transform: selected ? 'scale(1.15)' : 'scale(1)'
                                    }}
                                  />
                                );
                              })}
                            </div>

                            <button
                              onClick={() => openNoteModal(entry, personalNote || null)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 10px',
                                borderRadius: '999px',
                                border: `1px solid ${personalNote ? 'var(--lab-accent)' : 'var(--lab-border)'}`,
                                background: personalNote ? 'var(--lab-accent-soft)' : 'var(--lab-bg-elevated)',
                                color: personalNote ? 'var(--lab-accent)' : 'var(--lab-text-muted)',
                                fontSize: '0.74rem',
                                fontWeight: '600',
                                fontFamily: 'var(--font-sinhala)',
                                cursor: 'pointer'
                              }}
                            >
                              <Plus size={11} />
                              <span>{personalNote ? 'සටහන' : 'සටහනක්'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div style={{
                        display: showTwoCols ? 'grid' : 'flex',
                        gridTemplateColumns: showTwoCols ? 'repeat(auto-fit, minmax(280px, 1fr))' : undefined,
                        flexDirection: showTwoCols ? undefined : 'column',
                        gap: showTwoCols ? '24px' : '8px',
                        alignItems: 'start'
                      }}>
                        {showPali && entry.pali && (
                          <div style={{
                            fontFamily: 'var(--font-sinhala)',
                            fontSize: `${(isHeading ? 1.08 : 1.0) * fontScale}rem`,
                            fontWeight: isHeading ? '700' : '400',
                            fontStyle: isGatha ? 'italic' : 'normal',
                            lineHeight: 1.8,
                            color: isHeading ? 'var(--lab-accent)' : 'var(--lab-text)',
                            whiteSpace: 'pre-line'
                          }}>
                            {lexiconEnabled && !isHeading ? (
                              tokenizePaliText(entry.pali).map(tok =>
                                tok.isWord ? (
                                  <span
                                    key={tok.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handlePaliWordClick(tok.raw, entry.segmentId)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handlePaliWordClick(tok.raw, entry.segmentId);
                                      }
                                    }}
                                    style={{
                                      cursor: 'pointer',
                                      borderBottom: '1px dotted rgba(79, 70, 229, 0.35)',
                                      borderRadius: '3px',
                                      padding: '0 1px',
                                      transition: 'background 0.12s ease'
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
                            color: isHeading ? 'var(--lab-accent)' : 'var(--lab-text)',
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
                            marginTop: '12px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'var(--lab-bg-elevated)',
                            border: '1px solid var(--lab-border)',
                            borderLeft: `3px solid ${catCfg.color || 'var(--lab-accent)'}`,
                            fontSize: '0.85rem',
                            color: 'var(--lab-text)',
                            fontFamily: 'var(--font-sinhala)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: '700',
                                  color: catCfg.color || 'var(--lab-accent)',
                                  background: catCfg.bg || 'var(--lab-accent-soft)',
                                  padding: '2px 8px',
                                  borderRadius: '999px'
                                }}>
                                  {catCfg.shortLabel || 'සටහන'}
                                </span>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.7rem',
                                  color: 'var(--lab-text-muted)'
                                }}>
                                  <Lock size={10} />
                                  {summary?.visibility === 'private' ? 'Private Study Note' : summary?.visibility}
                                </span>
                              </div>
                              <button
                                onClick={() => openNoteModal(entry, personalNote)}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  color: 'var(--lab-accent)',
                                  fontSize: '0.74rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  padding: 0
                                }}
                              >
                                Edit Note
                              </button>
                            </div>
                            {summary?.title && (
                              <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                                {summary.title}
                              </div>
                            )}
                            {summary?.content && (
                              <div style={{ color: 'var(--lab-text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                {summary.content}
                              </div>
                            )}
                            {(summary?.crossSuttaRef || summary?.youtubeUrl) && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--lab-border)', fontSize: '0.76rem' }}>
                                {summary.crossSuttaRef && (
                                  <span style={{ color: 'var(--lab-accent)', fontWeight: '600' }}>
                                    සම්බන්ධිත සූත්‍රය: {summary.crossSuttaRef}
                                  </span>
                                )}
                                {summary.youtubeUrl && (
                                  <a
                                    href={summary.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#DC2626', fontWeight: '600', textDecoration: 'none' }}
                                  >
                                    YouTube පැහැදිලි කිරීම ↗ {summary.youtubeNote ? `(${summary.youtubeNote})` : ''}
                                  </a>
                                )}
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

      <AcademicNoteModal
        key={`${activeNoteModal.segment?.segmentId || 'none'}-${activeNoteModal.existingAnnotation?.id || 'new'}`}
        isOpen={activeNoteModal.isOpen}
        onClose={() => setActiveNoteModal({ isOpen: false, segment: null, existingAnnotation: null })}
        sutta={currentSutta ? {
          suttaId,
          titlePali: currentSutta.paliTitle,
          titleSinhala: currentSutta.sinhalaTitle,
          canonicalRef: suttaId
        } : null}
        segment={activeNoteModal.segment}
        existingAnnotation={activeNoteModal.existingAnnotation}
      />
    </div>
  );
}
