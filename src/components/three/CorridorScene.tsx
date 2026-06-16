import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';

/**
 * 第一人称 3D 走廊 —— itomdev 的 "The Corridor"
 * - 一条长度 L 的走廊,两面墙、地板、天花板
 * - 相机沿走廊的 Z 轴推进,由页面滚动控制
 * - 左右墙上各若干扇门,hover 时发光
 */

const CORRIDOR_LENGTH = 80; // 走廊总长度(Z 方向)
const CORRIDOR_WIDTH = 6; // 半宽
const CORRIDOR_HEIGHT = 6;

export function CorridorScene() {
  const { camera } = useThree();
  const scroll = useScroll();
  const target = useRef(new THREE.Vector3(0, 2, 0));
  const mouse = useRef({ x: 0, y: 0 });

  // 鼠标微扰
  if (typeof window !== 'undefined') {
    // 只绑一次 —— 用全局事件委托(在外面已经绑了也行)
  }

  // 把鼠标的移动累积下来(用全局事件)
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__itomMouse = window.__itomMouse || { x: 0, y: 0 };
  }

  useFrame((_, dt) => {
    // 读取全局鼠标
    // @ts-ignore
    const m = window.__itomMouse || { x: 0, y: 0 };
    mouse.current.x += (m.x - mouse.current.x) * Math.min(dt * 2, 1);
    mouse.current.y += (m.y - mouse.current.y) * Math.min(dt * 2, 1);

    // 滚动 → Z 位置(从 -5 推到 -CORRIDOR_LENGTH+10)
    const scrollOffset = scroll.offset;
    const zTarget = -5 - scrollOffset * (CORRIDOR_LENGTH - 10);

    // 相机位置:加入鼠标的轻微晃动
    const camX = mouse.current.x * 0.8;
    const camY = 2.0 + mouse.current.y * 0.3;
    camera.position.x += (camX - camera.position.x) * Math.min(dt * 2, 1);
    camera.position.y += (camY - camera.position.y) * Math.min(dt * 2, 1);
    camera.position.z += (zTarget - camera.position.z) * Math.min(dt * 3, 1);

    // 看向走廊的前方,但加一点鼠标控制的 lookAt 偏移
    target.current.set(mouse.current.x * 1.2, 2.0 + mouse.current.y * 0.4, camera.position.z - 8);
    camera.lookAt(target.current);
  });

  return (
    <group>
      {/* 地板 —— 一张大平面,略带纹理感 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -CORRIDOR_LENGTH / 2]} receiveShadow>
        <planeGeometry args={[CORRIDOR_WIDTH * 2, CORRIDOR_LENGTH + 20]} />
        <meshStandardMaterial color="#0c0c0f" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* 地板上的「引导光带」—— 每隔一段给一条横条,增强纵深 */}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -i * 5 - 3]}>
          <planeGeometry args={[CORRIDOR_WIDTH * 2, 0.08]} />
          <meshBasicMaterial color="#c74c1c" transparent opacity={0.18} />
        </mesh>
      ))}

      {/* 左墙 */}
      <mesh position={[-CORRIDOR_WIDTH, CORRIDOR_HEIGHT / 2, -CORRIDOR_LENGTH / 2]} receiveShadow>
        <boxGeometry args={[0.2, CORRIDOR_HEIGHT, CORRIDOR_LENGTH + 20]} />
        <meshStandardMaterial color="#131317" roughness={0.9} />
      </mesh>

      {/* 右墙 */}
      <mesh position={[CORRIDOR_WIDTH, CORRIDOR_HEIGHT / 2, -CORRIDOR_LENGTH / 2]} receiveShadow>
        <boxGeometry args={[0.2, CORRIDOR_HEIGHT, CORRIDOR_LENGTH + 20]} />
        <meshStandardMaterial color="#131317" roughness={0.9} />
      </mesh>

      {/* 天花板 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CORRIDOR_HEIGHT, -CORRIDOR_LENGTH / 2]}>
        <planeGeometry args={[CORRIDOR_WIDTH * 2, CORRIDOR_LENGTH + 20]} />
        <meshStandardMaterial color="#0a0a0d" roughness={1} />
      </mesh>

      {/* 顶棚的一排灯 —— 暖色小圆盘 */}
      {Array.from({ length: 12 }).map((_, i) => (
        <group key={`lamp-${i}`} position={[0, CORRIDOR_HEIGHT - 0.1, -i * 7 - 3]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.25, 24]} />
            <meshBasicMaterial color="#f4efe6" transparent opacity={0.85} />
          </mesh>
          <pointLight color="#f4d48a" intensity={1.4} distance={10} decay={2} position={[0, -0.1, 0]} />
        </group>
      ))}

      {/* 走廊尽头的门 —— 发橙色微光 */}
      <mesh position={[0, 3, -CORRIDOR_LENGTH + 2]}>
        <boxGeometry args={[3, 5, 0.1]} />
        <meshStandardMaterial color="#2a1a10" emissive="#c74c1c" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 3, -CORRIDOR_LENGTH + 2.02]}>
        <planeGeometry args={[2.6, 4.6]} />
        <meshBasicMaterial color="#1a0e06" transparent opacity={0.9} />
      </mesh>

      {/* 入口 —— 背后开一个大方框,给玩家一点"进入"的感觉 */}
      <mesh position={[0, 3, 8]}>
        <boxGeometry args={[CORRIDOR_WIDTH * 1.8, CORRIDOR_HEIGHT + 2, 0.1]} />
        <meshStandardMaterial color="#f4efe6" emissive="#f4efe6" emissiveIntensity={0.15} />
      </mesh>

      {/* 左墙 3 扇门:Gallery / Studio / 空  */}
      {/* 我们用 CanvasTexture 让门上带文字,但为了简洁先用发光框,文字交给 DOM overlay */}
      <DoorGlow position={[-CORRIDOR_WIDTH + 0.05, 2.5, -10]} color="#c74c1c" />
      <DoorGlow position={[-CORRIDOR_WIDTH + 0.05, 2.5, -25]} color="#c74c1c" />
      <DoorGlow position={[-CORRIDOR_WIDTH + 0.05, 2.5, -40]} color="#c74c1c" />

      {/* 右墙也有 3 扇  */}
      <DoorGlow position={[CORRIDOR_WIDTH - 0.05, 2.5, -15]} color="#f4efe6" flip />
      <DoorGlow position={[CORRIDOR_WIDTH - 0.05, 2.5, -30]} color="#f4efe6" flip />
      <DoorGlow position={[CORRIDOR_WIDTH - 0.05, 2.5, -45]} color="#f4efe6" flip />

      {/* 远处一层雾 */}
      <fog attach="fog" args={['#0c0c0f', 6, 35]} />

      {/* 环境光 */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[0, 10, 0]} intensity={0.2} color="#f4efe6" />
    </group>
  );
}

