import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FabricRibbons: React.FC = () => {
  const ribbon1Ref = useRef<THREE.Mesh>(null);
  const ribbon2Ref = useRef<THREE.Mesh>(null);

  // Define 3D Catmull-Rom curves
  const [curve1, curve2] = useMemo(() => {
    // Ribbon 1: Sweeping around waist and out to right
    const pts1 = [
      new THREE.Vector3(-2.8, 1.6, -1.2),
      new THREE.Vector3(-1.8, 0.4, -0.4),
      new THREE.Vector3(-0.6, -0.3, 0.8),
      new THREE.Vector3(1.2, -0.2, 0.9),
      new THREE.Vector3(2.6, 0.6, -0.3),
      new THREE.Vector3(3.4, 1.4, -1.5),
    ];
    const c1 = new THREE.CatmullRomCurve3(pts1);

    // Ribbon 2: Flowing from upper right across back to left
    const pts2 = [
      new THREE.Vector3(2.5, 2.0, -1.5),
      new THREE.Vector3(1.4, 1.2, -0.6),
      new THREE.Vector3(0.0, 0.9, -0.8),
      new THREE.Vector3(-1.4, 0.1, 0.2),
      new THREE.Vector3(-2.4, -0.6, 0.7),
      new THREE.Vector3(-3.2, -1.2, 1.1),
    ];
    const c2 = new THREE.CatmullRomCurve3(pts2);

    return [c1, c2];
  }, []);

  const geom1 = useMemo(() => new THREE.TubeGeometry(curve1, 64, 0.045, 8, false), [curve1]);
  const geom2 = useMemo(() => new THREE.TubeGeometry(curve2, 64, 0.04, 8, false), [curve2]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ribbon1Ref.current) {
      ribbon1Ref.current.position.y = Math.sin(t * 1.2) * 0.06;
      ribbon1Ref.current.rotation.z = Math.sin(t * 0.8) * 0.03;
    }
    if (ribbon2Ref.current) {
      ribbon2Ref.current.position.y = Math.cos(t * 1.1) * 0.05;
      ribbon2Ref.current.rotation.x = Math.sin(t * 0.9) * 0.02;
    }
  });

  return (
    <group>
      {/* Front-Curling Burnt Rust Fabric Ribbon */}
      <mesh ref={ribbon1Ref} geometry={geom1}>
        <meshStandardMaterial
          color="#A64B2A"
          roughness={0.45}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rear-Wrapping Burnt Rust Fabric Ribbon */}
      <mesh ref={ribbon2Ref} geometry={geom2}>
        <meshStandardMaterial
          color="#8C3E22"
          roughness={0.48}
          metalness={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
