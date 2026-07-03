import React, { useEffect, useMemo, useRef } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import * as THREE from 'https://esm.sh/three@0.171.0';
import { Canvas, useFrame } from 'https://esm.sh/@react-three/fiber@8.17.10?deps=react@18.3.1,react-dom@18.3.1,three@0.171.0';
import { ContactShadows, Environment, Float, PresentationControls } from 'https://esm.sh/@react-three/drei@9.122.0?deps=react@18.3.1,react-dom@18.3.1,three@0.171.0,@react-three/fiber@8.17.10';
import gsap from 'https://esm.sh/gsap@3.12.7';
import Lenis from 'https://esm.sh/lenis@1.1.20';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function PaintRoller() {
  const group = useRef();

  useEffect(() => {
    if (!group.current || prefersReducedMotion) return;
    gsap.fromTo(group.current.position, { x: 3.4, y: -0.2, z: 0.4 }, { x: 0, y: 0, z: 0, duration: 1.65, ease: 'power4.out', delay: 0.18 });
    gsap.fromTo(group.current.rotation, { y: -0.72, z: 0.28 }, { y: 0.12, z: -0.12, duration: 1.65, ease: 'power4.out', delay: 0.18 });
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;
    group.current.rotation.y += (pointerX * 0.16 + 0.12 - group.current.rotation.y) * 0.045;
    group.current.rotation.x += (-pointerY * 0.10 - group.current.rotation.x) * 0.045;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.82) * 0.045;
  });

  return React.createElement('group', { ref: group, rotation: [0, 0.08, -0.12], position: [0, 0, 0] },
    React.createElement('group', { rotation: [0, 0, Math.PI / 2.8] },
      React.createElement('mesh', { position: [-0.95, 0, 0], rotation: [0, Math.PI / 2, 0], castShadow: true },
        React.createElement('cylinderGeometry', { args: [0.16, 0.16, 2.35, 36] }),
        React.createElement('meshStandardMaterial', { color: '#b80710', roughness: 0.42, metalness: 0.08 })
      ),
      React.createElement('mesh', { position: [-2.08, 0, 0], rotation: [0, Math.PI / 2, 0], castShadow: true },
        React.createElement('cylinderGeometry', { args: [0.19, 0.19, 0.30, 36] }),
        React.createElement('meshStandardMaterial', { color: '#111111', roughness: 0.46, metalness: 0.15 })
      ),
      React.createElement('mesh', { position: [0.34, 0, 0], rotation: [0, Math.PI / 2, 0], castShadow: true },
        React.createElement('cylinderGeometry', { args: [0.24, 0.24, 0.48, 42] }),
        React.createElement('meshStandardMaterial', { color: '#dfe3e4', roughness: 0.24, metalness: 0.74 })
      ),
      React.createElement('mesh', { position: [0.92, 0, 0], rotation: [0, Math.PI / 2, 0], castShadow: true, receiveShadow: true },
        React.createElement('cylinderGeometry', { args: [0.44, 0.44, 1.48, 64] }),
        React.createElement('meshStandardMaterial', { color: '#f4f0e8', roughness: 0.68, metalness: 0.02 })
      ),
      React.createElement('mesh', { position: [0.26, 0, 0], rotation: [0, Math.PI / 2, 0], castShadow: true },
        React.createElement('torusGeometry', { args: [0.45, 0.035, 16, 64] }),
        React.createElement('meshStandardMaterial', { color: '#e50914', roughness: 0.34, metalness: 0.04 })
      ),
      React.createElement('mesh', { position: [1.60, 0, 0], rotation: [0, Math.PI / 2, 0], castShadow: true },
        React.createElement('torusGeometry', { args: [0.45, 0.035, 16, 64] }),
        React.createElement('meshStandardMaterial', { color: '#e50914', roughness: 0.34, metalness: 0.04 })
      )
    )
  );
}

