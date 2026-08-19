/**
 * 目录页右侧文章卡片（design/catalog.md S2 右栏）
 * - --white 底 / 圆角 12px / 1px --line / padding 24px
 * - 顶部行：序号（板块色 Cormorant 20px）+ 阅读状态标记 + 右上元信息（图 ×n · 约 n 分钟）
 * - 标题 Serif 700 20px（hover teal）；摘要 14px ink-soft 截断 3 行
 * - 底部行：子分类 Badge（仅最新更新）+ 幽灵按钮（开始阅读 → / 重读 → / 继续 →）
 * - lastRead 卡片：顶部金色横幅「上次读到这里」+ 进入页面时金色描边闪烁 2 次
 * - hover：上浮 -4px + shadow-lift（0.25s）
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Images } from 'lucide-react';
import type { ArticleMeta } from '@/data/articles';
import { estimateReadingMinutes } from '@/data/articles';
import type { CategoryMeta } from '@/data/categories';
import { cn } from '@/lib/utils';
import ReadStatusDot from './ReadStatusDot';
import HighlightText from './HighlightText';
import { articleUrl } from './articleRef';
import { useArticleStatus, articleKey } from './articleStatus';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface ArticleCardProps {
  article: ArticleMeta;
  cat: CategoryMeta;
  catIndex: number;
  /** 板块内 1 起始序号 */
  index: number;
  query: string;
  /** 进入页面时需要闪烁定位的 lastRead 文章 key */
  flashKey: string | null;
  /** 入场动画序号（stagger 0.06s，最多前 8 张播放） */
  animIndex: number;
}

export default function ArticleCard({
  article,
  cat,
  catIndex,
  index,
  query,
  flashKey,
  animIndex,
}: ArticleCardProps) {
  const getStatus = useArticleStatus();
  const { status, isLastRead } = getStatus(article);
  const key = articleKey(article);
  const flash = flashKey === key;
  const minutes = estimateReadingMinutes(article.wordCount);

  const cta =
    status === 'reading' ? (
      <span className="font-medium text-vermilion">继续 →</span>
    ) : status === 'read' ? (
      <span className="text-ink-soft underline underline-offset-4 transition-colors group-hover:text-teal">
        重读 →
      </span>
    ) : (
      <span className="text-ink-soft underline underline-offset-4 transition-colors group-hover:text-teal">
        开始阅读 →
      </span>
    );

  return (
    <motion.article
      id={`card-${key}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{
        delay: Math.min(animIndex, 7) * 0.06,
        duration: 0.6,
        ease: EASE,
      }}
      className="relative"
    >
      <motion.div
        animate={
          flash
            ? {
                boxShadow: [
                  '0 0 0 0px rgba(201,162,75,0)',
                  '0 0 0 2.5px rgba(201,162,75,0.9)',
                  '0 0 0 0px rgba(201,162,75,0)',
                  '0 0 0 2.5px rgba(201,162,75,0.9)',
                  '0 0 0 0px rgba(201,162,75,0)',
                ],
              }
            : undefined
        }
        transition={flash ? { duration: 1.6, delay: 0.5, times: [0, 0.25, 0.5, 0.75, 1] } : undefined}
        className="h-full rounded-xl"
      >
        <Link
          to={articleUrl(article)}
          style={{ transitionDuration: '250ms' }}
          className="group flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
        >
          {/* lastRead 金色横幅 */}
          {isLastRead && (
            <span className="absolute -top-2.5 left-5 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white shadow-card">
              上次读到这里
            </span>
          )}
          {/* 顶部行 */}
          <div className="flex items-center gap-3">
            <span
              className="font-display text-xl font-semibold leading-none"
              style={{ color: cat.color }}
            >
              {catIndex + 1}-{index}
            </span>
            <ReadStatusDot status={status} size={14} />
            <span className="ml-auto flex items-center gap-3 text-xs text-ink-faint">
              <span className="flex items-center gap-1">
                <Images className="h-3.5 w-3.5" />图 ×{article.imageCount}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />约 {minutes} 分钟
              </span>
            </span>
          </div>
          {/* 标题 */}
          <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-teal">
            <HighlightText text={article.title} query={query} />
          </h3>
          {/* 摘要 */}
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
            {article.summary}
          </p>
          {/* 底部行 */}
          <div className="mt-4 flex items-center justify-between pt-1">
            {cat.id === 'zuixin' && article.subcat ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium leading-[1.4] tracking-wide"
                style={{ backgroundColor: `${cat.color}1F`, color: cat.color }}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                {article.subcat}
              </span>
            ) : (
              <span className={cn('text-xs text-ink-faint')}>{cat.name}</span>
            )}
            {cta}
          </div>
        </Link>
      </motion.div>
    </motion.article>
  );
}
