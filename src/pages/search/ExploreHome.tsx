/**
 * 搜索页空搜索态（design/search.md S4）
 * - 「按板块探索」：五张板块小卡（板块色图标 + 板块名 + 篇数 + 进度条），
 *   点击进 /catalog?cat={}；卡片 stagger 0.08s 淡入上移
 * - 「最近更新」：最新 5 篇文章列表（带日期），stagger 0.05s
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/data/categories';
import { getLatestArticles } from '@/data/articles';
import { useProgress } from '@/contexts/ProgressContext';
import { articleUrl } from '@/pages/catalog/articleRef';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function ExploreHome() {
  const { getCategoryProgress } = useProgress();
  const latest = getLatestArticles(5);

  return (
    <div className="mt-14">
      {/* 按板块探索 */}
      <motion.h2
        className="text-center font-serif text-2xl font-bold text-ink"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        按板块探索
      </motion.h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((cat, i) => {
          const prog = getCategoryProgress(cat.id);
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: EASE }}
            >
              <Link
                to={`/catalog?cat=${cat.id}`}
                className="group block rounded-xl border border-line bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${cat.color}1F` }}
                >
                  <img src={cat.icon} alt="" className="h-6 w-6" />
                </span>
                <p className="mt-3 text-[15px] font-bold text-ink transition-colors group-hover:text-teal">
                  {cat.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-faint">{cat.count} 篇</p>
                <span className="mt-3 block h-1 overflow-hidden rounded-full bg-paper-dark">
                  <motion.span
                    className="block h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${prog.percent}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: EASE }}
                  />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* 最近更新 */}
      <motion.h2
        className="mt-14 text-center font-serif text-2xl font-bold text-ink"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        最近更新
      </motion.h2>
      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white shadow-card">
        {latest.map((a, i) => (
          <motion.li
            key={a.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.4, ease: EASE }}
          >
            <Link
              to={articleUrl(a)}
              className="group flex items-center gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-paper-deep"
            >
              <span className="w-24 shrink-0 font-display text-xs font-medium tracking-wide text-ink-faint">
                {a.date || '——'}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-ink transition-colors group-hover:text-teal">
                {a.title}
              </span>
              {a.subcat && (
                <span className="hidden shrink-0 rounded-full bg-paper-deep px-2.5 py-0.5 text-xs text-ink-soft sm:inline-block">
                  {a.subcat}
                </span>
              )}
              <span className="shrink-0 text-sm text-ink-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-teal">
                →
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
