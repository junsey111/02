import { Coffee, MapPin, Briefcase } from 'lucide-react';
import Reveal from '../components/shared/Reveal';

const timeline = [
  { year: '2025', t: 'Nocturne book series', where: 'Self initiated' },
  { year: '2024', t: 'Atlas Studio website', where: 'Atlas / Shanghai' },
  { year: '2023', t: 'Soft Room exhibition', where: 'Soft Room Gallery' },
  { year: '2022', t: 'Noema Parfum brand system', where: 'Noema / Europe' },
  { year: '2019', t: 'Founded Junxi Studio', where: 'Shanghai' },
];

const clients = [
  'Noema Parfum',
  'Quiet Forest Press',
  'Atlas Architects',
  'Soft Room Gallery',
  'Nocturne Live',
  'Paper & Ink',
  'Lumen Magazine',
  'Field Notes Asia',
];

export default function About() {
  return (
    <main className="pt-32 text-bone">
      <section className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
            About the studio / 关于
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-6 font-serif text-[14vw] leading-[0.95] tracking-tightest md:text-[8vw]">
            慢,也是一种
            <span className="italic text-ember">节奏</span>.
          </h1>
        </Reveal>

        <div className="mt-20 grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line">
              <div className="img-placeholder absolute inset-0" />
              <img
                src="https://picsum.photos/seed/junxi-portrait/1200/1500"
                alt="portrait"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1200ms]"
                onLoad={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.opacity = '1')
                }
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="font-serif text-3xl text-bone">俊西 · Junxi</p>
                  <p className="text-sm text-bone-dim">
                    Independent designer · Founder
                  </p>
                </div>
                <Coffee size={18} className="text-bone/70" />
              </div>
            </div>
          </Reveal>

          <div className="md:col-span-6 md:col-start-7 space-y-8">
            <Reveal>
              <p className="font-serif text-3xl leading-relaxed text-bone md:text-4xl">
                我相信设计应当像一首安静的曲子 —— 不急于讨好,
                却能在某个不经意的瞬间被人记住。
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="leading-relaxed text-bone/75">
                自 2019 年起,我以独立设计师的身份与来自出版、文化、
                生活方式领域的客户合作,从一个小小的标识开始,
                一直做到印刷、包装、网站与展览。工作之余,
                我会写作、听爵士乐,以及收集 1960s 年代的欧洲海报。
              </p>
            </Reveal>
            <Reveal delay={250}>
              <p className="leading-relaxed text-bone/75">
                目前工作室位于上海,欢迎有想法的品牌与个人来稿。
                我会在 24 小时内回复所有认真写下的邮件。
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-10">
              <Stat icon={<MapPin size={14} />} k="Studio" v="Shanghai" />
              <Stat icon={<Briefcase size={14} />} k="Since" v="2019" />
            </div>
          </div>
        </div>
      </section>

      {/* Time line */}
      <section className="mx-auto mt-32 max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <h2 className="font-serif text-5xl text-bone md:text-7xl">
            Time, selected<span className="text-ember">.</span>
          </h2>
        </Reveal>

        <ul className="mt-16 divide-y divide-line border-y border-line">
          {timeline.map((item, i) => (
            <Reveal key={item.year} delay={i * 80}>
              <li className="group flex flex-wrap items-baseline justify-between gap-4 py-6 transition-colors hover:bg-ink-soft md:py-8 md:px-4">
                <span className="font-serif text-3xl text-ember md:text-4xl">
                  {item.year}
                </span>
                <span className="flex-1 px-6 font-serif text-xl text-bone md:text-2xl">
                  {item.t}
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-bone-dim">
                  {item.where}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Clients */}
      <section className="mx-auto mt-32 max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
            Clients & Collaborators
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-6 font-serif text-5xl text-bone md:text-7xl">
            合作过的朋友们.
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-0 border-t border-l border-line md:grid-cols-4">
          {clients.map((c, i) => (
            <Reveal key={c} delay={i * 50}>
              <div className="border-b border-r border-line p-6 md:p-10">
                <p className="font-serif text-xl text-bone">{c}</p>
                <p className="mt-2 text-xs tracking-[0.25em] uppercase text-bone-dim">
                  Collaborator · {2020 + (i % 5)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({
  icon,
  k,
  v,
}: {
  icon: React.ReactNode;
  k: string;
  v: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-bone-dim">
        {icon} {k}
      </p>
      <p className="mt-2 font-serif text-3xl text-bone">{v}</p>
    </div>
  );
}
