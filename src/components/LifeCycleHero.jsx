import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const StoryStage = ({ image, text, desc, progress, index, total }) => {
  // Each stage occupies a fraction of the scroll
  const start = index / total;
  const end = (index + 1) / total;
  const pad = 1 / (total * 4); // safely smaller than (end - start) / 2
  
  const opacity = useTransform(
    progress,
    [start, start + pad, end - pad, end],
    [index === 0 ? 1 : 0, 1, 1, 0]
  );
  
  const scale = useTransform(
    progress,
    [start, end],
    [1, 1.1]
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
          opacity: 0.6
        }}
      />
      
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: '800px',
        background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '20px'
      }}>
        <motion.h2 
          style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            color: '#fff', 
            fontFamily: 'var(--font-serif)', 
            margin: '0 0 24px 0', 
            textShadow: '0 4px 20px rgba(0,0,0,0.9)',
            y
          }}
        >
          {text}
        </motion.h2>
        <motion.p
          style={{ 
            color: 'rgba(255,255,255,0.85)', 
            fontSize: '1.4rem', 
            fontFamily: 'var(--font-sinhala)', 
            margin: 0, 
            lineHeight: 1.8,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
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
      desc: 'ඉතින් ඔබ කවුද? ඇත්තටම බැලුවොත්... මම අනාථයෙක්. ආවේ කොහෙන්ද, යන්නේ කොහෙටද දන්නේ නැති අනාථයෙක්.'
    },
    {
      img: '/lifeCycle/11.png',
      text: 'සෙවීම',
      desc: 'හැමෝම විවිධ දේවල් කරනවා. හැබැයි ඇත්තටම හොයන්න ඕනේ දේ මොකක්ද?'
    },
    {
      img: '/lifeCycle/12.png',
      text: 'සත්‍යය',
      desc: '"මේ මොකක්ද මට මේ වෙන්නේ?" කියන එක නේද අපි ඇත්තටම හොයන්න ඕනේ?'
    }
  ];

  return (
    <div ref={containerRef} style={{ height: '1200vh', backgroundColor: '#050505', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        
        {/* Particle/Starry Background subtle effect */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, #1a1a1a 0%, #050505 100%)', zIndex: 0 }} />

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
            background: '#000'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '800px', padding: '0 24px' }}>
            <motion.h1 
              style={{ 
                color: '#fff', 
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                fontFamily: 'var(--font-serif)',
                marginBottom: '2rem'
              }}
            >
              ඔබ කවුද?
            </motion.h1>
            <motion.p
              style={{
                color: '#aaa',
                fontSize: '1.5rem',
                fontFamily: 'var(--font-sinhala)',
                lineHeight: 1.8
              }}
            >
              මේ සියල්ල තේරුම් ගන්න... <br/>
              ඔබට තවමත් කාලය තිබේ.
            </motion.p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
