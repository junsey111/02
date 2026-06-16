import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { findProject, projects } from '../data/projects';
import Reveal from '../components/shared/Reveal';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = id ? findProject(id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <main className="mx-auto max-w-[1600px] px-6 py-40 md:px-10">
        <h1 className="font-serif text-5xl text-bone">项目未找到</h1>
        <Link to="/" className="btn-line mt-8 inline-flex">
          返回首页
        </Link>
      </main>
    );
  }

  const idx = projects.findIndex((p) => p.id === project.id);
  const next = projects[(idx + 1) % projects.length];
  const prev = projects[(idx - 1 + projects.length) % projects.length];

  return (
    <main className="pt-28 text-bone">
      {/* 顶部导航 */}
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 pb-6 md:px-10">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-bone-dim hover:text-bone"
        >
          <ArrowLeft size={14} /> All projects
        </Link>
        <span className="text-xs tracking-[0.3em] uppercase text-bone-dim">
          {String(idx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
      </div>

      {/* 标题 */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-center gap-4">
            <span className="tag">{project.category}</span>
            <span className="text-xs tracking-[0.2em] uppercase text-bone-dim">
              {project.year}
            </span>
            <span className="text-xs tracking-[0.2em] uppercase text-bone-dim">
              · Client · {project.client}
            </span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mt-6 font-serif text-[14vw] leading-[0.95] tracking-tightest md:text-[8vw]">
            {project.title}
            <span className="text-ember">.</span>
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-6 max-w-3xl text-lg text-bone/75 md:text-2xl">
            {project.subtitle}
          </p>
        </Reveal>
      </section>

      {/* 封面大图 */}
      <section className="mx-auto mt-16 max-w-[1600px] px-6 md:px-10">
        <Reveal delay={260}>
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line">
            <div className="img-placeholder absolute inset-0" />
            <img
              src={project.cover}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1200ms]"
              onLoad={(e) =>
                ((e.currentTarget as HTMLImageElement).style.opacity = '1')
              }
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>
        </Reveal>
      </section>

      {/* 叙述 + 图册  */}
      <section className="mx-auto mt-24 max-w-[1600px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
              About the project
            </p>
            <p className="mt-4 text-bone/75 leading-relaxed">
              {project.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="md:col-span-7 md:col-start-6 space-y-6">
            {project.body.map((para, i) => (
              <Reveal key={i} delay={i * 120}>
                <p className="font-serif text-xl leading-relaxed text-bone/90 md:text-2xl">
                  {para}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 画廊 */}
        <div className="mt-24 space-y-6">
          {project.gallery.map((g, i) => (
            <Reveal key={g} delay={i * 100}>
              <div
                className={`relative overflow-hidden rounded-2xl border border-line ${
                  i % 3 === 0
                    ? 'aspect-[16/9]'
                    : i % 3 === 1
                    ? 'aspect-[4/5] md:w-2/3 ml-auto'
                    : 'aspect-[16/9] md:w-3/4'
                }`}
              >
                <div className="img-placeholder absolute inset-0" />
                <img
                  src={g}
                  alt={`${project.title} gallery ${i + 1}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1200ms]"
                  onLoad={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.opacity = '1')
                  }
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* prev / next 导航 */}
      <section className="mx-auto mt-28 max-w-[1600px] px-6 pb-8 md:px-10">
        <div className="grid gap-8 border-t border-line pt-12 md:grid-cols-2">
          <button
            onClick={() => navigate(`/projects/${prev.id}`)}
            className="group text-left"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
              ← Previous
            </p>
            <p className="mt-3 font-serif text-3xl text-bone group-hover:text-ember">
              {prev.title}
            </p>
            <p className="mt-1 text-sm text-bone-dim">{prev.subtitle}</p>
          </button>
          <button
            onClick={() => navigate(`/projects/${next.id}`)}
            className="group text-right"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
              Next <ArrowRight size={12} className="inline" />
            </p>
            <p className="mt-3 font-serif text-3xl text-bone group-hover:text-ember">
              {next.title}
            </p>
            <p className="mt-1 text-sm text-bone-dim">{next.subtitle}</p>
          </button>
        </div>
      </section>
    </main>
  );
}
