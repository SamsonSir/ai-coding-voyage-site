/**
 * 篇尾操作区 + 同板块推荐（article.md S5 / S6）
 * 1. 标记已读卡：未读 → teal-mist 卡 + 主按钮（点击对勾回弹 + 金色撒花微粒子 0.8s）；
 *    已读 → vermilion 浅底状态卡 + 「取消标记」幽灵按钮。
 * 2. 上一篇 / 下一篇：跨板块按全站顺序衔接，跨板块卡标注板块名；最后一篇显示「回到目录」。
 * 3. 同板块推荐：3 张小卡（未读优先）。
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Compass, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArticleMeta } from '@/data/articles';
import { articleUrl, estimateReadingMinutes, getArticlesByCategory } from '@/data/articles';
import { CATEGORY_MAP } from '@/data/categories';
import { useProgress } from '@/contexts/ProgressContext';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SPRING: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

/* ---------------- 撒花微粒子（10 枚金色小圆点扩散 0.8s） ---------------- */

interface BurstDot {
  x: number;
  y: number;
  size: number;
  delay: number;
}

/** 在事件回调中生成（保持 render 纯净） */
function makeBurstDots(): BurstDot[] {
  return Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.6;
    const dist = 26 + Math.random() * 26;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 4 + Math.random() * 4,
      delay: Math.random() * 0.08,
    };
  });
}

function ConfettiBurst({ dots, onDone }: { dots: BurstDot[]; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 900);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden>
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full bg-gold"
          style={{ width: d.size, height: d.size, marginLeft: -d.size / 2, marginTop: -d.size / 2 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: d.x, y: d.y, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.8, delay: d.delay, ease: 'easeOut' }}
        />
      ))}
    </span>
  );
}

/* ---------------- 标记已读卡 ---------------- */

function MarkReadCard({ slug }: { slug: string }) {
  const { isRead, markRead, markUnread, overallProgress } = useProgress();
  const read = isRead(slug);
  const [burst, setBurst] = useState<BurstDot[] | null>(null);

  const handleMark = () => {
    markRead(slug);
    setBurst(makeBurstDots());
  };

  return (
    <div
      className={cn(
        'relative overflow-visible rounded-xl border p-6 transition-colors duration-300',
        read
          ? 'border-vermilion/30 bg-vermilion/[0.07]'
          : 'border-teal/20 bg-teal-mist',
      )}
    >
      <AnimatePresence>
        {burst && <ConfettiBurst dots={burst} onDone={() => setBurst(null)} />}
      </AnimatePresence>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {read ? (
            <motion.span
              key="done"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-vermilion"
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.45, ease: SPRING }}
            >
              <Check className="h-4.5 w-4.5 text-white" strokeWidth={3} />
            </motion.span>
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/15">
              <PartyPopper className="h-4 w-4 text-teal" />
            </span>
          )}
          <div>
            <p className="font-serif text-lg font-bold text-ink">
              {read ? '已读完' : '读完了？打个卡'}
            </p>
            <p className="mt-0.5 text-[13px] text-ink-soft">
              {read
                ? `本篇已收入航海日志 · 总进度 ${overallProgress}%`
                : '标记已读，全站进度同步更新'}
            </p>
          </div>
        </div>
        {read ? (
          <button
            type="button"
            onClick={() => markUnread(slug)}
            className="text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-teal"
          >
            取消标记
          </button>
        ) : (
          <motion.button
            type="button"
            onClick={handleMark}
            className="rounded-full bg-vermilion px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-vermilion-soft"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            标记为已读
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* ---------------- 上一篇 / 下一篇 ---------------- */

interface NavCardProps {
  dir: 'prev' | 'next';
  article: ArticleMeta | null;
  currentCategory: ArticleMeta['category'];
}

function NavCard({ dir, article, currentCategory }: NavCardProps) {
  const Icon = dir === 'prev' ? ArrowLeft : ArrowRight;
  const label = dir === 'prev' ? '上一篇' : '下一篇';

  if (!article) {
    // 航线的起点/终点 → 回到目录
    return (
      <Link
        to="/catalog"
        className="group flex h-full flex-col rounded-xl border border-dashed border-line bg-paper-deep/60 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-card"
      >
        <span
          className={cn(
            'flex items-center gap-1.5 text-xs text-ink-faint',
            dir === 'next' && 'flex-row-reverse',
          )}
        >
          <Icon
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-200',
              dir === 'prev'
                ? 'group-hover:-translate-x-1.5'
                : 'group-hover:translate-x-1.5',
            )}
          />
          {label}
        </span>
        <span className="mt-2.5 flex items-center gap-2 font-serif text-lg font-bold text-ink-soft transition-colors group-hover:text-teal">
          <Compass className="h-4 w-4" />
          回到目录
        </span>
      </Link>
    );
  }

  const crossCategory = article.category !== currentCategory;
  const catMeta = CATEGORY_MAP[article.category];

  return (
    <Link
      to={articleUrl(article)}
      className={cn(
        'group flex h-full flex-col rounded-xl border border-line bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift',
        dir === 'next' && 'text-right',
      )}
    >
      <span
        className={cn(
          'flex items-center gap-1.5 text-xs text-ink-faint',
          dir === 'next' && 'flex-row-reverse',
        )}
      >
        <Icon
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            dir === 'prev'
              ? 'group-hover:-translate-x-1.5'
              : 'group-hover:translate-x-1.5',
          )}
        />
        {label}
        {crossCategory && (
          <span className="font-medium" style={{ color: catMeta.color }}>
            · {catMeta.name}
          </span>
        )}
      </span>
      <span className="mt-2.5 line-clamp-2 font-serif text-lg font-bold leading-[1.5] text-ink transition-colors group-hover:text-teal">
        {article.title}
      </span>
    </Link>
  );
}

