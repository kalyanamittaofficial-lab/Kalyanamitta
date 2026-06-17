import React from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <div className="stack-on-mobile mobile-padding" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 48px',
      marginTop: '15vh',
      width: '100%',
      maxWidth: '1600px',
      margin: '15vh auto 0 auto'
    }}>
      {/* Left side text and buttons */}
      <div className="text-center-mobile" style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{
          fontSize: 'clamp(3rem, 5vw, 5rem)',
          fontWeight: '400',
          color: 'var(--gold-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '8px',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          fontFamily: 'var(--font-serif)'
        }}>කල්‍යාණමිත්ත</h1>
        
        <h2 style={{
          fontSize: 'clamp(1.1rem, 1.3vw, 1.3rem)',
          fontWeight: '400',
          color: 'rgba(255,255,255,0.95)',
          marginBottom: '32px',
          lineHeight: '1.6',
          fontStyle: 'italic',
          fontFamily: 'var(--font-serif)',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          maxWidth: '450px'
        }}>
          "සකලමේව හිදං ආනන්ද, බ්‍රහ්මචරියං යදිදං කල්‍යාණමිත්තතා කල්‍යාණසහායතා කල්‍යාණසම්පවංකතා"
        </h2>
        
        <div className="stack-on-mobile" style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => navigate('/community')}
            style={{
            background: 'linear-gradient(135deg, rgba(163,117,69,0.9) 0%, rgba(196,152,79,0.9) 100%)',
            color: '#fff',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '40px',
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(196, 152, 79, 0.3)',
            backdropFilter: 'blur(10px)',
            width: 'fit-content'
          }}>
            කල්‍යාණ මිත්‍රත්වය <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Right side Quote Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(10, 12, 16, 0.35)', // More transparent
        backdropFilter: 'blur(8px)', // Less blur to see video through
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Elegant top accent line */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '30%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)', opacity: 0.4 }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold-primary)', opacity: 0.4 }}></div>
          <div style={{ color: 'var(--gold-primary)', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '0.05em' }}>කල්‍යාණ මිත්‍රත්වය</div>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold-primary)', opacity: 0.4 }}></div>
        </div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '1rem', 
            marginBottom: '20px', 
            lineHeight: '1.7', 
            fontFamily: 'var(--font-serif)',
            textAlign: 'justify',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            "ආනන්දය එසේ කියන්න එපා. ආනන්දය එසේ කියන්න එපා. මේ මාර්ග බ්‍රහ්මචරියාවේ හරි අඩක් නොව, මුළුමනින්ම රඳා පවතින්නේ කල්‍යාණ මිත්‍රත්වය, කල්‍යාණ යහළුවන් සහ කල්‍යාණ සහායකයන් මතය. කල්‍යාණ මිත්‍රයන් ඇති භික්ෂුව ආර්ය අෂ්ටාංගික මාර්ගය වඩයි, බහුල වශයෙන් ප්‍රගුණ කරයි."
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontStyle: 'italic', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            — උපඩ්ඪ සූත්‍රය (සංයුත්ත නිකාය)
          </div>
        </div>
      </motion.div>
    </div>
  );
}
