/**
 * S2 · 互动航海图（design/path.md，核心可视化）
 * - path-map.png 全宽背景 + 纸色渐变叠加，min-h-[100dvh]
 * - 桌面端：2000px+ 横向卷轴（可拖滑），5 岛沿金色虚线航线分布（航线用 SVG mask 描边画出）
 * - 移动端：横滑 snap 卷轴，点击岛屿从底部 Sheet 弹出信息卡
 * - 岛屿手风琴：同屏只展开一个信息卡，其余岛标 opacity 降至 0.55
 * 动效全部使用 Framer Motion（航线描边 = motion.path pathLength + mask，进入视口 once 触发）。
 */
import { memo, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Anchor, Check, Flag, MoveHorizontal } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import type { CategoryId, CategoryMeta } from '@/data/categories';
import { estimateCategoryHours, getArticlesByCategory } from '@/data/articles';
import { useProgress } from '@/contexts/ProgressContext';
import ProgressRing from '@/components/ProgressRing';
import { publicUrl } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { STATION_COPY } from './stations';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* —— 桌面端卷轴几何（viewBox 2100×840）—— */
const CHART_W = 2100;
/* 高度预留展开信息卡的空间（最低的岛展开后约 y+550） */
const CHART_H = 960;
const ISLAND_POS = [
  { x: 430, y: 280 },
  { x: 790, y: 400 },
  { x: 1150, y: 260 },
  { x: 1510, y: 390 },
  { x: 1830, y: 270 },
];
/** 金色虚线航线：起点港口 → 五岛 → 终点旗帜，微微上下起伏如海浪 */
const ROUTE_D =
  'M 70 480 C 200 440 300 320 430 280 C 560 240 650 420 790 400 C 920 380 1000 240 1150 260 C 1290 280 1370 410 1510 390 C 1650 370 1700 250 1830 270 C 1930 285 2000 320 2040 380';

/** 桌面端鼠标拖滑横向卷轴 */
function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      el.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      down = false;
    };
    // 拖拽后抑制误触发的岛屿点击
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClickCapture, true);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, []);
  return ref;
}

/** 岛标常态浮动（y ±6px，相位错开，4s 循环）—— 隔离为 memo 微组件 */
const FloatY = memo(function FloatY({
  delay,
  children,
}: {
  delay: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0, 6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
});

/** 岛标：120px 圆形板块色底 + 白色板块图标 + 缓慢旋转的金色虚线外环（20s/圈） */
function IslandBadge({
  meta,
  onClick,
  entranceDelay,
}: {
  meta: CategoryMeta;
  onClick: () => void;
  entranceDelay: number;
}) {
  return (
    <FloatY delay={entranceDelay * 1.5}>
      <motion.button
        type="button"
        onClick={onClick}
        className="relative flex h-[120px] w-[120px] cursor-pointer items-center justify-center rounded-full shadow-lift transition-transform duration-200 hover:scale-[1.04]"
        style={{ backgroundColor: meta.color }}
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ delay: entranceDelay, type: 'spring', stiffness: 260, damping: 18 }}
        aria-label={`展开${meta.name}信息卡`}
      >
        {/* 金色虚线外环（缓慢旋转 20s/圈） */}
        <span
          className="pointer-events-none absolute -inset-2.5 rounded-full border-2 border-dashed border-gold/70"
          style={{ animation: 'spin-slow 20s linear infinite' }}
          aria-hidden
        />
        <img
          src={meta.icon}
          alt=""
          className="h-12 w-12"
          style={{ filter: 'brightness(0) invert(1)' }}
          draggable={false}
        />
      </motion.button>
    </FloatY>
  );
}

/** 岛下名牌：序号 + 板块名 */
function Nameplate({ meta, delay }: { meta: CategoryMeta; delay: number }) {
  return (
    <motion.div
      className="mt-4 text-center"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ delay: delay + 0.15, duration: 0.5, ease: EASE }}
    >
      <div
        className="font-display text-4xl font-semibold leading-none"
        style={{ color: meta.color }}
      >
        {meta.index}
      </div>
      <div className="mt-1 font-serif text-[26px] font-bold leading-snug text-ink">
        {meta.name}
      </div>
    </motion.div>
  );
}

