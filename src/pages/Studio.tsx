import { Link } from 'react-router-dom';

/* ============================================================
   About Me — itomdev 风格完整 About 页面
   ============================================================ */
export default function Studio() {
  return (
    <div className="bg-[#f4efe6] text-[#1a1a1a]">

      {/* ===== 导航栏 ===== */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[#1a1a1a]/10 bg-[#f4efe6]/95 px-6 py-5 backdrop-blur-sm md:px-14">
        <Link to="/" className="font-serif text-xl text-[#1a1a1a] tracking-tight">
          Junxi<span className="text-[#c74c1c]">.</span>
        </Link>
        <nav className="hidden items-center gap-10 text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a]/50 md:flex">
          <Link to="/" className="hover:text-[#c74c1c]">The Corridor</Link>
          <Link to="/about" className="text-[#c74c1c]">About Me</Link>
          <Link to="/gallery" className="hover:text-[#c74c1c]">Gallery</Link>
          <Link to="/contact" className="hover:text-[#c74c1c]">Contact</Link>
        </nav>
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a]/35">Portfolio · 2025</span>
      </header>

      {/* ===== About Me 大标题 ===== */}
      <section className="mx-auto max-w-[1600px] px-6 pt-44 pb-16 md:px-14 md:pt-52 md:pb-20">
        <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40">
          About Me — The Studio
        </p>
        <h1 className="font-serif text-[clamp(3rem,11vw,10rem)] leading-[0.88] tracking-tight text-[#1a1a1a]">
          关于
          <br />
          <span className="italic text-[#c74c1c]">俊西。</span>
        </h1>
        <div className="mt-16 border-t border-[#1a1a1a]/20" />
      </section>

      {/* ===== 自述段落 ===== */}
      <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-14 md:pb-28">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-10">
              My Story · 我的故事
            </p>
            <div className="space-y-8 text-lg leading-relaxed text-[#1a1a1a]/80 md:text-xl">
              <p>
                我叫俊西。2019 年起以独立设计师的身份工作,
                主要在品牌视觉、编辑出版与网页设计三个方向上停留。
                我的工作方式有点像写一封信——不着急发出去,
                会反复读,让每个字停在合适的位置。
              </p>
              <p>
                对我而言,设计不是解决问题,而是让一个想法值得被看见。
                我不追求被很多人看到,只希望被合适的人看到。
                日常里,我听爵士乐,做海报,也帮朋友排版他们的书。
              </p>
              <p>
                从 2019 年到现在,六年过去了。
                期间做过品牌系统、书籍装帧、网站、展览视觉,
                也做过一些没人看但我很喜欢的个人项目。
                每一次认真做完一个项目,我都会觉得:这个东西,可以被人看很久。
                这就是我的标准。
              </p>
            </div>
          </div>

          {/* 右:快速信息 */}
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-8">
              Quick Info · 快速信息
            </p>
            <div className="space-y-0 divide-y divide-[#1a1a1a]/15 border-y border-[#1a1a1a]/15">
              {[
                ['Based in', '上海 · Shanghai'],
                ['Working since', '2019'],
                ['Specialties', '品牌 · 出版 · 网页'],
                ['Languages', '中文 · English'],
                ['Available for', '新项目 · 合作'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-5">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#1a1a1a]/45">{k}</span>
                  <span className="font-serif text-lg text-[#1a1a1a]">{v}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-5">
                Get in touch · 联系我
              </p>
              <Link
                to="/contact"
                className="inline-block border border-[#1a1a1a] bg-[#1a1a1a] px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-[#f4efe6] transition hover:bg-transparent hover:text-[#1a1a1a]"
              >
                写邮件给我 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 时间线 ===== */}
      <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-14 md:pb-28">
        <div className="border-t border-[#1a1a1a]/20 pt-16">
          <p className="mb-12 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40">
            Timeline · 时间线
          </p>
          <div className="space-y-0 divide-y divide-[#1a1a1a]/15">
            {[
              ['2025', 'Quiet Forest 独立出版物创刊 — Editorial'],
              ['2024', 'Noema Parfum · 完整品牌与包装系统 — Brand & Packaging'],
              ['2024', 'Atlas Studio 建筑工作室网站 — Web Design'],
              ['2023', 'Echoes 插画系列 · 自发起项目 — Illustration'],
              ['2023', 'Soft Room 展览视觉与导视系统 — Exhibition'],
              ['2022', 'Nocturne 演出海报系列 · 12 张 — Poster'],
              ['2021', '第一个商业客户项目 — Studio Start'],
              ['2019', '以独立设计师身份开始接单 — Independent Practice'],
            ].map(([y, t]) => (
              <div key={y} className="grid grid-cols-12 items-baseline gap-4 py-8 transition hover:bg-[#1a1a1a]/[0.02]">
                <span className="col-span-2 font-serif text-3xl text-[#c74c1c] md:text-4xl">{y}</span>
                <span className="col-span-10 font-serif text-xl text-[#1a1a1a] md:text-2xl">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 服务/技能 ===== */}
      <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-14 md:pb-28">
        <div className="border-t border-[#1a1a1a]/20 pt-16">
          <p className="mb-12 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40">
            Services · 可提供的服务
          </p>
          <div className="grid gap-0 border-l border-t border-[#1a1a1a]/20 md:grid-cols-3">
            {[
              ['01', '品牌视觉', 'Logo · 字体 · 颜色 · 应用系统'],
              ['02', '出版与排版', '书籍 · 画册 · 杂志 · 字体选择'],
              ['03', '网站设计', '品牌站 · 作品集站 · 极简前端'],
              ['04', '包装设计', '从结构到视觉的整体方案'],
              ['05', '插画与海报', '编辑性插画 · 概念性海报'],
              ['06', '展览视觉', '主视觉 · 导视 · 印刷物料'],
            ].map(([n, t, d], i) => (
              <div
                key={n}
                className="min-h-[200px] border-b border-r border-[#1a1a1a]/20 p-8 transition hover:bg-[#1a1a1a]/[0.02]"
              >
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a]/40">{n}</p>
                <p className="mt-6 font-serif text-2xl text-[#1a1a1a]">{t}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#1a1a1a]/60">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 工具 ===== */}
      <section className="mx-auto max-w-[1600px] px-6 pb-24 md:px-14">
        <div className="border-t border-[#1a1a1a]/20 pt-16">
          <p className="mb-12 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40">
            Tools & Software · 工具
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'InDesign',
              'Blender', 'After Effects', 'Framer', 'Next.js',
              'React', 'CSS / SCSS', 'Typography', 'Print Production',
            ].map((t) => (
              <span
                key={t}
                className="border border-[#1a1a1a]/20 px-5 py-2 text-sm text-[#1a1a1a]/70"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 页脚 ===== */}
      <footer className="border-t border-[#1a1a1a]/20 bg-[#1a1a1a]">
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
