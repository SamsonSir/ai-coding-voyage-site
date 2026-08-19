/**
 * 搜索结果卡片（design/search.md S3）
 * - padding 20px 24px / --white 底 / 圆角 12px / 1px --line
 * - 顶行：板块 Badge + 子分类 Badge + 右侧阅读状态点 + 时长
 * - 标题 Serif 700 20px，匹配关键词 gold 底色高亮
 * - 摘要 14px ink-soft 2 行截断；若匹配在摘要而不在标题，截取以匹配处为中心
 * - 底行：序号（如「内功篇 · 第 5 课」）+ 「阅读 →」幽灵按钮
 * - hover：上浮 -3px + shadow-lift
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import CategoryBadge from '@/components/CategoryBadge';
import type { ArticleMeta } from '@/data/articles';
import { articles, estimateReadingMinutes } from '@/data/articles';
import { CATEGORY_MAP } from '@/data/categories';
import HighlightText from '@/pages/catalog/HighlightText';
import ReadStatusDot from '@/pages/catalog/ReadStatusDot';
import { articleUrl } from '@/pages/catalog/articleRef';
import { useArticleStatus } from '@/pages/catalog/articleStatus';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** 摘要展示：若关键词命中摘要，截取以匹配处为中心的片段 */
function excerpt(summary: string, query: string): string {
  const q = query.trim().toLowerCase();
  if (!q) return summary;
  const idx = summary.toLowerCase().indexOf(q);
  if (idx < 0) return summary;
  const start = Math.max(0, idx - 30);
  const end = Math.min(summary.length, idx + q.length + 70);
  return `${start > 0 ? '…' : ''}${summary.slice(start, end)}${end < summary.length ? '…' : ''}`;
}

/** 板块内 1 起始序号 */
function seqInCategory(article: ArticleMeta): number {
  const inCat = articles
    .filter((a) => a.category === article.category)
    .sort((a, b) => a.order - b.order);
  return inCat.findIndex((a) => a.id === article.id) + 1;
}

interface ResultCardProps {
  article: ArticleMeta;
  query: string;
  /** stagger 序号（0.06s，最多前 8 张播放动画，其余直接显示） */
  animIndex: number;
}

export default function ResultCard({ article, query, animIndex }: ResultCardProps) {
  const getStatus = useArticleStatus();
  const { status } = getStatus(article);
  const cat = CATEGORY_MAP[article.category];
  const minutes = estimateReadingMinutes(article.wordCount);

  const q = query.trim();
  const titleHit = q ? article.title.toLowerCase().includes(q.toLowerCase()) : false;
  const summaryText = titleHit ? article.summary : excerpt(article.summary, query);
  const seq = seqInCategory(article);

  return (
    <motion.div
      initial={animIndex < 8 ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(animIndex, 7) * 0.06, duration: 0.5, ease: EASE }}
    >
      <Link
        to={articleUrl(article)}
        className="group block rounded-xl border border-line bg-white px-6 py-5 shadow-card transition-all duration-200 hover:-translate-y-[3px] hover:shadow-lift"
      >
        {/* 顶行 */}
        <div className="flex items-center gap-2">
          <CategoryBadge category={article.category} />
          {article.subcat && (
            <span className="inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-xs font-medium leading-[1.4] text-ink-soft">
              {article.subcat}
            </span>
          )}
          <span className="ml-auto flex items-center gap-2.5 text-xs text-ink-faint">
            <ReadStatusDot status={status} size={12} />
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />约 {minutes} 分钟
            </span>
          </span>
        </div>
        {/* 标题 */}
        <h3 className="mt-2.5 font-serif text-xl font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-teal">
          <HighlightText text={article.title} query={query} />
        </h3>
        {/* 摘要 */}
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          <HighlightText text={summaryText} query={query} />
        </p>
        {/* 底行 */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-ink-faint">
            {cat.name} · 第 {seq} 课
          </span>
          <span className="text-sm text-ink-soft underline underline-offset-4 transition-colors group-hover:text-teal">
            阅读 →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
