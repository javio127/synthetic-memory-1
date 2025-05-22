'use client';
import { useState } from 'react';
import { Html } from '@react-three/drei';

interface Utterance {
  id: number;
  text: string;
}

interface Props {
  utterances: Utterance[];
}

export default function UtteranceConstellation({ utterances }: Props) {
  // Arrange dots in a sphere
  const radius = 2.5;
  return (
    <group>
      {utterances.map((u, i) => {
        const phi = Math.acos(-1 + (2 * i) / utterances.length);
        const theta = Math.sqrt(utterances.length * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        return <UtteranceDot key={u.id} position={[x, y, z]} text={u.text} />;
      })}
    </group>
  );
}

function UtteranceDot({ position, text }: { position: [number, number, number]; text: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <mesh
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial emissive="#fff" color="#fff" emissiveIntensity={hovered ? 1 : 0.5} opacity={0.7} transparent />
      {hovered && (
        <Html center style={{ pointerEvents: 'none' }}>
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded max-w-xs font-serif shadow-lg border border-white/20">
            {text}
          </div>
        </Html>
      )}
    </mesh>
  );
} 