import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import Reveal from '../shared/Reveal';

export default function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const nx = (e.clientX / w - 0.5) * 20;
      const ny = (e.clientY / h - 0.5) * 20;
      setParallax({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section
      ref={ref}
      className="bg-mesh relative min-h-[100svh] overflow-hidden pt-28"
    >
      {/* 模糊色块 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-[480px] w-[480px] rounded-full bg-ember/20 blur-[140px]"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          transition: 'transform 0.6s ease-out',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 h-[520px] w-[520px] rounded-full bg-forest/25 blur-[160px]"
        style={{
          transform: `translate(${-parallax.x}px, ${-parallax.y}px)`,
          transition: 'transform 0.6s ease-out',
        }}
      />

      {/* 左上 / 右上小标注 */}
      <div className="absolute left-6 top-32 text-[11px] tracking-[0.3em] uppercase text-bone-dim md:left-10 md:top-40">
        <span className="inline-flex items-center gap-2">
          <span className="block h-2 w-2 rounded-full bg-ember animate-pulse" />
          No. 001 — Portfolio
        </span>
      </div>
      <div className="absolute right-6 top-32 text-[11px] tracking-[0.3em] uppercase text-bone-dim md:right-10 md:top-40">
        est. 2019 · Shanghai
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pb-24 md:px-10">
        {/* 大标题 */}
        <Reveal delay={0}>
          <p className="mt-16 text-sm tracking-[0.25em] uppercase text-bone/70">
            A design studio by 俊西 —
          </p>
        </Reveal>
        <h1 className="hero-word mt-6 text-[18vw] text-bone md:mt-10 md:text-[13vw]">
          <Reveal delay={80}>
            <span className="block">
              Design<span className="text-ember">.</span>
            </span>
          </Reveal>
          <Reveal delay={180}>
            <span className="block translate-x-[4vw] italic text-bone/85">
              for&nbsp;quiet
            </span>
          </Reveal>
          <Reveal delay={280}>
            <span className="block">minds.</span>
          </Reveal>
        </h1>

        {/* 主描述 + 按钮组 */}
        <div className="mt-16 grid gap-10 md:grid-cols-12">
          <Reveal delay={300} className="md:col-span-5">
            <p className="text-lg leading-relaxed text-bone/80 md:text-xl">
              我是一名独立设计师,专注品牌、出版与网页领域。
              我的工作围绕「节奏」与「余白」展开 —— 为合适的对象,
              做能被长久阅读的设计。
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#projects" className="btn-ember">
                查看作品
              </a>
              <a href="/about" className="btn-line">
                关于我
              </a>
            </div>
          </Reveal>

          <div className="md:col-span-5 md:col-start-8">
            <Reveal delay={420}>
              <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-8">
                <Stat k="2019" v="Studio starts" />
                <Stat k="60+" v="Projects delivered" />
                <Stat k="12" v="Award shortlists" />
                <Stat k="SH" v="Based in Shanghai" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* 底部滚动指示 */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-between px-6 md:px-10">
        <span className="vertical-text hidden text-[11px] tracking-[0.3em] uppercase text-bone-dim md:block">
          scroll / scroll / scroll
        </span>
        <a
          href="#projects"
          className="group ml-auto flex items-center gap-4 text-sm tracking-[0.2em] uppercase text-bone-dim"
        >
          <span className="transition-colors group-hover:text-bone">
            Keep going
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
            <ArrowDown size={16} />
          </span>
        </a>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-serif text-4xl text-bone">{k}</p>
      <p className="mt-2 text-xs tracking-[0.22em] uppercase text-bone-dim">
        {v}
      </p>
    </div>
  );
}
