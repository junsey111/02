import { Link } from 'react-router-dom';

/* ============================================================
   Gallery — itomdev 风格的完整作品集页面
   ============================================================ */
const PROJECTS = [
  {
    id: 'quiet-forest',
    title: 'Quiet Forest',
    year: '2025',
    category: 'Editorial',
    color: '#1f3a2e',
    description:
      `一本独立出版物,探索森林与城市之间沉默的对话。版式参考 1960 年代的瑞士排版,
      每一页都是可独立存在的平面设计作品。`,
    tags: ['Editorial', 'Book Design', 'Typography'],
    long: true,
  },
  {
    id: 'noema-parfum',
    title: 'Noema Parfum',
    year: '2024',
    category: 'Packaging',
    color: '#c74c1c',
    description:
      `一个概念香氛品牌的完整视觉系统。从品牌命名、视觉语言到包装结构,
      再到每一瓶的瓶身与标签,全部手绘草图再落地执行。`,
    tags: ['Brand', 'Packaging', 'Illustration'],
    long: true,
  },
  {
    id: 'atlas-studio',
    title: 'Atlas Studio',
    year: '2024',
    category: 'Web Design',
    color: '#0d0d14',
    description:
      `一家建筑工作室的品牌网站。极简黑白基调,大量留白,
      用 CSS Grid 与排版的节奏感代替图片说故事。`,
    tags: ['Web Design', 'Brand', 'CSS'],
    long: true,
  },
  {
    id: 'echoes',
    title: 'Echoes',
    year: '2023',
    category: 'Illustration',
    color: '#1f3a2e',
    description:
      `一组自发起的小幅插画,画的是声音在空间里的形状。
      12 张,用木刻版画的方式画在铜版纸上,然后扫描进电脑调整。`,
    tags: ['Illustration', 'Print', 'Self-initiated'],
    long: false,
  },
  {
    id: 'soft-room',
    title: 'Soft Room',
    year: '2023',
    category: 'Exhibition',
    color: '#c74c1c',
    description:
      `一个声音装置展览的视觉与导视系统。海报、导览手册、场地导视,
      全部围绕"柔软"与"声音"两个关键词展开。`,
    tags: ['Exhibition', 'Wayfinding', 'Poster'],
    long: false,
  },
  {
    id: 'nocturne',
    title: 'Nocturne',
    year: '2022',
    category: 'Poster Series',
    color: '#0d0d14',
    description:
      `一套 12 张的演出海报,每张对应一场夜间音乐会。
      深夜的天空色、极简的字体、每张一个中心图形。`,
    tags: ['Poster', 'Print', 'Series'],
    long: false,
  },
];

export default function Gallery() {
  const long = PROJECTS.filter((p) => p.long);
  const short = PROJECTS.filter((p) => !p.long);

  return (
    <div className="bg-[#f4efe6] text-[#1a1a1a]">

      {/* ===== 导航栏 ===== */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[#1a1a1a]/10 bg-[#f4efe6]/95 px-6 py-5 backdrop-blur-sm md:px-14">
        <Link to="/" className="font-serif text-xl text-[#1a1a1a] tracking-tight">
          Junxi<span className="text-[#c74c1c]">.</span>
        </Link>
        <nav className="hidden items-center gap-10 text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a]/50 md:flex">
          <Link to="/" className="hover:text-[#c74c1c]">The Corridor</Link>
          <Link to="/about" className="hover:text-[#c74c1c]">About Me</Link>
          <Link to="/gallery" className="text-[#c74c1c]">Gallery</Link>
          <Link to="/contact" className="hover:text-[#c74c1c]">Contact</Link>
        </nav>
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a]/35">Portfolio · 2025</span>
      </header>

      {/* ===== Gallery 大标题 ===== */}
      <section className="mx-auto max-w-[1600px] px-6 pt-44 pb-16 md:px-14 md:pt-52 md:pb-20">
        <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40">
          Gallery & Projects — 2021 to 2025
        </p>
        <h1 className="font-serif text-[clamp(3rem,11vw,10rem)] leading-[0.88] tracking-tight text-[#1a1a1a]">
          六个
          <br />
          <span className="italic text-[#c74c1c]">值得看</span>
          <br />
          的作品。
        </h1>
        <div className="mt-16 border-t border-[#1a1a1a]/20" />
      </section>

      {/* ===== 精选项目(长描述) ===== */}
      <section className="mx-auto max-w-[1600px] px-6 pb-16 md:px-14">
        <p className="mb-10 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40">
          Featured · 精选项目
        </p>
        <div className="space-y-12">
          {long.map((p) => (
            <article key={p.id} className="group border-t border-[#1a1a1a]/15 pt-10 pb-12">
              <div className="grid gap-10 md:grid-cols-12">
                {/* 左:缩略图 */}
                <div className="md:col-span-5">
                  <div
                    className="aspect-[4/3] w-full overflow-hidden transition"
                    style={{ backgroundColor: p.color }}
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-serif text-3xl text-[#f4efe6]/40">{p.title[0]}</span>
                    </div>
                  </div>
                </div>
                {/* 右:信息 */}
                <div className="md:col-span-6 md:col-start-7">
                  <div className="flex flex-wrap items-baseline gap-3 text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a]/45 mb-6">
                    <span>{p.year}</span>
                    <span>·</span>
                    <span>{p.category}</span>
                  </div>
                  <h2 className="font-serif text-4xl text-[#1a1a1a] md:text-5xl">{p.title}</h2>
                  <p className="mt-6 text-base leading-relaxed text-[#1a1a1a]/70 md:text-lg">
                    {p.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="border border-[#1a1a1a]/20 px-3 py-1 text-xs text-[#1a1a1a]/55">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button className="mt-8 inline-flex items-center gap-2 border-b border-[#1a1a1a] pb-1 text-sm text-[#1a1a1a] hover:text-[#c74c1c] hover:border-[#c74c1c]">
                    View project →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== 其他项目(小卡片) ===== */}
      <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-14">
        <p className="mb-10 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40">
          More · 更多作品
        </p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {short.map((p, i) => (
            <article
              key={p.id}
              className="group border border-[#1a1a1a]/15 transition hover:border-[#1a1a1a]/40"
            >
              <div style={{ backgroundColor: p.color }} className="aspect-[4/3] flex items-center justify-center">
                <span className="font-serif text-5xl text-[#f4efe6]/30">{p.title[0]}</span>
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3 text-[11px] uppercase tracking-[0.2em] text-[#1a1a1a]/45 mb-3">
                  <span>{p.year}</span>
                  <span>{p.category}</span>
                </div>
                <h3 className="font-serif text-2xl text-[#1a1a1a]">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#1a1a1a]/60 line-clamp-2">
                  {p.description}
                </p>
                <button className="mt-4 inline-flex items-center gap-1 text-xs text-[#1a1a1a]/50 hover:text-[#c74c1c]">
                  open →
                </button>
              </div>
            </article>
          ))}
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
