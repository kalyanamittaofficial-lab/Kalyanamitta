import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  FileText, 
  GitCompare, 
  Compass, 
  Lock, 
  Globe, 
  Save, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { 
  NOTE_CATEGORIES, 
  MANDATORY_DISCLAIMER, 
  saveRoadmapItem, 
  deleteRoadmapItem 
} from '../../services/studyRoadmapStore';

export default function AcademicNoteModal({ 
  isOpen, 
  onClose, 
  segment, 
  sutta, 
  existingAnnotation = null,
  onSaved 
}) {
  const qBodyInit = existingAnnotation?.body?.find(b => b.purpose === 'question') || {};
  const noteBodyInit = existingAnnotation?.body?.find(b => b.purpose === 'study_note' || b.purpose === 'reflection') || {};
  const srcBodyInit = existingAnnotation?.body?.find(b => b.purpose === 'resource') || {};
  const inqBodyInit = existingAnnotation?.body?.find(b => b.purpose === 'further_inquiry') || {};
  const ytBodyInit = existingAnnotation?.body?.find(b => b.purpose === 'youtube') || {};
  const crossBodyInit = existingAnnotation?.body?.find(b => b.purpose === 'cross_sutta') || {};

  const [selectedCategory, setSelectedCategory] = useState(qBodyInit.category || 'question');
  const [title, setTitle] = useState(qBodyInit.title || noteBodyInit.title || existingAnnotation?.target?.canonicalQuote || '');
  const [studyContent, setStudyContent] = useState(noteBodyInit.content || qBodyInit.content || '');
  const [sources, setSources] = useState(srcBodyInit.content || '');
  const [furtherInquiry, setFurtherInquiry] = useState(inqBodyInit.content || '');
  const [youtubeUrl, setYoutubeUrl] = useState(ytBodyInit.url || '');
  const [youtubeNote, setYoutubeNote] = useState(ytBodyInit.content || '');
  const [crossSuttaRef, setCrossSuttaRef] = useState(crossBodyInit.content || '');
  const [visibility, setVisibility] = useState(existingAnnotation?.provenance?.visibility || 'private'); // 'private' | 'submit_review'
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !segment) return null;

  const currentCategoryConfig = NOTE_CATEGORIES[selectedCategory] || NOTE_CATEGORIES.question;

  const handleSave = () => {
    if (!studyContent.trim() && !title.trim()) {
      alert('කරුණාකර සටහනක් හෝ ප්‍රශ්නයක් ඇතුළත් කරන්න.');
      return;
    }

    setIsSaving(true);

    const bodies = [];

    // Main note body based on category
    bodies.push({
      type: 'TextualBody',
      purpose: selectedCategory === 'question' ? 'question' : 'study_note',
      category: selectedCategory,
      title: title.trim() || segment.rootPali,
      content: studyContent.trim()
    });

    // Optional sources
    if (sources.trim()) {
      bodies.push({
        type: 'TextualBody',
        purpose: 'resource',
        category: 'resource',
        title: 'භාවිත කළ මූලාශ්‍ර',
        content: sources.trim()
      });
    }

    // Optional further inquiry
    if (furtherInquiry.trim()) {
      bodies.push({
        type: 'TextualBody',
        purpose: 'further_inquiry',
        category: 'further_inquiry',
        title: 'තවදුරටත් විමසිය යුතු දේ',
        content: furtherInquiry.trim()
      });
    }

    // Optional YouTube explanatory resource
    if (youtubeUrl.trim()) {
      bodies.push({
        type: 'TextualBody',
        purpose: 'youtube',
        category: 'resource',
        title: 'YouTube පැහැදිලි කිරීම',
        url: youtubeUrl.trim(),
        content: youtubeNote.trim()
      });
    }

    // Optional Cross-Sutta Reference
    if (crossSuttaRef.trim()) {
      bodies.push({
        type: 'TextualBody',
        purpose: 'cross_sutta',
        category: 'comparison',
        title: 'සම්බන්ධිත වෙනත් සූත්‍රය',
        content: crossSuttaRef.trim()
      });
    }

    const itemToSave = {
      id: existingAnnotation?.id,
      created: existingAnnotation?.created,
      action: currentCategoryConfig.actionTag,
      target: {
        source: sutta?.suttaId || segment.suttaId,
        suttaTitlePali: sutta?.titlePali || 'Sutta',
        suttaTitleSinhala: sutta?.titleSinhala || '',
        canonicalRef: sutta?.canonicalRef || sutta?.suttaId,
        selector: {
          type: 'FragmentSelector',
          value: segment.segmentId,
          conformsTo: 'http://suttacentral.net/bilara/segment'
        },
        canonicalQuote: segment.rootPali,
        translationQuote: segment.translationSi || segment.translationEn || ''
      },
      body: bodies,
      provenance: {
        layer: 3,
        visibility,
        reviewStatus: visibility === 'submit_review' ? 'pending_review' : 'unreviewed'
      }
    };

    saveRoadmapItem(itemToSave);
    setIsSaving(false);
    if (onSaved) onSaved(itemToSave);
    onClose();
  };

  const handleDelete = () => {
    if (existingAnnotation && window.confirm('මෙම සටහන මකා දැමීමට ඔබට විශ්වාසද?')) {
      deleteRoadmapItem(existingAnnotation.id);
      if (onSaved) onSaved(null);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.72)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          color: 'var(--text-main, #1A1A1A)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
          border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Bar */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-main)'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted, #71717A)'
            }}>
              <span>Layer 3 — Stand-off Academic Note</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{
                fontFamily: 'monospace',
                background: 'rgba(140, 21, 21, 0.08)',
                color: '#8C1515',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.78rem'
              }}>
                {segment.segmentId}
              </span>
            </div>
            <h2 style={{
              margin: '4px 0 0 0',
              fontSize: '1.25rem',
              fontWeight: '700',
              fontFamily: 'var(--font-serif, serif)'
            }}>
              {existingAnnotation ? 'අධ්‍යයන සටහන සංස්කරණය (Edit Study Note)' : 'නව අධ්‍යයන සටහන (New Study Note)'}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              borderRadius: '8px',
              color: 'var(--text-muted, #71717A)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Scroll Area */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          
          {/* Layer 1 & 2 Canonical Reference Lock Notice */}
          <div style={{
            background: 'var(--bg-main, #F8FAFC)',
            border: '1px solid var(--border-color, #E2E8F0)',
            borderRadius: '10px',
            padding: '14px 18px',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: '600',
              color: '#8C1515',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px'
            }}>
              <Lock size={12} />
              <span>Immutable Canonical Anchor (මුල් පෙළ පාඨය)</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-pali, serif)',
              fontSize: '1.08rem',
              fontWeight: '600',
              color: 'var(--text-main, #0F172A)',
              lineHeight: 1.5,
              marginBottom: '4px'
            }}>
              {segment.rootPali}
            </div>
            {(segment.translationSi || segment.translationEn) && (
              <div style={{
                fontSize: '0.92rem',
                color: 'var(--text-muted, #64748B)',
                fontStyle: 'italic',
                lineHeight: 1.45
              }}>
                {segment.translationSi || segment.translationEn}
              </div>
            )}
          </div>

          {/* Note Category Selector */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '10px',
              color: 'var(--text-main)'
            }}>
              Note Category (සටහනේ ස්වභාවය)
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: '8px'
            }}>
              {Object.entries(NOTE_CATEGORIES).map(([key, cat]) => {
                const isSelected = selectedCategory === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedCategory(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: isSelected ? `2px solid ${cat.color}` : '1px solid var(--border-color, rgba(0,0,0,0.1))',
                      background: isSelected ? cat.bg : 'transparent',
                      color: isSelected ? cat.color : 'var(--text-main)',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {key === 'question' && <HelpCircle size={15} />}
                      {key === 'resource' && <BookOpen size={15} />}
                      {key === 'reflection' && <FileText size={15} />}
                      {key === 'comparison' && <GitCompare size={15} />}
                      {key === 'further_inquiry' && <Compass size={15} />}
                    </span>
                    <span>{cat.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title / Question */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '6px',
              color: 'var(--text-main)'
            }}>
              {selectedCategory === 'question' ? 'ප්‍රශ්නය හෝ විමසුම (Main Question / Subject)' : 'සටහනේ මාතෘකාව (Title)'}
            </label>
            <input
              type="text"
              placeholder={
                selectedCategory === 'question'
                  ? 'උදා: "Sakko, Ujū, Suhujū යන පද තුන මෙහි භාවිත වන සන්දර්භය කුමක්ද?"'
                  : 'සටහනේ ප්‍රධාන මාතෘකාව...'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.98rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.15))',
                background: 'var(--bg-main, #FFFFFF)',
                color: 'var(--text-main)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Study Note / Reflection Content */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '6px',
              color: 'var(--text-main)'
            }}>
              {selectedCategory === 'question' ? 'ප්‍රශ්නය පිළිබඳ විස්තරය / පසුබිම' : 'අධ්‍යයන සටහන (Study Note & Evidence)'}
            </label>
            <textarea
              rows={4}
              placeholder="ඔබ ඉගෙනගත් දේ, මතු වූ අර්ථකථන හෝ පාඨමය සාක්ෂි මෙහි සටහන් කරන්න..."
              value={studyContent}
              onChange={(e) => setStudyContent(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '0.95rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.15))',
                background: 'var(--bg-main, #FFFFFF)',
                color: 'var(--text-main)',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                resize: 'vertical'
              }}
            />
          </div>

          {/* Sources Used */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '6px',
              color: 'var(--text-main)'
            }}>
              Sources — උපකාරී වූ මූලාශ්‍ර (විකල්ප)
            </label>
            <input
              type="text"
              placeholder="උදා: Paramatthajotikā (Aṭṭhakathā), Bhikkhu Bodhi Sutta Nipāta translation..."
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.92rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.15))',
                background: 'var(--bg-main, #FFFFFF)',
                color: 'var(--text-main)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Further Inquiry */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '6px',
              color: 'var(--text-main)'
            }}>
              Further Inquiry — තවදුරටත් විමසිය යුතු කරුණු (විකල්ප)
            </label>
            <input
              type="text"
              placeholder="අර්ථය ගැන තවම නිරාකරණය නොවූ හෝ නැවත විමසිය යුතු කරුණු..."
              value={furtherInquiry}
              onChange={(e) => setFurtherInquiry(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.92rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.15))',
                background: 'var(--bg-main, #FFFFFF)',
                color: 'var(--text-main)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Cross-Sutta Reference & YouTube Resource */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
                වෙනත් සූත්‍ර සම්බන්ධතාවක් (Cross-Sutta Ref)
              </label>
              <input
                type="text"
                placeholder="උදා: MN 10 (සතිපට්ඨාන), SN 56.11"
                value={crossSuttaRef}
                onChange={(e) => setCrossSuttaRef(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.15))',
                  background: 'var(--bg-main, #FFFFFF)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
                YouTube දේශනා සබැඳිය (External Resource)
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=... (විකල්ප)"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.15))',
                  background: 'var(--bg-main, #FFFFFF)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {youtubeUrl.trim() && (
            <input
              type="text"
              placeholder="මෙම වීඩියෝව සම්බන්ධ වන ආකාරය / කාල සලකුණ (Timestamp & relevance)..."
              value={youtubeNote}
              onChange={(e) => setYoutubeNote(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px',
                fontSize: '0.88rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.15))',
                background: 'var(--bg-main, #FFFFFF)',
                color: 'var(--text-main)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          )}

          {Array.isArray(existingAnnotation?.revisions) && existingAnnotation.revisions.length > 0 && (
            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.18)', fontSize: '0.8rem' }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>
                පෙර සංශෝධන ({existingAnnotation.revisions.length}) — Previous Revisions Preserved
              </strong>
              {existingAnnotation.revisions.slice(0, 2).map((rev, i) => (
                <div key={i} style={{ color: 'var(--text-muted)', marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                  <span>{new Date(rev.savedAt).toLocaleDateString()}: </span>
                  <span>{rev.content?.slice(0, 90)}...</span>
                </div>
              ))}
            </div>
          )}

          {/* Visibility / Sharing Rules */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '10px',
              color: 'var(--text-main)'
            }}>
              Visibility (ප්‍රදර්ශන සීමාව)
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setVisibility('private')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: visibility === 'private' ? '2px solid #8C1515' : '1px solid var(--border-color, rgba(0,0,0,0.1))',
                  background: visibility === 'private' ? 'rgba(140, 21, 21, 0.06)' : 'transparent',
                  color: visibility === 'private' ? '#8C1515' : 'var(--text-muted)',
                  fontWeight: visibility === 'private' ? '700' : '500',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <Lock size={15} />
                <span>Private — මට පමණයි</span>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('submit_review')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: visibility === 'submit_review' ? '2px solid #2563EB' : '1px solid var(--border-color, rgba(0,0,0,0.1))',
                  background: visibility === 'submit_review' ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  color: visibility === 'submit_review' ? '#2563EB' : 'var(--text-muted)',
                  fontWeight: visibility === 'submit_review' ? '700' : '500',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <Globe size={15} />
                <span>Submit for Review — සමාලෝචනයට</span>
              </button>
            </div>
          </div>

          {/* Real-time Preview with Mandatory Academic Disclaimer */}
          <div style={{
            background: 'var(--bg-card, #FFFFFF)',
            border: '1px dashed var(--border-color, rgba(0,0,0,0.2))',
            borderRadius: '10px',
            padding: '16px',
            marginTop: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)'
              }}>
                Preview (සටහන දිස්වන ආකාරය)
              </span>
              <span style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '12px',
                background: currentCategoryConfig.bg,
                color: currentCategoryConfig.color,
                fontWeight: '600'
              }}>
                {currentCategoryConfig.shortLabel} · {segment.segmentId}
              </span>
            </div>

            <div style={{ fontWeight: '600', fontSize: '0.98rem', marginBottom: '6px', color: 'var(--text-main)' }}>
              {title || '(මාතෘකාව හෝ ප්‍රශ්නය මෙහි දිස්වේ)'}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
              {studyContent || '(ඔබේ අධ්‍යයන සටහන මෙහි දිස්වේ)'}
            </div>

            {/* Mandatory Academic Disclaimer Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 12px',
              background: 'rgba(217, 119, 6, 0.08)',
              border: '1px solid rgba(217, 119, 6, 0.25)',
              borderRadius: '6px',
              fontSize: '0.8rem',
              color: '#B45309',
              lineHeight: 1.45
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Academic Notice: </strong>
                {MANDATORY_DISCLAIMER}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Bar */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-main, #FAFAFA)'
        }}>
          <div>
            {existingAnnotation && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px'
                }}
              >
                <Trash2 size={15} />
                <span>මකා දමන්න (Delete)</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.15))',
                background: 'transparent',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              අවලංගු කරන්න
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 22px',
                borderRadius: '8px',
                border: 'none',
                background: '#8C1515',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(140, 21, 21, 0.25)'
              }}
            >
              <Save size={16} />
              <span>{isSaving ? 'සුරකිමින්...' : 'සටහන සුරකින්න (Save Note)'}</span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
