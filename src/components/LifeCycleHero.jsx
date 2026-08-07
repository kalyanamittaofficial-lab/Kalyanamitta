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
      // Gentle breathing effect
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
          // Boost colors for high quality look
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
    // Auto-rotate the circle continuously based on time
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
    <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)] relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row relative">
        
        {/* LEFT SIDE: SCROLLING TEXT (Elite Academic Style) */}
        <div className="w-full lg:w-1/2 px-6 md:px-12 py-12 lg:py-48 flex flex-col z-0 order-last lg:order-first">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 lg:mb-48"
          >
             <h2 className="text-4xl md:text-6xl font-serif font-bold text-[var(--primary)] mb-6">ජීවන චක්‍රයේ සත්‍යය</h2>
             <p className="text-lg md:text-2xl font-sinhala opacity-70 max-w-lg leading-relaxed">
               අපි කවුද? කොහෙන්ද ආවේ? කොහෙටද යන්නේ? මේ සසර ගමනේ සැබෑ ස්වභාවය විමසා බලමු...
             </p>
          </motion.div>

          <div className="space-y-48 lg:space-y-64">
            {stages.map((stage, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col border-l-2 border-[var(--primary)] pl-8 lg:pl-12"
              >
                <div className="text-[var(--primary)] font-serif text-xl lg:text-2xl mb-2 opacity-50 tracking-widest">
                   {String(i + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
                </div>
                <h3 className="text-3xl md:text-5xl font-serif font-bold mb-6">{stage.text}</h3>
                <p className="text-xl md:text-2xl opacity-80 leading-relaxed font-sinhala max-w-md">
                  {stage.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* FINAL CLIMAX */}
          <div className="mt-64 pb-32 lg:pb-64 flex flex-col items-start">
             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                className="text-5xl md:text-7xl font-serif font-bold mb-8"
             >
               ඉතින්, ඔබ කවුද?
             </motion.h1>
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                className="text-4xl md:text-6xl font-sinhala font-bold text-[var(--primary)] uppercase tracking-wider mb-12"
             >
               ඔබ අනාථයෙක්!
             </motion.div>
             <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                className="text-xl md:text-3xl opacity-70 font-sinhala max-w-2xl leading-relaxed"
             >
               මෙය තේරුම් ගෙන, මේ සසර ගමනින් එතෙර වීමට මාර්ගය සොයා ගැනීම පමණක්ම ජීවිතයේ එකම අරමුණ කරගන්න...
             </motion.p>
          </div>

        </div>

        {/* RIGHT SIDE: STICKY TV BOX */}
        <div className="w-full lg:w-1/2 h-[40vh] lg:h-screen sticky top-[80px] lg:top-0 flex items-center justify-center p-4 lg:p-12 order-first lg:order-last z-20 bg-[var(--bg-main)] lg:bg-transparent">
           <div 
             className="w-full h-full rounded-2xl lg:rounded-[40px] overflow-hidden relative shadow-2xl"
             style={{ 
               backgroundColor: '#020202', 
               border: '1px solid rgba(255,255,255,0.05)',
               boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6)' 
             }}
           >
             {/* Vignette Overlay for the TV effect */}
             <div 
               className="absolute inset-0 z-10 pointer-events-none" 
               style={{ background: 'radial-gradient(circle at center, transparent 30%, #000000 100%)' }} 
             />

             {/* WebGL Canvas */}
             <Canvas 
               camera={{ position: [0, 0, RADIUS + 15], fov: 45 }} 
               className="absolute inset-0 z-0"
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
  );
}
