import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Layers,
  Sparkles,
  Search,
  SlidersHorizontal,
  List,
  LayoutGrid,
  Plus,
  Folder,
  ChevronRight,
  Clock,
  MoreHorizontal,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  Quote,
  Link2,
  Undo2,
  Redo2,
  Tag,
  Network,
  Save,
  Sun,
  Lightbulb,
  ExternalLink,
  Trash2,
  Download,
  Highlighter,
  Check
} from 'lucide-react';
import { addAnnotationToKnowledgeMap, getKnowledgeMaps, getMapNodes } from '../services/knowledgeMapStore';
import {
  getRoadmapItems,
  saveRoadmapItem,
  deleteRoadmapItem,
  exportRoadmapAsMarkdown,
  getAnnotationSummary
} from '../services/studyRoadmapStore';
import { getAllHighlights, removeHighlight } from '../services/highlightStore';
import { getCollections } from '../services/collectionsStore';
import { getRoutineHabits } from '../services/dailyRoutineStore';
import { getPathReflections } from '../services/practiceEcosystemStore';

const NOTE_GROUPS = [
  { id: 'all', label: 'Dhamma Study', categoryMatch: ['reflection', 'resource', 'comparison'] },
  { id: 'practice', label: 'Practice & Discipline', categoryMatch: ['further_inquiry'] },
  { id: 'insights', label: 'Reflections & Insights', categoryMatch: ['question'] },
  { id: 'summaries', label: 'Summaries & Syntheses', categoryMatch: ['comparison', 'resource'] },
  { id: 'journal', label: 'Personal Journal', categoryMatch: ['reflection'] }
];

