/**
 * 字符级拆分动画（Display 标题用，≤20 字）：
 * 每字 y 40→0 + opacity 0→1 + rotateX 30°→0°，stagger 0.04s。
 */
import { motion } from 'framer-motion';

interface SplitCharsProps {
  text: string;
  delay?: number;
  className?: string;
}

export default function SplitChars({ text, delay = 0, className = '' }: SplitCharsProps) {
  return (
    <span className={className} aria-label={text} style={{ perspective: 600 }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: 40, rotateX: 30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  );
}
