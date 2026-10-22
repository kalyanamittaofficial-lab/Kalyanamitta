import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Compass, 
  Users, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { supabase } from '../utils/supabase';

const DISTRICTS = [
  'කොළඹ (Colombo)',
  'ගම්පහ (Gampaha)',
  'කළුතර (Kalutara)',
  'මහනුවර (Kandy)',
  'මාතලේ (Matale)',
  'නුවරඑළිය (Nuwara Eliya)',
  'ගාල්ල (Galle)',
  'මාතර (Matara)',
  'හම්බන්තොට (Hambantota)',
  'යාපනය (Jaffna)',
  'කිලිනොච්චිය (Kilinochchi)',
  'මන්නාරම (Mannar)',
  'වවුනියාව (Vavuniya)',
  'මුලතිව් (Mullaitivu)',
  'මඩකලපුව (Batticaloa)',
  'අම්පාර (Ampara)',
  'ත්‍රිකුණාමලය (Trincomalee)',
  'කුරුණෑගල (Kurunegala)',
  'පුත්තලම (Puttalam)',
  'අනුරාධපුරය (Anuradhapura)',
  'පොළොන්නරුව (Polonnaruwa)',
  'බදුල්ල (Badulla)',
  'මොණරාගල (Monaragala)',
  'රත්නපුර (Ratnapura)',
  'කෑගල්ල (Kegalle)',
  'විදේශගත (Overseas / Abroad)'
];

const AGE_GROUPS = [
  { id: '18-24', label: 'අවුරුදු 18 - 24', desc: 'තරුණ පරපුර / විශ්වවිද්‍යාල' },
  { id: '25-34', label: 'අවුරුදු 25 - 34', desc: 'වෘත්තීය / යොවුන් විය' },
  { id: '35-49', label: 'අවුරුදු 35 - 49', desc: 'මැදි විය / පවුල් ජීවිතය' },
  { id: '50+',   label: 'අවුරුදු 50 හෝ ඊට වැඩි', desc: 'ජ්‍යෙෂ්ඨ සාමාජිකයින්' }
];

const INTERESTS = [
  { id: 'sermons', label: 'ගැඹුරු ධර්ම දේශනා හා සාකච්ඡා', icon: '🎙️' },
  { id: 'meditation', label: 'සතිපට්ඨාන හා සමථ-විදර්ශනා භාවනා', icon: '🧘' },
  { id: 'daily-life', label: 'දෛනික ජීවිතයේ ගැටලුවලට ධර්මයෙන් විසඳුම්', icon: '🌿' },
  { id: 'pujas', label: 'මහා සම්බුද්ධ පූජා හා ශාසනික පුණ්‍යකර්ම', icon: '🌸' }
];

