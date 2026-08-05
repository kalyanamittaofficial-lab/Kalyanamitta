import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Info } from 'lucide-react';

export default function OtherChantings() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState('');

  // List of chantings
  const chantings = [
    { id: 1, name: 'කරණීයමෙත්ත සූත්‍රය', link: 'http://tripitaka.online/sutta/12604', isReady: true },
    { id: 2, name: 'රතන සූත්‍රය', link: '', isReady: false },
    { id: 3, name: 'මහා මංගල සූත්‍රය', link: '', isReady: false },
    { id: 4, name: 'ඛන්ධ පිරිත', link: '', isReady: false },
    { id: 5, name: 'මෝර පිරිත', link: '', isReady: false },
    { id: 6, name: 'ධජග්ග සූත්‍රය', link: '', isReady: false }
  ];

  const handleChantingClick = (chanting) => {
    if (chanting.isReady) {
      setConfirmUrl(chanting.link);
      setShowConfirmModal(true);
    } else {
      setShowComingSoonModal(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      color: 'var(--text-main)',
      paddingTop: '50px',
      paddingBottom: '120px'
    }}>
      <div className="mobile-padding" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div 
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>✧ ✧ ✧</div>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            color: 'var(--primary)', 
            marginBottom: '20px', 
            fontFamily: 'var(--font-serif)',
            fontWeight: '700' 
          }}>
            වෙනත් සජ්ඣායනයන්
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-sinhala)', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            පහත දැක්වෙන සූත්‍ර දේශනාවන්ගෙන් ඔබට අවශ්‍ය සජ්ඣායනාව තෝරාගන්න.
          </p>
        </div>

        {/* Chantings Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {chantings.map((chanting, index) => (
            <button
              key={chanting.id}
              onClick={() => handleChantingClick(chanting)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '4px',
                padding: '30px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-sinhala)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)';
              }}
            >
              <BookOpen size={32} color={chanting.isReady ? "var(--primary)" : "rgba(0,0,0,0.2)"} />
              <span style={{ fontSize: '1.2rem', fontWeight: '600', opacity: chanting.isReady ? 1 : 0.6 }}>{chanting.name}</span>
              
              {!chanting.isReady && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.05)',
                  padding: '4px 12px',
                  borderRadius: '30px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  ඉදිරියේදී
                </div>
              )}
            </button>
          ))}
        </div>

        {/* External Link Confirmation Modal */}
        {showConfirmModal && (
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div
              style={{
                background: 'var(--bg-main)',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '40px',
                maxWidth: '450px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                width: '60px', height: '60px', 
                borderRadius: '50%', 
                background: 'rgba(140,21,21,0.05)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                color: 'var(--primary)'
              }}>
                <BookOpen size={28} />
              </div>
              
              <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '16px', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>
                බාහිර වෙබ් අඩවියක්
              </h3>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', fontFamily: 'var(--font-sinhala)', lineHeight: '1.6' }}>
                මෙය කල්‍යාණමිත්ත වෙබ් අඩවියෙන් පරිබාහිර වෙබ් අඩවියකි. ඔබට මෙය නව පිටුවක විවෘත කිරීමට අවශ්‍යද?
              </p>
              
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '4px',
                    background: 'transparent',
                    border: '1px solid rgba(0,0,0,0.2)',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-sinhala)',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  අවලංගු කරන්න
                </button>
                <button
                  onClick={() => {
                    window.open(confirmUrl, '_blank');
                    setShowConfirmModal(false);
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '4px',
                    background: 'var(--primary)',
                    border: 'none',
                    color: '#fff',
                    fontFamily: 'var(--font-sinhala)',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  විවෘත කරන්න
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Coming Soon Modal */}
        {showComingSoonModal && (
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div
              style={{
                background: 'var(--bg-main)',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '40px',
                maxWidth: '450px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                width: '60px', height: '60px', 
                borderRadius: '50%', 
                background: 'rgba(0,0,0,0.05)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                color: 'var(--text-muted)'
              }}>
                <Info size={28} />
              </div>
              
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '16px', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>
                ඉදිරියේදී බලාපොරොත්තු වන්න
              </h3>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', fontFamily: 'var(--font-sinhala)', lineHeight: '1.6' }}>
                මෙම සූත්‍ර දේශනාව තවමත් අපගේ පද්ධතියට එක් කරමින් පවතී. කරුණාකර පසුව නැවත උත්සාහ කරන්න.
              </p>
              
              <button
                onClick={() => setShowComingSoonModal(false)}
                style={{
                  padding: '12px 40px',
                  borderRadius: '4px',
                  background: 'var(--primary)',
                  border: 'none',
                  color: '#fff',
                  fontFamily: 'var(--font-sinhala)',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                හරි
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
