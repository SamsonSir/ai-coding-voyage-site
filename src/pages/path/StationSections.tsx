/**
 * S3 · 五站详细说明（design/path.md）
 * 5 个交替段落（奇数段图左文右，偶数段反之），每段 96px 间距。
 * 图侧：板块色渐变浅底站卡（大图标 + 装饰航线 + 序号水印 + 96px 进度环）
 * 文侧：英文代号 / 站名 / 定位语 / 要点清单 / 文章预览（来自 manifest）/ 查看全部
 * 段间：金色「下一站」衔接提示 + 随滚动描边生长的虚线箭头（scrub）
 */
import { Fragment, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import type { CategoryMeta } from '@/data/categories';
import { articleUrl, getArticlesByCategory } from '@/data/articles';
import { useProgress } from '@/contexts/ProgressContext';
import ProgressRing from '@/components/ProgressRing';
import { STATION_COPY, STATION_NAMES } from './stations';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** 阅读状态点：已读 = vermilion 实心，未读 = 空心描边 */
function ReadDot({ read }: { read: boolean }) {
  return read ? (
    <span
      className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-vermilion"
      title="已读"
      aria-label="已读"
    />
  ) : (
    <span
      className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-line"
      title="未读"
      aria-label="未读"
    />
  );
}

/** 段间衔接：金色小字 + 随滚动描边生长的虚线箭头（scrub） */
function StationConnector({ next }: { next: CategoryMeta }) {
  const ref = useRef<HTMLDivElement>(null);
  const maskId = useId();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'end 55%'],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const arrowOpacity = useTransform(scrollYProgress, [0.75, 1], [0, 1]);

  return (
    <div ref={ref} className="flex flex-col items-center py-4" aria-hidden>
      <svg width="60" height="76" viewBox="0 0 60 76" className="text-gold">
        <defs>
          <mask id={maskId}>
            <motion.path
              d="M30 2 C 6 22 54 42 30 66"
              fill="none"
              stroke="#fff"
              strokeWidth={6}
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </mask>
        </defs>
        <path
          d="M30 2 C 6 22 54 42 30 66"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeDasharray="4 6"
          strokeLinecap="round"
          mask={`url(#${maskId})`}
        />
        <motion.path
          d="M23 60 L30 70 L37 60"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: arrowOpacity }}
        />
      </svg>
      <span className="mt-1 text-sm font-medium text-gold">下一站：{next.name} →</span>
    </div>
  );
}

