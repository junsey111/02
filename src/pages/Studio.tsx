import { Canvas } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import { BigFloatShape, BackgroundDebris } from '../components/three/SceneShell';

/* ============= 关于页面 ============= */
export default function Studio() {
  return (
    <div className="relative min-h-screen bg-ink text-bone">
      {/* 顶部 3D 大标题 —— 墨绿 */}
      <div className="pointer-events-none relative h-[75vh] w-full overflow-hidden">
        <Canvas camera={{ position: [0, 0.5, 8], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={['#0a0a0a']} />
          <fog attach="fog" args={['#0a0a0a', 6, 22]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#f4efe6" />
          <directionalLight position={[-5, 2, -5]} intensity={0.5} color="#1f3a2e" />
          <BackgroundDebris color="#1f3a2e" />
          <BigFloatShape color="#1f3a2e" geometry="torus" size={2.2} />
        </Canvas>

        <div className="noise-overlay" />

        <div className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-[1600px] items-start justify-between px-6 pt-10 text-[11px] uppercase tracking-[0.3em] text-bone/60 md:px-14">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-forest" style={{ background: '#1f3a2e' }} />
            <span>02 · Studio</span>
          </div>
          <Link to="/" className="hover:text-forest">← 返回大厅</Link>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-bone/60">About the designer · 2025</p>
          <h1 className="mt-6 font-serif text-[16vw] leading-[0.9] tracking-tight text-bone md:text-[11vw]">
            工作室 <span className="italic" style={{ color: '#1f3a2e' }}>。</span>
          </h1>
          <p className="mt-8 max-w-xl text-bone/60">关于俊西本人 —— 一个缓慢、 克制、 专注于细节的独立设计师。</p>
        </div>

        <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-[1600px] items-end justify-between px-6 text-[11px] uppercase tracking-[0.3em] text-bone/50 md:px-14">
          <span>Scroll ↓</span>
          <span>Junxi · Studio</span>
          <span>01 designer</span>
        </div>
      </div>

      {/* ============= 自我介绍 ============= */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 py-24 md:px-14">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.3em] text-bone/60">Intro · 关于</p>
            <p className="mt-4 font-serif text-4xl text-bone md:text-5xl">
              一个<span className="italic" style={{ color: '#1f3a2e' }}> 安静的</span> 工作室
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6 space-y-8 text-lg leading-relaxed text-bone/75">
            <p>
              我是 俊西。 自 2019 年起以独立设计师的身份工作,
              主要在品牌视觉、 独立出版与网页设计三个方向上停留。
            </p>
            <p>
              我的工作方式有点像写一封信 —— 不着急发出去, 会反复读,
              让每个字停在合适的位置。 对我而言, 设计不是解决问题,
              而是让一个想法值得被看见。
            </p>
            <p>
              日常里, 我听爵士乐, 做海报, 也帮朋友排版他们的书。
              我不追求被很多人看到, 只希望被合适的人看到。
            </p>
          </div>
        </div>

        {/* 时间线 */}
        <div className="mt-28">
          <p className="text-xs uppercase tracking-[0.3em] text-bone/60">Timeline · 时间线</p>
          <p className="mt-4 font-serif text-4xl text-bone md:text-6xl">
            一些<span className="italic" style={{ color: '#1f3a2e' }}> 被标记的</span> 年份。
          </p>

          <ul className="mt-16 divide-y divide-line border-y border-line">
            {[
              { y: '2025', t: 'Quiet Forest 独立出版物创刊', where: 'Editorial' },
              { y: '2024', t: 'Noema Parfum · 完整品牌与包装系统', where: 'Brand / Packaging' },
              { y: '2024', t: 'Atlas Studio 建筑工作室网站', where: 'Web' },
              { y: '2023', t: 'Soft Room 展览视觉与导视系统', where: 'Exhibition' },
              { y: '2022', t: 'Nocturne 演出海报系列 · 12 张', where: 'Poster' },
              { y: '2019', t: '以独立设计师身份开始接单', where: 'Studio' },
            ].map((item, i) => (
              <li
                key={i}
                data-cursor-hover
                className="flex flex-wrap items-baseline justify-between gap-4 py-6 transition-colors hover:bg-[#0f0f15] md:py-8 md:px-4"
              >
                <span className="font-serif text-3xl md:text-4xl" style={{ color: '#1f3a2e' }}>{item.y}</span>
                <span className="flex-1 px-4 font-serif text-xl text-bone md:text-2xl">{item.t}</span>
                <span className="text-[11px] uppercase tracking-[0.3em] text-bone/50">{item.where}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 服务 */}
        <div className="mt-28">
          <p className="text-xs uppercase tracking-[0.3em] text-bone/60">Services · 可提供的服务</p>
          <p className="mt-4 font-serif text-4xl text-bone md:text-6xl">
            我做什么<span className="italic" style={{ color: '#1f3a2e' }}>。</span>
          </p>

          <div className="mt-16 grid gap-0 border-l border-t border-line md:grid-cols-3">
            {[
              ['01', '品牌视觉', 'Logo · 字体 · 颜色 · 应用系统'],
              ['02', '出版与排版', '书籍 · 画册 · 杂志 · 字体选择'],
              ['03', '网站设计', '品牌站 · 作品集站 · 极简前端'],
              ['04', '包装设计', '从结构到视觉的整体方案'],
              ['05', '插画与海报', '编辑性插画 · 概念性海报'],
              ['06', '展览视觉', '主视觉 · 导视 · 印刷物料'],
            ].map(([n, title, desc], i) => (
              <div
                key={i}
                data-cursor-hover
                className="min-h-[180px] border-b border-r border-line p-6 transition-colors hover:bg-[#0f0f15] md:p-10"
              >
                <p className="text-xs tracking-[0.3em] uppercase text-bone/50">{n}</p>
                <p className="mt-6 font-serif text-2xl text-bone">{title}</p>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 引语 */}
        <p className="mx-auto mt-24 max-w-3xl text-center font-serif text-2xl italic leading-snug text-bone/70 md:text-4xl">
          “ 设计不应该叫喊,
          <br /> 它应该在被需要时刚好在那里。”
        </p>
      </section>

      {/* 底部 —— 下一站 */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 pb-20 md:px-14">
        <div className="border-t border-line pt-16 text-center">
          <p className="font-serif text-5xl text-bone md:text-7xl">
            Next — <Link to="/contact" className="italic text-ember hover:underline">Contact →</Link>
          </p>
          <p className="mt-4 text-sm text-bone/50">下一间:联系的入口。</p>
        </div>
      </section>
    </div>
  );
}
