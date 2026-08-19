/**
 * 关键词高亮（目录侧栏标题过滤 / 搜索页结果高亮共用）
 * 匹配片段使用 gold 底色：`rgba(201,162,75,0.25)`，2px 圆角（design/search.md S3）。
 */
import type { ReactNode } from 'react';

/** 转义正则特殊字符 */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface HighlightTextProps {
  text: string;
  query: string;
}

export default function HighlightText({ text, query }: HighlightTextProps) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const parts: ReactNode[] = [];
  const re = new RegExp(`(${escapeRegExp(q)})`, 'gi');
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <mark
        key={k++}
        className="rounded-[2px] px-px text-inherit"
        style={{ backgroundColor: 'rgba(201,162,75,0.25)' }}
      >
        {m[0]}
      </mark>,
    );
    last = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
