/**
 * S2 · 数据总览条「航海日志」（design/home.md）
 * 四张数据卡 + 金色虚线航线 + 数字滚动计数（进入视口 25% 触发）。
 */
import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useProgress } from '@/contexts/ProgressContext';
import { CATEGORIES, TOTAL_ARTICLES } from '@/data/categories';
import { CATEGORY_MAP } from '@/data/categories';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function CountUp({
  value,
  suffix = '',
  color,
  className = '',
}: {
  value: number;
  suffix?: string;
  color?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-25% 0px' });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.2, ease: EASE });
    return () => controls.stop();
  }, [inView, value, mv]);

  return (
    <motion.span ref={ref} className={className} style={{ color }}>
      {display}
    </motion.span>
  );
}

export default function StatsBar() {
  const { overallProgress } = useProgress();

  const stats = [
    { value: TOTAL_ARTICLES, label: '实战教程', color: 'var(--teal-deep)' },
    { value: CATEGORIES.length, label: '学习篇章', color: 'var(--teal-deep)' },
    { value: CATEGORY_MAP.zuixin.count, label: '2026 最新更新', color: 'var(--teal-deep)' },
    { value: overallProgress, label: '我的学习进度', suffix: '%', color: 'var(--vermilion)' },
  ];

  return (
    <section id="stats" className="relative bg-paper py-16 md:py-20">
      <div className="mx-auto max-w-wide px-5 md:px-8 lg:px-12">
        {/* 金色虚线航线 + 锚/帆点缀 */}
        <div className="mb-10 flex items-center gap-6" aria-hidden>
          <motion.span
            className="h-px flex-1 origin-left border-t-2 border-dashed border-gold/70"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 1.5, ease: EASE }}
          />
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="5" r="2" />
            <line x1="12" y1="7" x2="12" y2="21" />
            <line x1="7" y1="11" x2="17" y2="11" />
            <path d="M4 15 Q4 21 12 20 Q20 21 20 15" />
          </svg>
          <motion.span
            className="h-px flex-1 origin-right border-t-2 border-dashed border-gold/70"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 1.5, ease: EASE }}
          />
        </div>

        {/* 四张数据卡 */}
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className={`flex flex-col items-center py-4 ${
                i > 0 ? 'lg:border-l lg:border-line' : ''
              } ${i % 2 === 1 ? 'max-lg:border-l max-lg:border-line' : ''} ${
                i > 1 ? 'max-lg:mt-6 max-lg:border-t max-lg:border-line' : ''
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-25% 0px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
            >
              <CountUp
                value={s.value}
                suffix={s.suffix ?? ''}
                className="font-display text-5xl font-semibold leading-none"
              />
              <span
                className="pointer-events-none absolute font-display text-5xl font-semibold leading-none opacity-0"
                aria-hidden
              />
              <p
                className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-ink-faint"
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
