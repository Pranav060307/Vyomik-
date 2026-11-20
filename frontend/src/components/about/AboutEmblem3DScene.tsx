import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// -------------------------------------------------------------
// 1. EXTRACTED 3D VYOMIK MONOLITH EMBLEM (Extruded Geometry)
// -------------------------------------------------------------
const GiantVEmblem: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Extrude the 4 exact geometric components of the official VYOMIK emblem
  const geometries = useMemo(() => {
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.42,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.045,
      bevelThickness: 0.045,
    };

    // Component 1: Top main wing chevron
    const shape1 = new THREE.Shape();
    shape1.moveTo(-1.895, 1.43);
    shape1.lineTo(-0.845, 1.43);
    shape1.lineTo(-0.015, 0.47);
    shape1.lineTo(0.835, 1.43);
    shape1.lineTo(1.885, 1.41);
    shape1.lineTo(1.685, 1.11);
    shape1.lineTo(1.055, 1.11);
    shape1.lineTo(0.085, 0.01);
    shape1.lineTo(-0.025, -0.06);
    shape1.lineTo(-1.055, 1.11);
    shape1.lineTo(-1.695, 1.11);
    shape1.closePath();

    // Component 2: Left lower wing slab
    const shape2 = new THREE.Shape();
    shape2.moveTo(-1.475, 0.84);
    shape2.lineTo(-1.145, 0.82);
    shape2.lineTo(-0.835, 0.47);
    shape2.lineTo(-0.835, -0.19);
    shape2.lineTo(-1.485, 0.77);
    shape2.lineTo(-1.515, 0.83);
    shape2.closePath();

    // Component 3: Right lower wing slab
    const shape3 = new THREE.Shape();
    shape3.moveTo(1.135, 0.83);
    shape3.lineTo(1.495, 0.81);
    shape3.lineTo(0.825, -0.19);
    shape3.lineTo(0.825, 0.46);
    shape3.closePath();

    // Component 4: Center lower V chevron
    const shape4 = new THREE.Shape();
    shape4.moveTo(0.515, 0.06);
    shape4.lineTo(0.525, -0.66);
    shape4.lineTo(-0.005, -1.43);
    shape4.lineTo(-0.535, -0.66);
    shape4.lineTo(-0.535, 0.05);
    shape4.lineTo(0.005, -0.66);
    shape4.closePath();

    return [
      new THREE.ExtrudeGeometry(shape1, extrudeSettings),
      new THREE.ExtrudeGeometry(shape2, extrudeSettings),
      new THREE.ExtrudeGeometry(shape3, extrudeSettings),
      new THREE.ExtrudeGeometry(shape4, extrudeSettings),
    ];
  }, []);

  // Monumental slow sway and breathing elevation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.elapsedTime;
      groupRef.current.position.y = 0.08 + Math.sin(t * 0.4) * 0.04;
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.035;
      groupRef.current.rotation.x = 0.04 + Math.sin(t * 0.25) * 0.015;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.08, -0.2]}>
      {geometries.map((geom, idx) => (
        <mesh key={idx} geometry={geom} castShadow receiveShadow>
          <meshStandardMaterial
            color="#8A7A6D"
            roughness={0.42}
            metalness={0.76}
            envMapIntensity={1.2}
            emissive="#A64B2A"
            emissiveIntensity={0.06}
          />
        </mesh>
      ))}

      {/* Subtle Inset Warm Specular Facet Accents */}
      {geometries.map((geom, idx) => (
        <mesh key={`accent-${idx}`} geometry={geom} position={[0, 0, 0.01]}>
          <meshStandardMaterial
            color="#2A2420"
            roughness={0.3}
            metalness={0.9}
            wireframe={false}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
    </group>
  );
};

// -------------------------------------------------------------
// 2. SUNRISE GLOWING ORANGE ELLIPTICAL ARC & HALO
// -------------------------------------------------------------
const GlowingSunriseArc: React.FC = () => {
  const ringRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ringRef.current) {
      // Subtle breathing pulse in scale and glow
      const s = 1.0 + Math.sin(t * 0.6) * 0.012;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, -0.05, -1.6]}>
      {/* Primary Glowing Core Arc */}
      <mesh ref={ringRef} rotation={[0, 0, 0]}>
        <torusGeometry args={[3.1, 0.038, 16, 120, Math.PI * 1.35]} />
        <meshBasicMaterial
          color="#FF6A3D"
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Secondary Diffuse Outer Amber Glow Arc */}
      <mesh ref={haloRef} rotation={[0, 0, 0]}>
        <torusGeometry args={[3.15, 0.09, 16, 100, Math.PI * 1.35]} />
        <meshBasicMaterial
          color="#A64B2A"
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Radial Sunrise Atmospheric Glow Disc */}
      <mesh position={[0, 0.3, -0.4]}>
        <circleGeometry args={[3.4, 32]} />
        <meshBasicMaterial
          color="#FF5722"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 3. DARK FLANKING MOUNTAINS & RUGGED ROCKY ENVIRONMENT