function formatRelativeTime(iso) {
  if (!iso) return 'Just now';
  const diffMs = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diffMs) || diffMs < 60000) return 'Just now';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function PersonalRoadmap() {
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [leftTab, setLeftTab] = useState('notes'); // 'notes' | 'highlights'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [highlights, setHighlights] = useState(() => getAllHighlights());
  const [notes, setNotes] = useState(() => getRoadmapItems());
  const [collections, setCollections] = useState(() => getCollections());
  const [mapNodes, setMapNodes] = useState(() => getMapNodes(getKnowledgeMaps()[0]?.id));
  const [routineHabits, setRoutineHabits] = useState(() => getRoutineHabits());
  const [insights, setInsights] = useState(() => getPathReflections());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [selectedNoteId, setSelectedNoteId] = useState(() => getRoadmapItems()[0]?.id || null);
  const initialNote = notes.find(n => n.id === selectedNoteId) || notes[0] || null;
  const initialSummary = initialNote ? getAnnotationSummary(initialNote) : null;

  const [draftTitle, setDraftTitle] = useState(
    () => initialSummary?.title || initialNote?.target?.suttaTitleSinhala || initialNote?.target?.source || 'Anicca — Impermanence Notes'
  );
  const [draftSubtitle, setDraftSubtitle] = useState(
    () => initialNote?.target?.canonicalRef || initialNote?.target?.suttaTitlePali || 'Notes on Anicca (Impermanence)'
  );
  const [draftContent, setDraftContent] = useState(
    () => initialSummary?.content || '1. Anicca — Core Contemplation\nAll conditioned phenomena are impermanent. Observe this directly in daily experience rather than merely as theory.\n\n2. Application in Practice\n• Notice thoughts, feelings, and reactions arising and passing.\n• Recognize attachment early and soften the grasp.'
  );
  const [draftTags, setDraftTags] = useState(
    () => (Array.isArray(initialNote?.body?.[0]?.tags) && initialNote.body[0].tags.length > 0
      ? initialNote.body[0].tags
      : ['Anicca', 'Dhamma', 'Insight'])
  );
  const [newTagText, setNewTagText] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Auto-saved');

  useEffect(() => {
    const refreshHighlights = () => setHighlights(getAllHighlights());
    const refreshNotes = () => setNotes(getRoadmapItems());
    const refreshCollections = () => setCollections(getCollections());
    const refreshMap = () => setMapNodes(getMapNodes(getKnowledgeMaps()[0]?.id));
    const refreshRoutine = () => setRoutineHabits(getRoutineHabits());
    const refreshPractice = () => setInsights(getPathReflections());

    window.addEventListener('labHighlightsUpdated', refreshHighlights);
    window.addEventListener('studyRoadmapUpdated', refreshNotes);
    window.addEventListener('labCollectionsUpdated', refreshCollections);
    window.addEventListener('labKnowledgeMapUpdated', refreshMap);
    window.addEventListener('labRoutineUpdated', refreshRoutine);
    window.addEventListener('labPracticeUpdated', refreshPractice);
    return () => {
      window.removeEventListener('labHighlightsUpdated', refreshHighlights);
      window.removeEventListener('studyRoadmapUpdated', refreshNotes);
      window.removeEventListener('labCollectionsUpdated', refreshCollections);
      window.removeEventListener('labKnowledgeMapUpdated', refreshMap);
      window.removeEventListener('labRoutineUpdated', refreshRoutine);
      window.removeEventListener('labPracticeUpdated', refreshPractice);
    };
  }, []);

  const selectedNote = notes.find(n => n.id === selectedNoteId) || notes[0] || null;

  const selectNote = (note) => {
    if (!note) return;
    setSelectedNoteId(note.id);
    const summary = getAnnotationSummary(note);
    setDraftTitle(summary?.title || note.target?.suttaTitleSinhala || note.target?.source || 'Study Note');
    setDraftSubtitle(note.target?.canonicalRef || note.target?.suttaTitlePali || 'Personal Study Note');
    setDraftContent(summary?.content || '');
    setDraftTags(
      Array.isArray(note.body?.[0]?.tags) && note.body[0].tags.length > 0
        ? note.body[0].tags
        : ['Dhamma', 'Study', 'Insight']
    );
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredNotes = notes.filter(n => {
    const summary = getAnnotationSummary(n);
    const cat = summary?.category || 'reflection';
    if (categoryFilter !== 'all' && cat !== categoryFilter) return false;
    if (selectedGroup !== 'all') {
      const grp = NOTE_GROUPS.find(g => g.id === selectedGroup);
      if (grp && !grp.categoryMatch.includes(cat)) return false;
    }
    if (!q) return true;
    return (
      summary?.title?.toLowerCase().includes(q) ||
      summary?.content?.toLowerCase().includes(q) ||
      n.target?.source?.toLowerCase().includes(q) ||
      n.target?.suttaTitleSinhala?.toLowerCase().includes(q)
    );
  });

  const filteredHighlights = highlights.filter(hl => {
    if (!q) return true;
    return (
      hl.suttaTitle?.toLowerCase().includes(q) ||
      hl.sinh?.toLowerCase().includes(q) ||
      hl.pali?.toLowerCase().includes(q)
    );
  });

  const handleCreateNewNote = () => {
    const created = saveRoadmapItem({
      action: 'Study Note',
      target: {
        source: '',
        suttaTitleSinhala: 'New Study Note',
        canonicalRef: 'Personal Note'
      },
      body: [
        {
          type: 'TextualBody',
          category: 'reflection',
          title: 'Untitled Study Note',
          value: '',
          tags: ['Dhamma', 'Note']
        }
      ]
    });
    selectNote(created);
    setLeftTab('notes');
    setStatusMessage('Created new note');
    setTimeout(() => editorRef.current?.focus(), 60);
  };

  const handleSaveCurrentNote = () => {
    const saved = saveRoadmapItem({
      id: selectedNote?.id,
      created: selectedNote?.created,
      action: selectedNote?.action || 'Study Note',
      target: {
        ...(selectedNote?.target || {}),
        suttaTitleSinhala: draftTitle.trim() || 'Study Note',
        canonicalRef: draftSubtitle.trim() || 'Personal Note'
      },
      body: [
        {
          type: 'TextualBody',
          category: selectedNote?.body?.[0]?.category || 'reflection',
          title: draftTitle.trim() || 'Study Note',
          value: draftContent,
          tags: draftTags
        }
      ]
    });
    setSelectedNoteId(saved.id);
    setStatusMessage('Saved just now');
    setTimeout(() => setStatusMessage('Auto-saved'), 2500);
  };

  const insertFormat = (prefix, suffix = '') => {
    const el = editorRef.current;
    if (!el) return;
    const start = el.selectionStart ?? draftContent.length;
    const end = el.selectionEnd ?? draftContent.length;
    const selected = draftContent.slice(start, end);
    const next = `${draftContent.slice(0, start)}${prefix}${selected}${suffix}${draftContent.slice(end)}`;
    setDraftContent(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 10);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const clean = newTagText.trim();
    if (!clean || draftTags.includes(clean)) {
      setNewTagText('');
      setShowAddTag(false);
      return;
    }
    setDraftTags(prev => [...prev, clean]);
    setNewTagText('');
    setShowAddTag(false);
  };

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

  const linkedItemsCount = mapNodes.length + highlights.length;

  return (
    <div className="km-lab-page" style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
      {/* TOP HERO ROW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)',
        gap: '14px',
        alignItems: 'center'
      }}>
        <div className="po-hero-left" style={{ padding: '4px 6px 4px 2px', position: 'relative', overflow: 'hidden' }}>
          <div className="po-hero-shape" aria-hidden="true" style={{ right: '4px', top: '-22px' }}>
            <div className="po-hero-stripe" />
            <div className="po-hero-arc" style={{ width: '145px', height: '145px', left: '16px', top: '34px' }} />
            <div className="po-hero-arc" style={{ width: '105px', height: '105px', left: '36px', top: '54px' }} />
          </div>
          <div style={{ fontSize: '0.68rem', fontWeight: '900', letterSpacing: '0.08em', color: 'var(--lab-text-muted)', marginBottom: '2px', position: 'relative', zIndex: 1 }}>
            MY NOTES
          </div>
          <h1 style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 'clamp(1.5rem, 2.35vw, 2.05rem)',
            fontWeight: '900',
            letterSpacing: '-0.04em',
            lineHeight: 1.06,
            margin: '0 0 6px 0',
            color: 'var(--lab-text)'
          }}>
            Think · Note · <span style={{ color: 'var(--po-blue, #0B3BFA)' }}>Synthesize</span><span style={{ color: '#c6ff24' }}>.</span>
          </h1>
          <div style={{
            position: 'relative',
            zIndex: 1,
            borderLeft: '2.5px solid var(--po-blue, #0B3BFA)',
            paddingLeft: '10px',
            fontSize: '0.78rem',
            color: 'var(--lab-text-muted)',
            lineHeight: 1.4
          }}>
            A personal knowledge space for study, contemplation, and the unfolding of insight.
          </div>
        </div>

        {/* Top-Right Stats Card */}
        <div className="km-po-card" style={{
          borderRadius: '18px',
          padding: '12px 16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          alignItems: 'center'
        }}>
          {[
            { icon: FileText, value: notes.length, label: 'Notes', color: 'var(--po-blue, #0B3BFA)' },
            { icon: Layers, value: collections.length, label: 'Collections', color: '#0F1115' },
            { icon: Sparkles, value: linkedItemsCount, label: 'Linked Items', color: 'var(--po-blue, #0B3BFA)' }
          ].map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  paddingLeft: idx === 0 ? 0 : '10px',
                  borderLeft: idx === 0 ? 'none' : '1px solid var(--po-card-border)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'var(--po-card-subtle)',
                  display: 'grid',
                  placeItems: 'center',
                  color: stat.color,
                  flexShrink: 0
                }}>
                  <StatIcon size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '900', lineHeight: 1, color: 'var(--lab-text)' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.67rem', fontWeight: '600', color: 'var(--lab-text-muted)', marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEARCH & ACTION TOOLBAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your notes, ideas, keywords..."
            className="km-lab-input"
            style={{ padding: '7px 12px 7px 36px', fontSize: '0.82rem', borderRadius: '999px' }}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(v => !v)}
          className="km-lab-btn"
          style={{ padding: '7px 13px', fontSize: '0.76rem' }}
        >
          <SlidersHorizontal size={13} />
          <span>Filters</span>
        </button>

        <select
          aria-label="Filter notes by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="km-lab-input"
          style={{ width: 'auto', padding: '7px 12px', fontSize: '0.76rem', borderRadius: '999px' }}
        >
          <option value="all">All Notes</option>
          <option value="reflection">Study Notes</option>
          <option value="question">Questions</option>
          <option value="resource">Resources</option>
          <option value="comparison">Comparisons</option>
          <option value="further_inquiry">Further Inquiry</option>
        </select>

        <div style={{ display: 'inline-flex', background: 'var(--po-card-subtle)', border: '1px solid var(--po-card-border)', borderRadius: '999px', padding: '2px', gap: '2px' }}>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="List view"
            style={{
              width: '30px',
              height: '28px',
              borderRadius: '999px',
              border: 'none',
              background: viewMode === 'list' ? 'var(--po-blue, #0B3BFA)' : 'transparent',
              color: viewMode === 'list' ? '#FFFFFF' : 'var(--lab-text-muted)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            style={{
              width: '30px',
              height: '28px',
              borderRadius: '999px',
              border: 'none',
              background: viewMode === 'grid' ? 'var(--po-blue, #0B3BFA)' : 'transparent',
              color: viewMode === 'grid' ? '#FFFFFF' : 'var(--lab-text-muted)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
          >
            <LayoutGrid size={14} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleExportMarkdown}
          className="km-lab-btn"
          title="Export Markdown"
          style={{ padding: '7px 12px', fontSize: '0.76rem' }}
        >
          <Download size={13} />
        </button>

        <button
          type="button"
          onClick={handleCreateNewNote}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '999px',
            border: 'none',
            background: '#c6ff24',
            color: '#101214',
            fontSize: '0.78rem',
            fontWeight: '800',
            cursor: 'pointer'
          }}
        >
          <Plus size={14} />
          <span>New Note</span>
        </button>
      </div>

      {showFilters && (
        <div className="km-po-card" style={{ borderRadius: '14px', padding: '8px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--lab-text-muted)' }}>Quick Filter:</span>
          <button type="button" onClick={() => setLeftTab('notes')} className={leftTab === 'notes' ? 'km-lab-btn-primary' : 'km-lab-btn'} style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
            Notes ({notes.length})
          </button>
          <button type="button" onClick={() => setLeftTab('highlights')} className={leftTab === 'highlights' ? 'km-lab-btn-primary' : 'km-lab-btn'} style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
            Highlights ({highlights.length})
          </button>
        </div>
      )}

      {/* 3-COLUMN WORKSPACE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 0.85fr) minmax(350px, 1.48fr) minmax(240px, 0.92fr)',
        gap: '12px',
        alignItems: 'stretch'
      }}>
        {/* LEFT COLUMN: NOTE GROUPS + RECENT NOTES / HIGHLIGHTS */}
        <aside className="km-po-card" style={{ borderRadius: '20px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', background: 'var(--po-card-subtle)', padding: '3px', borderRadius: '999px' }}>
            <button
              type="button"
              onClick={() => setLeftTab('notes')}
              style={{
                padding: '5px 8px',
                borderRadius: '999px',
                border: 'none',
                background: leftTab === 'notes' ? 'var(--po-blue, #0B3BFA)' : 'transparent',
                color: leftTab === 'notes' ? '#FFFFFF' : 'var(--lab-text)',
                fontSize: '0.71rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              My Notes ({notes.length})
            </button>
            <button
              type="button"
              onClick={() => setLeftTab('highlights')}
              style={{
                padding: '5px 8px',
                borderRadius: '999px',
                border: 'none',
                background: leftTab === 'highlights' ? 'var(--po-blue, #0B3BFA)' : 'transparent',
                color: leftTab === 'highlights' ? '#FFFFFF' : 'var(--lab-text)',
                fontSize: '0.71rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Highlights ({highlights.length})
            </button>
          </div>

          {leftTab === 'notes' ? (
            <>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--lab-text-muted)', marginBottom: '6px' }}>
                  Note Groups
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {NOTE_GROUPS.map(grp => {
                    const active = selectedGroup === grp.id;
                    const count = grp.id === 'all'
                      ? notes.length
                      : notes.filter(n => grp.categoryMatch.includes(getAnnotationSummary(n)?.category || 'reflection')).length;
                    return (
                      <button
                        key={grp.id}
                        type="button"
                        onClick={() => setSelectedGroup(grp.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          padding: '6px 9px',
                          borderRadius: '12px',
                          border: `1px solid ${active ? 'rgba(198, 255, 36, 0.7)' : 'var(--po-card-border)'}`,
                          background: active ? 'rgba(198, 255, 36, 0.22)' : 'var(--po-card-subtle)',
                          color: 'var(--lab-text)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                          <Folder size={13} color={active ? '#4D6114' : 'var(--lab-text-muted)'} />
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {grp.label}
                          </span>
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: '800', color: 'var(--lab-text-muted)' }}>
                          {count} <ChevronRight size={11} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--po-card-border)', paddingTop: '8px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minHeight: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '800', color: 'var(--lab-text)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={12} color="var(--lab-text-muted)" /> Recent Notes
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGroup('all');
                      setCategoryFilter('all');
                    }}
                    style={{ border: 'none', background: 'transparent', color: 'var(--po-blue, #0B3BFA)', fontSize: '0.67rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                  >
                    See All →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto', maxHeight: '165px' }}>
                  {filteredNotes.slice(0, 6).map(n => {
                    const summary = getAnnotationSummary(n);
                    const isSelected = selectedNote?.id === n.id;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => selectNote(n)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          padding: '6px 8px',
                          borderRadius: '10px',
                          border: `1px solid ${isSelected ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-border)'}`,
                          background: isSelected ? 'var(--po-blue-soft)' : 'var(--po-card-subtle)',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--lab-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {summary?.title || n.target?.suttaTitleSinhala || 'Study Note'}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {n.target?.canonicalRef || n.target?.source || 'Personal Note'}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.62rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap' }}>
                          {formatRelativeTime(n.updated || n.created)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', maxHeight: '360px' }}>
              {filteredHighlights.length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--lab-text-muted)', textAlign: 'center', padding: '16px 8px' }}>
                  No sutta highlights yet.
                </div>
              ) : filteredHighlights.map(hl => (
                <div
                  key={hl.id}
                  style={{
                    padding: '7px 9px',
                    borderRadius: '10px',
                    background: 'var(--po-card-subtle)',
                    border: '1px solid var(--po-card-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => navigate(`/lab/sutta/${hl.suttaId}`)}
                      style={{ border: 'none', background: 'transparent', color: 'var(--po-blue, #0B3BFA)', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer', padding: 0, textAlign: 'left', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Highlighter size={11} />
                      <span>{hl.suttaTitle || hl.suttaId}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeHighlight(hl.id)}
                      title="Remove highlight"
                      style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: 0 }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--lab-text)', lineHeight: 1.35, fontFamily: 'var(--font-sinhala)' }}>
                    {hl.sinh || hl.pali}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* CENTER COLUMN: RICH NOTE EDITOR */}
        <section className="km-po-card" style={{ borderRadius: '22px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
          {/* Note Title Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'var(--po-blue-soft)',
                color: 'var(--po-blue, #0B3BFA)',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0
              }}>
                <FileText size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="Note title..."
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '1.08rem',
                    fontWeight: '800',
                    color: 'var(--lab-text)',
                    outline: 'none',
                    padding: 0,
                    fontFamily: 'var(--font-sinhala)'
                  }}
                />
                <input
                  type="text"
                  value={draftSubtitle}
                  onChange={(e) => setDraftSubtitle(e.target.value)}
                  placeholder="Reference or subtitle..."
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.72rem',
                    color: 'var(--lab-text-muted)',
                    outline: 'none',
                    padding: 0
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 9px',
                borderRadius: '999px',
                border: '1px solid var(--po-card-border)',
                background: 'var(--po-card-subtle)',
                fontSize: '0.66rem',
                color: 'var(--lab-text-muted)',
                fontWeight: '600'
              }}>
                <Clock size={11} />
                Last edited: {formatRelativeTime(selectedNote?.updated || selectedNote?.created)}
              </span>
              {selectedNote && (
                <button
                  type="button"
                  onClick={() => deleteRoadmapItem(selectedNote.id)}
                  title="Delete note"
                  style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <MoreHorizontal size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Tag Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {draftTags.map((tag, idx) => (
              <span
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: idx === 0 ? '#c6ff24' : 'var(--po-card-subtle)',
                  color: idx === 0 ? '#101214' : 'var(--lab-text)',
                  border: idx === 0 ? 'none' : '1px solid var(--po-card-border)',
                  fontSize: '0.7rem',
                  fontWeight: '700'
                }}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => setDraftTags(prev => prev.filter(t => t !== tag))}
                  style={{ border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: '0.72rem', lineHeight: 1 }}
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}

            {showAddTag ? (
              <form onSubmit={handleAddTag} style={{ display: 'inline-flex', gap: '4px' }}>
                <input
                  autoFocus
                  type="text"
                  value={newTagText}
                  onChange={(e) => setNewTagText(e.target.value)}
                  onBlur={handleAddTag}
                  placeholder="Tag..."
                  style={{ width: '82px', padding: '2px 8px', borderRadius: '999px', border: '1px solid var(--po-blue, #0B3BFA)', fontSize: '0.7rem', outline: 'none' }}
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddTag(true)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  border: '1px solid var(--po-card-border)',
                  background: 'transparent',
                  color: 'var(--lab-text-muted)',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                + Add Tag
              </button>
            )}
          </div>

          {/* Formatting Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            padding: '5px 8px',
            borderRadius: '10px',
            background: 'var(--po-card-subtle)',
            border: '1px solid var(--po-card-border)'
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--lab-text-muted)', paddingRight: '6px', borderRight: '1px solid var(--po-card-border)' }}>
              Paragraph
            </span>
            {[
              { icon: Bold, title: 'Bold', prefix: '**', suffix: '**' },
              { icon: Italic, title: 'Italic', prefix: '*', suffix: '*' },
              { icon: Underline, title: 'Heading', prefix: '## ', suffix: '' },
              { icon: ListOrdered, title: 'Bullet list', prefix: '• ', suffix: '' },
              { icon: Quote, title: 'Quote', prefix: '> ', suffix: '' },
              { icon: Link2, title: 'Sutta link', prefix: '[', suffix: '](sutta)' }
            ].map(tool => {
              const ToolIcon = tool.icon;
              return (
                <button
                  key={tool.title}
                  type="button"
                  onClick={() => insertFormat(tool.prefix, tool.suffix)}
                  title={tool.title}
                  style={{ border: 'none', background: 'transparent', color: 'var(--lab-text)', cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'grid', placeItems: 'center' }}
                >
                  <ToolIcon size={13} />
                </button>
              );
            })}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
              <button type="button" onClick={() => setDraftContent(getAnnotationSummary(selectedNote)?.content || '')} title="Reset" style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}>
                <Undo2 size={13} />
              </button>
              <button type="button" onClick={() => editorRef.current?.focus()} title="Focus editor" style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}>
                <Redo2 size={13} />
              </button>
            </div>
          </div>

          {/* Note Body Editor */}
          <textarea
            ref={editorRef}
            rows={7}
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            placeholder="Write your study reflections, sutta connections, and contemplations..."
            style={{
              width: '100%',
              flex: 1,
              minHeight: '165px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--lab-text)',
              fontSize: '0.92rem',
              lineHeight: 1.55,
              resize: 'vertical',
              fontFamily: 'var(--font-sinhala)'
            }}
          />

          {/* Sutta Quote Callout if linked */}
          {selectedNote?.target?.canonicalQuote && (
            <div style={{
              padding: '8px 12px',
              borderRadius: '12px',
              background: 'var(--po-card-subtle)',
              borderLeft: '3px solid var(--po-blue, #0B3BFA)',
              fontSize: '0.78rem',
              color: 'var(--lab-text)'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '2px' }}>“{selectedNote.target.canonicalQuote}”</div>
              {selectedNote.target.translationQuote && (
                <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>— {selectedNote.target.translationQuote}</div>
              )}
            </div>
          )}

          {/* Bottom Action Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid var(--po-card-border)' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate('/lab/reflection')}
                className="km-lab-btn"
                style={{ padding: '5px 11px', fontSize: '0.73rem' }}
              >
                <Lightbulb size={12} />
                <span>Add Reflection</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedNote) {
                    addAnnotationToKnowledgeMap(selectedNote);
                    setStatusMessage('Linked to Map');
                    setTimeout(() => setStatusMessage('Auto-saved'), 2500);
                  }
                }}
                className="km-lab-btn"
                style={{ padding: '5px 11px', fontSize: '0.73rem' }}
              >
                <Network size={12} />
                <span>Link to Map</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.71rem', fontWeight: '700', color: '#059669' }}>
                <Check size={12} /> {statusMessage}
              </span>
              <button
                type="button"
                onClick={handleSaveCurrentNote}
                className="km-lab-btn-primary"
                style={{ padding: '6px 15px', fontSize: '0.76rem' }}
              >
                <Save size={13} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: CONTEXT & CONNECTIONS */}
        <aside className="km-po-card" style={{ borderRadius: '20px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '11px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.86rem', fontWeight: '800', color: 'var(--lab-text)' }}>
            <Link2 size={15} color="var(--po-blue, #0B3BFA)" />
            <span>Context & Connections</span>
          </div>

          {/* Tags */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-text)' }}>
                <Tag size={12} color="var(--po-blue, #0B3BFA)" /> Tags ({draftTags.length})
              </span>
              <button
                type="button"
                onClick={() => setShowAddTag(true)}
                style={{ padding: '2px 8px', borderRadius: '999px', border: '1px solid var(--po-card-border)', background: 'var(--po-card-subtle)', fontSize: '0.65rem', fontWeight: '700', color: 'var(--lab-text)', cursor: 'pointer' }}
              >
                Edit
              </button>
            </div>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {draftTags.map((t, i) => (
                <span key={t} style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.67rem', fontWeight: '700', background: i === 0 ? '#c6ff24' : 'var(--po-card-subtle)', color: i === 0 ? '#101214' : 'var(--lab-text)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Backlinks */}
          <div style={{ borderTop: '1px solid var(--po-card-border)', paddingTop: '9px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-text)' }}>
                <Link2 size={12} color="var(--po-blue, #0B3BFA)" /> Backlinks ({notes.length})
              </span>
              <button
                type="button"
                onClick={() => navigate('/lab/sutta')}
                style={{ border: 'none', background: 'transparent', color: 'var(--po-blue, #0B3BFA)', fontSize: '0.66rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                View All →
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {notes.slice(0, 2).map(n => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => selectNote(n)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    padding: '6px 8px',
                    borderRadius: '10px',
                    border: '1px solid var(--po-card-border)',
                    background: 'var(--po-card-subtle)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.73rem', fontWeight: '700', color: 'var(--lab-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {getAnnotationSummary(n)?.title || n.target?.suttaTitleSinhala || 'Study Note'}
                    </div>
                    <div style={{ fontSize: '0.63rem', color: 'var(--lab-text-muted)' }}>
                      {n.target?.canonicalRef || n.target?.source || 'Linked note'}
                    </div>
                  </div>
                  <ExternalLink size={11} color="var(--lab-text-muted)" />
                </button>
              ))}
            </div>
          </div>

          {/* Linked Routines */}
          <div style={{ borderTop: '1px solid var(--po-card-border)', paddingTop: '9px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '6px' }}>
              Linked Routines ({routineHabits.length})
            </div>
            {routineHabits[0] && (
              <button
                type="button"
                onClick={() => navigate('/lab/daily-routine')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '7px 9px',
                  borderRadius: '10px',
                  border: '1px solid var(--po-card-border)',
                  background: 'rgba(198, 255, 36, 0.14)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                  <Sun size={13} color="#854D0E" />
                  <span style={{ fontSize: '0.73rem', fontWeight: '700', color: 'var(--lab-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {routineHabits[0].title}
                  </span>
                </span>
                <span style={{ padding: '2px 7px', borderRadius: '999px', background: '#c6ff24', color: '#101214', fontSize: '0.62rem', fontWeight: '800', flexShrink: 0 }}>
                  Active →
                </span>
              </button>
            )}
          </div>

          {/* Linked Map Nodes */}
          <div style={{ borderTop: '1px solid var(--po-card-border)', paddingTop: '9px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '6px' }}>
              Linked Map Nodes ({mapNodes.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {mapNodes.slice(0, 2).map(node => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => navigate('/lab/map')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    padding: '6px 8px',
                    borderRadius: '10px',
                    border: '1px solid var(--po-card-border)',
                    background: 'var(--po-card-subtle)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '0.73rem', fontWeight: '700', color: 'var(--lab-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {node.label}
                  </div>
                  <ChevronRight size={12} color="var(--lab-text-muted)" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Insights */}
          <div style={{ borderTop: '1px solid var(--po-card-border)', paddingTop: '9px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-text)' }}>
                <Lightbulb size={12} color="var(--po-blue, #0B3BFA)" /> Recent Insights
              </span>
              <button
                type="button"
                onClick={() => navigate('/lab/reflection')}
                style={{ border: 'none', background: 'transparent', color: 'var(--po-blue, #0B3BFA)', fontSize: '0.66rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                See All →
              </button>
            </div>
            <div style={{
              padding: '7px 9px',
              borderRadius: '10px',
              background: 'rgba(198, 255, 36, 0.16)',
              border: '1px solid rgba(198, 255, 36, 0.5)',
              fontSize: '0.71rem',
              color: 'var(--lab-text)',
              lineHeight: 1.35
            }}>
              {insights[0]?.intention || 'Noticing early softens impulsive reactions.'}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
