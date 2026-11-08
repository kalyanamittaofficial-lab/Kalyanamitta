import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  GitCompare, 
  Layers, 
  ExternalLink, 
  Download, 
  Share2, 
  Plus, 
  ShieldCheck, 
  Search, 
  Filter, 
  Lock, 
  Globe, 
  ArrowRight,
  AlertCircle,
  Tag
} from 'lucide-react';
import { 
  getRoadmapItems, 
  deleteRoadmapItem, 
  exportStudyTrail, 
  NOTE_CATEGORIES, 
  MANDATORY_DISCLAIMER 
} from '../services/studyRoadmapStore';

export default function PersonalRoadmap() {
  const navigate = useNavigate();
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'public_trail'
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

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

  const handleExport = () => {
    const jsonStr = exportStudyTrail();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kalyanamitta-dhamma-study-trail-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyTrail = () => {
    const jsonStr = exportStudyTrail();
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    });
  };

  // Filter items
  const filteredItems = roadmapItems.filter(item => {
    if (activeTab === 'public_trail' && item.provenance?.visibility === 'private') {
      return false;
    }

    if (filterCategory !== 'all') {
      const hasCategory = item.body.some(b => b.category === filterCategory);
      if (!hasCategory) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuote = item.target?.canonicalQuote?.toLowerCase().includes(q);
      const matchSutta = (item.target?.suttaTitlePali + item.target?.suttaTitleSinhala + item.target?.canonicalRef).toLowerCase().includes(q);
      const matchBody = item.body.some(b => (b.title + b.content).toLowerCase().includes(q));
      return matchQuote || matchSutta || matchBody;
    }

    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '40px clamp(16px, 4vw, 48px) 120px clamp(16px, 4vw, 48px)' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        
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
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
            fontWeight: '700',
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-main)',
            marginBottom: '12px',
            lineHeight: 1.15
          }}>
            ධර්ම අධ්‍යයන ගමන්මඟ (My Dhamma Study Journey)
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '850px'
          }}>
            තමන් ධර්මය අධ්‍යයනය කළ ගමන, අධ්‍යයනයට උපකාරී වූ මූලාශ්‍ර, ඇති වූ ප්‍රශ්න සහ පැහැදිලි කරගත් කරුණු මුල් පාඨ වෙත සෘජුව සම්බන්ධ කරන Source-linked Study Timeline එක.
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

        {/* Tab Controls: Personal Roadmap vs Public Study Trail */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.1))',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
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
              <span>Personal Roadmap (පෞද්ගලික ගමන්මඟ)</span>
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
              <span>Public Study Trail (පොදු අධ්‍යයන මාර්ග)</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Download size={15} />
              <span>Export Trail (JSON)</span>
            </button>

            <Link
              to="/lab/sutta"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#8C1515',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              <BookOpen size={15} />
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
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="පාඨය, ප්‍රශ්නය හෝ මූලාශ්‍රය අනුව සොයන්න..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 36px',
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

        {/* TIMELINE LIST VIEW */}
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
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {filteredItems.map((item, idx) => {
                const questionBody = item.body.find(b => b.purpose === 'question') || {};
                const noteBody = item.body.find(b => b.purpose === 'study_note' || b.purpose === 'reflection') || {};
                const sourceBody = item.body.find(b => b.purpose === 'resource') || {};
                const inquiryBody = item.body.find(b => b.purpose === 'further_inquiry') || {};

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
          )}

        </div>

      </div>
    </div>
  );
}
