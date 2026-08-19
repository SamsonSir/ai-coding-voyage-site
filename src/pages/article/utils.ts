/**
 * 文章页共享工具：全局顺序、标题提取、文本扁平化等。
 */
import type { ReactNode } from 'react';
import { isValidElement } from 'react';
import type { ArticleMeta } from '@/data/articles';
import { getArticlesByCategory } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';

/** 全站文章全局顺序：renzhi → jichu → neigong → jinjie → zuixin，类目内按 order */
export const GLOBAL_ARTICLES: ArticleMeta[] = CATEGORIES.flatMap((c) =>
  getArticlesByCategory(c.id),
);

/** manifest 中 jichu 板块的 slug 带 `.md` 后缀，fetch 前需去掉 */
export function stripMdExt(slug: string): string {
  return slug.replace(/\.md$/i, '');
}

export interface TocItem {
  id: string;
  level: 2 | 3;
  text: string;
}

/** 去掉行内 Markdown 标记，得到纯文本标题 */
export function cleanInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`]+/g, '')
    .trim();
}

/**
 * 从 Markdown 正文提取 H2/H3 作为本篇目录。
 * id 使用源文件行号（`h-{line}`），与 react-markdown 渲染时
 * node.position.start.line 保持一致。
 */
export function extractHeadings(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  let inFence = false;
  const lines = markdown.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const text = cleanInlineMarkdown(m[2]);
    if (!text) continue;
    items.push({
      id: `h-${i + 1}`,
      level: m[1].length as 2 | 3,
      text,
    });
  }
  return items;
}

/** 递归扁平化 React children 为纯文本（用于复制代码 / 提示框识别） */
export function flattenText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join('');
  if (isValidElement(node)) {
    return flattenText((node.props as { children?: ReactNode }).children);
  }
  return '';
}

/** 标题词级拆分：CJK 逐字，拉丁文按词 */
export function splitTitleSegments(title: string): string[] {
  const segs: string[] = [];
  let buf = '';
  for (const ch of title) {
    if (/[\u3400-\u9fff\uf900-\ufaff\uff00-\uffef\u3000-\u303f]/.test(ch)) {
      if (buf) {
        segs.push(buf);
        buf = '';
      }
      segs.push(ch);
    } else if (/\s/.test(ch)) {
      if (buf) {
        segs.push(buf);
        buf = '';
      }
    } else {
      buf += ch;
    }
  }
  if (buf) segs.push(buf);
  return segs;
}

/** 平滑滚动到指定标题（偏移 96px 避开导航） */
export function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}
