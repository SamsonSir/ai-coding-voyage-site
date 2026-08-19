/**
 * 划线批注的 DOM 锚定引擎。
 * 在 MarkdownBody 容器内按「归一化文本 + 前后上下文」定位 quote，
 * 用 <span class="annotation-highlight" data-annotation-id> 逐文本节点包裹，
 * 允许跨节点匹配；重渲染前先 clearHighlights 恢复原始 DOM，避免嵌套污染。
 */
import type { Annotation } from '@/contexts/AnnotationsContext';

export const HIGHLIGHT_CLASS = 'annotation-highlight';
export const HIGHLIGHT_ATTR = 'data-annotation-id';
/** 移动端内联气泡占位元素（portal 挂载点，紧跟高亮文字之后） */
export const INLINE_MARKER_CLASS = 'annotation-inline-marker';
export const INLINE_MARKER_ATTR = 'data-annotation-marker';

/**
 * 高亮样式（运行时注入 <style>，不改动 index.css）。
 * 文字变色 = 有批注：朱红色字 + 金色 2px 下划线（hover 加深），无大面积底衬。
 */
export const HIGHLIGHT_CSS = `
.annotation-highlight {
  color: var(--vermilion);
  font-weight: 600;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-color: var(--gold);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  border-radius: 2px;
  cursor: pointer;
  transition: text-decoration-color 0.2s ease, background-color 0.2s ease;
}
.annotation-highlight:hover {
  text-decoration-color: #A67F2E;
}
.annotation-inline-marker {
  display: inline-flex;
  margin-left: 4px;
  vertical-align: -2px;
}
`;

/** 收集容器内所有文本节点（TreeWalker 顺序即文档顺序） */
function collectTextNodes(root: Node): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n = walker.nextNode();
  while (n) {
    nodes.push(n as Text);
    n = walker.nextNode();
  }
  return nodes;
}

interface NormIndex {
  /** 归一化后的全文（连续空白折叠为单个空格） */
  text: string;
  /** normToRaw[i] = 归一化第 i 个字符在原文中的下标 */
  normToRaw: number[];
  raw: string;
}

/** 构建归一化索引：\s+ → 单空格，保留到原文的映射 */
function buildNormIndex(raw: string): NormIndex {
  let text = '';
  const normToRaw: number[] = [];
  let inSpace = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (/\s/.test(ch)) {
      inSpace = true;
      continue;
    }
    if (inSpace && text.length > 0) {
      text += ' ';
      normToRaw.push(i - 1); // 指向前一段空白的末位，仅作定位占位
    }
    inSpace = false;
    text += ch;
    normToRaw.push(i);
  }
  return { text, normToRaw, raw };
}

function normalizeNeedle(s: string): string {
  return s.replace(/\s+/g, ' ').replace(/^ /, '').replace(/ $/, '');
}

interface RawMatch {
  /** 原文起始下标（含） */
  start: number;
  /** 原文结束下标（不含） */
  end: number;
}

/**
 * 在容器全文中查找 quote（允许跨节点）。
 * 优先匹配前后上下文（prefix/suffix）都吻合的位置，退化到仅前缀，再退化到首个出现处。
 */
export function findQuote(
  root: Node,
  quote: string,
  prefix?: string,
  suffix?: string,
): RawMatch | null {
  const nodes = collectTextNodes(root);
  const raw = nodes.map((n) => n.data).join('');
  const idx = buildNormIndex(raw);
  const needle = normalizeNeedle(quote);
  if (!needle) return null;

  const normPrefix = prefix ? normalizeNeedle(prefix) : '';
  const normSuffix = suffix ? normalizeNeedle(suffix) : '';

  // 收集所有候选出现位置
  const candidates: number[] = [];
  let from = 0;
  for (;;) {
    const hit = idx.text.indexOf(needle, from);
    if (hit === -1) break;
    candidates.push(hit);
    from = hit + 1;
  }
  if (candidates.length === 0) return null;

  const score = (pos: number): number => {
    let s = 0;
    if (normPrefix) {
      const before = idx.text.slice(Math.max(0, pos - normPrefix.length - 1), pos);
      if (before.endsWith(normPrefix) || normPrefix.endsWith(before.trimStart())) s += 2;
    }
    if (normSuffix) {
      const after = idx.text.slice(pos + needle.length, pos + needle.length + normSuffix.length + 1);
      if (after.startsWith(normSuffix) || normSuffix.startsWith(after.trimEnd())) s += 2;
    }
    return s;
  };

  let best = candidates[0];
  let bestScore = -1;
  for (const c of candidates) {
    const s = score(c);
    if (s > bestScore) {
      bestScore = s;
      best = c;
      if (s >= 4) break; // 前后上下文都命中，直接采用
    }
  }

  const normEnd = best + needle.length - 1;
  const rawStart = idx.normToRaw[best];
  const rawEnd = idx.normToRaw[normEnd] + 1;
  return { start: rawStart, end: rawEnd };
}

