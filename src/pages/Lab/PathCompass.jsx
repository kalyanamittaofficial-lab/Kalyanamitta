import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, BookOpen, HeartHandshake, Lock, ArrowRight } from 'lucide-react';
import {
  EIGHTFOLD_FACTORS,
  getPathReflections,
  addPathReflection,
  deletePathReflection
} from '../../services/practiceEcosystemStore';
import { getRoadmapItems, getAnnotationSummary } from '../../services/studyRoadmapStore';

export default function PathCompass() {
  const navigate = useNavigate();
  const [selectedFactor, setSelectedFactor] = useState(EIGHTFOLD_FACTORS[0].id);
  const [reflections, setReflections] = useState(() => getPathReflections());
  const [annotations] = useState(() => getRoadmapItems());

  const [intention, setIntention] = useState('');
  const [observation, setObservation] = useState('');
  const [linkedAnnotationId, setLinkedAnnotationId] = useState('');

  useEffect(() => {
    const refresh = () => setReflections(getPathReflections());
    window.addEventListener('labPracticeUpdated', refresh);
    return () => window.removeEventListener('labPracticeUpdated', refresh);
  }, []);

  const activeFactorObj = EIGHTFOLD_FACTORS.find(f => f.id === selectedFactor) || EIGHTFOLD_FACTORS[0];
  const factorReflections = reflections.filter(r => r.pathFactor === selectedFactor);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!intention.trim()) return;
    const anno = annotations.find(a => a.id === linkedAnnotationId);
    addPathReflection({
      pathFactor: selectedFactor,
      intention: intention.trim(),
      observation: observation.trim(),
      linkedSuttaKey: anno?.target?.source || null,
      linkedAnnotationId: anno?.id || null
    });
    setIntention('');
    setObservation('');
    setLinkedAnnotationId('');
  };

  return (
    <div className="km-lab-page">
      {/* 8-Factor Selector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        {EIGHTFOLD_FACTORS.map(factor => {
          const active = factor.id === selectedFactor;
          const count = reflections.filter(r => r.pathFactor === factor.id).length;
          return (
            <button
              key={factor.id}
              onClick={() => setSelectedFactor(factor.id)}
              className="km-lab-card"
              style={{
                textAlign: 'left',
                padding: '14px 16px',
                cursor: 'pointer',
                border: active ? `2px solid ${factor.color}` : '1px solid var(--lab-border)',
                background: active ? 'var(--lab-bg-elevated)' : 'var(--lab-bg-elevated)',
                boxShadow: active ? `0 8px 22px ${factor.color}22` : 'var(--lab-shadow)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', color: factor.color, textTransform: 'uppercase' }}>
                  {factor.group}
                </span>
                {count > 0 && (
                  <span style={{ fontSize: '0.7rem', padding: '1px 7px', borderRadius: '999px', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text-muted)', fontWeight: '600' }}>
                    {count}
                  </span>
                )}
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.94rem', color: 'var(--lab-text)' }}>{factor.pali}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
                {factor.sinhala} · {factor.english}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Factor Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', alignItems: 'start' }}>
        {/* New Reflection Form */}
        <form onSubmit={handleSubmit} className="km-lab-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: activeFactorObj.color, textTransform: 'uppercase' }}>
                {activeFactorObj.group}
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--lab-text)' }}>
                {activeFactorObj.pali} ({activeFactorObj.sinhala})
              </h2>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
              <Lock size={11} /> Private
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--lab-text)', marginBottom: '5px', fontFamily: 'var(--font-sinhala)' }}>
                ප්‍රතිපදා අරමුණ / අදහස (Practice Intention)
              </label>
              <input
                type="text"
                required
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="උදා: කතා කිරීමට පෙර සිහියෙන් සිටීම (Mindful speech)"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.88rem', fontFamily: 'var(--font-sinhala)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--lab-text)', marginBottom: '5px', fontFamily: 'var(--font-sinhala)' }}>
                අත්දැකීම් සහ නිරීක්ෂණ (Qualitative Observation)
              </label>
              <textarea
                rows={3}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="මෙම අංගය ජීවිතයට සම්බන්ධ කරගත් ආකාරය..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.88rem', fontFamily: 'var(--font-sinhala)', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--lab-text)', marginBottom: '5px' }}>
                Link to Study Note (Optional)
              </label>
              <select
                value={linkedAnnotationId}
                onChange={(e) => setLinkedAnnotationId(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.84rem' }}
              >
                <option value="">— No linked note —</option>
                {annotations.map(a => {
                  const s = getAnnotationSummary(a);
                  return (
                    <option key={a.id} value={a.id}>
                      {a.target?.canonicalRef || a.target?.source}: {s?.title || s?.content?.slice(0, 40)}
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              type="submit"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: activeFactorObj.color, color: '#fff', fontWeight: '600', fontSize: '0.86rem', cursor: 'pointer' }}
            >
              <Plus size={15} />
              <span>Save Reflection</span>
            </button>
          </div>
        </form>

        {/* Reflections List */}
        <div className="km-lab-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: 'var(--lab-text)' }}>
              Reflections on {activeFactorObj.pali} ({factorReflections.length})
            </h3>
            <Link to="/lab/pin-potha" style={{ fontSize: '0.78rem', color: 'var(--lab-accent)', textDecoration: 'none', fontWeight: '600' }}>
              Open Pin Potha →
            </Link>
          </div>

          {factorReflections.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--lab-text-muted)', margin: 0, fontFamily: 'var(--font-sinhala)' }}>
              මෙම මාර්ග අංගය සඳහා තවමත් පෞද්ගලික සටහන් නොමැත.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {factorReflections.map(item => (
                <div key={item.id} style={{ padding: '12px 14px', borderRadius: '12px', background: 'var(--lab-bg-subtle)', border: '1px solid var(--lab-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)' }}>
                      {item.intention}
                    </strong>
                    <button onClick={() => deletePathReflection(item.id)} style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer' }} title="Delete reflection">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {item.observation && (
                    <p style={{ fontSize: '0.83rem', color: 'var(--lab-text-muted)', margin: '0 0 8px 0', lineHeight: 1.55, fontFamily: 'var(--font-sinhala)' }}>
                      {item.observation}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                    {item.linkedSuttaKey && (
                      <button
                        onClick={() => navigate(`/lab/sutta/${item.linkedSuttaKey}`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: 'transparent', color: 'var(--lab-accent)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                      >
                        <BookOpen size={12} />
                        <span>Sutta: {item.linkedSuttaKey}</span>
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/lab/pin-potha?factor=${encodeURIComponent(item.pathFactor)}&title=${encodeURIComponent(item.intention)}`)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: 'transparent', color: '#059669', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                    >
                      <HeartHandshake size={12} />
                      <span>Log in Pin Potha</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
