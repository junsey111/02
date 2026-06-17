import { Link } from 'react-router-dom';

/* ============================================================
   Contact — itomdev 风格的联系页面
   ============================================================ */
export default function Contact() {
  return (
    <div className="bg-[#f4efe6] text-[#1a1a1a]">

      {/* ===== 导航栏 ===== */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[#1a1a1a]/10 bg-[#f4efe6]/95 px-6 py-5 backdrop-blur-sm md:px-14">
        <Link to="/" className="font-serif text-xl text-[#1a1a1a] tracking-tight">
          Junxi<span className="text-[#c74c1c]">.</span>
        </Link>
        <nav className="hidden items-center gap-10 text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a]/50 md:flex">
          <Link to="/" className="hover:text-[#c74c1c]">The Corridor</Link>
          <Link to="/about" className="hover:text-[#c74c1c]">About Me</Link>
          <Link to="/gallery" className="hover:text-[#c74c1c]">Gallery</Link>
          <Link to="/contact" className="text-[#c74c1c]">Contact</Link>
        </nav>
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a]/35">Portfolio · 2025</span>
      </header>

      {/* ===== Contact 大标题 ===== */}
      <section className="mx-auto max-w-[1600px] px-6 pt-44 pb-16 md:px-14 md:pt-52 md:pb-20">
        <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40">
          Contact & Socials
        </p>
        <h1 className="font-serif text-[clamp(3rem,11vw,10rem)] leading-[0.88] tracking-tight text-[#1a1a1a]">
          写一封
          <br />
          <span className="italic text-[#c74c1c]">信</span>给
          <br />
          我。
        </h1>
        <div className="mt-16 border-t border-[#1a1a1a]/20" />
      </section>

      {/* ===== 主体:联系信息 + 表单 ===== */}
      <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-14 md:pb-28">
        <div className="grid gap-20 md:grid-cols-12">

          {/* 左:联系信息 */}
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-8">
              Get in Touch · 联系我
            </p>

            <p className="text-base leading-relaxed text-[#1a1a1a]/70 md:text-lg">
              我会对所有认真写下的邮件在 24 小时内回复。
              如果你愿意,可以在邮件里先告诉我:
            </p>
            <ul className="mt-6 space-y-3 text-[#1a1a1a]/65">
              <li className="flex gap-4"><span className="text-[#c74c1c]">·</span>你正在做什么 / 想要做什么</li>
              <li className="flex gap-4"><span className="text-[#c74c1c]">·</span>大概的时间和预算(不明确也行)</li>
              <li className="flex gap-4"><span className="text-[#c74c1c]">·</span>任何能让我理解它的东西——链接、图片、一段话</li>
            </ul>

            {/* 联系方式矩阵 */}
            <div className="mt-14 grid grid-cols-2 gap-0 border-l border-t border-[#1a1a1a]/20">
              {[
                ['Email', 'hello@junxi.studio'],
                ['Instagram', '@junxi.studio'],
                ['微信', 'WeChat · 可邮件索取'],
                ['地点', '上海 · 全球远程'],
                ['工作时间', '周一至周五 10–18'],
                ['时区', '中国标准时间 CST'],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-r border-[#1a1a1a]/20 p-5 transition hover:bg-[#1a1a1a]/[0.02]">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#1a1a1a]/45">{k}</p>
                  <p className="mt-2 font-serif text-base text-[#1a1a1a]">{v}</p>
                </div>
              ))}
            </div>

            {/* 直接发邮件 */}
            <a
              href="mailto:hello@junxi.studio"
              className="mt-10 inline-flex items-center gap-3 border border-[#1a1a1a] bg-[#1a1a1a] px-8 py-5 text-[11px] uppercase tracking-[0.25em] text-[#f4efe6] transition hover:bg-transparent hover:text-[#1a1a1a]"
            >
              直接发邮件 →
            </a>
          </div>

          {/* 右:简短表单 */}
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-8">
              Quick Message · 简短留言
            </p>
            <p className="mb-10 text-base text-[#1a1a1a]/60">
              或者,就在这里留下一句话。我会回你。
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('谢谢你 —— 我会回复这个邮箱。');
              }}
              className="space-y-10"
            >
              <Field label="你的名字" placeholder="怎么称呼你" required />
              <Field label="你的邮箱" placeholder="name@example.com" type="email" required />

              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/45">
                  项目类型 · Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Brand', 'Editorial', 'Web', 'Packaging', 'Illustration', 'Exhibition', 'Others'].map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        className="rounded-full border border-[#1a1a1a]/25 px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#1a1a1a]/60 transition hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                      >
                        {c}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/45">
                  预算 · Budget
                </p>
                <div className="flex flex-wrap gap-2">
                  {['< 20k', '20k–50k', '50k–100k', '> 100k', '暂不明确'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      className="rounded-full border border-[#1a1a1a]/25 px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#1a1a1a]/60 transition hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/45">
                  想说点什么 · Message
                </p>
                <textarea
                  rows={6}
                  placeholder="随意写——一句话也行,一段也行。"
                  className="w-full resize-none border-0 border-b border-[#1a1a1a]/30 bg-transparent pb-4 text-lg text-[#1a1a1a] placeholder:text-[#1a1a1a]/35 outline-none focus:border-[#1a1a1a]"
                />
              </div>

              <button
                type="submit"
                className="w-full border border-[#1a1a1a] bg-[#1a1a1a] px-10 py-5 text-lg text-[#f4efe6] transition hover:bg-transparent hover:text-[#1a1a1a]"
              >
                <span className="font-serif">发送邮件 · Send →</span>
              </button>

              <p className="text-center text-xs uppercase tracking-[0.2em] text-[#1a1a1a]/30">
                提交后,我会在 24 小时内通过你留下的邮箱回复。
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ===== 合作态度 ===== */}
      <section className="mx-auto max-w-[1600px] px-6 pb-24 md:px-14">
        <div className="border-t border-[#1a1a1a]/20 pt-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-8">
            Availability · 可合作方式
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { t: '独立项目', d: '品牌设计、出版、网站等单次委托。' },
              { t: '长期合作', d: '愿意与有长期需求的品牌或工作室建立持续合作关系。' },
              { t: '跨界合作', d: '对音乐、展览、出版等领域的跨界项目持开放态度。' },
            ].map(({ t, d }) => (
              <div key={t} className="border border-[#1a1a1a]/20 p-8 transition hover:border-[#1a1a1a]/40">
                <p className="font-serif text-xl text-[#1a1a1a]">{t}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#1a1a1a]/60">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 页脚 ===== */}
      <footer className="border-t border-[#1a1a1a]/20 bg-[#1a1a1a]">
        <div className="mx-auto max-w-[1600px] px-6 pb-12 pt-10 md:px-14">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <p className="font-serif text-3xl text-[#f4efe6] md:text-5xl">
              Junxi<span className="text-[#c74c1c]">.</span>
            </p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#f4efe6]/35">
              © 2025 — Designed by Junxi · Built with code.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, placeholder, type = 'text', required }: {
  label: string; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/45">
        {label}{required && ' ·'}
      </p>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border-0 border-b border-[#1a1a1a]/30 bg-transparent pb-4 pt-2 text-xl text-[#1a1a1a] placeholder:text-[#1a1a1a]/35 outline-none focus:border-[#1a1a1a]"
      />
    </div>
  );
}
