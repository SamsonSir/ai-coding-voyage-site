/**
 * S1 · 页头（design/path.md）
 * 英文小字 + H1「学习航线图」+ 副标题 + 快捷锚点胶囊（滚动监听高亮）。
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PATH_ANCHORS } from './stations';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
/** H1 词级拆分 */
const TITLE_WORDS = ['学习', '航线图'];

export default function PathHeader() {
  const [activeId, setActiveId] = useState<string>('station-1');

  // 滚动监听：当前进入视口的段落对应胶囊高亮
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    );
    for (const anchor of PATH_ANCHORS) {
      const el = document.getElementById(anchor.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-wide px-5 pb-16 pt-16 text-center md:px-8 md:pt-20 lg:px-12">
        {/* 英文小字 */}
        <motion.p
          className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-ink-faint md:text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          The Learning Route
        </motion.p>

        {/* H1 词级淡入上移 */}
        <h1
          className="mt-3 font-serif text-3xl font-bold tracking-[0.02em] text-ink md:text-[44px] md:leading-[1.2]"
          aria-label="学习航线图"
        >
          {TITLE_WORDS.map((word, i) => (
            <motion.span
              key={word}
              aria-hidden
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.08, duration: 0.5, ease: EASE }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* 副标题 */}
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-[15px] text-ink-soft md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
        >
          一条被验证过的航线：先建立认知，再动手实操，补好内功，深入实战，持续跟踪新内容。
        </motion.p>

        {/* 快捷锚点胶囊（stagger 0.06s 淡入，delay 0.4s） */}
        <nav
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          aria-label="页面内导航"
        >
          {PATH_ANCHORS.map((anchor, i) => {
            const active = activeId === anchor.id;
            return (
              <motion.button
                key={anchor.id}
                type="button"
                onClick={() => scrollTo(anchor.id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                  active
                    ? 'border-teal bg-teal text-white shadow-card'
                    : 'border-line bg-paper-deep text-ink-soft hover:border-teal/40 hover:text-teal'
                }`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.4, ease: EASE }}
                aria-current={active ? 'true' : undefined}
              >
                {anchor.label}
              </motion.button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
