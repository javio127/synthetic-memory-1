'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function Being() {
  const beingRef = useRef<THREE.Mesh>(null);
  
  // Animate the being
  useFrame((state, delta) => {
    if (!beingRef.current) return;
    
    // Simple floating animation
    beingRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    
    // Gentle rotation
    beingRef.current.rotation.y += delta * 0.1;
    beingRef.current.rotation.z += delta * 0.05;
  });

  return (
    <group>
      {/* Main glow */}
      <Sphere ref={beingRef} args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </Sphere>
      
      {/* Inner core */}
      <Sphere args={[0.7, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#e1e1ff"
          emissive="#b1b1ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>
    </group>
  );
} 