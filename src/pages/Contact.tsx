import { useState } from 'react';
import { Mail, Instagram, MapPin, Check, ArrowRight, Hash } from 'lucide-react';
import Reveal from '../components/shared/Reveal';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    kind: 'Brand',
    budget: '20k — 50k',
    message: '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="pt-32 text-bone">
      <section className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
            Contact / 联系
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-6 font-serif text-[14vw] leading-[0.95] tracking-tightest md:text-[8vw]">
            Say hello,
            <span className="italic text-ember"> slowly</span>.
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-8 max-w-2xl text-bone/75 md:text-xl">
            如果你有一个具体的项目、一个尚未成型的想法,或只是想聊聊,
            欢迎通过下面的表单或邮件联系我。我通常会在 24 小时内回复。
          </p>
        </Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-[1600px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12">
          {/* 表单 */}
          <div className="md:col-span-7">
            {!sent ? (
              <form
                onSubmit={onSubmit}
                className="space-y-10 border-t border-line pt-10"
              >
                <Field
                  label="Your name"
                  type="text"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  placeholder="请告诉我你怎么称呼"
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  placeholder="you@example.com"
                  required
                />
                <div className="grid gap-10 md:grid-cols-2">
                  <SelectField
                    label="Project kind"
                    value={form.kind}
                    options={['Brand', 'Editorial', 'Web', 'Packaging', 'Illustration', 'Exhibition']}
                    onChange={(v) => setForm((f) => ({ ...f, kind: v }))}
                  />
                  <SelectField
                    label="Budget"
                    value={form.budget}
                    options={['< 20k', '20k — 50k', '50k — 100k', '100k+', 'Not sure']}
                    onChange={(v) => setForm((f) => ({ ...f, budget: v }))}
                  />
                </div>

                <div>
                  <p className="mb-4 text-xs tracking-[0.3em] uppercase text-bone-dim">
                    告诉我你的想法
                  </p>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="项目背景、想要的感受、可参考的东西……"
                    rows={6}
                    className="field-line resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-ember inline-flex items-center gap-3"
                >
                  发送邮件 <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <Reveal>
                <div className="flex h-[360px] flex-col items-start justify-center border-t border-line">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-bone/40 text-bone">
                    <Check size={22} />
                  </div>
                  <h3 className="mt-6 font-serif text-4xl text-bone">
                    收到了,谢谢你.
                  </h3>
                  <p className="mt-4 max-w-lg text-bone/70">
                    我会在 24 小时内回复你的邮件。在此之前,
                    不妨去看看作品集里的其他项目。
                  </p>
                  <a
                    href="/#projects"
                    className="btn-line mt-8 inline-flex"
                  >
                    去看作品
                  </a>
                </div>
              </Reveal>
            )}
          </div>

          {/* 右侧信息 */}
          <aside className="md:col-span-4 md:col-start-9">
            <div className="border-t border-line pt-10">
              <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
                Email
              </p>
              <a
                href="mailto:hello@junxi.studio"
                className="mt-4 flex items-center gap-3 font-serif text-3xl text-bone hover:text-ember"
              >
                <Mail size={18} /> hello@junxi.studio
              </a>

              <div className="mt-12 border-t border-line pt-8">
                <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
                  Elsewhere
                </p>
                <a
                  href="#"
                  className="mt-4 flex items-center gap-3 text-bone hover:text-ember"
                >
                  <Instagram size={16} /> @junxi.studio
                </a>
                <a
                  href="#"
                  className="mt-3 flex items-center gap-3 text-bone hover:text-ember"
                >
                  <Hash size={16} />
                  behance.net/junxi
                </a>
              </div>

              <div className="mt-12 border-t border-line pt-8">
                <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
                  Studio
                </p>
                <p className="mt-4 flex items-start gap-3 text-bone/80">
                  <MapPin size={16} className="mt-1" />
                  上海市,徐汇区
                  <br />
                  by appointment only
                </p>
              </div>

              <div className="mt-12 border-t border-line pt-8">
                <p className="text-xs tracking-[0.3em] uppercase text-bone-dim">
                  Office hours
                </p>
                <p className="mt-4 text-bone/80">
                  Tue — Fri · 10:00 — 19:00
                </p>
                <p className="text-bone/50">周末回复可能会慢一点</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <p className="mb-4 text-xs tracking-[0.3em] uppercase text-bone-dim">
        {label}
        {required && <span className="ml-2 text-ember">*</span>}
      </p>
      <input
        type={type}
        className="field-line"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-4 text-xs tracking-[0.3em] uppercase text-bone-dim">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full border px-4 py-2 text-xs tracking-[0.18em] uppercase transition-colors ${
              value === o
                ? 'border-bone bg-bone text-ink'
                : 'border-line text-bone/70 hover:border-bone/60 hover:text-bone'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
