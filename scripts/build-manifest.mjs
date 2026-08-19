#!/usr/bin/env node
/**
 * build-manifest.mjs
 * 扫描 public/content/<category>/_manifest.json，合并为 src/data/manifest.json。
 * 每个板块目录的 _manifest.json 为该板块的文章数组（或 { articles: [...] }）。
 * 用法：npm run build:manifest
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(root, 'public', 'content');
const outFile = join(root, 'src', 'data', 'manifest.json');

const CATEGORY_ORDER = ['renzhi', 'jichu', 'neigong', 'jinjie', 'zuixin'];

/** 简易 frontmatter 解析（与 src/hooks/useArticle.ts 保持一致） */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return {};
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    } else if (/^-?\d+$/.test(v)) {
      v = Number(v);
    }
    data[kv[1]] = v;
  }
  return data;
}

function countImages(markdown) {
  const m = markdown.match(/!\[[^\]]*\]\([^)]*\)/g);
  return m ? m.length : 0;
}

function countWords(markdown) {
  // 中文字符 + 英文单词的粗略计数
  const cjk = (markdown.match(/[一-鿿]/g) || []).length;
  const words = (markdown.match(/[A-Za-z0-9]+/g) || []).length;
  return cjk + words;
}

function collectCategory(category) {
  const dir = join(contentDir, category);
  if (!existsSync(dir)) return [];
  const manifestPath = join(dir, '_manifest.json');

  if (existsSync(manifestPath)) {
    const raw = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    const list = Array.isArray(raw) ? raw : raw.articles ?? [];
    return list.map((a) => ({ category, ...a }));
  }

  // 兜底：没有 _manifest.json 时，直接扫描 *.md 并从 frontmatter 提取
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .sort()
    .map((file, i) => {
      const raw = readFileSync(join(dir, file), 'utf-8');
      const fm = parseFrontmatter(raw);
      const slug = `${category}/${file.replace(/\.md$/, '')}`;
      return {
        slug,
        title: fm.title ?? slug,
        category,
        ...(fm.subcat ? { subcat: fm.subcat } : {}),
        order: fm.order ?? i + 1,
        ...(fm.date ? { date: fm.date } : {}),
        summary: fm.summary ?? '',
        imageCount: countImages(raw),
        wordCount: countWords(raw),
      };
    });
}

const articles = CATEGORY_ORDER.flatMap((cat) =>
  collectCategory(cat).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
);

if (articles.length === 0) {
  console.warn('[build-manifest] 未找到任何文章，保留现有 manifest.json');
  process.exit(0);
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(
  outFile,
  JSON.stringify(
    { generatedAt: new Date().toISOString(), totalArticles: articles.length, articles },
    null,
    2,
  ) + '\n',
);
console.log(`[build-manifest] 已生成 manifest.json：${articles.length} 篇文章`);
