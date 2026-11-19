import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginationBar({ page, totalPages, onPageChange, compact = false }) {
  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(1, page), totalPages);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        paddingTop: compact ? '4px' : '6px'
      }}
    >
      <button
        type="button"
        disabled={safePage <= 1}
        onClick={() => onPageChange(safePage - 1)}
        className="km-lab-btn"
        style={{
          padding: compact ? '3px 8px' : '4px 10px',
          fontSize: compact ? '0.7rem' : '0.74rem',
          opacity: safePage <= 1 ? 0.45 : 1,
          cursor: safePage <= 1 ? 'default' : 'pointer'
        }}
      >
        <ChevronLeft size={13} />
        <span>පෙර</span>
      </button>

      <span style={{ fontSize: compact ? '0.72rem' : '0.75rem', fontWeight: '700', color: 'var(--lab-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
        {safePage} / {totalPages}
      </span>

      <button
        type="button"
        disabled={safePage >= totalPages}
        onClick={() => onPageChange(safePage + 1)}
        className="km-lab-btn"
        style={{
          padding: compact ? '3px 8px' : '4px 10px',
          fontSize: compact ? '0.7rem' : '0.74rem',
          opacity: safePage >= totalPages ? 0.45 : 1,
          cursor: safePage >= totalPages ? 'default' : 'pointer'
        }}
      >
        <span>ඊළඟ</span>
        <ChevronRight size={13} />
      </button>
    </div>
  );
}