/* 一扇发光的门 —— 3D 的一个发光平面,文字由 DOM 覆盖 */
function DoorGlow({
  position,
  color,
  flip = false,
}: {
  position: [number, number, number];
  color: string;
  flip?: boolean;
}) {
  return (
    <group position={position} rotation={[0, flip ? Math.PI : 0, 0]}>
      {/* 门框 */}
      <mesh>
        <boxGeometry args={[1.8, 3.2, 0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      {/* 门内暗一点 */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.6, 3]} />
        <meshBasicMaterial color="#0a0a0d" />
      </mesh>
      {/* 细边框 */}
      <mesh position={[0, 0, 0.08]}>
        <ringGeometry args={[0.85, 0.9, 4, 1, 0, Math.PI * 2]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* 门框发光 —— 用一个轻光点 */}
      <pointLight color={color} intensity={1.2} distance={4} position={[0, 0, 0.5]} />
    </group>
  );
}

/* 小工具:用来把 DOM 的大标题与走廊门对齐时,用它算每扇门的世界位置 */
export const DOORS = [
  { id: 'gallery', label: 'Gallery · 作品厅', pos: [-6.05, 2.5, -10] as [number, number, number] },
  { id: 'studio', label: 'Studio · 工作室', pos: [-6.05, 2.5, -25] as [number, number, number] },
  { id: 'contact', label: 'Contact · 联系', pos: [-6.05, 2.5, -40] as [number, number, number] },
];
