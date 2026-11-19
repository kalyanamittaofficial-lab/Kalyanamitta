import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Highlighter,
  FileText,
  Search,
  Trash2,
  ArrowRight,
  Download,
  BookOpen,
  Network
} from 'lucide-react';
import { addAnnotationToKnowledgeMap } from '../services/knowledgeMapStore';
import {
  getRoadmapItems,
  deleteRoadmapItem,
  exportRoadmapAsMarkdown,
  getAnnotationSummary,
  NOTE_CATEGORIES
} from '../services/studyRoadmapStore';
import {
  getAllHighlights,
  removeHighlight,
  HIGHLIGHT_COLORS
} from '../services/highlightStore';

export default function PersonalRoadmap() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('highlights'); // 'highlights' | 'notes'
  const [highlights, setHighlights] = useState(() => getAllHighlights());
  const [notes, setNotes] = useState(() => getRoadmapItems());
  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState('all');

  useEffect(() => {
    const refreshHighlights = () => setHighlights(getAllHighlights());
    const refreshNotes = () => setNotes(getRoadmapItems());
    window.addEventListener('labHighlightsUpdated', refreshHighlights);
    window.addEventListener('studyRoadmapUpdated', refreshNotes);
    return () => {
      window.removeEventListener('labHighlightsUpdated', refreshHighlights);
      window.removeEventListener('studyRoadmapUpdated', refreshNotes);
    };
  }, []);

  const q = searchQuery.trim().toLowerCase();

  const filteredHighlights = highlights.filter(hl => {
    if (colorFilter !== 'all' && hl.color !== colorFilter) return false;
    if (!q) return true;
    return (
      hl.suttaTitle?.toLowerCase().includes(q) ||
      hl.sinh?.toLowerCase().includes(q) ||
      hl.pali?.toLowerCase().includes(q)
    );
  });

  const filteredNotes = notes.filter(n => {
    if (!q) return true;
    const summary = getAnnotationSummary(n);
    return (
      summary?.title?.toLowerCase().includes(q) ||
      summary?.content?.toLowerCase().includes(q) ||
      n.target?.source?.toLowerCase().includes(q) ||
      n.target?.suttaTitleSinhala?.toLowerCase().includes(q) ||
      n.target?.canonicalQuote?.toLowerCase().includes(q) ||
      n.target?.translationQuote?.toLowerCase().includes(q)
    );
  });

  const handleExportMarkdown = () => {
    const md = exportRoadmapAsMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kalyanamitta-study-notes-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabStyle = (active) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '8px 16px',
    borderRadius: '999px',
    border: `1px solid ${active ? 'var(--lab-accent)' : 'var(--lab-border)'}`,
    background: active ? 'var(--lab-accent-soft)' : 'var(--lab-bg-elevated)',
    color: active ? 'var(--lab-accent)' : 'var(--lab-text-muted)',
    fontSize: '0.86rem',
    fontWeight: '600',
    cursor: 'pointer'
  });

  return (
    <div className="km-lab-page">
      {/* Top Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportMarkdown}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 15px',
              borderRadius: '999px',
              border: '1px solid var(--lab-border)',
              background: 'var(--lab-bg-elevated)',
              color: 'var(--lab-text)',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Download size={14} />
            <span>Export Notes</span>
          </button>

          <Link
            to="/lab/sutta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '999px',
              background: 'var(--lab-accent)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: '600'
            }}
          >
            <BookOpen size={14} />
            <span>Open Reader</span>
          </Link>
        </div>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('highlights')} style={tabStyle(activeTab === 'highlights')}>
            <Highlighter size={15} />
            <span>Highlights ({highlights.length})</span>
          </button>
          <button onClick={() => setActiveTab('notes')} style={tabStyle(activeTab === 'notes')}>
            <FileText size={15} />
            <span>Study Notes ({notes.length})</span>
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 260px', maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="සොයන්න..."
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '999px',
              border: '1px solid var(--lab-border)',
              background: 'var(--lab-bg-elevated)',
              color: 'var(--lab-text)',
              fontSize: '0.86rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Color Filter for Highlights */}
      {activeTab === 'highlights' && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <button
            onClick={() => setColorFilter('all')}
            style={{
              padding: '5px 12px',
              borderRadius: '999px',
              border: `1px solid ${colorFilter === 'all' ? 'var(--lab-accent)' : 'var(--lab-border)'}`,
              background: colorFilter === 'all' ? 'var(--lab-accent-soft)' : 'transparent',
              color: colorFilter === 'all' ? 'var(--lab-accent)' : 'var(--lab-text-muted)',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            All Colors
          </button>
          {Object.values(HIGHLIGHT_COLORS).map(c => (
            <button
              key={c.id}
              onClick={() => setColorFilter(c.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '999px',
                border: `1px solid ${colorFilter === c.id ? c.dot : 'var(--lab-border)'}`,
                background: colorFilter === c.id ? c.bgVar : 'transparent',
                color: 'var(--lab-text)',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'var(--font-sinhala)'
              }}
            >
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: c.dot }} />
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Highlights List */}
      {activeTab === 'highlights' ? (
        filteredHighlights.length === 0 ? (
          <div className="km-lab-card" style={{ padding: '44px 24px', textAlign: 'center', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
            Highlight කළ කොටස් හමු නොවීය. සූත්‍ර කියවනයේදී වර්ණ තිත් ක්ලික් කර Highlight කරන්න.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredHighlights.map(hl => {
              const colorObj = HIGHLIGHT_COLORS[hl.color] || HIGHLIGHT_COLORS.amber;
              return (
                <div
                  key={hl.id}
                  className="km-lab-card"
                  style={{
                    padding: '18px 20px',
                    background: colorObj.bgVar,
                    borderLeft: `4px solid ${colorObj.dot}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)' }}>
                      {hl.suttaTitle}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => navigate(`/lab/sutta/${hl.suttaKey}`)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          border: '1px solid var(--lab-border)',
                          background: 'var(--lab-bg-elevated)',
                          color: 'var(--lab-accent)',
                          fontSize: '0.76rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <span>Open</span>
                        <ArrowRight size={12} />
                      </button>
                      <button
                        onClick={() => removeHighlight(hl.segmentId)}
                        title="Remove highlight"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--lab-text-muted)',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {hl.sinh && (
                    <div style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.96rem', lineHeight: 1.75, color: 'var(--lab-text)', marginBottom: hl.pali ? '6px' : 0 }}>
                      {hl.sinh}
                    </div>
                  )}
                  {hl.pali && (
                    <div style={{ fontFamily: 'var(--font-sinhala)', fontSize: '0.86rem', lineHeight: 1.65, color: 'var(--lab-text-muted)' }}>
                      {hl.pali}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        filteredNotes.length === 0 ? (
          <div className="km-lab-card" style={{ padding: '44px 24px', textAlign: 'center', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
            සටහන් හමු නොවීය. සූත්‍ර කියවනයේ "+ සටහනක්" බොත්තමෙන් සටහන් එක් කරන්න.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotes.map(note => {
              const summary = getAnnotationSummary(note);
              const catCfg = NOTE_CATEGORIES[summary?.category] || NOTE_CATEGORIES.reflection;
              const quote = note.target?.translationQuote || note.target?.canonicalQuote || note.target?.selector?.exact;
              return (
              <div key={note.id} className="km-lab-card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      color: catCfg.color || 'var(--lab-accent)',
                      background: catCfg.bg || 'var(--lab-accent-soft)',
                      padding: '2px 9px',
                      borderRadius: '999px'
                    }}>
                      {catCfg.shortLabel || 'Note'}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)' }}>
                      {note.target?.suttaTitleSinhala || note.target?.suttaTitlePali || note.target?.source}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--lab-text-muted)', fontFamily: 'monospace' }}>
                      {note.target?.selector?.value || note.target?.source}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => {
                        addAnnotationToKnowledgeMap(note);
                        navigate('/lab/map');
                      }}
                      title="Send to Knowledge Map"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid var(--lab-border)',
                        background: 'var(--lab-bg-subtle)',
                        color: 'var(--lab-text)',
                        fontSize: '0.76rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <Network size={12} />
                      <span>Map</span>
                    </button>
                    <button
                      onClick={() => navigate(`/lab/sutta/${note.target?.source}`)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid var(--lab-border)',
                        background: 'var(--lab-bg-subtle)',
                        color: 'var(--lab-accent)',
                        fontSize: '0.76rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <span>Open</span>
                      <ArrowRight size={12} />
                    </button>
                    <button
                      onClick={() => deleteRoadmapItem(note.id)}
                      title="Delete note"
                      style={{ background: 'none', border: 'none', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {quote && (
                  <div style={{
                    fontSize: '0.82rem',
                    color: 'var(--lab-text-muted)',
                    fontFamily: 'var(--font-sinhala)',
                    marginBottom: '8px',
                    paddingLeft: '10px',
                    borderLeft: '2px solid var(--lab-border)'
                  }}>
                    “{quote}”
                  </div>
                )}

                {summary?.title && (
                  <div style={{ fontSize: '0.94rem', fontWeight: '700', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)', marginBottom: '4px' }}>
                    {summary.title}
                  </div>
                )}

                {summary?.content && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                    {summary.content}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
