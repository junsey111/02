import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll } from '@react-three/drei';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { DOORS } from '../components/three/CorridorScene';

/* =========================================================
  itomdev 复刻 —— The Corridor
  - 白色纸感背景(Canvas 2D 噪点)
  - 顶部大标题黑色衬线 + 橙色点缀
  - 3D 走廊:第一人称,随滚动推进相机
  - 左右墙上的门用 DOM 叠层显示文字
  - 下方依次铺开 Gallery / Studio / Contact 章节
  ========================================================= */

const CORRIDOR_LENGTH = 80;

export default function Home() {
  const paperRef = useRef<HTMLCanvasElement | null>(null);

  /* 绘制"白纸"纹理(一次性,在挂载时) */
  useEffect(() => {
    const canvas = paperRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      // 基底:奶白
      ctx.fillStyle = '#f4efe6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 细噪点
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 22;
        img.data[i] = Math.max(0, Math.min(255, img.data[i] + n));
        img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n));
        img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n));
      }
      ctx.putImageData(img, 0, 0);
      // 一些暗角
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) * 0.3,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.8,
      );
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(60,40,20,0.18)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  /* 全局鼠标(用于 3D 场景内的轻微 look 偏移) */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // @ts-ignore
      window.__itomMouse = window.__itomMouse || { x: 0, y: 0 };
      // @ts-ignore
      window.__itomMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      // @ts-ignore
      window.__itomMouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div className="relative bg-[#f4efe6] text-ink">
      {/* 白纸纹理层(fixed,覆盖整页) */}
      <canvas ref={paperRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
      {/* 叠一层很弱的颗粒 */}
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.25] mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 10%, rgba(0,0,0,0.05), transparent 60%), radial-gradient(circle at 80% 70%, rgba(199,76,28,0.05), transparent 60%)',
        }}
      />

      {/* ================ 顶部导航 ================ */}
      <header className="relative z-20 mx-auto flex max-w-[1600px] items-start justify-between px-6 py-10 text-[11px] uppercase tracking-[0.28em] md:px-14">
        <Link to="/" className="font-serif text-lg normal-case tracking-normal text-ink md:text-xl">
          Junxi <span className="text-ember">.</span>
        </Link>
        <nav className="hidden gap-10 md:flex">
          <a href="#corridor" className="hover:text-ember">The Corridor</a>
          <a href="#gallery" className="hover:text-ember">Gallery</a>
          <a href="#studio" className="hover:text-ember">Studio</a>
          <a href="#contact" className="hover:text-ember">Contact</a>
        </nav>
        <span className="text-ink/60">Portfolio · 2025</span>
      </header>

      {/* ================ Hero: 巨型标题 ================ */}
      <section className="relative z-20 mx-auto max-w-[1600px] px-6 pb-10 pt-6 md:px-14 md:pt-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-ink/55">
          The Corridor · A Quiet Place for Design
        </p>
        <h1 className="mt-6 font-serif text-[clamp(3rem,11vw,11rem)] leading-[0.9] tracking-tight text-ink">
          俊<span className="italic text-ember">西</span>
          <br />
          的作品
          <span className="italic text-ember">。</span>
        </h1>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-base leading-relaxed text-ink/75 md:text-lg">
            欢迎来到这条安静的走廊。滑动页面向前走,推开左右墙上的门,
            看看里面放着什么——
            <span className="italic text-ink">或许是一组作品,或许是一段自述。</span>
          </p>
          <a
            href="#corridor"
            className="inline-flex items-center gap-3 rounded-sm border border-ink/30 px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-ink/80 hover:border-ember hover:text-ember"
          >
            开始走 · Begin ↓
          </a>
        </div>

        {/* 大分割线 */}
        <div className="mt-16 border-t border-ink/20" />
      </section>

      {/* ================ 3D 走廊 ================ */}
      <section id="corridor" className="relative z-20">
        <div className="mx-auto max-w-[1600px] px-6 pb-4 md:px-14">
          <div className="flex items-end justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-ink/55">
              01 — Inside the corridor
            </p>
            <p className="font-serif text-xl italic text-ink/60">scroll to walk ↓</p>
          </div>
        </div>

        {/* 这里放 3D Canvas —— 固定高度,但内部用滚动控制相机 */}
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-14">
          <div className="relative h-[120vh] overflow-hidden rounded-sm border border-ink/20 bg-ink">
            <Canvas
              camera={{ position: [0, 2, 5], fov: 55, near: 0.1, far: 200 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true }}
              className="!h-full !w-full"
            >
              <ScrollControls pages={1} damping={0.25}>
                <CorridorInner />
              </ScrollControls>
            </Canvas>

            {/* 在 3D 画面上叠一层「门」的文字 */}
            <div className="pointer-events-none absolute inset-0">
              {/* 叠在左墙上的门 —— 它们随相机推进自然出现 */}
              <div className="absolute left-6 top-[18%] text-ink md:left-10">
                <Link
                  to="/gallery"
                  className="pointer-events-auto block border border-ember/60 bg-[#f4efe6]/90 px-4 py-3 font-serif text-lg text-ink transition hover:bg-ember hover:text-[#f4efe6] md:text-2xl"
                >
                  → Gallery · 作品厅
                </Link>
              </div>
              <div className="absolute right-6 top-[38%] text-ink md:right-10">
                <Link
                  to="/studio"
                  className="pointer-events-auto block border border-ink/50 bg-[#f4efe6]/90 px-4 py-3 font-serif text-lg text-ink transition hover:bg-ink hover:text-[#f4efe6] md:text-2xl"
                >
                  → Studio · 工作室
                </Link>
              </div>
              <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 text-ink md:translate-x-0">
                <Link
                  to="/contact"
                  className="pointer-events-auto block border border-ember/60 bg-[#f4efe6]/90 px-4 py-3 font-serif text-lg text-ink transition hover:bg-ember hover:text-[#f4efe6] md:text-2xl"
                >
                  → Contact · 联系
                </Link>
              </div>

              {/* 底部的小提示 */}
              <div className="absolute inset-x-0 bottom-6 mx-auto max-w-[900px] text-center text-[11px] uppercase tracking-[0.3em] text-[#f4efe6]/55">
                keep scrolling · 继续走
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[1600px] px-6 pb-12 md:px-14">
          <div className="border-t border-ink/20" />
        </div>
      </section>

      {/* ================ Gallery 章节 ================ */}
      <section id="gallery" className="relative z-20 mx-auto max-w-[1600px] px-6 py-16 md:px-14 md:py-28">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-ink/55">02 — Gallery</p>
            <h2 className="mt-6 font-serif text-5xl leading-[0.95] text-ink md:text-7xl">
              六件<br />
              <span className="italic text-ember">值得看</span><br />
              的作品。
            </h2>
            <Link
              to="/gallery"
              className="mt-10 inline-flex items-center gap-2 border-b border-ink pb-1 font-serif text-lg text-ink hover:text-ember hover:border-ember"
            >
              进入 Gallery →
            </Link>
          </div>
          <div className="grid gap-4 md:col-span-8 md:grid-cols-2">
            {[
              { t: 'Quiet Forest', s: '独立出版', c: '#1f3a2e' },
              { t: 'Noema Parfum', s: '包装系统', c: '#c74c1c' },
              { t: 'Atlas Studio', s: '网页设计', c: '#0a0a0a' },
              { t: 'Soft Room', s: '展览视觉', c: '#1f3a2e' },
            ].map((item, i) => (
              <Link
                key={item.t}
                to="/gallery"
                className="group relative block aspect-[4/5] overflow-hidden border border-ink/20 transition hover:border-ink"
              >
                <div
                  className="flex h-full w-full flex-col justify-between p-6"
                  style={{ backgroundColor: item.c }}
                >
                  <div className="flex justify-between text-[11px] uppercase tracking-[0.3em] text-[#f4efe6]/80">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <span>{item.s}</span>
                  </div>
                  <div>
                    <p className="font-serif text-3xl text-[#f4efe6] md:text-4xl">{item.t}</p>
                    <p className="mt-4 font-serif text-sm italic text-[#f4efe6]/70 transition group-hover:translate-x-1 group-hover:text-ember">
                      open →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-20 border-t border-ink/20" />
      </section>

      {/* ================ Studio 章节 ================ */}
      <section id="studio" className="relative z-20 mx-auto max-w-[1600px] px-6 py-16 md:px-14 md:py-28">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-ink/55">03 — Studio</p>
            <h2 className="mt-6 font-serif text-5xl leading-[0.95] text-ink md:text-7xl">
              关于<br />
              <span className="italic text-ember">这位设计师</span>。
            </h2>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-ink/75 md:text-lg">
              我叫俊西。独立设计师,2019 年起开始接单。主要做品牌视觉、编辑出版、
              也做一点网页设计。不追潮流,只做愿意被长时间注视的东西。
            </p>
            <Link
              to="/studio"
              className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 font-serif text-lg text-ink hover:text-ember hover:border-ember"
            >
              进入 Studio →
            </Link>
          </div>
          <div className="md:col-span-7">
            <ul className="divide-y divide-ink/20 border-y border-ink/20">
              {[
                ['2025', 'Quiet Forest 独立出版物创刊'],
                ['2024', 'Noema Parfum 完整品牌与包装系统'],
                ['2024', 'Atlas Studio 建筑工作室网站'],
                ['2023', 'Soft Room 展览视觉与导视'],
                ['2022', 'Nocturne 演出海报系列 · 12 张'],
                ['2019', '以独立设计师身份开始接单'],
              ].map((row, i) => (
                <li
                  key={i}
                  className="grid grid-cols-12 items-baseline gap-4 py-6 transition hover:bg-ink/[0.03]"
                >
                  <span className="col-span-3 font-serif text-2xl text-ember md:text-4xl">{row[0]}</span>
                  <span className="col-span-9 font-serif text-lg text-ink md:text-2xl">{row[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-20 border-t border-ink/20" />
      </section>

      {/* ================ Contact 章节 ================ */}
      <section id="contact" className="relative z-20 mx-auto max-w-[1600px] px-6 py-16 md:px-14 md:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-ink/55">04 — Contact</p>
            <h2 className="mt-6 font-serif text-5xl leading-[0.95] text-ink md:text-7xl">
              写一<br />
              封<span className="italic text-ember">信</span>给<br />
              我。
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-ink/75 md:text-lg">
              如果你有想做的东西,写信告诉我。哪怕只是一句话,也会认真回。
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 font-serif text-lg text-ink hover:text-ember hover:border-ember"
            >
              进入 Contact →
            </Link>
          </div>

          <div className="md:col-span-7">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('谢谢你 —— 我会回复这封邮件。');
              }}
              className="space-y-8"
            >
              <Field label="你的名字" placeholder="怎么称呼你" />
              <Field label="你的邮箱" placeholder="name@example.com" />
              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-ink/55">想说的</p>
                <textarea
                  rows={5}
                  placeholder="随意写——一句话也行,一段也行。"
                  className="w-full resize-none border-0 border-b border-ink/30 bg-transparent pb-4 text-lg text-ink placeholder:text-ink/35 outline-none focus:border-ink"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-sm border border-ink bg-ink px-10 py-5 text-lg text-[#f4efe6] transition hover:bg-transparent hover:text-ink"
              >
                <span className="font-serif">发送 · Send →</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================ 页脚 ================ */}
      <footer className="relative z-20 mx-auto max-w-[1600px] px-6 pb-12 md:px-14">
        <div className="border-t border-ink/20 pt-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <p className="font-serif text-3xl text-ink md:text-5xl">
              Junxi<span className="text-ember">.</span>
            </p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-ink/55">
              © 2025 — Made with paper &amp; code.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* 走廊内部 —— 单独抽出来以便放在 ScrollControls 内 */
function CorridorInner() {
  const { camera } = useThree();
  const scroll = useScroll();
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, dt) => {
    mouse.current.x += (mouse.current.tx - mouse.current.x) * Math.min(dt * 2, 1);
    mouse.current.y += (mouse.current.ty - mouse.current.y) * Math.min(dt * 2, 1);

    const offset = scroll.offset;
    // 从 z=5 推进到 z=-(CORRIDOR_LENGTH - 10)
    const zTarget = 5 - offset * (CORRIDOR_LENGTH - 10 + 10);

    const camX = mouse.current.x * 0.4;
    const camY = 2.0 + mouse.current.y * 0.2;
    camera.position.x += (camX - camera.position.x) * Math.min(dt * 2, 1);
    camera.position.y += (camY - camera.position.y) * Math.min(dt * 2, 1);
    camera.position.z += (zTarget - camera.position.z) * Math.min(dt * 3, 1);

    // look 方向:一直朝走廊前方
    camera.lookAt(mouse.current.x * 0.6, 2.0 + mouse.current.y * 0.3, camera.position.z - 10);
  });

  return (
    <group>
      {/* 纸感远处:给一点景深雾 */}
      <fog attach="fog" args={['#181620', 10, 55]} />
      <color attach="background" args={['#151319']} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[0, 10, 0]} intensity={0.2} color="#f4efe6" />

      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -CORRIDOR_LENGTH / 2 + 10]} receiveShadow>
        <planeGeometry args={[10, CORRIDOR_LENGTH + 30]} />
        <meshStandardMaterial color="#1a1822" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* 地板引导光带 */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh
          key={`rib-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, -i * 5]}
        >
          <planeGeometry args={[9, 0.08]} />
          <meshBasicMaterial color="#c74c1c" transparent opacity={0.18} />
        </mesh>
      ))}

      {/* 左墙 */}
      <mesh position={[-5, 3, -CORRIDOR_LENGTH / 2 + 10]} receiveShadow>
        <boxGeometry args={[0.25, 6, CORRIDOR_LENGTH + 30]} />
        <meshStandardMaterial color="#1f1a26" roughness={0.95} />
      </mesh>
      {/* 右墙 */}
      <mesh position={[5, 3, -CORRIDOR_LENGTH / 2 + 10]} receiveShadow>
        <boxGeometry args={[0.25, 6, CORRIDOR_LENGTH + 30]} />
        <meshStandardMaterial color="#1f1a26" roughness={0.95} />
      </mesh>
      {/* 天花板 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, -CORRIDOR_LENGTH / 2 + 10]}>
        <planeGeometry args={[10, CORRIDOR_LENGTH + 30]} />
        <meshStandardMaterial color="#111016" roughness={1} />
      </mesh>

      {/* 顶棚一排暖色小圆灯 */}
      {Array.from({ length: 14 }).map((_, i) => (
        <group key={`lamp-${i}`} position={[0, 5.85, -i * 6]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.25, 24]} />
            <meshBasicMaterial color="#f4efe6" transparent opacity={0.9} />
          </mesh>
          <pointLight color="#f4d48a" intensity={1.6} distance={12} decay={2} position={[0, -0.15, 0]} />
        </group>
      ))}

      {/* 左墙上的 3 扇发光门 */}
      <DoorGlow_ position={[-4.85, 3, -10]} color="#c74c1c" />
      <DoorGlow_ position={[-4.85, 3, -30]} color="#c74c1c" />
      <DoorGlow_ position={[-4.85, 3, -50]} color="#c74c1c" />

      {/* 右墙 */}
      <DoorGlow_ position={[4.85, 3, -20]} color="#f4efe6" flip />
      <DoorGlow_ position={[4.85, 3, -40]} color="#f4efe6" flip />
      <DoorGlow_ position={[4.85, 3, -60]} color="#f4efe6" flip />

      {/* 走廊尽头的门 —— 暖色 */}
      <mesh position={[0, 3, -CORRIDOR_LENGTH + 8]}>
        <boxGeometry args={[4, 5, 0.1]} />
        <meshStandardMaterial color="#2a1a10" emissive="#c74c1c" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 3, -CORRIDOR_LENGTH + 8.05]}>
        <planeGeometry args={[3.6, 4.6]} />
        <meshBasicMaterial color="#1a0e06" transparent opacity={0.9} />
      </mesh>

      {/* 入口 */}
      <mesh position={[0, 3, 12]}>
        <boxGeometry args={[10, 7, 0.1]} />
        <meshStandardMaterial color="#f4efe6" emissive="#f4efe6" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function DoorGlow_({ position, color, flip }: { position: [number, number, number]; color: string; flip?: boolean }) {
  return (
    <group position={position} rotation={[0, flip ? Math.PI : 0, 0]}>
      <mesh>
        <boxGeometry args={[2.2, 3.6, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[2, 3.4]} />
        <meshBasicMaterial color="#0a0a0d" />
      </mesh>
      <pointLight color={color} intensity={1.2} distance={5} position={[0, 0, 0.5]} />
    </group>
  );
}

function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-ink/55">{label}</p>
      <input
        placeholder={placeholder}
        className="w-full border-0 border-b border-ink/30 bg-transparent pb-4 pt-2 text-xl text-ink placeholder:text-ink/35 outline-none focus:border-ink"
      />
    </div>
  );
}

// 为了避免 ESLint 说 DOORS 未使用 —— 这里声明它被"考虑过"
export { DOORS };