function PaintRibbon({ offset = 0, scale = 1, opacity = 0.48 }) {
  const mesh = useRef();
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.6, -0.56 + offset, -0.34),
    new THREE.Vector3(-1.35, 0.34 + offset, 0.20),
    new THREE.Vector3(0.15, -0.04 + offset, -0.10),
    new THREE.Vector3(1.38, 0.36 + offset, 0.24),
    new THREE.Vector3(2.55, -0.18 + offset, -0.22)
  ]), [offset]);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 96, 0.035 * scale, 10, false), [curve, scale]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.45 + offset * 4) * 0.035;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.66 + offset * 5) * 0.045;
  });

  return React.createElement('mesh', { ref: mesh, geometry },
    React.createElement('meshStandardMaterial', { color: '#e50914', roughness: 0.32, metalness: 0.02, transparent: true, opacity })
  );
}

function PaintDust() {
  const points = useRef();
  const positions = useMemo(() => {
    const array = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 5.6;
      array[i * 3 + 1] = (Math.random() - 0.5) * 3.0;
      array[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
    }
    return array;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.018;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.025;
  });

  return React.createElement('points', { ref: points },
    React.createElement('bufferGeometry', null,
      React.createElement('bufferAttribute', { attach: 'attributes-position', count: positions.length / 3, array: positions, itemSize: 3 })
    ),
    React.createElement('pointsMaterial', { color: '#ffffff', size: 0.018, transparent: true, opacity: 0.18, depthWrite: false })
  );
}

function Scene() {
  return React.createElement(Canvas, { shadows: true, dpr: [1, 1.8], camera: { position: [0, 0.25, 5.2], fov: 39 }, gl: { antialias: true, alpha: true, powerPreference: 'high-performance' } },
    React.createElement('ambientLight', { intensity: 0.92 }),
    React.createElement('directionalLight', { position: [-3, 4, 5], intensity: 2.2, castShadow: true, 'shadow-mapSize': [1024, 1024] }),
    React.createElement('spotLight', { position: [3.5, 4.2, 2.4], intensity: 2.1, angle: 0.42, penumbra: 0.62, color: '#fff4ea', castShadow: true }),
    React.createElement(PresentationControls, { global: true, cursor: true, speed: 1.1, zoom: 0.93, rotation: [0, -0.18, 0], polar: [-0.18, 0.22], azimuth: [-0.35, 0.35] },
      React.createElement(Float, { speed: 1.25, rotationIntensity: 0.13, floatIntensity: 0.30 },
        React.createElement(PaintRibbon, { offset: 0.18, scale: 1.2, opacity: 0.42 }),
        React.createElement(PaintRibbon, { offset: -0.18, scale: 0.82, opacity: 0.30 }),
        React.createElement(PaintRoller, null)
      )
    ),
    React.createElement(PaintDust, null),
    React.createElement(ContactShadows, { position: [0, -1.32, 0], opacity: 0.32, scale: 7, blur: 2.8, far: 3.2 }),
    React.createElement(Environment, { preset: 'studio' })
  );
}

function initLenis() {
  if (window.__deflorioLenis) return;
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.88, touchMultiplier: 1.05 });
  window.__deflorioLenis = lenis;
  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

function animateHero() {
  const scope = document.querySelector('.three-hero');
  if (!scope) return;
  const items = scope.querySelectorAll('.three-hero-kicker, .three-hero-copy h1, .three-hero-copy p, .three-hero-actions, .trust-metrics');
  gsap.set(items, { y: 34, autoAlpha: 0 });
  gsap.set('.three-hero-scene', { x: 90, autoAlpha: 0, scale: 0.96 });
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .to(items, { y: 0, autoAlpha: 1, duration: 1.05, stagger: 0.09 }, 0.14)
    .to('.three-hero-scene', { x: 0, autoAlpha: 1, scale: 1, duration: 1.45 }, 0.18);
}

function initMagneticButtons() {
  document.querySelectorAll('.magnetic-cta').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(button, { x: x * 0.16, y: y * 0.22, scale: 1.025, duration: 0.45, ease: 'power4.out' });
    });
    button.addEventListener('pointerleave', () => gsap.to(button, { x: 0, y: 0, scale: 1, duration: 0.62, ease: 'elastic.out(1, 0.42)' }));
  });
}

const mount = document.getElementById('hero-three-root');
if (mount) {
  initLenis();
  createRoot(mount).render(React.createElement(Scene));
  requestAnimationFrame(() => {
    animateHero();
    initMagneticButtons();
  });
}
