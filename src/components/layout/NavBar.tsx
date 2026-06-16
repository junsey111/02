import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [loc.pathname]);

  const items = [
    { label: 'Projects', href: '/#projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-ink/80 backdrop-blur-md border-b border-line'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="group flex items-center gap-3">
            <span className="block h-8 w-8 rounded-full bg-bone text-ink flex items-center justify-center font-serif text-sm font-bold transition-transform duration-500 group-hover:rotate-[20deg]">
              J
            </span>
            <span className="font-serif text-lg tracking-wide">
              俊西 · Junxi
            </span>
          </Link>

          <ul className="hidden items-center gap-10 md:flex">
            {items.map((it) => (
              <li key={it.label}>
                <a
                  href={it.href}
                  className="link-underline text-sm tracking-[0.18em] uppercase text-bone/80 hover:text-bone"
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="mailto:hello@junxi.studio"
            className="btn-line hidden md:inline-flex"
          >
            hello@junxi.studio
          </a>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex flex-col items-end gap-[5px] md:hidden"
            aria-label="menu"
          >
            <span className="block h-px w-6 bg-bone" />
            <span className="block h-px w-4 bg-bone" />
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-ink/95 text-3xl md:hidden">
          {items.map((it) => (
            <a
              key={it.label}
              href={it.href}
              className="font-serif italic text-bone"
            >
              {it.label}
            </a>
          ))}
          <a
            href="mailto:hello@junxi.studio"
            className="mt-6 text-sm tracking-[0.18em] uppercase text-bone-dim"
          >
            hello@junxi.studio
          </a>
        </div>
      )}
    </>
  );
}