/* ---------------- 同板块推荐 ---------------- */

function Recommendations({ current }: { current: ArticleMeta }) {
  const { isRead } = useProgress();
  const recs = useMemo(() => {
    const pool = getArticlesByCategory(current.category).filter(
      (a) => a.id !== current.id,
    );
    const unread = pool.filter((a) => !isRead(a.id));
    const read = pool.filter((a) => isRead(a.id));
    return [...unread, ...read].slice(0, 3);
  }, [current, isRead]);

  if (recs.length === 0) return null;

  return (
    <section aria-label="同板块推荐">
      <h2 className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-ink-faint">
        More from this sea · 同板块推荐
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {recs.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
          >
            <Link
              to={articleUrl(a)}
              className="group flex h-full flex-col rounded-xl border border-line bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <span
                className="font-display text-2xl font-semibold"
                style={{ color: CATEGORY_MAP[a.category].color }}
              >
                {String(a.order).padStart(2, '0')}
              </span>
              <span className="mt-2 line-clamp-2 font-serif text-[15px] font-bold leading-[1.5] text-ink transition-colors group-hover:text-teal">
                {a.title}
              </span>
              <span className="mt-auto pt-3 text-xs text-ink-faint">
                约 {estimateReadingMinutes(a.wordCount)} 分钟
                {isRead(a.id) && ' · 已读'}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 篇尾总装 ---------------- */

interface ArticleFooterProps {
  meta: ArticleMeta;
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
}

export default function ArticleFooter({ meta, prev, next }: ArticleFooterProps) {
  return (
    <motion.footer
      className="mt-16"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } },
      }}
    >
      <motion.div
        variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
      >
        <MarkReadCard slug={meta.id} />
      </motion.div>

      <motion.div
        className="mt-6 grid gap-4 sm:grid-cols-2"
        variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
      >
        <NavCard dir="prev" article={prev} currentCategory={meta.category} />
        <NavCard dir="next" article={next} currentCategory={meta.category} />
      </motion.div>

      <motion.div
        className="mt-14"
        variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
      >
        <Recommendations current={meta} />
      </motion.div>
    </motion.footer>
  );
}
