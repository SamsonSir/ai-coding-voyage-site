/**
 * S4 · 五大板块卡片「选择你的海域」（design/home.md）
 * 桌面 3+2 居中 / ≥1440px 五列；hover 上浮 + 色条 6→10px；进度条入视口生长。
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/data/categories';
import { estimateCategoryHours } from '@/data/articles';
import { useProgress } from '@/contexts/ProgressContext';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function CategoryCards() {
  const navigate = useNavigate();
  const { getCategoryProgress } = useProgress();

  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-wide px-5 md:px-8 lg:px-12">
        {/* 标题区 */}
        <div className="text-center">
          <motion.p
            className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-ink-faint"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            Five Seas of Learning
          </motion.p>
          <motion.h2
            className="mt-3 font-serif text-3xl font-bold text-ink md:text-4xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ delay: 0.08, duration: 0.6, ease: EASE }}
          >
            五大篇章
          </motion.h2>
        </div>

        {/* 卡片：第一行 3 + 第二行 2 居中（≥1440px 五列） */}
        <div className="mt-14 flex flex-wrap justify-center gap-6">
          {CATEGORIES.map((cat, i) => {
            const prog = getCategoryProgress(cat.id);
            return (
              <motion.article
                key={cat.id}
                className="group w-full max-w-[360px] cursor-pointer overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-[1440px]:w-[calc(20%-20px)]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: EASE }}
                onClick={() => navigate(`/catalog?cat=${cat.id}`)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/catalog?cat=${cat.id}`)}
                aria-label={`进入${cat.name}`}
              >
                {/* 顶部色条（hover 6→10px） */}
                <div
                  className="h-1.5 w-full transition-all duration-250 group-hover:h-2.5"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <img src={cat.icon} alt="" className="h-10 w-10" />
                    <span className="font-display text-[28px] font-semibold leading-none text-ink-faint">
                      {cat.index}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-bold text-ink">{cat.name}</h3>
                  <p className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-ink-faint">
                    {cat.en}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                    {cat.tagline}
                  </p>

                  {/* 元信息行 */}
                  <div className="mt-4 flex items-center gap-3 text-xs text-ink-faint">
                    <span
                      className="rounded-full px-2.5 py-0.5 font-medium"
                      style={{ backgroundColor: `${cat.color}1F`, color: cat.color }}
                    >
                      {cat.count} 篇
                    </span>
                    <span>约 {estimateCategoryHours(cat.id)} 小时</span>
                  </div>

                  {/* 进度条 + 进入 */}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-paper-dark">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${prog.percent}%` }}
                        viewport={{ once: true, margin: '-10% 0px' }}
                        transition={{ duration: 0.8, ease: EASE }}
                      />
                    </div>
                    <span className="shrink-0 text-xs text-ink-faint">
                      已读 {prog.read}/{prog.total}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-medium text-teal">
                    进入
                    <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
