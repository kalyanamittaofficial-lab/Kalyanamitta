import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Globe, Plus, Trash2, HeartHandshake, Sparkles, BookHeart, X } from 'lucide-react';
import {
  DEDICATION_TYPES,
  getDedications,
  addDedication,
  deleteDedication,
  getPinPothaEntries
} from '../../services/practiceEcosystemStore';
import PaginationBar from '../../components/Lab/PaginationBar';

const TYPE_COLORS = {
  pattidana: '#A35B3D',
  dhamma_dana: '#5F6E43',
  community_service: '#8C6D46',
  study_offering: '#6E5A7A'
};

export default function DedicationStudio() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [dedications, setDedications] = useState(() => getDedications());
  const [pinEntries] = useState(() => getPinPothaEntries());

  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [viewingItem, setViewingItem] = useState(null);

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
    setPage(1);
  };

  const filtered = filterType === 'all'
    ? dedications
    : dedications.filter(d => d.dedicationType === filterType);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedDedications = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const pinEntryMap = Object.fromEntries(pinEntries.map(p => [p.id, p]));

  return (
    <div className="km-lab-page" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* PATH/OS Hero Header */}
      <div
        style={{
          borderRadius: '16px',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #0F1115 0%, #0B3BFA 145%)',
          color: '#F8FAFC',
          boxShadow: '0 8px 24px rgba(15, 17, 21, 0.16)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 2px 0', fontFamily: 'var(--font-sinhala)' }}>
            පුණ්‍යානුමෝදනා සහ ධර්ම දාන ({dedications.length})
          </h1>
          <div style={{ fontSize: '0.73rem', color: 'rgba(250, 248, 245, 0.88)', fontFamily: 'var(--font-sinhala)' }}>
            පත්තිදාන, ධර්ම දාන හා පින් අනුමෝදනා සටහන්
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate('/lab/pin-potha')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 11px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.28)',
              background: 'rgba(255,255,255,0.14)',
              color: '#FAF8F5',
              fontSize: '0.74rem',
              fontWeight: '600',
              fontFamily: 'var(--font-sinhala)',
              cursor: 'pointer'
            }}
          >
            <BookHeart size={13} />
            <span>Merit Book</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/lab/explore')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 11px',
              borderRadius: '8px',
              border: 'none',
              background: '#FAF8F5',
              color: '#231F1B',
              fontSize: '0.74rem',
              fontWeight: '700',
              fontFamily: 'var(--font-sinhala)',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={13} color="#A35B3D" />
            <span>පොදු අනුමෝදනා පිටුව →</span>
          </button>
        </div>
      </div>

      <div className="km-lab-routine-grid">
        {/* Left: New Dedication Form */}
        <form onSubmit={handleSubmit} className="km-lab-card" style={{ padding: '12px 14px' }}>
          <h2 style={{ fontSize: '0.92rem', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)' }}>
            නව පුණ්‍යානුමෝදනාවක් / දායකත්වයක්
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <select
              aria-label="පුණ්‍යානුමෝදනා වර්ගය"
              value={dedicationType}
              onChange={(e) => setDedicationType(e.target.value)}
              className="km-lab-input"
              style={{ padding: '6px 9px', fontSize: '0.8rem', fontFamily: 'var(--font-sinhala)' }}
            >
              {Object.values(DEDICATION_TYPES).map(tp => (
                <option key={tp.id} value={tp.id}>{tp.sinhala}</option>
              ))}
            </select>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="මාතෘකාව (උදා: සූත්‍ර අධ්‍යයන පින් අනුමෝදනාව)"
              className="km-lab-input"
              style={{ padding: '6px 9px', fontSize: '0.8rem', fontFamily: 'var(--font-sinhala)' }}
            />

            <textarea
              rows={3}
              required
              value={dedicationText}
              onChange={(e) => setDedicationText(e.target.value)}
              placeholder="පුණ්‍යානුමෝදනා ප්‍රාර්ථනාව..."
              className="km-lab-input"
              style={{ padding: '6px 9px', fontSize: '0.8rem', fontFamily: 'var(--font-sinhala)', resize: 'vertical', lineHeight: 1.45 }}
            />

            <select
              aria-label="Linked Merit Book entry"
              value={linkedPinPothaId}
              onChange={(e) => setLinkedPinPothaId(e.target.value)}
              className="km-lab-input"
              style={{ padding: '6px 9px', fontSize: '0.78rem' }}
            >
              <option value="">— Link a Merit Book entry (optional) —</option>
              {pinEntries.map(p => (
                <option key={p.id} value={p.id}>{p.entryDate} · {p.title}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setVisibility('private')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '6px 8px',
                  borderRadius: '9px',
                  border: `1px solid ${visibility === 'private' ? '#A35B3D' : 'var(--lab-border)'}`,
                  background: visibility === 'private' ? 'rgba(163, 91, 61, 0.12)' : 'transparent',
                  color: visibility === 'private' ? '#A35B3D' : 'var(--lab-text-muted)',
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-sinhala)',
                  cursor: 'pointer'
                }}
              >
                <Lock size={12} />
                <span>පෞද්ගලික</span>
              </button>
              <button
                type="button"
                onClick={() => setVisibility('public')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '6px 8px',
                  borderRadius: '9px',
                  border: `1px solid ${visibility === 'public' ? '#5F6E43' : 'var(--lab-border)'}`,
                  background: visibility === 'public' ? 'rgba(95, 110, 67, 0.14)' : 'transparent',
                  color: visibility === 'public' ? '#5F6E43' : 'var(--lab-text-muted)',
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-sinhala)',
                  cursor: 'pointer'
                }}
              >
                <Globe size={12} />
                <span>පොදු අනුමෝදනා</span>
              </button>
            </div>

            <button
              type="submit"
              className="km-lab-btn-primary"
              style={{ justifyContent: 'center', padding: '7px', borderRadius: '9px', fontSize: '0.8rem', fontFamily: 'var(--font-sinhala)' }}
            >
              <Plus size={14} />
              <span>පුණ්‍යානුමෝදනාව සුරකින්න</span>
            </button>
          </div>
        </form>

        {/* Right: Dedications List */}
        <div className="km-lab-card" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setFilterType('all');
                  setPage(1);
                }}
                className={filterType === 'all' ? 'km-lab-btn-primary' : 'km-lab-btn'}
                style={{ padding: '3px 8px', fontSize: '0.7rem', fontFamily: 'var(--font-sinhala)' }}
              >
                සියල්ල ({dedications.length})
              </button>
              {Object.values(DEDICATION_TYPES).map(tp => {
                const active = filterType === tp.id;
                const dotColor = TYPE_COLORS[tp.id] || '#A35B3D';
                return (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => {
                      setFilterType(active ? 'all' : tp.id);
                      setPage(1);
                    }}
                    className={active ? 'km-lab-btn-primary' : 'km-lab-btn'}
                    style={{ padding: '3px 8px', fontSize: '0.7rem', gap: '4px', fontFamily: 'var(--font-sinhala)' }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: active ? '#FAF8F5' : dotColor }} />
                    <span>{tp.sinhala}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {pagedDedications.length === 0 ? (
            <div style={{ padding: '26px 14px', textAlign: 'center', color: 'var(--lab-text-muted)', fontFamily: 'var(--font-sinhala)', background: 'var(--lab-bg-subtle)', borderRadius: '10px' }}>
              <HeartHandshake size={24} style={{ opacity: 0.45, marginBottom: '4px' }} />
              <div style={{ fontSize: '0.82rem' }}>තවමත් පුණ්‍යානුමෝදනා සටහන් නොමැත.</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {pagedDedications.map(d => {
                  const typeCfg = DEDICATION_TYPES[d.dedicationType] || DEDICATION_TYPES.pattidana;
                  const typeColor = TYPE_COLORS[d.dedicationType] || '#A35B3D';
                  const linkedPin = d.linkedPinPothaId ? pinEntryMap[d.linkedPinPothaId] : null;
                  const createdDate = d.createdAt ? d.createdAt.slice(0, 10) : '';
                  return (
                    <div
                      key={d.id}
                      onClick={() => setViewingItem(d)}
                      className="km-lab-card-interactive"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: 'var(--lab-bg-subtle)',
                        border: '1px solid var(--lab-border)',
                        borderLeft: `4px solid ${typeColor}`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.67rem', fontWeight: '700', color: typeColor, background: `${typeColor}18`, padding: '1px 7px', borderRadius: '999px', fontFamily: 'var(--font-sinhala)' }}>
                            {typeCfg.sinhala}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.67rem', color: d.visibility === 'public' ? '#5F6E43' : 'var(--lab-text-muted)', fontWeight: '600', fontFamily: 'var(--font-sinhala)' }}>
                            {d.visibility === 'public' ? <Globe size={10} /> : <Lock size={10} />}
                            <span>{d.visibility === 'public' ? 'පොදු' : 'පෞද්ගලික'}</span>
                          </span>
                          {linkedPin && (
                            <span className="km-lab-tag" style={{ fontSize: '0.65rem', padding: '1px 6px', fontFamily: 'var(--font-sinhala)' }}>
                              {linkedPin.title}
                            </span>
                          )}
                          {createdDate && (
                            <span style={{ fontSize: '0.68rem', color: 'var(--lab-text-muted)', fontFamily: 'monospace' }}>
                              {createdDate}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDedication(d.id);
                          }}
                          style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '1px', flexShrink: 0 }}
                          title="ඉවත් කරන්න"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: 'var(--font-sinhala)',
                        fontSize: '0.84rem',
                        lineHeight: 1.35
                      }}>
                        <span style={{ fontWeight: '700', color: 'var(--lab-text)' }}>{d.title}</span>
                        {d.dedicationText && (
                          <span style={{ fontSize: '0.74rem', color: 'var(--lab-text-muted)', fontWeight: '400' }}>
                            {' '}— {d.dedicationText}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <PaginationBar
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
                compact
              />
            </>
          )}
        </div>
      </div>

      {/* View Dedication Modal */}
      {viewingItem && (
        <div
          onClick={() => setViewingItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(35, 31, 27, 0.48)',
            backdropFilter: 'blur(3px)',
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
              maxWidth: '500px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.22)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.73rem',
                fontWeight: '700',
                color: TYPE_COLORS[viewingItem.dedicationType] || '#A35B3D',
                background: `${TYPE_COLORS[viewingItem.dedicationType] || '#A35B3D'}18`,
                padding: '3px 10px',
                borderRadius: '999px',
                fontFamily: 'var(--font-sinhala)'
              }}>
                {(DEDICATION_TYPES[viewingItem.dedicationType] || DEDICATION_TYPES.pattidana).sinhala}
              </span>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}
                title="වසන්න"
              >
                <X size={18} />
              </button>
            </div>

            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--lab-text)', fontFamily: 'var(--font-sinhala)' }}>
              {viewingItem.title}
            </h3>

            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--lab-text-muted)', lineHeight: 1.7, fontFamily: 'var(--font-sinhala)', whiteSpace: 'pre-wrap' }}>
              {viewingItem.dedicationText}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid var(--lab-border)', fontSize: '0.75rem', color: 'var(--lab-text-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-sinhala)' }}>
                {viewingItem.visibility === 'public' ? <Globe size={12} color="#5F6E43" /> : <Lock size={12} />}
                <span>{viewingItem.visibility === 'public' ? 'පොදු අනුමෝදනා' : 'පෞද්ගලික'}</span>
              </span>
              {viewingItem.createdAt && (
                <span style={{ fontFamily: 'monospace' }}>{viewingItem.createdAt.slice(0, 10)}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
