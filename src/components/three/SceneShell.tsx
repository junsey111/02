import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

/* 一个可复用的大标题 3D 形状:旋转的几何体 —— 类似 itomdev 的标志性悬浮物 */
export function BigFloatShape({
  color = '#c74c1c',
  geometry = 'icosa',
  size = 2.2,
}: {
  color?: string;
  geometry?: 'icosa' | 'octa' | 'torus' | 'box';
  size?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Mesh>(null);
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
    mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;
    if (group.current) {
      group.current.rotation.y += dt * 0.25;
      group.current.rotation.x = mouseRef.current.y * 0.4;
    }
    if (outer.current) outer.current.rotation.y -= dt * 0.35;
  });

  const Geo =
    geometry === 'icosa' ? (
      <icosahedronGeometry args={[size, 1]} />
    ) : geometry === 'octa' ? (
      <octahedronGeometry args={[size, 0]} />
    ) : geometry === 'torus' ? (
      <torusGeometry args={[size, size * 0.25, 16, 80]} />
    ) : (
      <boxGeometry args={[size, size, size]} />
    );

  return (
    <group ref={group}>
      {/* 外壳 —— 深色金属 */}
      <mesh ref={outer}>
        {Geo}
        <meshStandardMaterial
          color="#16161d"
          metalness={0.9}
          roughness={0.18}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* 内部发光核心 */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[size * 0.55, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.6}
            metalness={0.4}
            roughness={0.35}
          />
        </mesh>
      </Float>
      {/* 线框套层 */}
      <mesh>
        <boxGeometry args={[size * 1.55, size * 1.55, size * 1.55]} />
        <meshBasicMaterial color="#f4efe6" wireframe transparent opacity={0.25} />
      </mesh>

      {/* 环绕点阵 */}
      {Array.from({ length: 28 }).map((_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const r = size * 1.9 + Math.sin(i) * 0.3;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * r,
              Math.sin(i * 0.7) * size * 0.7,
              Math.sin(angle) * r,
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? color : '#f4efe6'}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}

      {/* 底部光环 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -size * 0.9, 0]}>
        <ringGeometry args={[size * 1.2, size * 1.7, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* 光源 */}
      <pointLight color={color} intensity={4} distance={16} />
      <pointLight color="#f4efe6" intensity={1.4} distance={8} position={[3, 2, 2]} />
    </group>
  );
}

/* 简单的背景漂浮碎片 */
export function BackgroundDebris({ color = '#c74c1c' }: { color?: string }) {
  return (
    <group>
      {[
        { p: [-7, 3.5, -8], s: 0.5 },
        { p: [8, 4, -5], s: 0.7 },
        { p: [-6, -3, -10], s: 0.4 },
        { p: [7, -2, -12], s: 0.6 },
        { p: [0, 5.5, -18], s: 1.1 },
        { p: [-11, 0, -20], s: 0.7 },
      ].map((obj, i) => (
        <Float key={i} speed={0.4 + i * 0.05} rotationIntensity={0.5} floatIntensity={0.6}>
          <mesh position={obj.p as any} scale={obj.s}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
          </mesh>
        </Float>
      ))}
      {/* 地平线 */}
      <mesh position={[0, -3.2, -18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 0.12]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
