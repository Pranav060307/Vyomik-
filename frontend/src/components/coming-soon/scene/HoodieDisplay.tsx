import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface HoodieDisplayProps {
  glbUrl?: string;
  imageUrl?: string;
}

export const HoodieDisplay: React.FC<HoodieDisplayProps> = ({
  imageUrl = '/assets/vyomik-original-hoodie.png',
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load the authentic warm-ivory hoodie texture with alpha channel
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;

    if (meshRef.current) {
      // Gentle floating harmonic vertical motion
      const floatOffset = Math.sin(t * 1.3) * 0.07;
      meshRef.current.position.y = 0.25 + floatOffset;

      // Subtle mouse parallax tilt
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        pointer.x * 0.08,
        0.05
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -pointer.y * 0.05,
        0.05
      );
    }
  });

  return (
    <group position={[0, 0, 0.4]}>
      {/* High-Resolution Warm-Ivory Oversized Hoodie Depth Plane (896x1200 aspect ratio) */}
      <mesh ref={meshRef} position={[0, 0.25, 0]}>
        <planeGeometry args={[3.8, 5.09]} />
        <meshStandardMaterial
          map={texture}
          transparent={true}
          alphaTest={0.02}
          roughness={0.78}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
