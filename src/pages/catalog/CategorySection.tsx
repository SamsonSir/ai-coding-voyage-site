/**
 * 目录页右侧板块区块（design/catalog.md S2 右栏）
 * - 区块头：左侧 4px 板块色条（入视口高度 0→100%，0.4s）+ 板块名（Serif 700 28px）
 *   + 英文代号 + 一句话简介 + 右侧「板块进度：x/y」
 * - 卡片网格：≥1024px 两列，移动单列
 */
import { motion } from 'framer-motion';
import type { CategoryMeta } from '@/data/categories';
import type { ArticleMeta } from '@/data/articles';
import { useProgress } from '@/contexts/ProgressContext';
import { cn } from '@/lib/utils';
import ArticleCard from './ArticleCard';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface CategorySectionProps {
  cat: CategoryMeta;
  catIndex: number;
  /** 过滤后展示的文章 */
  items: ArticleMeta[];
  /** 板块全部文章（用于序号与进度） */
  all: ArticleMeta[];
  query: string;
  flashKey: string | null;
  /** 移动端隐藏非当前板块的区块 */
  mobileHidden?: boolean;
}

export default function CategorySection({
  cat,
  catIndex,
  items,
  all,
  query,
  flashKey,
  mobileHidden = false,
}: CategorySectionProps) {
  const { getCategoryProgress } = useProgress();
  const prog = getCategoryProgress(cat.id);

  return (
    <section
      id={`cat-${cat.id}`}
      aria-label={cat.name}
      className={cn('scroll-mt-24', mobileHidden && 'hidden lg:block')}
    >
      {/* 区块头：左侧 4px 色条生长 + 标题淡入 */}
      <div className="flex gap-4">
        <motion.span
          aria-hidden
          className="w-1 shrink-0 rounded-full"
          style={{ backgroundColor: cat.color }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.4, ease: EASE }}
          // 以 scaleY 生长，保持高度自适应
        />
        <div className="flex flex-1 flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <h2 className="font-serif text-[28px] font-bold leading-tight text-ink">
                {cat.name}
              </h2>
              <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-faint">
                {cat.en}
              </span>
            </motion.div>
            <motion.p
              className="mt-1.5 text-sm text-ink-soft"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ delay: 0.08, duration: 0.5, ease: EASE }}
            >
              {cat.tagline}
            </motion.p>
          </div>
          <p className="text-sm text-ink-faint">
            板块进度：
            <span className="font-display text-base font-semibold" style={{ color: cat.color }}>
              {prog.read}/{prog.total}
            </span>
          </p>
        </div>
      </div>

      {/* 卡片网格 */}
      {items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line px-6 py-8 text-center text-sm text-ink-faint">
          该板块暂无匹配文章，调整筛选条件试试。
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {items.map((a, i) => (
            <ArticleCard
              key={a.id}
              article={a}
              cat={cat}
              catIndex={catIndex}
              index={all.findIndex((x) => x.id === a.id) + 1}
              query={query}
              flashKey={flashKey}
              animIndex={i}
            />
          ))}
        </div>
      )}
    </section>
  );
}
