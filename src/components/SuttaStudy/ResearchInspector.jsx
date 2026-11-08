import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  FileText, 
  Compass, 
  HelpCircle, 
  GitCompare, 
  Quote, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  Layers
} from 'lucide-react';
import { lookupPaliWord, tokenizePaliText } from '../../services/paliDictionaryService';
import { NOTE_CATEGORIES } from '../../services/studyRoadmapStore';

export default function ResearchInspector({
  activeSegment,
  sutta,
  selectedPaliWord,
  onSelectPaliWord,
  annotations = [],
  onOpenNoteModal,
  onOpenCitationModal,
  onClose
}) {
  const [inspectorTab, setInspectorTab] = useState('lexicon'); // 'lexicon' | 'apparatus' | 'notes' | 'citation'
  const [copiedCite, setCopiedCite] = useState(false);

  if (!activeSegment) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '300px'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(140, 21, 21, 0.08)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <Compass size={24} />
        </div>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
          Research Inspector
        </h4>
        <p style={{ fontSize: '0.85rem', maxWidth: '240px', lineHeight: 1.5 }}>
          ඕනෑම පාළි වචනයක් හෝ සූත්‍ර ඛණ්ඩයක් (Segment) තෝරා ශාස්ත්‍රීය විමසුම සහ ශබ්දකෝෂ අර්ථය බලන්න.
        </p>
      </div>
    );
  }

  // Active word lookup
  const currentWordInfo = selectedPaliWord ? lookupPaliWord(selectedPaliWord) : null;
  const tokens = tokenizePaliText(activeSegment.rootPali);

  const segmentNotes = annotations.filter(a => a.target?.selector?.value === activeSegment.segmentId);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-main)',
        borderLeft: '1px solid var(--border-color, rgba(0,0,0,0.1))',
        fontFamily: 'var(--font-sinhala), sans-serif',
        fontSize: '0.88rem'
      }}
    >
      {/* Top Header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'var(--primary)',
              color: '#ffffff'
            }}
          >
            {activeSegment.segmentId}
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Segment Inspector
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          background: 'var(--bg-main)',
          padding: '4px 8px'
        }}
      >
        {[
          { id: 'lexicon', label: 'Pali Lexicon', icon: BookOpen },
          { id: 'apparatus', label: 'Apparatus', icon: Layers },
          { id: 'notes', label: `Notes (${segmentNotes.length})`, icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = inspectorTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setInspectorTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 10px',
                border: 'none',
                background: 'transparent',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        {/* TAB 1: PALI LEXICON & MORPHOLOGY */}
        {inspectorTab === 'lexicon' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Active Segment Tokens (Click to inspect)
              </span>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginTop: '8px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.06))'
                }}
              >
                {tokens.map(token => {
                  if (!token.isWord) {
                    return <span key={token.id} style={{ color: 'var(--text-muted)' }}>{token.raw}</span>;
                  }
                  const isSelected = selectedPaliWord?.toLowerCase() === token.clean?.toLowerCase();
                  return (
                    <button
                      key={token.id}
                      onClick={() => onSelectPaliWord(token.clean)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color, rgba(0,0,0,0.1))',
                        background: isSelected ? 'var(--primary)' : 'var(--bg-main)',
                        color: isSelected ? '#ffffff' : 'var(--text-main)',
                        fontSize: '0.86rem',
                        fontFamily: 'var(--font-serif)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {token.raw}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Word Analysis Card */}
            {currentWordInfo ? (
              <div
                style={{
                  borderRadius: '12px',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
                  background: 'var(--bg-card)',
                  padding: '16px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                    {currentWordInfo.pali}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: 'rgba(140, 21, 21, 0.08)',
                      color: 'var(--primary)'
                    }}
                  >
                    {currentWordInfo.pos}
                  </span>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                    Root / Etymology:
                  </span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                    {currentWordInfo.root}
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                    English Scholarly Meaning:
                  </span>
                  <div style={{ color: 'var(--text-main)', lineHeight: 1.45, fontSize: '0.88rem' }}>
                    {currentWordInfo.meaningEn}
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                    සිංහල අර්ථ විවරණය:
                  </span>
                  <div style={{ color: 'var(--text-main)', lineHeight: 1.45, fontSize: '0.88rem' }}>
                    {currentWordInfo.meaningSi}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color, rgba(0,0,0,0.06))', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Source: {currentWordInfo.source}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ඉහත සඳහන් ඕනෑම පාළි වචනයක් මත ක්ලික් කර ශබ්දකෝෂ අර්ථය සහ ධාතු ප්‍රකෘතිය විමසන්න.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APPARATUS & MANUSCRIPTS */}
        {inspectorTab === 'apparatus' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* References */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Canonical Concordance & Editions
              </span>
              <div
                style={{
                  marginTop: '6px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.06))'
                }}
              >
                <div style={{ fontSize: '0.82rem', marginBottom: '4px' }}>
                  <strong>Sutta:</strong> {sutta?.titlePali} ({sutta?.canonicalRef})
                </div>
                <div style={{ fontSize: '0.82rem', marginBottom: '4px' }}>
                  <strong>Segment UID:</strong> <code style={{ fontFamily: 'monospace' }}>{activeSegment.segmentId}</code>
                </div>
                {activeSegment.reference ? (
                  <div style={{ fontSize: '0.82rem' }}>
                    <strong>Concordance Codes:</strong>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px' }}>
                      {activeSegment.reference}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Standard Mahāsaṅgīti Tipiṭaka edition concordance.
                  </div>
                )}
              </div>
            </div>

            {/* Variants */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Textual Variant Apparatus (පෙළ ප්‍රභේද)
              </span>
              {activeSegment.variant ? (
                <div
                  style={{
                    marginTop: '6px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(217, 119, 6, 0.08)',
                    border: '1px solid rgba(217, 119, 6, 0.25)',
                    color: 'var(--text-main)'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: '#B45309' }}>
                    Manuscript Variations Detected:
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    {activeSegment.variant}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Key: <strong>bj</strong> = Buddha Jayanti (SL), <strong>pts</strong> = Pali Text Society, <strong>sya</strong> = Siamese/Thai, <strong>mr</strong> = Burmese.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: '6px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  මෙම සූත්‍ර ඛණ්ඩය සඳහා ප්‍රධාන පෙළපොත් අතර විචල්‍යතා (Variant readings) වාර්තා වී නොමැත. පෙළ ඒකාකාරීව පවතී.
                </div>
              )}
            </div>

            {/* Commentary / Scholarly Notes */}
            {activeSegment.comment && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  Scholarly Commentary (විද්වත් අර්ථ විවරණ)
                </span>
                <div
                  style={{
                    marginTop: '6px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(37, 99, 235, 0.08)',
                    border: '1px solid rgba(37, 99, 235, 0.2)',
                    fontSize: '0.85rem',
                    lineHeight: 1.5
                  }}
                >
                  {activeSegment.comment}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LAYER 3 ROADMAP NOTES */}
        {inspectorTab === 'notes' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Study Annotations on Segment
              </span>
              <button
                onClick={() => onOpenNoteModal(activeSegment)}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  background: 'var(--primary)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                + Add Note
              </button>
            </div>

            {segmentNotes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {segmentNotes.map(anno => {
                  const qBody = anno.body.find(b => b.purpose === 'question') || {};
                  const noteBody = anno.body.find(b => b.purpose === 'study_note' || b.purpose === 'reflection') || {};
                  const cat = NOTE_CATEGORIES[qBody.category || 'reflection'] || NOTE_CATEGORIES.reflection;

                  return (
                    <div
                      key={anno.id}
                      onClick={() => onOpenNoteModal(activeSegment, anno)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: cat.bg,
                        border: `1px solid ${cat.border}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: cat.color }}>
                          {cat.label}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: cat.color, fontWeight: 600 }}>
                          Edit
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {qBody.title || noteBody.title}
                      </div>
                      {(noteBody.content || qBody.content) && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.45 }}>
                          {noteBody.content || qBody.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                මෙම ඛණ්ඩය සඳහා සටහන් හෝ ප්‍රශ්න තවම එක් කර නැත. ඉහත "+ Add Note" බොත්තමෙන් එක් කරන්න.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Bottom Action */}
      <div
        style={{
          padding: '12px 18px',
          borderTop: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          display: 'flex',
          gap: '8px',
          background: 'var(--bg-secondary)'
        }}
      >
        <button
          onClick={() => onOpenCitationModal(activeSegment)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
            background: 'var(--bg-main)',
            color: 'var(--text-main)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Quote size={14} />
          <span>Cite Segment</span>
        </button>

        <button
          onClick={() => onOpenNoteModal(activeSegment)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--primary)',
            color: '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <FileText size={14} />
          <span>Take Note</span>
        </button>
      </div>
    </div>
  );
}
