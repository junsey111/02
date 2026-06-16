import { Link } from 'react-router-dom';
import { Instagram, Dribbble, ArrowUpRight, Hash } from 'lucide-react';
import Reveal from '../shared/Reveal';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-32 border-t border-line bg-ink text-bone/80">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-10">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-bone-dim">
                Studio / Studio / Studio / Studio
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h3 className="mt-6 font-serif text-5xl leading-[1.05] text-bone md:text-7xl">
                Let&apos;s build{' '}
                <span className="italic text-bone/70">something</span>
                <br />
                quiet, together.
              </h3>
            </Reveal>
            <Reveal delay={240}>
              <Link
                to="/contact"
                className="btn-ember mt-12 inline-flex items-center gap-3"
              >
                Start a project <ArrowUpRight size={16} />
              </Link>
            </Reveal>
          </div>

          <div className="md:col-span-3 md:col-start-8">
            <p className="text-xs tracking-[0.25em] uppercase text-bone-dim">
              Menu
            </p>
            <ul className="mt-6 space-y-3 text-bone">
              <li><Link to="/" className="link-underline">Home</Link></li>
              <li><a href="/#projects" className="link-underline">Projects</a></li>
              <li><Link to="/about" className="link-underline">About</Link></li>
              <li><Link to="/contact" className="link-underline">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs tracking-[0.25em] uppercase text-bone-dim">
              Elsewhere
            </p>
            <ul className="mt-6 space-y-3 text-bone">
              <li className="flex items-center gap-3">
                <Instagram size={14} />
                <a href="#" className="link-underline">
                  @junxi.studio
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Hash size={14} />
                <a href="#" className="link-underline">
                  Behance / junxi
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Dribbble size={14} />
                <a href="#" className="link-underline">
                  Dribbble / junxi
                </a>
              </li>
              <li className="flex items-center gap-3 pt-4">
                <span className="text-sm text-bone-dim">
                  Shanghai · {year}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 md:flex-row md:items-center">
          <p className="font-serif text-lg">
            俊西 · <span className="italic">Junxi Studio</span>
          </p>
          <p className="text-xs tracking-[0.2em] uppercase text-bone-dim">
            © {year} Junxi Studio · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
