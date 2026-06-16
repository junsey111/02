import { useEffect, useRef, useState } from 'react';

export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.setTimeout(() => {
              el.classList.add('is-visible');
            }, delay);
            ob.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

export function WordReveal({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const words = text.split('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const spans = el.querySelectorAll<HTMLSpanElement>('.word-in');
            spans.forEach((s, i) => {
              window.setTimeout(() => s.classList.add('is-visible'), 60 * i);
            });
            ob.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="word-in"
          style={{ transitionDelay: `${i * 0.05}s` }}
        >
          {w === ' ' ? '\u00A0' : w}
        </span>
      ))}
    </span>
  );
}

export function NoiseOverlay() {
  return <div className="noise-overlay" />;
}

export function CustomCursor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled] = useState(
    typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  useEffect(() => {
    if (!enabled) return;
    const dot = ref.current;
    if (!dot) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const shouldHover =
        t.tagName === 'A' ||
        t.tagName === 'BUTTON' ||
        !!t.closest('a, button, [data-cursor-hover]');
      if (shouldHover) dot.classList.add('is-hover');
      else dot.classList.remove('is-hover');
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={ref} className="cursor-dot" />;
}

export function Marquee({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="inline-flex animate-marquee will-change-transform">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="px-10 font-serif text-[11vw] tracking-tightest text-bone/70 italic"
          >
            {text} ·&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
