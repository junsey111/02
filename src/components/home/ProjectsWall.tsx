import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../shared/Reveal';
import { Marquee } from '../shared/Reveal';
import { projects } from '../../data/projects';

export default function ProjectsWall() {
  return (
    <section id="projects" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
                Selected work / 2021 — 2025
              </p>
              <h2 className="mt-4 font-serif text-5xl leading-[1] text-bone md:text-7xl">
                Projects<span className="text-ember">.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-sm text-bone/70">
              六个代表性项目,涵盖品牌视觉、出版设计、网页与展览。
              每个项目记录一次与合作者之间的「安静对话」。
            </p>
          </Reveal>
        </div>

        {/* 横向滚动卡片墙 */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {projects.slice(0, 6).map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <Link
                  to={`/projects/${p.id}`}
                  data-cursor-hover
                  className={`project-card group relative block overflow-hidden rounded-2xl border border-line bg-ink-soft ${
                    i === 0 || i === 3 ? 'md:col-span-7' : 'md:col-span-5'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="img-placeholder absolute inset-0" />
                    <img
                      src={p.cover}
                      alt={p.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
                      onLoad={(e) => {
                        (e.currentTarget as HTMLImageElement).style.opacity =
                          '1';
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                    <div className="absolute left-6 top-6 flex items-center gap-3">
                      <span className="tag">{p.category}</span>
                      <span className="text-xs tracking-[0.2em] uppercase text-bone-dim">
                        {p.year}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                      <div>
                        <h3 className="font-serif text-3xl text-bone md:text-4xl">
                          {p.title}
                        </h3>
                        <p className="mt-2 text-sm text-bone/70">
                          {p.subtitle} · {p.client}
                        </p>
                      </div>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/30 bg-ink/60 backdrop-blur transition-all group-hover:-rotate-45 group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* 跑马灯分割带 */}
      <div className="mt-28 border-y border-line py-6">
        <Marquee text="Brand · Editorial · Web · Exhibition · Illustration · Packaging" />
      </div>
    </section>
  );
}
