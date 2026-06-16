import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';

/* =========================================================
   抽象漂浮几何体 —— itomdev 的中央"门户"
   一个多层嵌套的透明多面体 + 内核发光球
   ========================================================= */
function PortalShape() {
  const group = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);

  // 鼠标位置影响物体倾斜
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, dt) => {
    // 鼠标平滑跟随
    mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;

    if (group.current) {
      group.current.rotation.y += dt * 0.15;
      group.current.rotation.x = mouseRef.current.y * 0.25;
      group.current.position.y = 0.5 + Math.sin(Date.now() / 1600) * 0.25;
    }
    if (outer.current) outer.current.rotation.y -= dt * 0.1;
    if (inner.current) inner.current.rotation.y += dt * 0.3;
    if (core.current) {
      const s = 1 + Math.sin(Date.now() / 500) * 0.08;
      core.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      {/* 外壳 —— 大八面体,玻璃感 */}
      <mesh ref={outer}>
        <octahedronGeometry args={[2.8, 0]} />
        <meshPhysicalMaterial
          color="#1a1a22"
          metalness={0.7}
          roughness={0.15}
          transmission={0.85}
          thickness={0.5}
          ior={1.4}
          emissive="#c74c1c"
          emissiveIntensity={0.08}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* 中壳 —— 扭立方体线框 */}
      <mesh ref={inner}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshBasicMaterial
          color="#f4efe6"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
      {/* 内核发光球 */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.6}>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshBasicMaterial
            color="#c74c1c"
            transparent
            opacity={0.75}
          />
        </mesh>
      </Float>
      {/* 内核的光源 */}
      <pointLight color="#c74c1c" intensity={3} distance={12} />
      <pointLight color="#f4efe6" intensity={1.5} distance={6} position={[2, 1, 1]} />

      {/* 环绕小粒子 */}
      {Array.from({ length: 28 }).map((_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const r = 3.4 + Math.sin(i) * 0.4;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * r,
              Math.sin(i * 0.7) * 1.4,
              Math.sin(angle) * r,
            ]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? '#c74c1c' : '#f4efe6'}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}

      {/* 底部光晕环 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <ringGeometry args={[1.6, 2.4, 64]} />
        <meshBasicMaterial
          color="#c74c1c"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* 远景的漂浮小几何,增加深度感 */
function BackgroundShapes() {
  return (
    <group>
      {/* 几颗远处漂浮的小多面体 */}
      {[
        { p: [-8, 2, -6], s: 0.6, c: '#1f3a2e' },
        { p: [9, 3, -4], s: 0.8, c: '#c74c1c' },
        { p: [-6, -3, -8], s: 0.5, c: '#f4efe6' },
        { p: [7, -2, -10], s: 0.7, c: '#1f3a2e' },
        { p: [0, 4, -14], s: 1.2, c: '#c74c1c' },
      ].map((obj, i) => (
        <Float key={i} speed={0.6 + i * 0.1} rotationIntensity={0.6} floatIntensity={0.8}>
          <mesh position={obj.p as any} scale={obj.s}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={obj.c} wireframe transparent opacity={0.65} />
          </mesh>
        </Float>
      ))}

      {/* 一条远景线 */}
      <mesh position={[0, -2.8, -15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 0.08]} />
        <meshBasicMaterial color="#c74c1c" transparent opacity={0.35} />
      </mesh>

      {/* scroll 联动 — 不直接写进组件, 这里只渲染提示 */}
    </group>
  );
}

export default function ItomHero() {
  return (
    <group>
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 6, 20]} />

      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#f4efe6" />
      <directionalLight position={[-5, 2, -5]} intensity={0.4} color="#c74c1c" />

      <BackgroundShapes />
      <PortalShape />
    </group>
  );
}