/** 「已读 x/y」小进度条 */
function MiniProgress({ meta }: { meta: CategoryMeta }) {
  const { getCategoryProgress } = useProgress();
  const { read, total, percent } = getCategoryProgress(meta.id);
  return (
    <div className="mt-3 flex flex-col items-center gap-1.5">
      <span className="text-xs text-ink-soft">
        已读 {read}/{total}
      </span>
      <span className="h-1.5 w-24 overflow-hidden rounded-full bg-paper-dark">
        <span
          className="block h-full rounded-full transition-[width] duration-700"
          style={{ width: `${percent}%`, backgroundColor: meta.color }}
        />
      </span>
    </div>
  );
}

/** 信息卡内容（桌面手风琴卡 & 移动端底部抽屉共用） */
function IslandCardBody({ meta }: { meta: CategoryMeta }) {
  const { getCategoryProgress } = useProgress();
  const { read, total, percent } = getCategoryProgress(meta.id);
  const copy = STATION_COPY[meta.id];
  const count = getArticlesByCategory(meta.id).length;
  const hours = estimateCategoryHours(meta.id);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-ink-soft">{meta.tagline}。{copy.why}</p>
      <p className="text-xs font-medium tracking-wide text-ink-faint">
        {count} 篇 · 约 {hours} 小时 · 已读 {read}/{total}
      </p>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">
          你将学会
        </p>
        <ul className="mt-2 space-y-1.5">
          {copy.learn.map((item, i) => (
            <motion.li
              key={item}
              className="flex items-start gap-2 text-sm text-ink"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.35, ease: EASE }}
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: meta.color }}
                aria-hidden
              />
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between gap-3">
        <ProgressRing percent={percent} size={64} strokeWidth={5} color={meta.color} />
        <Link
          to={`/catalog?cat=${meta.id}`}
          className="group flex-1 rounded-full px-4 py-2.5 text-center text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: meta.color }}
        >
          进入该篇章
          <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

