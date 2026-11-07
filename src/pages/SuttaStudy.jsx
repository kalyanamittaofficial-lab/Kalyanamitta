import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ArrowLeft, 
  Search, 
  FileText, 
  HelpCircle, 
  Compass, 
  Layers, 
  MessageSquare, 
  Bookmark, 
  Info, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Plus, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { getAvailableSuttas, getSuttaData } from '../services/bilaraService';
import { getAnnotationsBySutta, NOTE_CATEGORIES } from '../services/studyRoadmapStore';
import AcademicNoteModal from '../components/SuttaStudy/AcademicNoteModal';

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

  // Layer Toggles
  const [showPali, setShowPali] = useState(true);
  const [translationLang, setTranslationLang] = useState('both'); // 'si' | 'en' | 'both' | 'none'
  const [showScholarlyNotes, setShowScholarlyNotes] = useState(true);
  const [showPersonalNotes, setShowPersonalNotes] = useState(true);

  // Annotations state
  const [suttaAnnotations, setSuttaAnnotations] = useState({});
  const [activeModalData, setActiveModalData] = useState({
    isOpen: false,
    segment: null,
    existingAnnotation: null
  });

  // Expanded scholarly rows
  const [expandedScholarly, setExpandedScholarly] = useState({});

  // 1. Load catalog
  useEffect(() => {
    getAvailableSuttas().then(list => setSuttaList(list));
  }, []);

  // 2. Load active sutta when route param changes
  useEffect(() => {
    const activeId = suttaId || (suttaList.length > 0 ? null : null);
    if (!activeId) {
      setCurrentSutta(null);
      return;
    }

    setIsLoadingSutta(true);
    setErrorMsg(null);

    getSuttaData(activeId)
      .then(data => {
        setCurrentSutta(data);
        loadAnnotations(activeId);
        setIsLoadingSutta(false);
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
    setActiveModalData({
      isOpen: true,
      segment,
      existingAnnotation: existingAnno
    });
  };

  // Calculate total notes in this sutta
  const totalNotesInSutta = Object.values(suttaAnnotations).reduce((acc, curr) => acc + curr.length, 0);

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
      <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '10vh 5vw 120px 5vw' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#8C1515',
              background: 'rgba(140, 21, 21, 0.08)',
              padding: '4px 10px',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <Layers size={14} />
              <span>3-Layer Canonical Sutta Study Workspace</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: '700',
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-main)',
              marginBottom: '12px',
              lineHeight: 1.15
            }}>
              සූත්‍ර අධ්‍යයන කේන්ද්‍රය (Sutta Study)
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '850px'
            }}>
              SuttaCentral Bilara දත්ත පදනම් කරගත්, මුල් ත්‍රිපිටක පාඨය (Layer 1), විද්වත් පරිවර්තන (Layer 2) සහ පෞද්ගලික අධ්‍යයන සටහන් (Layer 3) එකට විමසිය හැකි ශාස්ත්‍රීය අධ්‍යයන අවකාශය.
            </p>

            {/* Design Philosophy Banner */}
            <div style={{
              marginTop: '20px',
              padding: '14px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(140, 21, 21, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)',
              border: '1px solid rgba(140, 21, 21, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <ShieldCheck size={26} color="#8C1515" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#8C1515' }}>
                  "The Dhamma remains the source. The roadmap records the journey of studying it. Neither replaces the other."
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  ධර්මය ඒ ආකාරයෙන්ම පවතී. අපි සටහන් කරන්නේ එය අධ්‍යයනය කළ ගමනයි. ඒ ගමන කිසිවිටෙක ධර්මයට ආදේශයක් නොවෙයි.
                </div>
              </div>
            </div>
          </div>

          {/* Quick link to Roadmap */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{
              position: 'relative',
              flex: '1',
              minWidth: '280px',
              maxWidth: '450px'
            }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                placeholder="සූත්‍ර නාමයක් හෝ සටහනක් සොයන්න..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 16px 11px 40px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <Link
              to="/roadmap"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                background: '#8C1515',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.92rem',
                boxShadow: '0 4px 14px rgba(140, 21, 21, 0.25)'
              }}
            >
              <Compass size={18} />
              <span>මගේ අධ්‍යයන ගමන්මඟ (Personal Roadmap)</span>
            </Link>
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
                onClick={() => navigate(`/sutta/${sutta.id}`)}
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

  // SUTTA SEGMENT STUDY WORKSPACE VIEW
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: '120px' }}>
      
      {/* Sticky Workspace Header */}
      <div style={{
        position: 'sticky',
        top: '60px',
        zIndex: 50,
        background: 'var(--bg-card, #FFFFFF)',
        borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        padding: '12px 5vw'
      }}>
        <div style={{
          maxWidth: '1200px',
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
              onClick={() => navigate('/sutta')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                background: 'transparent',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>සූත්‍ර ලැයිස්තුව</span>
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.2rem',
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
                  {suttaId.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {currentSutta?.titlePali} • {currentSutta?.segments?.length || 0} Segments
              </div>
            </div>
          </div>

          {/* Layer View Toggles */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {/* Layer 1 Toggle */}
            <button
              onClick={() => setShowPali(!showPali)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: showPali ? '1px solid #8C1515' : '1px solid var(--border-color, rgba(0,0,0,0.12))',
                background: showPali ? 'rgba(140, 21, 21, 0.08)' : 'transparent',
                color: showPali ? '#8C1515' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <span>L1: පාලි පෙළ</span>
              {showPali ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>

            {/* Layer 2 Language Selector */}
            <select
              value={translationLang}
              onChange={(e) => setTranslationLang(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.15))',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <option value="both">L2: සිංහල + English</option>
              <option value="si">L2: සිංහල පමණක්</option>
              <option value="en">L2: English (Sujato)</option>
              <option value="none">L2: සඟවන්න</option>
            </select>

            {/* Layer 2 Scholarly variants toggle */}
            <button
              onClick={() => setShowScholarlyNotes(!showScholarlyNotes)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: showScholarlyNotes ? '1px solid #2563EB' : '1px solid var(--border-color, rgba(0,0,0,0.12))',
                background: showScholarlyNotes ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                color: showScholarlyNotes ? '#2563EB' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Info size={13} />
              <span>විද්වත් විවරණ (Scholarly)</span>
            </button>

            {/* Layer 3 Roadmap Button */}
            <Link
              to="/roadmap"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                background: '#8C1515',
                color: '#FFFFFF',
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

      {/* Main Reading Container */}
      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 5vw' }}>
        
        {/* Academic Disclaimer Header */}
        <div style={{
          padding: '14px 18px',
          borderRadius: '10px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={18} color="#8C1515" />
            <span style={{ color: 'var(--text-muted)' }}>
              <strong>Layer 1 & 2 Canonical Integrity: </strong>
              මුල් පෙළ පාඨය ස්ථාවරව පවතී. ඔබගේ පෞද්ගලික සටහන් Layer 3 (Stand-off) ලෙස පමණක් පවත්වා ගැනේ.
            </span>
          </div>
          <span style={{
            fontSize: '0.78rem',
            color: '#8C1515',
            fontWeight: '600'
          }}>
            MS Tipiṭaka · Bilara Data
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
              const isScholarlyOpen = Boolean(expandedScholarly[segment.segmentId]);

              // If it's a heading segment (major === 0)
              if (segment.isHeading) {
                return (
                  <div
                    key={segment.segmentId}
                    style={{
                      textAlign: 'center',
                      padding: '24px 0 12px 0',
                      borderBottom: '2px solid rgba(140, 21, 21, 0.15)',
                      marginBottom: '16px'
                    }}
                  >
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
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
                      <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                        {segment.translationSi || segment.translationEn}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={segment.segmentId}
                  id={segment.segmentId}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: hasNotes ? 'rgba(140, 21, 21, 0.02)' : 'var(--bg-card)',
                    border: hasNotes ? '1px solid rgba(140, 21, 21, 0.22)' : '1px solid var(--border-color, rgba(0,0,0,0.06))',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    transition: 'border-color 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {/* Segment Top Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    {/* Segment Identifier */}
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      background: 'var(--bg-main)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color, rgba(0,0,0,0.08))'
                    }}>
                      {segment.segmentId}
                    </span>

                    {/* Actions on this segment */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Scholarly extras indicator button */}
                      {segment.hasScholarlyExtras && showScholarlyNotes && (
                        <button
                          onClick={() => toggleScholarlyRow(segment.segmentId)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: isScholarlyOpen ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                            border: '1px solid rgba(37, 99, 235, 0.25)',
                            color: '#2563EB',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Info size={12} />
                          <span>Scholarly</span>
                          {isScholarlyOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      )}

                      {/* Add Note Button */}
                      <button
                        onClick={() => openNoteModal(segment)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: hasNotes ? 'rgba(140, 21, 21, 0.08)' : 'transparent',
                          border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                          color: hasNotes ? '#8C1515' : 'var(--text-muted)',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={13} />
                        <span>{hasNotes ? 'සටහනක් එක්කරන්න' : 'Note'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Layer 1: Canonical Pali Text */}
                  {showPali && (
                    <div style={{
                      fontFamily: 'var(--font-pali, serif)',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--text-main)',
                      lineHeight: 1.6,
                      marginBottom: '6px'
                    }}>
                      {segment.rootPali}
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

                  {/* Layer 2: Scholarly Drawer (Commentary, Variants, References) */}
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
                        <div style={{ fontWeight: '700', color: '#2563EB', marginBottom: '6px', fontSize: '0.78rem', textTransform: 'uppercase' }}>
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
                        const qBody = anno.body.find(b => b.purpose === 'question') || {};
                        const noteBody = anno.body.find(b => b.purpose === 'study_note' || b.purpose === 'reflection') || {};
                        const catKey = qBody.category || 'reflection';
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
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {anno.provenance?.visibility === 'private' ? 'Private' : 'Submitted'}
                                </span>
                              </div>

                              <div style={{ fontWeight: '600', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                                {qBody.title || noteBody.title || anno.target?.canonicalQuote}
                              </div>

                              {(noteBody.content || qBody.content) && (
                                <div style={{
                                  fontSize: '0.85rem',
                                  color: 'var(--text-muted)',
                                  marginTop: '2px',
                                  lineHeight: 1.45
                                }}>
                                  {(noteBody.content || qBody.content).slice(0, 140)}...
                                </div>
                              )}
                            </div>

                            <span style={{
                              fontSize: '0.78rem',
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

      {/* Stand-off Academic Note Modal */}
      <AcademicNoteModal
        isOpen={activeModalData.isOpen}
        onClose={() => setActiveModalData({ isOpen: false, segment: null, existingAnnotation: null })}
        segment={activeModalData.segment}
        sutta={currentSutta}
        existingAnnotation={activeModalData.existingAnnotation}
        onSaved={() => {
          if (suttaId) loadAnnotations(suttaId);
        }}
      />

    </div>
  );
}
