/**
 * 板块标签 Badge（design.md 6.3）
 * 12px 胶囊：板块色 12% 透明度底 + 板块色文字 + 左侧 6px 圆点。
 */
import type { CategoryId } from '@/data/categories';
import { CATEGORY_MAP } from '@/data/categories';

interface CategoryBadgeProps {
  category: CategoryId;
  /** 额外展示文字（默认板块中文名） */
  label?: string;
  className?: string;
}

export default function CategoryBadge({ category, label, className = '' }: CategoryBadgeProps) {
  const meta = CATEGORY_MAP[category];
  if (!meta) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium leading-[1.4] tracking-wide ${className}`}
      style={{ backgroundColor: `${meta.color}1F`, color: meta.color }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {label ?? meta.name}
    </span>
  );
}
