import React from 'react';
import { motion } from 'framer-motion';
import { Users, Lightbulb, Compass, BookOpen } from 'lucide-react';

const Section = ({ title, icon: Icon, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay: delay }}
    style={{ marginBottom: '60px' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
      <div style={{ padding: '12px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'var(--primary)' }}>
        <Icon size={24} />
      </div>
      <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontFamily: 'var(--font-sinhala)', fontWeight: '700', margin: 0 }}>
        {title}
      </h2>
    </div>
    <div style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '2', fontFamily: 'var(--font-sinhala)', fontWeight: '400' }}>
      {children}
    </div>
  </motion.div>
);

export default function Community() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', background: 'var(--bg-main)' }}>
      {/* Main Content Wrapper */}
      <div className="mobile-padding" style={{ position: 'relative', zIndex: 10, padding: '5vh 24px 120px 24px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Hero Header */}
        <div className="text-center-mobile" style={{ textAlign: 'center', margin: '10vh auto 8vh auto', paddingBottom: '40px', borderBottom: '1px solid var(--glass-border)' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '700', color: 'var(--primary)', fontFamily: 'var(--font-serif)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
            කල්‍යාණ මිත්‍රත්වය
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', letterSpacing: '0.05em', fontWeight: '500', fontFamily: 'var(--font-sinhala)', maxWidth: '600px', margin: '0 auto' }}>
            ධර්ම මාර්ගයේ ඔබව නිවැරදිව මෙහෙයවන උතුම් මිත්‍රත්වය.
          </p>
        </div>

        {/* Content Sections */}
        <Section title="'කල්‍යාණ මිත්‍රයා' යනු?" icon={Users} delay={0.1}>
          <p style={{ marginBottom: '20px' }}>
            කල්‍යාණ මිත්‍රයෙකු යනු හුදෙක් සාමාන්‍ය යහළුවෙකු නොවේ. ඔහු හෝ ඇය යනු ඔබව නිවැරදි මාවතට යොමු කරන, සසර දුකින් මිදීමේ (නිවන) අරමුණ වෙත යොමු කරන උතුම් ගුරුවරයෙකු හෝ මාර්ගෝපදේශකයෙකි.
          </p>
          <p>
            බුදුරජාණන් වහන්සේ දේශනා කර ඇති පරිදි, කල්‍යාණ මිත්‍රත්වය යනු සම්පූර්ණ බ්‍රහ්මචරියාව (ධර්ම මාර්ගය) වේ. නිවැරදි දෘෂ්ටියක් ඇති කරගැනීමට සහ ප්‍රායෝගිකව ධර්මය ජීවිතයට ගලපා ගැනීමට කල්‍යාණ මිත්‍රයෙකුගේ ආශ්‍රය අත්‍යවශ්‍ය වේ.
          </p>
        </Section>

        <Section title="අප 'Kalyanamitta' යන නාමය තෝරාගත්තේ ඇයි?" icon={Lightbulb} delay={0.2}>
          <p style={{ marginBottom: '20px' }}>
            වර්තමාන සමාජය තුළ සැබෑ ධර්මය සොයාගැනීම තරමක් අපහසු වී ඇත. නොයෙකුත් මතවාද සහ වැරදි අර්ථකථන නිසා නිවැරදි මාර්ගය කුමක්ද යන්න බොහෝ දෙනෙකුට ගැටලුවකි.
          </p>
          <p>
            අප මෙම වේදිකාව 'Kalyanamitta' (කල්‍යාණමිත්ත) ලෙස නම් කළේ, අවංකව ධර්මය සොයන ඔබට විශ්වාසවන්ත මඟ පෙන්වීමක් ලබා දෙන, සැබෑ කල්‍යාණ මිත්‍රයෙකු ලෙස ක්‍රියා කිරීමේ අරමුණින් යුතුවයි. අපගේ ඉලක්කය වන්නේ නිර්මල බුදු දහම කිසිදු වෙනසකින් තොරව ඔබ වෙත ගෙන ඒමයි.
          </p>
        </Section>

        <Section title="නිවන් දැකීමේ අවශ්‍යතාවය කුමක් ද?" icon={Compass} delay={0.3}>
          <p style={{ marginBottom: '20px' }}>
            අප සැවොම සසර පුරා අනන්ත අප්‍රමාණ දුක් විඳිමින් පැමිණ ඇත. ඉපදීම, ලෙඩ වීම, වයසට යාම, සහ මරණය යන මේ සියල්ල දුකකි. අප කොතරම් සැප සම්පත් සෙව්වත්, ඒවා සියල්ල අනිත්‍ය වන බැවින් අවසානයේ ඉතිරි වන්නේ ශෝකය පමණි.
          </p>
          <p>
            මේ නිමක් නැති දුක්ඛිත චක්‍රයෙන් (සංසාරයෙන්) සදහටම මිදීම යනු නිවනයි. සැබෑ සැනසීම ඇත්තේ ඒ උතුම් නිර්වාණ අවබෝධය තුළ පමණි. මිනිත්තු කිහිපයක සතුටක් වෙනුවෙන් මුළු ජීවිතයම වෙහෙසෙනවාට වඩා, සදාකාලික සැනසුම සොයා යාම බුද්ධිමත් මනුෂ්‍යයෙකුගේ එකම අරමුණ විය යුතුය.
          </p>
        </Section>

        <Section title="නිවන් දකින්නට කල්‍යාණ මිත්‍රයෙකු වැදගත් වන්නේ ඇයි?" icon={Users} delay={0.4}>
          <p style={{ marginBottom: '20px' }}>
            තනිවම ගමන් කර මේ සංසාර ගමනේ අවසානයක් දැකීම අතිශය දුෂ්කරය. අපගේ සිත නිරන්තරයෙන්ම වැරදි දේ (කෙලෙස්) වෙතම ඇදී යාමට පුරුදු වී ඇත.
          </p>
          <p>
            නිවැරදි ධර්මය ශ්‍රවණය කිරීමට (සද්ධම්මස්සවනය) සහ එය නිවැරදිව තේරුම් ගැනීමට (යෝනිසෝමනසිකාරය), අපට නිවැරදි දහම දන්නා කෙනෙකුගේ උපකාරය අවශ්‍ය වේ. කල්‍යාණ මිත්‍රයෙකු ඔබගේ වැරදි පෙන්වා දෙමින්, නිවැරදි මාර්ගයෙහි ඔබව ස්ථාවර කරයි. බුදුරදුන් දේශනා කළේ, කල්‍යාණ මිත්‍ර ආශ්‍රය නොමැතිව කිසිවෙකුට ආර්ය අෂ්ටාංගික මාර්ගය සම්පූර්ණ කළ නොහැකි බවයි.
          </p>
        </Section>

        <Section title="මඟ පෙන්වීම" icon={BookOpen} delay={0.5}>
          <div style={{ background: 'var(--glass-bg)', padding: '40px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <p style={{ marginBottom: '20px' }}>
              මෙම වේදිකාව හරහා අප ඔබට ලබා දෙන්නේ හුදෙක් තොරතුරු පමණක් නොවේ. එය පියවරෙන් පියවර ඔබව නිවන කරා ගෙන යන ප්‍රායෝගික වැඩපිළිවෙලකි.
            </p>
            <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-main)', fontWeight: '500' }}>
              <li>ඔබට ගැළපෙන ධර්ම දේශනා සහ පොත්පත් පරිහරණය කරන්න.</li>
              <li>ක්‍රමානුකූලව භාවනා ක්‍රම ප්‍රගුණ කරන්න.</li>
              <li>ගැටලු සහගත තැන්වලදී සැබෑ කල්‍යාණ මිත්‍රයන්ගේ උපදේශන ලබාගන්න.</li>
            </ul>
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--primary)', fontWeight: '600' }}>
                "මෙම කල්‍යාණ මිත්‍රත්වය ඔබගේ සසර ගමනේ අවසන් මඟ පෙන්වීම වේවා!"
              </p>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}
