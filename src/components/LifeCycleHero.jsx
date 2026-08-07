import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const StoryStage = ({ image, text, desc, progress, index, total }) => {
  const start = index / total;
  const end = (index + 1) / total;
  const pad = 1 / (total * 4);
  
  // Smooth fade and slide for text
  const textOpacity = useTransform(
    progress,
    [start, start + pad, end - pad, end],
    [index === 0 ? 1 : 0, 1, 1, 0]
  );
  
  const textY = useTransform(
    progress,
    [start, start + pad, end - pad, end],
    [30, 0, 0, -30]
  );

  // Subtle float for image
  const imgScale = useTransform(progress, [start, end], [1, 1.05]);
  const imgOpacity = useTransform(progress, [start, start + pad/2, end - pad/2, end], [0, 1, 1, 0]);

  return (
    <div
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
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      {/* 3D Image Centered */}
      <motion.img 
        src={image} 
        alt=""
        style={{
          position: 'absolute',
          top: '15%',
          width: '100%',
          height: '60%',
          objectFit: 'contain',
          scale: imgScale,
          opacity: imgOpacity,
          zIndex: 1
        }}
      />
      
      {/* Floating Text at the Bottom */}
      <motion.div style={{
        position: 'absolute',
        bottom: '10%',
        zIndex: 10,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: '700px',
        width: '100%',
        opacity: textOpacity,
        y: textY
      }}>
        <h2 
          style={{ 
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', 
            color: 'var(--text-main)', 
            fontFamily: 'var(--font-serif)', 
            margin: '0 0 12px 0', 
            fontWeight: '700',
            letterSpacing: '0.02em'
          }}
        >
          {text}
        </h2>
        <p
          style={{ 
            color: 'var(--text-muted)', 
            fontSize: '1.25rem', 
            fontFamily: 'var(--font-sinhala)', 
            margin: 0, 
            lineHeight: 1.7,
            fontWeight: '400'
          }}
        >
          {desc}
        </p>
      </motion.div>
    </div>
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
      img: '/lifeCycle/LC-1.png',
      text: 'නොදැනුවත්කම',
      desc: 'ඉපදෙන්න කලින් කිසි දෙයක් අපි දන්නේ නෑ. අපි කොහේ හිටියද, මොනවද කළේ කියලා කිසිම මතකයක් අපිට ඉතිරි වෙලා නෑ.'
    },
    {
      img: '/lifeCycle/LC-2.png',
      text: 'ආරම්භය',
      desc: 'එකපාරටම අපි මේ ලෝකෙට එනවා. මේක අපි තෝරගෙන ආපු ගමනක් නෙවෙයි. ඒත් ගමන පටන් අරන් ඉවරයි.'
    },
    {
      img: '/lifeCycle/LC-3.png',
      text: 'ළමා විය',
      desc: 'ලෝකය අලුත්. හැමදේම සුන්දරයි වගේ පේනවා. විවිධ දේවල් පස්සේ දුවනවා. මේ චක්‍රයේ පළමු පියවර.'
    },
    {
      img: '/lifeCycle/LC-4.png',
      text: 'තරුණ විය',
      desc: 'බලාපොරොත්තු ගොඩක් එක්ක ජීවිතේ ගොඩනඟන්න හදනවා. ගොඩක් දේවල් කරනවා, අත්පත් කරගන්න උත්සාහ කරනවා.'
    },
    {
      img: '/lifeCycle/LC-5.png',
      text: 'බැඳීම්',
      desc: 'විවිධ අය මුණගැහෙනවා, අපිට නමක් ලැබෙනවා, අපිව අඳුරන අය හැදෙනවා. බැඳීම් එක්ක ජීවිතේ තවත් සංකීර්ණ වෙනවා.'
    },
    {
      img: '/lifeCycle/LC-6.png',
      text: 'වෙහෙස',
      desc: 'මේ ජීවිතේ අස්සේ ගොඩක් දේවල් කරනවා. සතුටු වෙනවා වගේම ගොඩක් දුකට පත්වෙනවා.'
    },
    {
      img: '/lifeCycle/LC-7.png',
      text: 'මහලු විය',
      desc: 'කාලය ගෙවිලා ගිහින්. ශරීරය දුර්වල වෙනවා. සමහර වෙලාවට සම්පූර්ණ චක්‍රයම යන්නෙත් නෑ, ඉක්මනින් මේ ගමන ඉවර වෙනවා.'
    },
    {
      img: '/lifeCycle/LC-8.png',
      text: 'රෝගී වීම',
      desc: 'වේදනාව. අවසානය ළඟා වෙන බව දැනෙනවා. රැස් කරපු කිසි දෙයක් අරගෙන යන්න බෑ කියලා තේරෙනවා.'
    },
    {
      img: '/lifeCycle/LC-9.png',
      text: 'මරණය',
      desc: 'ආයෙත් නොපෙනී යනවා. ඉපදුණේ ඇයි දන්නේ නෑ, මැරිලා කොහෙටද යන්නේ කියලවත් දන්නේ නෑ. සම්පූර්ණයෙන්ම අවිනිශ්චිතයි.'
    },
    {
      img: '/lifeCycle/LC-10.png',
      text: 'අනාථයි',
      desc: 'ආවේ කොහෙන්ද, යන්නේ කොහෙටද කියලා දන්නේ නෑ... සම්පූර්ණයෙන්ම අතරමං වෙලා. ඒ කියන්නේ ඇත්තටම අපි අනාථයි!'
    },
    {
      img: '/lifeCycle/LC-11.png',
      text: 'සත්‍යය',
      desc: '"මේ මොකක්ද මට මේ වෙන්නේ?" යන්න තේරුම් ගැනීම පමණක්ම නේද අපි කළ යුත්තේ?'
    }
  ];

  return (
    <div ref={containerRef} style={{ height: '1100vh', backgroundColor: 'var(--bg-main)', position: 'relative', transition: 'background-color 0.3s ease' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        
        {/* Subtle background overlay to ensure text contrast without harsh boxes */}
        <div style={{ position: 'absolute', top: '70%', left: 0, width: '100%', height: '30%', background: 'linear-gradient(to top, var(--bg-main) 0%, transparent 100%)', zIndex: 5 }} />

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
            opacity: useTransform(scrollYProgress, [0.93, 1], [0, 1]),
            background: 'var(--bg-main)'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '900px', padding: '0 24px' }}>
            <motion.h1 
              style={{ 
                color: 'var(--text-main)', 
                fontSize: 'clamp(3.5rem, 7vw, 6rem)',
                fontFamily: 'var(--font-serif)',
                marginBottom: '1rem',
                fontWeight: '800',
                letterSpacing: '-0.03em'
              }}
            >
              ඉතින්, ඔබ කවුද?
            </motion.h1>
            <motion.div
              style={{
                color: 'var(--primary)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontFamily: 'var(--font-sinhala)',
                lineHeight: 1.2,
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
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
                marginTop: '3rem',
                fontWeight: '500',
                maxWidth: '600px',
                marginInline: 'auto'
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
