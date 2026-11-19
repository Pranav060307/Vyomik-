import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneCamera } from './SceneCamera';
import { SceneLighting } from './SceneLighting';
import { AtmosphericParticles } from './AtmosphericParticles';
import { HoodieDisplay } from './HoodieDisplay';

export const HeroScene3D: React.FC = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full relative select-none min-h-[300px]">
      <Canvas
        camera={{ position: [0, 0.2, 7.2], fov: 42 }}
        dpr={isMobile ? [1, 1.25] : [1, 2]}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance', alpha: true }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <SceneCamera />
          <SceneLighting />

          {/* Restrained Atmospheric Dust Particles */}
          <AtmosphericParticles count={isMobile ? 18 : 28} />

          {/* Suspended Authentic Warm-Ivory Oversized Streetwear Hoodie */}
          <HoodieDisplay imageUrl="/assets/vyomik-original-hoodie.png" />
        </Suspense>
      </Canvas>
    </div>
  );
};
