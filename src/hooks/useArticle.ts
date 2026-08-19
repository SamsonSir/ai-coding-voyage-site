/**
 * useArticle — 拉取并解析 /content/{category}/{slug}.md
 * 入参为文章 slug（形如 `renzhi/why-solo-product`），返回 loading / error /
 * content（去除 frontmatter 的正文）/ frontmatter（简易正则解析，不引库）。
 */
import { useEffect, useState } from 'react';
import { ARTICLE_MAP } from '@/data/articles';
import type { ArticleMeta } from '@/data/articles';

export interface ArticleFrontmatter {
  title?: string;
  summary?: string;
  category?: string;
  subcat?: string;
  order?: number;
  date?: string;
  [key: string]: string | number | undefined;
}

export interface UseArticleResult {
  loading: boolean;
  error: string | null;
  /** 去除 frontmatter 后的 Markdown 正文（图片路径已解析为 /content/...） */
  content: string;
  frontmatter: ArticleFrontmatter;
  /** manifest 中的文章元信息（找不到时为 null） */
  meta: ArticleMeta | null;
}

/** 与 scripts/build-manifest.mjs 中的解析逻辑保持一致 */
export function parseFrontmatter(raw: string): {
  frontmatter: ArticleFrontmatter;
  body: string;
} {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { frontmatter: {}, body: raw };
  const frontmatter: ArticleFrontmatter = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v: string | number = kv[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    } else if (/^-?\d+$/.test(v)) {
      v = Number(v);
    }
    frontmatter[kv[1]] = v;
  }
  return { frontmatter, body: raw.slice(m[0].length) };
}

/** 把 Markdown 中的相对图片路径解析到 /content/{category}/ 下 */
export function resolveImagePaths(markdown: string, category: string): string {
  return markdown.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/|\/)([^)]+)\)/g,
    (_all, alt: string, src: string) => {
      const clean = src.replace(/^\.\//, '');
      return `![${alt}](/content/${category}/${clean})`;
    },
  );
}

export function useArticle(slug: string | undefined): UseArticleResult {
  // 结果状态只在异步回调中写入；loading 由 slug 派生，避免在 effect 中同步 setState
  const [result, setResult] = useState<{
    slug: string;
    content: string;
    frontmatter: ArticleFrontmatter;
    error: string | null;
  } | null>(null);

  const validationError = !slug
    ? '缺少文章标识'
    : !slug.split('/')[0] || slug.includes('..')
      ? '文章路径不合法'
      : null;

  useEffect(() => {
    if (!slug || validationError) return;
    const category = slug.split('/')[0];
    let cancelled = false;

    fetch(`/content/${slug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error(`文章加载失败（HTTP ${res.status}）`);
        return res.text();
      })
      .then((raw) => {
        if (cancelled) return;
        const { frontmatter, body } = parseFrontmatter(raw);
        setResult({
          slug,
          content: resolveImagePaths(body, category),
          frontmatter,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResult({
          slug,
          content: '',
          frontmatter: {},
          error: err instanceof Error ? err.message : '文章加载失败',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, validationError]);

  const current = result && slug && result.slug === slug ? result : null;
  return {
    loading: !validationError && !current,
    error: validationError ?? current?.error ?? null,
    content: current?.content ?? '',
    frontmatter: current?.frontmatter ?? {},
    meta: slug ? ARTICLE_MAP[slug] ?? null : null,
  };
}
