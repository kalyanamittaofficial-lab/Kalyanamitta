import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Lock,
  Globe,
  Plus,
  Trash2,
  HeartHandshake,
  BookHeart,
  X,
  PenLine,
  Layers,
  Heart,
  Users,
  MessageCircle,
  Eye,
  Copy,
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Sparkles,
  LayoutGrid,
  Link2
} from 'lucide-react';
import {
  DEDICATION_TYPES,
  getDedications,
  addDedication,
  deleteDedication,
  getPinPothaEntries
} from '../../services/practiceEcosystemStore';
import PaginationBar from '../../components/Lab/PaginationBar';

const TYPE_COLORS = {
  pattidana: '#0B3BFA',
  dhamma_dana: '#65A30D',
  community_service: '#EA580C',
  study_offering: '#7C3AED'
};

const CARD_TEMPLATES = [
  {
    id: 'merit_sharing',
    title: 'Merit Sharing',
    sub: 'පුණ්‍ය බෙදාගැනීම',
    headerBg: 'linear-gradient(135deg, #061433 0%, #0B3BFA 78%, #1E40AF 100%)',
    accent: '#C8FF00',
    cardBg: '#F8FAFC',
    cardText: '#0F1115',
    cardMuted: '#475569',
    thumbBg: 'linear-gradient(135deg, #0B3BFA 0%, #0B3BFA 42%, #C8FF00 42%, #C8FF00 50%, #F8FAFC 50%)'
  },
  {
    id: 'private_dedication',
    title: 'Private Dedication',
    sub: 'පෞද්ගලික අනුමෝදනා',
    headerBg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    accent: '#38BDF8',
    cardBg: '#FFFFFF',
    cardText: '#0F1115',
    cardMuted: '#475569',
    thumbBg: 'linear-gradient(135deg, #0F172A 0%, #0F172A 44%, #38BDF8 44%, #38BDF8 52%, #FFFFFF 52%)'
  },
  {
    id: 'public_sharing',
    title: 'Public Sharing',
    sub: 'සියලු දෙනාට බෙදාහැරීම',
    headerBg: 'linear-gradient(135deg, #0B3BFA 0%, #0EA5E9 100%)',
    accent: '#C8FF00',
    cardBg: '#F0F9FF',
    cardText: '#0F172A',
    cardMuted: '#334155',
    thumbBg: 'linear-gradient(135deg, #0EA5E9 0%, #0EA5E9 45%, #C8FF00 45%, #C8FF00 52%, #F0F9FF 52%)'
  },
  {
    id: 'family_friend',
    title: 'Family / Friend',
    sub: 'පවුල / මිතුරන්ට',
    headerBg: 'linear-gradient(135deg, #1E1B4B 0%, #4F46E5 100%)',
    accent: '#A3E635',
    cardBg: '#FAFAF9',
    cardText: '#18181B',
    cardMuted: '#52525B',
    thumbBg: 'linear-gradient(135deg, #4F46E5 0%, #4F46E5 44%, #A3E635 44%, #A3E635 52%, #FAFAF9 52%)'
  }
];

