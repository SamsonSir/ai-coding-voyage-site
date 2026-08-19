/**
 * 波浪分隔线（design.md 4.3）：区块之间的 SVG 波浪，缓慢水平漂移（12s 循环）。
 * fill 为衔接的下一个区块的背景色；flip 用于区块底部的镜像。
 */
interface WaveDividerProps {
  fill: string;
  flip?: boolean;
  className?: string;
}

const PERIOD = 480; // 无缝平铺周期
const REPEAT = 6; // 2880 / 480

function buildPath(): string {
  let d = 'M0 48 V28 Q120 4 240 28';
  for (let i = 0; i < PERIOD * REPEAT / PERIOD * 2 - 1; i++) {
    d += ` T${240 + (i + 1) * 240} 28`;
  }
  d += ` V48 Z`;
  return d;
}

export default function WaveDivider({ fill, flip = false, className = '' }: WaveDividerProps) {
  return (
    <div
      className={`relative h-12 w-full overflow-hidden ${flip ? 'rotate-180' : ''} ${className}`}
      aria-hidden
    >
      <div className="absolute inset-y-0 left-0 w-[200%] animate-wave-drift">
        <svg
          viewBox={`0 0 ${PERIOD * REPEAT} 48`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path d={buildPath()} fill={fill} />
        </svg>
      </div>
    </div>
  );
}
