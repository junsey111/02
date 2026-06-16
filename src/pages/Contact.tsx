import { Canvas } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import { BigFloatShape, BackgroundDebris } from '../components/three/SceneShell';

/* ============= 联系页面 ============= */
export default function Contact() {
  return (
    <div className="relative min-h-screen bg-ink text-bone">
      {/* 顶部 3D 大标题 —— 暖色 */}
      <div className="pointer-events-none relative h-[75vh] w-full overflow-hidden">
        <Canvas camera={{ position: [0, 0.5, 8], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={['#0a0a0a']} />
          <fog attach="fog" args={['#0a0a0a', 6, 22]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#f4efe6" />
          <directionalLight position={[-5, 2, -5]} intensity={0.5} color="#f4efe6" />
          <BackgroundDebris color="#f4efe6" />
          <BigFloatShape color="#f4efe6" geometry="box" size={2.2} />
        </Canvas>

        <div className="noise-overlay" />

        <div className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-[1600px] items-start justify-between px-6 pt-10 text-[11px] uppercase tracking-[0.3em] text-bone/60 md:px-14">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-bone" />
            <span>03 · Contact</span>
          </div>
          <Link to="/" className="hover:text-ember">← 返回大厅</Link>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-bone/60">Say hello · 2025</p>
          <h1 className="mt-6 font-serif text-[16vw] leading-[0.9] tracking-tight text-bone md:text-[11vw]">
            会客 <span className="italic text-ember">厅</span>。
          </h1>
          <p className="mt-8 max-w-xl text-bone/60">一封信、 一个想法、 一次询问 —— 我都认真回。</p>
        </div>

        <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-[1600px] items-end justify-between px-6 text-[11px] uppercase tracking-[0.3em] text-bone/50 md:px-14">
          <span>Scroll ↓</span>
          <span>Junxi · Studio</span>
          <span>24h reply</span>
        </div>
      </div>

      {/* ============= 主体 ============= */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 py-24 md:px-14">
        <div className="grid gap-16 md:grid-cols-12">
          {/* 左 —— 直接联系 */}
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.3em] text-bone/60">Direct · 直接</p>
            <p className="mt-4 font-serif text-4xl text-bone md:text-5xl">
              写一封 <span className="italic text-ember">长信</span>。
            </p>
            <p className="mt-6 text-bone/70 leading-relaxed">
              我会在 24 小时内回复所有认真写下的邮件。
              如果你愿意, 可以先告诉我:
            </p>
            <ul className="mt-6 space-y-3 text-bone/60">
              <li className="flex gap-4">
                <span className="text-ember">·</span>
                <span>你正在做什么 / 想要做什么</span>
              </li>
              <li className="flex gap-4">
                <span className="text-ember">·</span>
                <span>它的时间与预算(大概也行)</span>
              </li>
              <li className="flex gap-4">
                <span className="text-ember">·</span>
                <span>任何能让我更好理解它的东西 —— 链接、 图片、 一段话</span>
              </li>
            </ul>

            <a
              href="mailto:hello@junxi.studio"
              data-cursor-hover
              className="mt-12 block rounded-sm border border-line px-8 py-6 transition-colors hover:border-bone"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-bone/60">Email · 发邮件</p>
              <p className="mt-3 font-serif text-3xl text-bone hover:text-ember md:text-4xl">
                hello@junxi.studio →
              </p>
            </a>

            <div className="mt-10 grid grid-cols-2 gap-0 border-l border-t border-line">
              {[
                ['Instagram', '@junxi.studio'],
                ['Behance', '/junxi'],
                ['微信', 'WeChat · 可邮件索取'],
                ['地点', '上海 · 全球远程'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="border-b border-r border-line p-6 transition-colors hover:bg-[#0f0f15]"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-bone/50">{k}</p>
                  <p className="mt-3 font-serif text-xl text-bone">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 右 —— 简短问卷 */}
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-xs uppercase tracking-[0.3em] text-bone/60">Quick message · 留句话</p>
            <p className="mt-4 font-serif text-4xl text-bone md:text-5xl">
              或者 <span className="italic text-ember">简短地</span> 留下它。
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('谢谢你 —— 我会回复这个邮箱。');
              }}
              className="mt-10 space-y-8"
            >
              <Field label="你的名字" placeholder="怎么称呼你" required />
              <Field label="你的邮箱" placeholder="name@example.com" type="email" required />

              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-bone/60">
                  项目类型 · Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Brand', 'Editorial', 'Web', 'Packaging', 'Illustration', 'Exhibition', 'Others'].map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        data-cursor-hover
                        className="rounded-full border border-line px-4 py-2 text-xs tracking-[0.2em] uppercase text-bone/70 transition-colors hover:border-bone hover:text-bone"
                      >
                        {c}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-bone/60">
                  预算 · Budget
                </p>
                <div className="flex flex-wrap gap-2">
                  {['< 20k', '20k — 50k', '50k — 100k', '> 100k', '暂不明确'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      data-cursor-hover
                      className="rounded-full border border-line px-4 py-2 text-xs tracking-[0.2em] uppercase text-bone/70 transition-colors hover:border-bone hover:text-bone"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-bone/60">
                  告诉我你的想法 · Message
                </p>
                <textarea
                  rows={5}
                  placeholder="尽量自由地写 —— 一段 / 几段 / 一个词也行。"
                  className="w-full resize-none border-0 border-b border-line bg-transparent pb-4 text-lg text-bone placeholder:text-bone/35 outline-none focus:border-bone"
                />
              </div>

              <button
                type="submit"
                data-cursor-hover
                className="w-full rounded-sm border border-bone bg-bone px-10 py-5 text-lg text-ink transition-colors hover:bg-transparent hover:text-bone"
              >
                <span className="font-serif">发送邮件 · Send →</span>
              </button>

              <p className="text-center text-xs uppercase tracking-[0.3em] text-bone/40">
                提交后,我会在 24 小时内通过你留下的邮箱回复。
              </p>
            </form>
          </div>
        </div>

        {/* 引语 */}
        <p className="mx-auto mt-28 max-w-3xl text-center font-serif text-2xl italic leading-snug text-bone/70 md:text-4xl">
          “ 一个好的合作, 常常从一封真诚的邮件开始。”
        </p>
      </section>

      {/* 底部 —— 循环链接回首页 */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 pb-20 md:px-14">
        <div className="border-t border-line pt-16 text-center">
          <p className="font-serif text-5xl text-bone md:text-7xl">
            ← <Link to="/" className="italic text-ember hover:underline">Back to hall</Link>
          </p>
          <p className="mt-4 text-sm text-bone/50">回到三扇门的起点。</p>
        </div>
      </section>
    </div>
  );
}

/* ============ 通用输入组件 ============ */
function Field({
  label,
  placeholder,
  type = 'text',
  required,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-bone/60">{label}{required && ' ·'}</p>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border-0 border-b border-line bg-transparent pb-4 pt-2 text-xl text-bone placeholder:text-bone/35 outline-none transition-colors focus:border-bone"
      />
    </div>
  );
}