/** 起点 / 终点装饰（桌面卷轴两端） */
function Endpoint({ kind }: { kind: 'start' | 'end' }) {
  if (kind === 'start') {
    return (
      <div
        className="absolute flex w-[190px] flex-col items-center text-center"
        style={{ left: 20, top: 500 }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-white shadow-card">
          <Anchor className="h-6 w-6 text-teal" aria-hidden />
        </div>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">
          出发点 · 港口
        </p>
        <Link
          to="/catalog?cat=zuixin"
          className="mt-1.5 text-[13px] font-medium text-teal underline decoration-teal/40 underline-offset-4 transition-colors hover:text-vermilion"
        >
          零基础？先去「快速入门」热身两篇 →
        </Link>
      </div>
    );
  }
  return (
    <div
      className="absolute flex w-[170px] flex-col items-center text-center"
      style={{ left: 1960, top: 420 }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-white shadow-card">
        <Flag className="h-6 w-6 text-vermilion" aria-hidden />
      </div>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">
        新大陆 · 持续更新
      </p>
      <p className="mt-1.5 text-[13px] text-ink-soft">学无止境，常回来看看</p>
    </div>
  );
}

export default function SeaChart() {
  const sectionRef = useRef<HTMLElement>(null);
  const dragRef = useDragScroll<HTMLDivElement>();
  // 航线描边：进入视口一次性触发（2s）
  const routeInView = useInView(sectionRef, { once: true, margin: '-20% 0px' });
  const [expandedId, setExpandedId] = useState<CategoryId | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const toggleIsland = (id: CategoryId) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const expandedMeta = expandedId
    ? CATEGORIES.find((c) => c.id === expandedId) ?? null
    : null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-paper"
      aria-label="互动航海图"
    >
      {/* path-map.png 主视觉背景（铺满 cover，paper 底色防加载闪烁） */}
      <div
        className="absolute inset-0 bg-paper bg-cover bg-center"
        style={{ backgroundImage: `url('${publicUrl('/path-map.png')}')` }}
        aria-hidden
      />
      {/* 半透明纸色渐变叠加（顶部→底部 opacity 0.5→0.2）保证可读性 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(247,242,233,0.55) 0%, rgba(247,242,233,0.25) 60%, rgba(247,242,233,0.35) 100%)',
        }}
        aria-hidden
      />

      <div className="relative flex min-h-[100dvh] flex-col justify-center py-14">
        {/* 操作提示 */}
        <motion.p
          className="mb-6 flex items-center justify-center gap-2 text-center text-xs font-medium uppercase tracking-[0.2em] text-ink-faint"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <MoveHorizontal className="h-4 w-4" aria-hidden />
          拖动 / 横滑查看完整航线 · 点击岛屿展开详情
        </motion.p>

        {/* —— 桌面端：2000px+ 横向卷轴（可拖滑）—— */}
        <div
          ref={dragRef}
          className="no-scrollbar hidden cursor-grab select-none overflow-x-auto active:cursor-grabbing lg:block"
        >
          <div className="relative" style={{ width: CHART_W, height: CHART_H }}>
            {/* 金色虚线航线（mask 描边从左画到右，2s） */}
            <svg
              width={CHART_W}
              height={CHART_H}
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              className="absolute inset-0"
              aria-hidden
            >
              <defs>
                <mask id="sea-route-mask">
                  <motion.path
                    d={ROUTE_D}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={10}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={routeInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                </mask>
              </defs>
              <path
                d={ROUTE_D}
                fill="none"
                stroke="var(--gold)"
                strokeWidth={3}
                strokeDasharray="2 14"
                strokeLinecap="round"
                mask="url(#sea-route-mask)"
              />
            </svg>

            <Endpoint kind="start" />
            <Endpoint kind="end" />

            {/* 5 个岛屿节点（手风琴：同屏只展开一个） */}
            {CATEGORIES.map((meta, i) => {
              const pos = ISLAND_POS[i];
              const dimmed = expandedId !== null && expandedId !== meta.id;
              return (
                <div
                  key={meta.id}
                  className="absolute flex w-[300px] flex-col items-center"
                  style={{
                    left: pos.x - 150,
                    top: pos.y - 60,
                    opacity: dimmed ? 0.55 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <IslandBadge
                    meta={meta}
                    entranceDelay={i * 0.2}
                    onClick={() => toggleIsland(meta.id)}
                  />
                  <Nameplate meta={meta} delay={i * 0.2} />
                  <MiniProgress meta={meta} />

                  {/* 展开态信息卡（高度 + opacity 0.4s） */}
                  <AnimatePresence initial={false}>
                    {expandedId === meta.id && (
                      <motion.div
                        key="card"
                        className="mt-4 w-[300px] overflow-hidden rounded-xl border border-line bg-white shadow-lift"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <div className="p-5">
                          <IslandCardBody meta={meta} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* —— 移动端：横滑卷轴 + snap 到每岛 —— */}
        <div className="lg:hidden">
          <div className="no-scrollbar relative snap-x snap-mandatory overflow-x-auto">
            {/* 横向虚线航线（圆圈中线高度） */}
            <div
              className="absolute left-0 right-0 top-[92px] border-t-[3px] border-dashed border-gold/70"
              aria-hidden
            />
            <div className="relative flex w-max items-start gap-2 px-6 pb-4 pt-8">
              {/* 起点 */}
              <div className="flex w-[62vw] flex-none snap-center flex-col items-center pt-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white shadow-card">
                  <Anchor className="h-5 w-5 text-teal" aria-hidden />
                </div>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                  出发点 · 港口
                </p>
                <Link
                  to="/catalog?cat=zuixin"
                  className="mt-1 text-xs font-medium text-teal underline decoration-teal/40 underline-offset-4"
                >
                  零基础？先热身两篇 →
                </Link>
              </div>

              {CATEGORIES.map((meta, i) => (
                <div
                  key={meta.id}
                  className="flex w-[62vw] flex-none snap-center flex-col items-center"
                >
                  <IslandBadge
                    meta={meta}
                    entranceDelay={i * 0.15}
                    onClick={() => setExpandedId(meta.id)}
                  />
                  <Nameplate meta={meta} delay={i * 0.15} />
                  <MiniProgress meta={meta} />
                </div>
              ))}

              {/* 终点 */}
              <div className="flex w-[62vw] flex-none snap-center flex-col items-center pt-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white shadow-card">
                  <Flag className="h-5 w-5 text-vermilion" aria-hidden />
                </div>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                  新大陆 · 持续更新
                </p>
                <p className="mt-1 text-xs text-ink-soft">学无止境，常回来看看</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端展开卡 → 底部抽屉（shadcn Sheet） */}
      <Sheet
        open={isMobile && expandedMeta !== null}
        onOpenChange={(open) => {
          if (!open) setExpandedId(null);
        }}
      >
        <SheetContent side="bottom" className="rounded-t-2xl bg-white">
          {expandedMeta && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-3">
                  <span
                    className="font-display text-3xl font-semibold"
                    style={{ color: expandedMeta.color }}
                  >
                    {expandedMeta.index}
                  </span>
                  <span className="font-serif text-xl font-bold text-ink">
                    {expandedMeta.name}
                  </span>
                  <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                    {expandedMeta.en}
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <IslandCardBody meta={expandedMeta} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
