/**
 * 搜索页无结果态（design/search.md S5）
 * - 空宝箱 240×180 + H3「这片海域还没有宝藏」+ 说明 + 次按钮「浏览完整目录 →」
 * - 宝箱 scale 0.8→1 回弹（0.5s）；文字淡入（delay 0.2s）；宝箱盖轻微摆动（rotate ±3°，3s 循环）
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { publicUrl } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** 宝箱持续摆动（±3°，3s 循环）——独立 memo 微组件，避免父级重渲染重置动画 */
const SwayingChest = memo(function SwayingChest() {
  return (
    <motion.img
      src={publicUrl('/empty-treasure.svg')}
      alt="空宝箱插画"
      width={240}
      height={180}
      className="mx-auto"
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
});

export default function NoResults() {
  return (
    <div className="mt-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <SwayingChest />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
      >
        <h3 className="mt-6 font-serif text-2xl font-bold text-ink">这片海域还没有宝藏</h3>
        <p className="mt-2 text-sm text-ink-soft">换个关键词试试，或按板块浏览目录。</p>
        <Link
          to="/catalog"
          className="group mt-6 inline-flex items-center gap-2 rounded-lg border-[1.5px] border-teal px-6 py-3 text-sm font-medium text-teal transition-all duration-200 hover:-translate-y-px hover:bg-teal-mist"
        >
          浏览完整目录
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  );
}
