import { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Layers,
  Lightbulb,
  Target,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Tag,
  Trash2,
  Check
} from 'lucide-react';
import {
  getPathReflections,
  addPathReflection,
  deletePathReflection
} from '../../services/practiceEcosystemStore';
import { getRoutineHabits, getRoutineLogForDate } from '../../services/dailyRoutineStore';
import { getTodayKey } from '../../services/cittaLogStore';

const CHECKIN_STORAGE_KEY = 'km_lab_reflection_checkin_v1';

const DEFAULT_CHECKIN = {
  clarity: 72,
  attention: 68,
  balance: 70
};

const REFLECTION_TAGS = [
  { id: 'samma_sati', label: 'Mindfulness' },
  { id: 'attachment', label: 'Attachment' },
  { id: 'distraction', label: 'Distraction' },
  { id: 'restlessness', label: 'Restlessness' },
  { id: 'clarity', label: 'Clarity' }
];

const FALLBACK_INSIGHTS = [
  {
    id: 'sample-1',
    dateLabel: { day: '20', mon: 'NOV' },
    intention: 'Reacted due to attachment.',
    observation: 'Noticed the urge, paused, and responded calmly.',
    isSample: true
  },
  {
    id: 'sample-2',
    dateLabel: { day: '18', mon: 'NOV' },
    intention: 'Distraction was intentional escape.',
    observation: 'Avoided a task due to discomfort.',
    isSample: true
  },
  {
    id: 'sample-3',
    dateLabel: { day: '15', mon: 'NOV' },
    intention: 'Felt restlessness in the evening.',
    observation: 'Triggered by comparisons on social media.',
    isSample: true
  }
];

function formatInsightDate(iso) {
  if (!iso) return { day: 'Today', mon: '' };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: 'Today', mon: '' };
  return {
    day: String(d.getDate()),
    mon: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  };
}

