/**
 * 目录页左侧目录树侧栏（design/catalog.md S2 左栏）
 * - 顶部：筛选 Tabs（全部 / 未读 / 已读）+ 迷你标题搜索框（实时过滤，gold 高亮）
 * - 5 个板块分组（默认全部展开，可折叠，Framer Motion 高度动画 0.3s）
 * - 组头：板块色 8px 圆点 + 板块名（Sans 700 15px）+ 篇数（ink-faint 12px）
 *   + 右侧迷你进度条（3px 高 / 60px 宽）
 * - 条目：阅读状态圆点 + 序号（Cormorant 12px）+ 标题（14px）；
 *   已读 60% 透明度，当前（lastRead）teal 加粗；hover 底色 --paper-deep
 * - 「最新更新」组内按 subcat 分小节（12px 宽字距 ink-faint 小节标题）
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { CATEGORIES, ZUIXIN_SUBCATS } from '@/data/categories';
import type { CategoryId } from '@/data/categories';
import { getArticlesByCategory } from '@/data/articles';
import type { ArticleMeta } from '@/data/articles';
import { useProgress } from '@/contexts/ProgressContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ReadStatusDot from './ReadStatusDot';
import HighlightText from './HighlightText';
import { articleUrl } from './articleRef';
import { useArticleStatus } from './articleStatus';
import type { ProgressFilter } from './filters';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface CatalogSidebarProps {
  filter: ProgressFilter;
  onFilterChange: (f: ProgressFilter) => void;
  query: string;
  onQueryChange: (q: string) => void;
  /** 需要确保展开的板块分组（?cat= 预选或「当前篇章」记忆） */
  expandCat?: CategoryId | null;
}

export default function CatalogSidebar({
  filter,
  onFilterChange,
  query,
  onQueryChange,
  expandCat,
}: CatalogSidebarProps) {
  const { getCategoryProgress } = useProgress();
  const getStatus = useArticleStatus();
  // 折叠状态：默认全部展开
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // 预选板块变化时确保其分组展开（用户之后仍可手动折叠）
  useEffect(() => {
    if (!expandCat) return;
    setCollapsed((prev) => (prev[expandCat] ? { ...prev, [expandCat]: false } : prev));
  }, [expandCat]);

  const grouped = useMemo(() => {
    const kw = query.trim().toLowerCase();
    return CATEGORIES.map((cat) => {
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
      return { cat, all, items };
    });
  }, [filter, query, getStatus]);

  return (
    <div className="rounded-xl border border-line bg-white p-4 shadow-card">
      {/* 筛选 Tabs */}
      <Tabs value={filter} onValueChange={(v) => onFilterChange(v as ProgressFilter)}>
        <TabsList className="h-8 w-full rounded-full bg-paper-deep p-[3px]">
          {(
            [
              ['all', '全部'],
              ['unread', '未读'],
              ['read', '已读'],
            ] as [ProgressFilter, string][]
          ).map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex-1 rounded-full text-xs font-medium text-ink-soft transition-colors data-[state=active]:bg-white data-[state=active]:text-teal data-[state=active]:shadow-card"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 迷你标题搜索框 */}
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="筛选标题…"
          aria-label="筛选标题"
          className="h-9 w-full rounded-lg border border-line bg-paper pl-8 pr-3 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-teal [&::-webkit-search-cancel-button]:hidden"
        />
      </div>

      {/* 目录树分组 */}
      <nav className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="目录树">
        {grouped.map(({ cat, all, items }, gi) => {
          const prog = getCategoryProgress(cat.id);
          const isCollapsed = collapsed[cat.id] ?? false;
          return (
            <motion.section
              key={cat.id}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + gi * 0.08, duration: 0.5, ease: EASE }}
            >
              {/* 组头 */}
              <button
                type="button"
                onClick={() => setCollapsed((prev) => ({ ...prev, [cat.id]: !isCollapsed }))}
                aria-expanded={!isCollapsed}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors duration-200 hover:bg-paper-deep"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[15px] font-bold text-ink">{cat.name}</span>
                <span className="text-xs text-ink-faint">{cat.count} 篇</span>
                {/* 迷你进度条（3px × 60px） */}
                <span
                  className="ml-auto mr-1 h-[3px] w-[60px] overflow-hidden rounded-full bg-paper-dark"
                  role="img"
                  aria-label={`${cat.name}进度 ${prog.percent}%`}
                >
                  <span
                    className="block h-full rounded-full transition-all duration-500"
                    style={{ width: `${prog.percent}%`, backgroundColor: cat.color }}
                  />
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-ink-faint transition-transform duration-300',
                    isCollapsed && '-rotate-90',
                  )}
                />
              </button>

              {/* 条目列表（折叠动画 0.3s） */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="overflow-hidden"
                  >
                    {items.length === 0 ? (
                      <p className="px-2 py-2 pl-7 text-xs text-ink-faint">无匹配文章</p>
                    ) : cat.id === 'zuixin' ? (
                      <ZuixinSubGroups items={items} all={all} query={query} />
                    ) : (
                      <ul>
                        {items.map((a) => (
                          <TreeItem
                            key={a.id}
                            article={a}
                            all={all}
                            query={query}
                            catIndex={CATEGORIES.findIndex((c) => c.id === cat.id)}
                          />
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </nav>
    </div>
  );
}

/** 「最新更新」组内按 subcat 分小节 */
function ZuixinSubGroups({ items, all, query }: { items: ArticleMeta[]; all: ArticleMeta[]; query: string }) {
  const catIndex = CATEGORIES.findIndex((c) => c.id === 'zuixin');
  const subcats = ZUIXIN_SUBCATS.map((sub) => ({
    sub,
    list: items.filter((a) => a.subcat === sub),
  })).filter((g) => g.list.length > 0);
  return (
    <div>
      {subcats.map(({ sub, list }) => (
        <div key={sub}>
          <p className="px-2 pb-1 pt-3 text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">
            {sub}
          </p>
          <ul>
            {list.map((a) => (
              <TreeItem key={a.id} article={a} all={all} query={query} catIndex={catIndex} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function TreeItem({
  article,
  all,
  query,
  catIndex,
}: {
  article: ArticleMeta;
  all: ArticleMeta[];
  query: string;
  catIndex: number;
}) {
  const getStatus = useArticleStatus();
  const { status, isLastRead } = getStatus(article);
  const idx = all.findIndex((x) => x.id === article.id) + 1;
  const read = status === 'read';
  return (
    <li>
      <Link
        to={articleUrl(article)}
        className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-paper-deep"
      >
        <ReadStatusDot status={status} size={12} />
        <span className="shrink-0 font-display text-xs font-medium text-ink-faint">
          {catIndex + 1}-{idx}
        </span>
        <span
          className={cn(
            'truncate text-sm transition-colors',
            isLastRead && !read
              ? 'font-bold text-teal'
              : read
                ? 'text-ink-faint/60'
                : 'text-ink group-hover:text-teal',
          )}
        >
          <HighlightText text={article.title} query={query} />
        </span>
      </Link>
    </li>
  );
}
