import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, BookOpen, ShieldAlert } from 'lucide-react';
import { fetchPublicMapById } from '../../services/communityExploreStore';
import { NODE_TYPES } from '../../services/knowledgeMapStore';

export default function PublicMapView() {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPublicMapById(mapId)
      .then(res => {
        if (!cancelled) setData(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [mapId]);

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 20px', textAlign: 'center', color: 'var(--lab-text-muted)' }}>
        Loading shared Knowledge Map...
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ maxWidth: '720px', margin: '48px auto', padding: '0 20px' }}>
        <div className="km-lab-card" style={{ padding: '32px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 8px 0' }}>Map Not Found or Private</h2>
          <p style={{ color: 'var(--lab-text-muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
            This Knowledge Map is either private or does not exist.
          </p>
          <button
            onClick={() => navigate('/lab/explore')}
            style={{ padding: '9px 16px', borderRadius: '999px', border: 'none', background: 'var(--lab-accent)', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
          >
            Back to Community Explore
          </button>
        </div>
      </div>
    );
  }

  const { map, nodes, edges } = data;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: 'clamp(22px, 3vw, 36px) clamp(14px, 3vw, 28px) 72px' }}>
      <button
        onClick={() => navigate('/lab/explore')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 14px',
          borderRadius: '999px',
          border: '1px solid var(--lab-border)',
          background: 'var(--lab-bg-elevated)',
          color: 'var(--lab-text)',
          fontSize: '0.82rem',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
      >
        <ArrowLeft size={14} />
        <span>Back to Explore</span>
      </button>

      <div className="km-lab-card" style={{ padding: '22px 24px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.73rem', fontWeight: '700', color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '3px 10px', borderRadius: '999px' }}>
            <Globe size={12} /> Public Knowledge Map
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--lab-text-muted)' }}>
            Authored by <strong>{map.authorName}</strong>
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.45rem, 2.5vw, 1.95rem)', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--lab-text)' }}>
          {map.title}
        </h1>
        {map.description && (
          <p style={{ fontSize: '0.9rem', color: 'var(--lab-text-muted)', margin: '0 0 12px 0' }}>{map.description}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--lab-text-muted)', padding: '9px 12px', borderRadius: '10px', background: 'var(--lab-bg-subtle)' }}>
          <ShieldAlert size={14} color="var(--lab-gold)" />
          <span>බෙදාගත් පෞද්ගලික අධ්‍යයන සිතියමකි. ත්‍රිපිටක මූලාශ්‍ර හා කර්තෘත්වය එලෙසම සුරැකේ.</span>
        </div>
      </div>

      {/* Nodes & Provenance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {nodes.map(node => {
          const typeCfg = NODE_TYPES[node.nodeType] || NODE_TYPES.concept;
          return (
            <div key={node.id} className="km-lab-card" style={{ padding: '16px 18px', borderLeft: `4px solid ${node.color || typeCfg.color}` }}>
              <div style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: node.color || typeCfg.color, marginBottom: '4px' }}>
                {typeCfg.label}
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.96rem', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)', marginBottom: '6px' }}>
                {node.label}
              </div>
              {node.summary && (
                <p style={{ fontSize: '0.84rem', color: 'var(--lab-text-muted)', margin: '0 0 8px 0', lineHeight: 1.55, fontFamily: 'var(--font-sinhala)' }}>
                  {node.summary}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--lab-text-muted)' }}>
                <span style={{ fontFamily: 'monospace' }}>{node.sourceRef || 'Personal Insight'}</span>
                {node.suttaKey && (
                  <button
                    onClick={() => navigate(`/lab/sutta/${node.suttaKey}`)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: 'transparent', color: 'var(--lab-accent)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    <BookOpen size={12} />
                    <span>Read Sutta</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {edges.length > 0 && (
        <div className="km-lab-card" style={{ padding: '18px 20px' }}>
          <h3 style={{ fontSize: '0.96rem', fontWeight: '700', margin: '0 0 10px 0' }}>
            Concept Connections ({edges.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {edges.map(edge => {
              const src = nodes.find(n => n.id === edge.sourceNodeId);
              const tgt = nodes.find(n => n.id === edge.targetNodeId);
              return (
                <div key={edge.id} style={{ fontSize: '0.84rem', padding: '8px 12px', borderRadius: '8px', background: 'var(--lab-bg-subtle)' }}>
                  <strong>{src?.label || 'Node'}</strong> <em style={{ color: 'var(--lab-accent)', margin: '0 6px' }}>{edge.relationLabel}</em> <strong>{tgt?.label || 'Node'}</strong>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
