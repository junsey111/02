import { Canvas } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { BigFloatShape, BackgroundDebris } from '../components/three/SceneShell';

/* ========= 单个项目 —— 一张会动的海报 ========= */
function ProjectCard({
  index,
  title,
  subtitle,
  year,
  category,
  color,
}: {
  index: number;
  title: string;
  subtitle: string;
  year: string;
  category: string;
  color: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t = Math.random() * 10;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.008;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, w, h);

      // 辐射渐变
      const cx = w / 2 + Math.sin(t * 1.3) * w * 0.08;
      const cy = h / 2 + Math.cos(t * 0.9) * h * 0.08;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.65);
      grad.addColorStop(0, color);
      grad.addColorStop(0.35, color + '55');
      grad.addColorStop(1, '#000');
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      // 一组旋转矩形
      for (let i = 0; i < 5; i++) {
        const rot = t * (i % 2 === 0 ? 1 : -1) + i;
        const size = (i + 1) * 70 * dpr;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.strokeStyle = i === 2 ? '#f4efe6' : color;
        ctx.lineWidth = 1.2 * dpr;
        ctx.globalAlpha = 0.25 + i * 0.12;
        ctx.strokeRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      }
      // 中心圆
      ctx.beginPath();
      ctx.arc(cx, cy, 20 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;

      // 噪点
      const img = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < img.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 28;
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

  return (
    <div
      data-cursor-hover
      className="group relative block aspect-[4/5] overflow-hidden rounded-sm border border-line bg-transparent transition-all hover:border-bone"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between text-[11px] uppercase tracking-[0.3em] text-bone/70">
          <span>{String(index).padStart(2, '0')} / {category}</span>
          <span>{year}</span>
        </div>

        <div>
          <p className="font-serif text-4xl text-bone md:text-5xl">{title}</p>
          <p className="mt-3 text-sm text-bone/60">{subtitle}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-bone/50">View project</span>
          <span className="text-ember transition-transform group-hover:translate-x-2">→</span>
        </div>
      </div>
    </div>
  );
}

/* ============= 项目列表 ============= */
const projects = [
  { title: 'Quiet Forest', subtitle: '独立出版 · 品牌 & 版式', year: '2025', category: 'Editorial', color: '#c74c1c' },
  { title: 'Noema Parfum', subtitle: '概念香氛 · 包装系统', year: '2024', category: 'Packaging', color: '#1f3a2e' },
  { title: 'Atlas Studio', subtitle: '建筑工作室 · 网站', year: '2024', category: 'Web', color: '#c74c1c' },
  { title: 'Echoes', subtitle: '插画系列 · 自发起', year: '2023', category: 'Illustration', color: '#1f3a2e' },
  { title: 'Soft Room', subtitle: '展览视觉 · 导视', year: '2023', category: 'Exhibition', color: '#f4efe6' },
  { title: 'Nocturne', subtitle: '演出海报 · 系列', year: '2022', category: 'Poster', color: '#c74c1c' },
];

/* ============= 页面 ============= */
export default function Gallery() {
  const [, forceRerender] = useState(0);
  useEffect(() => {
    // 小 hack:确保 Canvas 正常挂载后再绘制一次
    const id = window.setTimeout(() => forceRerender((n) => n + 1), 80);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="relative min-h-screen bg-ink text-bone">
      {/* 顶部 3D 大标题 */}
      <div className="pointer-events-none relative h-[80vh] w-full overflow-hidden">
        <Canvas
          camera={{ position: [0, 0.5, 8], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#0a0a0a']} />
          <fog attach="fog" args={['#0a0a0a', 6, 22]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#f4efe6" />
          <directionalLight position={[-5, 2, -5]} intensity={0.5} color="#c74c1c" />
          <BackgroundDebris color="#c74c1c" />
          <BigFloatShape color="#c74c1c" geometry="icosa" size={2.4} />
        </Canvas>

        {/* 噪点 */}
        <div className="noise-overlay" />

        {/* 页头信息 */}
        <div className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-[1600px] items-start justify-between px-6 pt-10 text-[11px] uppercase tracking-[0.3em] text-bone/60 md:px-14">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-ember" />
            <span>01 · Gallery</span>
          </div>
          <Link to="/" className="hover:text-ember">← 返回大厅</Link>
        </div>

        {/* 居中大标题 */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-bone/60">Selected Works · 2021 — 2025</p>
          <h1 className="mt-6 font-serif text-[16vw] leading-[0.9] tracking-tight text-bone md:text-[11vw]">
            作品 <span className="italic text-ember">厅</span>
          </h1>
          <p className="mt-8 max-w-xl text-bone/60">六个被选出来的项目 —— 它们被认真看待过, 现在也希望被认真看完。</p>
        </div>

        {/* 底部标识 */}
        <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-[1600px] items-end justify-between px-6 text-[11px] uppercase tracking-[0.3em] text-bone/50 md:px-14">
          <span>Scroll ↓</span>
          <span>Junxi · Studio</span>
          <span>06 projects</span>
        </div>
      </div>

      {/* ============= 项目栅格 ============= */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 py-20 md:px-14">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-bone/60">Index · 目录</p>
            <p className="mt-4 font-serif text-4xl text-bone md:text-6xl">
              六个<span className="italic text-ember"> 作品。</span>
            </p>
          </div>
          <a href="#scroll" className="hidden md:block text-sm text-bone/50 hover:text-ember">
            向下 ↓
          </a>
        </div>

        <div id="scroll" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} index={i + 1} {...p} />
          ))}
        </div>

        {/* 底部引语 */}
        <p className="mx-auto mt-24 max-w-3xl text-center font-serif text-2xl italic leading-snug text-bone/70 md:text-4xl">
          “ 慢一点, 让图案有时间被看见。 ”
        </p>
      </section>

      {/* 底部 */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 pb-20 md:px-14">
        <div className="border-t border-line pt-16 text-center">
          <p className="font-serif text-5xl text-bone md:text-7xl">
            Next — <Link to="/studio" className="italic text-ember hover:underline">Studio →</Link>
          </p>
          <p className="mt-4 text-sm text-bone/50">下一间:关于设计师本人的工作室。</p>
        </div>
      </section>
    </div>
  );
}
