import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Download, 
  ShieldCheck, 
  Search, 
  Lock, 
  Globe, 
  ArrowRight,
  AlertCircle,
  Table,
  List,
  FileCode,
  Check,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { 
  getRoadmapItems, 
  deleteRoadmapItem, 
  exportStudyTrail, 
  exportRoadmapAsMarkdown,
  exportRoadmapAsBibTeX,
  NOTE_CATEGORIES, 
  MANDATORY_DISCLAIMER 
} from '../services/studyRoadmapStore';

export default function PersonalRoadmap() {
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'public_trail'
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'concordance'
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(null);

  const loadItems = () => {
    const items = getRoadmapItems();
    setRoadmapItems(items);
  };

  useEffect(() => {
    loadItems();
    const handleUpdate = () => loadItems();
    window.addEventListener('studyRoadmapUpdated', handleUpdate);
    return () => window.removeEventListener('studyRoadmapUpdated', handleUpdate);
  }, []);

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportDropdownOpen(false);
  };

  const handleExportJSON = () => {
    const jsonStr = exportStudyTrail();
    downloadFile(jsonStr, `kalyanamitta-study-trail-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  };

  const handleExportMarkdown = () => {
    const mdStr = exportRoadmapAsMarkdown(filteredItems);
    downloadFile(mdStr, `kalyanamitta-research-draft-${new Date().toISOString().slice(0, 10)}.md`, 'text/markdown');
  };

  const handleExportBibTeX = () => {
    const bibStr = exportRoadmapAsBibTeX(filteredItems);
    downloadFile(bibStr, `kalyanamitta-concordance-${new Date().toISOString().slice(0, 10)}.bib`, 'text/plain');
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('මෙම අධ්‍යයන සටහන ඉවත් කිරීමට ඔබට සහතිකද? (Are you sure you want to remove this study reflection?)')) {
      deleteRoadmapItem(id);
      loadItems();
    }
  };

  // Filter items
  const filteredItems = roadmapItems.filter(item => {
    if (activeTab === 'public_trail' && item.provenance?.visibility === 'private') {
      return false;
    }

    if (filterCategory !== 'all') {
      const hasCategory = item.body?.some(b => b.category === filterCategory || b.purpose === filterCategory);
      if (!hasCategory) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuote = item.target?.canonicalQuote?.toLowerCase().includes(q);
      const matchSutta = (item.target?.suttaTitlePali + item.target?.suttaTitleSinhala + item.target?.canonicalRef).toLowerCase().includes(q);
      const matchBody = item.body?.some(b => (b.title + b.content).toLowerCase().includes(q));
      return matchQuote || matchSutta || matchBody;
    }

    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '40px clamp(16px, 4vw, 48px) 120px clamp(16px, 4vw, 48px)' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        
        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: '32px' }}>
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
            <Compass size={14} />
            <span>Kalyanamitta Lab — Personal Study Roadmap</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: '700',
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-main)',
            marginBottom: '12px',
            lineHeight: 1.18
          }}>
            ධර්ම අධ්‍යයන ගමන්මඟ (Dhamma Research & Concordance)
          </h1>

          <p style={{
            fontSize: '1.12rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '880px'
          }}>
            කැනොනික පාඨයන් හා ඍජුව බැඳුණු W3C Stand-off Annotation ගෘහ නිර්මාණ ශිල්පය. අධ්‍යයන ප්‍රශ්න, මූලාශ්‍ර, සහ සටහන් මුල් සූත්‍ර පාඨයෙන් වෙන් නොවී විද්වත් පර්යේෂණාත්මක මට්ටමින් පවත්වාගන්න.
          </p>

          {/* Design Philosophy Core Banner */}
          <div style={{
            marginTop: '20px',
            padding: '16px 22px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(140, 21, 21, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)',
            border: '1px solid rgba(140, 21, 21, 0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <ShieldCheck size={28} color="#8C1515" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: '700', color: '#8C1515' }}>
                "The Dhamma remains the source. The roadmap records the journey of studying it. Neither replaces the other."
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                ධර්මය ඒ ආකාරයෙන්ම පවතී. අපි සටහන් කරන්නේ එය අධ්‍යයනය කළ ගමනයි. ඒ ගමන කිසිවිටෙක ධර්මයට ආදේශයක් නොවෙයි.
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls: Personal Roadmap vs Public Study Trail + Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.1))',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Left Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('personal')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === 'personal' ? '3px solid #8C1515' : '3px solid transparent',
                color: activeTab === 'personal' ? '#8C1515' : 'var(--text-muted)',
                fontWeight: activeTab === 'personal' ? '700' : '500',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              <Lock size={16} />
              <span>Personal Roadmap (පෞද්ගලික)</span>
            </button>

            <button
              onClick={() => setActiveTab('public_trail')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === 'public_trail' ? '3px solid #2563EB' : '3px solid transparent',
                color: activeTab === 'public_trail' ? '#2563EB' : 'var(--text-muted)',
                fontWeight: activeTab === 'public_trail' ? '700' : '500',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              <Globe size={16} />
              <span>Public Study Trail (පොදු)</span>
            </button>
          </div>

          {/* Right Action Bar: View Switcher & Academic Exports */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* View Mode Toggle: Timeline vs Concordance Table */}
            <div style={{
              display: 'inline-flex',
              padding: '3px',
              borderRadius: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color, rgba(0,0,0,0.1))'
            }}>
              <button
                onClick={() => setViewMode('timeline')}
                title="Timeline View"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: viewMode === 'timeline' ? '#8C1515' : 'transparent',
                  color: viewMode === 'timeline' ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <List size={14} />
                <span>Timeline</span>
              </button>
              <button
                onClick={() => setViewMode('concordance')}
                title="Academic Concordance Matrix"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: viewMode === 'concordance' ? '#8C1515' : 'transparent',
                  color: viewMode === 'concordance' ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Table size={14} />
                <span>Matrix View</span>
              </button>
            </div>

            {/* Academic Export Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Export Research ▾</span>
              </button>

              {exportDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '6px',
                  width: '240px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                  borderRadius: '10px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  zIndex: 20,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '8px 12px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.06))'
                  }}>
                    Export Scholarly Output
                  </div>
                  <button
                    onClick={handleExportMarkdown}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 14px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(140, 21, 21, 0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <FileText size={15} color="#8C1515" />
                    <div>
                      <div style={{ fontWeight: '600' }}>Markdown Journal (.md)</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Complete research paper draft</div>
                    </div>
                  </button>
                  <button
                    onClick={handleExportBibTeX}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 14px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(37, 99, 235, 0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <FileCode size={15} color="#2563EB" />
                    <div>
                      <div style={{ fontWeight: '600' }}>BibTeX Concordance (.bib)</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>LaTeX & Zotero citations</div>
                    </div>
                  </button>
                  <button
                    onClick={handleExportJSON}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 14px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(5, 150, 105, 0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <Download size={15} color="#059669" />
                    <div>
                      <div style={{ fontWeight: '600' }}>W3C Annotation JSON</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Universal open data model</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/lab/sutta"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: '#8C1515',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              <BookOpen size={14} />
              <span>සූත්‍ර අධ්‍යයනයට</span>
            </Link>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              placeholder="පාඨය, ප්‍රශ්නය හෝ මූලාශ්‍රය අනුව සොයන්න..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 14px 8px 36px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Filter Badges */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterCategory('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: filterCategory === 'all' ? '1px solid #8C1515' : '1px solid var(--border-color, rgba(0,0,0,0.1))',
                background: filterCategory === 'all' ? 'rgba(140, 21, 21, 0.08)' : 'transparent',
                color: filterCategory === 'all' ? '#8C1515' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              සියල්ල ({roadmapItems.length})
            </button>

            {Object.entries(NOTE_CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setFilterCategory(key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: filterCategory === key ? `1px solid ${cat.color}` : '1px solid var(--border-color, rgba(0,0,0,0.1))',
                  background: filterCategory === key ? cat.bg : 'transparent',
                  color: filterCategory === key ? cat.color : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {cat.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--border-color, rgba(0,0,0,0.08))'
          }}>
            <Compass size={40} color="#8C1515" style={{ opacity: 0.5, marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              අධ්‍යයන සටහන් කිසිවක් හමු නොවීය
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              සූත්‍ර කියවීමේදී ඔබට ඇතිවන ප්‍රශ්න, මූලාශ්‍ර සහ පැහැදිලි කරගත් කරුණු සටහන් කර ඔබේ ගමන්මඟ ගොඩනගන්න.
            </p>
            <Link
              to="/lab/sutta/snp1.8"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#8C1515',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              <span>කරණීයමෙත්ත සූත්‍රයෙන් අධ්‍යයනය අරඹන්න</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : viewMode === 'concordance' ? (
          /* ACADEMIC CONCORDANCE MATRIX VIEW */
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.1))' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-muted)', width: '160px' }}>Ref & Segment</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-muted)', width: '240px' }}>Canonical Root (Pāli)</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-muted)' }}>Research Observations & Notes</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-muted)', width: '180px' }}>Sources</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-muted)', width: '90px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => {
                    const qBody = item.body?.find(b => b.purpose === 'question') || {};
                    const nBody = item.body?.find(b => b.purpose === 'study_note' || b.purpose === 'reflection') || {};
                    const sBody = item.body?.find(b => b.purpose === 'resource') || {};
                    const iBody = item.body?.find(b => b.purpose === 'further_inquiry') || {};

                    return (
                      <tr 
                        key={item.id} 
                        style={{ 
                          borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(140, 21, 21, 0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {/* Ref & Segment */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: '700', color: '#8C1515' }}>
                            {item.target?.suttaTitlePali || item.target?.source}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {item.target?.canonicalRef}
                          </div>
                          <div style={{
                            display: 'inline-block',
                            marginTop: '6px',
                            fontFamily: 'monospace',
                            fontSize: '0.74rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'var(--bg-main)',
                            border: '1px solid var(--border-color, rgba(0,0,0,0.08))'
                          }}>
                            {item.target?.selector?.value}
                          </div>
                        </td>

                        {/* Canonical Root */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                          <div style={{
                            fontFamily: 'var(--font-pali, serif)',
                            fontStyle: 'italic',
                            color: 'var(--text-main)',
                            lineHeight: 1.5,
                            fontWeight: '500'
                          }}>
                            "{item.target?.canonicalQuote || '—'}"
                          </div>
                          {item.target?.translationQuote && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {item.target.translationQuote}
                            </div>
                          )}
                        </td>

                        {/* Research Observations */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                          {qBody.title && (
                            <div style={{ marginBottom: '6px' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#D97706', textTransform: 'uppercase' }}>
                                Question:
                              </span>{' '}
                              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{qBody.title}</span>
                            </div>
                          )}
                          {nBody.content && (
                            <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                              {nBody.content}
                            </div>
                          )}
                          {iBody.content && (
                            <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '6px', fontStyle: 'italic' }}>
                              Inquiry: {iBody.content}
                            </div>
                          )}
                        </td>

                        {/* Sources Cited */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'top', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {sBody.content || 'Paramatthajotikā / BJ'}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'top', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Link
                              to={`/lab/sutta/${item.target?.source}#${item.target?.selector?.value}`}
                              title="Open Sutta Segment"
                              style={{
                                color: '#8C1515',
                                padding: '4px 6px',
                                borderRadius: '4px',
                                background: 'rgba(140, 21, 21, 0.08)'
                              }}
                            >
                              <ExternalLink size={13} />
                            </Link>
                            <button
                              onClick={(e) => handleDelete(item.id, e)}
                              title="Delete reflection"
                              style={{
                                color: 'var(--text-muted)',
                                padding: '4px 6px',
                                borderRadius: '4px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Disclaimer footer */}
            <div style={{
              padding: '10px 16px',
              background: 'var(--bg-main)',
              borderTop: '1px solid var(--border-color, rgba(0,0,0,0.08))',
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <AlertCircle size={13} color="#D97706" />
              <span>{MANDATORY_DISCLAIMER}</span>
            </div>
          </div>
        ) : (
          /* TIMELINE LIST VIEW */
          <div style={{ position: 'relative' }}>
            
            {/* Vertical Timeline Guide Line */}
            <div style={{
              position: 'absolute',
              left: '24px',
              top: '20px',
              bottom: '20px',
              width: '2px',
              background: 'rgba(140, 21, 21, 0.12)',
              zIndex: 1
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {filteredItems.map((item, idx) => {
                const questionBody = item.body?.find(b => b.purpose === 'question') || {};
                const noteBody = item.body?.find(b => b.purpose === 'study_note' || b.purpose === 'reflection') || {};
                const sourceBody = item.body?.find(b => b.purpose === 'resource') || {};
                const inquiryBody = item.body?.find(b => b.purpose === 'further_inquiry') || {};

                const primaryCategory = questionBody.category || noteBody.category || 'reflection';
                const catConfig = NOTE_CATEGORIES[primaryCategory] || NOTE_CATEGORIES.reflection;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    style={{
                      position: 'relative',
                      paddingLeft: '64px',
                      zIndex: 2
                    }}
                  >
                    {/* Timeline Node Dot */}
                    <div style={{
                      position: 'absolute',
                      left: '14px',
                      top: '24px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'var(--bg-main)',
                      border: `3px solid ${catConfig.color}`,
                      boxShadow: `0 0 0 4px ${catConfig.bg}`
                    }} />

                    {/* Timeline Card */}
                    <div style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                      borderRadius: '14px',
                      padding: '24px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}>
                      {/* Top Bar: Action Tag, Segment ID, Visibility */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: catConfig.bg,
                            color: catConfig.color,
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                          }}>
                            {catConfig.actionTag} • {catConfig.shortLabel}
                          </span>

                          <span style={{
                            fontFamily: 'monospace',
                            fontSize: '0.78rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'var(--bg-main)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border-color, rgba(0,0,0,0.06))'
                          }}>
                            {item.target?.selector?.value}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)'
                          }}>
                            {item.provenance?.visibility === 'private' ? (
                              <><Lock size={12} /> Private Note</>
                            ) : (
                              <><Globe size={12} /> Shared Trail</>
                            )}
                          </span>

                          <Link
                            to={`/lab/sutta/${item.target?.source}#${item.target?.selector?.value}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.78rem',
                              fontWeight: '600',
                              color: '#8C1515',
                              textDecoration: 'none',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: 'rgba(140, 21, 21, 0.06)'
                            }}
                          >
                            <span>සූත්‍රය කියවන්න</span>
                            <ExternalLink size={12} />
                          </Link>

                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            title="Delete note"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* 1. Reading — මම අධ්‍යයනය කළ පාඨය */}
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: 'var(--bg-main)',
                        border: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          color: '#8C1515',
                          letterSpacing: '0.06em',
                          marginBottom: '4px'
                        }}>
                          Reading — මම අධ්‍යයනය කළ පාඨය
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>
                          {item.target?.suttaTitleSinhala || item.target?.suttaTitlePali} · {item.target?.canonicalRef}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-pali, serif)',
                          fontSize: '1.05rem',
                          fontWeight: '600',
                          color: '#8C1515',
                          marginTop: '4px'
                        }}>
                          "{item.target?.canonicalQuote}"
                        </div>
                        {item.target?.translationQuote && (
                          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {item.target?.translationQuote}
                          </div>
                        )}
                      </div>

                      {/* 2. Question — මට ඇති වූ ප්‍රශ්නය */}
                      {questionBody.title && (
                        <div style={{ marginBottom: '14px' }}>
                          <div style={{
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            color: '#D97706',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            <HelpCircle size={14} />
                            <span>Question — මට ඇති වූ ප්‍රශ්නය</span>
                          </div>
                          <div style={{
                            fontSize: '1.02rem',
                            fontWeight: '600',
                            color: 'var(--text-main)',
                            lineHeight: 1.5
                          }}>
                            "{questionBody.title}"
                          </div>
                          {questionBody.content && questionBody.content !== questionBody.title && (
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                              {questionBody.content}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. Sources — මට උපකාරී වූ මූලාශ්‍ර */}
                      {sourceBody.content && (
                        <div style={{
                          marginBottom: '14px',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          background: 'rgba(37, 99, 235, 0.05)',
                          borderLeft: '3px solid #2563EB'
                        }}>
                          <div style={{
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            color: '#2563EB',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            <BookOpen size={14} />
                            <span>Sources — මට උපකාරී වූ මූලාශ්‍ර</span>
                          </div>
                          <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                            {sourceBody.content}
                          </div>
                        </div>
                      )}

                      {/* 4. Study Note — මට පැහැදිලි කරගැනීමට හැකි වූ දේ */}
                      {noteBody.content && (
                        <div style={{ marginBottom: '14px' }}>
                          <div style={{
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            color: '#8C1515',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            <FileText size={14} />
                            <span>Study Note — මට පැහැදිලි කරගැනීමට හැකි වූ දේ</span>
                          </div>
                          <div style={{
                            fontSize: '0.94rem',
                            color: 'var(--text-main)',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-line'
                          }}>
                            {noteBody.content}
                          </div>
                        </div>
                      )}

                      {/* 5. Further Inquiry — තවදුරටත් විමසිය යුතු දේ */}
                      {inquiryBody.content && (
                        <div style={{
                          marginBottom: '16px',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          background: 'rgba(5, 150, 105, 0.05)',
                          borderLeft: '3px solid #059669'
                        }}>
                          <div style={{
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            color: '#059669',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            <Compass size={14} />
                            <span>Further Inquiry — තවදුරටත් විමසිය යුතු දේ</span>
                          </div>
                          <div style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                            {inquiryBody.content}
                          </div>
                        </div>
                      )}

                      {/* Mandatory Academic Disclaimer Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px',
                        padding: '8px 12px',
                        background: 'rgba(217, 119, 6, 0.06)',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        color: '#B45309',
                        marginTop: '12px'
                      }}>
                        <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{MANDATORY_DISCLAIMER}</span>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
