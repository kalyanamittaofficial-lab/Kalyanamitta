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
  const pad = 1 / (total * 2);
  
  // Guarantee strictly increasing 3-element arrays to prevent WAAPI crashes
  let start = peak - pad;
  let mid = peak;
  let end = peak + pad;
  
  if (index === 0) {
    start = 0;
    mid = pad / 2;
    end = pad;
  }
  
  const input = [start, mid, end];
  const opacityOut = index === 0 ? [1, 1, 0] : [0, 1, 0];
  const yOut = index === 0 ? [0, 0, -20] : [20, 0, -20];
  
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
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '800px', 
        padding: '0 20px',
        // Responsive background blur for mobile readability
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)'
      }}>
        <h2 style={{ 
          fontSize: 'clamp(2rem, 5vw, 4rem)', 
          color: '#ffffff',
          fontFamily: 'var(--font-serif)', 
          margin: '0 0 12px 0', 
          fontWeight: '500',
          letterSpacing: '0.05em', 
          textShadow: '0 4px 30px rgba(0,0,0,1)' // Stronger shadow
        }}>
          {text}
        </h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.85)',
          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', 
          fontFamily: 'var(--font-sinhala)', 
          margin: 0, 
          lineHeight: 1.6, 
          fontWeight: '400', 
          textShadow: '0 2px 20px rgba(0,0,0,1)' 
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
    <>
      {/* 
        THE TV CONTAINER
        This wrapper forces a black background for the entire 1500vh scroll space,
        making it look like a seamless cinematic TV window regardless of the site's theme.
      */}
      <div style={{ backgroundColor: '#000000', color: '#ffffff' }}>
        <div ref={containerRef} style={{ height: '1500vh', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, transparent 30%, #000000 100%)',
            pointerEvents: 'none',
            zIndex: 5
          }} />

          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
            <Canvas 
              camera={{ position: [0, 0, RADIUS + 15], fov: 45 }} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
            >
              <fog attach="fog" args={['#000000', 10, 40]} />
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
                    color: '#ffffff', 
                    fontSize: 'clamp(3rem, 7vw, 6rem)',
                    fontFamily: 'var(--font-serif)',
                    marginBottom: '1rem',
                    fontWeight: '600',
                    letterSpacing: '-0.02em'
                  }}
                >
                  ඉතින්, ඔබ කවුද?
                </motion.h1>
                <motion.div
                  style={{
                    color: 'var(--primary)',
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontFamily: 'var(--font-sinhala)',
                    lineHeight: 1.2,
                    fontWeight: '600',
                    letterSpacing: '0.1em'
                  }}
                >
                  ඔබ අනාථයෙක්!
                </motion.div>
                <motion.p
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                    fontFamily: 'var(--font-sinhala)',
                    lineHeight: 1.8,
                    marginTop: '3rem',
                    fontWeight: '400',
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
      </div>

      {/* FULL STORY SECTION (Respects Light/Dark mode) */}
      <section className="py-24 bg-[var(--bg-main)] text-[var(--text-main)]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16 text-center text-[var(--primary)]">
            ජීවන චක්‍රයේ සත්‍යය
          </h2>
          <div className="space-y-12">
            {stages.map((stage, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 border-b border-[var(--border-color)] pb-8">
                <div className="md:w-1/3">
                  <h3 className="text-2xl md:text-3xl font-serif font-semibold">{stage.text}</h3>
                </div>
                <div className="md:w-2/3 flex items-center">
                  <p className="text-lg md:text-xl opacity-80 leading-relaxed font-sinhala">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
