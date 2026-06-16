import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sparkles } from '@react-three/drei';
import { useThreeStore, RoomId } from './useThreeStore';

/* ============ 走廊地面与墙面 — 手工造一个长厅 ============ */
function CorridorWalls() {
  return (
    <group>
      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[12, 80]} />
        <meshStandardMaterial color="#141414" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* 地板中央引导光带 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.6, 70]} />
        <meshStandardMaterial
          color="#c74c1c"
          emissive="#c74c1c"
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* 左墙 */}
      <mesh position={[-6, 4, 0]} receiveShadow>
        <boxGeometry args={[0.3, 8, 80]} />
        <meshStandardMaterial color="#0f0f0f" roughness={1} />
      </mesh>
      {/* 右墙 */}
      <mesh position={[6, 4, 0]} receiveShadow>
        <boxGeometry args={[0.3, 8, 80]} />
        <meshStandardMaterial color="#0f0f0f" roughness={1} />
      </mesh>
      {/* 天花 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[12, 80]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} />
      </mesh>
      {/* 尽头背景 */}
      <mesh position={[0, 4, -40]}>
        <boxGeometry args={[12, 8, 0.3]} />
        <meshStandardMaterial color="#111" emissive="#1a0a00" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 4, 40]}>
        <boxGeometry args={[12, 8, 0.3]} />
        <meshStandardMaterial color="#111" emissive="#0a1a12" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

/* 门:悬浮标签 + 可点击发光框 */
function Door({
  position,
  rotation = [0, 0, 0],
  room,
  label,
  index,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  room: RoomId;
  label: string;
  index: number;
}) {
  const enter = useThreeStore((s) => s.enter);
  const mesh = useRef<THREE.Mesh>(null);
  const frame = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);

  useFrame((_, dt) => {
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(Date.now() / 1000 + index) * 0.08;
    }
    if (frame.current) {
      const mat = frame.current.material as THREE.MeshStandardMaterial;
      const target = hover ? 3.5 : 1.2;
      mat.emissiveIntensity += (target - mat.emissiveIntensity) * Math.min(dt * 4, 1);
    }
  });

  return (
    <group position={position} rotation={rotation as any}>
      {/* 门框发光线 */}
      <mesh
        ref={frame}
        position={[0, 0, 0.05]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={() => enter(room)}
      >
        <boxGeometry args={[3, 5, 0.1]} />
        <meshStandardMaterial
          color="#1a1a1a"
          emissive={hover ? '#c74c1c' : '#1a4d3d'}
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* 内部发光 */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[2.6, 4.6]} />
        <meshBasicMaterial
          color={hover ? '#f4efe6' : '#2a2a2a'}
          transparent
          opacity={hover ? 0.9 : 0.25}
        />
      </mesh>
      {/* 标题 */}
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.4}>
        <Text
          position={[0, 3.6, 0.3]}
          fontSize={0.55}
          color="#f4efe6"
          font="https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4.woff2"
        >
          {label}
        </Text>
      </Float>
      {/* 数字 */}
      <Text
        position={[0, -3.3, 0.3]}
        fontSize={0.22}
        color="#8e8a82"
        letterSpacing={0.3}
      >
        0{index}
      </Text>
      {/* 点击提示 */}
      <Text
        position={[0, -3.9, 0.3]}
        fontSize={0.16}
        color={hover ? '#c74c1c' : '#8e8a82'}
        letterSpacing={0.2}
      >
        {hover ? '← 进入 →' : 'click to enter'}
      </Text>
    </group>
  );
}

/* 墙上装饰画(悬浮小方块) */
function WallDecoration() {
  return (
    <group>
      {[-20, -8, 8, 20].map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          {/* 左墙装饰 */}
          <mesh position={[-5.7, 4.5, 0]}>
            <boxGeometry args={[0.1, 1.4, 1.4]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#c74c1c' : '#1f3a2e'}
              emissive={i % 2 === 0 ? '#4a1a00' : '#0a1a12'}
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* 右墙装饰 */}
          <mesh position={[5.7, 4.5, 0]}>
            <boxGeometry args={[0.1, 1.4, 1.4]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#1f3a2e' : '#c74c1c'}
              emissive={i % 2 === 0 ? '#0a1a12' : '#4a1a00'}
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* 顶光 — 每隔一段给个下垂的灯 */
function CeilingLights() {
  return (
    <group>
      {[-30, -15, 0, 15, 30].map((z, i) => (
        <group key={i} position={[0, 7.6, z]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.3, 0.15, 0.4, 16]} />
            <meshStandardMaterial
              color="#f4efe6"
              emissive="#f4efe6"
              emissiveIntensity={1.6}
            />
          </mesh>
          <pointLight
            position={[0, -0.7, 0]}
            color="#f4d48a"
            intensity={2.4}
            distance={14}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}

/* 相机控制 — 通过鼠标位置做缓慢环视 + 随时间缓慢前进 */
function CameraRig() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const target = useRef(new THREE.Vector3(0, 3.5, 5));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, dt) => {
    const now = Date.now() / 1000;
    // 相机在走廊间缓慢前后漂
    const baseZ = 6 + Math.sin(now * 0.15) * 2.5;
    const baseX = mouseRef.current.x * 0.8;
    const baseY = 3.5 + mouseRef.current.y * 0.3;

    camera.position.x += (baseX - camera.position.x) * Math.min(dt * 1.2, 1);
    camera.position.y += (baseY - camera.position.y) * Math.min(dt * 1.2, 1);
    camera.position.z += (baseZ - camera.position.z) * Math.min(dt * 1.2, 1);

    target.current.set(
      -mouseRef.current.x * 1.2,
      3.5 - mouseRef.current.y * 0.3,
      -10 + Math.sin(now * 0.1) * 0.8
    );
    camera.lookAt(target.current);
  });
  return null;
}

export default function CorridorScene() {
  return (
    <group>
      <CameraRig />

      {/* 环境与主光 */}
      <ambientLight intensity={0.15} color="#6e6e8e" />
      <hemisphereLight args={['#2a1a1a', '#0a0a0f', 0.3]} />

      {/* 场景 */}
      <CorridorWalls />
      <CeilingLights />
      <WallDecoration />

      {/* 三扇门: 左/右/ 远端 */}
      <Door position={[-5.7, 3.5, -8]} rotation={[0, Math.PI / 2, 0]} room="gallery" label="Gallery · 作品" index={1} />
      <Door position={[5.7, 3.5, -18]} rotation={[0, -Math.PI / 2, 0]} room="studio" label="Studio · 关于" index={2} />
      <Door position={[0, 3.5, -28]} rotation={[0, 0, 0]} room="contact" label="Contact · 联系" index={3} />

      {/* 灰尘/粒子 */}
      <Sparkles
        count={120}
        scale={[20, 10, 60]}
        size={4}
        speed={0.3}
        color="#f4efe6"
        opacity={0.25}
      />

      {/* 大字 — 悬浮在空中 */}
      <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.6}>
        <Text
          position={[0, 6.5, -38]}
          fontSize={2.2}
          color="#f4efe6"
          font="https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4.woff2"
          letterSpacing={-0.04}
        >
          JUNXI
        </Text>
        <Text
          position={[0, 4.6, -38]}
          fontSize={0.5}
          color="#c74c1c"
          letterSpacing={0.3}
        >
          DESIGNER · 2025
        </Text>
      </Float>

      {/* 入口欢迎词 */}
      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 6.2, 15]}
          fontSize={0.8}
          color="#8e8a82"
          font="https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4.woff2"
        >
          a quiet place for design
        </Text>
      </Float>
    </group>
  );
}
