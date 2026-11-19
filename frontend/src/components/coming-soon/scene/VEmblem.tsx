import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Architectural V Sculpture.
 * A refined, brushed-metallic decorative sculpture positioned gracefully behind the garment.
 * Features elegant bevels, dark gunmetal finish, and subtle warm specular response.
 */
export const VEmblem: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);

  // Construct refined architectural V geometry (slender, bevelled twin monoliths)
  const [leftWingGeom, rightWingGeom] = useMemo(() => {
    // Left fin: angled slab
    const leftShape = new THREE.Shape();
    leftShape.moveTo(-0.15, -1.6);
    leftShape.lineTo(-1.8, 1.8);
    leftShape.lineTo(-2.2, 1.8);
    leftShape.lineTo(-0.45, -1.6);
    leftShape.closePath();

    // Right fin: mirrored angled slab
    const rightShape = new THREE.Shape();
    rightShape.moveTo(0.15, -1.6);
    rightShape.lineTo(0.45, -1.6);
    rightShape.lineTo(2.2, 1.8);
    rightShape.lineTo(1.8, 1.8);
    rightShape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    };

    return [
      new THREE.ExtrudeGeometry(leftShape, extrudeSettings),
      new THREE.ExtrudeGeometry(rightShape, extrudeSettings),
    ];
  }, []);

  // Subtle breathing rotation/sway (very slow and dignified)
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0.4, -1.4]}>
      {/* Left Architectural Wing */}
      <mesh geometry={leftWingGeom}>
        <meshStandardMaterial
          color="#1C1A18"
          roughness={0.32}
          metalness={0.82}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Right Architectural Wing */}
      <mesh geometry={rightWingGeom}>
        <meshStandardMaterial
          color="#1C1A18"
          roughness={0.32}
          metalness={0.82}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Subtle Warm Specular Edge Inset on Left Fin */}
      <mesh position={[0, 0, 0.02]} geometry={leftWingGeom}>
        <meshStandardMaterial
          color="#2A241F"
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
};
