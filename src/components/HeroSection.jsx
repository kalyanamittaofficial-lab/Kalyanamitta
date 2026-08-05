import React from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <div className="stack-on-mobile mobile-padding" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 48px',
      width: '100%',
      maxWidth: '1400px',
      margin: '5vh auto 0 auto',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Left side text and buttons */}
      <div className="text-center-mobile" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{
          fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
          fontWeight: '700',
          color: 'var(--primary)',
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          fontFamily: 'var(--font-serif)',
          lineHeight: '1.1'
        }}>කල්‍යාණමිත්ත</h1>
        
        <h2 style={{
          fontSize: 'clamp(1.2rem, 1.5vw, 1.5rem)',
          fontWeight: '400',
          color: 'var(--text-muted)',
          marginBottom: '40px',
          lineHeight: '1.8',
          fontFamily: 'var(--font-serif)',
          maxWidth: '550px',
          fontStyle: 'italic'
        }}>
          "සකලමේව හිදං ආනන්ද, බ්‍රහ්මචරියං යදිදං කල්‍යාණමිත්තතා කල්‍යාණසහායතා කල්‍යාණසම්පවංකතා"
        </h2>
        
        <div className="stack-on-mobile" style={{ display: 'flex', gap: '20px' }}>
          <button 
            onClick={() => navigate('/community')}
            style={{
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            padding: '16px 36px',
            borderRadius: '4px', // Academic sharp/slightly rounded corners
            fontSize: '1.05rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'var(--font-sinhala)',
            boxShadow: '0 4px 15px rgba(140, 21, 21, 0.2)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            කල්‍යාණ මිත්‍රත්වය <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Right side Quote Card */}
      <div 
        style={{
        width: '100%',
        maxWidth: '460px',
        background: 'var(--bg-secondary)', 
        border: '1px solid rgba(0,0,0,0.05)',
        borderLeft: '4px solid var(--primary)',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ශ්‍රී මුඛ දේශනාව</div>
        </div>
        
        <div>
          <p style={{ 
            color: 'var(--text-main)', 
            fontSize: '1.1rem', 
            marginBottom: '32px', 
            lineHeight: '1.9', 
            fontFamily: 'var(--font-serif)',
            textAlign: 'justify'
          }}>
            "ආනන්දය එසේ කියන්න එපා. ආනන්දය එසේ කියන්න එපා. මේ මාර්ග බ්‍රහ්මචරියාවේ හරි අඩක් නොව, මුළුමනින්ම රඳා පවතින්නේ කල්‍යාණ මිත්‍රත්වය, කල්‍යාණ යහළුවන් සහ කල්‍යාණ සහායකයන් මතය. කල්‍යාණ මිත්‍රයන් ඇති භික්ෂුව ආර්ය අෂ්ටාංගික මාර්ගය වඩයි, බහුල වශයෙන් ප්‍රගුණ කරයි."
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
            — උපඩ්ඪ සූත්‍රය (සංයුත්ත නිකාය)
          </div>
        </div>
      </div>
    </div>
  );
}