/** 图侧站卡（45%）：板块色渐变浅底 + 大图标 + 装饰航线 + 序号水印 + 进度环 */
function StationCard({ meta, index }: { meta: CategoryMeta; index: number }) {
  const { getCategoryProgress } = useProgress();
  const { percent, read, total } = getCategoryProgress(meta.id);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-line p-8 md:p-10"
      style={{
        background: `linear-gradient(135deg, ${meta.color}14 0%, ${meta.color}08 100%)`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20% 0px' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {/* 大号序号水印（Cormorant 200px，板块色 10%） */}
      <span
        className="pointer-events-none absolute -bottom-12 -right-2 select-none font-display text-[200px] font-semibold leading-none"
        style={{ color: `${meta.color}1A` }}
        aria-hidden
      >
        {meta.index}
      </span>
      {/* 装饰性航线曲线 */}
      <svg
        viewBox="0 0 300 120"
        className="pointer-events-none absolute left-0 top-0 h-32 w-80 text-gold/50"
        fill="none"
        aria-hidden
      >
        <path
          d="M-10 90 C 60 60 110 100 170 70 S 280 30 320 50"
          stroke="currentColor"
          strokeWidth={2}
          strokeDasharray="3 10"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative flex flex-col items-start gap-8">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-card"
          style={{ border: `1.5px solid ${meta.color}33` }}
        >
          <img src={meta.icon} alt="" className="h-16 w-16" />
        </div>
        <div className="flex items-center gap-5">
          <ProgressRing percent={percent} size={96} strokeWidth={7} color={meta.color} />
          <div>
            <p className="text-sm font-medium text-ink">本站在读进度</p>
            <p className="mt-0.5 text-xs text-ink-faint">
              已读 {read}/{total} 篇 · 与全站进度实时联动
            </p>
          </div>
        </div>
      </div>
      <span className="sr-only">
        {STATION_NAMES[index]} {meta.name} 站卡
      </span>
    </motion.div>
  );
}

/** 文侧（55%）：代号 / 站名 / 定位语 / 要点 / 文章预览 / 查看全部 */
function StationBody({ meta, index }: { meta: CategoryMeta; index: number }) {
  const { isRead } = useProgress();
  const copy = STATION_COPY[meta.id];
  const list = getArticlesByCategory(meta.id);
  const preview = list.slice(0, 3);

  return (
    <div>
      <motion.p
        className="font-display text-xs font-semibold uppercase tracking-[0.35em]"
        style={{ color: meta.color }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20% 0px' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {meta.en}
      </motion.p>
      <motion.h2
        className="mt-2 font-serif text-2xl font-bold tracking-[0.02em] text-ink md:text-[32px] md:leading-[1.3]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20% 0px' }}
        transition={{ delay: 0.05, duration: 0.5, ease: EASE }}
      >
        {STATION_NAMES[index]} · {meta.name}
      </motion.h2>
      <motion.p
        className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft md:text-base"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20% 0px' }}
        transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
      >
        {copy.why}
      </motion.p>

      {/* 「你将学会」对勾列表（stagger 0.08s 左滑 24px 淡入） */}
      <ul className="mt-6 space-y-2.5">
        {copy.learn.map((item, i) => (
          <motion.li
            key={item}
            className="flex items-start gap-2.5 text-[15px] text-ink"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: EASE }}
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${meta.color}1A` }}
            >
              <Check className="h-3.5 w-3.5" style={{ color: meta.color }} aria-hidden />
            </span>
            {item}
          </motion.li>
        ))}
      </ul>

      {/* 文章列表预览（最多 3 条，数据来自 manifest） */}
      <motion.div
        className="mt-7 rounded-xl border border-line bg-white p-4 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20% 0px' }}
        transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
      >
        <ul className="divide-y divide-line/70">
          {preview.map((article, i) => (
            <li key={article.id}>
              <Link
                to={articleUrl(article)}
                className="group flex items-center gap-3 py-2.5"
              >
                <span
                  className="font-display text-sm font-semibold"
                  style={{ color: meta.color }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 truncate text-[13px] text-ink-soft transition-colors group-hover:text-teal">
                  {article.title}
                </span>
                <ReadDot read={isRead(article.id)} />
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to={`/catalog?cat=${meta.id}`}
          className="mt-2 inline-block pt-1 text-[13px] font-medium text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-teal hover:decoration-teal"
        >
          查看全部 {list.length} 篇 →
        </Link>
      </motion.div>
    </div>
  );
}

export default function StationSections() {
  return (
    <div className="mx-auto max-w-wide px-5 py-16 md:px-8 md:py-20 lg:px-12">
      {CATEGORIES.map((meta, i) => {
        const reversed = i % 2 === 1;
        return (
          <Fragment key={meta.id}>
            <section
              id={`station-${i + 1}`}
              className="scroll-mt-24"
              aria-label={`${STATION_NAMES[i]} ${meta.name}`}
            >
              <div
                className={`flex flex-col gap-10 lg:items-center lg:gap-14 ${
                  reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                }`}
              >
                <div className="lg:w-[45%] lg:flex-none">
                  <StationCard meta={meta} index={i} />
                </div>
                <div className="lg:w-[55%]">
                  <StationBody meta={meta} index={i} />
                </div>
              </div>
            </section>
            {i < CATEGORIES.length - 1 && (
              <StationConnector next={CATEGORIES[i + 1]} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
