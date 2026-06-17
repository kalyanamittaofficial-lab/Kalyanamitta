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
      background: 'linear-gradient(to bottom, #000000, #111111)',
      color: '#ffffff',
      paddingTop: '100px',
      paddingBottom: '50px'
    }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{ color: 'var(--gold-primary)', marginBottom: '16px' }}>✧ ✧ ✧</div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            color: 'var(--gold-primary)', 
            marginBottom: '20px', 
            fontFamily: 'var(--font-sinhala)',
            fontWeight: '600' 
          }}>
            වෙනත් සජ්ඣායනයන්
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: 0.8, 
            fontFamily: 'var(--font-sinhala)', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            පහත දැක්වෙන සූත්‍ර දේශනාවන්ගෙන් ඔබට අවශ්‍ය සජ්ඣායනාව තෝරාගන්න.
          </p>
        </motion.div>

        {/* Chantings Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {chantings.map((chanting, index) => (
            <motion.button
              key={chanting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChantingClick(chanting)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(196,152,79,0.2)',
                borderRadius: '16px',
                padding: '30px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                color: '#fff',
                fontFamily: 'var(--font-sinhala)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(196,152,79,0.1)';
                e.currentTarget.style.border = '1px solid rgba(196,152,79,0.5)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(196,152,79,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.border = '1px solid rgba(196,152,79,0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <BookOpen size={32} color={chanting.isReady ? "var(--gold-primary)" : "rgba(255,255,255,0.4)"} style={{ opacity: 0.8 }} />
              <span style={{ fontSize: '1.2rem', fontWeight: '500', opacity: chanting.isReady ? 1 : 0.6 }}>{chanting.name}</span>
              
              {!chanting.isReady && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '4px 8px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.6)'
                }}>
                  ඉදිරියේදී
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* External Link Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  background: 'rgba(20,20,20,0.95)',
                  border: '1px solid rgba(196,152,79,0.3)',
                  borderRadius: '24px',
                  padding: '40px',
                  maxWidth: '450px',
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ 
                  width: '60px', height: '60px', 
                  borderRadius: '50%', 
                  background: 'rgba(196,152,79,0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                  color: 'var(--gold-primary)'
                }}>
                  <BookOpen size={28} />
                </div>
                
                <h3 style={{ fontSize: '1.5rem', color: 'var(--gold-primary)', marginBottom: '16px', fontFamily: 'var(--font-sinhala)' }}>
                  බාහිර වෙබ් අඩවියක්
                </h3>
                
                <p style={{ color: '#fff', opacity: 0.8, fontSize: '1.1rem', marginBottom: '32px', fontFamily: 'var(--font-sinhala)', lineHeight: '1.6' }}>
                  මෙය කල්‍යාණමිත්ත වෙබ් අඩවියෙන් පරිබාහිර වෙබ් අඩවියකි. ඔබට මෙය නව පිටුවක විවෘත කිරීමට අවශ්‍යද?
                </p>
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontFamily: 'var(--font-sinhala)',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    අවලංගු කරන්න (Cancel)
                  </button>
                  <button
                    onClick={() => {
                      window.open(confirmUrl, '_blank');
                      setShowConfirmModal(false);
                    }}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, var(--gold-primary), #D4AF37)',
                      border: 'none',
                      color: '#000',
                      fontFamily: 'var(--font-sinhala)',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    විවෘත කරන්න (Confirm)
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coming Soon Modal */}
        <AnimatePresence>
          {showComingSoonModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  background: 'rgba(20,20,20,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '24px',
                  padding: '40px',
                  maxWidth: '450px',
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ 
                  width: '60px', height: '60px', 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.05)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  <Info size={28} />
                </div>
                
                <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-sinhala)' }}>
                  ඉදිරියේදී බලාපොරොත්තු වන්න
                </h3>
                
                <p style={{ color: '#fff', opacity: 0.7, fontSize: '1.1rem', marginBottom: '32px', fontFamily: 'var(--font-sinhala)', lineHeight: '1.6' }}>
                  මෙම සූත්‍ර දේශනාව තවමත් අපගේ පද්ධතියට එක් කරමින් පවතී. කරුණාකර පසුව නැවත උත්සාහ කරන්න.
                </p>
                
                <button
                  onClick={() => setShowComingSoonModal(false)}
                  style={{
                    padding: '12px 40px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontFamily: 'var(--font-sinhala)',
                    fontSize: '1.1rem',
                    cursor: 'pointer'
                  }}
                >
                  හරි (OK)
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
