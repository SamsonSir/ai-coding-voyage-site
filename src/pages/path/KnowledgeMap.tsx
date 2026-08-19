/**
 * S4 · 知识架构图「五域知识地图」（design/path.md）
 * 自绘 SVG 架构图（3 层）：
 *   底层（地基）认知篇 → 中层（船体）基础篇 & 内功篇（双向虚线互相支撑）→ 上层（远航）进阶篇
 *   最新更新以虚线大圆环围绕全图（dashoffset 缓慢流动，40s/圈）
 * 节点 hover：放大 1.05 + 高亮相关连线（其余 0.25）+ Tooltip（篇数与进度）；点击跳目录筛选。
 * 动效全部使用 Framer Motion。
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORY_MAP } from '@/data/categories';
import type { CategoryId } from '@/data/categories';
import { getArticlesByCategory } from '@/data/articles';
import { useProgress } from '@/contexts/ProgressContext';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* —— 图几何（viewBox 1000×620）—— */
const NODE_W = 230;
const NODE_H = 84;

interface MapNode {
  id: CategoryId;
  x: number;
  y: number;
  caption: string;
}

const NODES: MapNode[] = [
  { id: 'jinjie', x: 385, y: 80, caption: '变现闭环：登录 / 支付 / 工作流' },
  { id: 'jichu', x: 160, y: 270, caption: '动手实操：做出产品' },
  { id: 'neigong', x: 610, y: 270, caption: '技术内功：船体加固' },
  { id: 'renzhi', x: 385, y: 470, caption: '商业认知：为什么做' },
];

interface MapEdge {
  key: string;
  d: string;
  from: CategoryId;
  to: CategoryId;
  /** 渐变起止色 */
  fromColor: string;
  toColor: string;
  /** 双向虚线（基础 ⇄ 内功） */
  dashed?: boolean;
  bidirectional?: boolean;
  label: string;
  labelPos: { x: number; y: number };
}

const EDGES: MapEdge[] = [
  {
    key: 'renzhi-jichu',
    d: 'M 445 468 C 380 420 330 400 300 360',
    from: 'renzhi',
    to: 'jichu',
    fromColor: CATEGORY_MAP.renzhi.color,
    toColor: CATEGORY_MAP.jichu.color,
    label: '认知指导实操',
    labelPos: { x: 296, y: 430 },
  },
  {
    key: 'renzhi-neigong',
    d: 'M 555 468 C 620 420 670 400 700 360',
    from: 'renzhi',
    to: 'neigong',
    fromColor: CATEGORY_MAP.renzhi.color,
    toColor: CATEGORY_MAP.neigong.color,
    label: '认知校准内功',
    labelPos: { x: 704, y: 430 },
  },
  {
    key: 'jichu-neigong',
    d: 'M 394 312 L 606 312',
    from: 'jichu',
    to: 'neigong',
    fromColor: CATEGORY_MAP.jichu.color,
    toColor: CATEGORY_MAP.neigong.color,
    dashed: true,
    bidirectional: true,
    label: '边做边补 · 互相支撑',
    labelPos: { x: 500, y: 294 },
  },
  {
    key: 'jichu-jinjie',
    d: 'M 330 268 C 370 215 420 190 460 168',
    from: 'jichu',
    to: 'jinjie',
    fromColor: CATEGORY_MAP.jichu.color,
    toColor: CATEGORY_MAP.jinjie.color,
    label: '实操驶向深海',
    labelPos: { x: 346, y: 208 },
  },
  {
    key: 'neigong-jinjie',
    d: 'M 670 268 C 630 215 580 190 540 168',
    from: 'neigong',
    to: 'jinjie',
    fromColor: CATEGORY_MAP.neigong.color,
    toColor: CATEGORY_MAP.jinjie.color,
    label: '内功支撑进阶',
    labelPos: { x: 654, y: 208 },
  },
];

/** 层级标注（左缘） */
const LAYER_LABELS = [
  { text: '上层 · 远航', y: 126 },
  { text: '中层 · 船体', y: 316 },
  { text: '底层 · 地基', y: 516 },
];

