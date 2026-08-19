/**
 * 右侧文章内 TOC（article.md S4）
 * 由 Markdown H2/H3 自动生成，缩进层级；当前阅读位置 teal 高亮 + 2px 竖条；
 * 点击平滑滚动锚点定位（offset -96px）。桌面 sticky 侧栏与移动端抽屉共用。
 */
import { cn } from '@/lib/utils';
import type { TocItem } from './utils';
import { scrollToHeading } from './utils';

interface ArticleTocProps {
  items: TocItem[];
  activeId: string;
  /** 抽屉中点击后关闭抽屉 */
  onNavigate?: () => void;
}

export default function ArticleToc({ items, activeId, onNavigate }: ArticleTocProps) {
  if (items.length === 0) {
    return (
      <p className="text-xs leading-[1.7] text-ink-faint">
        本篇为连续讲述，没有小节标题。
      </p>
    );
  }
  return (
    <nav aria-label="本篇目录">
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  scrollToHeading(item.id);
                  onNavigate?.();
                }}
                className={cn(
                  'relative w-full rounded-r-md py-1.5 pl-3 pr-2 text-left text-[13px] leading-[1.6] transition-all duration-200',
                  item.level === 3 && 'ml-4',
                  active
                    ? 'font-medium text-teal'
                    : 'text-ink-soft hover:bg-paper-deep hover:text-ink',
                )}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-teal"
                    aria-hidden
                  />
                )}
                <span className="line-clamp-2">{item.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
