import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, 
  BookOpen, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Quote, 
  FileText, 
  HelpCircle, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { getAvailableSuttas } from '../../services/bilaraService';
import { getRoadmapItems, NOTE_CATEGORIES } from '../../services/studyRoadmapStore';
import { lookupPaliWord } from '../../services/paliDictionaryService';

export default function LabHome() {
  const navigate = useNavigate();
  const [suttas, setSuttas] = useState([]);
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lexicon Quick Tool State
  const [lexiconQuery, setLexiconQuery] = useState('metta');
  const [lexiconResult, setLexiconResult] = useState(null);

  useEffect(() => {
    getAvailableSuttas().then(setSuttas);
    const items = getRoadmapItems();
    setRoadmapItems(items);
    
    // Initial lexicon lookup
    const initialDef = lookupPaliWord('metta');
    setLexiconResult(initialDef);
  }, []);

  const handleLexiconSearch = (e) => {
    e.preventDefault();
    if (!lexiconQuery.trim()) return;
    const res = lookupPaliWord(lexiconQuery.trim());
    setLexiconResult(res);
  };

  // Filter suttas by quick search
  const filteredSuttas = suttas.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.titlePali.toLowerCase().includes(q) ||
      s.titleSinhala.toLowerCase().includes(q) ||
      s.canonicalRef.toLowerCase().includes(q) ||
      s.nikaya.toLowerCase().includes(q)
    );
  });

  const questionCount = roadmapItems.filter(item => item.body?.some(b => b.purpose === 'question')).length;
  const latestItem = roadmapItems[0] || null;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px clamp(16px, 3vw, 40px) 80px clamp(16px, 3vw, 40px)' }}>
      
      {/* Sleek Minimalist Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.74rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#8C1515',
            background: 'rgba(140, 21, 21, 0.08)',
            padding: '3px 8px',
            borderRadius: '4px',
            marginBottom: '8px'
          }}>
            <Sparkles size={12} />
            <span>Academic Research Workbench</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
            fontWeight: '700',
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-main)',
            margin: 0,
            lineHeight: 1.2
          }}>
            Kalyanamitta Lab
          </h1>
          <p style={{
            fontSize: '0.92rem',
            color: 'var(--text-muted)',
            margin: '4px 0 0 0'
          }}>
            SuttaCentral Bilara Canonical Corpus · W3C Stand-off Textual Inquiry
          </p>
        </div>

        {/* Global Quick Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="සූත්‍රයක් හෝ පාඨයක් සොයන්න..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
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

      {/* 3 Metric Stats Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {/* Metric 1 */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(140, 21, 21, 0.08)',
            color: '#8C1515',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <BookOpen size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {suttas.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Canonical Suttas Indexed
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(37, 99, 235, 0.08)',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Compass size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {roadmapItems.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Study Reflections Recorded
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(217, 119, 6, 0.08)',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <HelpCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {questionCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Hermeneutical Inquiries
            </div>
          </div>
        </div>
      </div>

      {/* Quick Resume Study Banner */}
      {latestItem && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(140, 21, 21, 0.06) 0%, rgba(37, 99, 235, 0.04) 100%)',
          border: '1px solid rgba(140, 21, 21, 0.16)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#8C1515',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: '700', textTransform: 'uppercase', color: '#8C1515' }}>
                Continue Where You Left Off
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.98rem', color: 'var(--text-main)' }}>
                {latestItem.target?.suttaTitleSinhala || latestItem.target?.suttaTitlePali} · {latestItem.target?.canonicalRef}
              </div>
              <div style={{
                fontFamily: 'var(--font-pali, serif)',
                fontStyle: 'italic',
                fontSize: '0.88rem',
                color: 'var(--text-muted)'
              }}>
                "{latestItem.target?.canonicalQuote}"
              </div>
            </div>
          </div>

          <Link
            to={`/lab/sutta/${latestItem.target?.source || 'snp1.8'}#${latestItem.target?.selector?.value || ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#8C1515',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(140, 21, 21, 0.2)'
            }}
          >
            <span>Resume Study</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Main Grid: Canonical Texts (Left) + Lexicon & Recent Notes (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* LEFT COLUMN: Available Canonical Suttas */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="#8C1515" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
                Canonical Corpus (ත්‍රිපිටක පාඨ)
              </h2>
            </div>
            <Link
              to="/lab/sutta"
              style={{
                fontSize: '0.8rem',
                color: '#8C1515',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              View All ({suttas.length}) →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredSuttas.map(sutta => (
              <div
                key={sutta.id}
                onClick={() => navigate(`/lab/sutta/${sutta.id}`)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
                  borderRadius: '10px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(140, 21, 21, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-color, rgba(0,0,0,0.08))';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      color: '#8C1515',
                      background: 'rgba(140, 21, 21, 0.08)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {sutta.canonicalRef}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {sutta.nikayaSinhala || sutta.nikaya}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {sutta.segmentCount} Segments
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--text-main)',
                  margin: '0 0 2px 0'
                }}>
                  {sutta.titleSinhala}
                </h3>

                <div style={{
                  fontSize: '0.86rem',
                  fontFamily: 'var(--font-pali, serif)',
                  fontStyle: 'italic',
                  color: 'var(--text-muted)',
                  marginBottom: '8px'
                }}>
                  {sutta.titlePali}
                </div>

                <p style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.45,
                  margin: 0
                }}>
                  {sutta.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-color, rgba(0,0,0,0.05))',
                  fontSize: '0.78rem'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Bilara Root (Pali) + BJ Sinhala + Sujato English
                  </span>
                  <span style={{ color: '#8C1515', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    Open Study <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Fast Pali Lexicon & Recent Reflections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Pali Lexicon Tool */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
            borderRadius: '12px',
            padding: '18px 20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <Quote size={15} color="#8C1515" />
              <h3 style={{ fontSize: '0.96rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
                Pāli Lexicon Quick Query (පාලි ශබ්දකෝෂය)
              </h3>
            </div>

            <form onSubmit={handleLexiconSearch} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="පාලි පදයක් (e.g. metta, ujū, sakko)..."
                value={lexiconQuery}
                onChange={e => setLexiconQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  background: '#8C1515',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Lookup
              </button>
            </form>

            {/* Lexicon result display */}
            {lexiconResult ? (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(140, 21, 21, 0.04)',
                border: '1px solid rgba(140, 21, 21, 0.12)',
                fontSize: '0.84rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: 'var(--font-pali, serif)',
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#8C1515'
                  }}>
                    {lexiconResult.term}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {lexiconResult.grammar || 'Noun / Adj'}
                  </span>
                </div>
                <div style={{ color: 'var(--text-main)', lineHeight: 1.45 }}>
                  {lexiconResult.meaning}
                </div>
                {lexiconResult.sinhalaMeaning && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                    {lexiconResult.sinhalaMeaning}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Enter a Pali root term above to query the canonical vocabulary database.
              </div>
            )}
          </div>

          {/* Recent Reflections List */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
            borderRadius: '12px',
            padding: '18px 20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={15} color="#2563EB" />
                <h3 style={{ fontSize: '0.96rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
                  Recent Inquiries (මෑත සටහන්)
                </h3>
              </div>
              <Link
                to="/lab/roadmap"
                style={{ fontSize: '0.78rem', color: '#8C1515', fontWeight: '600', textDecoration: 'none' }}
              >
                Roadmap →
              </Link>
            </div>

            {roadmapItems.length === 0 ? (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                තවමත් අධ්‍යයන සටහන් කිසිවක් නැත.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {roadmapItems.slice(0, 3).map(item => {
                  const q = item.body?.find(b => b.purpose === 'question') || {};
                  const n = item.body?.find(b => b.purpose === 'study_note' || b.purpose === 'reflection') || {};
                  const cat = NOTE_CATEGORIES[q.category || n.category || 'reflection'] || NOTE_CATEGORIES.reflection;

                  return (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/lab/sutta/${item.target?.source}#${item.target?.selector?.value}`)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'var(--bg-main)',
                        border: '1px solid var(--border-color, rgba(0,0,0,0.06))',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(140, 21, 21, 0.25)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color, rgba(0,0,0,0.06))'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: cat.bg,
                          color: cat.color
                        }}>
                          {cat.shortLabel}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {item.target?.selector?.value}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.86rem',
                        fontWeight: '600',
                        color: 'var(--text-main)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {q.title || n.title || item.target?.canonicalQuote}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
