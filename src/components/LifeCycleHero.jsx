import React, { useRef, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Z_SPACING = 20;
const CAMERA_START_Z = 8;

const ImagePlane = ({ url, index }) => {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  const ref = useRef();
  
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const height = 10;
  const width = height * aspect;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Live floating feel (Morph/Breathing effect)
    ref.current.position.y = Math.sin(t * 0.8 + index * 2) * 0.4;
    ref.current.rotation.z = Math.sin(t * 0.4 + index) * 0.02;
    ref.current.rotation.y = Math.sin(t * 0.3 + index * 1.5) * 0.05;
  });

  return (
    <mesh ref={ref} position={[0, 0, -index * Z_SPACING]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent={true} opacity={1} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
};

const CameraFlyThrough = ({ scrollYProgress, totalStages }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    const totalDistance = (totalStages - 1) * Z_SPACING;
    const targetZ = CAMERA_START_Z - (scrollYProgress.current * totalDistance);
    
    // Smooth lerp for cinematic camera movement
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
  });
  
  return null;
};

const StoryText = ({ text, desc, progress, index, total }) => {
  const peak = index / (total - 1);
  const pad = 1 / (total * 2.5);
  
  const opacity = useTransform(
    progress,
    [peak - pad, peak, peak + pad],
    [0, 1, 0]
  );
  
  const y = useTransform(
    progress,
    [peak - pad, peak, peak + pad],
    [50, 0, -50]
  );

  return (
    <motion.div style={{
      position: 'absolute',
      bottom: '15%',
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
      <div style={{ textAlign: 'center', maxWidth: '700px', padding: '0 24px' }}>
        <h2 style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          color: 'var(--text-main)', 
          fontFamily: 'var(--font-serif)', 
          margin: '0 0 12px 0', 
          fontWeight: '700', 
          letterSpacing: '0.02em', 
          textShadow: '0 4px 30px rgba(0,0,0,0.8)'
        }}>
          {text}
        </h2>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '1.4rem', 
          fontFamily: 'var(--font-sinhala)', 
          margin: 0, 
          lineHeight: 1.8, 
          fontWeight: '500', 
          textShadow: '0 2px 15px rgba(0,0,0,0.8)' 
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
    { img: '/lifeCycle/LC-1.png', text: 'නොදැනුවත්කම', desc: 'ඉපදෙන්න කලින් කිසි දෙයක් අපි දන්නේ නෑ. අපි කොහේ හිටියද, මොනවද කළේ කියලා කිසිම මතකයක් අපිට ඉතිරි වෙලා නෑ.' },
    { img: '/lifeCycle/LC-2.png', text: 'ආරම්භය', desc: 'එකපාරටම අපි මේ ලෝකෙට එනවා. මේක අපි තෝරගෙන ආපු ගමනක් නෙවෙයි. ඒත් ගමන පටන් අරන් ඉවරයි.' },
    { img: '/lifeCycle/LC-3.png', text: 'ළමා විය', desc: 'ලෝකය අලුත්. හැමදේම සුන්දරයි වගේ පේනවා. විවිධ දේවල් පස්සේ දුවනවා. මේ චක්‍රයේ පළමු පියවර.' },
    { img: '/lifeCycle/LC-4.png', text: 'තරුණ විය', desc: 'බලාපොරොත්තු ගොඩක් එක්ක ජීවිතේ ගොඩනඟන්න හදනවා. ගොඩක් දේවල් කරනවා, අත්පත් කරගන්න උත්සාහ කරනවා.' },
    { img: '/lifeCycle/LC-5.png', text: 'බැඳීම්', desc: 'විවිධ අය මුණගැහෙනවා, අපිට නමක් ලැබෙනවා, අපිව අඳුරන අය හැදෙනවා. බැඳීම් එක්ක ජීවිතේ තවත් සංකීර්ණ වෙනවා.' },
    { img: '/lifeCycle/LC-6.png', text: 'වෙහෙස', desc: 'මේ ජීවිතේ අස්සේ ගොඩක් දේවල් කරනවා. සතුටු වෙනවා වගේම ගොඩක් දුකට පත්වෙනවා.' },
    { img: '/lifeCycle/LC-7.png', text: 'මහලු විය', desc: 'කාලය ගෙවිලා ගිහින්. ශරීරය දුර්වල වෙනවා. සමහර වෙලාවට සම්පූර්ණ චක්‍රයම යන්නෙත් නෑ, ඉක්මනින් මේ ගමන ඉවර වෙනවා.' },
    { img: '/lifeCycle/LC-8.png', text: 'රෝගී වීම', desc: 'වේදනාව. අවසානය ළඟා වෙන බව දැනෙනවා. රැස් කරපු කිසි දෙයක් අරගෙන යන්න බෑ කියලා තේරෙනවා.' },
    { img: '/lifeCycle/LC-9.png', text: 'මරණය', desc: 'ආයෙත් නොපෙනී යනවා. ඉපදුණේ ඇයි දන්නේ නෑ, මැරිලා කොහෙටද යන්නේ කියලවත් දන්නේ නෑ. සම්පූර්ණයෙන්ම අවිනිශ්චිතයි.' },
    { img: '/lifeCycle/LC-10.png', text: 'අනාථයි', desc: 'ආවේ කොහෙන්ද, යන්නේ කොහෙටද කියලා දන්නේ නෑ... සම්පූර්ණයෙන්ම අතරමං වෙලා. ඒ කියන්නේ ඇත්තටම අපි අනාථයි!' },
    { img: '/lifeCycle/LC-11.png', text: 'සත්‍යය', desc: '"මේ මොකක්ද මට මේ වෙන්නේ?" යන්න තේරුම් ගැනීම පමණක්ම නේද අපි කළ යුත්තේ?' }
  ];

  return (
    <div ref={containerRef} style={{ height: '1500vh', backgroundColor: 'var(--bg-main)', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        
        {/* WebGL Canvas for Cinematic Depth & Camera Flythrough */}
        <Canvas camera={{ position: [0, 0, CAMERA_START_Z], fov: 60 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            {stages.map((stage, i) => (
              <ImagePlane key={i} url={stage.img} index={i} />
            ))}
            <CameraFlyThrough scrollYProgress={scrollYProgress} totalStages={stages.length} />
          </Suspense>
        </Canvas>

        {/* Floating HTML Text Overlays synced with Camera Z */}
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

        {/* The Final Climax Black Screen */}
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
            opacity: useTransform(scrollYProgress, [0.94, 1], [0, 1]),
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
