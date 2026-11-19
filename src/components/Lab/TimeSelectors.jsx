import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

function CompactSelect({ value, options, onChange, ariaLabel, fontSize = '0.92rem' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const activeEl = listRef.current.querySelector('[data-selected="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'center' });
    }
  }, [open]);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="km-lab-input"
        style={{
          width: 'auto',
          padding: '7px 10px',
          fontSize,
          fontWeight: '700',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown size={14} style={{ opacity: 0.7 }} />
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 4px)',
            left: 0,
            zIndex: 60,
            minWidth: '100%',
            maxHeight: '144px',
            overflowY: 'auto',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--lab-border)',
            background: 'var(--lab-bg-elevated, #ffffff)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)'
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                data-selected={isSelected ? 'true' : 'false'}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '34px',
                  padding: '0 10px',
                  border: 'none',
                  borderRadius: '7px',
                  background: isSelected ? 'var(--lab-accent)' : 'transparent',
                  color: isSelected ? 'var(--lab-accent-fg)' : 'var(--lab-text)',
                  fontSize: '0.88rem',
                  fontWeight: isSelected ? '700' : '600',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function parseTime24(hhmm) {
  if (!hhmm || !hhmm.includes(':')) return { hour12: '05', minute: '30', period: 'AM' };
  const [hStr, mStr] = hhmm.split(':');
  const h24 = Number(hStr);
  const period = h24 >= 12 ? 'PM' : 'AM';
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return {
    hour12: String(h12).padStart(2, '0'),
    minute: String(Number(mStr || 0)).padStart(2, '0'),
    period
  };
}

function toTime24(hour12, minute, period) {
  let h = Number(hour12);
  if (period === 'AM' && h === 12) h = 0;
  if (period === 'PM' && h !== 12) h += 12;
  return `${String(h).padStart(2, '0')}:${String(Number(minute)).padStart(2, '0')}`;
}

export function EasyTimeSelector({ value, onChange }) {
  const { hour12, minute, period } = parseTime24(value);
  const hourOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((h) => ({
    value: h,
    label: h
  }));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => {
    const m = String(i).padStart(2, '0');
    return { value: m, label: m };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <CompactSelect
        ariaLabel="පැය"
        value={hour12}
        options={hourOptions}
        onChange={(newHour) => onChange(toTime24(newHour, minute, period))}
        fontSize="0.95rem"
      />
      <span style={{ fontWeight: '800', fontSize: '1rem' }}>:</span>
      <CompactSelect
        ariaLabel="මිනිත්තු"
        value={minute}
        options={minuteOptions}
        onChange={(newMinute) => onChange(toTime24(hour12, newMinute, period))}
        fontSize="0.95rem"
      />
      <div style={{ display: 'inline-flex', border: '1px solid var(--lab-border)', borderRadius: '8px', overflow: 'hidden' }}>
        {[
          { id: 'AM', label: 'පෙ.ව.' },
          { id: 'PM', label: 'ප.ව.' }
        ].map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(toTime24(hour12, minute, p.id))}
            style={{
              padding: '7px 10px',
              border: 'none',
              background: period === p.id ? 'var(--lab-accent)' : 'var(--lab-bg-elevated)',
              color: period === p.id ? 'var(--lab-accent-fg)' : 'var(--lab-text-muted)',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EasyDurationSelector({ totalMinutes, onChange }) {
  const total = Math.max(0, Number(totalMinutes || 0));
  const hrs = Math.min(23, Math.floor(total / 60));
  const mins = total % 60;

  const hourOptions = Array.from({ length: 24 }, (_, h) => ({
    value: h,
    label: `පැ ${String(h).padStart(2, '0')}`
  }));
  const minuteOptions = Array.from({ length: 60 }, (_, m) => ({
    value: m,
    label: `මි ${String(m).padStart(2, '0')}`
  }));

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <CompactSelect
        ariaLabel="පැය"
        value={hrs}
        options={hourOptions}
        onChange={(newHrs) => onChange(Number(newHrs) * 60 + mins)}
        fontSize="0.9rem"
      />
      <span style={{ fontWeight: '800' }}>:</span>
      <CompactSelect
        ariaLabel="මිනිත්තු"
        value={mins}
        options={minuteOptions}
        onChange={(newMins) => onChange(hrs * 60 + Number(newMins))}
        fontSize="0.9rem"
      />
    </div>
  );
}
