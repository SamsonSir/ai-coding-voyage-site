/**
 * S3 · 学习路径航线图「一张地图走完全程」（design/home.md）—— GSAP 隔离组件。
 * 桌面端：ScrollTrigger pin 住可视化区，滚动 scrub 驱动金色虚线航线描边；
 * 移动端：降级为纵向时间线（不 pin），竖直虚线随滚动描边。
 * 本组件不使用 Framer Motion（GSAP/Framer 隔离约定）。
 */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CATEGORIES, RECOMMENDED_PATH_NOTE } from '@/data/categories';
import type { CategoryMeta } from '@/data/categories';
import { useProgress } from '@/contexts/ProgressContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** 桌面端节点坐标（SVG viewBox 1200×460） */
const NODE_POS = [
  { x: 150, y: 235 },
  { x: 390, y: 170 },
  { x: 630, y: 250 },
  { x: 870, y: 170 },
  { x: 1080, y: 225 },
];

const ROUTE_D =
  'M 45 300 C 90 262 112 248 150 235 C 220 210 320 182 390 170 C 470 158 558 226 630 250 C 700 274 800 196 870 170 C 940 144 1018 196 1080 225 C 1106 236 1136 188 1155 142';

/** 节点小号进度环（白/金双色，CSS 过渡，避免混入 Framer） */
function NodeRing({ percent, active }: { percent: number; active: boolean }) {
  const r = 13;
  const c = 2 * Math.PI * r;
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" className="-rotate-90">
      <circle cx={16} cy={16} r={r} fill="rgba(31,74,70,0.9)" stroke="rgba(239,231,216,0.35)" strokeWidth={3} />
      <circle
        cx={16}
        cy={16}
        r={r}
        fill="none"
        stroke="var(--gold)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={active ? c * (1 - percent / 100) : c}
        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)' }}
      />
    </svg>
  );
}

