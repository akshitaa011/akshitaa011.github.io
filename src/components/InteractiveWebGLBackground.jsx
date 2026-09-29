import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function InteractiveWebGLBackground({ enabled = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    let animationFrameId;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f17, 0.035);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, -14, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Geometry: High-resolution undulating 3D grid plane
    const planeWidth = 52;
    const planeHeight = 44;
    const segmentsX = 64;
    const segmentsY = 56;

    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segmentsX, segmentsY);
    const count = geometry.attributes.position.count;

    // Save base positions
    const originalPositions = new Float32Array(count * 3);
    const posAttr = geometry.attributes.position;
    for (let i = 0; i < count * 3; i++) {
      originalPositions[i] = posAttr.array[i];
    }

    // Material with soft cyan/emerald luminescence
    const material = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.12;
    scene.add(mesh);

    // Complementary Points Cloud for cosmic sparkle depth
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.12,
      transparent: true,
      opacity: 0.45,
    });
    const pointsMesh = new THREE.Points(geometry, pointsMaterial);
    pointsMesh.rotation.x = -Math.PI * 0.12;
    scene.add(pointsMesh);

    // 3. Mouse Interaction & Spring Easing
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 14;
      mouse.targetY = y * 10;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 4. Animation Loop with Organic Sine Distortions
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const positions = geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];

        // Wave formula with multiple frequency octaves
        const wave1 = Math.sin(x * 0.28 + elapsedTime * 0.9) * 0.65;
        const wave2 = Math.cos(y * 0.32 + elapsedTime * 0.7) * 0.55;
        const wave3 = Math.sin((x + y) * 0.2 + elapsedTime * 0.5) * 0.35;

        // Mouse reactive disturbance: distorts vertices near cursor
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseLift = Math.max(0, 1 - dist / 7.5) * 2.2;

        positions[i3 + 2] = wave1 + wave2 + wave3 + mouseLift;
      }

      geometry.attributes.position.needsUpdate = true;

      // Subtle camera parallax
      camera.position.x += (mouse.x * 0.08 - camera.position.x) * 0.03;
      camera.position.y += (-14 + mouse.y * 0.06 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 5. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      pointsMaterial.dispose();
      renderer.dispose();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    />
  );
}
