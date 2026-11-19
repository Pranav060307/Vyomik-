import React from 'react';

/**
 * Minimal Architectural Plinth.
 * A refined, low-profile stepped dark basalt platform with subtle bevels,
 * grounding the composition in a luxury gallery setting.
 */
export const StonePedestal: React.FC = () => {
  return (
    <group position={[0, -1.8, 0]}>
      {/* Upper Tier Disc */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[2.2, 2.25, 0.16, 64]} />
        <meshStandardMaterial
          color="#151413"
          roughness={0.88}
          metalness={0.15}
        />
      </mesh>

      {/* Subtle Chamfer Trim Ring */}
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.14, 2.18, 64]} />
        <meshStandardMaterial
          color="#2A241F"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Base Foundation Tier */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[2.45, 2.5, 0.16, 64]} />
        <meshStandardMaterial
          color="#0F0E0D"
          roughness={0.92}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
};
