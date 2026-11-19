import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Link2,
  Trash2,
  Lock,
  Globe,
  BookOpen,
  FileText,
  X,
  BookHeart
} from 'lucide-react';
import {
  getKnowledgeMaps,
  getMapNodes,
  getMapEdges,
  saveKnowledgeMap,
  addMapNode,
  updateMapNodePosition,
  deleteMapNode,
  addMapEdge,
  deleteMapEdge,
  addAnnotationToKnowledgeMap,
  NODE_TYPES,
  EDGE_RELATIONS
} from '../../services/knowledgeMapStore';
import { getRoadmapItems, getAnnotationSummary } from '../../services/studyRoadmapStore';
import { getPathReflections, addPathReflection, EIGHTFOLD_FACTORS } from '../../services/practiceEcosystemStore';

export default function KnowledgeMap() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('path'); // 'path' | 'graph' | 'outline'
  const [maps, setMaps] = useState(() => getKnowledgeMaps());
  const [activeMapId, setActiveMapId] = useState(() => getKnowledgeMaps()[0]?.id || '');
  const [nodes, setNodes] = useState(() => getMapNodes(getKnowledgeMaps()[0]?.id));
  const [edges, setEdges] = useState(() => getMapEdges(getKnowledgeMaps()[0]?.id));
  const [annotations, setAnnotations] = useState(() => getRoadmapItems());
  const [reflections, setReflections] = useState(() => getPathReflections());

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [connectSourceId, setConnectSourceId] = useState(null);
  const [connectRelation, setConnectRelation] = useState(EDGE_RELATIONS[0]);
  const [showAddNode, setShowAddNode] = useState(false);
  const [showImportNotes, setShowImportNotes] = useState(false);
  const [showPubPreview, setShowPubPreview] = useState(false);
  const [showNewReflection, setShowNewReflection] = useState(false);
  const [reflectionIntention, setReflectionIntention] = useState('');
  const [reflectionFactor, setReflectionFactor] = useState(EIGHTFOLD_FACTORS[0].id);

  // Dragging state
  const [draggingId, setDraggingId] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // New node form
  const [newNodeType, setNewNodeType] = useState('concept');
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeSummary, setNewNodeSummary] = useState('');
  const [newNodeSourceRef, setNewNodeSourceRef] = useState('');

  const activeMap = maps.find(m => m.id === activeMapId) || maps[0];

  useEffect(() => {
    const refresh = () => {
      const nextMaps = getKnowledgeMaps();
      setMaps(nextMaps);
      const targetId = activeMapId || nextMaps[0]?.id;
      setNodes(getMapNodes(targetId));
      setEdges(getMapEdges(targetId));
    };
    const refreshNotes = () => setAnnotations(getRoadmapItems());
    const refreshPractice = () => setReflections(getPathReflections());

    window.addEventListener('labKnowledgeMapUpdated', refresh);
    window.addEventListener('studyRoadmapUpdated', refreshNotes);
    window.addEventListener('labPracticeUpdated', refreshPractice);
    return () => {
      window.removeEventListener('labKnowledgeMapUpdated', refresh);
      window.removeEventListener('studyRoadmapUpdated', refreshNotes);
      window.removeEventListener('labPracticeUpdated', refreshPractice);
    };
  }, [activeMapId]);

  const handleSelectMap = (id) => {
    setActiveMapId(id);
    setNodes(getMapNodes(id));
    setEdges(getMapEdges(id));
    setSelectedNodeId(null);
    setConnectSourceId(null);
  };

  const handleConfirmPublish = () => {
    if (!activeMap) return;
    const nextVis = activeMap.visibility === 'public' ? 'private' : 'public';
    saveKnowledgeMap({ ...activeMap, visibility: nextVis });
    setShowPubPreview(false);
  };

  const handleAddNode = (e) => {
    e.preventDefault();
    if (!newNodeLabel.trim() || !activeMap) return;
    const created = addMapNode({
      mapId: activeMap.id,
      nodeType: newNodeType,
      label: newNodeLabel.trim(),
      summary: newNodeSummary.trim(),
      sourceRef: newNodeSourceRef.trim()
    });
    setSelectedNodeId(created.id);
    setNewNodeLabel('');
    setNewNodeSummary('');
    setNewNodeSourceRef('');
    setShowAddNode(false);
  };

  const handleNodePointerDown = (e, node) => {
    if (connectSourceId) {
      e.stopPropagation();
      if (connectSourceId !== node.id && activeMap) {
        addMapEdge({
          mapId: activeMap.id,
          sourceNodeId: connectSourceId,
          targetNodeId: node.id,
          relationLabel: connectRelation
        });
      }
      setConnectSourceId(null);
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragOffset.current = {
      x: e.clientX - rect.left - node.posX,
      y: e.clientY - rect.top - node.posY
    };
    setDraggingId(node.id);
    setSelectedNodeId(node.id);
  };

  const handleCanvasPointerMove = (e) => {
    if (!draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const nextX = Math.max(16, Math.min(rect.width - 210, e.clientX - rect.left - dragOffset.current.x));
    const nextY = Math.max(16, Math.min(rect.height - 100, e.clientY - rect.top - dragOffset.current.y));
    setNodes(prev => prev.map(n => (n.id === draggingId ? { ...n, posX: nextX, posY: nextY } : n)));
  };

  const handleCanvasPointerUp = () => {
    if (!draggingId) return;
    const moved = nodes.find(n => n.id === draggingId);
    if (moved) {
      updateMapNodePosition(moved.id, Math.round(moved.posX), Math.round(moved.posY));
    }
    setDraggingId(null);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;
  const connectedEdges = selectedNode
    ? edges.filter(e => e.sourceNodeId === selectedNode.id || e.targetNodeId === selectedNode.id)
    : [];
  const latestReflection = reflections[0];

  return (
    <div className="km-lab-page">
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid var(--lab-border)', marginBottom: '18px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'path', label: 'මගේ මාර්ගය (මග්ග)' },
            { id: 'graph', label: 'ධර්ම සිතියම' },
            { id: 'outline', label: 'සැකිල්ල' }
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="km-lab-btn"
                style={{
                  background: active ? 'var(--lab-bg-subtle)' : 'var(--lab-bg-elevated)',
                  borderColor: active ? 'var(--lab-text)' : 'var(--lab-border)',
                  fontWeight: active ? '700' : '500'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <select
            aria-label="Select Knowledge Map"
            value={activeMap?.id || ''}
            onChange={(e) => handleSelectMap(e.target.value)}
            className="km-lab-input"
            style={{ width: 'auto', padding: '7px 12px', fontSize: '0.82rem', fontWeight: '600' }}
          >
            {maps.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          <button onClick={() => setShowPubPreview(true)} className="km-lab-btn">
            {activeMap?.visibility === 'public' ? <Globe size={14} /> : <Lock size={14} />}
            <span>ප්‍රකාශන පෙරදසුන</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY PATH */}
      {activeTab === 'path' && (
        <div className="km-lab-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontWeight: '700', fontSize: '0.96rem' }}>
              පෞද්ගලික මාර්ග දිශානතිය
            </div>
            <button onClick={() => setShowNewReflection(v => !v)} className="km-lab-btn" style={{ fontSize: '0.8rem' }}>
              <Plus size={13} />
              <span>නව විමසුමක් එක් කරන්න</span>
            </button>
          </div>

          {showNewReflection && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!reflectionIntention.trim()) return;
                addPathReflection({ pathFactor: reflectionFactor, intention: reflectionIntention.trim(), observation: '' });
                setReflectionIntention('');
                setShowNewReflection(false);
              }}
              style={{ padding: '14px', borderRadius: '8px', background: 'var(--lab-bg-subtle)', border: '1px solid var(--lab-border)', marginBottom: '18px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}
            >
              <select className="km-lab-input" style={{ width: 'auto' }} value={reflectionFactor} onChange={(e) => setReflectionFactor(e.target.value)}>
                {EIGHTFOLD_FACTORS.map(f => <option key={f.id} value={f.id}>{f.pali} ({f.sinhala})</option>)}
              </select>
              <input
                className="km-lab-input"
                style={{ flex: 1, minWidth: '220px' }}
                required
                placeholder="මගේ වත්මන් විමසුම හෝ පටිපදා අරමුණ..."
                value={reflectionIntention}
                onChange={(e) => setReflectionIntention(e.target.value)}
              />
              <button type="submit" className="km-lab-btn-primary">සුරකින්න</button>
            </form>
          )}

          {/* Ultimate Aim Box */}
          <div style={{ maxWidth: '460px', margin: '0 auto 10px auto', padding: '16px 20px', border: '1.5px solid var(--lab-text)', borderRadius: '8px', background: 'var(--lab-bg-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>
              පරම අරමුණ · දිශානතිය පමණි
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '3px' }}>
              නිවන (නිබ්බාන)
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>
              ප්‍රතිශත, ලකුණු හෝ මට්ටම් ගණනය කිරීමක් නොමැත
            </div>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--lab-text-muted)', fontSize: '0.95rem', marginBottom: '10px' }}>↓</div>

          {/* Current Self-Reflection Box */}
          <div style={{ maxWidth: '560px', margin: '0 auto 12px auto', padding: '14px 20px', border: '1px solid var(--lab-border)', borderRadius: '8px', background: 'var(--lab-bg-elevated)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>
              වත්මන් ස්වයං ආවර්ජනය
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: '700', marginBottom: '2px' }}>
              {latestReflection?.intention || 'විවේචන හමුවේ මා ප්‍රතිචාර දක්වන්නේ කෙසේද?'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--lab-text-muted)' }}>
              විවෘත විමසුමක් මිස මට්ටම් තීරණයක් නොවේ
            </div>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--lab-text-muted)', fontSize: '0.95rem', marginBottom: '14px' }}>↙ &nbsp; ↓ &nbsp; ↘</div>

          {/* 3-Column Flow */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div className="km-lab-card" style={{ padding: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '6px' }}>1 / පරියත්ති (අධ්‍යයනය)</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--lab-text-muted)', margin: '0 0 12px 0' }}>
                අදාළ සූත්‍රයක් කියවා නව අවබෝධයක් සටහන් කරන්න.
              </p>
              <button onClick={() => navigate('/lab/sutta')} className="km-lab-btn">කියවනය විවෘත කරන්න</button>
            </div>

            <div className="km-lab-card" style={{ padding: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '6px' }}>2 / පටිපත්ති (ප්‍රතිපදාව)</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--lab-text-muted)', margin: '0 0 12px 0' }}>
                ප්‍රතිචාර දැක්වීමට පෙර සිහියෙන් සවන් දීමට උත්සාහ කරන්න.
              </p>
              <button onClick={() => navigate('/lab/compass')} className="km-lab-btn">ප්‍රතිපදාව සටහන් කරන්න</button>
            </div>

            <div className="km-lab-card" style={{ padding: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '6px' }}>3 / නිරීක්ෂණය</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--lab-text-muted)', margin: '0 0 12px 0' }}>
                ඇත්තටම සිදු වූයේ කුමක්ද? මා දුටුවේ කුමක්ද?
              </p>
              <button onClick={() => navigate('/lab/pin-potha')} className="km-lab-btn">පින් පොත විවෘත කරන්න</button>
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: '8px', border: '1px dashed var(--lab-border)', background: 'var(--lab-bg-subtle)', fontSize: '0.8rem', color: 'var(--lab-text-muted)' }}>
            <strong>ආවර්ජන චක්‍රය:</strong>{' '}
            අවබෝධය සංශෝධනය ↔ මූලාශ්‍ර විමසීම ↔ පටිපත්ති ↔ නිරීක්ෂණය ↔ නැවත විමසීම.
          </div>
        </div>
      )}

      {/* TAB 2: KNOWLEDGE GRAPH */}
      {activeTab === 'graph' && (
        <div>
          <div className="km-lab-card" style={{ padding: '10px 14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => setShowAddNode(v => !v)} className="km-lab-btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <Plus size={13} />
                <span>නව අංගයක්</span>
              </button>
              <button onClick={() => setShowImportNotes(v => !v)} className="km-lab-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <FileText size={13} />
                <span>සටහන් එක් කරන්න ({annotations.length})</span>
              </button>
              {connectSourceId && (
                <span className="km-lab-tag" style={{ color: 'var(--lab-gold)' }}>
                  සම්බන්ධ කිරීමට අංගයක් තෝරන්න ({connectRelation})
                  <button onClick={() => setConnectSourceId(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, marginLeft: '4px' }}>×</button>
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>
              අංග {nodes.length} · සම්බන්ධතා {edges.length}
            </span>
          </div>

          {showAddNode && (
            <form onSubmit={handleAddNode} className="km-lab-card" style={{ padding: '14px', marginBottom: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
              <select className="km-lab-input" value={newNodeType} onChange={(e) => setNewNodeType(e.target.value)}>
                {Object.values(NODE_TYPES).map(tItem => (
                  <option key={tItem.id} value={tItem.id}>{tItem.label}</option>
                ))}
              </select>
              <input className="km-lab-input" required placeholder="මාතෘකාව" value={newNodeLabel} onChange={(e) => setNewNodeLabel(e.target.value)} />
              <input className="km-lab-input" placeholder="ත්‍රිපිටක මූලාශ්‍රය (උදා: SN 56.11)" value={newNodeSourceRef} onChange={(e) => setNewNodeSourceRef(e.target.value)} />
              <input className="km-lab-input" placeholder="විස්තරය" value={newNodeSummary} onChange={(e) => setNewNodeSummary(e.target.value)} />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button type="submit" className="km-lab-btn-primary">සුරකින්න</button>
                <button type="button" className="km-lab-btn" onClick={() => setShowAddNode(false)}>වසන්න</button>
              </div>
            </form>
          )}

          {showImportNotes && (
            <div className="km-lab-card" style={{ padding: '14px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.86rem' }}>සූත්‍ර සටහන් සිතියමට එක් කරන්න</strong>
                <button onClick={() => setShowImportNotes(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={15} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
                {annotations.map(anno => {
                  const summary = getAnnotationSummary(anno);
                  const added = nodes.some(n => n.annotationId === anno.id);
                  return (
                    <div key={anno.id} style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--lab-bg-subtle)', border: '1px solid var(--lab-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {summary?.title || anno.target?.suttaTitleSinhala || anno.target?.source}
                      </span>
                      <button
                        disabled={added}
                        onClick={() => addAnnotationToKnowledgeMap(anno, activeMap?.id)}
                        className={added ? 'km-lab-btn' : 'km-lab-btn-primary'}
                        style={{ padding: '4px 9px', fontSize: '0.74rem' }}
                      >
                        {added ? 'එක් කළා' : '+ එක් කරන්න'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(260px, 300px)', gap: '16px', alignItems: 'start' }}>
            {/* Dotted Graph Canvas */}
            <div
              ref={canvasRef}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onPointerLeave={handleCanvasPointerUp}
              className="km-lab-card"
              style={{
                position: 'relative',
                height: '520px',
                overflow: 'auto',
                backgroundImage: 'radial-gradient(var(--lab-border) 1.2px, transparent 1.2px)',
                backgroundSize: '20px 20px',
                userSelect: 'none',
                touchAction: 'none'
              }}
            >
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {edges.map(edge => {
                  const src = nodes.find(n => n.id === edge.sourceNodeId);
                  const tgt = nodes.find(n => n.id === edge.targetNodeId);
                  if (!src || !tgt) return null;
                  const x1 = src.posX + 95;
                  const y1 = src.posY + 32;
                  const x2 = tgt.posX + 95;
                  const y2 = tgt.posY + 32;
                  return (
                    <line key={edge.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--lab-text-muted)" strokeOpacity="0.5" strokeWidth="1.5" />
                  );
                })}
              </svg>

              {nodes.map(node => {
                const typeCfg = NODE_TYPES[node.nodeType] || NODE_TYPES.concept;
                const isSelected = node.id === selectedNodeId;
                return (
                  <div
                    key={node.id}
                    onPointerDown={(e) => handleNodePointerDown(e, node)}
                    style={{
                      position: 'absolute',
                      left: `${node.posX}px`,
                      top: `${node.posY}px`,
                      width: '192px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'var(--lab-bg-elevated)',
                      border: `1.5px solid ${isSelected ? 'var(--lab-text)' : 'var(--lab-border)'}`,
                      boxShadow: isSelected ? '0 6px 18px rgba(0,0,0,0.08)' : 'var(--lab-shadow)',
                      cursor: connectSourceId ? 'crosshair' : 'grab',
                      zIndex: isSelected ? 10 : 2
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '3px' }}>
                      {node.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
                      {typeCfg.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Node Inspector */}
            <div className="km-lab-card" style={{ padding: '18px' }}>
              <div style={{ fontWeight: '700', fontSize: '0.96rem', marginBottom: '10px' }}>
                අංග පරීක්ෂකය
              </div>
              <span className="km-lab-tag" style={{ marginBottom: '10px' }}>
                {selectedNode ? (NODE_TYPES[selectedNode.nodeType]?.label || 'අංගය') : 'තොරතුරු'}
              </span>

              {!selectedNode ? (
                <div style={{ fontSize: '0.84rem', color: 'var(--lab-text-muted)', padding: '10px 0' }}>
                  විස්තර බැලීමට සිතියමේ අංගයක් තෝරන්න.
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 6px 0' }}>{selectedNode.label}</h3>
                  {selectedNode.summary && (
                    <p style={{ fontSize: '0.83rem', color: 'var(--lab-text-muted)', margin: '0 0 10px 0', lineHeight: 1.55 }}>
                      {selectedNode.summary}
                    </p>
                  )}
                  <div style={{ padding: '10px', borderRadius: '8px', border: '1px dashed var(--lab-border)', background: 'var(--lab-bg-subtle)', fontSize: '0.78rem', color: 'var(--lab-text-muted)', marginBottom: '12px' }}>
                    {selectedNode.sourceRef || 'පෞද්ගලික ආවර්ජනය'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {selectedNode.suttaKey && (
                      <button onClick={() => navigate(`/lab/sutta/${selectedNode.suttaKey}`)} className="km-lab-btn">
                        <BookOpen size={13} />
                        <span>කියවනයේ විවෘත කරන්න</span>
                      </button>
                    )}
                    <button onClick={() => navigate(`/lab/pin-potha?title=${encodeURIComponent(selectedNode.label)}`)} className="km-lab-btn">
                      <BookHeart size={13} />
                      <span>පින් පොතේ සටහනක් තබන්න</span>
                    </button>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <select className="km-lab-input" style={{ flex: 1, padding: '6px 8px', fontSize: '0.78rem' }} value={connectRelation} onChange={(e) => setConnectRelation(e.target.value)}>
                        {EDGE_RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <button onClick={() => setConnectSourceId(selectedNode.id)} className="km-lab-btn-primary" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>
                        <Link2 size={12} />
                        <span>සම්බන්ධ</span>
                      </button>
                    </div>
                  </div>

                  {connectedEdges.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--lab-border)', paddingTop: '10px', marginBottom: '10px' }}>
                      {connectedEdges.map(edge => {
                        const otherId = edge.sourceNodeId === selectedNode.id ? edge.targetNodeId : edge.sourceNodeId;
                        const other = nodes.find(n => n.id === otherId);
                        return (
                          <div key={edge.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', padding: '5px 0' }}>
                            <span><em>{edge.relationLabel}</em> → {other?.label}</span>
                            <button onClick={() => deleteMapEdge(edge.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--lab-text-muted)' }}>×</button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      deleteMapNode(selectedNode.id);
                      setSelectedNodeId(null);
                    }}
                    className="km-lab-btn"
                    style={{ width: '100%', color: '#DC2626', fontSize: '0.78rem' }}
                  >
                    <Trash2 size={13} />
                    <span>අංගය ඉවත් කරන්න</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OUTLINE */}
      {activeTab === 'outline' && (
        <div className="km-lab-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 12px 0' }}>
            සිතියම් සැකිල්ල ({nodes.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nodes.map(node => (
              <div key={node.id} style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--lab-bg-subtle)', border: '1px solid var(--lab-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{node.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)' }}>
                    {node.sourceRef || (NODE_TYPES[node.nodeType]?.label)}
                  </div>
                </div>
                {node.suttaKey && (
                  <button onClick={() => navigate(`/lab/sutta/${node.suttaKey}`)} className="km-lab-btn" style={{ padding: '5px 10px', fontSize: '0.76rem' }}>
                    සූත්‍රය
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publication Preview Modal */}
      {showPubPreview && (
        <div onClick={() => setShowPubPreview(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} className="km-lab-card" style={{ width: '100%', maxWidth: '520px', padding: '22px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 6px 0' }}>
              ප්‍රකාශන පෙරදසුන
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--lab-text-muted)', margin: '0 0 14px 0', lineHeight: 1.55 }}>
              ඔබේ පින් පොත හා පෞද්ගලික පුරුදු සටහන් කිසිවිටෙකත් ස්වයංක්‍රීයව ප්‍රසිද්ධ නොවේ. පහත සිතියම් අංග පමණක් පොදු ලෙස දිස්වනු ඇත:
            </p>
            <div style={{ maxHeight: '180px', overflowY: 'auto', padding: '10px', borderRadius: '8px', background: 'var(--lab-bg-subtle)', border: '1px solid var(--lab-border)', marginBottom: '16px' }}>
              {nodes.map(n => (
                <div key={n.id} style={{ fontSize: '0.82rem', padding: '4px 0', borderBottom: '1px solid var(--lab-border)' }}>
                  <strong>{n.label}</strong> {n.sourceRef ? `· ${n.sourceRef}` : ''}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setShowPubPreview(false)} className="km-lab-btn">වසන්න</button>
              <button onClick={handleConfirmPublish} className="km-lab-btn-primary">
                {activeMap?.visibility === 'public'
                  ? 'පෞද්ගලික බවට පත් කරන්න'
                  : 'පොදු සිතියමක් ලෙස පළ කරන්න'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
