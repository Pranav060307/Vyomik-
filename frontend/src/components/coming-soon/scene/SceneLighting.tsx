import React from 'react';

export const SceneLighting: React.FC = () => {
  return (
    <>
      {/* Ambient Base Light */}
      <ambientLight intensity={0.4} color="#2A2018" />

      {/* Main Warm Key Spotlight (Upper Right) */}
      <spotLight
        position={[4.5, 7.0, 4.0]}
        intensity={2.2}
        color="#C47A3A"
        angle={0.65}
        penumbra={0.8}
        decay={1.5}
      />

      {/* Cool Fill Point Light (Left) */}
      <pointLight position={[-4.0, 2.5, 2.5]} intensity={0.7} color="#8B6B4A" decay={2} />

      {/* Low Warm Rim Light (Rear Grounding) */}
      <pointLight position={[0.0, -1.0, -2.0]} intensity={0.6} color="#A64B2A" decay={2} />

      {/* Direct Front Subtle Accent Light */}
      <directionalLight position={[0, 2, 5]} intensity={0.5} color="#F4F0E8" />
    </>
  );
};