export default function KnowledgeMap() {
  const navigate = useNavigate();
  const { getCategoryProgress } = useProgress();
  const [hovered, setHovered] = useState<CategoryId | null>(null);

  const hoveredNode = NODES.find((n) => n.id === hovered) ?? null;

  return (
    <section id="knowledge-map" className="scroll-mt-24 bg-paper-deep py-20 md:py-28">
      <div className="mx-auto max-w-wide px-5 md:px-8 lg:px-12">
        {/* 标题 */}
        <div className="text-center">
          <motion.p
            className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-ink-faint"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            Knowledge Map
          </motion.p>
          <motion.h2
            className="mt-2 font-serif text-2xl font-bold tracking-[0.02em] text-ink md:text-[32px]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ delay: 0.05, duration: 0.5, ease: EASE }}
          >
            知识架构
          </motion.h2>
          <motion.p
            className="mt-3 text-[15px] text-ink-soft md:text-base"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
          >
            五大篇章之间的依赖与支撑关系
          </motion.p>
        </div>

        {/* SVG 架构图（移动端可横滑） */}
        <div className="no-scrollbar mt-10 overflow-x-auto">
          <div className="relative mx-auto min-w-[760px] max-w-[1000px]">
            <svg viewBox="0 0 1000 620" className="h-auto w-full" role="img" aria-label="五域知识地图">
              <defs>
                {/* 每条连线：板块色 → 目标色的渐变 */}
                {EDGES.map((e) => (
                  <linearGradient
                    key={e.key}
                    id={`edge-${e.key}`}
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1="620"
                    x2="0"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={e.fromColor} />
                    <stop offset="100%" stopColor={e.toColor} />
                  </linearGradient>
                ))}
                {/* 箭头标记（目标色） */}
                {(['renzhi', 'jichu', 'neigong', 'jinjie'] as const).map((id) => (
                  <marker
                    key={id}
                    id={`arrow-${id}`}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 0 L10 5 L0 10 z" fill={CATEGORY_MAP[id].color} />
                  </marker>
                ))}
              </defs>

              {/* 环绕虚线圆环：最新更新「持续更新的外层海域」（dashoffset 缓慢流动 40s/圈） */}
              <motion.g
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-20% 0px' }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <motion.ellipse
                  cx={500}
                  cy={317}
                  rx={455}
                  ry={285}
                  fill="none"
                  stroke={CATEGORY_MAP.zuixin.color}
                  strokeWidth={1.5}
                  strokeDasharray="12 12"
                  opacity={0.55}
                  animate={{ strokeDashoffset: [0, -240] }}
                  transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
                />
                {/* 圆环标签（点击跳最新更新） */}
                <g
                  className="cursor-pointer"
                  onClick={() => navigate('/catalog?cat=zuixin')}
                  role="button"
                  aria-label="查看最新更新板块"
                >
                  <rect
                    x={352}
                    y={14}
                    width={296}
                    height={36}
                    rx={18}
                    fill="var(--paper-deep)"
                    stroke={CATEGORY_MAP.zuixin.color}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <text
                    x={500}
                    y={38}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={500}
                    fill={CATEGORY_MAP.zuixin.color}
                  >
                    最新更新 · 持续更新的外层海域
                  </text>
                </g>
              </motion.g>

              {/* 层级标注 */}
              {LAYER_LABELS.map((l) => (
                <text
                  key={l.text}
                  x={18}
                  y={l.y}
                  fontSize={12}
                  fill="var(--ink-faint)"
                  letterSpacing={2}
                >
                  {l.text}
                </text>
              ))}

              {/* 连线（进入视口后描边生长，0.8s stagger 0.1s） */}
              {EDGES.map((e, i) => {
                const highlighted = hovered === null || hovered === e.from || hovered === e.to;
                // 高亮态用 opacity，与入场描边动画分离（入场动画在内层 motion.path 上）
                const dimStyle = {
                  opacity: highlighted ? 1 : 0.25,
                  transition: 'opacity 0.25s ease',
                };
                const strokeWidth = hovered !== null && highlighted ? 2.5 : 1.5;
                return (
                  <g key={e.key} style={dimStyle}>
                    {e.dashed ? (
                      /* 双向虚线：淡入（dasharray 与 pathLength 描边冲突，故用 opacity） */
                      <motion.path
                        d={e.d}
                        fill="none"
                        stroke={`url(#edge-${e.key})`}
                        strokeLinecap="round"
                        strokeDasharray="6 6"
                        strokeWidth={strokeWidth}
                        markerStart={`url(#arrow-${e.from})`}
                        markerEnd={`url(#arrow-${e.to})`}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: '-20% 0px' }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                      />
                    ) : (
                      <motion.path
                        d={e.d}
                        fill="none"
                        stroke={`url(#edge-${e.key})`}
                        strokeLinecap="round"
                        strokeWidth={strokeWidth}
                        markerEnd={`url(#arrow-${e.to})`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true, margin: '-20% 0px' }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeInOut' }}
                      />
                    )}
                    {/* 连线小标签 */}
                    <text
                      x={e.labelPos.x}
                      y={e.labelPos.y}
                      textAnchor="middle"
                      fontSize={12}
                      fill="var(--ink-soft)"
                      stroke="var(--paper-deep)"
                      strokeWidth={4}
                      paintOrder="stroke"
                      style={{
                        opacity: highlighted ? 1 : 0.25,
                        transition: 'opacity 0.25s ease',
                      }}
                    >
                      {e.label}
                    </text>
                  </g>
                );
              })}

              {/* 节点（从中心依次弹出，scale 回弹 stagger 0.15s） */}
              {NODES.map((node, i) => {
                const meta = CATEGORY_MAP[node.id];
                return (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-20% 0px' }}
                    transition={{
                      delay: i * 0.15,
                      type: 'spring',
                      stiffness: 260,
                      damping: 18,
                    }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  >
                    <g
                      className="cursor-pointer"
                      onClick={() => navigate(`/catalog?cat=${node.id}`)}
                      onMouseEnter={() => setHovered(node.id)}
                      onMouseLeave={() => setHovered(null)}
                      role="button"
                      aria-label={`${meta.name}：${node.caption}，点击查看目录`}
                      style={{
                        transformBox: 'fill-box',
                        transformOrigin: 'center',
                        transform: hovered === node.id ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.25s ease',
                      }}
                    >
                      <rect
                        x={node.x}
                        y={node.y}
                        width={NODE_W}
                        height={NODE_H}
                        rx={14}
                        fill="var(--white)"
                        stroke={meta.color}
                        strokeWidth={1.5}
                      />
                      <circle cx={node.x + 38} cy={node.y + 42} r={24} fill={meta.color} />
                      <image
                        href={meta.icon}
                        x={node.x + 22}
                        y={node.y + 26}
                        width={32}
                        height={32}
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                      <text
                        x={node.x + 74}
                        y={node.y + 36}
                        fontSize={17}
                        fontWeight={700}
                        fill="var(--ink)"
                        fontFamily="'Noto Serif SC', serif"
                      >
                        {meta.name}
                      </text>
                      <text
                        x={node.x + 74}
                        y={node.y + 60}
                        fontSize={11.5}
                        fill="var(--ink-soft)"
                      >
                        {node.caption}
                      </text>
                    </g>
                  </motion.g>
                );
              })}
            </svg>

            {/* Tooltip：篇数与进度（hover 节点时） */}
            {hoveredNode &&
              (() => {
                const meta = CATEGORY_MAP[hoveredNode.id];
                const { read, total, percent } = getCategoryProgress(hoveredNode.id);
                return (
                  <div
                    className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-line bg-white px-3 py-1.5 text-xs shadow-lift"
                    style={{
                      left: `${((hoveredNode.x + NODE_W / 2) / 1000) * 100}%`,
                      top: `${((hoveredNode.y - 10) / 620) * 100}%`,
                    }}
                    role="tooltip"
                  >
                    <span className="font-medium" style={{ color: meta.color }}>
                      {meta.name}
                    </span>
                    <span className="mx-1.5 text-line">|</span>
                    <span className="text-ink-soft">
                      {getArticlesByCategory(hoveredNode.id).length} 篇 · 已读 {read}/{total} · 进度 {percent}%
                    </span>
                  </div>
                );
              })()}
          </div>
        </div>

        <motion.p
          className="mt-6 text-center text-xs text-ink-faint"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          悬停节点查看篇数与进度 · 点击节点跳转到对应篇章目录
        </motion.p>
      </div>
    </section>
  );
}
