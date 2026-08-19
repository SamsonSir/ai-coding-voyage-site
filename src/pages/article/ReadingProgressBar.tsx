/**
 * 阅读进度条（article.md S0）
 * 3px 高 fixed top-0，teal 填充，scaleX 跟随页面滚动百分比；
 * 右端衔接 vermilion 小圆点作为「船头」。transform 实现，无重排。
 */
import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function ReadingProgressBar() {
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 140, damping: 28, mass: 0.4 });
  const dotX = useTransform(smooth, (v) => `calc(${(v * 100).toFixed(3)}vw - 11px)`);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // 正文异步加载后页面高度变化，需重新计算
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [progress]);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-teal"
        style={{ scaleX: smooth }}
        aria-hidden
      />
      <motion.div
        className="fixed left-[11px] top-0 z-[80] h-[11px] w-[11px] -translate-y-[4px] rounded-full bg-vermilion shadow-[0_0_6px_rgba(196,85,59,0.6)]"
        style={{ x: dotX }}
        aria-hidden
      />
    </>
  );
}
