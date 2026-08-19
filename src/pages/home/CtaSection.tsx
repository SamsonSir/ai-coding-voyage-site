/**
 * S6 · 入门指引 CTA「出发前的话」（design/home.md）
 * teal-deep 底 + 上下金色虚线描边，锚图标摇摆，引言词级拆分淡入。
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const QUOTE = '编程不是天赋，是一张可以按图索骥的地图。';

/** 词级拆分（中文按标点/词组切分） */
const WORDS = ['编程', '不是', '天赋，', '是', '一张', '可以', '按图索骥的', '地图。'];

export default function CtaSection() {
  return (
    <section className="relative bg-teal-deep py-20 text-center text-[#EFE7D8] md:py-24">
      {/* 上下金色虚线描边 */}
      <div className="absolute inset-x-0 top-0 border-t border-dashed border-gold/50" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 border-b border-dashed border-gold/50" aria-hidden />

      <div className="mx-auto max-w-read px-5 md:px-8">
        {/* 小锚图标（金色，摇摆 ±6° / 4s） */}
        <svg
          viewBox="0 0 24 24"
          className="mx-auto h-9 w-9 origin-top animate-anchor-sway text-gold"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="12" cy="5" r="2" />
          <line x1="12" y1="7" x2="12" y2="21" />
          <line x1="7" y1="11" x2="17" y2="11" />
          <path d="M4 15 Q4 21 12 20 Q20 21 20 15" />
        </svg>

        {/* 引言（词级拆分淡入） */}
        <h2 className="mt-6 font-serif text-2xl font-bold leading-snug md:text-[28px]" aria-label={QUOTE}>
          {WORDS.map((w, i) => (
            <motion.span
              key={w}
              aria-hidden
              className="inline-block"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ delay: i * 0.03, duration: 0.5, ease: EASE }}
            >
              {w}
            </motion.span>
          ))}
        </h2>

        <motion.p
          className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#EFE7D8]/80 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          建议按 认知 → 基础 → 内功 → 进阶 的顺序学习；零基础先从「快速入门」热身。你的进度会自动保存在这台设备上。
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ delay: 0.45, duration: 0.5, ease: EASE }}
        >
          <Link
            to="/catalog?cat=renzhi"
            className="group rounded-full bg-vermilion px-7 py-3.5 text-base font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-vermilion-soft active:scale-[0.98]"
          >
            从第一站：认知篇开始
            <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            to="/path"
            className="text-sm font-medium text-[#EFE7D8] underline underline-offset-4 transition-colors hover:text-gold"
          >
            查看学习路线图
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
