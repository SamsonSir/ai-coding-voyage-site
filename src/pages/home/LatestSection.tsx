/**
 * S5 · 新内容速览「新大陆快报」（design/home.md）
 * 左侧标题区 + 右侧横向 snap 滑动卡片区（隐藏滚动条、左右渐变遮罩）。
 */
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Check } from 'lucide-react';
import { articleUrl, getLatestArticles } from '@/data/articles';
import { useProgress } from '@/contexts/ProgressContext';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function LatestSection() {
  const navigate = useNavigate();
  const { isRead } = useProgress();
  const latest = getLatestArticles(9);

  return (
    <section className="bg-paper-deep py-24 md:py-32">
      <div className="mx-auto flex max-w-wide flex-col gap-12 px-5 md:px-8 lg:flex-row lg:items-center lg:gap-16 lg:px-12">
        {/* 左侧标题区 */}
        <motion.div
          className="lg:w-1/3"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-vermilion">
            New Horizons 2026
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-ink md:text-4xl">最新更新</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base">
            今年新到的 9 份资料：快速入门、海外 AI 产品、商业化、学员分享、项目实战。
          </p>
          <button
            type="button"
            onClick={() => navigate('/catalog?cat=zuixin')}
            className="mt-6 rounded-full border-[1.5px] border-teal px-6 py-2.5 text-sm font-medium text-teal transition-colors duration-200 hover:bg-teal-mist"
          >
            查看全部 →
          </button>
        </motion.div>

        {/* 右侧横滑卡片区 */}
        <motion.div
          className="relative min-w-0 lg:w-2/3"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
        >
          {/* 左右渐变遮罩 */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-paper-deep to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-paper-deep to-transparent" aria-hidden />

          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
            {latest.map((a) => {
              const read = isRead(a.id);
              return (
                <Link
                  key={a.id}
                  to={articleUrl(a)}
                  className="group flex h-[280px] w-[200px] shrink-0 snap-start flex-col rounded-xl border border-line bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift md:w-60"
                >
                  <span
                    className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: '#C4553B1F', color: 'var(--cat-zuixin)' }}
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-cat-zuixin" />
                    {a.subcat ?? '最新更新'}
                  </span>
                  <h3 className="mt-3 line-clamp-2 font-serif text-lg font-bold leading-snug text-ink">
                    {read && (
                      <span
                        className="mr-1.5 inline-flex h-4 w-4 translate-y-[2px] items-center justify-center rounded-full bg-vermilion"
                        title="已读"
                      >
                        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      </span>
                    )}
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-ink-soft">
                    {a.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3 text-xs text-ink-faint">
                    <span>{a.date}</span>
                    {a.imageCount > 0 && (
                      <span className="flex items-center gap-1 text-teal">
                        <ImageIcon className="h-3.5 w-3.5" />
                        图文
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
