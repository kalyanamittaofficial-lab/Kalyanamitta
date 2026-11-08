import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Quote, BookOpen, Layers } from 'lucide-react';

export default function AcademicCitationModal({ isOpen, onClose, sutta, activeSegment = null }) {
  const [citationFormat, setCitationFormat] = useState('apa'); // 'apa' | 'chicago' | 'harvard' | 'bibtex' | 'canonical'
  const [copied, setCopied] = useState(false);

  if (!isOpen || !sutta) return null;

  const segmentId = activeSegment?.segmentId || '';
  const suttaTitlePali = sutta.titlePali || sutta.title || 'Sutta';
  const suttaTitleEnglish = sutta.titleEnglish || 'Discourse';
  const canonicalRef = sutta.canonicalRef || 'Tipiṭaka';
  const ptsRef = activeSegment?.reference || 'Pali Text Society';
  const year = '2026';

  const getCitationText = () => {
    switch (citationFormat) {
      case 'apa':
        if (activeSegment) {
          return `${suttaTitlePali} (${suttaTitleEnglish}) [${canonicalRef}, Segment ${segmentId}]. In SuttaCentral Bilara Edition (Bhikkhu Sujato, Trans.). Kalyanamitta Academic Research Lab. https://kalyanamitta.org/lab/sutta/${sutta.id}#${segmentId}`;
        }
        return `${suttaTitlePali} (${suttaTitleEnglish}) [${canonicalRef}]. In SuttaCentral Bilara Edition (Bhikkhu Sujato, Trans.). Kalyanamitta Academic Research Lab. https://kalyanamitta.org/lab/sutta/${sutta.id}`;

      case 'chicago':
        if (activeSegment) {
          return `"${suttaTitlePali}: ${suttaTitleEnglish}," in SuttaCentral Bilara Edition, trans. Bhikkhu Sujato, segment ${segmentId}, ${canonicalRef} (Kalyanamitta Academic Lab, ${year}), https://kalyanamitta.org/lab/sutta/${sutta.id}#${segmentId}.`;
        }
        return `"${suttaTitlePali}: ${suttaTitleEnglish}," in SuttaCentral Bilara Edition, trans. Bhikkhu Sujato, ${canonicalRef} (Kalyanamitta Academic Lab, ${year}), https://kalyanamitta.org/lab/sutta/${sutta.id}.`;

      case 'harvard':
        if (activeSegment) {
          return `Bhikkhu Sujato (trans.) ${year}, '${suttaTitlePali} (${suttaTitleEnglish})', ${canonicalRef}, segment ${segmentId}, SuttaCentral Bilara Edition, Kalyanamitta Lab, viewed ${new Date().toLocaleDateString('en-GB')}, <https://kalyanamitta.org/lab/sutta/${sutta.id}#${segmentId}>.`;
        }
        return `Bhikkhu Sujato (trans.) ${year}, '${suttaTitlePali} (${suttaTitleEnglish})', ${canonicalRef}, SuttaCentral Bilara Edition, Kalyanamitta Lab, viewed ${new Date().toLocaleDateString('en-GB')}, <https://kalyanamitta.org/lab/sutta/${sutta.id}>.`;

      case 'canonical':
        return `Canonical Citation:
• Root Work: ${suttaTitlePali}
• Canonical Code: ${canonicalRef}
${activeSegment ? `• Segment UID: ${segmentId}\n• PTS Reference: ${ptsRef || 'N/A'}\n• Root Passage: "${activeSegment.rootPali}"` : ''}
• Database: Mahāsaṅgīti Tipiṭaka / SuttaCentral Bilara Engine
• Permanent URI: https://kalyanamitta.org/lab/sutta/${sutta.id}${activeSegment ? `#${segmentId}` : ''}`;

      case 'bibtex':
        const citeKey = activeSegment ? `${sutta.id}_${segmentId.replace(/[:.]/g, '_')}` : `${sutta.id}_bilara`;
        return `@incollection{${citeKey},
  title        = {${suttaTitlePali} (${suttaTitleEnglish})},
  booktitle    = {SuttaCentral Bilara Canonical Corpus},
  translator   = {Bhikkhu Sujato},
  year         = {${year}},
  note         = {Canonical Reference: ${canonicalRef}${activeSegment ? `, Segment ${segmentId}` : ''}},
  publisher    = {Kalyanamitta Academic Research Lab},
  url          = {https://kalyanamitta.org/lab/sutta/${sutta.id}${activeSegment ? `#${segmentId}` : ''}}
}`;

      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCitationText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(6px)',
          padding: '20px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          style={{
            maxWidth: '640px',
            width: '100%',
            background: 'var(--bg-main)',
            border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-sinhala), sans-serif'
          }}
        >
          {/* Modal Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(140, 21, 21, 0.1)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Quote size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>
                  Academic Citation Generator
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {activeSegment ? `Segment ${activeSegment.segmentId}` : suttaTitlePali}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Format Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {[
              { id: 'apa', label: 'APA 7th' },
              { id: 'chicago', label: 'Chicago' },
              { id: 'harvard', label: 'Harvard' },
              { id: 'canonical', label: 'Canonical Ref' },
              { id: 'bibtex', label: 'BibTeX' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCitationFormat(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: citationFormat === tab.id ? '1px solid var(--primary)' : '1px solid var(--border-color, rgba(0,0,0,0.08))',
                  background: citationFormat === tab.id ? 'var(--primary)' : 'transparent',
                  color: citationFormat === tab.id ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Citation Output Box */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
              fontFamily: citationFormat === 'bibtex' || citationFormat === 'canonical' ? 'monospace' : 'inherit',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              color: 'var(--text-main)',
              whiteSpace: 'pre-wrap',
              maxHeight: '220px',
              overflowY: 'auto',
              marginBottom: '20px'
            }}
          >
            {getCitationText()}
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.12))',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Close
            </button>

            <button
              onClick={handleCopy}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--primary)',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.2s ease'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Citation'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
