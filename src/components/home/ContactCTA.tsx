import { ArrowUpRight, Mail } from 'lucide-react';
import Reveal from '../shared/Reveal';

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/10 blur-[160px]"
      />
      <div className="relative mx-auto max-w-[1600px] px-6 text-center md:px-10">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
            Available for new projects · Q3 / 2025
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mx-auto mt-6 max-w-4xl font-serif text-[14vw] leading-[0.95] text-bone md:text-[8vw]">
            Have a
            <span className="italic text-ember"> quiet </span>
            idea in mind?
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-8 max-w-xl text-bone/70">
            无论是品牌焕新、一本出版物,还是一个想被认真对待的网站,
            我都乐意聊聊。
          </p>
        </Reveal>
        <Reveal delay={340}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <a href="/contact" className="btn-ember inline-flex items-center gap-3">
              写一封邮件 <ArrowUpRight size={16} />
            </a>
            <a
              href="mailto:hello@junxi.studio"
              className="btn-line inline-flex items-center gap-3"
            >
              <Mail size={14} /> hello@junxi.studio
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
