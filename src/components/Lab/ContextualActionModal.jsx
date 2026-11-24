import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Calendar, Inbox, Lightbulb, Sparkles } from 'lucide-react';
import { addIntention, createLinkedRoutineActivity } from '../../services/lifeActivityStore';

/**
 * Universal "What would you like to do with this?" contextual action modal.
 * Preserves source context (Sutta, Note, Map Node, Merit entry) into Daily Routine or Intention Inbox.
 */
export default function ContextualActionModal({ open, onClose, sourceContext }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(() => sourceContext?.suggestedTitle || sourceContext?.sourceTitle || '');
  const [category, setCategory] = useState(() => sourceContext?.suggestedCategory || 'dhamma');
  const [minutes, setMinutes] = useState(15);

  if (!open || !sourceContext) return null;

  const finalTitle = (title || sourceContext.suggestedTitle || sourceContext.sourceTitle || 'Mindful Practice').trim();

  const handleAction = (actionType) => {
    if (actionType === 'now') {
      createLinkedRoutineActivity({
        title: finalTitle,
        category,
        minutes,
        mode: 'now',
        sourceType: sourceContext.sourceType,
        sourceId: sourceContext.sourceId,
        sourceTitle: sourceContext.sourceTitle,
        sourceUrl: sourceContext.sourceUrl,
        excerpt: sourceContext.excerpt
      });
      onClose();
      navigate('/lab/daily-routine');
      return;
    }

    if (actionType === 'plan') {
      createLinkedRoutineActivity({
        title: finalTitle,
        category,
        minutes,
        mode: 'plan',
        sourceType: sourceContext.sourceType,
        sourceId: sourceContext.sourceId,
        sourceTitle: sourceContext.sourceTitle,
        sourceUrl: sourceContext.sourceUrl,
        excerpt: sourceContext.excerpt
      });
      onClose();
      navigate('/lab/daily-routine');
      return;
    }

    if (actionType === 'inbox') {
      addIntention({
        title: finalTitle,
        category,
        minutes,
        sourceType: sourceContext.sourceType,
        sourceId: sourceContext.sourceId,
        sourceTitle: sourceContext.sourceTitle,
        sourceUrl: sourceContext.sourceUrl,
        excerpt: sourceContext.excerpt
      });
      onClose();
      return;
    }

    if (actionType === 'reflect') {
      onClose();
      const params = new URLSearchParams();
      if (sourceContext.sourceTitle) params.set('sourceTitle', sourceContext.sourceTitle);
      if (sourceContext.sourceUrl) params.set('sourceUrl', sourceContext.sourceUrl);
      navigate(`/lab/reflection?${params.toString()}`);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
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
        className="km-po-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 22px 54px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Sparkles size={16} color="var(--po-blue, #0B3BFA)" />
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800' }}>
              Take this into daily life
            </h3>
          </div>
          <button type="button" onClick={onClose} className="km-lab-btn" style={{ padding: '4px 8px', borderRadius: '999px' }} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        {sourceContext.excerpt && (
          <div style={{
            padding: '8px 10px',
            borderRadius: '10px',
            background: 'var(--po-card-subtle)',
            borderLeft: '3px solid var(--po-blue, #0B3BFA)',
            fontSize: '0.76rem',
            color: 'var(--lab-text-muted)',
            lineHeight: 1.5
          }}>
            “{sourceContext.excerpt.slice(0, 140)}{sourceContext.excerpt.length > 140 ? '...' : ''}”
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--lab-text-muted)', marginBottom: '4px' }}>
              Intention / Practice Name
            </div>
            <input
              type="text"
              className="km-lab-input"
              style={{ padding: '7px 10px', fontSize: '0.84rem' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Practise patience in conversations..."
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="km-lab-input"
              style={{ flex: 1, minWidth: '140px', padding: '6px 9px', fontSize: '0.78rem' }}
            >
              <option value="dhamma">Dhamma Practice</option>
              <option value="education">Education / Study</option>
              <option value="job">Work & Career</option>
              <option value="family">Family</option>
              <option value="friends">Friends & Community</option>
            </select>

            <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
              {[10, 15, 30].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinutes(m)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '999px',
                    border: 'none',
                    background: minutes === m ? 'var(--po-blue, #0B3BFA)' : 'var(--po-card-subtle)',
                    color: minutes === m ? '#fff' : 'var(--lab-text)',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '4px' }}>
          <button
            type="button"
            onClick={() => handleAction('now')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: '#C8FF00',
              color: '#0F1115',
              fontSize: '0.78rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <Play size={13} fill="currentColor" />
            <span>Practise Now</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction('plan')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--po-blue, #0B3BFA)',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <Calendar size={13} />
            <span>Add to Today</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction('inbox')}
            className="km-lab-btn"
            style={{ borderRadius: '10px', padding: '8px 12px', fontSize: '0.76rem' }}
          >
            <Inbox size={13} />
            <span>Save Intention</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction('reflect')}
            className="km-lab-btn"
            style={{ borderRadius: '10px', padding: '8px 12px', fontSize: '0.76rem' }}
          >
            <Lightbulb size={13} />
            <span>Reflect on This</span>
          </button>
        </div>
      </div>
    </div>
  );
}
