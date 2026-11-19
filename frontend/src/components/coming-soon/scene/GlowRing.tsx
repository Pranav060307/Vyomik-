import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const GlowRing: React.FC = () => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group position={[0, -1.35, 0]}>
      {/* Primary Glowing Amber/Rust Elliptical Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.85, 0.026, 16, 100]} />
        <meshBasicMaterial
          color="#C47A3A"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Subtle Secondary Outer Halo Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.92, 0.012, 16, 80]} />
        <meshBasicMaterial
          color="#A64B2A"
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
};
