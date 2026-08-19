/**
 * 左侧章节导航（article.md S3）
 * 板块名 + 该板块文章纵向列表（当前 teal 加粗 + 2px 竖条；已读对勾 / 未读空心点），
 * 底部 64px 板块进度环。桌面 sticky 侧栏与移动端抽屉共用本组件。
 */
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArticleMeta } from '@/data/articles';
import { articleUrl } from '@/data/articles';
import type { CategoryMeta } from '@/data/categories';
import ProgressRing from '@/components/ProgressRing';
import { useProgress } from '@/contexts/ProgressContext';

interface ChapterNavProps {
  catMeta: CategoryMeta;
  articles: ArticleMeta[];
  /** 当前文章的复合 id（`{category}/{slug}`） */
  currentId: string;
  /** 抽屉中点击条目后关闭抽屉 */
  onNavigate?: () => void;
}

export default function ChapterNav({
  catMeta,
  articles,
  currentId,
  onNavigate,
}: ChapterNavProps) {
  const { isRead, getCategoryProgress } = useProgress();
  const progress = getCategoryProgress(catMeta.id);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: catMeta.color }}
          aria-hidden
        />
        <span className="font-sans text-sm font-bold text-ink">{catMeta.name}</span>
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-faint">
          {catMeta.en}
        </span>
      </div>

      <nav aria-label={`${catMeta.name}章节列表`} className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        <ul className="space-y-0.5">
          {articles.map((a) => {
            const current = a.id === currentId;
            const read = isRead(a.id);
            return (
              <li key={a.id}>
                <Link
                  to={articleUrl(a)}
                  onClick={onNavigate}
                  aria-current={current ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-start gap-2 rounded-lg py-2 pl-3 pr-2 text-[13px] leading-[1.6] transition-colors duration-200',
                    current
                      ? 'font-bold text-teal'
                      : 'text-ink-soft hover:bg-paper-deep hover:text-ink',
                  )}
                >
                  {current && (
                    <span
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-teal"
                      aria-hidden
                    />
                  )}
                  {/* 阅读状态标记 */}
                  <span className="mt-[5px] shrink-0" aria-hidden>
                    {read ? (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-vermilion">
                        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      </span>
                    ) : (
                      <span
                        className={cn(
                          'block h-3.5 w-3.5 rounded-full border-[1.5px]',
                          current ? 'border-teal' : 'border-line',
                        )}
                      />
                    )}
                  </span>
                  <span className="line-clamp-2 min-w-0">{a.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 本板块进度 */}
      <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
        <ProgressRing
          percent={progress.percent}
          size={64}
          strokeWidth={5}
          color={catMeta.color}
        />
        <div className="text-xs leading-[1.7] text-ink-faint">
          本板块进度
          <br />
          <span className="font-display text-base font-semibold text-ink">
            {progress.read}
          </span>
          /{progress.total} 篇
        </div>
      </div>
    </div>
  );
}
