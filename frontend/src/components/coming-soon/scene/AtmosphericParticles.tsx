import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AtmosphericParticlesProps {
  count?: number;
}

/**
 * Subtle studio air particles / fine dust motes caught in warm key light.
 * Kept intentionally sparse and restrained to preserve fashion campaign minimalism.
 */
export const AtmosphericParticles: React.FC<AtmosphericParticlesProps> = ({ count = 32 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 1.0 + Math.random() * 3.2;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3 + 0] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -1.8 + Math.random() * 4.5;
      pos[i * 3 + 2] = -1.2 + Math.sin(angle) * radius;

      // Very slow drift speed
      spd[i] = 0.08 + Math.random() * 0.16;
    }

    return [pos, spd];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      array[idx + 1] += speeds[i] * delta;
      array[idx + 0] += Math.sin(array[idx + 1] * 0.8 + i) * 0.0015;

      if (array[idx + 1] > 3.2) {
        array[idx + 1] = -2.0;
      }
    }
    posAttr.needsUpdate = true;
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
        size={0.024}
        color="#D9D1C3"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