function downloadCardAsPng(cardData, template) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Blue Wave Header
  const grad = ctx.createLinearGradient(0, 0, 1080, 220);
  grad.addColorStop(0, '#061433');
  grad.addColorStop(0.7, '#0B3BFA');
  grad.addColorStop(1, '#1E40AF');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(1080, 0);
  ctx.lineTo(1080, 145);
  ctx.quadraticCurveTo(640, 235, 0, 185);
  ctx.closePath();
  ctx.fill();

  // Neon Lime Accent Curve
  ctx.strokeStyle = template.accent || '#C8FF00';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 188);
  ctx.quadraticCurveTo(640, 238, 1080, 148);
  ctx.stroke();

  // PATH/OS Brand
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PATH/OS', 56, 68);

  // Badge
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(820, 36, 204, 46);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Dedication Card', 845, 66);

  // Title
  ctx.fillStyle = '#0F1115';
  ctx.font = 'bold 42px "Plus Jakarta Sans", "Noto Sans Sinhala", sans-serif';
  const titleText = cardData.title || 'පුණ්‍ය සමාර්පණය';
  ctx.fillText(titleText.slice(0, 42), 56, 275);

  // Quote Text wrapped
  ctx.fillStyle = '#475569';
  ctx.font = '26px "Plus Jakarta Sans", "Noto Sans Sinhala", sans-serif';
  const words = String(cardData.dedicationText || '').split(/\s+/);
  let line = '';
  let y = 340;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > 960) {
      ctx.fillText(line, 56, y);
      line = w;
      y += 40;
      if (y > 500) break;
    } else {
      line = test;
    }
  }
  if (line && y <= 500) ctx.fillText(line, 56, y);

  // Footer meta
  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(56, 540, 968, 2);
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 20px "Plus Jakarta Sans", "Noto Sans Sinhala", sans-serif';
  ctx.fillText(`${cardData.typeLabel}  ·  ${cardData.visibilityLabel}  ·  ${cardData.dateStr}`, 56, 588);

  const link = document.createElement('a');
  link.download = `dedication-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export default function DedicationStudio() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [dedications, setDedications] = useState(() => getDedications());
  const [pinEntries] = useState(() => getPinPothaEntries());

  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [templateIdx, setTemplateIdx] = useState(0);
  const [toastMsg, setToastMsg] = useState('');

  const [dedicationType, setDedicationType] = useState('pattidana');
  const [title, setTitle] = useState(() => {
    const t = searchParams.get('title');
    return t ? `පුණ්‍යානුමෝදනාව: ${t}` : '';
  });
  const [dedicationText, setDedicationText] = useState(
    'මෙම කුසල කර්මය සියලු සත්ත්වයන්ට නිවන් සුව පිණිසත්, දෙමව්පියන් ඇතුළු සියලු ඥාති මිත්‍රාදීන්ට සුවපත් භාවය පිණිසත් හේතු වේවා!'
  );
  const [linkedPinPothaId, setLinkedPinPothaId] = useState(() => searchParams.get('pinId') || '');
  const [visibility, setVisibility] = useState('private');

  useEffect(() => {
    const refresh = () => setDedications(getDedications());
    window.addEventListener('labPracticeUpdated', refresh);
    return () => window.removeEventListener('labPracticeUpdated', refresh);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dedicationText.trim()) return;
    const created = addDedication({
      dedicationType,
      title: title.trim(),
      dedicationText: dedicationText.trim(),
      linkedPinPothaId: linkedPinPothaId || null,
      visibility
    });
    if (created?.[0]?.id) {
      setSelectedId(created[0].id);
    }
    setTitle('');
    setLinkedPinPothaId('');
    setPage(1);
    showToast('Dedication created');
  };

  const filtered = filterType === 'all'
    ? dedications
    : dedications.filter(d => d.dedicationType === filterType);

  const ITEMS_PER_PAGE = showAllRecent ? 6 : 3;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedDedications = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const pinEntryMap = useMemo(
    () => Object.fromEntries(pinEntries.map(p => [p.id, p])),
    [pinEntries]
  );

  const publicCount = useMemo(
    () => dedications.filter(d => d.visibility === 'public').length,
    [dedications]
  );
  const linkedCount = useMemo(
    () => dedications.filter(d => Boolean(d.linkedPinPothaId)).length,
    [dedications]
  );

  const activeTemplate = CARD_TEMPLATES[templateIdx] || CARD_TEMPLATES[0];

  // Active card shown in the Shareable Card preview:
  // If user selected a saved dedication, show that; if typing a new title, preview live draft; else show latest dedication or sample.
  const selectedDedication = useMemo(
    () => dedications.find(d => d.id === selectedId) || null,
    [dedications, selectedId]
  );

  const previewCard = useMemo(() => {
    if (title.trim() && !selectedDedication) {
      const tp = DEDICATION_TYPES[dedicationType] || DEDICATION_TYPES.pattidana;
      return {
        id: 'draft',
        title: title.trim(),
        dedicationText: dedicationText.trim(),
        typeLabel: tp.sinhala,
        typeId: dedicationType,
        visibilityLabel: visibility === 'public' ? 'Public' : 'Private',
        visibility,
        linkedTitle: linkedPinPothaId ? pinEntryMap[linkedPinPothaId]?.title : '',
        dateStr: new Date().toISOString().slice(0, 10)
      };
    }
    const source = selectedDedication || dedications[0];
    if (source) {
      const tp = DEDICATION_TYPES[source.dedicationType] || DEDICATION_TYPES.pattidana;
      return {
        ...source,
        typeLabel: tp.sinhala,
        typeId: source.dedicationType,
        visibilityLabel: source.visibility === 'public' ? 'Public' : 'Private',
        linkedTitle: source.linkedPinPothaId ? pinEntryMap[source.linkedPinPothaId]?.title : '',
        dateStr: source.createdAt ? source.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10)
      };
    }
    return {
      id: 'sample',
      title: 'මගේ දෙමව්පියන්ට පුණ්‍ය සමාර්පණය',
      dedicationText: 'මෙම පුණ්‍ය කර්මය සියලු සත්ත්වයන්ට නිවන් සුව පිණිසත්, විශේෂයෙන් මගේ දෙමව්පියන්ගේ සුවය හා දීඝායුෂ උදෙසා සමාර්පණය කරමි.',
      typeLabel: DEDICATION_TYPES.pattidana.sinhala,
      typeId: 'pattidana',
      visibilityLabel: 'Private',
      visibility: 'private',
      linkedTitle: '',
      dateStr: new Date().toISOString().slice(0, 10)
    };
  }, [title, dedicationText, dedicationType, visibility, linkedPinPothaId, selectedDedication, dedications, pinEntryMap]);

  const buildShareText = () =>
    `🙏 ${previewCard.title}\n\n"${previewCard.dedicationText}"\n\n— ${previewCard.typeLabel} · PATH/OS Dedication Studio`;

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(buildShareText())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText());
      showToast('Copied dedication to clipboard');
    } catch {
      showToast('Copy failed');
    }
  };

  return (
    <div className="km-lab-page" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* TOP HERO BANNER */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '18px',
          padding: '16px 20px',
          background: 'linear-gradient(125deg, #061433 0%, #0B3BFA 62%, #1E40AF 100%)',
          color: '#FFFFFF',
          boxShadow: '0 10px 28px rgba(11, 59, 250, 0.22)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        {/* Decorative neon lime arc */}
        <svg
          aria-hidden="true"
          viewBox="0 0 420 120"
          style={{
            position: 'absolute',
            left: '20%',
            top: 0,
            height: '100%',
            width: '340px',
            pointerEvents: 'none',
            opacity: 0.75
          }}
        >
          <path
            d="M 10 115 Q 150 95 230 50 T 410 5"
            fill="none"
            stroke="#C8FF00"
            strokeWidth="2.5"
          />
        </svg>

        {/* Left: Brand Title */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0
          }}>
            <HeartHandshake size={20} color="#C8FF00" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
              Dedication <span style={{ color: '#C8FF00' }}>Studio</span>
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.85)', fontFamily: 'var(--font-sinhala)' }}>
              පුණ්‍ය කර්ම අනුමෝදනා සමාර්පණය කර, බෙදා හරින්න
            </p>
          </div>
        </div>

        {/* Center: 3 KPI Counters */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
          {[
            { icon: Layers, value: dedications.length, label: 'Total Dedications' },
            { icon: Heart, value: publicCount, label: 'Shared Publicly' },
            { icon: Users, value: linkedCount, label: 'Merit Linked' }
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={16} color="rgba(255,255,255,0.75)" />
                <div style={{ lineHeight: 1.15 }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: '900', fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.75)' }}>{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {toastMsg && (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              background: '#C8FF00',
              color: '#0F1115',
              padding: '5px 11px',
              borderRadius: '999px'
            }}>
              {toastMsg}
            </span>
          )}
          <button
            type="button"
            onClick={() => navigate('/lab/pin-potha')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.28)',
              background: 'rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <BookHeart size={14} />
            <span>Merit Book</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/lab/explore')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              border: 'none',
              background: '#FFFFFF',
              color: '#0F1115',
              fontSize: '0.75rem',
              fontWeight: '800',
              fontFamily: 'var(--font-sinhala)',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={13} color="#0B3BFA" />
            <span>පොදු අනුමෝදනා →</span>
          </button>
        </div>
      </section>

      {/* MAIN 2-COLUMN WORKSPACE */}
      <div className="km-ded-layout">
        {/* LEFT COLUMN: CREATE A NEW DEDICATION FORM */}
        <form
          onSubmit={handleSubmit}
          className="km-po-card"
          style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'var(--po-blue-soft)',
              color: 'var(--po-blue)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}>
              <PenLine size={16} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                Create a New Dedication
              </h2>
              <p style={{ margin: 0, fontSize: '0.71rem', color: 'var(--lab-text-muted)' }}>
                Offer the merit of your good actions with a heartfelt dedication.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-text)' }}>
              <Layers size={12} color="var(--po-blue)" />
              <span>Dedication Category / අනුමෝදනා වර්ගය</span>
            </label>
            <select
              aria-label="Dedication Category"
              value={dedicationType}
              onChange={(e) => {
                setSelectedId(null);
                setDedicationType(e.target.value);
              }}
              className="km-lab-input"
              style={{ padding: '8px 10px', fontSize: '0.82rem', fontFamily: 'var(--font-sinhala)' }}
            >
              {Object.values(DEDICATION_TYPES).map(tp => (
                <option key={tp.id} value={tp.id}>{tp.sinhala}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-text)' }}>
              <Users size={12} color="var(--po-blue)" />
              <span>Title / Recipient / Occasion</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setSelectedId(null);
                setTitle(e.target.value);
              }}
              placeholder="උදාහරණ: මා වදිනා දෙමව්පියන්ට, ගුරුවරුන්ට..."
              className="km-lab-input"
              style={{ padding: '8px 10px', fontSize: '0.82rem', fontFamily: 'var(--font-sinhala)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-text)' }}>
              <MessageCircle size={12} color="var(--po-blue)" />
              <span>Dedication Message / අනුමෝදනා පණිවිඩය</span>
            </label>
            <textarea
              rows={4}
              required
              value={dedicationText}
              onChange={(e) => {
                setSelectedId(null);
                setDedicationText(e.target.value);
              }}
              placeholder="පුණ්‍යානුමෝදනා ප්‍රාර්ථනාව..."
              className="km-lab-input"
              style={{ padding: '8px 10px', fontSize: '0.81rem', fontFamily: 'var(--font-sinhala)', resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-text)' }}>
              <Link2 size={12} color="var(--po-blue)" />
              <span>Link a Merit Book entry (optional)</span>
            </label>
            <select
              aria-label="Linked Merit Book entry"
              value={linkedPinPothaId}
              onChange={(e) => setLinkedPinPothaId(e.target.value)}
              className="km-lab-input"
              style={{ padding: '8px 10px', fontSize: '0.8rem' }}
            >
              <option value="">— Link a Merit Book entry (optional) —</option>
              {pinEntries.map(p => (
                <option key={p.id} value={p.id}>{p.entryDate} · {p.title}</option>
              ))}
            </select>
          </div>

          {/* Visibility 2-Card Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: 'var(--lab-text)' }}>
              <Lock size={12} color="var(--po-blue)" />
              <span>Visibility / නිරූපණය</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { id: 'private', label: 'Private', sub: 'පෞද්ගලික (මට පමණයි)', icon: Lock },
                { id: 'public', label: 'Public', sub: 'සියලු දෙනාට බෙදා හරින්න', icon: Globe }
              ].map(opt => {
                const active = visibility === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setVisibility(opt.id)}
                    style={{
                      textAlign: 'left',
                      padding: '9px 10px',
                      borderRadius: '12px',
                      border: `1.5px solid ${active ? 'var(--po-blue)' : 'var(--po-card-border)'}`,
                      background: active ? 'var(--po-blue-soft)' : 'var(--po-card-subtle)',
                      color: 'var(--lab-text)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: '800', color: active ? 'var(--po-blue)' : 'var(--lab-text)' }}>
                        <Icon size={13} />
                        <span>{opt.label}</span>
                      </span>
                      <span style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: `2px solid ${active ? 'var(--po-blue)' : 'var(--lab-text-muted)'}`,
                        background: active ? 'var(--po-blue)' : 'transparent',
                        display: 'grid',
                        placeItems: 'center'
                      }}>
                        {active && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FFFFFF' }} />}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.66rem', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
                      {opt.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Submit CTA */}
          <button
            type="submit"
            style={{
              position: 'relative',
              overflow: 'hidden',
              marginTop: '2px',
              padding: '11px 14px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--po-blue, #0B3BFA)',
              color: '#FFFFFF',
              fontSize: '0.84rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              boxShadow: '0 8px 20px rgba(11, 59, 250, 0.28)'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={15} strokeWidth={2.6} />
              <span>Create Dedication</span>
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: '600', opacity: 0.88, fontFamily: 'var(--font-sinhala)' }}>
              අනුමෝදනාව සකසන්න
            </span>
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: '-12px',
                bottom: '-12px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#C8FF00',
                opacity: 0.9
              }}
            />
          </button>
        </form>

        {/* RIGHT COLUMN: QUICK ACTIONS + CARD STUDIO + RECENT + TEMPLATES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
          {/* 1. QUICK ACTIONS + CATEGORY FILTER PILLS */}
          <div className="km-po-card" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', lineHeight: 1.2, minWidth: '64px' }}>
                Quick<br />Actions
              </div>
              <div className="km-ded-quick-grid" style={{ flex: 1 }}>
                {[
                  { label: 'Share to WhatsApp', sub: 'සිහිගැන්වීම බෙදාගන්න', icon: MessageCircle, color: '#16A34A', onClick: handleShareWhatsApp },
                  { label: 'Preview Card', sub: 'කාඩ්පත පිරික්සන්න', icon: Eye, color: '#0B3BFA', onClick: () => setViewingItem(previewCard) },
                  { label: 'Copy Link', sub: 'පණිවිඩය පිටපත් කරන්න', icon: Copy, color: '#0284C7', onClick: handleCopyText },
                  { label: 'Choose Template', sub: 'කාඩ් ආකෘති මාරු කරන්න', icon: LayoutGrid, color: '#4F46E5', onClick: () => setTemplateIdx(i => (i + 1) % CARD_TEMPLATES.length) }
                ].map(act => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.label}
                      type="button"
                      onClick={act.onClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '11px',
                        border: '1px solid var(--po-card-border)',
                        background: 'var(--po-card-subtle)',
                        color: 'var(--lab-text)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: `${act.color}18`,
                        color: act.color,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={14} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.label}</div>
                        <div style={{ fontSize: '0.63rem', color: 'var(--lab-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-sinhala)' }}>{act.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '6px', borderTop: '1px solid var(--po-card-border)' }}>
              <button
                type="button"
                onClick={() => {
                  setFilterType('all');
                  setPage(1);
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: 'none',
                  background: filterType === 'all' ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-subtle)',
                  color: filterType === 'all' ? '#FFFFFF' : 'var(--lab-text)',
                  fontSize: '0.73rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-sinhala)',
                  cursor: 'pointer'
                }}
              >
                සියල්ල ({dedications.length})
              </button>
              {Object.values(DEDICATION_TYPES).map(tp => {
                const active = filterType === tp.id;
                const dotColor = TYPE_COLORS[tp.id] || '#0B3BFA';
                const count = dedications.filter(d => d.dedicationType === tp.id).length;
                return (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => {
                      setFilterType(active ? 'all' : tp.id);
                      setPage(1);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 11px',
                      borderRadius: '999px',
                      border: `1px solid ${active ? 'transparent' : 'var(--po-card-border)'}`,
                      background: active ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-subtle)',
                      color: active ? '#FFFFFF' : 'var(--lab-text)',
                      fontSize: '0.73rem',
                      fontWeight: '700',
                      fontFamily: 'var(--font-sinhala)',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: active ? '#C8FF00' : dotColor }} />
                    <span>{tp.sinhala} ({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SHAREABLE DEDICATION CARD STUDIO */}
          <div className="km-po-card" style={{ padding: '14px 16px' }}>
            <div className="km-ded-preview-grid">
              {/* Left: Live Rendered Shareable Card */}
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--po-card-border)',
                background: activeTemplate.cardBg,
                color: activeTemplate.cardText,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(15, 17, 21, 0.08)'
              }}>
                {/* Wave Header */}
                <div style={{
                  position: 'relative',
                  padding: '12px 16px 18px',
                  background: activeTemplate.headerBg,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontWeight: '800', fontSize: '0.86rem', letterSpacing: '-0.02em' }}>
                    PATH<span style={{ color: activeTemplate.accent }}>/</span>OS
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 9px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.16)',
                    fontSize: '0.68rem',
                    fontWeight: '700'
                  }}>
                    <Heart size={11} />
                    <span>Dedication</span>
                  </span>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '4px',
                    background: activeTemplate.accent
                  }} />
                </div>

                {/* Card Body */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: '900',
                    lineHeight: 1.3,
                    color: activeTemplate.cardText,
                    fontFamily: 'var(--font-sinhala)'
                  }}>
                    {previewCard.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '0.78rem',
                    lineHeight: 1.55,
                    color: activeTemplate.cardMuted,
                    fontFamily: 'var(--font-sinhala)',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    “{previewCard.dedicationText}”
                  </p>
                </div>

                {/* Card Footer Pills */}
                <div style={{
                  padding: '10px 16px',
                  borderTop: '1px solid rgba(15, 17, 21, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  flexWrap: 'wrap',
                  fontSize: '0.67rem',
                  fontWeight: '700',
                  color: activeTemplate.cardMuted
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-sinhala)' }}>
                    <Layers size={11} />
                    <span>{previewCard.typeLabel}</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {previewCard.visibility === 'public' ? <Globe size={11} /> : <Lock size={11} />}
                    <span>{previewCard.visibilityLabel}</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace' }}>
                    <Calendar size={11} />
                    <span>{previewCard.dateStr}</span>
                  </span>
                </div>
              </div>

              {/* Middle: Shareable Card Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <h3 style={{ margin: '0 0 2px', fontSize: '0.9rem', fontWeight: '800' }}>Your Shareable Dedication Card</h3>
                  <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
                    බෙදා ගැනීමට සූදානම් අනුමෝදනා කාඩ්පත.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#C8FF00',
                      color: '#0F1115',
                      fontSize: '0.76rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    <MessageCircle size={14} />
                    <span>Share to WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewingItem(previewCard)}
                    className="km-lab-btn"
                    style={{ borderRadius: '10px', padding: '7px 12px', fontSize: '0.75rem', justifyContent: 'flex-start' }}
                  >
                    <Eye size={13} />
                    <span>Preview Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="km-lab-btn"
                    style={{ borderRadius: '10px', padding: '7px 12px', fontSize: '0.75rem', justifyContent: 'flex-start' }}
                  >
                    <Copy size={13} />
                    <span>Copy Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadCardAsPng(previewCard, activeTemplate)}
                    className="km-lab-btn"
                    style={{ borderRadius: '10px', padding: '7px 12px', fontSize: '0.75rem', justifyContent: 'flex-start' }}
                  >
                    <Download size={13} />
                    <span>Download Card (PNG)</span>
                  </button>
                </div>
              </div>

              {/* Right: Card Template Carousel */}
              <div style={{
                paddingLeft: '10px',
                borderLeft: '1px solid var(--po-card-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: '800' }}>Card Template</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>කාඩ්පත් තේමාව</div>
                </div>

                <div style={{
                  width: '100%',
                  height: '92px',
                  borderRadius: '12px',
                  background: activeTemplate.thumbBg,
                  border: '1px solid var(--po-card-border)'
                }} />

                <div style={{ fontSize: '0.7rem', fontWeight: '700', textAlign: 'center' }}>{activeTemplate.title}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setTemplateIdx(i => (i - 1 + CARD_TEMPLATES.length) % CARD_TEMPLATES.length)}
                    style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '2px' }}
                    aria-label="Previous template"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {CARD_TEMPLATES.map((tpl, idx) => (
                      <span
                        key={tpl.id}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: idx === templateIdx ? 'var(--po-blue)' : 'var(--po-track)'
                        }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTemplateIdx(i => (i + 1) % CARD_TEMPLATES.length)}
                    style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '2px' }}
                    aria-label="Next template"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. MY DEDICATIONS (RECENT) */}
          <div className="km-po-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800' }}>
                  My Dedications ({filtered.length})
                </h3>
                <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
                  ඔබ විසින් නිර්මාණය කළ අනුමෝදනා. කාඩ්පත තේරීමට ක්ලික් කරන්න.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAllRecent(v => !v);
                  setPage(1);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--po-blue)',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {showAllRecent ? 'Show Recent ↑' : 'View All →'}
              </button>
            </div>

            {pagedDedications.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', background: 'var(--po-card-subtle)', borderRadius: '12px', color: 'var(--lab-text-muted)' }}>
                <HeartHandshake size={24} style={{ opacity: 0.45, marginBottom: '4px' }} />
                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-sinhala)' }}>තවමත් පුණ්‍යානුමෝදනා සටහන් නොමැත.</div>
              </div>
            ) : (
              <>
                <div className="km-ded-recent-grid">
                  {pagedDedications.map(d => {
                    const typeCfg = DEDICATION_TYPES[d.dedicationType] || DEDICATION_TYPES.pattidana;
                    const typeColor = TYPE_COLORS[d.dedicationType] || '#0B3BFA';
                    const isSelected = previewCard.id === d.id;
                    const createdDate = d.createdAt ? d.createdAt.slice(0, 10) : '';
                    return (
                      <div
                        key={d.id}
                        onClick={() => setSelectedId(d.id)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '12px',
                          background: 'var(--po-card-subtle)',
                          border: `1.5px solid ${isSelected ? 'var(--po-blue)' : 'var(--po-card-border)'}`,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '8px',
                          transition: 'border-color 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                            <span style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '8px',
                              background: `${typeColor}18`,
                              color: typeColor,
                              display: 'grid',
                              placeItems: 'center',
                              flexShrink: 0
                            }}>
                              <Heart size={13} />
                            </span>
                            <span style={{
                              fontWeight: '700',
                              fontSize: '0.8rem',
                              fontFamily: 'var(--font-sinhala)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {d.title}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedId === d.id) setSelectedId(null);
                              deleteDedication(d.id);
                            }}
                            title="Delete dedication"
                            style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', fontSize: '0.66rem', color: 'var(--lab-text-muted)' }}>
                          <span style={{
                            padding: '2px 7px',
                            borderRadius: '999px',
                            background: `${typeColor}14`,
                            color: typeColor,
                            fontWeight: '700',
                            fontFamily: 'var(--font-sinhala)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {typeCfg.sinhala}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                            {d.visibility === 'public' ? <Globe size={10} /> : <Lock size={10} />}
                            <span>{d.visibility === 'public' ? 'Public' : 'Private'}</span>
                          </span>
                          {createdDate && <span style={{ fontFamily: 'monospace', flexShrink: 0 }}>{createdDate}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {totalPages > 1 && (
                  <PaginationBar page={safePage} totalPages={totalPages} onPageChange={setPage} compact />
                )}
              </>
            )}
          </div>

          {/* 4. DEDICATION CARD TEMPLATES */}
          <div className="km-po-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800' }}>Dedication Card Templates</h3>
                <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--lab-text-muted)' }}>
                  Choose a clean card style for sharing your dedication.
                </p>
              </div>
            </div>

            <div className="km-ded-templates-grid">
              {CARD_TEMPLATES.map((tpl, idx) => {
                const active = idx === templateIdx;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateIdx(idx)}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      textAlign: 'left',
                      padding: '12px',
                      borderRadius: '12px',
                      border: `1.5px solid ${active ? 'var(--po-blue)' : 'var(--po-card-border)'}`,
                      background: active ? 'var(--po-blue-soft)' : 'var(--po-card-subtle)',
                      color: 'var(--lab-text)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '7px',
                        background: tpl.thumbBg,
                        border: '1px solid var(--po-card-border)'
                      }} />
                      {active && (
                        <span style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'var(--po-blue)',
                          color: '#FFFFFF',
                          display: 'grid',
                          placeItems: 'center'
                        }}>
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', marginTop: '4px' }}>{tpl.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>{tpl.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW DEDICATION MODAL */}
      {viewingItem && (
        <div
          onClick={() => setViewingItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 17, 21, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="km-lab-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 60px rgba(0,0,0,0.28)'
            }}
          >
            <div style={{
              padding: '14px 18px',
              background: activeTemplate.headerBg,
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.76rem', fontWeight: '800', fontFamily: 'var(--font-sinhala)' }}>
                {viewingItem.typeLabel || (DEDICATION_TYPES[viewingItem.dedicationType] || DEDICATION_TYPES.pattidana).sinhala}
              </span>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                style={{ border: 'none', background: 'transparent', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1.12rem', fontWeight: '800', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)' }}>
                {viewingItem.title}
              </h3>

              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--lab-text-muted)', lineHeight: 1.7, fontFamily: 'var(--font-sinhala)', whiteSpace: 'pre-wrap' }}>
                {viewingItem.dedicationText}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--lab-border)', fontSize: '0.75rem', color: 'var(--lab-text-muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  {viewingItem.visibility === 'public' ? <Globe size={12} color="var(--po-blue)" /> : <Lock size={12} />}
                  <span>{viewingItem.visibility === 'public' ? 'Public Dedication' : 'Private Dedication'}</span>
                </span>
                {(viewingItem.dateStr || viewingItem.createdAt) && (
                  <span style={{ fontFamily: 'monospace' }}>{viewingItem.dateStr || viewingItem.createdAt.slice(0, 10)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
