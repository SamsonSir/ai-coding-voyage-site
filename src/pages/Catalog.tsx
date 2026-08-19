/**
 * 目录页 `/catalog`（design/catalog.md）
 * - 路由参数：`?cat={category}`（预选板块，桌面滚动定位 / 移动选中 Tab）、
 *   `?filter=unread|read|all`（进度筛选）
 * - S1 页头：TABLE OF CONTENTS + H1「航海目录」+ 副标题 + 120px 进度环（移动 64px）
 * - S2 主区：左侧 280px sticky 目录树侧栏 + 右侧按板块分组的文章卡片列表
 *   （移动端折叠为顶部可横滑板块 Tab 胶囊 + 筛选下拉，单列展示当前板块）
 * - S3 底部 CTA 条（teal-mist 底，跳 /path）
 * - lastRead 联动：对应卡片金色横幅「上次读到这里」+ 首次进入 smooth scroll + 描边闪烁
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProgressRing from '@/components/ProgressRing';
import { useProgress, readLastCategory, saveLastCategory } from '@/contexts/ProgressContext';
import { CATEGORIES, CATEGORY_MAP } from '@/data/categories';
import type { CategoryId } from '@/data/categories';
import { articles, getArticlesByCategory } from '@/data/articles';
import { cn } from '@/lib/utils';
import CatalogSidebar from './catalog/CatalogSidebar';
import CategorySection from './catalog/CategorySection';
import { parseFilter } from './catalog/filters';
import type { ProgressFilter } from './catalog/filters';
import { articleKey, useArticleStatus } from './catalog/articleStatus';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const TOTAL = articles.length;

/** H1 词级（中文按字）淡入上移 20px，0.5s */
function AnimatedTitle({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.5, ease: EASE }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  const urlCat: CategoryId | null =
    catParam && CATEGORY_MAP[catParam as CategoryId] ? (catParam as CategoryId) : null;
  // 「当前篇章」记忆：无 ?cat= 时回落到文章页记录的最近阅读板块
  const [storedCat, setStoredCat] = useState<CategoryId | null>(() => {
    const v = readLastCategory();
    return v && CATEGORY_MAP[v] ? v : null;
  });
  const activeCat: CategoryId | null = urlCat ?? storedCat;
  const filter = parseFilter(searchParams.get('filter'));

  // 带 ?cat= 进入时顺带更新「当前篇章」记忆
  useEffect(() => {
    if (!urlCat) return;
    saveLastCategory(urlCat);
    setStoredCat(urlCat);
  }, [urlCat]);

  const [query, setQuery] = useState('');
  // 移动端当前板块 Tab：?cat= 变化时跟随，用户手动点 Tab 后以用户选择为准
  const [mobileCatOverride, setMobileCatOverride] = useState<CategoryId | null>(null);
  const [prevCat, setPrevCat] = useState<CategoryId | null>(activeCat);
  if (activeCat !== prevCat) {
    setPrevCat(activeCat);
    setMobileCatOverride(null);
  }
  const mobileCat = mobileCatOverride ?? activeCat ?? CATEGORIES[0].id;
  const { readCount, overallProgress, lastRead } = useProgress();
  const getStatus = useArticleStatus();

  // lastRead 卡片：首次进入时定位 + 金色描边闪烁
  const [flashKey, setFlashKey] = useState<string | null>(() => {
    if (!lastRead) return null;
    const target = articles.find((a) => getStatus(a).isLastRead);
    return target ? articleKey(target) : null;
  });

  useEffect(() => {
    if (!flashKey) return undefined;
    const el = document.getElementById(`card-${flashKey}`);
    if (!el) return undefined;
    const t = window.setTimeout(
      () => el.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      350,
    );
    const clear = window.setTimeout(() => setFlashKey(null), 2400);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(clear);
    };
  }, [flashKey]);

  // 预选板块（?cat= 或「当前篇章」记忆）：桌面端滚动定位到对应板块区块
  // （移动端 Tab 跟随见上方派生状态，侧栏分组自动展开见 CatalogSidebar）
  useEffect(() => {
    if (!activeCat) return undefined;
    const el = document.getElementById(`cat-${activeCat}`);
    if (el && window.matchMedia('(min-width: 1024px)').matches) {
      const t = window.setTimeout(
        () => el.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        300,
      );
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [activeCat]);

  const setFilter = (f: ProgressFilter) => {
    const next = new URLSearchParams(searchParams);
    if (f === 'all') next.delete('filter');
    else next.set('filter', f);
    setSearchParams(next, { replace: true });
  };

  // 每个板块的过滤后列表（进度筛选 + 侧栏标题筛选，全页联动）
  const grouped = useMemo(() => {
    const kw = query.trim().toLowerCase();
    return CATEGORIES.map((cat, catIndex) => {
      const all = getArticlesByCategory(cat.id);
      const items = all.filter((a) => {
        if (filter !== 'all') {
          const { read } = getStatus(a);
          if (filter === 'read' && !read) return false;
          if (filter === 'unread' && read) return false;
        }
        if (kw && !a.title.toLowerCase().includes(kw)) return false;
        return true;
      });
      return { cat, catIndex, all, items };
    });
  }, [filter, query, getStatus]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.4, ease: 'easeOut' }}
    >
      {/* —— S1 · 页头 —— */}
      <section className="border-t border-dashed border-gold/60">
        <div className="mx-auto flex max-w-wide flex-wrap items-center justify-between gap-8 px-5 pb-12 pt-16 md:px-8 lg:px-12">
          <div className="flex items-center gap-6">
            <div>
              <motion.p
                className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-ink-faint"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                Table of Contents
              </motion.p>
              <h1 className="mt-2 font-serif text-3xl font-bold tracking-[0.02em] text-ink md:text-[44px] md:leading-[1.2]">
                <AnimatedTitle text="航海目录" />
              </h1>
              <motion.p
                className="mt-3 text-base text-ink-soft"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
              >
                {TOTAL} 篇教程 · 5 大篇章 · 按推荐学习顺序排列
              </motion.p>
            </div>
            {/* 移动端：64px 进度环与标题同行 */}
            <div className="lg:hidden">
              <ProgressRing percent={overallProgress} size={64} strokeWidth={5} />
            </div>
          </div>
          {/* 桌面端：120px 大号进度环 */}
          <motion.div
            className="hidden flex-col items-center gap-2 lg:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <ProgressRing percent={overallProgress} size={120} strokeWidth={8} />
            <p className="text-xs text-ink-faint">
              已读 {readCount} / {TOTAL} 篇
            </p>
          </motion.div>
        </div>
      </section>

      {/* —— S2 · 主区 —— */}
      <section className="mx-auto max-w-wide px-5 pb-24 md:px-8 lg:px-12">
        {/* 移动端：板块 Tab 胶囊 + 筛选下拉 */}
        <div className="mb-8 space-y-3 lg:hidden">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {CATEGORIES.map((cat) => {
              const active = mobileCat === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setMobileCatOverride(cat.id)}
                  className={cn(
                    'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
                    active ? 'text-white' : 'bg-white text-ink-soft',
                  )}
                  style={{
                    borderColor: cat.color,
                    backgroundColor: active ? cat.color : undefined,
                  }}
                  aria-pressed={active}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="catalog-filter" className="text-sm text-ink-soft">
              筛选
            </label>
            <select
              id="catalog-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as ProgressFilter)}
              className="h-9 flex-1 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:border-teal"
            >
              <option value="all">全部文章</option>
              <option value="unread">仅未读</option>
              <option value="read">仅已读</option>
            </select>
          </div>
        </div>

        <div className="flex items-start gap-10">
          {/* 左侧目录树（桌面端，280px sticky） */}
          <aside className="sticky top-24 hidden w-[280px] shrink-0 lg:block">
            <CatalogSidebar
              filter={filter}
              onFilterChange={setFilter}
              query={query}
              onQueryChange={setQuery}
              expandCat={activeCat}
            />
          </aside>

          {/* 右侧文章卡片列表 */}
          <div className="min-w-0 flex-1 space-y-16">
            {grouped.map(({ cat, catIndex, all, items }) => (
              <CategorySection
                key={cat.id}
                cat={cat}
                catIndex={catIndex}
                items={items}
                all={all}
                query={query}
                flashKey={flashKey}
                mobileHidden={mobileCat !== cat.id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* —— S3 · 底部 CTA 条 —— */}
      <section className="mx-auto max-w-wide px-5 pb-24 md:px-8 lg:px-12">
        <motion.div
          className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-teal-mist p-8 md:flex-row md:items-center md:p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="font-serif text-xl font-bold text-teal-deep md:text-2xl">
            不确定从哪开始？看看完整学习路线图。
          </p>
          <Link
            to="/path"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg border-[1.5px] border-teal px-6 py-3 text-sm font-medium text-teal transition-all duration-200 hover:-translate-y-px hover:bg-white"
          >
            查看学习路线
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
}
