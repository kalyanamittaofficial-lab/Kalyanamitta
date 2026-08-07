import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const ParticleSystem = () => {
  const pointsRef = useRef();
  const scroll = useScroll();
  const count = 8000;
  
  // Initialize particles in a sphere
  const [positions, originalPositions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
      orig[i*3] = x; orig[i*3+1] = y; orig[i*3+2] = z;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [pos, orig, ph];
  }, [count]);

  const color = new THREE.Color();

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const s = scroll.offset; // 0 to 1

    const positionsArray = pointsRef.current.geometry.attributes.position.array;
    const material = pointsRef.current.material;

    // Define behaviors based on scroll (s)
    let spread = 1;
    let speed = 1;
    let jitter = 0;
    
    if (s < 0.1) {
      // 1. Birth
      spread = 0.1 + (s / 0.1) * 0.9;
      color.setHex(0xffffff).lerp(new THREE.Color(0xffd700), s / 0.1);
      material.opacity = Math.min(1, s / 0.05);
    } else if (s < 0.25) {
      // 2. Childhood
      const localS = (s - 0.1) / 0.15;
      spread = 1 + Math.sin(localS * Math.PI) * 0.5 + localS * 0.5; // Bouncy
      speed = 3;
      color.setHex(0xffd700).lerp(new THREE.Color(0xffe55c), localS);
      material.opacity = 1;
    } else if (s < 0.4) {
      // 3. Youth
      const localS = (s - 0.25) / 0.15;
      spread = 1.5 + localS * 0.8;
      speed = 6; // Fastest
      color.setHex(0xffe55c).lerp(new THREE.Color(0xff8c00), localS);
      material.opacity = 1;
    } else if (s < 0.55) {
      // 4. Adult / Married
      const localS = (s - 0.4) / 0.15;
      spread = 2.3;
      speed = 2; // Stabilizing
      color.setHex(0xff8c00).lerp(new THREE.Color(0xaa5500), localS);
      material.opacity = 1;
    } else if (s < 0.7) {
      // 5. Middle Age
      const localS = (s - 0.55) / 0.15;
      spread = 2.3 - localS * 0.3;
      speed = 0.8;
      color.setHex(0xaa5500).lerp(new THREE.Color(0x777777), localS);
      material.opacity = 1 - localS * 0.3;
    } else if (s < 0.85) {
      // 6. Old Age
      const localS = (s - 0.7) / 0.15;
      spread = 2.0 + localS * 1.5; // Drifting apart
      speed = 0.3;
      color.setHex(0x777777).lerp(new THREE.Color(0x444444), localS);
      material.opacity = 0.7 - localS * 0.3;
    } else if (s < 0.95) {
      // 7. Sick
      const localS = (s - 0.85) / 0.1;
      spread = 3.5;
      speed = 0.1;
      jitter = localS * 0.3; // Shaking
      color.setHex(0x444444).lerp(new THREE.Color(0x550000), localS);
      material.opacity = 0.4 - localS * 0.2;
    } else {
      // 8. Death
      const localS = (s - 0.95) / 0.05;
      spread = 3.5 + localS * 10.0; // Dissolving into nothing
      speed = 0;
      jitter = 0;
      color.setHex(0x550000).lerp(new THREE.Color(0x000000), localS);
      material.opacity = Math.max(0, 0.2 - localS * 0.2);
    }

    material.color.copy(color);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const ox = originalPositions[ix];
      const oy = originalPositions[ix+1];
      const oz = originalPositions[ix+2];
      
      const timeOffset = phases[i] + t * speed;
      const jx = (Math.random() - 0.5) * jitter;
      const jy = (Math.random() - 0.5) * jitter;
      const jz = (Math.random() - 0.5) * jitter;

      positionsArray[ix] = ox * spread + Math.sin(timeOffset) * 0.3 + jx;
      positionsArray[ix+1] = oy * spread + Math.cos(timeOffset) * 0.3 + jy;
      positionsArray[ix+2] = oz * spread + Math.sin(timeOffset * 0.8) * 0.3 + jz;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.15;
    pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const StageLabel = ({ text, desc }) => (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 24px'
  }}>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: 0.8 }}
      style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', fontFamily: 'var(--font-serif)', margin: '0 0 16px 0', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
    >
      {text}
    </motion.h2>
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', fontFamily: 'var(--font-sinhala)', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}
    >
      {desc}
    </motion.p>
  </div>
);

export default function LifeCycleHero() {
  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: '#050505', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <React.Suspense fallback={null}>
          <ScrollControls pages={8} damping={0.2}>
            
            {/* The 3D Magic */}
            <ParticleSystem />

            {/* The HTML Overlay */}
            <Scroll html style={{ width: '100%' }}>
              <StageLabel text="උපත" desc="හිස් අවකාශයෙන් පටන්ගෙන, අලුත් ජීවයක අංශු එක්රැස් වීම." />
              <StageLabel text="ළමා අවධිය" desc="සැහැල්ලුවෙන්, වේගයෙන් සහ නිදහසේ වර්ධනය වන කාලය." />
              <StageLabel text="යෞවනය" desc="ශක්තියෙන් සහ දීප්තියෙන් පිරුණු ජීවිතයේ ස්වර්ණමය යුගය." />
              <StageLabel text="ගිහි ජීවිතය" desc="වගකීම් සමඟ ස්ථාවර වන, සංකීර්ණ හැඩයක් ගන්නා අවධිය." />
              <StageLabel text="මැදි වයස" desc="දීප්තිය මදක් අඩුවී, වේගය බාල වී, සන්සුන් වන කාලය." />
              <StageLabel text="මහලු විය" desc="ශක්තිය ගිලිහී, බැඳීම් ලිහිල් වී, විසිරී යාමට පටන් ගැනීම." />
              <StageLabel text="රෝගී වීම" desc="අඳුරු පැහැ ගැන්වී, ක්‍රමයෙන් බිඳ වැටෙන අවසාන අදියර." />
              <StageLabel text="මරණය" desc="සියල්ල අනිත්‍ය බව පසක් කරමින්, නැවතත් ශුන්‍යත්වයට මුසුවීම." />
              
              {/* Extra spacing at bottom to ensure smooth transition to next section */}
              <div style={{ height: '20vh' }}></div>
            </Scroll>

          </ScrollControls>
        </React.Suspense>
      </Canvas>
    </div>
  );
}
