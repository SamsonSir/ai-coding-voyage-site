/**
 * S5 · 行动 CTA（design/path.md）
 * teal-deep 底全宽区块，顶部 SVG 波浪与 S4（paper-deep）衔接；
 * 标题词级淡入 + 双按钮 stagger + 半透明星星缓慢闪烁（隔离 memo 微组件）。
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
/** 标题词级拆分 */
const TITLE_WORDS = ['准备', '好了', '就', '出发'];

/** 顶部波浪（与 S4 paper-deep 衔接，缓慢水平漂移 12s） */
function TopWave() {
  const PERIOD = 480;
  const REPEAT = 6;
  let d = 'M0 60 V34 Q120 10 240 34';
  for (let i = 0; i < REPEAT * 2 - 1; i++) {
    d += ` T${240 + (i + 1) * 240} 34`;
  }
  d += ' V60 Z';
  return (
    <div className="relative h-12 w-full overflow-hidden bg-paper-deep md:h-14" aria-hidden>
      <div className="absolute inset-y-0 left-0 w-[200%] animate-wave-drift">
        <svg
          viewBox={`0 0 ${PERIOD * REPEAT} 60`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path d={d} fill="var(--teal-deep)" />
        </svg>
      </div>
    </div>
  );
}

/** 星星闪烁（opacity 0.3↔0.7，错相 3s 循环）—— memo 隔离，避免父级重渲染重置动画 */
const Stars = memo(function Stars() {
  const stars = [
    { left: '12%', top: '22%', size: 14, delay: 0 },
    { left: '24%', top: '64%', size: 10, delay: 0.75 },
    { left: '78%', top: '28%', size: 12, delay: 1.5 },
    { left: '88%', top: '66%', size: 9, delay: 2.25 },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          className="pointer-events-none absolute text-gold"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          fill="currentColor"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
          aria-hidden
        >
          <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
        </motion.svg>
      ))}
    </>
  );
});

export default function PathCta() {
  return (
    <div className="bg-paper-deep">
      <TopWave />
      <section className="relative overflow-hidden bg-teal-deep pb-24 pt-10 text-center text-[#EFE7D8] md:pb-28">
        <Stars />

        <div className="relative mx-auto max-w-read px-5 md:px-8">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-[#EFE7D8]/60">
            Set Sail
          </p>
          {/* 标题词级淡入（0.5s） */}
          <h2
            className="mt-3 font-serif text-2xl font-bold tracking-[0.02em] text-white md:text-[32px]"
            aria-label="准备好了就出发"
          >
            {TITLE_WORDS.map((word, i) => (
              <motion.span
                key={word}
                aria-hidden
                className="inline-block"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20% 0px' }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <motion.p
            className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#EFE7D8]/80 md:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            进度自动保存在本地设备，随时可以回来继续。
          </motion.p>

          {/* 双按钮（stagger 0.1s） */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
            >
              <Link
                to="/catalog?cat=renzhi"
                className="group inline-block rounded-full bg-vermilion px-7 py-3.5 text-base font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-vermilion-soft active:scale-[0.98]"
              >
                从第一站开始
                <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
            >
              <Link
                to="/catalog"
                className="inline-block rounded-full border-[1.5px] border-[#EFE7D8]/70 px-7 py-3.5 text-base font-medium text-[#EFE7D8] transition-all duration-200 hover:-translate-y-px hover:border-white hover:bg-white/10 active:scale-[0.98]"
              >
                回到目录浏览
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
