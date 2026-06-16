import {
  PenTool,
  LayoutGrid,
  BookOpen,
  Palette,
  Box,
  Globe,
} from 'lucide-react';
import Reveal from '../shared/Reveal';

const services = [
  {
    icon: PenTool,
    title: 'Brand Identity',
    sub: '品牌视觉',
    desc: '从标识、字体、色板到应用规范的完整系统设计。',
  },
  {
    icon: BookOpen,
    title: 'Editorial Design',
    sub: '出版与刊物',
    desc: '杂志、书籍、画册与独立出版物的版式与视觉开发。',
  },
  {
    icon: Globe,
    title: 'Web Design',
    sub: '网页设计',
    desc: '为品牌、文化机构与个人设计有节奏感的网站。',
  },
  {
    icon: Box,
    title: 'Packaging',
    sub: '包装设计',
    desc: '关注材料与工艺,交付从结构到视觉的完整方案。',
  },
  {
    icon: Palette,
    title: 'Illustration',
    sub: '插画',
    desc: '概念性、编辑性插画系列,以及跨媒介的视觉语言。',
  },
  {
    icon: LayoutGrid,
    title: 'Exhibition',
    sub: '展览视觉',
    desc: '为小型展览与艺术活动设计视觉系统与导视。',
  },
];

export default function ServicesGrid() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
                What I do / 我做什么
              </p>
              <h2 className="mt-4 font-serif text-5xl leading-[1] text-bone md:text-7xl">
                Services<span className="text-ember">.</span>
              </h2>
            </div>
            <p className="max-w-sm text-bone/70">
              以设计作为一种长期陪伴的实践,而非一次性交付。
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-0 border-l border-t border-line md:grid-cols-3">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 60}>
                <div
                  data-cursor-hover
                  className="group relative min-h-[240px] border-b border-r border-line p-8 transition-colors hover:bg-ink-soft md:p-10"
                >
                  <span className="absolute right-6 top-6 text-[11px] tracking-[0.3em] uppercase text-bone-dim">
                    0{i + 1}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-bone transition-colors group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
                    <Icon size={18} strokeWidth={1.4} />
                  </div>
                  <h3 className="mt-8 font-serif text-2xl text-bone">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-bone-dim">{s.sub}</p>
                  <p className="mt-5 text-bone/75 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
