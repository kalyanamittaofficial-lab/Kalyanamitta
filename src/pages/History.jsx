import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { historyData } from '../data/historyData';

export default function History() {
  const navigate = useNavigate();

  useEffect(() => {
    // Reset overflow changes from previous cinematic design if returning
    document.body.style.overflow = 'auto';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingTop: '160px', paddingBottom: '120px', position: 'relative' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        
        {/* Header */}
        <div style={{ 
          marginBottom: '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px'
        }}>
          <span style={{
            color: 'var(--primary)',
            fontSize: '0.95rem',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Kalyanamitta Study Center
          </span>
          <h1 style={{ 
            fontSize: '4.5rem', 
            color: 'var(--text-main)', 
            margin: 0,
            fontWeight: 700,
            fontFamily: 'var(--font-serif)',
            lineHeight: 1.1
          }}>
            බෞද්ධ ඉතිහාසය
          </h1>
          <div style={{ width: '80px', height: '3px', background: 'var(--primary)', margin: '8px auto' }} />
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-muted)',
            maxWidth: '750px',
            lineHeight: 1.8,
            margin: 0
          }}>
            බුද්ධ චරිතය, රහතන් වහන්සේලාගේ කථාපුවත් සහ සම්බුද්ධ ශාසනයේ ඓතිහාසික විකාශනය පිළිබඳ ප්‍රමිතිගත අධ්‍යයනාත්මක විස්තර සහ ග්‍රන්ථ.
          </p>
        </div>

        {/* Academic Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '40px' }}>
          {historyData.map((category, index) => (
            <motion.div
              key={category.id}
              onClick={() => navigate(`/history/${category.id}`)}
              whileHover="hover"
              initial="initial"
              animate="animate"
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
              }}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {/* Image Container */}
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3/2',
                overflow: 'hidden',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
              }}>
                <motion.img 
                  src={category.image} 
                  alt={category.title}
                  variants={{
                    initial: { scale: 1 },
                    hover: { scale: 1.05 }
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)',
                  zIndex: 1
                }} />
                
                {/* Chapter Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  zIndex: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                  පරිච්ඡේදය {category.chapter}
                </div>
              </div>

              {/* Content Container */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 4px' }}>
                <h2 style={{
                  fontSize: '1.75rem',
                  color: 'var(--text-main)',
                  margin: '0 0 14px 0',
                  fontFamily: 'var(--font-serif)',
                  lineHeight: 1.3
                }}>
                  {category.title}
                </h2>
                
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  margin: '0 0 24px 0',
                  flex: 1
                }}>
                  {category.description}
                </p>

                <motion.div 
                  variants={{
                    initial: { color: 'var(--text-muted)', x: 0 },
                    hover: { color: 'var(--primary)', x: 6 }
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  <BookOpen size={18} /> අධ්‍යයනය කරන්න <ArrowRight size={18} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
