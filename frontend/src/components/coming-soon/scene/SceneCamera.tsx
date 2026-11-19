import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const SceneCamera: React.FC = () => {
  const { camera, pointer } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 0.4, 0));

  useFrame(() => {
    // Smooth lerp camera position based on pointer coordinates
    const targetX = pointer.x * 0.4;
    const targetY = 1.2 + pointer.y * 0.3;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.lookAt(targetLookAt.current);
  });

  return null;
};
