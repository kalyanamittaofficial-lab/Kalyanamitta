import React from 'react';
import { ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="stack-on-mobile mobile-padding" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 clamp(16px, 5vw, 48px)',
      width: '100%',
      maxWidth: '1400px',
      margin: '6vh auto 0 auto',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Left side text and buttons */}
      <div className="text-center-mobile" style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{
          fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
          fontWeight: '700',
          color: 'var(--primary)',
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          fontFamily: 'var(--font-serif)',
          lineHeight: '1.1'
        }}>
          කල්‍යාණමිත්ත
        </h1>
        
        <h2 style={{
          fontSize: 'clamp(1.15rem, 1.5vw, 1.45rem)',
          fontWeight: '400',
          color: 'var(--text-muted)',
          marginBottom: '36px',
          lineHeight: '1.8',
          fontFamily: 'var(--font-serif)',
          maxWidth: '560px',
          fontStyle: 'italic'
        }}>
          "සකලමේව හිදං ආනන්ද, බ්‍රහ්මචරියං යදිදං කල්‍යාණමිත්තතා කල්‍යාණසහායතා කල්‍යාණසම්පවංකතා"
        </h2>
        
        {/* Harmonious Action Group */}
        <div className="stack-on-mobile" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Primary Platform Button */}
          <button 
            onClick={() => navigate('/community')}
            style={{
              background: 'var(--primary)',
              color: '#ffffff',
              border: '1px solid transparent',
              padding: '15px 32px',
              borderRadius: '6px',
              fontSize: '1.02rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              fontFamily: 'var(--font-sinhala)',
              boxShadow: '0 4px 16px rgba(140, 21, 21, 0.22)'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.background = 'var(--primary-hover)'; 
              e.currentTarget.style.transform = 'translateY(-2px)'; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.background = 'var(--primary)'; 
              e.currentTarget.style.transform = 'translateY(0)'; 
            }}
          >
            කල්‍යාණ මිත්‍රත්වය <ChevronRight size={18} />
          </button>

          {/* Secondary WhatsApp Community Onboarding Button */}
          <button 
            onClick={() => navigate('/join')}
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              padding: '14px 22px',
              borderRadius: '6px',
              fontSize: '1.02rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              fontFamily: 'var(--font-sinhala)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.borderColor = '#25D366';
              e.currentTarget.style.background = 'rgba(37, 211, 102, 0.08)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 211, 102, 0.15)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#25D366',
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(37, 211, 102, 0.8)',
            }} />
            <MessageCircle size={18} color="#25D366" />
            <span>WhatsApp සමූහය</span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(37, 211, 102, 0.12)',
              color: '#16a34a',
              letterSpacing: '0.5px'
            }}>
              JOIN
            </span>
          </button>
        </div>

        {/* Subtle Supporting Micro-line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
          color: 'var(--text-muted)',
          fontSize: '0.86rem'
        }}>
          <Sparkles size={14} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
          <span>සජීවී ධර්ම සාකච්ඡා සහ ශාසනික කටයුතු පිළිබඳ දැනුවත් වීමට එක්වන්න</span>
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
        padding: 'clamp(24px, 5vw, 48px)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
      }}>
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
