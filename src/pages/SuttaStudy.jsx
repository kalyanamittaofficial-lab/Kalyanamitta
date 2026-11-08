import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ArrowLeft, 
  Search, 
  Layers, 
  Info, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Columns, 
  Quote, 
  Sliders, 
  Sparkles, 
  Compass, 
  ExternalLink,
  BookMarked,
  X
} from 'lucide-react';
import { getAvailableSuttas, getSuttaData } from '../services/bilaraService';
import { getAnnotationsBySutta, NOTE_CATEGORIES } from '../services/studyRoadmapStore';
import { tokenizePaliText } from '../services/paliDictionaryService';
import AcademicNoteModal from '../components/SuttaStudy/AcademicNoteModal';
import AcademicCitationModal from '../components/SuttaStudy/AcademicCitationModal';
import ResearchInspector from '../components/SuttaStudy/ResearchInspector';

export default function SuttaStudy() {
  const { suttaId } = useParams();
  const navigate = useNavigate();

  // Catalog State
  const [suttaList, setSuttaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Sutta State
  const [currentSutta, setCurrentSutta] = useState(null);
  const [isLoadingSutta, setIsLoadingSutta] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Progressive Disclosure: Mode Switch ('reader' = Simple / Serene, 'research' = Academic Workbench)
  const [studyMode, setStudyMode] = useState('reader'); // 'reader' | 'research'

  // Research Mode Preferences
  const [layoutMode, setLayoutMode] = useState('parallel'); // 'interlinear' | 'parallel'
  const [enablePaliTokenizer, setEnablePaliTokenizer] = useState(true);
  const [showVariantsInStream, setShowVariantsInStream] = useState(true);

  // Layer Toggles
  const [showPali, setShowPali] = useState(true);
  const [translationLang, setTranslationLang] = useState('both'); // 'si' | 'en' | 'both' | 'none'
  const [showScholarlyNotes, setShowScholarlyNotes] = useState(true);
  const [showPersonalNotes, setShowPersonalNotes] = useState(true);

  // Annotations State
  const [suttaAnnotations, setSuttaAnnotations] = useState({});
  const [activeNoteModal, setActiveNoteModal] = useState({
    isOpen: false,
    segment: null,
    existingAnnotation: null
  });

  // Citation Modal State
  const [citationModal, setCitationModal] = useState({
    isOpen: false,
    activeSegment: null
  });

  // Research Inspector State
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [activeSegmentForInspector, setActiveSegmentForInspector] = useState(null);
  const [selectedPaliWord, setSelectedPaliWord] = useState('');

  // Expanded scholarly rows in Reader mode
  const [expandedScholarly, setExpandedScholarly] = useState({});

  // 1. Load catalog
  useEffect(() => {
    getAvailableSuttas().then(list => setSuttaList(list));
  }, []);

  // 2. Load active sutta when route param changes
  useEffect(() => {
    if (!suttaId) {
      setCurrentSutta(null);
      return;
    }

    setIsLoadingSutta(true);
    setErrorMsg(null);

    getSuttaData(suttaId)
      .then(data => {
        setCurrentSutta(data);
        loadAnnotations(suttaId);
        setIsLoadingSutta(false);
        // Default active segment to first non-heading segment
        const firstSegment = data?.segments?.find(s => !s.isHeading) || data?.segments?.[0] || null;
        setActiveSegmentForInspector(firstSegment);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg('සූත්‍ර දත්ත ලබාගැනීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.');
        setIsLoadingSutta(false);
      });
  }, [suttaId]);

  // Load annotations helper
  const loadAnnotations = (sId) => {
    const annos = getAnnotationsBySutta(sId);
    setSuttaAnnotations(annos);
  };

  // Listen for storage updates
  useEffect(() => {
    const handleUpdate = () => {
      if (suttaId) loadAnnotations(suttaId);
    };
    window.addEventListener('studyRoadmapUpdated', handleUpdate);
    return () => window.removeEventListener('studyRoadmapUpdated', handleUpdate);
  }, [suttaId]);

  const toggleScholarlyRow = (segId) => {
    setExpandedScholarly(prev => ({
      ...prev,
      [segId]: !prev[segId]
    }));
  };

  const openNoteModal = (segment, existingAnno = null) => {
    setActiveNoteModal({
      isOpen: true,
      segment,
      existingAnnotation: existingAnno
    });
  };

  const handleInspectSegment = (segment, word = '') => {
    setActiveSegmentForInspector(segment);
    if (word) setSelectedPaliWord(word);
    setIsInspectorOpen(true);
  };

  const handleOpenCitation = (segment = null) => {
    setCitationModal({
      isOpen: true,
      activeSegment: segment
    });
  };

  // Calculate total notes in this sutta
  const totalNotesInSutta = useMemo(() => {
    return Object.values(suttaAnnotations).reduce((acc, curr) => acc + curr.length, 0);
  }, [suttaAnnotations]);

  // SUTTA CATALOG VIEW (when no suttaId is in URL)
  if (!suttaId) {
    const filteredList = suttaList.filter(s => {
      const q = searchQuery.toLowerCase();
      return (
        s.titlePali.toLowerCase().includes(q) ||
        s.titleSinhala.toLowerCase().includes(q) ||
        s.canonicalRef.toLowerCase().includes(q) ||
        s.nikaya.toLowerCase().includes(q)
      );
    });

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '40px clamp(16px, 4vw, 48px) 120px clamp(16px, 4vw, 48px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Sleek Minimalist Catalog Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '24px'
          }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                fontWeight: '700',
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-main)',
                margin: '0 0 4px 0',
                lineHeight: 1.2
              }}>
                සූත්‍ර අධ්‍යයන කේන්ද්‍රය (Canonical Suttas)
              </h1>
              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                margin: 0
              }}>
                SuttaCentral Bilara 3-Layer Corpus (Root Pali · BJ Sinhala · Sujato English)
              </p>
            </div>

            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '360px'
            }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input
                type="text"
                placeholder="සූත්‍රයක් හෝ පාඨයක් සොයන්න..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 14px 8px 36px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Sutta List Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {filteredList.map(sutta => (
              <motion.div
                key={sutta.id}
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/lab/sutta/${sutta.id}`)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                  borderRadius: '14px',
                  padding: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      color: '#8C1515',
                      background: 'rgba(140, 21, 21, 0.08)',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>
                      {sutta.canonicalRef}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {sutta.nikayaSinhala || sutta.nikaya}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '1.35rem',
                    fontWeight: '700',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--text-main)',
                    margin: '0 0 6px 0'
                  }}>
                    {sutta.titleSinhala}
                  </h3>

                  <div style={{
                    fontSize: '0.92rem',
                    fontFamily: 'var(--font-pali, serif)',
                    fontStyle: 'italic',
                    color: 'var(--text-muted)',
                    marginBottom: '12px'
                  }}>
                    {sutta.titlePali}
                  </div>

                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '20px'
                  }}>
                    {sutta.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {sutta.segmentCount} Segments
                  </span>
                  <span style={{
                    color: '#8C1515',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    අධ්‍යයනය කරන්න <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // Pali Token Component for interactive word-by-word research
  const renderPaliTokens = (paliText, segment) => {
    if (!enablePaliTokenizer || studyMode !== 'research') {
      return (
        <span style={{ fontFamily: 'var(--font-pali, serif)', fontSize: '1.25rem', fontWeight: '600' }}>
          {paliText}
        </span>
      );
    }

    const tokens = tokenizePaliText(paliText);
    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        lineHeight: 1.8,
        fontFamily: 'var(--font-pali, serif)',
        fontSize: '1.2rem',
        fontWeight: '600'
      }}>
        {tokens.map((token, idx) => {
          const isSelected = selectedPaliWord && selectedPaliWord.toLowerCase() === token.cleanWord.toLowerCase();
          return (
            <span
              key={`${token.rawWord}-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                handleInspectSegment(segment, token.cleanWord);
              }}
              title={`Click to inspect '${token.cleanWord}' in Pali Lexicon`}
              style={{
                cursor: 'pointer',
                padding: '1px 5px',
                borderRadius: '4px',
                background: isSelected ? '#8C1515' : 'rgba(140, 21, 21, 0.05)',
                color: isSelected ? '#FFFFFF' : 'inherit',
                borderBottom: isSelected ? 'none' : '1px dotted rgba(140, 21, 21, 0.4)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(140, 21, 21, 0.12)';
                  e.currentTarget.style.color = '#8C1515';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(140, 21, 21, 0.05)';
                  e.currentTarget.style.color = 'inherit';
                }
              }}
            >
              {token.rawWord}
            </span>
          );
        })}
      </div>
    );
  };

  // SUTTA SEGMENT STUDY WORKSPACE VIEW
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: '120px' }}>
      
      {/* Sticky Top Workspace Header */}
      <div style={{
        position: 'sticky',
        top: '52px',
        zIndex: 50,
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        padding: '10px clamp(16px, 4vw, 40px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Breadcrumb & Sutta Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigate('/lab/sutta')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                background: 'transparent',
                color: 'var(--text-main)',
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={15} />
              <span>සූත්‍ර ලැයිස්තුව</span>
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.18rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--text-main)'
                }}>
                  {currentSutta?.titleSi || currentSutta?.titlePali || suttaId}
                </h2>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(140, 21, 21, 0.08)',
                  color: '#8C1515',
                  fontWeight: '600'
                }}>
                  {suttaId?.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {currentSutta?.titlePali} • {currentSutta?.segments?.length || 0} Segments
              </div>
            </div>
          </div>

          {/* Mode Switcher: Reader vs Research Workbench */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {/* Primary Mode Pill Switcher */}
            <div style={{
              display: 'inline-flex',
              padding: '3px',
              borderRadius: '8px',
              background: 'var(--bg-main)',
              border: '1px solid var(--border-color, rgba(0,0,0,0.12))'
            }}>
              <button
                onClick={() => setStudyMode('reader')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: studyMode === 'reader' ? '#8C1515' : 'transparent',
                  color: studyMode === 'reader' ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <BookOpen size={13} />
                <span>Reader Mode</span>
              </button>

              <button
                onClick={() => {
                  setStudyMode('research');
                  setIsInspectorOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: studyMode === 'research' ? '#8C1515' : 'transparent',
                  color: studyMode === 'research' ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={13} />
                <span>Research Mode</span>
              </button>
            </div>

            {/* Cite Sutta Action */}
            <button
              onClick={() => handleOpenCitation(null)}
              title="Generate Academic Citation (APA, Chicago, BibTeX)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                background: 'transparent',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Quote size={13} color="#8C1515" />
              <span>Cite</span>
            </button>

            {/* Layer 3 Roadmap Button */}
            <Link
              to="/lab/roadmap"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(140, 21, 21, 0.08)',
                color: '#8C1515',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: '700'
              }}
            >
              <Compass size={14} />
              <span>Roadmap ({totalNotesInSutta})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SECONDARY TOOLBAR: Shown in Research Mode or Reader Mode controls */}
      <div style={{
        background: studyMode === 'research' ? 'rgba(140, 21, 21, 0.03)' : 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.06))',
        padding: '8px clamp(16px, 4vw, 40px)',
        fontSize: '0.82rem'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {studyMode === 'research' ? (
            /* Research Mode Toolbar Controls */
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '700', color: '#8C1515', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  Layout:
                </span>
                <div style={{
                  display: 'inline-flex',
                  borderRadius: '6px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
                  padding: '2px'
                }}>
                  <button
                    onClick={() => setLayoutMode('parallel')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      background: layoutMode === 'parallel' ? '#8C1515' : 'transparent',
                      color: layoutMode === 'parallel' ? '#FFFFFF' : 'var(--text-muted)',
                      fontSize: '0.76rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Parallel Columns
                  </button>
                  <button
                    onClick={() => setLayoutMode('interlinear')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      background: layoutMode === 'interlinear' ? '#8C1515' : 'transparent',
                      color: layoutMode === 'interlinear' ? '#FFFFFF' : 'var(--text-muted)',
                      fontSize: '0.76rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Interlinear
                  </button>
                </div>
              </div>

              {/* Pali Word Lexicon Tokenizer */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-main)' }}>
                <input
                  type="checkbox"
                  checked={enablePaliTokenizer}
                  onChange={e => setEnablePaliTokenizer(e.target.checked)}
                />
                <span>Pāli Word-Tokens (Lexicon on click)</span>
              </label>

              {/* Textual Apparatus in Stream */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-main)' }}>
                <input
                  type="checkbox"
                  checked={showVariantsInStream}
                  onChange={e => setShowVariantsInStream(e.target.checked)}
                />
                <span>Show Variants Apparatus</span>
              </label>
            </div>
          ) : (
            /* Reader Mode Simple Controls */
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowPali(!showPali)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: showPali ? '1px solid #8C1515' : '1px solid var(--border-color, rgba(0,0,0,0.12))',
                  background: showPali ? 'rgba(140, 21, 21, 0.08)' : 'transparent',
                  color: showPali ? '#8C1515' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <span>L1: පාලි පෙළ</span>
                {showPali ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>

              <select
                value={translationLang}
                onChange={(e) => setTranslationLang(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.15))',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <option value="both">L2: සිංහල + English</option>
                <option value="si">L2: සිංහල පමණක්</option>
                <option value="en">L2: English (Sujato)</option>
                <option value="none">L2: සඟවන්න</option>
              </select>

              <button
                onClick={() => setShowScholarlyNotes(!showScholarlyNotes)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: showScholarlyNotes ? '1px solid #2563EB' : '1px solid var(--border-color, rgba(0,0,0,0.12))',
                  background: showScholarlyNotes ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  color: showScholarlyNotes ? '#2563EB' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Info size={12} />
                <span>විද්වත් විවරණ (Scholarly)</span>
              </button>
            </div>
          )}

          {/* Right toggle for Inspector in Research Mode */}
          {studyMode === 'research' && (
            <button
              onClick={() => setIsInspectorOpen(!isInspectorOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '6px',
                background: isInspectorOpen ? '#8C1515' : 'var(--bg-card)',
                color: isInspectorOpen ? '#FFFFFF' : 'var(--text-main)',
                border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Sliders size={13} />
              <span>{isInspectorOpen ? 'Hide Inspector' : 'Show Inspector'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Study Body: Split Pane when Inspector is Open in Research Mode */}
      <div style={{
        maxWidth: studyMode === 'research' && isInspectorOpen ? '1540px' : '1080px',
        margin: '24px auto',
        padding: '0 clamp(16px, 3vw, 36px)',
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
        transition: 'max-width 0.2s ease'
      }}>
        
        {/* LEFT / CENTER: Segment Stream */}
        <div style={{
          flex: 1,
          minWidth: 0,
          width: '100%'
        }}>
          {/* Methodological Integrity Note */}
          <div style={{
            padding: '12px 18px',
            borderRadius: '10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#8C1515" />
              <span style={{ color: 'var(--text-muted)' }}>
                <strong>Canonical Stand-off Isolation: </strong>
                Layer 1 & 2 remain immutable. Research notes anchor via Bilara segment addresses.
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#8C1515', fontWeight: '700' }}>
              MS Tipiṭaka · Bilara Canonical Root
            </span>
          </div>

          {/* Loading / Error States */}
          {isLoadingSutta && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <p>සූත්‍ර පාඨ සහ විද්වත් පරිවර්තන සමපාත කරමින් පවතී...</p>
            </div>
          )}

          {errorMsg && (
            <div style={{
              padding: '20px',
              borderRadius: '10px',
              background: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              color: '#DC2626',
              textAlign: 'center'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Segment Streams */}
          {currentSutta && currentSutta.segments && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentSutta.segments.map((segment) => {
                const notesForSegment = suttaAnnotations[segment.segmentId] || [];
                const hasNotes = notesForSegment.length > 0;
                const isSelectedForInspector = activeSegmentForInspector?.segmentId === segment.segmentId;
                const isScholarlyOpen = Boolean(expandedScholarly[segment.segmentId]);

                // Heading segment (sutta title / nipata header)
                if (segment.isHeading) {
                  return (
                    <div
                      key={segment.segmentId}
                      style={{
                        textAlign: 'center',
                        padding: '28px 0 16px 0',
                        borderBottom: '2px solid rgba(140, 21, 21, 0.15)',
                        marginBottom: '16px'
                      }}
                    >
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '0.74rem',
                        color: 'var(--text-muted)',
                        display: 'block',
                        marginBottom: '4px'
                      }}>
                        [{segment.segmentId}]
                      </span>
                      <h2 style={{
                        fontSize: '1.8rem',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: '700',
                        color: '#8C1515',
                        margin: 0
                      }}>
                        {segment.rootPali}
                      </h2>
                      {(segment.translationSi || segment.translationEn) && (
                        <div style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                          {segment.translationSi || segment.translationEn}
                        </div>
                      )}
                    </div>
                  );
                }

                // Normal Segment Card
                return (
                  <div
                    key={segment.segmentId}
                    id={segment.segmentId}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: isSelectedForInspector && studyMode === 'research'
                        ? 'rgba(140, 21, 21, 0.04)'
                        : hasNotes
                        ? 'rgba(140, 21, 21, 0.015)'
                        : 'var(--bg-card)',
                      border: isSelectedForInspector && studyMode === 'research'
                        ? '2px solid #8C1515'
                        : hasNotes
                        ? '1px solid rgba(140, 21, 21, 0.22)'
                        : '1px solid var(--border-color, rgba(0,0,0,0.07))',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      boxShadow: isSelectedForInspector && studyMode === 'research' ? '0 4px 18px rgba(140, 21, 21, 0.1)' : 'none'
                    }}
                  >
                    {/* Segment Header Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}>
                      {/* Segment Identifier */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: '0.74rem',
                          color: 'var(--text-muted)',
                          background: 'var(--bg-main)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color, rgba(0,0,0,0.08))'
                        }}>
                          {segment.segmentId}
                        </span>

                        {studyMode === 'research' && segment.variant && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(37, 99, 235, 0.1)',
                            color: '#2563EB'
                          }}>
                            Var.
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Research Inspector Trigger */}
                        {studyMode === 'research' && (
                          <button
                            onClick={() => handleInspectSegment(segment)}
                            title="Inspect in Research Apparatus"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: isSelectedForInspector ? '#8C1515' : 'transparent',
                              border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                              color: isSelectedForInspector ? '#FFFFFF' : 'var(--text-muted)',
                              fontSize: '0.76rem',
                              fontWeight: '600',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Sliders size={12} />
                            <span>Inspect</span>
                          </button>
                        )}

                        {/* Scholarly button (Reader mode) */}
                        {studyMode === 'reader' && segment.hasScholarlyExtras && showScholarlyNotes && (
                          <button
                            onClick={() => toggleScholarlyRow(segment.segmentId)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: isScholarlyOpen ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                              border: '1px solid rgba(37, 99, 235, 0.25)',
                              color: '#2563EB',
                              fontSize: '0.74rem',
                              fontWeight: '600',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Info size={12} />
                            <span>Scholarly</span>
                            {isScholarlyOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                          </button>
                        )}

                        {/* Cite Segment */}
                        <button
                          onClick={() => handleOpenCitation(segment)}
                          title="Cite this segment"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            background: 'transparent',
                            border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
                            color: 'var(--text-muted)',
                            fontSize: '0.74rem',
                            fontWeight: '600',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Quote size={11} />
                        </button>

                        {/* Note Modal Trigger */}
                        <button
                          onClick={() => openNoteModal(segment)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: hasNotes ? 'rgba(140, 21, 21, 0.08)' : 'transparent',
                            border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                            color: hasNotes ? '#8C1515' : 'var(--text-muted)',
                            fontSize: '0.76rem',
                            fontWeight: '600',
                            padding: '3px 9px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          <Plus size={12} />
                          <span>{hasNotes ? 'Note +' : 'Note'}</span>
                        </button>
                      </div>
                    </div>

                    {/* CONTENT BODY: Parallel Columns vs Interlinear */}
                    {studyMode === 'research' && layoutMode === 'parallel' ? (
                      /* PARALLEL DUAL COLUMN LAYOUT */
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                        gap: '20px',
                        alignItems: 'start'
                      }}>
                        {/* Left: Canonical Root Pali */}
                        <div style={{
                          paddingRight: '14px',
                          borderRight: '1px solid var(--border-color, rgba(0,0,0,0.08))'
                        }}>
                          <div style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            color: '#8C1515',
                            letterSpacing: '0.06em',
                            marginBottom: '6px'
                          }}>
                            Layer 1 · Canonical Root (Pāli)
                          </div>
                          {renderPaliTokens(segment.rootPali, segment)}
                        </div>

                        {/* Right: Bilara Translations (Sinhala & English) */}
                        <div>
                          <div style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            letterSpacing: '0.06em',
                            marginBottom: '6px'
                          }}>
                            Layer 2 · Scholarly Translations
                          </div>
                          {segment.translationSi && (
                            <div style={{
                              fontSize: '1rem',
                              color: 'var(--text-main)',
                              lineHeight: 1.55,
                              marginBottom: '6px'
                            }}>
                              {segment.translationSi}
                            </div>
                          )}
                          {segment.translationEn && (
                            <div style={{
                              fontSize: '0.92rem',
                              color: 'var(--text-muted)',
                              fontStyle: 'italic',
                              lineHeight: 1.5
                            }}>
                              {segment.translationEn}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* INTERLINEAR (STACKED) LAYOUT */
                      <div>
                        {/* Layer 1: Canonical Pali Text */}
                        {showPali && (
                          <div style={{ marginBottom: '6px' }}>
                            {renderPaliTokens(segment.rootPali, segment)}
                          </div>
                        )}

                        {/* Layer 2: Scholarly Translations */}
                        {(translationLang === 'both' || translationLang === 'si') && segment.translationSi && (
                          <div style={{
                            fontSize: '1.02rem',
                            color: 'var(--text-main)',
                            lineHeight: 1.55,
                            marginBottom: '4px'
                          }}>
                            {segment.translationSi}
                          </div>
                        )}

                        {(translationLang === 'both' || translationLang === 'en') && segment.translationEn && (
                          <div style={{
                            fontSize: '0.94rem',
                            color: 'var(--text-muted)',
                            fontStyle: 'italic',
                            lineHeight: 1.5,
                            marginBottom: '4px'
                          }}>
                            {segment.translationEn}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Research Apparatus in stream if enabled */}
                    {studyMode === 'research' && showVariantsInStream && segment.variant && (
                      <div style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: 'rgba(37, 99, 235, 0.04)',
                        border: '1px solid rgba(37, 99, 235, 0.15)',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)'
                      }}>
                        <strong style={{ color: '#2563EB' }}>Apparatus (Variants): </strong> {segment.variant}
                      </div>
                    )}

                    {/* Reader Mode Scholarly Drawer */}
                    {studyMode === 'reader' && (
                      <AnimatePresence>
                        {isScholarlyOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                              overflow: 'hidden',
                              marginTop: '10px',
                              padding: '12px 14px',
                              borderRadius: '8px',
                              background: 'rgba(37, 99, 235, 0.04)',
                              border: '1px solid rgba(37, 99, 235, 0.15)',
                              fontSize: '0.85rem'
                            }}
                          >
                            <div style={{ fontWeight: '700', color: '#2563EB', marginBottom: '6px', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                              Scholarly Apparatus & Commentary
                            </div>

                            {segment.comment && (
                              <div style={{ marginBottom: '6px', color: 'var(--text-main)' }}>
                                <strong>Commentary (Bhikkhu Sujato): </strong>
                                <span dangerouslySetInnerHTML={{ __html: segment.comment }} />
                              </div>
                            )}

                            {segment.variant && (
                              <div style={{ marginBottom: '6px', color: 'var(--text-muted)' }}>
                                <strong>Textual Variants: </strong> {segment.variant}
                              </div>
                            )}

                            {segment.reference && (
                              <div style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                                <strong>Editions / Cross-refs: </strong> {segment.reference}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}

                    {/* Layer 3: Stand-off Study Notes Margin / Badges */}
                    {showPersonalNotes && hasNotes && (
                      <div style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px dashed rgba(140, 21, 21, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        {notesForSegment.map((anno) => {
                          const qBody = anno.body?.find(b => b.purpose === 'question') || {};
                          const noteBody = anno.body?.find(b => b.purpose === 'study_note' || b.purpose === 'reflection') || {};
                          const catKey = qBody.category || noteBody.category || 'reflection';
                          const cat = NOTE_CATEGORIES[catKey] || NOTE_CATEGORIES.reflection;

                          return (
                            <div
                              key={anno.id}
                              onClick={() => openNoteModal(segment, anno)}
                              style={{
                                padding: '10px 14px',
                                borderRadius: '8px',
                                background: cat.bg,
                                border: `1px solid ${cat.border}`,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: '12px'
                              }}
                            >
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                  <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    color: cat.color
                                  }}>
                                    {cat.label}
                                  </span>
                                  <span style={{ opacity: 0.4 }}>•</span>
                                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                    {anno.provenance?.visibility === 'private' ? 'Private' : 'Submitted'}
                                  </span>
                                </div>

                                <div style={{ fontWeight: '600', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                                  {qBody.title || noteBody.title || anno.target?.canonicalQuote}
                                </div>

                                {(noteBody.content || qBody.content) && (
                                  <div style={{
                                    fontSize: '0.84rem',
                                    color: 'var(--text-muted)',
                                    marginTop: '2px',
                                    lineHeight: 1.45
                                  }}>
                                    {(noteBody.content || qBody.content).slice(0, 140)}...
                                  </div>
                                )}
                              </div>

                              <span style={{
                                fontSize: '0.76rem',
                                color: cat.color,
                                fontWeight: '600',
                                flexShrink: 0
                              }}>
                                Edit
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* RIGHT: Docked Research Inspector Panel (Research Mode) */}
        {studyMode === 'research' && isInspectorOpen && (
          <div style={{
            width: '390px',
            flexShrink: 0,
            position: 'sticky',
            top: '120px',
            maxHeight: 'calc(100vh - 140px)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
            borderRadius: '14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <ResearchInspector
              activeSegment={activeSegmentForInspector}
              sutta={currentSutta}
              selectedPaliWord={selectedPaliWord}
              onSelectPaliWord={setSelectedPaliWord}
              annotations={activeSegmentForInspector ? suttaAnnotations[activeSegmentForInspector.segmentId] || [] : []}
              onOpenNoteModal={openNoteModal}
              onOpenCitationModal={handleOpenCitation}
              onClose={() => setIsInspectorOpen(false)}
            />
          </div>
        )}

      </div>

      {/* Stand-off Academic Note Modal */}
      <AcademicNoteModal
        isOpen={activeNoteModal.isOpen}
        onClose={() => setActiveNoteModal({ isOpen: false, segment: null, existingAnnotation: null })}
        segment={activeNoteModal.segment}
        sutta={currentSutta}
        existingAnnotation={activeNoteModal.existingAnnotation}
        onSaved={() => {
          if (suttaId) loadAnnotations(suttaId);
        }}
      />

      {/* Academic Citation Modal */}
      <AcademicCitationModal
        isOpen={citationModal.isOpen}
        onClose={() => setCitationModal({ isOpen: false, activeSegment: null })}
        sutta={currentSutta}
        activeSegment={citationModal.activeSegment}
      />

    </div>
  );
}
