/**
 * 文章 slug 规范化工具（目录页 / 搜索页共用）。
 *
 * manifest.json 中的 slug 为「裸文件 slug」（部分 jichu 条目残留 `.md` 后缀），
 * 而文章页路由 / 进度系统使用复合形式 `{category}/{slug}`（见 App.tsx 路由
 * `/article/:category/:slug` 与 useArticle 的 `/content/{slug}.md` 拉取逻辑）。
 * 这里统一处理两种形式，保证链接可打开、进度状态不错判。
 */
import type { ArticleMeta } from '@/data/articles';

/** 去掉 manifest slug 中可能残留的 `.md` 后缀 */
export function cleanSlug(slug: string): string {
  return slug.replace(/\.md$/, '');
}

/** 文章页链接（复合形式，useArticle 据此拉取 /content/{category}/{slug}.md） */
export function articleUrl(a: ArticleMeta): string {
  return `/article/${a.category}/${cleanSlug(a.slug)}`;
}

/** 该文章在进度系统里可能出现的所有键（裸 slug / 去后缀裸 slug / 复合 slug） */
export function slugVariants(a: ArticleMeta): string[] {
  const bare = a.slug;
  const cleaned = cleanSlug(bare);
  const composite = `${a.category}/${cleaned}`;
  return Array.from(new Set([bare, cleaned, composite]));
}

/** 判断某个进度键（readSlugs 项 / lastRead.slug）是否指向该文章 */
export function matchesSlug(a: ArticleMeta, key: string | null | undefined): boolean {
  if (!key) return false;
  return slugVariants(a).includes(key);
}

/** 文章在板块内排序后的 1 起始序号（用于 `2-3` / 「第 5 课」展示） */
export function indexInCategory(a: ArticleMeta, list: ArticleMeta[]): number {
  return list.findIndex((x) => x.slug === a.slug) + 1;
}
