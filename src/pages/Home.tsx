import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll } from '@react-three/drei';
import { Link } from 'react-router-dom';

/* WebGL 检测 + 优雅降级 */
function useHasWebGL() {
  const [has, set] = (0, useState)(true);
  (0, useEffect)(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) set(false);
    } catch {
      set(false);
    }
  }, []);
  return has;
}

/* ============================================================
   itomdev 完全复刻版 — Home
   视觉完全对齐:
   - 暗色导航栏
   - Hero:大衬线字 + 正文段落
   - 3D 走廊(ScrollControls 推进) + 发光门
   - About/Gallery/Contact:白底黑衬线排版
   ============================================================ */

const CORRIDOR_LEN = 90;

/* ---- 3D 走廊内部 ---- */
function CorridorInner() {
  const { camera } = useThree();
  const scroll = useScroll();
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  useFrame((_, dt) => {
    mouse.current.x += (mouse.current.tx - mouse.current.x) * Math.min(dt * 2, 1);
    mouse.current.y += (mouse.current.ty - mouse.current.y) * Math.min(dt * 2, 1);

    const off = scroll.offset;
    const zT = 5 - off * (CORRIDOR_LEN - 5);
    camera.position.x += (mouse.current.x * 0.35 - camera.position.x) * Math.min(dt * 2, 1);
    camera.position.y += (2.0 + mouse.current.y * 0.15 - camera.position.y) * Math.min(dt * 2, 1);
    camera.position.z += (zT - camera.position.z) * Math.min(dt * 3, 1);
    camera.lookAt(mouse.current.x * 0.5, 2.0 + mouse.current.y * 0.2, camera.position.z - 12);
  });

  return (
    <group>
      <fog attach="fog" args={['#0c0c12', 8, 60]} />
      <color attach="background" args={['#0c0c12']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 10, 0]} intensity={0.15} color="#f4efe6" />

      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -CORRIDOR_LEN / 2 + 5]} receiveShadow>
        <planeGeometry args={[10, CORRIDOR_LEN + 20]} />
        <meshStandardMaterial color="#111118" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* 地板引导线 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`r${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -i * 5]}>
          <planeGeometry args={[9, 0.07]} />
          <meshBasicMaterial color="#c74c1c" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* 左墙 */}
      <mesh position={[-5, 3, -CORRIDOR_LEN / 2 + 5]} receiveShadow>
        <boxGeometry args={[0.2, 6, CORRIDOR_LEN + 20]} />
        <meshStandardMaterial color="#151520" roughness={0.95} />
      </mesh>
      {/* 右墙 */}
      <mesh position={[5, 3, -CORRIDOR_LEN / 2 + 5]} receiveShadow>
        <boxGeometry args={[0.2, 6, CORRIDOR_LEN + 20]} />
        <meshStandardMaterial color="#151520" roughness={0.95} />
      </mesh>
      {/* 天花 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, -CORRIDOR_LEN / 2 + 5]}>
        <planeGeometry args={[10, CORRIDOR_LEN + 20]} />
        <meshStandardMaterial color="#0e0e16" roughness={1} />
      </mesh>

      {/* 顶棚灯 */}
      {Array.from({ length: 16 }).map((_, i) => (
        <group key={`l${i}`} position={[0, 5.85, -i * 6]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.22, 24]} />
            <meshBasicMaterial color="#f4efe6" transparent opacity={0.92} />
          </mesh>
          <pointLight color="#f4d48a" intensity={1.8} distance={13} decay={2} position={[0, -0.2, 0]} />
        </group>
      ))}

      {/* 左墙发光门 */}
      <DoorMesh position={[-4.85, 3, -10]} color="#c74c1c" />
      <DoorMesh position={[-4.85, 3, -35]} color="#c74c1c" />
      <DoorMesh position={[-4.85, 3, -60]} color="#c74c1c" />

      {/* 右墙发光门 */}
      <DoorMesh position={[4.85, 3, -20]} color="#f4efe6" flip />
      <DoorMesh position={[4.85, 3, -45]} color="#f4efe6" flip />
      <DoorMesh position={[4.85, 3, -70]} color="#f4efe6" flip />

      {/* 走廊尽头大门 */}
      <mesh position={[0, 3, -CORRIDOR_LEN + 5]}>
        <boxGeometry args={[4, 5, 0.1]} />
        <meshStandardMaterial color="#1e0e08" emissive="#c74c1c" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 3, -CORRIDOR_LEN + 5.05]}>
        <planeGeometry args={[3.6, 4.6]} />
        <meshBasicMaterial color="#110806" />
      </mesh>

      {/* 入口亮框 */}
      <mesh position={[0, 3, 10]}>
        <boxGeometry args={[10, 7, 0.1]} />
        <meshStandardMaterial color="#f4efe6" emissive="#f4efe6" emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

function DoorMesh({ position, color, flip }: { position: [number, number, number]; color: string; flip?: boolean }) {
  return (
    <group position={position} rotation={[0, flip ? Math.PI : 0, 0]}>
      <mesh>
        <boxGeometry args={[2.0, 3.4, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[1.8, 3.2]} />
        <meshBasicMaterial color="#08080d" />
      </mesh>
      <pointLight color={color} intensity={1.4} distance={5} position={[0, 0, 0.5]} />
    </group>
  );
}

/* ============================================================
   主页面
   ============================================================ */
export default function Home() {
  /* 鼠标追踪 —— 同步到全局,供 CorridorInner 读取 */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      // @ts-ignore
      window.__itomMouse = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  return (
    <div className="bg-[#0c0c12] text-[#f4efe6]">

      {/* ===== 顶部导航栏 ===== */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[#1e1e2a] bg-[#0c0c12]/95 px-6 py-5 backdrop-blur-sm md:px-14">
        <span className="font-serif text-xl text-[#f4efe6] tracking-tight">
          Junxi<span className="text-[#c74c1c]">.</span>
        </span>
        <nav className="hidden items-center gap-10 text-[11px] uppercase tracking-[0.25em] text-[#f4efe6]/60 md:flex">
          <a href="#corridor" className="hover:text-[#c74c1c]">The Corridor</a>
          <a href="#about" className="hover:text-[#c74c1c]">About Me</a>
          <a href="#gallery" className="hover:text-[#c74c1c]">Gallery</a>
          <a href="#contact" className="hover:text-[#c74c1c]">Contact</a>
        </nav>
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#f4efe6]/40">Portfolio · 2025</span>
      </header>

      {/* ===== Hero 大标题 ===== */}
      <section className="relative z-20 mx-auto max-w-[1600px] px-6 pt-36 pb-12 md:px-14 md:pt-44">
        <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#f4efe6]/45">
          The Corridor — A Creative 3D Portfolio
        </p>

        {/* 超大衬线标题 */}
        <h1 className="font-serif text-[clamp(3rem,11vw,11rem)] leading-[0.88] tracking-tight text-[#f4efe6]">
          俊西
          <br />
          <span className="italic text-[#c74c1c]">工作室</span>
        </h1>

        {/* 正文 */}
        <p className="mt-10 max-w-2xl text-base leading-relaxed text-[#f4efe6]/65 md:text-lg">
          欢迎来到这条交互式的数字走廊。我是俊西,一名独立设计师。
          这里不是一张普通的简历,而是一个完全用代码手绘的沉浸式 3D 空间。
          当你进入这条走廊,会看到左右墙上的门——每一扇通向不同的世界:我的作品、我的自述,
          还有联系方式。
        </p>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#f4efe6]/65 md:text-lg">
          我做设计的方式有点像写一封长信——不着急发出去,会反复读,
          让每个字停在合适的位置。对我而言,设计不是解决问题,
          而是让一个想法值得被认真注视。
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <a href="#corridor" className="inline-block border border-[#c74c1c] bg-[#c74c1c] px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-[#0c0c12] transition hover:bg-transparent hover:text-[#c74c1c]">
            进入走廊 ↓
          </a>
          <a href="#about" className="inline-block border border-[#f4efe6]/30 px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-[#f4efe6]/60 transition hover:border-[#f4efe6]/60">
            了解更多
          </a>
        </div>

        <div className="mt-20 border-t border-[#1e1e2a]" />
      </section>

      {/* ===== 3D 走廊区 ===== */}
      <section id="corridor" className="relative z-20">
        <div className="mx-auto max-w-[1600px] px-6 pb-4 md:px-14">
          <div className="flex items-end justify-between text-[11px] uppercase tracking-[0.3em] text-[#f4efe6]/40">
            <span>01 — Experience the Corridor</span>
            <span className="hidden md:block italic text-[#c74c1c]">scroll to walk</span>
          </div>
        </div>

        {/* 3D Canvas + DOM 门叠加 */}
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-14">
          <div className="relative h-[130vh] overflow-hidden border border-[#1e1e2a]">
            {/* WebGL 不可用时的降级 */}
            <CanvasErrorBoundary>
              <Canvas camera={{ position: [0, 2, 5], fov: 55, near: 0.1, far: 300 }} dpr={1} gl={{ antialias: true }}>
                <ScrollControls pages={1} damping={0.25}>
                  <CorridorInner />
                </ScrollControls>
              </Canvas>
            </CanvasErrorBoundary>

            {/* DOM 门文字叠加 */}
            <div className="pointer-events-none absolute inset-0">
              {/* 左墙 Gallery */}
              <div className="absolute left-6 top-[14%] md:left-10">
                <Link to="/gallery" className="pointer-events-auto block border border-[#c74c1c]/70 bg-[#0c0c12]/88 px-5 py-4 font-serif text-lg text-[#f4efe6] transition hover:bg-[#c74c1c] hover:text-[#0c0c12] md:text-2xl">
                  Gallery · 作品厅
                </Link>
              </div>
              {/* 右墙 About */}
              <div className="absolute right-6 top-[36%] md:right-10">
                <Link to="/about" className="pointer-events-auto block border border-[#f4efe6]/50 bg-[#0c0c12]/88 px-5 py-4 font-serif text-lg text-[#f4efe6] transition hover:bg-[#f4efe6] hover:text-[#0c0c12] md:text-2xl">
                  About · 关于
                </Link>
              </div>
              {/* 底部 Contact */}
              <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 md:translate-x-0">
                <Link to="/contact" className="pointer-events-auto block border border-[#c74c1c]/70 bg-[#0c0c12]/88 px-5 py-4 font-serif text-lg text-[#f4efe6] transition hover:bg-[#c74c1c] hover:text-[#0c0c12] md:text-2xl">
                  Contact · 联系
                </Link>
              </div>
              <div className="absolute inset-x-0 bottom-6 mx-auto max-w-[900px] text-center text-[11px] uppercase tracking-[0.3em] text-[#f4efe6]/30">
                keep scrolling · 继续走
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[1600px] px-6 pb-16 md:px-14">
          <div className="border-t border-[#1e1e2a]" />
        </div>
      </section>

      {/* ===== About 章节 ===== */}
      <section id="about" className="relative z-20 bg-[#f4efe6] text-[#1a1a1a]">
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-14 md:py-28">
          <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/45">02 — About Me</p>

          <div className="grid gap-16 md:grid-cols-12">
            {/* 左:大标题 */}
            <div className="md:col-span-5">
              <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-[0.92] tracking-tight text-[#1a1a1a]">
                关于
                <br />
                <span className="italic text-[#c74c1c]">俊西。</span>
              </h2>
              <p className="mt-8 text-base leading-relaxed text-[#1a1a1a]/70 md:text-lg">
                我叫俊西,是一名独立设计师。2019 年开始接单,
                主要在品牌视觉、编辑出版和网页设计三个方向上停留。
              </p>
              <p className="mt-5 text-base leading-relaxed text-[#1a1a1a]/70 md:text-lg">
                我的工作方式有点像写一封信——不着急发出去,
                会反复读,让每个字停在合适的位置。对我而言,
                设计不是解决问题,而是让一个想法值得被看见。
              </p>
              <Link to="/about" className="mt-10 inline-block border-b border-[#1a1a1a] pb-1 font-serif text-lg text-[#1a1a1a] hover:text-[#c74c1c] hover:border-[#c74c1c]">
                完整自述 →
              </Link>
            </div>

            {/* 右:技能/服务 */}
            <div className="md:col-span-6 md:col-start-7">
              <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/45">Services · 可提供的服务</p>
              <ul className="divide-y divide-[#1a1a1a]/20 border-y border-[#1a1a1a]/20">
                {[
                  ['品牌视觉', 'Logo · 字体 · 颜色 · 应用系统'],
                  ['出版与排版', '书籍 · 画册 · 杂志 · 字体选择'],
                  ['网站设计', '品牌站 · 作品集站 · 极简前端'],
                  ['包装设计', '从结构到视觉的整体方案'],
                  ['插画与海报', '编辑性插画 · 概念性海报'],
                  ['展览视觉', '主视觉 · 导视 · 印刷物料'],
                ].map(([t, d]) => (
                  <li key={t} className="flex flex-wrap items-baseline justify-between gap-4 py-6 transition hover:bg-[#1a1a1a]/[0.03]">
                    <span className="font-serif text-xl text-[#1a1a1a] md:text-2xl">{t}</span>
                    <span className="text-sm text-[#1a1a1a]/55">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Gallery 章节 ===== */}
      <section id="gallery" className="relative z-20 bg-[#0c0c12] text-[#f4efe6]">
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-14 md:py-28">
          <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#f4efe6]/45">03 — Gallery & Projects</p>

          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-[0.92] tracking-tight text-[#f4efe6]">
                六个
                <br />
                <span className="italic text-[#c74c1c]">值得看</span>
                <br />
                的作品。
              </h2>
              <p className="mt-8 text-base leading-relaxed text-[#f4efe6]/65 md:text-lg">
                这里展示了我 2021 年到 2025 年之间,
                被认真执行过的六个项目。
              </p>
              <Link to="/gallery" className="mt-10 inline-block border-b border-[#f4efe6]/40 pb-1 font-serif text-lg text-[#f4efe6]/80 hover:text-[#c74c1c] hover:border-[#c74c1c]">
                全部作品 →
              </Link>
            </div>

            <div className="grid gap-4 md:col-span-7 md:col-start-6 md:grid-cols-2">
              {[
                { t: 'Quiet Forest', d: '独立出版 · 品牌 & 版式', y: '2025', c: '#1f3a2e' },
                { t: 'Noema Parfum', d: '概念香氛 · 包装系统', y: '2024', c: '#c74c1c' },
                { t: 'Atlas Studio', d: '建筑工作室 · 网站', y: '2024', c: '#0d0d14' },
                { t: 'Echoes', d: '插画系列 · 自发起', y: '2023', c: '#1f3a2e' },
                { t: 'Soft Room', d: '展览视觉 · 导视', y: '2023', c: '#c74c1c' },
                { t: 'Nocturne', d: '演出海报 · 系列', y: '2022', c: '#0d0d14' },
              ].map((p, i) => (
                <Link
                  key={p.t}
                  to="/gallery"
                  className="group relative block aspect-[4/5] overflow-hidden border border-[#f4efe6]/10 transition hover:border-[#f4efe6]/30"
                  style={{ backgroundColor: p.c }}
                >
                  <div className="flex h-full w-full flex-col justify-between p-6">
                    <div className="flex items-start justify-between text-[11px] uppercase tracking-[0.25em] text-[#f4efe6]/70">
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      <span>{p.y}</span>
                    </div>
                    <div>
                      <p className="font-serif text-2xl text-[#f4efe6] md:text-3xl">{p.t}</p>
                      <p className="mt-2 text-sm text-[#f4efe6]/60">{p.d}</p>
                      <p className="mt-4 font-serif text-sm italic text-[#f4efe6]/60 transition group-hover:translate-x-1 group-hover:text-[#c74c1c]">
                        open →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contact 章节 ===== */}
      <section id="contact" className="relative z-20 bg-[#f4efe6] text-[#1a1a1a]">
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-14 md:py-28">
          <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/45">04 — Contact & Socials</p>

          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-[0.92] tracking-tight text-[#1a1a1a]">
                写一封
                <br />
                <span className="italic text-[#c74c1c]">信</span>给
                <br />
                我。
              </h2>
              <p className="mt-8 text-base leading-relaxed text-[#1a1a1a]/70 md:text-lg">
                如果你有想做的东西,写信告诉我。哪怕只是一句话,也会认真回。
                我在 24 小时内回复所有认真写下的邮件。
              </p>
              <div className="mt-10 grid grid-cols-2 gap-0 border-l border-t border-[#1a1a1a]/20">
                {[
                  ['Email', 'hello@junxi.studio'],
                  ['Instagram', '@junxi.studio'],
                  ['微信', '可邮件索取'],
                  ['地点', '上海 · 全球远程'],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-r border-[#1a1a1a]/20 p-5 transition hover:bg-[#1a1a1a]/[0.03]">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a]/45">{k}</p>
                    <p className="mt-2 font-serif text-lg text-[#1a1a1a]">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <form
                onSubmit={(e) => { e.preventDefault(); alert('谢谢你 —— 我会回复这个邮箱。'); }}
                className="space-y-10"
              >
                <Field label="你的名字" placeholder="怎么称呼你" />
                <Field label="你的邮箱" placeholder="name@example.com" type="email" />
                <div>
                  <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/45">想说的</p>
                  <textarea
                    rows={5}
                    placeholder="随意写——一句话也行,一段也行。"
                    className="w-full resize-none border-0 border-b border-[#1a1a1a]/30 bg-transparent pb-4 text-lg text-[#1a1a1a] placeholder:text-[#1a1a1a]/35 outline-none focus:border-[#1a1a1a]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full border border-[#1a1a1a] bg-[#1a1a1a] px-10 py-5 text-lg text-[#f4efe6] transition hover:bg-transparent hover:text-[#1a1a1a]"
                >
                  <span className="font-serif">发送邮件 · Send →</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 页脚 ===== */}
      <footer className="relative z-20 border-t border-[#1e1e2a] bg-[#0c0c12]">
        <div className="mx-auto max-w-[1600px] px-6 pb-12 pt-10 md:px-14">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <p className="font-serif text-3xl text-[#f4efe6] md:text-5xl">
              Junxi<span className="text-[#c74c1c]">.</span>
            </p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#f4efe6]/35">
              © 2025 — Designed by Junxi · Built with code.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, placeholder, type = 'text' }: { label: string; placeholder?: string; type?: string }) {
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/45">{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border-0 border-b border-[#1a1a1a]/30 bg-transparent pb-4 pt-2 text-xl text-[#1a1a1a] placeholder:text-[#1a1a1a]/35 outline-none focus:border-[#1a1a1a]"
      />
    </div>
  );
}