/** 把单个文本节点中 [from, to) 的部分包进高亮 span */
function wrapTextPortion(node: Text, from: number, to: number, id: string) {
  let target = node;
  if (to < node.data.length) target.splitText(to);
  if (from > 0) target = target.splitText(from);
  const span = document.createElement('span');
  span.className = HIGHLIGHT_CLASS;
  span.setAttribute(HIGHLIGHT_ATTR, id);
  target.parentNode?.insertBefore(span, target);
  span.appendChild(target);
}

/** 移除容器内全部高亮包裹与内联气泡占位，恢复原始 DOM 结构 */
export function clearHighlights(root: ParentNode) {
  root
    .querySelectorAll(`span.${INLINE_MARKER_CLASS}`)
    .forEach((marker) => marker.parentNode?.removeChild(marker));
  const spans = root.querySelectorAll(`span.${HIGHLIGHT_CLASS}`);
  spans.forEach((span) => {
    const parent = span.parentNode;
    if (!parent) return;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
  });
  if (root instanceof Element) root.normalize();
}

/**
 * 为每条已锚定批注在其最后一个高亮 span 之后插入空的内联占位元素，
 * 作为移动端内联气泡按钮的 React portal 挂载点（不含文本节点，不影响锚定匹配）。
 * 返回 id → 占位元素 的映射；由 clearHighlights 统一清理。
 */
export function insertInlineMarkers(
  root: HTMLElement,
  ids: Set<string>,
): Map<string, HTMLElement> {
  const map = new Map<string, HTMLElement>();
  ids.forEach((id) => {
    const spans = root.querySelectorAll(`span[${HIGHLIGHT_ATTR}="${id}"]`);
    const last = spans[spans.length - 1];
    if (!last || !last.parentNode) return;
    const marker = document.createElement('span');
    marker.className = INLINE_MARKER_CLASS;
    marker.setAttribute(INLINE_MARKER_ATTR, id);
    last.parentNode.insertBefore(marker, last.nextSibling);
    map.set(id, marker);
  });
  return map;
}

/**
 * 应用全部划线批注的高亮包裹（先清理旧包裹）。
 * 返回成功锚定的批注 id 集合；未命中的批注在面板中显示「原文已变动」。
 */
export function applyHighlights(root: HTMLElement, annotations: Annotation[]): Set<string> {
  clearHighlights(root);
  const anchored = new Set<string>();
  const withQuote = annotations.filter((a) => a.quote && a.quote.trim());
  if (withQuote.length === 0) return anchored;

  // 先在干净 DOM 上计算全部匹配位置（按出现顺序）
  const jobs: { id: string; start: number; end: number }[] = [];
  for (const a of withQuote) {
    const m = findQuote(root, a.quote!, a.prefix, a.suffix);
    if (m) {
      jobs.push({ id: a.id, start: m.start, end: m.end });
      anchored.add(a.id);
    }
  }
  jobs.sort((x, y) => x.start - y.start);

  // 逆序包裹：后面的切分不影响前面匹配的偏移
  for (let i = jobs.length - 1; i >= 0; i--) {
    const job = jobs[i];
    // 实时收集当前文本节点（上一步的 splitText 改变了节点列表）
    const liveNodes = collectTextNodes(root);
    const liveStarts: number[] = [];
    let pos = 0;
    for (const n of liveNodes) {
      liveStarts.push(pos);
      pos += n.data.length;
    }
    // 对每个与 [start, end) 相交的文本节点包裹相交部分
    for (let j = 0; j < liveNodes.length; j++) {
      const node = liveNodes[j];
      const ns = liveStarts[j];
      const ne = ns + node.data.length;
      const from = Math.max(job.start, ns);
      const to = Math.min(job.end, ne);
      if (from >= to) continue;
      wrapTextPortion(node, from - ns, to - ns, job.id);
    }
  }
  return anchored;
}
