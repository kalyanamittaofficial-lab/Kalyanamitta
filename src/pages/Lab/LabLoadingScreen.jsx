import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';
import './labTheme.css';

export default function LabLoadingScreen({ message = 'ත්‍රිපිටක අධ්‍යයන අවකාශය පූරණය වෙමින් පවතී...' }) {
  const savedTheme = typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'light') : 'light';

  return (
    <motion.div
      className="km-lab-root"
      data-lab-theme={savedTheme}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--lab-bg)',
        color: 'var(--lab-text)',
        padding: '24px',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--lab-accent-soft) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 22px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0.12, 0.45] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '20px',
              border: '2px solid var(--lab-accent)'
            }}
          />
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '16px',
              background: 'var(--lab-bg-elevated)',
              border: '1px solid var(--lab-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--lab-shadow)'
            }}
          >
            <FlaskConical size={26} color="var(--lab-accent)" />
          </div>
        </div>

        <div style={{
          fontSize: '0.74rem',
          fontWeight: '700',
          fontFamily: 'var(--font-sinhala)',
          color: 'var(--lab-accent)',
          marginBottom: '6px'
        }}>
          අත්තදීප · මා දකින මඟ
        </div>
        <h1 style={{
          fontSize: '1.65rem',
          fontWeight: '700',
          fontFamily: 'var(--font-sinhala)',
          color: 'var(--lab-text)',
          margin: '0 0 6px 0'
        }}>
          මගේ දහම් මඟ
        </h1>
        <p style={{
          fontFamily: 'var(--font-sinhala)',
          fontSize: '0.9rem',
          color: 'var(--lab-text-muted)',
          margin: '0 0 24px 0'
        }}>
          සූත්‍ර අවබෝධයෙන් ප්‍රතිපදාවට
        </p>

        <div style={{
          width: '200px',
          height: '4px',
          borderRadius: '999px',
          background: 'var(--lab-border)',
          margin: '0 auto 12px auto',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '220%' }}
            transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '48%',
              height: '100%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, var(--lab-accent) 0%, var(--lab-gold) 100%)'
            }}
          />
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', margin: 0 }}>
          {message}
        </p>
      </div>
    </motion.div>
  );
}
