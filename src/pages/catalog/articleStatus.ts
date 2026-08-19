/**
 * 文章阅读状态判定（目录页 / 搜索页共用）。
 * 兼容进度系统中可能存在的裸 slug / 复合 slug 两种键（见 articleRef.ts）。
 */
import { useProgress } from '@/contexts/ProgressContext';
import type { ArticleMeta } from '@/data/articles';
import type { ReadStatus } from './ReadStatusDot';
import { matchesSlug } from './articleRef';

/** 稳定的跨页文章 key（用于锚点 id、ref 映射） */
export function articleKey(a: ArticleMeta): string {
  return a.id;
}

export interface ArticleStatus {
  status: ReadStatus;
  isLastRead: boolean;
  read: boolean;
}

export function useArticleStatus(): (a: ArticleMeta) => ArticleStatus {
  const { readSlugs, lastRead } = useProgress();
  return (a: ArticleMeta): ArticleStatus => {
    const read = readSlugs.some((s) => matchesSlug(a, s));
    const isLastRead = matchesSlug(a, lastRead?.slug);
    return {
      read,
      isLastRead,
      status: read ? 'read' : isLastRead ? 'reading' : 'unread',
    };
  };
}
