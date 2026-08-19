/**
 * S1 · Hero「起航宣言」（design/home.md）
 * 全屏 100dvh（最小 640px），hero-map-bg.png 低透明度 + 视差，罗盘装饰缓慢旋转。
 * 覆盖式导航出血：用 -mt-[72px] 抵消 Layout 的顶部内边距。
 */
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Anchor } from 'lucide-react';
import ProgressRing from '@/components/ProgressRing';
import { useProgress } from '@/contexts/ProgressContext';
import { ARTICLE_MAP } from '@/data/articles';
import { TOTAL_ARTICLES } from '@/data/categories';
import SplitChars from '@/pages/home/SplitChars';
import { publicUrl } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { readCount, lastRead, overallProgress } = useProgress();

  // 背景地图视差：滚动时 translateY 为滚动量的 0.3 倍
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const lastTitle = lastRead ? ARTICLE_MAP[lastRead.slug]?.title : undefined;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      ref={ref}
      className="relative -mt-[72px] flex items-center overflow-hidden pt-[72px]"
      style={{ minHeight: 'max(640px, 100dvh)' }}
    >
      {/* 背景航海图（opacity 0.14 + 视差） */}
      <motion.div className="absolute inset-0 -z-10" style={{ y: bgY }} aria-hidden>
        <img
          src={publicUrl('/hero-map-bg.png')}
          alt=""
          className="h-[115%] w-full object-cover opacity-[0.14]"
        />
      </motion.div>

      {/* 装饰罗盘（480px，opacity 0.1，60s 一圈） */}
      <img
        src={publicUrl('/logo-compass.svg')}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-28 -top-28 -z-10 h-[480px] w-[480px] animate-spin-slow opacity-10"
      />

      <div className="mx-auto w-full max-w-wide px-5 py-20 md:px-8 lg:px-12">
        <div className="max-w-[58%] max-md:max-w-full">
          {/* 英文小字 */}
          <motion.p
            className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-ink-faint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Set Sail with AI · 从零基础到出海变现
          </motion.p>

          {/* 主标题（Display 64px Serif 900，字符级拆分） */}
          <h1 className="mt-6 font-serif text-4xl font-black leading-[1.15] tracking-[0.02em] text-ink md:text-6xl lg:text-[64px]">
            <SplitChars text="你的 AI 编程" delay={0.15} className="block" />
            <span className="relative mt-1 inline-block">
              <SplitChars text="航海图" delay={0.45} className="text-vermilion" />
              {/* 手绘金色波浪下划线（描边动画 1s delay 0.8s） */}
              <svg
                viewBox="0 0 180 12"
                className="absolute -bottom-3 left-0 w-full"
                aria-hidden
              >
                <motion.path
                  d="M4 8 Q 26 2 48 7 T 92 7 T 136 7 T 176 6"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 1, ease: EASE }}
                />
              </svg>
            </span>
          </h1>

          {/* 副标题 */}
          <motion.p
            className="mt-8 max-w-[520px] text-base leading-[1.85] text-ink-soft md:text-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
          >
            66 篇实战教程 · 5 大篇章 · 1 条清晰航线。从商业认知到动手实操，从技术内功到登录支付变现——把
            51 份散落资料，整理成一趟看得见的旅程。
          </motion.p>

          {/* 双按钮 */}
          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
          >
            <button
              type="button"
              onClick={() => scrollTo('voyage')}
              className="group rounded-full bg-vermilion px-7 py-3.5 text-base font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-vermilion-soft active:scale-[0.98]"
            >
              开始航行
              <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
            <Link
              to="/catalog"
              className="rounded-full border-[1.5px] border-teal px-7 py-3.5 text-base font-medium text-teal transition-colors duration-200 hover:bg-teal-mist"
            >
              查看完整目录
            </Link>
          </motion.div>

          {/* 老学员状态条（有进度时渲染） */}
          {readCount > 0 && (
            <motion.div
              className="mt-10 flex max-w-md items-center gap-4 rounded-xl bg-white p-4 shadow-card"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5, ease: EASE }}
            >
              <ProgressRing percent={overallProgress} size={44} strokeWidth={4} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">
                  已读 {readCount} / {TOTAL_ARTICLES} 篇
                </p>
                {lastTitle && (
                  <p className="mt-0.5 truncate text-xs text-ink-faint">
                    上次读到《{lastTitle}》
                  </p>
                )}
              </div>
              {lastRead && (
                <button
                  type="button"
                  onClick={() => navigate(`/article/${lastRead.slug}`)}
                  className="shrink-0 text-sm font-medium text-ink-soft underline underline-offset-4 transition-colors hover:text-teal"
                >
                  继续学习 →
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* 底部向下锚图标（上下浮动 8px / 1.8s） */}
      <motion.button
        type="button"
        onClick={() => scrollTo('stats')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-faint transition-colors hover:text-teal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        aria-label="向下滚动"
      >
        <Anchor className="h-6 w-6 animate-float-y" />
      </motion.button>
    </section>
  );
}
