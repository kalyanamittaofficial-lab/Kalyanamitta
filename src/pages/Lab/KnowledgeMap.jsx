import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Link2,
  Trash2,
  BookOpen,
  FileText,
  X,
  BookHeart,
  Network,
  Compass,
  ListTree,
  MapPin,
  Lightbulb,
  Calendar,
  Check,
  Play,
  ArrowRight,
  TrendingUp,
  Settings2,
  ChevronsRight
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
import { getPathReflections } from '../../services/practiceEcosystemStore';
import { getRoutineHabits, getRoutineLogForDate, getRoutineCategorySeries } from '../../services/dailyRoutineStore';
import { getTodayKey } from '../../services/cittaLogStore';
import PaginationBar from '../../components/Lab/PaginationBar';

const JOURNEY_STAGES = [
  {
    id: '01',
    title: 'Notice',
    focus: 'Recognize bodily sensations, thoughts, and reactions as they arise in daily experience.',
    progressPct: 100,
    completed: 5,
    inProgress: 0,
    notStarted: 0,
    nextActionTitle: 'Complete: Mindful Noting',
    nextActionSub: 'Observe three daily triggers without reacting.',
    subpaths: [
      { id: 'study', label: 'Study Path', desc: 'Foundational suttas', done: 6, total: 6, to: '/lab/sutta', tint: 'rgba(11, 59, 250, 0.06)', iconBg: 'rgba(11, 59, 250, 0.12)', iconColor: '#0B3BFA' },
      { id: 'conduct', label: 'Conduct Path', desc: 'Virtue & restraint', done: 5, total: 5, to: '/lab/pin-potha', tint: 'rgba(245, 158, 11, 0.08)', iconBg: 'rgba(245, 158, 11, 0.16)', iconColor: '#B45309' },
      { id: 'routine', label: 'Routine Path', desc: 'Daily habits', done: 6, total: 6, to: '/lab/daily-routine', tint: 'rgba(59, 130, 246, 0.06)', iconBg: 'rgba(59, 130, 246, 0.14)', iconColor: '#2563EB' },
      { id: 'reflection', label: 'Reflection Path', desc: 'Self-observation', done: 4, total: 4, to: '/lab/reflection', tint: 'rgba(16, 185, 129, 0.07)', iconBg: 'rgba(16, 185, 129, 0.15)', iconColor: '#059669' }
    ]
  },
  {
    id: '02',
    title: 'Understand',
    focus: 'See clearly how experience works — its causes, conditions, and results.',
    progressPct: 68,
    completed: 4,
    inProgress: 2,
    notStarted: 0,
    nextActionTitle: 'Complete: Causes & Conditions',
    nextActionSub: 'Understand conditionality and how experience arises.',
    subpaths: [
      { id: 'study', label: 'Study Path', desc: 'Sutta inquiry & mapping', done: 3, total: 6, to: '/lab/sutta', tint: 'rgba(11, 59, 250, 0.06)', iconBg: 'rgba(11, 59, 250, 0.12)', iconColor: '#0B3BFA' },
      { id: 'conduct', label: 'Conduct Path', desc: 'Merit & wholesome action', done: 2, total: 5, to: '/lab/pin-potha', tint: 'rgba(245, 158, 11, 0.08)', iconBg: 'rgba(245, 158, 11, 0.16)', iconColor: '#B45309' },
      { id: 'routine', label: 'Routine Path', desc: 'Daily Dhamma rhythm', done: 4, total: 6, to: '/lab/daily-routine', tint: 'rgba(59, 130, 246, 0.06)', iconBg: 'rgba(59, 130, 246, 0.14)', iconColor: '#2563EB' },
      { id: 'reflection', label: 'Reflection Path', desc: 'Pattern investigation', done: 2, total: 4, to: '/lab/reflection', tint: 'rgba(16, 185, 129, 0.07)', iconBg: 'rgba(16, 185, 129, 0.15)', iconColor: '#059669' }
    ]
  },
  {
    id: '03',
    title: 'Practice',
    focus: 'Translate understanding into repeated, deliberate training in meditation and conduct.',
    progressPct: 35,
    completed: 2,
    inProgress: 2,
    notStarted: 2,
    nextActionTitle: 'Practice: Breath & Posture',
    nextActionSub: 'Commit to 20 minutes of steady Ānāpānasati.',
    subpaths: [
      { id: 'study', label: 'Study Path', desc: 'Satipaṭṭhāna practice', done: 2, total: 6, to: '/lab/sutta', tint: 'rgba(11, 59, 250, 0.06)', iconBg: 'rgba(11, 59, 250, 0.12)', iconColor: '#0B3BFA' },
      { id: 'conduct', label: 'Conduct Path', desc: 'Right speech & action', done: 2, total: 5, to: '/lab/pin-potha', tint: 'rgba(245, 158, 11, 0.08)', iconBg: 'rgba(245, 158, 11, 0.16)', iconColor: '#B45309' },
      { id: 'routine', label: 'Routine Path', desc: 'Consistent sessions', done: 3, total: 6, to: '/lab/daily-routine', tint: 'rgba(59, 130, 246, 0.06)', iconBg: 'rgba(59, 130, 246, 0.14)', iconColor: '#2563EB' },
      { id: 'reflection', label: 'Reflection Path', desc: 'Evening review', done: 1, total: 4, to: '/lab/reflection', tint: 'rgba(16, 185, 129, 0.07)', iconBg: 'rgba(16, 185, 129, 0.15)', iconColor: '#059669' }
    ]
  },
  {
    id: '04',
    title: 'Stabilize',
    focus: 'Build continuity of mindfulness and emotional steadiness across changing conditions.',
    progressPct: 15,
    completed: 1,
    inProgress: 1,
    notStarted: 4,
    nextActionTitle: 'Stabilize: Daily Rhythm',
    nextActionSub: 'Keep morning and evening anchors uninterrupted.',
    subpaths: [
      { id: 'study', label: 'Study Path', desc: 'Samādhi discourses', done: 1, total: 6, to: '/lab/sutta', tint: 'rgba(11, 59, 250, 0.06)', iconBg: 'rgba(11, 59, 250, 0.12)', iconColor: '#0B3BFA' },
      { id: 'conduct', label: 'Conduct Path', desc: 'Sense restraint', done: 1, total: 5, to: '/lab/pin-potha', tint: 'rgba(245, 158, 11, 0.08)', iconBg: 'rgba(245, 158, 11, 0.16)', iconColor: '#B45309' },
      { id: 'routine', label: 'Routine Path', desc: '7-day continuity', done: 1, total: 6, to: '/lab/daily-routine', tint: 'rgba(59, 130, 246, 0.06)', iconBg: 'rgba(59, 130, 246, 0.14)', iconColor: '#2563EB' },
      { id: 'reflection', label: 'Reflection Path', desc: 'Equanimity notes', done: 0, total: 4, to: '/lab/reflection', tint: 'rgba(16, 185, 129, 0.07)', iconBg: 'rgba(16, 185, 129, 0.15)', iconColor: '#059669' }
    ]
  },
  {
    id: '05',
    title: 'Serve',
    focus: 'Express clarity and compassion through generosity, merit sharing, and service.',
    progressPct: 10,
    completed: 0,
    inProgress: 1,
    notStarted: 5,
    nextActionTitle: 'Serve: Merit & Generosity',
    nextActionSub: 'Log an intentional act of dāna or service.',
    subpaths: [
      { id: 'study', label: 'Study Path', desc: 'Brahmavihāra suttas', done: 1, total: 6, to: '/lab/sutta', tint: 'rgba(11, 59, 250, 0.06)', iconBg: 'rgba(11, 59, 250, 0.12)', iconColor: '#0B3BFA' },
      { id: 'conduct', label: 'Conduct Path', desc: 'Dāna & dedication', done: 1, total: 5, to: '/lab/dedication', tint: 'rgba(245, 158, 11, 0.08)', iconBg: 'rgba(245, 158, 11, 0.16)', iconColor: '#B45309' },
      { id: 'routine', label: 'Routine Path', desc: 'Care & kindness', done: 0, total: 6, to: '/lab/daily-routine', tint: 'rgba(59, 130, 246, 0.06)', iconBg: 'rgba(59, 130, 246, 0.14)', iconColor: '#2563EB' },
      { id: 'reflection', label: 'Reflection Path', desc: 'Non-self in action', done: 0, total: 4, to: '/lab/reflection', tint: 'rgba(16, 185, 129, 0.07)', iconBg: 'rgba(16, 185, 129, 0.15)', iconColor: '#059669' }
    ]
  },
  {
    id: '06',
    title: 'Integrate',
    focus: 'Live with Dhamma naturally woven into every decision, relationship, and quiet moment.',
    progressPct: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 6,
    nextActionTitle: 'Integrate: Whole-Life View',
    nextActionSub: 'Connect study, practice, and everyday life.',
    subpaths: [
      { id: 'study', label: 'Study Path', desc: 'Synthesis & maps', done: 0, total: 6, to: '/lab/sutta', tint: 'rgba(11, 59, 250, 0.06)', iconBg: 'rgba(11, 59, 250, 0.12)', iconColor: '#0B3BFA' },
      { id: 'conduct', label: 'Conduct Path', desc: 'Natural virtue', done: 0, total: 5, to: '/lab/pin-potha', tint: 'rgba(245, 158, 11, 0.08)', iconBg: 'rgba(245, 158, 11, 0.16)', iconColor: '#B45309' },
      { id: 'routine', label: 'Routine Path', desc: 'Effortless rhythm', done: 0, total: 6, to: '/lab/daily-routine', tint: 'rgba(59, 130, 246, 0.06)', iconBg: 'rgba(59, 130, 246, 0.14)', iconColor: '#2563EB' },
      { id: 'reflection', label: 'Reflection Path', desc: 'Clear seeing', done: 0, total: 4, to: '/lab/reflection', tint: 'rgba(16, 185, 129, 0.07)', iconBg: 'rgba(16, 185, 129, 0.15)', iconColor: '#059669' }
    ]
  }
];

