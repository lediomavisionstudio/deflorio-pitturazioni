import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, RoundedBox } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function PaintWall() {
  const brush = useRef();
  const paint = useRef();

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (brush.current) {
      brush.current.position.x = Math.sin(t * 0.8) * 0.35 + pointer.x * 0.15;
      brush.current.position.y = Math.cos(t * 0.9) * 0.12;
      brush.current.rotation.z = -0.16 + Math.sin(t) * 0.035;
    }
    if (paint.current) {
      paint.current.scale.x = 1.4 + Math.sin(t * 0.6) * 0.24;
    }
  });

  return (
    <group position={[0.7, 0, 0]}>
      <RoundedBox args={[4.6, 2.75, 0.08]} radius={0.08} smoothness={8} position={[0, 0, -0.08]}>
        <meshStandardMaterial color="#f7f1e7" roughness={0.62} />
      </RoundedBox>
      <mesh ref={paint} position={[-0.8, -0.05, 0.02]}>
        <boxGeometry args={[1.8, 1.35, 0.035]} />
        <meshStandardMaterial color="#e50914" roughness={0.38} transparent opacity={0.88} />
      </mesh>
      <group ref={brush} position={[0.35, 0.05, 0.35]} rotation={[0.05, 0.05, -0.16]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 1.05, 32]} />
          <meshStandardMaterial color="#f7f7f7" roughness={0.48} metalness={0.22} />
        </mesh>
        <mesh position={[-0.75, -0.42, 0]} rotation={[0, 0, 0.82]}>
          <cylinderGeometry args={[0.055, 0.075, 1.25, 24]} />
          <meshStandardMaterial color="#e50914" roughness={0.34} />
        </mesh>
        <mesh position={[0.7, 0, 0]} scale={[1.25, 0.48, 0.34]}>
          <sphereGeometry args={[0.32, 32, 16]} />
          <meshStandardMaterial color="#080808" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0.3, 5.8], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 4, 4]} intensity={2.4} />
        <pointLight position={[-3, 1, 3]} color={new THREE.Color('#4bb7ff')} intensity={3.2} />
        <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.16}>
          <PaintWall />
        </Float>
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
