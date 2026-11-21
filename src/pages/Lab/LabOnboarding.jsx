import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, BookOpen, Network, BookHeart, ArrowRight, ArrowLeft, Check, Lock } from 'lucide-react';
import { getOnboardingState, saveOnboardingState } from '../../services/collectionsStore';
import { getLabLang, setLabLang, t } from '../../services/labLangStore';

export default function LabOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState(() => getLabLang());
  const saved = getOnboardingState();

  const [whyStudy, setWhyStudy] = useState(saved.reflections?.whyStudy || '');
  const [nibbanaUnderstanding, setNibbanaUnderstanding] = useState(saved.reflections?.nibbanaUnderstanding || '');
  const [questions, setQuestions] = useState(saved.reflections?.questions || '');
  const [dailyLifeFocus, setDailyLifeFocus] = useState(saved.reflections?.dailyLifeFocus || '');
  const [readingMode, setReadingMode] = useState(saved.preferences?.readingMode || 'parallel');

  const handleFinish = (skipped = false) => {
    saveOnboardingState({
      completed: !skipped,
      skipped,
      reflections: {
        whyStudy: whyStudy.trim(),
        nibbanaUnderstanding: nibbanaUnderstanding.trim(),
        questions: questions.trim(),
        dailyLifeFocus: dailyLifeFocus.trim()
      },
      preferences: {
        uiLang: lang,
        readingMode
      }
    });
    navigate('/lab');
  };

  return (
    <div className="km-lab-page" style={{ maxWidth: '760px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--lab-text-muted)' }}>
          {t(lang, `පියවර ${step} / 5`, `Step ${step} of 5`)}
        </span>
        <button
          onClick={() => handleFinish(true)}
          style={{ border: 'none', background: 'transparent', color: 'var(--lab-text-muted)', fontSize: '0.84rem', fontWeight: '600', cursor: 'pointer' }}
        >
          {t(lang, 'මඟ හරින්න (Skip)', 'Skip for now')}
        </button>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '22px' }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div
            key={s}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '999px',
              background: s <= step ? 'var(--lab-accent)' : 'var(--lab-border)'
            }}
          />
        ))}
      </div>

      <div className="km-lab-card" style={{ padding: 'clamp(22px, 4vw, 34px)' }}>
        {step === 1 && (
          <div>
            <div className="km-lab-badge">O1 · {t(lang, 'සාදරයෙන් පිළිගනිමු', 'Welcome')}</div>
            <h1 className="km-lab-title" style={{ marginBottom: '10px' }}>
              {t(lang, 'සූත්‍ර අධ්‍යයනාගාරය (Sutta Learning Lab)', 'Welcome to Sutta Learning Lab')}
            </h1>
            <p className="km-lab-subtitle" style={{ marginBottom: '18px' }}>
              {t(
                lang,
                'මෙය හුදු ඩිජිටල් පොත් පුස්තකාලයක් නොවේ. ත්‍රිපිටක සූත්‍ර කියවීම, පෞද්ගලික අවබෝධය සිතියම්ගත කිරීම, එදිනෙදා ප්‍රතිපදාව හා Merit Book සමඟ සම්බන්ධ කරන සජීවී ධර්ම අධ්‍යයන පරිසරයකි.',
                'This is more than a digital sutta library. It is a connected ecosystem linking Pāli & Sinhala sutta study, personal knowledge mapping, daily-life practice, and your private Merit Book.'
              )}
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="km-lab-badge">O2 · {t(lang, 'අරමුණ හඳුනාගැනීම', 'Understanding the Aim')}</div>
            <h1 className="km-lab-title" style={{ marginBottom: '10px' }}>
              {t(lang, 'නිවන යනු අවසාන අරමුණයි', 'Nibbāna as the Ultimate Aim')}
            </h1>
            <p className="km-lab-subtitle" style={{ marginBottom: '14px' }}>
              {t(
                lang,
                'ධර්මය අධ්‍යයනය කිරීමේ පරම අරමුණ නිවනයි. බුද්ධිමය දැනුම පමණක් ප්‍රත්‍යක්ෂ අවබෝධය නොවේ. මෙම පද්ධතිය කිසිදු අධ්‍යාත්මික මට්ටමක් හෝ ලකුණක් ගණනය නොකරයි.',
                'The ultimate aim of Dhamma study and practice is Nibbāna. Intellectual knowledge alone is not realization. This workspace never calculates spiritual levels or scores.'
              )}
            </p>
            <button
              onClick={() => navigate('/lab/sutta/sn-5-12-2-1')}
              className="km-lab-btn"
              style={{ marginTop: '6px' }}
            >
              <BookOpen size={14} />
              <span>{t(lang, 'ධම්මචක්කප්පවත්තන සූත්‍රය බලන්න', 'View Introductory Sutta (SN 56.11)')}</span>
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="km-lab-badge">O3 · {t(lang, 'මගේ ආරම්භක ස්ථානය', 'My Starting Point')}</div>
            <h1 className="km-lab-title" style={{ marginBottom: '8px' }}>
              {t(lang, 'ආරම්භක පෞද්ගලික සටහන්', 'Initial Personal Reflections')}
            </h1>
            <p className="km-lab-subtitle" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={13} />
              <span>{t(lang, 'මෙම සටහන් සම්පූර්ණයෙන්ම පෞද්ගලික වන අතර ඕනෑම වේලාවක වෙනස් කළ හැක.', 'All reflections are private by default and editable anytime.')}</span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <textarea
                rows={2}
                className="km-lab-input"
                placeholder={t(lang, 'මට ධර්මය ඉගෙනීමට අවශ්‍ය ඇයි? (විකල්ප)', 'Why do I want to study the Dhamma? (optional)')}
                value={whyStudy}
                onChange={(e) => setWhyStudy(e.target.value)}
              />
              <textarea
                rows={2}
                className="km-lab-input"
                placeholder={t(lang, 'නිවන පිළිබඳ මගේ වර්තමාන අවබෝධය කුමක්ද?', 'What do I currently understand about Nibbāna?')}
                value={nibbanaUnderstanding}
                onChange={(e) => setNibbanaUnderstanding(e.target.value)}
              />
              <textarea
                rows={2}
                className="km-lab-input"
                placeholder={t(lang, 'මා තුළ ඇති ප්‍රශ්න හෝ එදිනෙදා ජීවිතයේ විමසිය යුතු දේ...', 'Questions I have or aspects of daily life I want to examine...')}
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              />
              <input
                className="km-lab-input"
                placeholder={t(lang, 'දැනට පුහුණු වන ප්‍රතිපදාවක් ඇත්නම්...', 'Practices I am already undertaking...')}
                value={dailyLifeFocus}
                onChange={(e) => setDailyLifeFocus(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="km-lab-badge">O4 · {t(lang, 'අධ්‍යයන මනාපයන්', 'Learning Preferences')}</div>
            <h1 className="km-lab-title" style={{ marginBottom: '12px' }}>
              {t(lang, 'කියවීමේ සහ අතුරුමුහුණත් මනාපයන්', 'Reading & Interface Preferences')}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: '700', marginBottom: '8px' }}>
                  {t(lang, 'අතුරුමුහුණත් භාෂාව (UI Language)', 'Interface Language')}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'si', label: 'සිංහල (ප්‍රධාන)' },
                    { id: 'en', label: 'English (Optional)' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setLang(opt.id);
                        setLabLang(opt.id);
                      }}
                      className={lang === opt.id ? 'km-lab-btn-primary' : 'km-lab-btn'}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: '700', marginBottom: '8px' }}>
                  {t(lang, 'ත්‍රිපිටක කියවීමේ ආකාරය', 'Default Sutta Reading Mode')}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'parallel', label: t(lang, 'පාලි + සිංහල සමපාත', 'Pāli + Sinhala Parallel') },
                    { id: 'pali', label: t(lang, 'පාලි පමණක්', 'Pāli Only') },
                    { id: 'sinhala', label: t(lang, 'සිංහල පමණක්', 'Sinhala Only') }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setReadingMode(opt.id)}
                      className={readingMode === opt.id ? 'km-lab-btn-primary' : 'km-lab-btn'}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <div className="km-lab-badge">O5 · {t(lang, 'මගේ අධ්‍යයන අවකාශය', 'My Personal Workspace')}</div>
            <h1 className="km-lab-title" style={{ marginBottom: '12px' }}>
              {t(lang, 'සියලු අංග එකිනෙකට සම්බන්ධයි', 'One Connected Dhamma Ecosystem')}
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              {[
                { icon: BookOpen, title: t(lang, 'සූත්‍ර කියවනය', 'Sutta Reader'), desc: t(lang, 'පාලි සහ සිංහල ත්‍රිපිටකය කියවන්න, සටහන් තබන්න.', 'Read Pāli & Sinhala suttas, highlight, and annotate.') },
                { icon: Network, title: t(lang, 'මගේ සිතියම', 'My Map & Path'), desc: t(lang, 'අවබෝධය, සූත්‍ර සහ ප්‍රතිපදාව සම්බන්ධ කරන්න.', 'Connect Path Compass and Knowledge Map nodes.') },
                { icon: BookHeart, title: 'Merit Book', desc: t(lang, 'දාන, සීල, භාවනා, පුරුදු සහ දායකත්වයන් සටහන් කරන්න.', 'Record generosity, practice, habits, and contributions.') },
                { icon: Compass, title: t(lang, 'ප්‍රජා ගවේෂණය', 'Explore Maps'), desc: t(lang, 'අන් අය බෙදාගත් සිතියම් ගවේෂණය කරන්න.', 'Explore shared maps while preserving sources.') }
              ].map(card => {
                const Icon = card.icon;
                return (
                  <div key={card.title} style={{ padding: '12px 14px', borderRadius: '12px', background: 'var(--lab-bg-subtle)', border: '1px solid var(--lab-border)' }}>
                    <Icon size={18} color="var(--lab-accent)" style={{ marginBottom: '6px' }} />
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '3px' }}>{card.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', lineHeight: 1.5 }}>{card.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--lab-border)' }}>
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className="km-lab-btn"
            style={{ opacity: step === 1 ? 0.4 : 1 }}
          >
            <ArrowLeft size={14} />
            <span>{t(lang, 'ආපසු', 'Back')}</span>
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(s => Math.min(5, s + 1))}
              className="km-lab-btn-primary"
            >
              <span>{t(lang, 'ඉදිරියට', 'Continue')}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleFinish(false)}
              className="km-lab-btn-primary"
            >
              <Check size={14} />
              <span>{t(lang, 'ප්‍රධාන පුවරුවට පිවිසෙන්න', 'Enter Dashboard')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
