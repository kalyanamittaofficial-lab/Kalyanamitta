import React, { useRef, Suspense } from 'react';
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
    <div className="w-full bg-[var(--bg-main)]">
      
      {/* THE TV BOX CONTAINER */}
      <div className="pt-24 pb-16 px-4 md:px-12 flex justify-center">
        <div 
          className="w-full max-w-[1400px] rounded-2xl md:rounded-[40px] overflow-hidden relative shadow-2xl"
          style={{ 
            height: 'clamp(500px, 75vh, 800px)', 
            backgroundColor: '#020202', 
            border: '2px solid rgba(255,255,255,0.05)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
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
              <AutoCarousel totalStages={11} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* FULL STORY SECTION */}
      <section className="py-16 bg-[var(--bg-main)] text-[var(--text-main)]">
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
            
            {/* The Climax statement at the bottom of the story */}
            <div className="flex flex-col items-center justify-center pt-16 text-center">
               <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">ඉතින්, ඔබ කවුද?</h1>
               <div className="text-3xl md:text-5xl font-sinhala font-bold text-[var(--primary)] uppercase tracking-wider mb-8">
                 ඔබ අනාථයෙක්!
               </div>
               <p className="text-xl md:text-2xl opacity-70 font-sinhala max-w-2xl leading-relaxed">
                 මෙය තේරුම් ගෙන, මේ සසර ගමනින් එතෙර වීමට මාර්ගය සොයා ගැනීම පමණක්ම ජීවිතයේ එකම අරමුණ කරගන්න...
               </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
