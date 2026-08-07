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
    { text: 'කොහේද සිටියේ?', desc: 'ඔබ ඉපදෙන්න පෙර සිටියේ කොහේදැයි ඔබ දන්නවාද? ඇයි ඉපදුණේ කියා ඔබ දන්නවාද?' },
    { text: 'නොදැනුවත්කම', desc: 'මැරුණු පසු කුමක් වේදැයි ඔබ දන්නවාද? නැත්නම්... ඔබ ඒ ගැන අසා තිබෙනවා පමණද?' },
    { text: 'විශ්වාසය සහ සත්‍යය', desc: 'ඔබ විශ්වාස කරන දේ... ඔබ දන්නා දේ... එකම දෙයක්ද?' },
    { text: 'හිස් අතින් පැමිණීම', desc: 'උපන් මොහොතේ ඔබට නමක් තිබුණේ නැහැ. ධනයක් තිබුණේ නැහැ. තනතුරක් තිබුණේ නැහැ. ඒ සියල්ල පසුව ලැබුණා.' },
    { text: 'මිරිඟුව පසුපස', desc: 'අද ඒවා වෙනුවෙන් අපි ජීවිතයම වැය කරනවා. නමුත්... අපි ඇත්තටම නොදන්නා දේ මොනවාද?' },
    { text: 'සැබෑ ප්‍රශ්නය', desc: 'අපි කොහෙන් ආවාද? ඇයි ආවාද? කොතැනට යනවාද? මේ සියල්ලේ තේරුම කුමක්ද?' },
    { text: 'අපතේ යන කාලය', desc: 'මේ ප්‍රශ්නවලට පිළිතුරක් නොමැතිව... අපි වෙනත් සියලු දේ ගැන දැනගැනීමට ජීවිතයම වැය කරනවා. අපිටම සිදුවන දේ ගැන සෙවීමට කොපමණ කාලයක් වැය කරනවාද?' },
    { text: 'ලෝකය සහ තමන්', desc: 'කෙනෙකුට ජීවිත කාලයම ලෝකය ගැන ඉගෙන ගත හැකිය. නමුත්... තමන් ගැන නොදැනම මිය යා හැකිය.' },
    { text: 'වැදගත්ම සෙවීම', desc: 'එසේ නම්... මේ ජීවිතයේ කළ යුතු වැදගත්ම සෙවීම කුමක්ද? තවත් ධනයක්ද? තවත් දැනුමක්ද? තවත් නාමයක්ද?' },
    { text: 'මම කවුද?', desc: 'නැත්නම්... "මට ඇත්තටම සිදුවන්නේ කුමක්ද?" "මම ඇත්තටම කවුද?"' },
    { text: 'අනාථයෙක්', desc: 'කොහෙන් ආවාදැයි නොදනිමි. ඇයි ආවාදැයි නොදනිමි. කොතැනට යනවාදැයි නොදනිමි.' }
  ];

  return (
    <>
      <style>
        {`
          .lc-wrapper {
             background-color: var(--bg-main);
             color: var(--text-main);
             width: 100%;
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
          .lc-stage h3 {
             font-family: var(--font-serif);
             font-size: 2.2rem;
             font-weight: 700;
             margin-bottom: 1.5rem;
             display: flex;
             align-items: baseline;
             gap: 1rem;
          }
          .lc-stage-num {
             color: var(--primary);
             font-size: 1.5rem;
             opacity: 0.5;
             font-weight: 400;
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
                align-items: flex-start;
             }
             .lc-text-side {
                width: 50%;
                padding: 10rem 4rem;
             }
             .lc-tv-side {
                width: 50%;
                height: calc(100vh - 80px);
                top: 80px;
                padding: 2rem 3rem 2rem 1rem;
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
               <h2>ඔබ කවුද?</h2>
               <p style={{ marginTop: '2rem' }}>
                 ඔබේ නමද ඔබ? ඔබේ ශරීරයද ඔබ? ඔබේ රැකියාවද ඔබ?
               </p>
               <p style={{ marginTop: '1rem' }}>
                 වෛද්‍යවරයෙක්ද? ඉංජිනේරුවෙක්ද? ව්‍යාපාරිකයෙක්ද? යාචකයෙක්ද?
               </p>
               <p style={{ marginTop: '1.5rem', fontStyle: 'italic', color: 'var(--primary)', opacity: 0.9 }}>
                 එසේත් නැත්නම්... ඒ සියල්ලට පෙර සිටි කෙනාද ඔබ?
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
                  <h3>
                  <span className="lc-stage-num">{String(i + 1).padStart(2, '0')}.</span>
                  {stage.text}
                </h3>
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
                 "මේ ගමනේ අවසානය කුමක්ද?"
               </motion.h1>
               <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                  style={{ marginBottom: '3rem', fontSize: '1.8rem', opacity: 0.8 }}
               >
                 එසේ නම්... අපි මුලින්ම සෙවිය යුත්තේ එය නොවේද?
               </motion.p>
               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                  className="lc-highlight"
               >
                 "එහි පස්සිකෝ..."
               </motion.div>
               <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                  style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)', opacity: 1 }}
               >
                 "එන්න. බලන්න. තමන්ම අවබෝධ කරගන්න."
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
                 camera={{ position: [0, 0, RADIUS + 20], fov: 45 }} 
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