function formatDurationCompact(mins) {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function KnowledgeMap() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('path'); // 'path' | 'graph' | 'outline'
  const [activeStageId, setActiveStageId] = useState('02');
  const [maps, setMaps] = useState(() => getKnowledgeMaps());
  const [activeMapId] = useState(() => getKnowledgeMaps()[0]?.id || '');
  const [nodes, setNodes] = useState(() => getMapNodes(getKnowledgeMaps()[0]?.id));
  const [edges, setEdges] = useState(() => getMapEdges(getKnowledgeMaps()[0]?.id));
  const [annotations, setAnnotations] = useState(() => getRoadmapItems());
  const [reflections, setReflections] = useState(() => getPathReflections());
  const [habits, setHabits] = useState(() => getRoutineHabits());
  const [todayLog, setTodayLog] = useState(() => getRoutineLogForDate(getTodayKey()));
  const [weekSeries, setWeekSeries] = useState(() => getRoutineCategorySeries(7));

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
    const refreshPractice = () => setReflections(getPathReflections());
    const refreshRoutine = () => {
      setHabits(getRoutineHabits());
      setTodayLog(getRoutineLogForDate(getTodayKey()));
      setWeekSeries(getRoutineCategorySeries(7));
    };

    window.addEventListener('labKnowledgeMapUpdated', refresh);
    window.addEventListener('studyRoadmapUpdated', refreshNotes);
    window.addEventListener('labPracticeUpdated', refreshPractice);
    window.addEventListener('labRoutineUpdated', refreshRoutine);
    return () => {
      window.removeEventListener('labKnowledgeMapUpdated', refresh);
      window.removeEventListener('studyRoadmapUpdated', refreshNotes);
      window.removeEventListener('labPracticeUpdated', refreshPractice);
      window.removeEventListener('labRoutineUpdated', refreshRoutine);
    };
  }, [activeMapId]);

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

  const activeStage = JOURNEY_STAGES.find(s => s.id === activeStageId) || JOURNEY_STAGES[1];
  const overallJourneyPct = Math.round(
    JOURNEY_STAGES.reduce((acc, s) => acc + s.progressPct, 0) / JOURNEY_STAGES.length
  );
  const checkedHabitsCount = todayLog?.checkedIds?.length || 0;
  const todayTotalMins = habits
    .filter(h => (todayLog?.checkedIds || []).includes(h.id))
    .reduce((acc, h) => acc + (todayLog?.taskLogs?.[h.id]?.minutes ?? h.minutes ?? 15), 0);
  const activeWeekDays = weekSeries.filter(d => (d.totalMinutes || 0) > 0).length;

  const recentInsightsList = reflections.length > 0
    ? reflections.slice(0, 3).map(r => ({
        id: r.id,
        text: r.intention,
        time: (r.createdAt || '').slice(5, 10) || 'Recent'
      }))
    : [
        { id: 'i1', text: 'Experience arises through causes and conditions.', time: '2h ago' },
        { id: 'i2', text: 'Noticing early softens impulsive reactions.', time: '1d ago' },
        { id: 'i3', text: 'Saw how habits and thought patterns reinforce each other.', time: '2d ago' }
      ];

  const overallRingR = 20;
  const overallRingC = 2 * Math.PI * overallRingR;
  const currentPosR = 34;
  const currentPosC = 2 * Math.PI * currentPosR;
  const stageRingR = 22;
  const stageRingC = 2 * Math.PI * stageRingR;

  return (
    <div className="km-lab-page" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.82fr) minmax(270px, 1fr)',
        gap: '12px',
        alignItems: 'stretch'
      }}>
        {/* LEFT MAIN COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', minWidth: 0 }}>
          {/* Hero */}
          <div className="po-hero-left" style={{ padding: '2px 6px 2px 2px', position: 'relative', overflow: 'hidden' }}>
            <div className="po-hero-shape" aria-hidden="true" style={{ right: '8px', top: '-18px' }}>
              <div className="po-hero-stripe" />
              <div className="po-hero-arc" style={{ width: '150px', height: '150px', left: '14px', top: '40px' }} />
              <div className="po-hero-arc" style={{ width: '110px', height: '110px', left: '34px', top: '60px' }} />
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: '900', letterSpacing: '0.08em', color: 'var(--lab-text-muted)', marginBottom: '2px', position: 'relative', zIndex: 1 }}>
              MY MAP
            </div>
            <h1 style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 'clamp(1.45rem, 2.2vw, 1.95rem)',
              fontWeight: '900',
              letterSpacing: '-0.04em',
              lineHeight: 1.04,
              margin: '0 0 4px 0',
              color: 'var(--lab-text)'
            }}>
              My Dhamma <span style={{ color: 'var(--po-blue, #0B3BFA)' }}>Journey</span><span style={{ color: '#c6ff24' }}>.</span>
            </h1>
            <p style={{ position: 'relative', zIndex: 1, margin: 0, fontSize: '0.78rem', color: 'var(--lab-text-muted)', lineHeight: 1.38, maxWidth: '470px' }}>
              From understanding, through practice and steadiness, to living the Dhamma every day.
            </p>
          </div>

          {/* Summary Stats Strip */}
          <div className="km-po-card" style={{
            borderRadius: '18px',
            padding: '7px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative', width: '42px', height: '42px', flexShrink: 0 }}>
                <svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="25" cy="25" r={overallRingR} fill="none" stroke="var(--po-track)" strokeWidth="5" />
                  <circle
                    cx="25"
                    cy="25"
                    r={overallRingR}
                    fill="none"
                    stroke="#c6ff24"
                    strokeWidth="5"
                    strokeDasharray={`${(overallJourneyPct / 100) * overallRingC} ${overallRingC}`}
                  />
                </svg>
                <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: '0.68rem', fontWeight: '900', color: 'var(--lab-text)' }}>
                  {overallJourneyPct}%
                </span>
              </div>
              <div>
                <div style={{ fontSize: '0.77rem', fontWeight: '800', color: 'var(--lab-text)' }}>Overall Journey</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--lab-text-muted)' }}>6-stage path view</div>
              </div>
            </div>

            <div style={{ height: '26px', width: '1px', background: 'var(--po-card-border)' }} />

            {[
              { value: '6', label: 'Stages' },
              { value: '4', label: 'Subpaths' },
              { value: '18', label: 'Practice Areas' }
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center', padding: '0 4px' }}>
                <div style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--lab-text)', lineHeight: 1.05 }}>{stat.value}</div>
                <div style={{ fontSize: '0.64rem', color: 'var(--lab-text-muted)', fontWeight: '600' }}>{stat.label}</div>
              </div>
            ))}

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 11px',
              borderRadius: '12px',
              background: 'rgba(198, 255, 36, 0.28)',
              color: '#181A1F'
            }}>
              <TrendingUp size={15} color="#181A1F" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '900', lineHeight: 1 }}>+12%</div>
                <div style={{ fontSize: '0.62rem', fontWeight: '700' }}>Progress (30d)</div>
              </div>
            </div>
          </div>

          {/* THE PATH JOURNEY MAP CARD */}
          <div className="km-po-card" style={{ borderRadius: '20px', padding: '12px 15px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Network size={17} color="var(--po-blue, #0B3BFA)" />
                <div>
                  <h2 style={{ fontSize: '0.92rem', fontWeight: '850', margin: 0, color: 'var(--lab-text)' }}>
                    The Path Journey Map
                  </h2>
                  <div style={{ fontSize: '0.69rem', color: 'var(--lab-text-muted)' }}>
                    A structured journey from awareness to integration.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                {[
                  { id: 'path', label: 'Journey Map', icon: Compass },
                  { id: 'graph', label: 'Knowledge Graph', icon: Network },
                  { id: 'outline', label: 'Outline', icon: ListTree }
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
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: `1px solid ${active ? 'transparent' : 'var(--po-card-border)'}`,
                        background: active ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-subtle)',
                        color: active ? '#FFFFFF' : 'var(--lab-text)',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      <TabIcon size={11} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: JOURNEY MAP */}
            {activeTab === 'path' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 6-Stage Horizontal Stepper */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '7px', alignItems: 'stretch' }}>
                  {JOURNEY_STAGES.map((stage, idx) => {
                    const isSelected = stage.id === activeStage.id;
                    const isDone = stage.progressPct === 100;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => setActiveStageId(stage.id)}
                        style={{
                          position: 'relative',
                          textAlign: 'left',
                          padding: '7px 8px 6px',
                          borderRadius: '12px',
                          border: `1px solid ${isSelected ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-border)'}`,
                          background: isSelected ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-subtle)',
                          color: isSelected ? '#FFFFFF' : 'var(--lab-text)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isDone && (
                          <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '5px',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#c6ff24',
                            color: '#101214',
                            display: 'grid',
                            placeItems: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                          }}>
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}
                        <div style={{ fontSize: '0.67rem', fontWeight: '800', opacity: isSelected ? 0.9 : 0.65, marginBottom: '1px' }}>
                          {stage.id}
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: '800', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {stage.title}
                        </div>
                        <div style={{ fontSize: '0.61rem', opacity: isSelected ? 0.85 : 0.65, marginTop: '1px' }}>
                          {idx === 0 ? 'Completed' : isSelected ? 'Active Stage' : `${stage.progressPct}%`}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 4 Subpaths Tree */}
                <div style={{
                  position: 'relative',
                  paddingLeft: '20px',
                  marginLeft: '12px',
                  borderLeft: '2px solid var(--po-blue, #0B3BFA)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {activeStage.subpaths.map(sub => {
                    const pct = Math.round((sub.done / Math.max(1, sub.total)) * 100);
                    return (
                      <div
                        key={sub.id}
                        onClick={() => navigate(sub.to)}
                        style={{
                          position: 'relative',
                          display: 'grid',
                          gridTemplateColumns: 'minmax(160px, 1.3fr) minmax(90px, 1fr) auto auto',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '6px 10px',
                          borderRadius: '12px',
                          background: sub.tint,
                          border: '1px solid var(--po-card-border)',
                          cursor: 'pointer'
                        }}
                      >
                        <span aria-hidden="true" style={{
                          position: 'absolute',
                          left: '-20px',
                          top: '50%',
                          width: '20px',
                          height: '2px',
                          background: 'var(--po-blue, #0B3BFA)'
                        }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '7px',
                            background: sub.iconBg,
                            color: sub.iconColor,
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0
                          }}>
                            <BookOpen size={12} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--lab-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {sub.label}
                            </div>
                            <div style={{ fontSize: '0.64rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {sub.desc}
                            </div>
                          </div>
                        </div>

                        <div style={{ height: '6px', borderRadius: '999px', background: 'var(--po-track)', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', borderRadius: '999px', background: '#c6ff24' }} />
                        </div>

                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--lab-text)', fontVariantNumeric: 'tabular-nums' }}>
                          {sub.done} / {sub.total}
                        </span>

                        <span style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'var(--po-card-bg)',
                          border: '1px solid var(--po-card-border)',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--lab-text)'
                        }}>
                          <Play size={9} fill="currentColor" />
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Current Stage Card */}
                <div style={{
                  borderRadius: '16px',
                  border: '1px solid var(--po-card-border)',
                  background: 'var(--po-card-subtle)',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(160px, 0.9fr) minmax(200px, 1.35fr) minmax(165px, 0.95fr)',
                  alignItems: 'stretch'
                }}>
                  <div style={{
                    background: 'var(--po-blue, #0B3BFA)',
                    color: '#FFFFFF',
                    padding: '10px 14px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div aria-hidden="true" style={{
                      position: 'absolute',
                      right: '-18px',
                      bottom: '-18px',
                      width: '54px',
                      height: '54px',
                      borderTop: '4px solid #c6ff24',
                      borderLeft: '4px solid #c6ff24',
                      transform: 'rotate(-20deg)'
                    }} />
                    <div style={{ fontSize: '0.68rem', fontWeight: '700', opacity: 0.85, marginBottom: '1px' }}>Current Stage</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '900', letterSpacing: '-0.02em' }}>
                      {activeStage.id}. {activeStage.title}
                    </div>
                  </div>

                  <div style={{ padding: '9px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '800', color: 'var(--lab-text)' }}>
                      <Settings2 size={13} color="var(--po-blue, #0B3BFA)" />
                      <span>Stage Focus</span>
                    </div>
                    <div style={{ fontSize: '0.69rem', color: 'var(--lab-text-muted)', lineHeight: 1.35 }}>
                      {activeStage.focus}
                    </div>
                  </div>

                  <div style={{ padding: '9px 12px', borderLeft: '1px solid var(--po-card-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ position: 'relative', width: '46px', height: '46px', flexShrink: 0 }}>
                      <svg viewBox="0 0 54 54" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <circle cx="27" cy="27" r={stageRingR} fill="none" stroke="var(--po-track)" strokeWidth="5.5" />
                        <circle
                          cx="27"
                          cy="27"
                          r={stageRingR}
                          fill="none"
                          stroke="#c6ff24"
                          strokeWidth="5.5"
                          strokeDasharray={`${(activeStage.progressPct / 100) * stageRingC} ${stageRingC}`}
                        />
                      </svg>
                      <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: '0.68rem', fontWeight: '900', color: 'var(--lab-text)' }}>
                        {activeStage.progressPct}%
                      </span>
                    </div>

                    <div style={{ flex: 1, display: 'grid', gap: '2px', fontSize: '0.66rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--lab-text-muted)' }}>
                        <span>Completed</span>
                        <strong style={{ color: 'var(--lab-text)' }}>{activeStage.completed}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--lab-text-muted)' }}>
                        <span>In Progress</span>
                        <strong style={{ color: 'var(--lab-text)' }}>{activeStage.inProgress}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--lab-text-muted)' }}>
                        <span>Not Started</span>
                        <strong style={{ color: 'var(--lab-text)' }}>{activeStage.notStarted}</strong>
                      </div>
                    </div>
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
                      <span>Log in Merit Book</span>
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
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '9px', minWidth: 0 }}>
          {/* Current Position (Dark Obsidian Card) */}
          <article style={{
            background: '#101216',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '11px 14px',
            border: '1px solid #262930',
            display: 'flex',
            flexDirection: 'column',
            gap: '7px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <MapPin size={15} color="#FFFFFF" />
              <span style={{ fontSize: '0.88rem', fontWeight: '800' }}>Current Position</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ position: 'relative', width: '68px', height: '68px', flexShrink: 0 }}>
                <svg viewBox="0 0 84 84" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="42" cy="42" r={currentPosR} fill="none" stroke="#2D3139" strokeWidth="8.5" />
                  <circle
                    cx="42"
                    cy="42"
                    r={currentPosR}
                    fill="none"
                    stroke="#c6ff24"
                    strokeWidth="8.5"
                    strokeDasharray={`${(overallJourneyPct / 100) * currentPosC} ${currentPosC}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: '1rem', fontWeight: '900', color: '#FFFFFF' }}>
                  {overallJourneyPct}%
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#c6ff24', marginBottom: '1px' }}>
                  Stage {activeStage.id} / 06
                </div>
                <div style={{ fontSize: '1.12rem', fontWeight: '900', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {activeStage.title}
                </div>
              </div>
            </div>
          </article>

          {/* Next Step (Lime Card) */}
          <article style={{
            background: '#c6ff24',
            color: '#101214',
            borderRadius: '18px',
            padding: '9px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', fontWeight: '900' }}>
              <ChevronsRight size={15} />
              <span>Next Step</span>
            </div>

            <div style={{
              background: '#FFFFFF',
              color: '#0F1115',
              borderRadius: '12px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.76rem', fontWeight: '800', marginBottom: '1px' }}>
                  {activeStage.nextActionTitle}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#5B6474', lineHeight: 1.3 }}>
                  {activeStage.nextActionSub}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/lab/sutta')}
                aria-label="Open next step"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#0B3BFA',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <ArrowRight size={13} />
              </button>
            </div>
          </article>

          {/* Recent Insights */}
          <article className="km-po-card" style={{ borderRadius: '18px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: '800', color: 'var(--lab-text)' }}>
                <Lightbulb size={15} color="var(--lab-text)" />
                <span>Recent Insights</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/lab/reflection')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '999px',
                  border: '1px solid var(--po-card-border)',
                  background: 'var(--po-card-subtle)',
                  color: 'var(--lab-text)',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                View All ({reflections.length || 3}) →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {recentInsightsList.map(ins => (
                <div key={ins.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '0.71rem' }}>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#c6ff24',
                    color: '#101214',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    marginTop: '1px'
                  }}>
                    <Check size={9} strokeWidth={3} />
                  </span>
                  <span style={{ flex: 1, color: 'var(--lab-text)', fontWeight: '600', lineHeight: 1.28 }}>
                    {ins.text}
                  </span>
                  <span style={{ fontSize: '0.63rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap' }}>
                    {ins.time}
                  </span>
                </div>
              ))}
            </div>
          </article>

          {/* Linked Daily Routine */}
          <article className="km-po-card" style={{ borderRadius: '18px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '7px', flex: 1, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: '800', color: 'var(--lab-text)' }}>
                <Calendar size={15} color="var(--po-blue, #0B3BFA)" />
                <span>Linked Daily Routine</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/lab/daily-routine')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '999px',
                  border: '1px solid var(--po-card-border)',
                  background: 'var(--po-card-subtle)',
                  color: 'var(--lab-text)',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Open Routine →
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '6px 9px',
              borderRadius: '10px',
              background: 'var(--po-card-subtle)',
              border: '1px solid var(--po-card-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', minWidth: 0 }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#c6ff24', color: '#101214', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Check size={9} strokeWidth={3} />
                </span>
                <span style={{ color: 'var(--lab-text)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Today: {formatDurationCompact(todayTotalMins)} ({checkedHabitsCount}/{habits.length} tasks)
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/lab/daily-routine')}
                style={{
                  padding: '2px 7px',
                  borderRadius: '999px',
                  border: '1px solid var(--po-card-border)',
                  background: 'var(--po-card-bg)',
                  color: 'var(--lab-text)',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                View Tasks
              </button>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.69rem', marginBottom: '5px' }}>
                <span style={{ fontWeight: '700', color: 'var(--lab-text)' }}>Weekly Practice Rhythm</span>
                <span style={{ color: 'var(--lab-text-muted)', fontWeight: '700' }}>{activeWeekDays} / 7 days</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', alignItems: 'end', height: '42px' }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((lbl, idx) => {
                  const dayItem = weekSeries[idx];
                  const mins = dayItem?.totalMinutes || 0;
                  const hPct = mins > 0 ? Math.max(30, Math.min(100, Math.round((mins / 90) * 100))) : 28;
                  const isActive = mins > 0 || idx < 4;
                  return (
                    <div key={`${lbl}-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%' }}>
                      <div style={{ flex: 1, width: '100%', maxWidth: '18px', display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{
                          width: '100%',
                          height: `${isActive ? Math.max(45, hPct) : 28}%`,
                          borderRadius: '5px',
                          background: isActive ? '#c6ff24' : 'var(--po-track)'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--lab-text-muted)' }}>{lbl}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        </aside>
      </div>

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