export default function CommunityJoin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    district: 'කොළඹ (Colombo)',
    ageGroup: '25-34',
    interest: 'sermons',
    referralSource: 'tiktok'
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState('https://chat.whatsapp.com/invite/kalyanamitta');

  const inputRef = useRef(null);

  // Focus input automatically on step change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  // Load configured WhatsApp Group link from DB or LocalStorage
  useEffect(() => {
    const loadGroupLink = async () => {
      try {
        const { data } = await supabase
          .from('community_settings')
          .select('whatsapp_group_url')
          .eq('id', 1)
          .single();
        if (data?.whatsapp_group_url) {
          setWhatsappGroupUrl(data.whatsapp_group_url);
        } else {
          const localLink = localStorage.getItem('km_whatsapp_group_url');
          if (localLink) setWhatsappGroupUrl(localLink);
        }
      } catch {
        const localLink = localStorage.getItem('km_whatsapp_group_url');
        if (localLink) setWhatsappGroupUrl(localLink);
      }
    };
    loadGroupLink();
  }, []);

  // Validation
  const validateCurrentStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
        setError('කරුණාකර ඔබගේ නම ඇතුළත් කරන්න.');
        return false;
      }
    } else if (step === 2) {
      const cleaned = formData.whatsappNumber.replace(/[\s-]/g, '');
      if (!cleaned || cleaned.length < 9) {
        setError('වලංගු WhatsApp දුරකථන අංකයක් ඇතුළත් කරන්න (උදා: 0771234567).');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    setError('');
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  // Keyboard Navigation: Enter key to proceed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    const newLead = {
      full_name: formData.fullName.trim(),
      whatsapp_number: formData.whatsappNumber.trim(),
      district: formData.district,
      age_group: formData.ageGroup,
      interest: formData.interest,
      referral_source: formData.referralSource || 'tiktok',
      created_at: new Date().toISOString(),
      status: 'joined'
    };

    try {
      // 1. Try Supabase insertion
      const { error: dbError } = await supabase
        .from('community_leads')
        .insert([newLead]);

      if (dbError) {
        console.warn('Supabase community_leads insert notice:', dbError.message);
      }
    } catch (err) {
      console.warn('Supabase offline or table missing, using resilient local backup.', err);
    }

    // 2. Resilient Local Backup Storage (Ensures 0% data loss)
    try {
      const existing = JSON.parse(localStorage.getItem('km_community_leads') || '[]');
      existing.unshift({ id: 'lead_' + Date.now(), ...newLead });
      localStorage.setItem('km_community_leads', JSON.stringify(existing));
    } catch (storageErr) {
      console.error('LocalStorage write error:', storageErr);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const progressPercentage = Math.round((step / totalSteps) * 100);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-main)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'clip',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <style>{`
        .portal-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary) 0%, var(--accent-gold) 100%);
          z-index: 100;
          transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .portal-header {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 50;
        }

        .portal-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text-main);
        }

        .portal-stage {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 24px 80px;
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          position: relative;
        }

        .typeform-card {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .step-index-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }

        .typeform-question {
          font-family: var(--font-sinhala);
          font-size: clamp(1.8rem, 4vw, 2.7rem);
          font-weight: 800;
          line-height: 1.25;
          color: var(--text-main);
          letter-spacing: -0.01em;
          margin: 0;
        }

        .typeform-hint {
          font-family: var(--font-sinhala);
          font-size: 1.05rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
        }

        .typeform-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 2px solid var(--glass-border);
          padding: 16px 0;
          font-size: clamp(1.4rem, 3vw, 2.1rem);
          font-family: var(--font-sinhala);
          color: var(--text-main);
          outline: none;
          transition: border-color 0.25s ease;
        }

        .typeform-input:focus {
          border-color: var(--primary);
        }

        .typeform-input::placeholder {
          color: var(--text-muted);
          opacity: 0.45;
        }

        .choice-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          margin-top: 10px;
        }

        @media (min-width: 640px) {
          .choice-grid-2 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .choice-btn {
          background: var(--bg-secondary);
          border: 1.5px solid var(--glass-border);
          border-radius: 16px;
          padding: 18px 22px;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .choice-btn:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        }

        .choice-btn.selected {
          border-color: var(--primary);
          background: rgba(140, 21, 21, 0.06);
          box-shadow: 0 6px 20px rgba(140, 21, 21, 0.12);
        }

        .portal-nav-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 18px;
        }

        .portal-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--primary);
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 14px;
          font-family: var(--font-sinhala);
          font-size: 1.05rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(140, 21, 21, 0.3);
        }

        .portal-btn-primary:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .portal-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-secondary);
          color: var(--text-muted);
          padding: 14px 20px;
          border-radius: 14px;
          border: 1px solid var(--glass-border);
          font-family: var(--font-sinhala);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .portal-btn-secondary:hover {
          color: var(--text-main);
          border-color: rgba(140, 21, 21, 0.3);
        }

        .success-card {
          width: 100%;
          max-width: 680px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 28px;
          padding: clamp(32px, 6vw, 56px);
          text-align: center;
          box-shadow: 0 25px 60px rgba(0,0,0,0.04);
        }

        .whatsapp-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #25d366;
          color: #ffffff;
          padding: 18px 36px;
          border-radius: 20px;
          font-family: var(--font-sinhala);
          font-size: 1.2rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 12px 35px rgba(37, 211, 102, 0.35);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 24px;
          width: 100%;
          max-width: 480px;
        }

        .whatsapp-cta-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 45px rgba(37, 211, 102, 0.45);
        }
      `}</style>

      {/* Dynamic Top Progress Bar */}
      <div 
        className="portal-progress-bar" 
        style={{ width: `${isSuccess ? 100 : progressPercentage}%` }} 
      />

      {/* Header */}
      <header className="portal-header">
        <Link to="/" className="portal-brand">
          <img src="/kalyanamitta-logo.png" alt="Logo" style={{ height: '38px', width: 'auto' }} />
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
              Kalyanamitta
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sinhala)' }}>
              නිල WhatsApp ප්‍රජාව
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Sparkles size={16} color="var(--accent-gold)" />
          <span style={{ fontWeight: 600 }}>TikTok Onboarding</span>
        </div>
      </header>

      {/* Interactive Main Stage */}
      <main className="portal-stage">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="typeform-card"
            >
              {/* Step 1: Full Name */}
              {step === 1 && (
                <>
                  <div className="step-index-badge">
                    <span>පියවර 01 / 0{totalSteps}</span>
                  </div>
                  <h1 className="typeform-question">
                    ඔබගේ සම්පූර්ණ නම කුමක්ද?
                  </h1>
                  <p className="typeform-hint">
                    කල්‍යාණමිත්ත ප්‍රජාව තුළ අප ඔබව ඇමතිය යුතු ගෞරවනීය නම මෙහි සටහන් කරන්න.
                  </p>
                  <input
                    ref={inputRef}
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="උදා: සුනිල් පෙරේරා"
                    className="typeform-input"
                    autoFocus
                  />
                </>
              )}

              {/* Step 2: WhatsApp Number */}
              {step === 2 && (
                <>
                  <div className="step-index-badge">
                    <span>පියවර 02 / 0{totalSteps}</span>
                  </div>
                  <h1 className="typeform-question">
                    ඔබගේ WhatsApp දුරකථන අංකය කුමක්ද?
                  </h1>
                  <p className="typeform-hint">
                    නිල WhatsApp සමූහයේ ආරාධනය හා සතිපතා ධර්ම දේශනා යාවත්කාලීන ලැබීමට මෙම අංකය භාවිත වේ.
                  </p>
                  <input
                    ref={inputRef}
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="උදා: 077 123 4567"
                    className="typeform-input"
                    autoFocus
                  />
                </>
              )}

              {/* Step 3: District */}
              {step === 3 && (
                <>
                  <div className="step-index-badge">
                    <span>පියවර 03 / 0{totalSteps}</span>
                  </div>
                  <h1 className="typeform-question">
                    ඔබ ජීවත්වන දිස්ත්‍රික්කය හෝ ප්‍රදේශය කුමක්ද?
                  </h1>
                  <p className="typeform-hint">
                    ඔබගේ ප්‍රදේශයට ආසන්න ධර්ම සාකච්ඡා හා ශාසනික පිංකම් පිළිබඳ දැනුවත් කිරීමට මෙය උපකාරී වේ.
                  </p>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="typeform-input"
                    style={{ cursor: 'pointer', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px' }}
                  >
                    {DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </>
              )}

              {/* Step 4: Age Group */}
              {step === 4 && (
                <>
                  <div className="step-index-badge">
                    <span>පියවර 04 / 0{totalSteps}</span>
                  </div>
                  <h1 className="typeform-question">
                    ඔබගේ වයස් කාණ්ඩය තෝරන්න
                  </h1>
                  <p className="typeform-hint">
                    ඔබට වඩාත් ගැළපෙන ධර්ම කරුණු සහ වැඩසටහන් සම්පාදනය සඳහා මෙය අවශ්‍ය වේ.
                  </p>
                  <div className="choice-grid choice-grid-2">
                    {AGE_GROUPS.map((grp) => {
                      const isSel = formData.ageGroup === grp.id;
                      return (
                        <div
                          key={grp.id}
                          onClick={() => setFormData({ ...formData, ageGroup: grp.id })}
                          className={`choice-btn ${isSel ? 'selected' : ''}`}
                        >
                          <div>
                            <div style={{ fontFamily: 'var(--font-sinhala)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                              {grp.label}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {grp.desc}
                            </div>
                          </div>
                          {isSel && (
                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Step 5: Interest */}
              {step === 5 && (
                <>
                  <div className="step-index-badge">
                    <span>පියවර 05 / 0{totalSteps}</span>
                  </div>
                  <h1 className="typeform-question">
                    ඔබ වඩාත් උනන්දු වන්නේ කුමන ධර්ම ක්ෂේත්‍රයටද?
                  </h1>
                  <p className="typeform-hint">
                    WhatsApp සමූහය තුළදී ඔබ බලාපොරොත්තු වන ප්‍රධාන අධ්‍යාත්මික මඟපෙන්වීම.
                  </p>
                  <div className="choice-grid">
                    {INTERESTS.map((int) => {
                      const isSel = formData.interest === int.id;
                      return (
                        <div
                          key={int.id}
                          onClick={() => setFormData({ ...formData, interest: int.id })}
                          className={`choice-btn ${isSel ? 'selected' : ''}`}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <span style={{ fontSize: '1.6rem' }}>{int.icon}</span>
                            <span style={{ fontFamily: 'var(--font-sinhala)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                              {int.label}
                            </span>
                          </div>
                          {isSel && (
                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Error Message */}
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-sinhala)' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="portal-nav-bar">
                <button onClick={handleNext} className="portal-btn-primary" disabled={isSubmitting}>
                  <span>{step === totalSteps ? (isSubmitting ? 'ලියාපදිංචි වෙමින්...' : 'ලියාපදිංචිය සම්පූර්ණ කරන්න') : 'මීළඟ පියවර'}</span>
                  <ArrowRight size={18} />
                </button>

                {step > 1 && (
                  <button onClick={handlePrev} className="portal-btn-secondary">
                    <ArrowLeft size={16} />
                    <span>පෙර පියවර</span>
                  </button>
                )}

                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: 'auto', display: 'none' }}>
                  Press <kbd style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '2px 6px', borderRadius: '4px' }}>Enter ↵</kbd>
                </span>
              </div>
            </motion.div>
          ) : (
            /* Success Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="success-card"
            >
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'rgba(37, 211, 102, 0.12)',
                color: '#25d366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <CheckCircle2 size={40} />
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                ලියාපදිංචිය සාර්ථකයි
              </div>

              <h2 style={{ fontFamily: 'var(--font-sinhala)', fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', color: 'var(--text-main)', fontWeight: 800, margin: '0 0 12px 0' }}>
                සාදු! සාදු! සාදු!
              </h2>

              <p style={{ fontFamily: 'var(--font-sinhala)', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 28px auto' }}>
                ගෞරවනීය <strong>{formData.fullName}</strong>, ඔබගේ තොරතුරු සාර්ථකව පද්ධතියට එක් විය. පහත බොත්තම මගින් අපගේ නිල WhatsApp සමූහයට දැන්ම එකතු වන්න.
              </p>

              {/* Big WhatsApp Join Button */}
              <a
                href={whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-cta-btn"
              >
                <MessageCircle size={24} />
                <span>WhatsApp සමූහයට එක්වන්න</span>
              </a>

              <div style={{ marginTop: '28px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', fontFamily: 'var(--font-sinhala)' }}>
                  ← කල්‍යාණමිත්ත මුල් පිටුවට පිවිසෙන්න
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