// -------------------------------------------------------------
const FlankingMountains: React.FC = () => {
  // Construct 3D rocky mountain silhouettes on left and right flanks
  const [leftMountainGeom, rightMountainGeom] = useMemo(() => {
    const leftShape = new THREE.Shape();
    leftShape.moveTo(-7.0, -3.5);
    leftShape.lineTo(-7.0, 2.2);
    leftShape.lineTo(-5.2, 1.4);
    leftShape.lineTo(-4.0, 2.4);
    leftShape.lineTo(-2.8, 0.8);
    leftShape.lineTo(-1.8, -0.2);
    leftShape.lineTo(-1.6, -3.5);
    leftShape.closePath();

    const rightShape = new THREE.Shape();
    rightShape.moveTo(1.6, -3.5);
    rightShape.lineTo(1.8, -0.2);
    rightShape.lineTo(2.8, 0.8);
    rightShape.lineTo(4.0, 2.4);
    rightShape.lineTo(5.2, 1.4);
    rightShape.lineTo(7.0, 2.2);
    rightShape.lineTo(7.0, -3.5);
    rightShape.closePath();

    const mountainExtrude: THREE.ExtrudeGeometryOptions = {
      depth: 1.2,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.15,
      bevelThickness: 0.2,
    };

    return [
      new THREE.ExtrudeGeometry(leftShape, mountainExtrude),
      new THREE.ExtrudeGeometry(rightShape, mountainExtrude),
    ];
  }, []);

  return (
    <group position={[0, -0.4, -1.2]}>
      {/* Left Rugged Mountain Formation */}
      <mesh geometry={leftMountainGeom} receiveShadow>
        <meshStandardMaterial
          color="#161413"
          roughness={0.88}
          metalness={0.15}
          emissive="#C85A2E"
          emissiveIntensity={0.07}
        />
      </mesh>

      {/* Right Rugged Mountain Formation */}
      <mesh geometry={rightMountainGeom} receiveShadow>
        <meshStandardMaterial
          color="#161413"
          roughness={0.88}
          metalness={0.15}
          emissive="#C85A2E"
          emissiveIntensity={0.07}
        />
      </mesh>

      {/* Rugged Rocky Foreground Pedestal */}
      <mesh position={[0, -2.2, 0.4]} rotation={[-Math.PI / 12, 0, 0]}>
        <boxGeometry args={[7.5, 1.4, 3.0]} />
        <meshStandardMaterial
          color="#11100F"
          roughness={0.92}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// 4. FLOATING ATMOSPHERIC SPARKS & EMBER PARTICLES
// -------------------------------------------------------------
const FloatingEmbers: React.FC<{ count?: number }> = ({ count = 48 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 0.5 + Math.random() * 4.2;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3 + 0] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -2.2 + Math.random() * 4.6;
      pos[i * 3 + 2] = -1.5 + Math.sin(angle) * radius;

      // Slow drift speed
      spd[i] = 0.12 + Math.random() * 0.24;
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
      array[idx + 0] += Math.sin(array[idx + 1] * 0.9 + i) * 0.002;

      if (array[idx + 1] > 2.8) {
        array[idx + 1] = -2.2;
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
        size={0.038}
        color="#FFA048"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// -------------------------------------------------------------
// 5. CINEMATIC CAMERA CONTROLLER (Restrained floating motion)
// -------------------------------------------------------------
const CinematicCamera: React.FC = () => {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.22) * 0.14;
    camera.position.y = 0.15 + Math.cos(t * 0.18) * 0.08;
    camera.lookAt(0, 0.1, 0);
  });

  return null;
};

// -------------------------------------------------------------
// 6. MAIN 3D EMBLEM EXPERIENCE SECTION
// -------------------------------------------------------------
export const AboutEmblem3DScene: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  return (
    <section className="relative w-full bg-[#0B0B0B] overflow-hidden min-h-[480px] sm:min-h-[540px] lg:h-[620px] flex items-center justify-center border-b border-[#242321]/50">
      
      {/* Background Volcanic Rock Atmospheric Texture Layer */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <img
          src="/assets/vyomik-rock-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-bottom opacity-40 mix-blend-screen scale-105"
        />
        {/* Environmental Vignette Masks */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-[#0B0B0B]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0B0B0B_90%)]" />
        
        {/* Core Sunrise Amber Glow Behind Emblem */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] lg:w-[650px] h-[340px] sm:h-[500px] lg:h-[650px] rounded-full bg-[#FF5722]/15 blur-[120px] pointer-events-none" />
      </div>

      {/* 3D Canvas / WebGL Scene */}
      <div className="relative z-10 w-full h-[480px] sm:h-[540px] lg:h-[620px]">
        {hasWebGL ? (
          <Canvas
            shadows
            camera={{ position: [0, 0.15, 6.2], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Cinematic Camera Controller */}
            <CinematicCamera />

            {/* Ambient Base Light */}
            <ambientLight intensity={0.65} color="#241B16" />

            {/* Warm Key Light from Top-Front */}
            <directionalLight
              position={[2, 4, 5]}
              intensity={2.4}
              color="#FDF4E7"
              castShadow
            />

            {/* Glowing Burnt-Orange Sunrise Backlight */}
            <pointLight
              position={[0, 0, -1.8]}
              intensity={5.0}
              color="#FF6A3D"
              distance={12}
            />

            {/* Fill Light from Bottom */}
            <directionalLight
              position={[0, -3, 2]}
              intensity={0.6}
              color="#A64B2A"
            />

            {/* 3D Flanking Mountain Formations */}
            <FlankingMountains />

            {/* Giant Glowing Orange Sunrise Arc */}
            <GlowingSunriseArc />

            {/* Giant Extruded 3D VYOMIK Emblem Monolith */}
            <GiantVEmblem />

            {/* Floating Amber Embers & Dust Motes */}
            <FloatingEmbers count={44} />
          </Canvas>
        ) : (
          /* Graceful Fallback if WebGL unavailable */
          <div className="w-full h-full flex items-center justify-center relative">
            <img
              src="/assets/vyomik-official-emblem.png"
              alt="VYOMIK Emblem"
              className="w-48 sm:w-64 h-auto drop-shadow-[0_0_40px_rgba(255,106,61,0.8)]"
            />
          </div>
        )}
      </div>

    </section>
  );
};
