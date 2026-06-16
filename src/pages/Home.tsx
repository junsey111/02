import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

/* =========================================================
   抽象漂浮门户 —— itomdev 的中央核心
   ========================================================= */
function Portal() {
  const group = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
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
      group.current.rotation.y += dt * 0.15;
      group.current.rotation.x = mouseRef.current.y * 0.3;
      group.current.position.y = 0.4 + Math.sin(Date.now() / 1600) * 0.2;
    }
    if (outer.current) outer.current.rotation.y -= dt * 0.18;
    if (core.current) {
      core.current.rotation.y += dt * 0.4;
      core.current.rotation.x += dt * 0.2;
      const s = 1 + Math.sin(Date.now() / 500) * 0.1;
      core.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      {/* 外八面体 —— 深色金属感 */}
      <mesh ref={outer}>
        <octahedronGeometry args={[3, 0]} />
        <meshStandardMaterial
          color="#1a1a24"
          metalness={0.85}
          roughness={0.18}
          emissive="#c74c1c"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* 中间线框立方体 */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#f4efe6" wireframe transparent opacity={0.4} />
      </mesh>
      {/* 内核多面体 */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.6}>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial
            color="#c74c1c"
            emissive="#c74c1c"
            emissiveIntensity={2.2}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      </Float>
      {/* 环绕的 24 颗小星点 */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = 3.8 + Math.sin(i) * 0.4;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * r,
              Math.sin(i * 0.7) * 1.4,
              Math.sin(angle) * r,
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? '#c74c1c' : '#f4efe6'}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
      {/* 底部光晕环 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
        <ringGeometry args={[1.8, 2.6, 64]} />
        <meshBasicMaterial color="#c74c1c" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <pointLight color="#c74c1c" intensity={3.5} distance={14} />
      <pointLight color="#f4efe6" intensity={1.4} distance={8} position={[2.5, 1.5, 1.5]} />
    </group>
  );
}

/* 远景漂浮几何体 + 滚动位移 */
function BackShapes() {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = Date.now() / 8000;
    }
  });

  return (
    <group ref={ref}>
      {[
        { p: [-9, 3, -8], s: 0.6, c: '#1f3a2e', w: true },
        { p: [10, 4, -5], s: 0.9, c: '#c74c1c', w: true },
        { p: [-7, -3, -10], s: 0.5, c: '#f4efe6', w: true },
        { p: [8, -2, -12], s: 0.7, c: '#1f3a2e', w: true },
        { p: [0, 5, -18], s: 1.4, c: '#c74c1c', w: true },
        { p: [-12, 0, -20], s: 0.8, c: '#f4efe6', w: true },
      ].map((obj, i) => (
        <Float key={i} speed={0.4 + i * 0.05} rotationIntensity={0.5} floatIntensity={0.6}>
          <mesh position={obj.p as any} scale={obj.s}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={obj.c} wireframe transparent opacity={0.55} />
          </mesh>
        </Float>
      ))}
      {/* 地平线 */}
      <mesh position={[0, -3, -18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 0.12]} />
        <meshBasicMaterial color="#c74c1c" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/* =========================================================
   首页
   ========================================================= */
export default function Home() {
  return (
    <div className="min-h-screen bg-ink text-bone">
      {/* 全屏 3D Canvas 作为背景 */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 1, 8], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#0a0a0a']} />
          <fog attach="fog" args={['#0a0a0a', 6, 22]} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 5, 5]} intensity={0.7} color="#f4efe6" />
          <directionalLight position={[-5, 2, -5]} intensity={0.5} color="#c74c1c" />

          <BackShapes />
          <Portal />
        </Canvas>
      </div>

      {/* 噪点 */}
      <div className="noise-overlay" />

      {/* ========== Hero 文字叠层 ========== */}
      <section className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-between px-6 py-10 md:px-14">
        {/* 左上角 —— 编号标签 */}
        <div className="flex items-start justify-between text-[11px] uppercase tracking-[0.3em] text-bone/60">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-ember" />
            <span>Portfolio · 2025</span>
          </div>
          <div>Based in Shanghai</div>
        </div>

        {/* 中间大标语 */}
        <div className="mt-12">
          <p className="font-serif text-[44px] leading-[0.95] tracking-tight md:text-[9vw] md:leading-[0.9]">
            <span className="block text-bone">
              用设计,做一件
            </span>
            <span className="block italic text-ember">
              能被认真看完的事。
            </span>
          </p>
          <p className="mt-10 max-w-lg text-bone/70 md:text-lg">
            我是 俊西 · 一个独立设计师。<br />
            专注品牌视觉、编辑出版与网页设计。
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link to="/gallery" className="btn-ember">
              进入作品空间 →
            </Link>
            <a href="#scroll" className="btn-line">
              向下滑动
            </a>
          </div>
        </div>

        {/* 底部 —— 左右两端文字 */}
        <div className="mt-16 flex items-end justify-between text-[11px] uppercase tracking-[0.3em] text-bone/50">
          <span>No. 001 — Junxi Studio</span>
          <span>Move your cursor · 移动鼠标试试</span>
          <span>v 1.0</span>
        </div>
      </section>

      {/* ========== 第二屏 —— 三道门户入口 ========== */}
      <section id="scroll" className="relative z-10 mx-auto max-w-[1600px] px-6 py-24 md:px-14">
        <div className="mb-16 text-bone/60">
          <p className="text-xs uppercase tracking-[0.3em]">
            Three rooms — 三个房间
          </p>
          <p className="mt-4 font-serif text-4xl text-bone md:text-6xl">
            选择一扇门, <span className="italic text-ember">走进去。</span>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Gallery 门 */}
          <Link
            to="/gallery"
            data-cursor-hover
            className="group relative aspect-[3/4] overflow-hidden rounded-sm border border-line bg-transparent transition-all hover:border-ember"
          >
            {/* 门的 3D 视觉:一个发光方块 */}
            <CanvasPortal color="#c74c1c" />
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6">
              <span className="text-[11px] uppercase tracking-[0.3em] text-bone/70">01 / Gallery</span>
              <div>
                <p className="font-serif text-4xl text-bone md:text-5xl">作品厅</p>
                <p className="mt-3 text-sm text-bone/60">Selected works · 2021 — 2025</p>
              </div>
              <span className="self-end text-sm text-ember transition-transform group-hover:translate-x-2">→ 进入</span>
            </div>
          </Link>

          {/* Studio 门 */}
          <Link
            to="/studio"
            data-cursor-hover
            className="group relative aspect-[3/4] overflow-hidden rounded-sm border border-line bg-transparent transition-all hover:border-forest"
          >
            <CanvasPortal color="#1f3a2e" />
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6">
              <span className="text-[11px] uppercase tracking-[0.3em] text-bone/70">02 / Studio</span>
              <div>
                <p className="font-serif text-4xl text-bone md:text-5xl">工作室</p>
                <p className="mt-3 text-sm text-bone/60">About the designer</p>
              </div>
              <span className="self-end text-sm text-forest transition-transform group-hover:translate-x-2">→ 进入</span>
            </div>
          </Link>

          {/* Contact 门 */}
          <Link
            to="/contact"
            data-cursor-hover
            className="group relative aspect-[3/4] overflow-hidden rounded-sm border border-line bg-transparent transition-all hover:border-bone"
          >
            <CanvasPortal color="#f4efe6" />
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6">
              <span className="text-[11px] uppercase tracking-[0.3em] text-bone/70">03 / Contact</span>
              <div>
                <p className="font-serif text-4xl text-bone md:text-5xl">会客厅</p>
                <p className="mt-3 text-sm text-bone/60">Say hello</p>
              </div>
              <span className="self-end text-sm text-bone/80 transition-transform group-hover:translate-x-2">→ 进入</span>
            </div>
          </Link>
        </div>

        {/* 底部引语 */}
        <p className="mx-auto mt-24 max-w-3xl text-center font-serif text-2xl italic leading-snug text-bone/70 md:text-4xl">
          “ 做慢一点, 做深一点 —— <br /> 剩下的,交给注视的人。 ”
        </p>
      </section>

      {/* ========== 尾页 ========== */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 pb-20 md:px-14">
        <div className="flex flex-col items-center gap-6 border-t border-line pt-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-bone/50">Junxi Studio · 2025</p>
          <p className="font-serif text-5xl text-bone md:text-7xl">See you inside.</p>
          <p className="text-sm text-bone/50">希望我们在某个房间里见面。</p>
        </div>
      </section>
    </div>
  );
}

