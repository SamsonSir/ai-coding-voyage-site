/**
 * 文章清单的强类型访问层。
 * manifest.json 由 `npm run build:manifest` 生成（当前为占位示例数据）。
 */
import rawManifest from './manifest.json';
import type { CategoryId } from './categories';
import { CATEGORY_MAP } from './categories';

export interface ArticleMeta {
  /**
   * 规范 id：复合形式 `{category}/{slug}`。
   * 文章页路由、进度系统、批注存储一律以它为键——裸 slug 在不同板块间
   * 可能重复（如 jichu/preface 与 neigong/preface），不能作为唯一标识。
   */
  id: string;
  /** 裸文件 slug（板块内唯一），对应 /content/{category}/{slug}.md */
  slug: string;
  title: string;
  category: CategoryId;
  /** 仅最新更新板块有子分类 */
  subcat?: string;
  order: number;
  /** 仅最新更新板块有日期（YYYY-MM-DD） */
  date?: string;
  summary: string;
  imageCount: number;
  wordCount: number;
}

interface Manifest {
  generatedAt: string;
  totalArticles: number;
  articles: Array<Omit<ArticleMeta, 'id'>>;
}

export const manifest = rawManifest as unknown as Manifest;
export const articles: ArticleMeta[] = manifest.articles.map((a) => ({
  ...a,
  id: `${a.category}/${a.slug.replace(/\.md$/i, '')}`,
}));

/** 以复合 id `{category}/{slug}` 为键 */
export const ARTICLE_MAP: Record<string, ArticleMeta> = Object.fromEntries(
  articles.map((a) => [a.id, a]),
);

/** 文章页规范链接（复合形式） */
export function articleUrl(a: ArticleMeta): string {
  return `/article/${a.id}`;
}

/**
 * 解析文章页路由参数。
 * - 两段路由 `/article/:category/:slug`：精确匹配复合键；
 * - 单段路由 `/article/:slug`（slug 落在 category 参数上）：裸 slug 唯一则解析，
 *   重复时按 manifest 出现顺序取第一个并标记 needRedirect（由页面重定向到复合路由）。
 */
export function resolveRouteArticle(
  categoryParam: string | undefined,
  slugParam: string | undefined,
): { meta: ArticleMeta | null; needRedirect: boolean } {
  if (categoryParam && slugParam) {
    const key = `${categoryParam}/${slugParam.replace(/\.md$/i, '')}`;
    return { meta: ARTICLE_MAP[key] ?? null, needRedirect: false };
  }
  const bare = (slugParam ?? categoryParam ?? '').replace(/\.md$/i, '');
  if (!bare) return { meta: null, needRedirect: false };
  const candidates = articles.filter((a) => a.slug === bare);
  if (candidates.length === 0) return { meta: null, needRedirect: false };
  return { meta: candidates[0], needRedirect: candidates.length > 1 };
}

/**
 * 兼容历史数据：把 localStorage 里可能存在的裸 slug 键规范化为复合 id。
 * 裸 slug 能唯一匹配文章时返回该文章的复合 id，否则原样返回（不做猜测）。
 */
export function normalizeArticleKey(key: string): string {
  if (ARTICLE_MAP[key]) return key;
  const bare = key.replace(/\.md$/i, '');
  const candidates = articles.filter((a) => a.slug === bare);
  return candidates.length === 1 ? candidates[0].id : key;
}

export function getArticlesByCategory(category: CategoryId): ArticleMeta[] {
  return articles
    .filter((a) => a.category === category)
    .sort((a, b) => a.order - b.order);
}

export function getLatestArticles(n = 9): ArticleMeta[] {
  return articles
    .filter((a) => a.category === 'zuixin')
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, n);
}

export function getCategoryArticleCount(category: CategoryId): number {
  const real = articles.filter((a) => a.category === category).length;
  // 占位数据期：清单不足时回落到 categories.ts 中声明的篇数
  return Math.max(real, CATEGORY_MAP[category]?.count ?? 0);
}

/** 估算阅读时长（分钟），中文约 400 字/分钟 */
export function estimateReadingMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 400));
}

/** 估算某板块总阅读时长（小时，保留 1 位小数） */
export function estimateCategoryHours(category: CategoryId): string {
  const mins = getArticlesByCategory(category).reduce(
    (sum, a) => sum + estimateReadingMinutes(a.wordCount),
    0,
  );
  return (mins / 60).toFixed(1).replace(/\.0$/, '');
}
