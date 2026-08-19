/**
 * 文章加载骨架屏（article.md：标题条 shimmer + 4 段文字条 + 1 图块）
 * shimmer 扫光 1.5s 循环。
 */
import { memo } from 'react';
import { motion } from 'framer-motion';

/** 扫光条（常驻动画，隔离为 memo 微组件） */
const Shimmer = memo(function Shimmer() {
  return (
    <motion.span
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    />
  );
});

function Bar({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-paper-deep ${className}`}>
      <Shimmer />
    </div>
  );
}

export default function ArticleSkeleton() {
  return (
    <div className="pt-12" aria-busy="true" aria-label="文章加载中">
      {/* 面包屑 + Badge */}
      <Bar className="h-3.5 w-40" />
      <Bar className="mt-5 h-6 w-32 rounded-full" />
      {/* 标题 */}
      <Bar className="mt-5 h-10 w-11/12" />
      <Bar className="mt-3 h-10 w-3/5" />
      {/* 元信息 */}
      <Bar className="mt-5 h-3.5 w-64" />
      {/* 摘要 */}
      <Bar className="mt-6 h-4 w-full" />
      <Bar className="mt-2 h-4 w-4/5" />
      {/* 正文 */}
      <div className="mt-14 space-y-4">
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-11/12" />
        <Bar className="h-4 w-4/6" />
      </div>
      {/* 图块 */}
      <Bar className="mt-8 aspect-video w-full rounded-xl" />
      <div className="mt-8 space-y-4">
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-5/6" />
      </div>
    </div>
  );
}
