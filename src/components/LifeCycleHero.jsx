import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const StoryStage = ({ image, text, desc, progress, index, total }) => {
  const start = index / total;
  const end = (index + 1) / total;
  const pad = 1 / (total * 4);
  
  const opacity = useTransform(
    progress,
    [start, start + pad, end - pad, end],
    [index === 0 ? 1 : 0, 1, 1, 0]
  );
  
  const scale = useTransform(
    progress,
    [start, end],
    [1, 1.15]
  );

  const y = useTransform(
    progress,
    [start, end],
    [50, -50]
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        opacity,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <motion.img 
        src={image} 
        alt=""
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          scale,
          zIndex: 1,
          opacity: 0.8
        }}
      />
      
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '32px',
        maxWidth: '800px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
      }}>
        <motion.h2 
          style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            color: 'var(--primary)', 
            fontFamily: 'var(--font-serif)', 
            margin: '0 0 24px 0', 
            y
          }}
        >
          {text}
        </motion.h2>
        <motion.p
          style={{ 
            color: 'var(--text-main)', 
            fontSize: '1.4rem', 
            fontFamily: 'var(--font-sinhala)', 
            margin: 0, 
            lineHeight: 1.8,
            fontWeight: '500',
            y
          }}
        >
          {desc}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default function LifeCycleHero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const stages = [
    {
      img: '/lifeCycle/1.png',
      text: 'නොදැනුවත්කම',
      desc: 'ඉපදෙන්න කලින් කිසි දෙයක් අපි දන්නේ නෑ. අපි කොහේ හිටියද, මොනවද කළේ කියලා කිසිම මතකයක් අපිට ඉතිරි වෙලා නෑ.'
    },
    {
      img: '/lifeCycle/2.png',
      text: 'ආරම්භය',
      desc: 'එකපාරටම අපි මේ ලෝකෙට එනවා. මේක අපි තෝරගෙන ආපු ගමනක් නෙවෙයි. ඒත් ගමන පටන් අරන් ඉවරයි.'
    },
    {
      img: '/lifeCycle/3.png',
      text: 'ළමා විය',
      desc: 'ලෝකය අලුත්. හැමදේම සුන්දරයි වගේ පේනවා. විවිධ දේවල් පස්සේ දුවනවා. මේ චක්‍රයේ පළමු පියවර.'
    },
    {
      img: '/lifeCycle/4.png',
      text: 'තරුණ විය',
      desc: 'බලාපොරොත්තු ගොඩක් එක්ක ජීවිතේ ගොඩනඟන්න හදනවා. ගොඩක් දේවල් කරනවා, අත්පත් කරගන්න උත්සාහ කරනවා.'
    },
    {
      img: '/lifeCycle/5.png',
      text: 'බැඳීම්',
      desc: 'විවිධ අය මුණගැහෙනවා, අපිට නමක් ලැබෙනවා, අපිව අඳුරන අය හැදෙනවා. බැඳීම් එක්ක ජීවිතේ තවත් සංකීර්ණ වෙනවා.'
    },
    {
      img: '/lifeCycle/6.png',
      text: 'වෙහෙස',
      desc: 'මේ ජීවිතේ අස්සේ ගොඩක් දේවල් කරනවා. සතුටු වෙනවා වගේම ගොඩක් දුකට පත්වෙනවා.'
    },
    {
      img: '/lifeCycle/7.png',
      text: 'මහලු විය',
      desc: 'කාලය ගෙවිලා ගිහින්. ශරීරය දුර්වල වෙනවා. සමහර වෙලාවට සම්පූර්ණ චක්‍රයම යන්නෙත් නෑ, ඉක්මනින් මේ ගමන ඉවර වෙනවා.'
    },
    {
      img: '/lifeCycle/8.png',
      text: 'රෝගී වීම',
      desc: 'වේදනාව. අවසානය ළඟා වෙන බව දැනෙනවා. රැස් කරපු කිසි දෙයක් අරගෙන යන්න බෑ කියලා තේරෙනවා.'
    },
    {
      img: '/lifeCycle/9.png',
      text: 'මරණය',
      desc: 'ආයෙත් නොපෙනී යනවා. ඉපදුණේ ඇයි දන්නේ නෑ, මැරිලා කොහෙටද යන්නේ කියලවත් දන්නේ නෑ. සම්පූර්ණයෙන්ම අවිනිශ්චිතයි.'
    },
    {
      img: '/lifeCycle/10.png',
      text: 'අනාථයි',
      desc: 'ආවේ කොහෙන්ද, යන්නේ කොහෙටද කියලා දන්නේ නෑ... සම්පූර්ණයෙන්ම අතරමං වෙලා. ඒ කියන්නේ ඇත්තටම අපි අනාථයි!'
    },
    {
      img: '/lifeCycle/11.png',
      text: 'සෙවීම',
      desc: 'සෑම දෙයක්ම මේතරම් අවිනිශ්චිත නම්, අපි මේ ජීවිතේ ඇතුළේ ඇත්තටම හොයන්න ඕනේ මොකක්ද?'
    },
    {
      img: '/lifeCycle/12.png',
      text: 'සත්‍යය',
      desc: '"මේ මොකක්ද මට මේ වෙන්නේ?" යන්න තේරුම් ගැනීම පමණක්ම නේද අපි කළ යුත්තේ?'
    }
  ];

  return (
    <div ref={containerRef} style={{ height: '1200vh', backgroundColor: 'var(--bg-main)', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        
        {/* Background gradient utilizing CSS variables for theme matching */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'var(--bg-main)', zIndex: 0 }} />

        {stages.map((stage, i) => (
          <StoryStage 
            key={i}
            image={stage.img}
            text={stage.text}
            desc={stage.desc}
            progress={scrollYProgress}
            index={i}
            total={stages.length}
          />
        ))}

        {/* The Final Climax */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20,
            opacity: useTransform(scrollYProgress, [0.94, 1], [0, 1]),
            background: 'var(--bg-main)' // Solid theme background
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '900px', padding: '40px', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', borderRadius: '30px', border: '1px solid var(--glass-border)' }}>
            <motion.h1 
              style={{ 
                color: 'var(--primary)', 
                fontSize: 'clamp(3.5rem, 7vw, 6rem)',
                fontFamily: 'var(--font-serif)',
                marginBottom: '1rem',
                fontWeight: '800'
              }}
            >
              ඉතින්, ඔබ කවුද?
            </motion.h1>
            <motion.div
              style={{
                color: 'var(--text-main)',
                fontSize: '2rem',
                fontFamily: 'var(--font-sinhala)',
                lineHeight: 1.6,
                fontWeight: '700'
              }}
            >
              ඔබ අනාථයෙක්!
            </motion.div>
            <motion.p
              style={{
                color: 'var(--text-muted)',
                fontSize: '1.4rem',
                fontFamily: 'var(--font-sinhala)',
                lineHeight: 1.8,
                marginTop: '2rem',
                fontWeight: '500'
              }}
            >
              මෙය තේරුම් ගෙන, මේ සසර ගමනින් එතෙර වීමට මාර්ගය සොයා ගැනීම පමණක්ම ජීවිතයේ එකම අරමුණ කරගන්න...
            </motion.p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
