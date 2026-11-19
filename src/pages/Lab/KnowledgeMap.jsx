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
  BookHeart,
  Network,
  Compass,
  ListTree
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
import PaginationBar from '../../components/Lab/PaginationBar';

export default function KnowledgeMap() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('path'); // 'path' | 'graph' | 'outline'
  const [maps, setMaps] = useState(() => getKnowledgeMaps());
  const [activeMapId, setActiveMapId] = useState(() => getKnowledgeMaps()[0]?.id || '');
  const [nodes, setNodes] = useState(() => getMapNodes(getKnowledgeMaps()[0]?.id));
  const [edges, setEdges] = useState(() => getMapEdges(getKnowledgeMaps()[0]?.id));
  const [annotations, setAnnotations] = useState(() => getRoadmapItems());

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [connectSourceId, setConnectSourceId] = useState(null);
  const [connectRelation, setConnectRelation] = useState(EDGE_RELATIONS[0]);
  const [showAddNode, setShowAddNode] = useState(false);
  const [showImportNotes, setShowImportNotes] = useState(false);
  const [showPubPreview, setShowPubPreview] = useState(false);
  const [outlinePage, setOutlinePage] = useState(1);

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

    window.addEventListener('labKnowledgeMapUpdated', refresh);
    window.addEventListener('studyRoadmapUpdated', refreshNotes);
    return () => {
      window.removeEventListener('labKnowledgeMapUpdated', refresh);
      window.removeEventListener('studyRoadmapUpdated', refreshNotes);
    };
  }, [activeMapId]);

  const handleSelectMap = (id) => {
    setActiveMapId(id);
    setNodes(getMapNodes(id));
    setEdges(getMapEdges(id));
    setSelectedNodeId(null);
    setConnectSourceId(null);
    setOutlinePage(1);
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

  const OUTLINE_PER_PAGE = 5;
  const outlineTotalPages = Math.max(1, Math.ceil(nodes.length / OUTLINE_PER_PAGE));
  const safeOutlinePage = Math.min(outlinePage, outlineTotalPages);
  const pagedOutlineNodes = nodes.slice((safeOutlinePage - 1) * OUTLINE_PER_PAGE, safeOutlinePage * OUTLINE_PER_PAGE);

  return (
    <div className="km-lab-page" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Terracotta Hero & Tab Bar */}
      <div
        style={{
          borderRadius: '14px',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #A35B3D 0%, #B86F4E 100%)',
          color: '#FAF8F5',
          boxShadow: '0 6px 20px rgba(163, 91, 61, 0.16)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 3px 0', fontFamily: 'var(--font-sinhala)' }}>
            මගේ ධර්ම සිතියම
          </h1>
          <div style={{ fontSize: '0.78rem', color: 'rgba(250, 248, 245, 0.88)', fontFamily: 'var(--font-sinhala)' }}>
            ත්‍රිපිටක සූත්‍ර, අධ්‍යයන සටහන් හා ප්‍රතිපදාව එකට ගළපන පෞද්ගලික සිතියම
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.16)', borderRadius: '9px', padding: '3px', gap: '3px' }}>
            {[
              { id: 'path', label: 'මගේ මාර්ගය', icon: Compass },
              { id: 'graph', label: 'ධර්ම සිතියම', icon: Network },
              { id: 'outline', label: 'සැකිල්ල', icon: ListTree }
            ].map(tab => {
              const active = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: '7px',
                    border: 'none',
                    background: active ? '#FAF8F5' : 'transparent',
                    color: active ? '#231F1B' : '#FAF8F5',
                    fontSize: '0.76rem',
                    fontWeight: active ? '700' : '600',
                    fontFamily: 'var(--font-sinhala)',
                    cursor: 'pointer'
                  }}
                >
                  <TabIcon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <select
            aria-label="සිතියම තෝරන්න"
            value={activeMap?.id || ''}
            onChange={(e) => handleSelectMap(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              background: '#FAF8F5',
              color: '#231F1B',
              fontSize: '0.78rem',
              fontWeight: '600',
              fontFamily: 'var(--font-sinhala)',
              outline: 'none'
            }}
          >
            {maps.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowPubPreview(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 11px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.28)',
              background: 'rgba(255,255,255,0.14)',
              color: '#FAF8F5',
              fontSize: '0.76rem',
              fontWeight: '600',
              fontFamily: 'var(--font-sinhala)',
              cursor: 'pointer'
            }}
          >
            {activeMap?.visibility === 'public' ? <Globe size={13} /> : <Lock size={13} />}
            <span>ප්‍රකාශන පෙරදසුන</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY PATH */}
      {activeTab === 'path' && (
        <div className="km-lab-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontWeight: '700', fontSize: '0.96rem', color: 'var(--lab-text)' }}>
              පෞද්ගලික මාර්ග දිශානතිය
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
              අධ්‍යයනය, ප්‍රතිපත්තිය සහ අභ්‍යන්තර ආවර්ජනය අතර සම්බන්ධතාව
            </span>
          </div>

          {/* 1. Ultimate Direction: Nibbana */}
          <div style={{
            maxWidth: '480px',
            width: '100%',
            margin: '0 auto',
            padding: '10px 16px',
            border: '1.5px solid #A35B3D',
            borderRadius: '12px',
            background: 'rgba(163, 91, 61, 0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#A35B3D', marginBottom: '2px' }}>
              පරම දිශානතිය
            </div>
            <div style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--lab-text)' }}>
              නිවන
            </div>
          </div>

          {/* 2. Pativedha — Non-evaluated horizon */}
          <div style={{
            maxWidth: '560px',
            width: '100%',
            margin: '0 auto',
            padding: '9px 14px',
            border: '1px dashed rgba(95, 110, 67, 0.45)',
            borderRadius: '10px',
            background: 'rgba(95, 110, 67, 0.06)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#5F6E43', marginBottom: '2px' }}>
              පටිවේධ — ප්‍රත්යක්ෂ අවබෝධය
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--lab-text-muted)', lineHeight: 1.45 }}>
              ධර්ම සත්‍යය ප්‍රත්‍යක්ෂව අවබෝධ කිරීම — පුද්ගල සටහන් හෝ යෙදුමේ දත්ත මඟින් තීරණය නොකරයි.
            </div>
          </div>

          {/* 3. Mutually Nourishing Cycle: Pariyatti <-> Patipatti */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'stretch'
          }}>
            {/* Pariyatti */}
            <div className="km-lab-card" style={{ flex: '1 1 240px', padding: '12px 14px', background: 'var(--lab-bg-subtle)', borderTop: '3px solid #5F6E43', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#5F6E43', marginBottom: '2px' }}>
                  පරියත්ති
                </div>
                <div style={{ fontWeight: '600', fontSize: '0.78rem', color: 'var(--lab-text)', marginBottom: '4px' }}>
                  ධර්මය ඉගෙනීම හා විමසීම
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--lab-text-muted)', margin: 0, lineHeight: 1.45 }}>
                  සූත්‍ර, අර්ථකථන, ප්‍රශ්න සහ සම්බන්ධතා
                </p>
              </div>
              <button onClick={() => navigate('/lab/sutta')} className="km-lab-btn" style={{ padding: '5px 11px', fontSize: '0.74rem', alignSelf: 'flex-start' }}>
                ධර්ම අධ්‍යයනය ආරම්භ කරන්න
              </button>
            </div>

            {/* Mutual Nourishment Indicator */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 8px',
              textAlign: 'center',
              color: '#A35B3D',
              minWidth: '110px'
            }}>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', lineHeight: 1 }}>↔</div>
              <div style={{ fontSize: '0.69rem', fontWeight: '700', color: 'var(--lab-text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                ඉගෙනීම ↔ ප්‍රතිපත්තිය ↔ ආවර්ජනය
              </div>
            </div>

            {/* Patipatti */}
            <div className="km-lab-card" style={{ flex: '1 1 240px', padding: '12px 14px', background: 'var(--lab-bg-subtle)', borderTop: '3px solid #A35B3D', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#A35B3D', marginBottom: '2px' }}>
                  පටිපත්ති
                </div>
                <div style={{ fontWeight: '600', fontSize: '0.78rem', color: 'var(--lab-text)', marginBottom: '4px' }}>
                  ධර්මය ජීවිතයට එක් කිරීම
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--lab-text-muted)', margin: 0, lineHeight: 1.45 }}>
                  සීලය, සමාධිය, ප්‍රඥාව, ජීවන පුරුදු සහ ප්‍රතිපත්ති ආවර්ජන
                </p>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/lab/compass')} className="km-lab-btn" style={{ padding: '5px 10px', fontSize: '0.73rem' }}>
                  අද ප්‍රතිපදාව සටහන් කරන්න
                </button>
                <button onClick={() => navigate('/lab/pin-potha')} className="km-lab-btn" style={{ padding: '5px 10px', fontSize: '0.73rem' }}>
                  පින් පොත හා ආවර්ජන
                </button>
              </div>
            </div>
          </div>

          {/* 4. Current Self-Reflection & Map Connection */}
          <div style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--lab-text)' }}>
                මගේ වත්මන් ස්වයං ආවර්ජනය
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('graph')}
                className="km-lab-btn-primary"
                style={{ padding: '4px 11px', fontSize: '0.73rem' }}
              >
                ධර්ම සිතියමේ සම්බන්ධතා විමසන්න →
              </button>
            </div>

            <div style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: '#FAF8F5',
              borderLeft: '3px solid #A35B3D',
              fontSize: '0.78rem',
              color: 'var(--lab-text)',
              lineHeight: 1.5
            }}>
              මට දැන් පැහැදිලි දේ, තවම ගැටලු ඇති දේ සහ වෙනස් කිරීමට අවශ්‍ය දේ
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KNOWLEDGE GRAPH */}
      {activeTab === 'graph' && (
        <div>
          <div className="km-lab-card" style={{ padding: '10px 14px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => setShowAddNode(v => !v)} className="km-lab-btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                <Plus size={13} />
                <span>නව අංගයක්</span>
              </button>
              <button onClick={() => setShowImportNotes(v => !v)} className="km-lab-btn" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
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

          <div className="km-lab-bottom-grid" style={{ alignItems: 'start' }}>
            {/* Dotted Graph Canvas */}
            <div
              ref={canvasRef}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onPointerLeave={handleCanvasPointerUp}
              className="km-lab-card"
              style={{
                position: 'relative',
                height: '340px',
                overflow: 'auto',
                backgroundImage: 'radial-gradient(rgba(163, 91, 61, 0.22) 1.2px, transparent 1.2px)',
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
                    <line key={edge.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#A35B3D" strokeOpacity="0.45" strokeWidth="1.8" />
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
                      borderRadius: '10px',
                      background: 'var(--lab-bg-elevated)',
                      border: `1.5px solid ${isSelected ? typeCfg.color : 'var(--lab-border)'}`,
                      borderLeft: `4px solid ${typeCfg.color}`,
                      boxShadow: isSelected ? '0 6px 18px rgba(35, 31, 27, 0.12)' : 'var(--lab-shadow)',
                      cursor: connectSourceId ? 'crosshair' : 'grab',
                      zIndex: isSelected ? 10 : 2
                    }}
                  >
                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '3px' }}>
                      {node.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: typeCfg.color, fontWeight: '600' }}>
                      {typeCfg.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Node Inspector */}
            <div className="km-lab-card" style={{ padding: '14px 16px', height: '340px', overflowY: 'auto' }}>
              <div style={{ fontWeight: '700', fontSize: '0.94rem', marginBottom: '8px' }}>
                අංග පරීක්ෂකය
              </div>
              <span className="km-lab-tag" style={{ marginBottom: '10px' }}>
                {selectedNode ? (NODE_TYPES[selectedNode.nodeType]?.label || 'අංගය') : 'තොරතුරු'}
              </span>

              {!selectedNode ? (
                <div style={{ fontSize: '0.82rem', color: 'var(--lab-text-muted)', padding: '10px 0' }}>
                  විස්තර බැලීමට සිතියමේ අංගයක් තෝරන්න.
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: '700', margin: '0 0 6px 0' }}>{selectedNode.label}</h3>
                  {selectedNode.summary && (
                    <p style={{ fontSize: '0.81rem', color: 'var(--lab-text-muted)', margin: '0 0 10px 0', lineHeight: 1.55 }}>
                      {selectedNode.summary}
                    </p>
                  )}
                  <div style={{ padding: '9px 10px', borderRadius: '8px', border: '1px dashed var(--lab-border)', background: 'var(--lab-bg-subtle)', fontSize: '0.76rem', color: 'var(--lab-text-muted)', marginBottom: '12px' }}>
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
                      <select className="km-lab-input" style={{ flex: 1, padding: '6px 8px', fontSize: '0.76rem' }} value={connectRelation} onChange={(e) => setConnectRelation(e.target.value)}>
                        {EDGE_RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <button onClick={() => setConnectSourceId(selectedNode.id)} className="km-lab-btn-primary" style={{ padding: '6px 10px', fontSize: '0.76rem' }}>
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
                          <div key={edge.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '4px 0' }}>
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
                    style={{ width: '100%', color: '#B91C1C', fontSize: '0.78rem' }}
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
        <div className="km-lab-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '0.96rem', fontWeight: '700', margin: 0 }}>
            සිතියම් සැකිල්ල ({nodes.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {pagedOutlineNodes.map(node => {
              const typeCfg = NODE_TYPES[node.nodeType] || NODE_TYPES.concept;
              return (
                <div
                  key={node.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '9px',
                    background: 'var(--lab-bg-subtle)',
                    border: '1px solid var(--lab-border)',
                    borderLeft: `4px solid ${typeCfg.color}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{node.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--lab-text-muted)' }}>
                      {node.sourceRef || typeCfg.label}
                    </div>
                  </div>
                  {node.suttaKey && (
                    <button onClick={() => navigate(`/lab/sutta/${node.suttaKey}`)} className="km-lab-btn" style={{ padding: '5px 10px', fontSize: '0.75rem' }}>
                      සූත්‍රය
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <PaginationBar page={safeOutlinePage} totalPages={outlineTotalPages} onPageChange={setOutlinePage} compact />
        </div>
      )}

      {/* Add Node Modal */}
      {showAddNode && (
        <div onClick={() => setShowAddNode(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(35, 31, 27, 0.48)', backdropFilter: 'blur(3px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} className="km-lab-card" style={{ width: '100%', maxWidth: '460px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>නව අංගයක් එක් කරන්න</h3>
              <button type="button" onClick={() => setShowAddNode(false)} className="km-lab-btn" style={{ padding: '4px 8px' }}><X size={15} /></button>
            </div>
            <form onSubmit={handleAddNode} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <select className="km-lab-input" value={newNodeType} onChange={(e) => setNewNodeType(e.target.value)}>
                {Object.values(NODE_TYPES).map(tItem => (
                  <option key={tItem.id} value={tItem.id}>{tItem.label}</option>
                ))}
              </select>
              <input className="km-lab-input" required placeholder="මාතෘකාව" value={newNodeLabel} onChange={(e) => setNewNodeLabel(e.target.value)} />
              <input className="km-lab-input" placeholder="ත්‍රිපිටක මූලාශ්‍රය (උදා: සං.නි. 56.11)" value={newNodeSourceRef} onChange={(e) => setNewNodeSourceRef(e.target.value)} />
              <input className="km-lab-input" placeholder="විස්තරය" value={newNodeSummary} onChange={(e) => setNewNodeSummary(e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
                <button type="button" className="km-lab-btn" onClick={() => setShowAddNode(false)}>වසන්න</button>
                <button type="submit" className="km-lab-btn-primary">සුරකින්න</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Notes Modal */}
      {showImportNotes && (
        <div onClick={() => setShowImportNotes(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(35, 31, 27, 0.48)', backdropFilter: 'blur(3px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} className="km-lab-card" style={{ width: '100%', maxWidth: '520px', maxHeight: '80vh', overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.96rem' }}>සූත්‍ර සටහන් සිතියමට එක් කරන්න</strong>
              <button type="button" onClick={() => setShowImportNotes(false)} className="km-lab-btn" style={{ padding: '4px 8px' }}><X size={15} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {annotations.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--lab-text-muted)', background: 'var(--lab-bg-subtle)', borderRadius: '8px' }}>
                  තවමත් සූත්‍ර සටහන් නොමැත.
                </div>
              ) : annotations.map(anno => {
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
                      style={{ padding: '4px 10px', fontSize: '0.74rem', flexShrink: 0 }}
                    >
                      {added ? 'එක් කළා' : '+ එක් කරන්න'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Publication Preview Modal */}
      {showPubPreview && (
        <div onClick={() => setShowPubPreview(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(35, 31, 27, 0.48)', backdropFilter: 'blur(3px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} className="km-lab-card" style={{ width: '100%', maxWidth: '520px', padding: '20px 22px' }}>
            <h2 style={{ fontSize: '1.06rem', fontWeight: '700', margin: '0 0 6px 0' }}>
              ප්‍රකාශන පෙරදසුන
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--lab-text-muted)', margin: '0 0 12px 0', lineHeight: 1.55 }}>
              ඔබේ පින් පොත හා පෞද්ගලික පුරුදු සටහන් කිසිවිටෙකත් ස්වයංක්‍රීයව ප්‍රසිද්ධ නොවේ. පහත සිතියම් අංග පමණක් පොදු ලෙස දිස්වනු ඇත:
            </p>
            <div style={{ maxHeight: '180px', overflowY: 'auto', padding: '10px', borderRadius: '8px', background: 'var(--lab-bg-subtle)', border: '1px solid var(--lab-border)', marginBottom: '14px' }}>
              {nodes.map(n => (
                <div key={n.id} style={{ fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px solid var(--lab-border)' }}>
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
