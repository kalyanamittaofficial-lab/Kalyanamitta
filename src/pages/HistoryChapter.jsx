import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, X, Info } from 'lucide-react';
import { arahantsIntro, titledArahants, untitledArahants } from '../data/arahantsData';
import { relicsIntro, solosmasthanaIntro, solosmasthana } from '../data/relicsData';

const buddhaLifeTimeline = [
  {
    id: 1,
    title: 'උපතට පෙර',
    desc: 'දීපංකර බුදුරජාණන් වහන්සේගෙන් නියත විවරණ ලැබීම සහ බෝසත් චරිතයේ ආරම්භය.',
    link: 'https://pitaka.lk/books/buddha-charithaya/3.html',
    bookName: 'ගෞතම බුද්ධ චරිතය',
  },
  {
    id: 2,
    title: 'සිදුහත් කුමරුගේ උපත',
    desc: 'ලුම්බිණි සල් උයනේදී සිදුහත් කුමරුගේ උපත සහ ගිහි ජීවිතය.',
    link: 'https://pitaka.lk/books/buddha-charithaya/5.html',
    bookName: 'ගෞතම බුද්ධ චරිතය',
  },
  {
    id: 3,
    title: 'මහා අභිනිෂ්ක්‍රමණය',
    desc: 'සතර පෙරනිමිති දැක ගිහිගෙය හැර යාම සහ දුෂ්කර ක්‍රියා කාලය.',
    link: 'https://pitaka.lk/books/buddha-charithaya/6.html',
    bookName: 'ගෞතම බුද්ධ චරිතය',
  },
  {
    id: 4,
    title: 'සම්බුද්ධත්වය ලැබීම',
    desc: 'ගයා ශීර්ෂයේ ජය ශ්‍රී මහා බෝධි මූලයේදී උතුම් වූ සම්මා සම්බුද්ධත්වයට පත්වීම.',
    link: 'https://pitaka.lk/books/buddha-charithaya/7.html',
    bookName: 'ගෞතම බුද්ධ චරිතය',
  },
  {
    id: 5,
    title: 'ප්‍රථම ධර්ම දේශනාව',
    desc: 'බරණැස ඉසිපතන මිගදායේදී පස්වග තවුසන්ට දම්සක් පැවතුම් සූත්‍රය දේශනා කිරීම.',
    link: 'https://pitaka.lk/books/buddha-charithaya/8.html',
    bookName: 'ගෞතම බුද්ධ චරිතය',
  },
  {
    id: 6,
    title: 'මහා පිරිනිවන් පෑම',
    desc: 'කුසිනාරා නුවර මල්ල රජදරුවන්ගේ උපවත්තන සල් උයනේදී පිරිනිවන් පෑම.',
    link: 'https://pitaka.lk/books/buddha-charithaya/38.html',
    bookName: 'ගෞතම බුද්ධ චරිතය',
  }
];

