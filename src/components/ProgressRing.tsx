/**
 * 进度环（design.md 6.4）
 * SVG 双环：底环 + 进度环（圆角线帽），中心 Cormorant Garamond 百分比数字。
 * 尺寸建议：大号 120（首页）、中号 64（卡片）、小号 28（导航）。
 */
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ProgressRingProps {
  percent: number; // 0–100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  /** 中心是否显示百分比数字 */
  showLabel?: boolean;
  labelClassName?: string;
  className?: string;
}

export default function ProgressRing({
  percent,
  size = 64,
  strokeWidth = 4,
  color = 'var(--teal)',
  trackColor = 'var(--paper-dark)',
  showLabel = true,
  labelClassName = '',
  className = '',
}: ProgressRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const target = c * (1 - Math.min(100, Math.max(0, percent)) / 100);

  return (
    <div
      ref={ref}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`进度 ${percent}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={inView ? { strokeDashoffset: target } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {showLabel && (
        <span
          className={`absolute inset-0 flex items-center justify-center font-display font-semibold ${labelClassName}`}
          style={{ color, fontSize: Math.max(10, size * 0.24) }}
        >
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}