/* 每个"门"里的小 Canvas —— 一张自绘 Canvas 2D 图案 */
function CanvasPortal({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    let raf = 0;
    const draw = () => {
      t += 0.01;
      const w = canvas.width;
      const h = canvas.height;
      // 黑底
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, w, h);

      // 辐射渐变
      const cx = w / 2 + Math.sin(t) * w * 0.03;
      const cy = h / 2 + Math.cos(t * 0.8) * h * 0.03;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
      grad.addColorStop(0, color);
      grad.addColorStop(0.4, color + '55');
      grad.addColorStop(1, '#000');
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      // 中央几何线 —— 三层同心旋转矩形
      for (let i = 0; i < 4; i++) {
        const rot = t * (i % 2 === 0 ? 1 : -1) + i;
        const size = (i + 1) * 50 * dpr;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.strokeStyle = i === 2 ? '#f4efe6' : color;
        ctx.lineWidth = 1.2 * dpr;
        ctx.globalAlpha = 0.35 + i * 0.1;
        ctx.strokeRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      }
      // 中心小圆
      ctx.beginPath();
      ctx.arc(cx, cy, 12 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;

      // 噪点
      const img = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < img.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 22;
        img.data[i] = Math.max(0, Math.min(255, img.data[i] + n));
        img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n));
        img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n));
      }
      ctx.putImageData(img, 0, 0);

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [color]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
