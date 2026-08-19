/**
 * 文章标头（article.md S1）
 * 面包屑 → 板块 Badge + 序号 → 标题（词级拆分 stagger 0.03s，y16→0）
 * → 元信息行 → 摘要（3px 板块色竖线）→ 金色虚线分隔，链式淡入约 1s。
 * 移动端附带「章节 / 目录」两个胶囊按钮（打开底部抽屉）。
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { List, TableOfContents } from 'lucide-react';
import type { ArticleMeta } from '@/data/articles';
import { estimateReadingMinutes } from '@/data/articles';
import type { CategoryMeta } from '@/data/categories';
import CategoryBadge from '@/components/CategoryBadge';
import { splitTitleSegments } from './utils';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** 序号展示：order 0 → 前言；最新更新板块显示子分类；其余「第 n 课」 */
function orderLabel(meta: ArticleMeta): string | null {
  if (meta.category === 'zuixin') return meta.subcat ?? null;
  if (meta.order === 0) return '前言';
  return `第 ${meta.order} 课`;
}

interface ArticleHeaderProps {
  meta: ArticleMeta;
  catMeta: CategoryMeta;
  onOpenChapters: () => void;
  onOpenToc: () => void;
}

export default function ArticleHeader({
  meta,
  catMeta,
  onOpenChapters,
  onOpenToc,
}: ArticleHeaderProps) {
  const segments = splitTitleSegments(meta.title);
  const minutes = estimateReadingMinutes(meta.wordCount);
  const metaBits: string[] = [];
  if (meta.date) metaBits.push(meta.date);
  metaBits.push(`约 ${minutes} 分钟阅读`);
  if (meta.imageCount > 0) metaBits.push(`图 ×${meta.imageCount}`);
  metaBits.push(`字数 ${meta.wordCount.toLocaleString()}`);
  const ordinal = orderLabel(meta);

  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* 面包屑 */}
      <motion.nav
        variants={itemVariants}
        className="text-[13px] leading-[1.4] text-ink-faint"
        aria-label="面包屑"
      >
        <Link to="/catalog" className="transition-colors hover:text-teal">
          目录
        </Link>
        <span className="mx-2">/</span>
        <Link
          to={`/catalog?cat=${catMeta.id}`}
          className="transition-colors hover:text-teal"
        >
          {catMeta.name}
        </Link>
        {meta.subcat && (
          <>
            <span className="mx-2">/</span>
            <span>{meta.subcat}</span>
          </>
        )}
      </motion.nav>

      {/* Badge + 序号 */}
      <motion.div variants={itemVariants} className="mt-5 flex items-center gap-3">
        <CategoryBadge category={catMeta.id} />
        {ordinal && (
          <span
            className="text-[13px] font-medium tracking-wide"
            style={{ color: catMeta.color }}
          >
            {catMeta.name} · {ordinal}
          </span>
        )}
      </motion.div>

      {/* 标题（词级拆分） */}
      <motion.h1
        variants={itemVariants}
        className="mt-4 font-serif text-[28px] font-bold leading-[1.25] tracking-[0.02em] text-ink md:text-[40px]"
      >
        <motion.span
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.03, delayChildren: 0.35 } } }}
          aria-label={meta.title}
        >
          {segments.map((seg, i) => (
            <motion.span
              key={`${seg}-${i}`}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
              }}
              aria-hidden
            >
              {seg}
            </motion.span>
          ))}
        </motion.span>
      </motion.h1>

      {/* 元信息行 */}
      <motion.p
        variants={itemVariants}
        className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-faint"
      >
        {metaBits.map((bit, i) => (
          <span key={bit} className="flex items-center gap-3">
            {i > 0 && <span className="h-1 w-1 rounded-full bg-ink-faint/60" aria-hidden />}
            {bit}
          </span>
        ))}
      </motion.p>

      {/* 摘要 */}
      {meta.summary && (
        <motion.p
          variants={itemVariants}
          className="mt-6 border-l-[3px] pl-4 text-base leading-[1.8] text-ink-soft"
          style={{ borderColor: catMeta.color }}
        >
          {meta.summary}
        </motion.p>
      )}

      {/* 移动端：章节 / 目录胶囊按钮 */}
      <motion.div variants={itemVariants} className="mt-6 flex gap-3 lg:hidden">
        <button
          type="button"
          onClick={onOpenChapters}
          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-teal px-4 py-1.5 text-[13px] font-medium text-teal transition-colors hover:bg-teal-mist"
        >
          <List className="h-3.5 w-3.5" />
          章节
        </button>
        <button
          type="button"
          onClick={onOpenToc}
          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-teal px-4 py-1.5 text-[13px] font-medium text-teal transition-colors hover:bg-teal-mist"
        >
          <TableOfContents className="h-3.5 w-3.5" />
          目录
        </button>
      </motion.div>

      {/* 金色虚线分隔 */}
      <motion.hr
        variants={itemVariants}
        className="mt-8 border-0 border-t-2 border-dashed border-gold opacity-50"
      />
    </motion.header>
  );
}