export default function VoyageMap() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeCount, setActiveCount] = useState(0);
  const navigate = useNavigate();
  const { getCategoryProgress } = useProgress();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      // —— 桌面端：pin + 航线描边 scrub ——
      mm.add('(min-width: 1024px)', () => {
        const path = root.querySelector<SVGPathElement>('.voyage-route');
        const pin = root.querySelector<HTMLElement>('.voyage-pin');
        if (!path || !pin) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: '+=140%',
            pin: true,
            scrub: 1,
            onUpdate: (self) =>
              setActiveCount(Math.min(CATEGORIES.length, Math.floor(self.progress * 6))),
          },
        });
      });

      // —— 移动端：纵向时间线 ——
      mm.add('(max-width: 1023px)', () => {
        const wrap = root.querySelector<HTMLElement>('.voyage-mobile');
        const line = root.querySelector<HTMLElement>('.voyage-mobile-line');
        if (wrap && line) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: 'top center',
              ease: 'none',
              scrollTrigger: { trigger: wrap, start: 'top 70%', end: 'bottom 65%', scrub: 1 },
            },
          );
        }
        root.querySelectorAll<HTMLElement>('.voyage-node-m').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%' },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const goCategory = (cat: CategoryMeta) => navigate(`/catalog?cat=${cat.id}`);

  return (
    <section ref={rootRef} id="voyage" className="relative bg-teal-deep text-[#EFE7D8]">
      {/* 标题区（不 pin，先滚入） */}
      <div className="mx-auto max-w-wide px-5 pt-24 text-center md:px-8 lg:px-12">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          The Voyage Map
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">五大篇章，一条航线</h2>
        <p className="mt-3 text-sm text-[#EFE7D8]/70 md:text-base">
          按推荐顺序学习，每一站都有明确的收获。
        </p>
      </div>

      {/* Pin 住的可视化区 */}
      <div className="voyage-pin flex flex-col justify-center py-10 lg:min-h-[100dvh] lg:py-0">
        <div className="mx-auto w-full max-w-wide px-5 md:px-8 lg:px-12">
          {/* —— 桌面端横向航线 —— */}
          <div className="relative hidden lg:block" style={{ aspectRatio: '1200 / 460' }}>
            <svg
              viewBox="0 0 1200 460"
              className="absolute inset-0 h-full w-full"
              fill="none"
              aria-hidden
            >
              {/* 出发点：港口 */}
              <g transform="translate(45 300)">
                <circle r={16} fill="rgba(239,231,216,0.12)" stroke="var(--gold)" strokeWidth={1.5} strokeDasharray="3 3" />
                <text y={34} textAnchor="middle" fontSize={12} fill="rgba(239,231,216,0.6)">
                  出发点
                </text>
              </g>
              {/* 终点：新大陆旗帜 */}
              <g transform="translate(1155 142)" stroke="var(--gold)" strokeWidth={2} strokeLinecap="round">
                <line x1={0} y1={-14} x2={0} y2={16} />
                <path d="M0 -14 L18 -10 L0 -4 Z" fill="var(--vermilion)" stroke="none" />
                <text y={34} textAnchor="middle" fontSize={12} fill="rgba(239,231,216,0.6)" stroke="none">
                  新大陆
                </text>
              </g>
              {/* 航线底（微光）与实际描边 */}
              <path d={ROUTE_D} stroke="rgba(201,162,75,0.15)" strokeWidth={5} strokeLinecap="round" />
              <path
                className="voyage-route"
                d={ROUTE_D}
                stroke="var(--gold)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray="10 8"
              />
            </svg>

            {/* 节点（HTML 覆盖层，便于交互与进度环） */}
            {CATEGORIES.map((cat, i) => {
              const pos = NODE_POS[i];
              const prog = getCategoryProgress(cat.id);
              const active = i < activeCount;
              return (
                <div
                  key={cat.id}
                  className="group absolute cursor-pointer"
                  style={{
                    left: `${(pos.x / 1200) * 100}%`,
                    top: `${(pos.y / 460) * 100}%`,
                    transform: `translate(-50%, -50%) scale(${active ? 1 : 0.6})`,
                    opacity: active ? 1 : 0.35,
                    transition:
                      'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease',
                  }}
                  onClick={() => goCategory(cat)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && goCategory(cat)}
                  aria-label={`进入${cat.name}`}
                >
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-ink opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100">
                    已读 {prog.read}/{prog.total} 篇
                  </div>
                  {/* 序号 */}
                  <p className="mb-2 text-center font-display text-lg font-semibold tracking-widest text-gold">
                    {cat.index}
                  </p>
                  {/* 岛标 */}
                  <div className="relative mx-auto h-24 w-24 transition-transform duration-300 group-hover:-translate-y-1.5">
                    {active && (
                      <span
                        className="absolute inset-0 animate-ping rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${cat.color}55 0%, transparent 70%)`,
                          animationIterationCount: 2,
                          animationDuration: '1.6s',
                        }}
                        aria-hidden
                      />
                    )}
                    <div
                      className="flex h-24 w-24 items-center justify-center rounded-full border-2 shadow-lift transition-shadow"
                      style={{ backgroundColor: cat.color, borderColor: 'rgba(239,231,216,0.35)' }}
                    >
                      <img
                        src={cat.icon}
                        alt=""
                        className="h-12 w-12"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <NodeRing percent={prog.percent} active={active} />
                    </div>
                  </div>
                  {/* 文案 */}
                  <div className="mt-3 w-[200px] text-center" style={{ marginLeft: 'calc(50% - 100px)' }}>
                    <p className="font-serif text-[22px] font-bold leading-tight">{cat.name}</p>
                    <p className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
                      {cat.en}
                    </p>
                    <p className="mx-auto mt-1.5 max-w-[200px] text-sm leading-snug text-[#EFE7D8]/75">
                      {cat.gain}
                    </p>
                    <span
                      className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs"
                      style={{ backgroundColor: `${cat.color}33`, color: '#EFE7D8' }}
                    >
                      {cat.count} 篇
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* —— 移动端纵向时间线 —— */}
          <div className="voyage-mobile relative pl-16 lg:hidden">
            <span
              className="voyage-mobile-line absolute bottom-4 left-6 top-4 w-0 border-l-2 border-dashed border-gold/70"
              aria-hidden
            />
            <div className="space-y-10">
              {CATEGORIES.map((cat, i) => {
                const prog = getCategoryProgress(cat.id);
                return (
                  <div
                    key={cat.id}
                    className={`voyage-node-m relative flex items-start gap-4 ${
                      i % 2 === 1 ? 'flex-row-reverse text-right' : ''
                    }`}
                    onClick={() => goCategory(cat)}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && goCategory(cat)}
                  >
                    <span
                      className="absolute -left-16 top-1 flex h-12 w-12 items-center justify-center rounded-full border-2"
                      style={{ backgroundColor: cat.color, borderColor: 'rgba(239,231,216,0.35)' }}
                    >
                      <img
                        src={cat.icon}
                        alt=""
                        className="h-6 w-6"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </span>
                    <div className="flex-1 rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                      <p className="font-display text-xs font-semibold tracking-[0.3em] text-gold">
                        {cat.index} · {cat.en}
                      </p>
                      <p className="mt-1 font-serif text-xl font-bold">{cat.name}</p>
                      <p className="mt-1 text-sm text-[#EFE7D8]/75">{cat.gain}</p>
                      <p className="mt-2 text-xs text-[#EFE7D8]/60">
                        {cat.count} 篇 · 已读 {prog.read}/{prog.total}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 热身提示 */}
          <div className="mt-10 text-center lg:mt-4">
            <button
              type="button"
              onClick={() => navigate('/catalog?cat=zuixin')}
              className="inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-vermilion-soft"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 18l6-6-6-6" />
                <path d="M5 12h4" />
              </svg>
              {RECOMMENDED_PATH_NOTE}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