export default function ReflectionPage() {
  const textareaRef = useRef(null);
  const [reflections, setReflections] = useState(() => getPathReflections());
  const [text, setText] = useState('');
  const [selectedTag, setSelectedTag] = useState('samma_sati');
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [insightPage, setInsightPage] = useState(0);

  const [checkin, setCheckin] = useState(() => {
    try {
      const raw = localStorage.getItem(CHECKIN_STORAGE_KEY);
      return raw ? { ...DEFAULT_CHECKIN, ...JSON.parse(raw) } : DEFAULT_CHECKIN;
    } catch {
      return DEFAULT_CHECKIN;
    }
  });
  const [draftCheckin, setDraftCheckin] = useState(checkin);

  useEffect(() => {
    const refresh = () => setReflections(getPathReflections());
    window.addEventListener('labPracticeUpdated', refresh);
    return () => window.removeEventListener('labPracticeUpdated', refresh);
  }, []);

  const overallStatePct = Math.round((checkin.clarity + checkin.attention + checkin.balance) / 3);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
    const firstSentence = (lines[0] || trimmed).split(/[.!?]/)[0].trim();
    const title = firstSentence.length > 68 ? `${firstSentence.slice(0, 65)}...` : firstSentence;
    const body = lines.length > 1 ? lines.slice(1).join(' ') : trimmed;

    addPathReflection({
      pathFactor: selectedTag,
      intention: title || 'Today’s reflection',
      observation: body === title ? '' : body
    });
    setText('');
    setInsightPage(0);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2400);
  };

  const handleSaveCheckin = (e) => {
    e.preventDefault();
    localStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(draftCheckin));
    setCheckin(draftCheckin);
    setShowCheckinModal(false);
  };

  // Weekly pattern bars
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = (new Date().getDay() + 6) % 7;
  const basePattern = [22, 42, 34, 67, 79, 41, 35];
  const weekBars = weekDays.map((day, idx) => {
    const boost = idx === todayIdx ? Math.min(20, reflections.length * 5) : 0;
    return {
      day,
      pct: Math.min(96, basePattern[idx] + boost)
    };
  });

  // Segmented progress out of 7
  const habits = getRoutineHabits();
  const todayLog = getRoutineLogForDate(getTodayKey());
  const routineRatio = habits.length > 0 ? (todayLog.checkedIds?.length || 0) / habits.length : 0;
  const activeSegments = Math.min(7, Math.max(1, Math.round(routineRatio * 4) + Math.min(3, reflections.length) || 4));

  const displayInsights = reflections.length > 0
    ? reflections.map(r => ({
        id: r.id,
        dateLabel: formatInsightDate(r.createdAt),
        intention: r.intention,
        observation: r.observation,
        isSample: false
      }))
    : FALLBACK_INSIGHTS;

  const pageSize = 3;
  const maxPage = Math.max(0, Math.ceil(displayInsights.length / pageSize) - 1);
  const safePage = Math.min(insightPage, maxPage);
  const pagedInsights = displayInsights.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const ringRadius = 40;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDash = `${(overallStatePct / 100) * ringCircumference} ${ringCircumference}`;

  return (
    <div className="km-lab-page" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* HERO WITH PORTRAIT */}
      <section style={{
        minHeight: '158px',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: '2px 0'
      }}>
        <div style={{ position: 'relative', zIndex: 2, padding: '12px 0 8px 4px', width: '44%', minWidth: '260px' }}>
          <div style={{ width: '38px', height: '5px', background: '#c6ff24', borderRadius: '9px', marginBottom: '9px' }} />
          <h1 style={{
            fontSize: 'clamp(1.65rem, 2.55vw, 2.38rem)',
            letterSpacing: '-0.05em',
            lineHeight: 1.05,
            margin: '0 0 9px 0',
            fontWeight: '900',
            color: 'var(--lab-text)'
          }}>
            A Closer Look <span style={{ color: 'var(--po-blue, #153cff)' }}>Within</span><span style={{ color: '#c6ff24' }}>.</span>
          </h1>
          <div style={{
            color: 'var(--lab-text-muted)',
            fontSize: '0.86rem',
            lineHeight: 1.42,
            paddingLeft: '12px',
            borderLeft: '3px solid var(--po-blue, #153cff)',
            maxWidth: '405px'
          }}>
            Observe clearly. Understand the pattern.<br />
            Choose a wiser response.
          </div>
        </div>

        {/* Portrait Hero Image */}
        <div
          role="img"
          aria-label="Grayscale side-profile portrait with abstract blue circular geometry"
          style={{
            position: 'absolute',
            zIndex: 1,
            top: 0,
            left: '37%',
            width: '42%',
            height: '158px',
            backgroundImage: "url('/images/reflection-hero.png')",
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            mixBlendMode: 'multiply',
            opacity: 0.98,
            WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 92%, transparent)',
            maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 92%, transparent)',
            pointerEvents: 'none'
          }}
        />

        {/* Right Editorial Quote */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          alignSelf: 'flex-start',
          marginLeft: 'auto',
          padding: '16px 10px 0 0',
          width: '21%',
          minWidth: '170px',
          fontStyle: 'italic',
          fontSize: '0.86rem',
          fontWeight: '700',
          color: 'var(--lab-text)',
          lineHeight: 1.42
        }}>
          Not to judge,<br />
          but to understand.<br />
          Not to suppress,<br />
          but to see clearly.
          <div style={{ width: '30px', height: '3.5px', background: '#c6ff24', borderRadius: '8px', marginTop: '9px' }} />
        </div>
      </section>

      {/* MAIN 3-COLUMN WORKSPACE */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(250px, 0.96fr) minmax(330px, 1.29fr) minmax(270px, 1.05fr)',
        gap: '12px',
        alignItems: 'stretch'
      }}>
        {/* LEFT COLUMN: CURRENT STATE + THIS WEEK'S PATTERN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
          {/* Current State */}
          <article className="km-po-card" style={{ borderRadius: '21px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
              <Activity size={18} color="var(--lab-text)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '0.96rem', fontWeight: '850', letterSpacing: '-0.03em', margin: '0 0 1px 0', color: 'var(--lab-text)' }}>
                  Current State
                </h2>
                <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--lab-text-muted)' }}>Your personal check-in.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDraftCheckin(checkin);
                  setShowCheckinModal(true);
                }}
                title="Edit self-check"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '1px solid var(--po-card-border)',
                  background: 'transparent',
                  color: 'var(--lab-text)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative', width: '92px', height: '92px', flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r={ringRadius} fill="none" stroke="var(--po-track)" strokeWidth="8.5" />
                  <circle
                    cx="50"
                    cy="50"
                    r={ringRadius}
                    fill="none"
                    stroke="var(--po-blue, #153cff)"
                    strokeWidth="8.5"
                    strokeDasharray={ringDash}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <strong style={{ fontSize: '0.96rem', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--lab-text)' }}>
                    {overallStatePct}%
                  </strong>
                  <small style={{ fontSize: '0.43rem', fontWeight: '800', letterSpacing: '0.02em', color: 'var(--lab-text-muted)', marginTop: '3px', lineHeight: 1 }}>
                    SELF-CHECK
                  </small>
                </div>
              </div>

              <div style={{ flex: 1, display: 'grid', gap: '7px', fontSize: '0.74rem', minWidth: 0 }}>
                {[
                  { key: 'clarity', label: 'Mind Clarity', color: '#83934a' },
                  { key: 'attention', label: 'Attention', color: '#dededc' },
                  { key: 'balance', label: 'Emotional Balance', color: '#dededc' }
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--lab-text-muted)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                    <strong style={{ marginLeft: 'auto', fontSize: '0.77rem', color: 'var(--lab-text)', fontVariantNumeric: 'tabular-nums' }}>
                      {checkin[item.key]}%
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* This Week's Pattern */}
          <article className="km-po-card" style={{ borderRadius: '21px', padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '9px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
              <Layers size={18} color="var(--lab-text)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: '0.96rem', fontWeight: '850', letterSpacing: '-0.03em', margin: '0 0 1px 0', color: 'var(--lab-text)' }}>
                  This Week&apos;s Pattern
                </h2>
                <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--lab-text-muted)' }}>A sample of your practice rhythm.</p>
              </div>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid var(--po-card-border)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--lab-text-muted)',
                flexShrink: 0
              }}>
                <ChevronRight size={14} />
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '78px', justifyContent: 'space-between', borderBottom: '1px solid var(--po-card-border)', padding: '0 4px 2px' }}>
              {weekBars.map(bar => (
                <div key={bar.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', flex: 1, gap: '3px', maxWidth: '35px' }}>
                  <div style={{ height: '100%', width: '90%', background: 'var(--po-card-subtle)', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                    <div style={{
                      width: '100%',
                      height: `${bar.pct}%`,
                      background: 'linear-gradient(to top, #d3d0fc, #1c42ff)',
                      borderRadius: '6px 6px 0 0'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--lab-text-muted)' }}>{bar.day}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '0.68rem', color: 'var(--lab-text-muted)', fontWeight: '700' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--po-blue, #153cff)' }} />
                More steady
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#e3e2e0' }} />
                Less steady
              </span>
            </div>
          </article>
        </div>

        {/* CENTER COLUMN: REFLECTION EDITOR */}
        <article style={{
          position: 'relative',
          background: 'linear-gradient(130deg, #17191d 0%, #27282b 64%, #525458 100%)',
          borderRadius: '22px',
          padding: '18px 16px 15px',
          color: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: '0 14px 32px rgba(26, 28, 35, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Skewed Blue Stripe */}
          <div aria-hidden="true" style={{
            position: 'absolute',
            right: '-80px',
            top: '-42px',
            width: '194px',
            height: '385px',
            background: 'var(--po-blue, #153cff)',
            transform: 'skewX(-28deg)',
            transformOrigin: 'top',
            pointerEvents: 'none'
          }} />
          {/* Concentric Arc Ring */}
          <div aria-hidden="true" style={{
            position: 'absolute',
            right: '-80px',
            top: '136px',
            width: '205px',
            height: '205px',
            border: '1px solid rgba(255, 255, 255, 0.45)',
            borderRadius: '50%',
            boxShadow: '0 0 0 18px rgba(255, 255, 255, 0.04), 0 0 0 44px rgba(255, 255, 255, 0.03)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2, padding: '0 12px' }}>
            <div style={{ fontSize: '2.45rem', color: '#c6ff24', fontFamily: 'Georgia, serif', fontWeight: '700', height: '28px', lineHeight: 0.9, marginBottom: '4px' }}>
              “
            </div>
            <h2 style={{
              fontSize: 'clamp(1.18rem, 1.65vw, 1.54rem)',
              lineHeight: 1.12,
              letterSpacing: '-0.04em',
              maxWidth: '325px',
              margin: 0,
              fontWeight: '900',
              color: '#FFFFFF'
            }}>
              What was truly happening in my mind today?
            </h2>
            <span style={{ display: 'block', background: '#c6ff24', width: '32px', height: '3.5px', borderRadius: '6px', marginTop: '11px' }} />
          </div>

          <form
            onSubmit={handleSave}
            style={{
              position: 'relative',
              zIndex: 3,
              background: 'var(--po-card-bg)',
              color: 'var(--lab-text)',
              borderRadius: '16px',
              padding: '12px 14px',
              boxShadow: '0 14px 38px rgba(0, 0, 0, 0.14)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <textarea
              ref={textareaRef}
              rows={3}
              maxLength={5000}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSave();
              }}
              placeholder={`Write freely about your experience...\nWhat did you notice? What triggered it?\nHow did you respond? What can you learn?`}
              aria-label="Write your reflection"
              style={{
                width: '100%',
                minHeight: '84px',
                resize: 'none',
                border: 0,
                outline: 0,
                background: 'transparent',
                color: 'var(--lab-text)',
                fontSize: '0.9rem',
                lineHeight: 1.48,
                padding: '2px 4px',
                fontFamily: 'inherit'
              }}
            />

            {showTagPicker && (
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {REFLECTION_TAGS.map(tag => {
                  const active = selectedTag === tag.id;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setSelectedTag(tag.id)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '999px',
                        border: `1px solid ${active ? 'var(--po-blue, #153cff)' : 'var(--po-card-border)'}`,
                        background: active ? 'var(--po-blue-soft)' : 'var(--po-card-subtle)',
                        color: active ? 'var(--po-blue, #153cff)' : 'var(--lab-text-muted)',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowTagPicker(v => !v)}
                title="Tags"
                style={{
                  border: '1px solid var(--po-card-border)',
                  background: showTagPicker ? 'var(--po-blue-soft)' : 'transparent',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  height: '30px',
                  width: '30px',
                  color: showTagPicker ? 'var(--po-blue, #153cff)' : 'var(--lab-text-muted)',
                  cursor: 'pointer'
                }}
              >
                <Tag size={14} />
              </button>

              {savedToast && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: '700', color: '#059669' }}>
                  <Check size={13} /> Saved privately
                </span>
              )}

              <button
                type="submit"
                disabled={!text.trim()}
                style={{
                  border: 'none',
                  background: 'var(--po-blue, #153cff)',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontSize: '0.77rem',
                  borderRadius: '30px',
                  padding: '8px 16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  marginLeft: 'auto',
                  whiteSpace: 'nowrap',
                  cursor: text.trim() ? 'pointer' : 'not-allowed',
                  opacity: text.trim() ? 1 : 0.65
                }}
              >
                <span>Save Reflection</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </article>

        {/* RIGHT COLUMN: RECENT INSIGHTS */}
        <article className="km-po-card" style={{ borderRadius: '21px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '9px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
            <Lightbulb size={18} color="var(--lab-text)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: '0.96rem', fontWeight: '850', letterSpacing: '-0.03em', margin: '0 0 1px 0', color: 'var(--lab-text)' }}>
                Recent Insights
              </h2>
              <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--lab-text-muted)' }}>Ideas emerging from reflections.</p>
            </div>
            <button
              type="button"
              onClick={() => setInsightPage(p => (p >= maxPage ? 0 : p + 1))}
              title="Next insights"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid var(--po-card-border)',
                background: 'transparent',
                color: 'var(--lab-text)',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gap: '2px', flex: 1 }}>
            {pagedInsights.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 0',
                  borderBottom: idx === pagedInsights.length - 1 ? 'none' : '1px solid var(--po-card-border)'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '45px',
                  flex: 'none',
                  border: '1px solid var(--po-card-border)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  background: 'var(--po-card-subtle)',
                  lineHeight: 1.05
                }}>
                  <strong style={{ fontSize: '0.98rem', letterSpacing: '-0.04em', color: 'var(--lab-text)' }}>{item.dateLabel.day}</strong>
                  {item.dateLabel.mon && (
                    <small style={{ fontSize: '0.59rem', fontWeight: '800', color: 'var(--lab-text-muted)' }}>{item.dateLabel.mon}</small>
                  )}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ display: 'block', fontWeight: '800', fontSize: '0.81rem', lineHeight: 1.26, marginBottom: '2px', color: 'var(--lab-text)' }}>
                    {item.intention}
                  </strong>
                  {item.observation && (
                    <p style={{ color: 'var(--lab-text-muted)', margin: 0, fontSize: '0.71rem', lineHeight: 1.3 }}>
                      {item.observation}
                    </p>
                  )}
                </div>

                {!item.isSample && (
                  <button
                    type="button"
                    onClick={() => deletePathReflection(item.id)}
                    title="Delete reflection"
                    style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* BOTTOM STRIP: INNER DEVELOPMENT PRACTICE + NEXT INNER WORK */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.71fr) minmax(260px, 1fr)',
        gap: '12px'
      }}>
        <article className="km-po-card" style={{ borderRadius: '19px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', flexWrap: 'wrap' }}>
          <Target size={20} color="var(--po-blue, #153cff)" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: '0.89rem', fontWeight: '800', margin: '0 0 1px 0', letterSpacing: '-0.02em', color: 'var(--lab-text)' }}>
              Inner Development Practice
            </h3>
            <p style={{ margin: 0, color: 'var(--lab-text-muted)', fontSize: '0.72rem' }}>
              Consistency of practice — not a measure of spiritual attainment.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '3px', maxWidth: '260px', flex: 1, marginLeft: 'auto', height: '11px', borderRadius: '9px', overflow: 'hidden', minWidth: '130px' }}>
            {Array.from({ length: 7 }, (_, i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  background: i < activeSegments ? 'var(--po-blue, #153cff)' : 'var(--po-track)'
                }}
              />
            ))}
          </div>
          <div style={{ fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.04em', color: 'var(--lab-text)', fontVariantNumeric: 'tabular-nums' }}>
            {activeSegments}/7
          </div>
        </article>

        <article className="km-po-card" style={{ borderRadius: '19px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px' }}>
          <Sparkles size={20} color="#a8cc00" style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '0.89rem', fontWeight: '800', margin: '0 0 1px 0', letterSpacing: '-0.02em', color: 'var(--lab-text)' }}>
              Next Inner Work
            </h3>
            <p style={{ margin: 0, color: 'var(--lab-text-muted)', fontSize: '0.72rem' }}>
              Observe a difficult moment with greater care.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              textareaRef.current?.focus();
            }}
            style={{
              marginLeft: 'auto',
              padding: '8px 16px',
              border: 0,
              borderRadius: '28px',
              background: '#c6ff24',
              color: '#14181b',
              fontSize: '0.77rem',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <span>Begin</span>
            <ArrowRight size={14} />
          </button>
        </article>
      </section>

      {/* SELF-CHECK MODAL */}
      {showCheckinModal && (
        <div
          onClick={() => setShowCheckinModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkinModalTitle"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(16, 17, 26, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveCheckin}
            className="km-po-card"
            style={{ width: 'min(440px, 100%)', padding: '24px', borderRadius: '24px', boxShadow: '0 30px 70px rgba(0,0,0,0.35)' }}
          >
            <h2 id="checkinModalTitle" style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: '800', color: 'var(--lab-text)' }}>
              Your self-check
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: 'var(--lab-text-muted)', lineHeight: 1.5 }}>
              Choose how these qualities felt to you today. These are personal ratings, not measurements or diagnoses.
            </p>

            {[
              { key: 'clarity', label: 'Mind Clarity' },
              { key: 'attention', label: 'Attention' },
              { key: 'balance', label: 'Emotional Balance' }
            ].map(item => (
              <div key={item.key} style={{ margin: '14px 0' }}>
                <label style={{ fontWeight: '700', fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between', color: 'var(--lab-text)' }}>
                  <span>{item.label}</span>
                  <span>{draftCheckin[item.key]}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={draftCheckin[item.key]}
                  onChange={(e) => setDraftCheckin(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#153cff', marginTop: '8px' }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowCheckinModal(false)} className="km-lab-btn">
                Cancel
              </button>
              <button type="submit" className="km-lab-btn-primary">
                Save check-in
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
