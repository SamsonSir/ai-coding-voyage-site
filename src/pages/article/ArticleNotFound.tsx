/**
 * 文章 404 空态（article.md：empty-treasure.svg + 「这座岛屿还没有藏宝图」+ 回到目录）
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export default function ArticleNotFound({ message }: { message?: string | null }) {
  return (
    <motion.div
      className="mx-auto flex max-w-read flex-col items-center px-5 py-24 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <img src="/empty-treasure.svg" alt="" className="h-36 w-auto opacity-90" />
      <h1 className="mt-8 font-serif text-2xl font-bold text-ink md:text-3xl">
        这座岛屿还没有藏宝图
      </h1>
      <p className="mt-3 text-sm text-ink-soft">
        {message ?? '你要找的文章不存在，也许它还在某片未知海域等待被发现。'}
      </p>
      <Link
        to="/catalog"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-vermilion px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-vermilion-soft active:scale-[0.98]"
      >
        <Compass className="h-4 w-4" />
        回到目录
      </Link>
    </motion.div>
  );
}
