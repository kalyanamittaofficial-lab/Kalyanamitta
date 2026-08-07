import React, { useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
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
      ref.current.position.y = Math.sin(t * 1.5 + index) * 0.4; 
    }
  });

  return (
    <group position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]} rotation={[0, angle, 0]}>
      <mesh ref={ref}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial 
          map={texture} 
          transparent={true} 
          side={THREE.DoubleSide} 
          depthWrite={false}
          color={new THREE.Color(1.15, 1.15, 1.15)}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

const AutoCarousel = ({ totalStages }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = -(state.clock.getElapsedTime() * 0.15);
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: totalStages }).map((_, i) => (
        <ImagePlane key={i} url={`/lifeCycle/LC-${i + 1}.png`} index={i} total={totalStages} />
      ))}
    </group>
  );
};

export default function LifeCycleHero() {
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
      <style>
        {`
          .lc-wrapper {
             background-color: var(--bg-main);
             color: var(--text-main);
             width: 100%;
             overflow: hidden;
          }
          .lc-hero-container {
             display: flex;
             flex-direction: column-reverse;
             width: 100%;
             max-width: 1600px;
             margin: 0 auto;
             position: relative;
          }
          .lc-text-side {
             width: 100%;
             padding: 4rem 1.5rem;
             display: flex;
             flex-direction: column;
             z-index: 10;
          }
          .lc-tv-side {
             width: 100%;
             height: 40vh;
             position: sticky;
             top: 60px; /* offset for mobile header */
             z-index: 20;
             padding: 1rem;
             display: flex;
             align-items: center;
             justify-content: center;
             background-color: var(--bg-main);
          }
          
          .lc-tv-box {
             width: 100%;
             height: 100%;
             background-color: #020202;
             border-radius: 20px;
             position: relative;
             overflow: hidden;
             box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
             border: 1px solid rgba(255,255,255,0.05);
          }
          
          .lc-intro {
             margin-bottom: 8rem;
          }
          .lc-intro h2 {
             font-family: var(--font-serif);
             font-size: 2.5rem;
             color: var(--primary);
             font-weight: 700;
             margin-bottom: 1rem;
          }
          .lc-intro p {
             font-family: var(--font-sinhala);
             font-size: 1.2rem;
             opacity: 0.7;
             line-height: 1.6;
          }

          .lc-stages {
             display: flex;
             flex-direction: column;
          }
          .lc-stage {
             border-left: 2px solid var(--primary);
             padding-left: 1.5rem;
             margin-bottom: 12rem;
             display: flex;
             flex-direction: column;
          }
          .lc-stage-num {
             color: var(--primary);
             font-family: var(--font-serif);
             font-size: 1.2rem;
             opacity: 0.5;
             letter-spacing: 0.2em;
             margin-bottom: 0.5rem;
          }
          .lc-stage h3 {
             font-family: var(--font-serif);
             font-size: 2rem;
             font-weight: 700;
             margin-bottom: 1rem;
          }
          .lc-stage p {
             font-family: var(--font-sinhala);
             font-size: 1.2rem;
             opacity: 0.8;
             line-height: 1.6;
          }

          .lc-climax {
             margin-top: 8rem;
             padding-bottom: 8rem;
             display: flex;
             flex-direction: column;
          }
          .lc-climax h1 {
             font-family: var(--font-serif);
             font-size: 3rem;
             font-weight: 700;
             margin-bottom: 1rem;
          }
          .lc-climax .lc-highlight {
             font-family: var(--font-sinhala);
             font-size: 2.5rem;
             font-weight: 700;
             color: var(--primary);
             letter-spacing: 0.1em;
             margin-bottom: 2rem;
          }
          .lc-climax p {
             font-family: var(--font-sinhala);
             font-size: 1.2rem;
             opacity: 0.7;
             line-height: 1.6;
             max-width: 600px;
          }

          @media (min-width: 1024px) {
             .lc-hero-container {
                flex-direction: row;
             }
             .lc-text-side {
                width: 50%;
                padding: 10rem 4rem;
             }
             .lc-tv-side {
                width: 50%;
                height: 100vh;
                top: 0;
                padding: 3rem;
             }
             .lc-tv-box {
                border-radius: 40px;
             }
             .lc-intro {
                margin-bottom: 12rem;
             }
             .lc-intro h2 { font-size: 4rem; }
             .lc-intro p { font-size: 1.5rem; }
             
             .lc-stage {
                padding-left: 2.5rem;
                margin-bottom: 16rem;
             }
             .lc-stage-num { font-size: 1.5rem; }
             .lc-stage h3 { font-size: 3rem; }
             .lc-stage p { font-size: 1.5rem; }
             
             .lc-climax {
                margin-top: 16rem;
                padding-bottom: 16rem;
             }
             .lc-climax h1 { font-size: 4.5rem; }
             .lc-climax .lc-highlight { font-size: 3.5rem; }
             .lc-climax p { font-size: 1.5rem; }
          }
        `}
      </style>

      <div className="lc-wrapper">
        <div className="lc-hero-container">
          
          {/* LEFT SIDE: SCROLLING TEXT */}
          <div className="lc-text-side">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lc-intro"
            >
               <h2>ජීවන චක්‍රයේ සත්‍යය</h2>
               <p>
                 අපි කවුද? කොහෙන්ද ආවේ? කොහෙටද යන්නේ? මේ සසර ගමනේ සැබෑ ස්වභාවය විමසා බලමු...
               </p>
            </motion.div>

            <div className="lc-stages">
              {stages.map((stage, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="lc-stage"
                >
                  <div className="lc-stage-num">
                     {String(i + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
                  </div>
                  <h3>{stage.text}</h3>
                  <p>{stage.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* FINAL CLIMAX */}
            <div className="lc-climax">
               <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
               >
                 ඉතින්, ඔබ කවුද?
               </motion.h1>
               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                  className="lc-highlight"
               >
                 ඔබ අනාථයෙක්!
               </motion.div>
               <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
               >
                 මෙය තේරුම් ගෙන, මේ සසර ගමනින් එතෙර වීමට මාර්ගය සොයා ගැනීම පමණක්ම ජීවිතයේ එකම අරමුණ කරගන්න...
               </motion.p>
            </div>

          </div>

          {/* RIGHT SIDE: STICKY TV BOX */}
          <div className="lc-tv-side">
             <div className="lc-tv-box">
               <div 
                 style={{ 
                   position: 'absolute',
                   inset: 0,
                   zIndex: 10,
                   pointerEvents: 'none',
                   background: 'radial-gradient(circle at center, transparent 30%, #000000 100%)' 
                 }} 
               />
               <Canvas 
                 camera={{ position: [0, 0, RADIUS + 15], fov: 45 }} 
                 style={{ position: 'absolute', inset: 0, zIndex: 0 }}
               >
                 <fog attach="fog" args={['#000000', 10, 45]} />
                 <Suspense fallback={null}>
                   <AutoCarousel totalStages={stages.length} />
                 </Suspense>
               </Canvas>
             </div>
          </div>

        </div>
      </div>
    </>
  );
}
