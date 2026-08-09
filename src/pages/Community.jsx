import React from 'react';
import { motion } from 'framer-motion';

export default function Community() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)' }}>
      <style>{`
        .cm-wrapper {
          width: 100%;
          color: var(--text-main);
        }
        .cm-hero {
          width: 100%;
          padding: 8rem 2rem 4rem;
          text-align: center;
          position: relative;
        }
        .cm-hero h1 {
          font-family: var(--font-serif);
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1.5rem;
          letter-spacing: 0.05em;
        }
        
        .cm-split-section {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 2rem 1.5rem 4rem;
          gap: 3rem;
        }
        .cm-quote-side {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .cm-quote-pali {
          font-family: var(--font-serif);
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.5;
          color: var(--primary);
          margin-bottom: 1.5rem;
          opacity: 0.9;
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        .cm-quote-sinhala {
          font-family: var(--font-sinhala);
          font-size: clamp(1.1rem, 2.5vw, 1.3rem);
          color: var(--text-main);
          font-weight: 500;
          line-height: 1.6;
          padding-left: 1.2rem;
          border-left: 2px solid var(--primary);
        }
        .cm-content-side {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          font-family: var(--font-sinhala);
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          line-height: 1.8;
          opacity: 0.85;
          gap: 2rem;
        }
        
        .cm-divider {
          width: 1px;
          height: 80px;
          background: var(--glass-border);
          margin: 4rem auto;
        }

        .cm-scroll-spacer {
           display: none;
        }

        @media (min-width: 1024px) {
          .cm-hero {
            padding: 12rem 4rem 6rem;
          }
          .cm-split-section {
            flex-direction: row;
            padding: 4rem 6rem 8rem;
            gap: 6rem;
            align-items: flex-start;
          }
          .cm-quote-side {
            position: sticky;
            top: 140px;
            height: fit-content;
          }
          .cm-quote-pali {
            font-size: 2.8rem;
          }
          .cm-quote-sinhala {
            border-left: 3px solid var(--primary);
            padding-left: 2rem;
            font-size: 1.4rem;
          }
          .cm-content-side {
            padding-top: 1rem;
            gap: 3rem;
          }
          .cm-scroll-spacer {
             display: block;
             height: 20vh;
          }
          .cm-divider {
             margin: 6rem auto;
             height: 120px;
          }
        }
      `}</style>
      
      <div className="cm-wrapper">
        <div className="cm-hero">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            කල්‍යාණ මිත්‍රත්වය
          </motion.h1>
        </div>

        <div className="cm-split-section">
          <div className="cm-quote-side">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8 }}
              className="cm-quote-pali"
            >
              "සකලමේව හිදං ආනන්ද, බ්‍රහ්මචරියං යදිදං කල්‍යාණමිත්තතා..."
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="cm-quote-sinhala"
            >
              "ආනන්දය, එසේ නොකියන්න. එසේ නොකියන්න. බ්‍රහ්මචරියාවේ අඩක් පමණක් නොව, මුළු බ්‍රහ්මචරියාවම කල්‍යාණ මිත්‍රත්වය මත රඳා පවතී."
              <div style={{ marginTop: '1.2rem', fontSize: '0.9rem', opacity: 0.6, fontWeight: 400, letterSpacing: '0.05em' }}>
                — උපද්ධ සූත්‍රය (සංයුත්ත නිකාය)
              </div>
            </motion.div>
          </div>

          <div className="cm-content-side">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8 }}
            >
              භාග්‍යවතුන් වහන්සේ දේශනා කළ පරිදි, කල්‍යාණ මිත්‍රයෙකු යනු සාමාන්‍ය යහළුවෙකු නොවේ.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8 }}
            >
              ඔබගේ ලෞකික ජීවිතය දියුණු කරන පුද්ගලයෙකුට වඩා, දුකින් මිදෙන මාර්ගය පෙන්වන පුද්ගලයා කල්‍යාණ මිත්‍රයෙකි. ඔහුට ඔබ වෙනුවෙන් නිවන් ලබා දිය නොහැක. නමුත්, ඔබට සත්‍යය දැකගත හැකි මාර්ගය පෙන්වා දිය හැක.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8 }}
              style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '1.1em', marginTop: '0.5rem' }}
            >
              අඳුරු මාර්ගයකදී පහනක් මෙන්, නොමඟ යන විට දිශාව පෙන්වන මඟපෙන්වන්නෙකු මෙන්, කල්‍යාණ මිත්‍රයා ඔබව ධර්මය දෙසට යොමු කරයි.
            </motion.p>

            <div className="cm-scroll-spacer"></div>
          </div>
        </div>

        <div className="cm-divider" />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 10rem', display: 'flex', flexDirection: 'column' }}>
          <EditorialSection index={0} title="අප 'Kalyanamitta' යන නාමය තෝරාගත්තේ ඇයි?">
            <p>
              අවිද්‍යා අන්ධකාරයෙන් මුළාවට පත් වී සිටින බොහෝ දෙනා, තමන් මේ ඝෝර සංසාරයේ අතරමං වී ඇති බවවත් නොදැන ලෞකික දියුණුව පමණක් හඹා යමින් උතුම් ධර්ම මාර්ගයෙන් ඈත් වෙති. අපගේ අභිලාෂය වන්නේ, එසේ සසර මඟ අතරමං වූ සියලු සත්ත්වයන් උදෙසාම ධර්මයේ ආලෝකය ලබා දෙමින්, ලෞකික ජීවිතය දැහැමිව ගත කරන අතරතුරදීම සංසාර විමුක්තිය හෙවත් නිවන අරමුණු කරගත් කුසල ධර්මයන් දියුණු කරගැනීමට අවශ්‍ය වටපිටාව සකසා දීමයි.
            </p>
            <p>
              ඒ සඳහා ධර්ම දේශනා ශ්‍රවණයට සහ පුණ්‍ය කර්මයන්ට අවස්ථාව සලසා දෙමින්, එකිනෙකාව අකුසලයෙන් වළක්වා කුසලයෙහි පිහිටුවීම අපගේ අපේක්ෂාවයි. මෙසේ අනෙකාට අර්ථය සහ ධර්මය පෙන්වා දෙමින්, මෙලොව පරලොව උභයාර්ථය සලසමින් නිවන් දොරටුව කරා යන ගමනට අත්වැලක් වන උතුම් මිත්‍රයාගේ කාර්යභාරය ඉටු කිරීම උදෙසාම, අපි අපගේ මෙම එකමුතුවට 'Kalyanamitta' යන උතුම් නාමය තෝරා ගත්තෙමු.
            </p>
          </EditorialSection>
          <EditorialSection index={1} title="නිවන් දැකීමේ අවශ්‍යතාවය කුමක් ද?">
            <p>
              භාග්‍යවතුන් වහන්සේ අනාමතග්ග සංයුත්තයේදී දේශනා කොට වදාළේ, "අනාමතග්ගොයං භික්ඛවෙ සංසාරො... පුබ්බා කෝටි න පඤ්ඤායති" (මහණෙනි, මේ සංසාරය අවසන් කළ නොහැකි තරම් දිගු ය. එහි මුලක් කෙළවරක් දැකිය නොහැක) යනුවෙනි. මේ දීර්ඝ සංසාර ගමන තුළ අප නොවැටුණු අපායක් නැත. දුකට පත්ව නොහඬපු වාරයක් නැත.
            </p>
            <p>
              ඉපදීම, ලෙඩ වීම, මහලු වීම සහ මරණයට පත්වීම යන අනන්ත වූ ජාති, ජරා, ව්‍යාධි, මරණ දුක් කන්දරාවෙන් සදහටම මිදීමට ඇති එකම සහ අවසාන මාර්ගය වන්නේ භව ගමන නතර කිරීම හෙවත් උතුම් වූ අමා මහා නිවන් සුවය අවබෝධ කරගැනීමයි. සියලු කෙලෙස් ගිනි නිවී ගිය ඒ පරම සුවය සාක්ෂාත් කරගැනීම, බුද්ධ ශ්‍රාවකයෙකුගේ එකම ඉලක්කය විය යුතුය.
            </p>
          </EditorialSection>
          <EditorialSection index={2} title="නිවන් දකින්නට කල්‍යාණ මිත්‍රයෙකු වැදගත් වන්නේ ඇයි?">
            <p>
              භාග්‍යවතුන් වහන්සේගේ නිර්මල බුද්ධ ශාසනය ලෝකයේ විද්‍යාමානව පවතින මේ අතිශය දුර්ලභ මොහොතේ, සෝවාන් ආදී මාර්ග ඵලයන්ට පත්වී නිවන් දොරටුව විවර කර ගැනීම සසර ගමනේ අපට සාක්ෂාත් කරගත හැකි උසස්ම ඵලයයි.
            </p>
            <p>
              එලෙස සෝවාන් ඵලයට පත්වීම සඳහා අනිවාර්යයෙන්ම සම්පූර්ණ විය යුතු අංග හතරක් (සෝතාපන්න අංග) භාග්‍යවතුන් වහන්සේ දේශනා කොට වදාළ සේක. එනම්,
            </p>
            <ul style={{ 
              paddingLeft: '1rem', 
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {[
                "කල්‍යාණ මිත්‍ර ආශ්‍රය (සප්පුරිස සංසේවනය)",
                "සද්ධර්ම ශ්‍රවණය",
                "යෝනිසෝමනසිකාරය (නුවණින් මෙනෙහි කිරීම)",
                "ධම්මානුධම්ම පටිපදාව (ධර්මයට අනුකූලව හැසිරීම)"
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <span style={{ color: 'var(--gold-primary)', fontSize: '1.2rem', marginTop: '0.2rem' }}>✦</span>
                  <span style={{ fontWeight: '500' }}>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              මෙම අංග සතර අතුරින් පළමු සහ වැදගත්ම අංග දෙක වන 'කල්‍යාණ මිත්‍ර ආශ්‍රය' සහ 'සද්ධර්ම ශ්‍රවණය' යන අංග ද්විත්වය සියලු සත්ත්වයන්ගේ හිත සුව පිණිස ඇතිකර දීම 'Kalyanamitta' හි අපගේ ප්‍රධානතම අපේක්ෂාවයි. කල්‍යාණ මිත්‍රයෙකුගේ මඟ පෙන්වීමක් නොමැතිව, කෙනෙකුට කිසිදා සැබෑ ශ්‍රී සද්ධර්මය ශ්‍රවණය කිරීමට අවස්ථාවක් නොලැබේ. ධර්මය ශ්‍රවණය නොකර, යෝනිසෝමනසිකාරය දියුණු කරගැනීමටවත්, ධම්මානුධම්ම පටිපදාවට පිවිසීමටවත් නොහැකිය.
            </p>
            <p>
              සංසාරයේ අතරමං වූ සත්ත්වයාට කල්ප ගණනකින් හෝ ලබාගැනීමට අතිශය දුර්ලභ වූ මේ උතුම් කල්‍යාණ මිත්‍ර සම්පත්තියත්, සද්ධර්ම ශ්‍රවණය කිරීමේ භාග්‍යයත් උදාකර දෙමින්, ආර්ය අෂ්ටාංගික මාර්ගයට පිවිසීමට අවශ්‍ය මූලිකම පදනම සකසා දීම කල්‍යාණ මිත්‍රයාගෙන් ඉටුවන උත්තරීතරම කාර්යභාරයයි.
            </p>
          </EditorialSection>
          <EditorialSection index={3} title="මඟ පෙන්වීම">
            <p>
              භාග්‍යවත් අරහත් සම්මා සම්බුදුරජාණන් වහන්සේගේ පිරිසිදු බුද්ධ වචනය වූ උතුම් ශ්‍රී සද්ධර්මයට අනුකූලව ද, උත්තම සංඝරත්නයේ අවවාද, අනුශාසනා සහ මඟ පෙන්වීම මත නොසැලී පිහිටා ද කටයුතු කිරීම අපගේ ප්‍රතිපදාවයි.
            </p>
            <p>
              ඒ අනුව, සැබෑ කල්‍යාණ මිත්‍රයෙකු ලෙසින් සියලු දෙනා වෙත ධර්මානුකූල කරුණු ගෙන ඒමත්, ධර්ම මාර්ගයේ ඉදිරියටම යාමට අවශ්‍ය නිවැරදි මඟ පෙන්වීම ලබා දීමත් 'Kalyanamitta' හි අපගේ ඒකායන අරමුණ වේ. අපගේ එකම ප්‍රාර්ථනය වන්නේ, මේ උතුම් කල්‍යාණ මිත්‍ර ආශ්‍රය තුළින් නිරතුරුව ධර්මයට අනුකූලව කටයුතු කරමින්, ඉතාමත් ඉක්මන් භවයකදී සැබෑ ආර්ය ශ්‍රාවකයෙකු ලෙස ඒ උතුම් අමා මහා නිවන් සුවය සාක්ෂාත් කරගැනීම පිණිස සැමට අවශ්‍ය ශක්තිය හා ධර්ම ඥානය උදාකර දීමයි.
            </p>
          </EditorialSection>
        </div>

      </div>
    </div>
  );
}

const EditorialSection = ({ title, children, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1 }}
      style={{ 
        position: 'relative',
        padding: '6rem 0',
        display: 'flex',
        flexDirection: 'column',
        borderTop: index === 0 ? 'none' : '1px solid rgba(128,128,128,0.15)',
      }}
    >
      {/* Large Watermark Number */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: isEven ? '-2rem' : 'auto',
        right: isEven ? 'auto' : '-2rem',
        fontSize: 'clamp(8rem, 15vw, 14rem)',
        fontFamily: 'var(--font-serif)',
        fontWeight: '700',
        color: 'var(--text-main)',
        opacity: 0.03,
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        lineHeight: 1
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: isEven ? 'row' : 'row-reverse',
        flexWrap: 'wrap',
        gap: '4rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left/Right side: Sticky Title */}
        <div style={{ flex: '1 1 350px', position: 'relative' }}>
          <div style={{ position: 'sticky', top: '120px' }}>
            <div style={{
              width: '40px', height: '3px',
              background: 'var(--gold-primary, var(--primary))',
              marginBottom: '1.5rem',
              marginLeft: isEven ? '0' : 'auto'
            }} />
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
              fontFamily: 'var(--font-serif)', 
              fontWeight: '600', 
              color: 'var(--text-main)', 
              lineHeight: '1.3',
              textAlign: isEven ? 'left' : 'right'
            }}>
              {title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: '2 1 500px' }}>
          <div style={{ 
            fontFamily: 'var(--font-sinhala)', 
            fontSize: '1.15rem', 
            lineHeight: '2.0', 
            color: 'var(--text-main)', 
            fontWeight: '400',
            opacity: 0.85,
            textAlign: 'justify',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {children ? children : (
              <p style={{ fontStyle: 'italic', margin: 0, opacity: 0.5 }}>
                [ මෙම ස්ථානයට අදාළ අන්තර්ගතය ඇතුළත් කෙරේ ]
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
