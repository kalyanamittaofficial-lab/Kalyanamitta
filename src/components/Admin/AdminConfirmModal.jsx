import React, { useEffect } from 'react';
import { AlertTriangle, Info, X, Loader2 } from 'lucide-react';

export default function AdminConfirmModal({
  isOpen,
  title = 'Confirmation Required',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || loading) return;
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        animation: 'admModalFade 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel?.();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#141418',
          border: danger ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: danger
            ? '0 24px 60px rgba(0,0,0,0.6), 0 0 30px rgba(239, 68, 68, 0.15)'
            : '0 24px 60px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          animation: 'admModalPop 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '22px 24px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: danger ? 'rgba(239, 68, 68, 0.12)' : 'rgba(140, 21, 21, 0.15)',
              border: danger ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(140, 21, 21, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {danger ? (
              <AlertTriangle size={20} color="#ef4444" />
            ) : (
              <Info size={20} color="#c0392b" />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                margin: '0 0 6px 0',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.9rem',
                color: '#a1a1aa',
                lineHeight: 1.5,
              }}
            >
              {message}
            </p>
          </div>

          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#71717a',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.color = '#71717a';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(0, 0, 0, 0.25)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              color: '#d4d4d8',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#d4d4d8';
              }
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              border: 'none',
              background: danger
                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                : 'linear-gradient(135deg, #a31c1c 0%, #8c1515 100%)',
              color: '#fff',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: danger
                ? '0 4px 14px rgba(220, 38, 38, 0.35)'
                : '0 4px 14px rgba(140, 21, 21, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.filter = 'brightness(1.15)';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.filter = 'none';
            }}
          >
            {loading && <Loader2 size={16} style={{ animation: 'admSpin 1s linear infinite' }} />}
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes admModalFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes admModalPop { from { opacity: 0; transform: scale(0.96) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes admSpin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
