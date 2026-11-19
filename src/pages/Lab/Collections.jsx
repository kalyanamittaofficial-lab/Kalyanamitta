import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, Trash2, ArrowRight, BookOpen, FileText, Network, Lock } from 'lucide-react';
import {
  getCollections,
  saveCollection,
  removeItemFromCollection,
  deleteCollection
} from '../../services/collectionsStore';
import { getLabLang, t } from '../../services/labLangStore';

export default function Collections() {
  const navigate = useNavigate();
  const [lang, setLang] = useState(() => getLabLang());
  const [collections, setCollections] = useState(() => getCollections());
  const [activeId, setActiveId] = useState(() => getCollections()[0]?.id || null);

  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchItem, setSearchItem] = useState('');

  useEffect(() => {
    const refresh = () => {
      const next = getCollections();
      setCollections(next);
      if (!activeId && next[0]) setActiveId(next[0].id);
    };
    const onLang = (e) => setLang(e.detail || getLabLang());
    window.addEventListener('labCollectionsUpdated', refresh);
    window.addEventListener('labLangUpdated', onLang);
    return () => {
      window.removeEventListener('labCollectionsUpdated', refresh);
      window.removeEventListener('labLangUpdated', onLang);
    };
  }, [activeId]);

  const activeCol = collections.find(c => c.id === activeId) || collections[0] || null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const created = saveCollection({ title, description });
    setActiveId(created.id);
    setTitle('');
    setDescription('');
    setShowNew(false);
  };

  const filteredItems = (activeCol?.items || []).filter(item => {
    const q = searchItem.trim().toLowerCase();
    if (!q) return true;
    return item.title?.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q);
  });

  const itemIcon = (type) => {
    if (type === 'sutta') return BookOpen;
    if (type === 'node') return Network;
    return FileText;
  };

  return (
    <div className="km-lab-page">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button className="km-lab-btn-primary" onClick={() => setShowNew(v => !v)}>
          <Plus size={15} />
          <span>{t(lang, 'නව එකතුවක්', 'New Collection')}</span>
        </button>
      </div>

      {showNew && (
        <form onSubmit={handleCreate} className="km-lab-card" style={{ padding: '18px', marginBottom: '18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <input
            className="km-lab-input"
            required
            placeholder={t(lang, 'එකතුවේ නම (උදා: සතිපට්ඨාන අධ්‍යයනය)', 'Collection title (e.g., Satipaṭṭhāna Study)')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="km-lab-input"
            placeholder={t(lang, 'කෙටි විස්තරය (විකල්ප)', 'Short description (optional)')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button type="submit" className="km-lab-btn-primary">{t(lang, 'සුරකින්න', 'Create')}</button>
            <button type="button" className="km-lab-btn" onClick={() => setShowNew(false)}>{t(lang, 'අවලංගු', 'Cancel')}</button>
          </div>
        </form>
      )}

      {collections.length === 0 ? (
        <div className="km-lab-card" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--lab-text-muted)' }}>
          <FolderKanban size={32} style={{ opacity: 0.4, marginBottom: '10px' }} />
          <div style={{ marginBottom: '14px' }}>
            {t(lang, 'තවමත් අධ්‍යයන එකතු කිසිවක් නොමැත.', 'No study collections yet.')}
          </div>
          <button className="km-lab-btn-primary" onClick={() => setShowNew(true)}>
            <Plus size={15} />
            <span>{t(lang, 'පළමු එකතුව සාදන්න', 'Create Your First Collection')}</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(230px, 280px) 1fr', gap: '16px', alignItems: 'start' }}>
          {/* Collection List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {collections.map(col => {
              const active = col.id === activeCol?.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setActiveId(col.id)}
                  className="km-lab-card"
                  style={{
                    textAlign: 'left',
                    padding: '13px 15px',
                    cursor: 'pointer',
                    border: active ? '2px solid var(--lab-accent)' : '1px solid var(--lab-border)',
                    background: active ? 'var(--lab-accent-soft)' : 'var(--lab-bg-elevated)'
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--lab-text)', marginBottom: '3px' }}>
                    {col.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--lab-text-muted)' }}>
                    {col.items.length} {t(lang, 'අයිතම', 'items')}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Collection Details */}
          {activeCol && (
            <div className="km-lab-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>
                    <Lock size={11} />
                    <span>{t(lang, 'පෞද්ගලික එකතුව', 'Private Collection')}</span>
                  </div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--lab-text)' }}>
                    {activeCol.title}
                  </h2>
                  {activeCol.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--lab-text-muted)', margin: 0 }}>{activeCol.description}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    deleteCollection(activeCol.id);
                    setActiveId(null);
                  }}
                  className="km-lab-btn"
                  style={{ color: '#DC2626', padding: '6px 10px' }}
                  title="Delete collection"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <input
                className="km-lab-input"
                placeholder={t(lang, 'එකතුව තුළ සොයන්න...', 'Search within collection...')}
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                style={{ marginBottom: '14px' }}
              />

              {filteredItems.length === 0 ? (
                <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--lab-text-muted)', fontSize: '0.86rem' }}>
                  {t(
                    lang,
                    'මෙම එකතුවේ තවම අයිතම නොමැත. සූත්‍ර කියවනයෙන් හෝ සටහන් වලින් අයිතම එක් කරන්න.',
                    'No items in this collection yet. Save suttas or notes into this collection from the Reader.'
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredItems.map(item => {
                    const Icon = itemIcon(item.itemType);
                    return (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '11px 14px', borderRadius: '10px', background: 'var(--lab-bg-subtle)', border: '1px solid var(--lab-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <Icon size={16} color="var(--lab-accent)" style={{ flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--lab-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--lab-text-muted)' }}>{item.subtitle}</div>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          {item.route && (
                            <button onClick={() => navigate(item.route)} className="km-lab-btn" style={{ padding: '5px 10px', fontSize: '0.76rem' }}>
                              <span>{t(lang, 'විවෘත', 'Open')}</span>
                              <ArrowRight size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => removeItemFromCollection(activeCol.id, item.id)}
                            style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
