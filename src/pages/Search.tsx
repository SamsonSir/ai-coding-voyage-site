/**
 * 搜索页 `/search`（design/search.md）
 * - 路由参数 `?q={keyword}`（可直达结果，输入防抖 300ms 即时搜索并同步 URL）
 * - S1 标头：SEARCH THE ARCHIVE + H1「搜索航海日志」+ 64px 胶囊大搜索框 + 热门关键词
 * - S2 筛选栏（有搜索词时）：板块筛选 Tabs（全部 + 五板块，layoutId 滑动指示）
 *   + 右侧「找到 {n} 篇相关教程」
 * - S3 结果列表：标题/摘要/板块名包含匹配，关键词 gold 高亮，stagger 0.06s
 * - S4 空搜索态：按板块探索 + 最近更新
 * - S5 无结果态：空宝箱插画 + 「浏览完整目录」
 * - 布局：单列窄容器（880px 居中）
 */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { articles } from '@/data/articles';
import { CATEGORIES, CATEGORY_MAP } from '@/data/categories';
import type { CategoryId } from '@/data/categories';
import { cn } from '@/lib/utils';
import ResultCard from './search/ResultCard';
import ExploreHome from './search/ExploreHome';
import NoResults from './search/NoResults';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const HOT_KEYWORDS = ['支付', '登录', 'Claude Code', '提示词', '部署', '快速入门'];

type CatFilter = 'all' | CategoryId;

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(() => searchParams.get('q') ?? '');
  const [q, setQ] = useState(() => searchParams.get('q') ?? '');
  const [catFilter, setCatFilter] = useState<CatFilter>('all');
  const [focused, setFocused] = useState(false);

  // 输入防抖 300ms → 即时搜索
  useEffect(() => {
    const t = window.setTimeout(() => setQ(input), 300);
    return () => window.clearTimeout(t);
  }, [input]);

  // URL 同步 ?q=（便于分享）
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    const kw = q.trim();
    if (kw) next.set('q', kw);
    else next.delete('q');
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // 即时匹配：标题 + 摘要 + 板块名（含子分类）
  const results = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return [];
    return articles.filter((a) => {
      const catName = CATEGORY_MAP[a.category]?.name ?? '';
      return (
        a.title.toLowerCase().includes(kw) ||
        a.summary.toLowerCase().includes(kw) ||
        catName.toLowerCase().includes(kw) ||
        (a.subcat ?? '').toLowerCase().includes(kw)
      );
    });
  }, [q]);

  const filtered = useMemo(
    () => (catFilter === 'all' ? results : results.filter((a) => a.category === catFilter)),
    [results, catFilter],
  );

  const hasQuery = q.trim().length > 0;

  const commit = (value: string) => {
    setInput(value);
    setQ(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.4, ease: 'easeOut' }}
    >
      {/* —— S1 · 搜索标头 —— */}
      <section className="mx-auto max-w-[880px] px-5 pb-16 pt-10 text-center md:pt-[68px]">
        <motion.p
          className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-ink-faint"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Search the Archive
        </motion.p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-[0.02em] text-ink md:text-[40px] md:leading-[1.2]">
          {'搜索航海日志'.split('').map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              className="inline-block"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: EASE }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        {/* 大搜索框（移动端 sticky 顶部） */}
        <div className="sticky top-[76px] z-30 -mx-5 mt-8 bg-paper/95 px-5 py-2 backdrop-blur-sm md:static md:mx-0 md:bg-transparent md:p-0 md:backdrop-blur-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: focused && input ? 1.01 : 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
            className={cn(
              'flex h-14 items-center gap-3 rounded-full border-[1.5px] bg-white pl-6 pr-2 transition-shadow md:h-16',
              focused ? 'border-teal shadow-lift' : 'border-line shadow-card',
            )}
          >
            <SearchIcon className="h-6 w-6 shrink-0 text-teal" aria-hidden />
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit(input);
              }}
              placeholder="搜索教程标题或关键词，如『支付』『登录』『提示词』…"
              aria-label="搜索教程"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden"
            />
            {input && (
              <button
                type="button"
                onClick={() => commit('')}
                className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1.5 text-sm text-ink-faint transition-colors hover:text-vermilion"
                aria-label="清空搜索"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">清空</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => commit(input)}
              className="shrink-0 rounded-full bg-vermilion px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-vermilion-soft active:scale-[0.98] md:px-6"
            >
              搜索
            </button>
          </motion.div>
        </div>

        {/* 热门关键词 */}
        <div className="no-scrollbar mt-5 flex flex-nowrap justify-start gap-2 overflow-x-auto sm:flex-wrap sm:justify-center">
          {HOT_KEYWORDS.map((kw, i) => (
            <motion.button
              key={kw}
              type="button"
              onClick={() => commit(kw)}
              className="shrink-0 rounded-full bg-paper-deep px-3.5 py-1.5 text-[13px] text-ink-soft transition-colors duration-200 hover:bg-paper-dark hover:text-teal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.4, ease: EASE }}
            >
              {kw}
            </motion.button>
          ))}
        </div>
      </section>

      {/* —— S2/S3/S5 · 筛选栏 + 结果 —— */}
      <section className="mx-auto max-w-[880px] px-5 pb-24">
        {hasQuery ? (
          <>
            {/* 筛选栏 */}
            <motion.div
              className="flex flex-wrap items-center justify-between gap-3"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div
                className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:px-0"
                role="tablist"
                aria-label="按板块筛选"
              >
                {(['all', ...CATEGORIES.map((c) => c.id)] as CatFilter[]).map((id) => {
                  const active = catFilter === id;
                  const meta = id === 'all' ? null : CATEGORY_MAP[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCatFilter(id)}
                      className={cn(
                        'relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                        active ? 'text-ink' : 'text-ink-soft hover:text-teal',
                      )}
                    >
                      {meta && (
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                      )}
                      {meta ? meta.name : '全部'}
                      {active && (
                        <motion.span
                          layoutId="search-tab-underline"
                          className="absolute inset-x-3 bottom-0.5 h-0.5 rounded-full"
                          style={{ backgroundColor: meta?.color ?? 'var(--teal)' }}
                          transition={{ duration: 0.25, ease: EASE }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[13px] text-ink-faint">找到 {filtered.length} 篇相关教程</p>
            </motion.div>

            {/* 结果列表 / 无结果态 */}
            {filtered.length > 0 ? (
              <div key={`${q.trim()}|${catFilter}`} className="mt-6 space-y-4">
                {filtered.map((a, i) => (
                  <ResultCard key={a.id} article={a} query={q} animIndex={i} />
                ))}
              </div>
            ) : (
              <NoResults />
            )}
          </>
        ) : (
          /* —— S4 · 空搜索态 —— */
          <AnimatePresence mode="wait">
            <motion.div
              key="explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ExploreHome />
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </motion.div>
  );
}