export default function HistoryChapter() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [iframeUrl, setIframeUrl] = useState(null);

  const isBuddhaLife = chapterId === 'life-of-buddha';
  const isArahants = chapterId === 'arahants';
  const isRelics = chapterId === 'sacred-relics';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterId]);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>
      
      {isArahants ? (
        <ArahantsView navigate={navigate} setIframeUrl={setIframeUrl} />
      ) : isRelics ? (
        <RelicsView navigate={navigate} />
      ) : !isBuddhaLife ? (
        <div style={{ minHeight: '100vh', padding: '120px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--text-main)' }}>මෙම පරිච්ඡේදය ඉක්මනින්ම යාවත්කාලීන වනු ඇත</h1>
          <button 
            onClick={() => navigate('/history')}
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '12px 24px', borderRadius: '30px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={18} /> ආපසු යන්න
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', padding: '120px 20px 60px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '60px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <button 
            onClick={() => navigate('/history')}
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '20px', color: 'var(--text-main)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}
          >
            <ArrowLeft size={16} /> ඉතිහාසය මෙනුවට
          </button>
          <h1 style={{ fontSize: '3rem', color: 'var(--text-main)', margin: 0 }}>බුද්ධ චරිතය</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '800px', margin: 0 }}>
            බුදුරජාණන් වහන්සේගේ අසිරිමත් ජීවිත කතාව. පහත දැක්වෙන කාලරේඛාව හරහා වැදගත් සන්ධිස්ථාන ගවේෂණය කරන්න. විස්තරාත්මක කියවීම සඳහා ප්‍රධාන ග්‍රන්ථ භාවිතා කළ හැක.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setIframeUrl('https://pitaka.lk/books/buddha-charithaya/index.html')}
              style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem', fontWeight: 600 }}
            >
              <BookOpen size={20} /> ගෞතම බුද්ධ චරිතය - සම්පූර්ණ පොත
            </button>
            <button 
              onClick={() => setIframeUrl('https://pitaka.lk/books/sampinditha-mahanidanaya/index.html')}
              style={{ background: 'var(--glass-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem', fontWeight: 600 }}
            >
              <BookOpen size={20} /> සම්පිණ්ඩිත මහානිදානය
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Timeline Vertical Line */}
          <div style={{ position: 'absolute', left: '24px', top: '20px', bottom: '20px', width: '2px', background: 'var(--glass-border)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {buddhaLifeTimeline.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ display: 'flex', gap: '30px', position: 'relative' }}
              >
                {/* Node */}
                <div style={{ 
                  width: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg-main)', border: '2px solid var(--primary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, flexShrink: 0,
                  color: 'var(--primary)', fontWeight: 'bold'
                }}>
                  {item.id}
                </div>

                {/* Content Card */}
                <div style={{ 
                  background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', 
                  padding: '24px', flex: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: '0 0 12px 0' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: '0 0 20px 0' }}>{item.desc}</p>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => setIframeUrl(item.link)}
                      style={{ 
                        background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', 
                        padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; }}
                    >
                      <BookOpen size={16} /> මෙම පරිච්ඡේදය කියවන්න
                    </button>
                    <a 
                      href={item.link} target="_blank" rel="noopener noreferrer"
                      style={{ 
                        background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', 
                        padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        fontSize: '0.9rem', textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--glass-border)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <ExternalLink size={16} /> නව කවුළුවකින්
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Iframe Reader Overlay */}
      <AnimatePresence>
        {iframeUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ 
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
              background: 'var(--bg-main)', zIndex: 1000, display: 'flex', flexDirection: 'column'
            }}
          >
            {/* Overlay Header */}
            <div style={{ 
              height: '60px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', 
              justifyContent: 'space-between', padding: '0 20px', background: 'var(--bg-main)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={20} color="var(--primary)" />
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Pitaka.lk Reader</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <a 
                  href={iframeUrl} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '0.9rem' }}
                >
                  <ExternalLink size={16} /> Open externally
                </a>
                <button 
                  onClick={() => setIframeUrl(null)}
                  style={{ background: 'var(--glass-border)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Iframe content */}
            <div style={{ flex: 1, width: '100%', background: '#fff' }}>
              <iframe 
                src={iframeUrl} 
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Pitaka Reader"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function ArahantsView({ navigate, setIframeUrl }) {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>
      
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '120px 20px 60px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '60px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <button 
            onClick={() => navigate('/history')}
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '20px', color: 'var(--text-main)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}
          >
            <ArrowLeft size={16} /> ඉතිහාසය මෙනුවට
          </button>
          
          <h1 style={{ fontSize: '3rem', color: 'var(--text-main)', margin: 0 }}>අසූ මහා ශ්‍රාවකයන් වහන්සේලා</h1>
          
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <Info size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: '4px' }} />
              <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>
                {arahantsIntro}
              </p>
            </div>
          </div>
        </div>

        {/* Titled Arahants Grid */}
        <h2 style={{ color: 'var(--primary)', fontSize: '1.8rem', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
          අග්‍රස්ථාන ලැබූ මහරහතන් වහන්සේලා
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '60px' }}>
          {titledArahants.map((arahant, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 10) * 0.05 }}
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column' }}
            >
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '0 0 12px 0', lineHeight: 1.4 }}>{arahant.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 20px 0', flex: 1 }}>{arahant.desc}</p>
              
              {arahant.link && (
                <button 
                  onClick={() => setIframeUrl(arahant.link)}
                  style={{ 
                    background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', 
                    padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                    fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s', width: 'fit-content'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; }}
                >
                  <BookOpen size={16} /> විස්තර කියවන්න
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Untitled Arahants Grid */}
        <h2 style={{ color: 'var(--primary)', fontSize: '1.8rem', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
          තනතුරු නොලැබූ අසූමහා ශ්‍රාවක රහතන් වහන්සේලා
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {untitledArahants.map((arahant, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 10) * 0.05 }}
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '20px' }}
            >
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '0 0 12px 0', lineHeight: 1.4 }}>{arahant.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{arahant.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}

function RelicsView({ navigate }) {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>
      
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', padding: '120px 20px 60px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '60px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <button 
            onClick={() => navigate('/history')}
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '20px', color: 'var(--text-main)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}
          >
            <ArrowLeft size={16} /> ඉතිහාසය මෙනුවට
          </button>
          
          <h1 style={{ fontSize: '3rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.2 }}>ලක්දිව ධාතූන් වහන්සේලා හා පාරිභෝගික වස්තු</h1>
          
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px', marginTop: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <p style={{ color: 'var(--text-main)', fontSize: '1.15rem', lineHeight: 1.9, margin: 0, textAlign: 'justify' }}>
              {relicsIntro}
            </p>
          </div>
        </div>

        {/* Solosmasthana */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ color: 'var(--primary)', fontSize: '1.8rem', marginBottom: '16px' }}>සොළොස්මස්ථාන</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '30px' }}>
            {solosmasthanaIntro}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {solosmasthana.map((place, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 10) * 0.05 }}
                style={{ 
                  background: 'var(--glass-bg)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '12px', 
                  padding: '16px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px' 
                }}
              >
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '0.9rem'
                }}>
                  {idx + 1}
                </div>
                <span style={{ color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: 500 }}>
                  {place}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
