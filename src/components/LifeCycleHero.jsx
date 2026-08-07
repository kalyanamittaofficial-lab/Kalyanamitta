import React, { useRef, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const RADIUS = 18;

const ImagePlane = ({ url, index, total }) => {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  
  const ref = useRef();
  
  const angle = (index / total) * Math.PI * 2;
  
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const height = 12;
  const width = height * aspect;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = Math.sin(t * 1.2 + index) * 0.3;
    }
  });

  return (
    <group position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]} rotation={[0, angle, 0]}>
      <mesh ref={ref}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial 
          map={texture} 
          transparent={true} 
          opacity={1} 
          side={THREE.DoubleSide} 
          depthWrite={false}
          color={new THREE.Color(1.1, 1.1, 1.1)}
        />
      </mesh>
    </group>
  );
};

const Carousel = ({ scrollYProgress, totalStages }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;
    const targetRotation = -(scrollYProgress.current * Math.PI * 2 * (totalStages / (totalStages - 1))); 
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.05);
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: totalStages }).map((_, i) => (
        <ImagePlane key={i} url={`/lifeCycle/LC-${i + 1}.png`} index={i} total={totalStages} />
      ))}
    </group>
  );
};

const StoryText = ({ text, desc, progress, index, total }) => {
  const peak = index / total;
  const pad = 1 / (total * 2.5);
  
  const input = index === 0 
    ? [0, pad] 
    : [peak - pad, peak, peak + pad];
      
  const opacityOut = index === 0 
    ? [1, 0] 
    : [0, 1, 0];
      
  const yOut = index === 0 
    ? [0, 20] 
    : [20, 0, -20];
  
  const opacity = useTransform(progress, input, opacityOut);
  const y = useTransform(progress, input, yOut);

  return (
    <motion.div style={{
      position: 'absolute',
      bottom: '10%',
      left: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      opacity,
      y,
      pointerEvents: 'none'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', padding: '0 24px' }}>
        <h2 style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          color: '#ffffff',
          fontFamily: 'var(--font-serif)', 
          margin: '0 0 16px 0', 
          fontWeight: '500',
          letterSpacing: '0.05em', 
          textShadow: '0 4px 30px rgba(0,0,0,0.9)'
        }}>
          {text}
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '1.4rem', 
          fontFamily: 'var(--font-sinhala)', 
          margin: 0, 
          lineHeight: 1.8, 
          fontWeight: '300', 
          textShadow: '0 2px 20px rgba(0,0,0,0.9)' 
        }}>
          {desc}
        </p>
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
    { text: 'නොදැනුවත්කම', desc: 'ඉපදෙන්න කලින් කිසි දෙයක් අපි දන්නේ නෑ. අපි කොහේ හිටියද, මොනවද කළේ කියලා කිසිම මතකයක් අපිට ඉතිරි වෙලා නෑ.' },
    { text: 'ආරම්භය', desc: 'එකපාරටම අපි මේ ලෝකෙට එනවා. මේක අපි තෝරගෙන ආපු ගමනක් නෙවෙයි. ඒත් ගමන පටන් අරන් ඉවරයි.' },
    { text: 'ළමා විය', desc: 'ලෝකය අලුත්. හැමදේම සුන්දරයි වගේ පේනවා. විවිධ දේවල් පස්සේ දුවනවා. මේ චක්‍රයේ පළමු පියවර.' },
    { text: 'තරුණ විය', desc: 'බලාපොරොත්තු ගොඩක් එක්ක ජීවිතේ ගොඩනඟන්න හදනවා. ගොඩක් දේවල් කරනවා, අත්පත් කරගන්න උත්සාහ කරනවා.' },
    { text: 'බැඳීම්', desc: 'විවිධ අය මුණගැහෙනවා, අපිට නමක් ලැබෙනවා, අපිව අඳුරන අය හැදෙනවා. බැඳීම් එක්ක ජීවිතේ තවත් සංකීර්ණ වෙනවා.' },
    { text: 'වෙහෙස', desc: 'මේ ජීවිතේ අස්සේ ගොඩක් දේවල් කරනවා. සතුටු වෙනවා වගේම ගොඩක් දුකට පත්වෙනවා.' },
    { text: 'මහලු විය', desc: 'කාලය ගෙවිලා ගිහින්. ශරීරය දුර්වල වෙනවා. සමහර වෙලාවට සම්පූර්ණ චක්‍රයම යන්නෙත් නෑ, ඉක්මනින් මේ ගමන ඉවර වෙනවා.' },
    { text: 'රෝගී වීම', desc: 'වේදනාව. අවසානය ළඟා වෙන බව දැනෙනවා. රැස් කරපු කිසි දෙයක් අරගෙන යන්න බෑ කියලා තේරෙනවා.' },
    { text: 'මරණය', desc: 'ආයෙත් නොපෙනී යනවා. ඉපදුණේ ඇයි දන්නේ නෑ, මැරිලා කොහෙටද යන්නේ කියලවත් දන්නේ නෑ. සම්පූර්ණයෙන්ම අවිනිශ්චිතයි.' },
    { text: 'අනාථයි', desc: 'ආවේ කොහෙන්ද, යන්නේ කොහෙටද කියලා දන්නේ නෑ... සම්පූර්ණයෙන්ම අතරමං වෙලා. ඒ කියන්නේ ඇත්තටම අපි අනාථයි!' },
    { text: 'සත්‍යය', desc: '"මේ මොකක්ද මට මේ වෙන්නේ?" යන්න තේරුම් ගැනීම පමණක්ම නේද අපි කළ යුත්තේ?' }
  ];

  return (
    <div ref={containerRef} style={{ height: '1500vh', backgroundColor: '#020202', position: 'relative' }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, transparent 30%, #020202 100%)',
        pointerEvents: 'none',
        zIndex: 5
      }} />

      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <Canvas 
          camera={{ position: [0, 0, RADIUS + 15], fov: 45 }} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
        >
          <fog attach="fog" args={['#020202', 10, 40]} />
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Carousel scrollYProgress={scrollYProgress} totalStages={stages.length} />
          </Suspense>
        </Canvas>

        {stages.map((stage, i) => (
          <StoryText 
            key={i}
            text={stage.text}
            desc={stage.desc}
            progress={scrollYProgress}
            index={i}
            total={stages.length}
          />
        ))}

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
            zIndex: 30,
            opacity: useTransform(scrollYProgress, [0.92, 1], [0, 1]),
            background: '#000000'
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
