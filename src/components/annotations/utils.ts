/** 批注时间显示：YYYY-MM-DD HH:mm */
import { useEffect, useState } from 'react';

export function formatTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 引用摘要：折叠空白并截断 maxLen 字 */
export function quoteExcerpt(quote: string, maxLen = 40): string {
  const flat = quote.replace(/\s+/g, ' ').trim();
  return flat.length > maxLen ? `${flat.slice(0, maxLen)}…` : flat;
}

/** 响应式媒体查询（如 '(max-width: 1023.98px)' 判断 <lg 移动端） */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}
