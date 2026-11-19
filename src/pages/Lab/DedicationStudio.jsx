import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Lock, Globe, Plus, Trash2, HeartHandshake } from 'lucide-react';
import {
  DEDICATION_TYPES,
  getDedications,
  addDedication,
  deleteDedication,
  getPinPothaEntries
} from '../../services/practiceEcosystemStore';

export default function DedicationStudio() {
  const [searchParams] = useSearchParams();
  const [dedications, setDedications] = useState(() => getDedications());
  const [pinEntries] = useState(() => getPinPothaEntries());

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dedicationText.trim()) return;
    addDedication({
      dedicationType,
      title: title.trim(),
      dedicationText: dedicationText.trim(),
      linkedPinPothaId: linkedPinPothaId || null,
      visibility
    });
    setTitle('');
    setLinkedPinPothaId('');
  };

  return (
    <div className="km-lab-page">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', alignItems: 'start' }}>
        {/* Form */}
        <form onSubmit={handleSubmit} className="km-lab-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 14px 0', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)' }}>
            නව පුණ්‍යානුමෝදනාවක් / දායකත්වයක්
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <select
              value={dedicationType}
              onChange={(e) => setDedicationType(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.85rem' }}
            >
              {Object.values(DEDICATION_TYPES).map(t => (
                <option key={t.id} value={t.id}>{t.sinhala} · {t.label}</option>
              ))}
            </select>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g., සූත්‍ර අධ්‍යයන පින් අනුමෝදනාව)"
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.88rem', fontFamily: 'var(--font-sinhala)' }}
            />

            <textarea
              rows={4}
              required
              value={dedicationText}
              onChange={(e) => setDedicationText(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.88rem', fontFamily: 'var(--font-sinhala)', resize: 'vertical' }}
            />

            <select
              value={linkedPinPothaId}
              onChange={(e) => setLinkedPinPothaId(e.target.value)}
              style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--lab-border)', background: 'var(--lab-bg-subtle)', color: 'var(--lab-text)', fontSize: '0.84rem' }}
            >
              <option value="">— Link Pin Potha Entry (Optional) —</option>
              {pinEntries.map(p => (
                <option key={p.id} value={p.id}>{p.entryDate} · {p.title}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setVisibility('private')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  borderRadius: '10px',
                  border: `1px solid ${visibility === 'private' ? 'var(--lab-accent)' : 'var(--lab-border)'}`,
                  background: visibility === 'private' ? 'var(--lab-accent-soft)' : 'transparent',
                  color: visibility === 'private' ? 'var(--lab-accent)' : 'var(--lab-text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Lock size={13} />
                <span>Private (Default)</span>
              </button>
              <button
                type="button"
                onClick={() => setVisibility('public')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  borderRadius: '10px',
                  border: `1px solid ${visibility === 'public' ? '#059669' : 'var(--lab-border)'}`,
                  background: visibility === 'public' ? 'rgba(5, 150, 105, 0.12)' : 'transparent',
                  color: visibility === 'public' ? '#059669' : 'var(--lab-text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Globe size={13} />
                <span>Share Anumodanā</span>
              </button>
            </div>

            <button
              type="submit"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#D97706', color: '#fff', fontWeight: '600', fontSize: '0.86rem', cursor: 'pointer' }}
            >
              <Plus size={15} />
              <span>Record Dedication</span>
            </button>
          </div>
        </form>

        {/* Dedications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: 'var(--lab-text)' }}>
              Your Dedications ({dedications.length})
            </h3>
            <Link to="/lab/explore" style={{ fontSize: '0.8rem', color: 'var(--lab-accent)', textDecoration: 'none', fontWeight: '600' }}>
              Community Anumodanā →
            </Link>
          </div>

          {dedications.length === 0 ? (
            <div className="km-lab-card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)' }}>
              <HeartHandshake size={28} style={{ opacity: 0.4, marginBottom: '8px' }} />
              <div>තවමත් පුණ්‍යානුමෝදනා සටහන් නොමැත.</div>
            </div>
          ) : (
            dedications.map(d => {
              const typeCfg = DEDICATION_TYPES[d.dedicationType] || DEDICATION_TYPES.pattidana;
              return (
                <div key={d.id} className="km-lab-card" style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#D97706', background: 'var(--lab-gold-soft)', padding: '2px 8px', borderRadius: '999px' }}>
                        {typeCfg.sinhala}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: d.visibility === 'public' ? '#059669' : 'var(--lab-text-muted)' }}>
                        {d.visibility === 'public' ? <Globe size={11} /> : <Lock size={11} />}
                        {d.visibility === 'public' ? 'Public Anumodanā' : 'Private'}
                      </span>
                    </div>
                    <button onClick={() => deleteDedication(d.id)} style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer' }} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.96rem', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)', marginBottom: '4px' }}>
                    {d.title}
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--lab-text-muted)', margin: 0, lineHeight: 1.65, fontFamily: 'var(--font-sinhala)' }}>
                    {d.dedicationText}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
