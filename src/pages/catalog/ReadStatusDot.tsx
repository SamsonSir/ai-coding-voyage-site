/**
 * 阅读状态标记（design.md 6.5，目录页 / 搜索页共用）
 * - 未读：空心圆（1.5px --line 描边）
 * - 已读：vermilion 实心圆 + 白色对勾
 * - 在读（lastRead）：金色脉冲圆点（scale 1↔1.15，2s 循环）
 */
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ReadStatus = 'unread' | 'read' | 'reading';

interface ReadStatusDotProps {
  status: ReadStatus;
  /** 圆点直径 px，默认 14 */
  size?: number;
  className?: string;
}

const LABELS: Record<ReadStatus, string> = {
  unread: '未读',
  read: '已读',
  reading: '在读',
};

export default function ReadStatusDot({ status, size = 14, className = '' }: ReadStatusDotProps) {
  if (status === 'read') {
    return (
      <span
        role="img"
        aria-label={LABELS.read}
        title={LABELS.read}
        className={cn('inline-flex shrink-0 items-center justify-center rounded-full bg-vermilion', className)}
        style={{ width: size, height: size }}
      >
        <Check style={{ width: size * 0.62, height: size * 0.62 }} className="text-white" strokeWidth={3} />
      </span>
    );
  }
  if (status === 'reading') {
    return (
      <span
        role="img"
        aria-label={LABELS.reading}
        title={LABELS.reading}
        className={cn('inline-block shrink-0 animate-pulse-dot rounded-full bg-gold', className)}
        style={{ width: size, height: size, boxShadow: '0 0 0 3px rgba(201,162,75,0.22)' }}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={LABELS.unread}
      title={LABELS.unread}
      className={cn('inline-block shrink-0 rounded-full border-[1.5px] border-line bg-transparent', className)}
      style={{ width: size, height: size }}
    />
  );
}
