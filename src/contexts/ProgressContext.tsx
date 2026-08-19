/**
 * 学习进度系统（design.md 第 7 节）
 * localStorage 键 `voyage-progress` → { readSlugs: string[], lastRead: {slug, ts} | null }
 * 首页 / 目录 / 文章页 / 页脚通过此 Context 共享进度。
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { CategoryId } from '@/data/categories';
import { articles, getArticlesByCategory, normalizeArticleKey } from '@/data/articles';

export const PROGRESS_STORAGE_KEY = 'voyage-progress';

/** 「当前篇章」记忆：文章页写入，目录页在无 ?cat= 参数时读取定位 */
export const LAST_CATEGORY_STORAGE_KEY = 'voyage-last-category';

export function readLastCategory(): CategoryId | null {
  try {
    const v = localStorage.getItem(LAST_CATEGORY_STORAGE_KEY);
    return v ? (v as CategoryId) : null;
  } catch {
    return null;
  }
}

export function saveLastCategory(category: CategoryId) {
  try {
    localStorage.setItem(LAST_CATEGORY_STORAGE_KEY, category);
  } catch {
    /* 隐私模式等场景下静默失败 */
  }
}

export interface LastRead {
  slug: string;
  ts: number;
}

export interface ProgressState {
  readSlugs: string[];
  lastRead: LastRead | null;
}

interface ProgressContextValue extends ProgressState {
  /** 已读篇数（去重后） */
  readCount: number;
  /** 全站总进度 0–100 */
  overallProgress: number;
  /** 标记某篇为已读（同时更新 lastRead） */
  markRead: (slug: string) => void;
  /** 取消已读标记 */
  markUnread: (slug: string) => void;
  isRead: (slug: string) => boolean;
  /** 某板块进度：{ read, total, percent(0-100) } */
  getCategoryProgress: (category: CategoryId) => {
    read: number;
    total: number;
    percent: number;
  };
  /** 记录「最后阅读」但不强制标记已读（进入文章页时调用） */
  touchLastRead: (slug: string) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return { readSlugs: [], lastRead: null };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    // 兼容历史数据：裸 slug 键规范化为复合 id（裸 slug 能唯一匹配时视为同一篇）
    return {
      readSlugs: Array.isArray(parsed.readSlugs)
        ? [
            ...new Set(
              parsed.readSlugs
                .filter((s): s is string => typeof s === 'string')
                .map(normalizeArticleKey),
            ),
          ]
        : [],
      lastRead:
        parsed.lastRead && typeof parsed.lastRead.slug === 'string'
          ? {
              slug: normalizeArticleKey(parsed.lastRead.slug),
              ts: parsed.lastRead.ts ?? Date.now(),
            }
          : null,
    };
  } catch {
    return { readSlugs: [], lastRead: null };
  }
}

function saveState(state: ProgressState) {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* 隐私模式等场景下静默失败 */
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() =>
    typeof window === 'undefined' ? { readSlugs: [], lastRead: null } : loadState(),
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  // 跨标签页同步
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PROGRESS_STORAGE_KEY) setState(loadState());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const markRead = useCallback((slug: string) => {
    const key = normalizeArticleKey(slug);
    setState((prev) => ({
      readSlugs: prev.readSlugs.includes(key)
        ? prev.readSlugs
        : [...prev.readSlugs, key],
      lastRead: { slug: key, ts: Date.now() },
    }));
  }, []);

  const markUnread = useCallback((slug: string) => {
    const key = normalizeArticleKey(slug);
    setState((prev) => ({
      ...prev,
      readSlugs: prev.readSlugs.filter((s) => s !== key),
    }));
  }, []);

  const touchLastRead = useCallback((slug: string) => {
    const key = normalizeArticleKey(slug);
    setState((prev) => ({ ...prev, lastRead: { slug: key, ts: Date.now() } }));
  }, []);

  const isRead = useCallback(
    (slug: string) => state.readSlugs.includes(normalizeArticleKey(slug)),
    [state.readSlugs],
  );

  const getCategoryProgress = useCallback(
    (category: CategoryId) => {
      const list = getArticlesByCategory(category);
      const total = list.length;
      const read = list.filter((a) => state.readSlugs.includes(a.id)).length;
      return {
        read,
        total,
        percent: total === 0 ? 0 : Math.round((read / total) * 100),
      };
    },
    [state.readSlugs],
  );

  const resetProgress = useCallback(() => {
    setState({ readSlugs: [], lastRead: null });
  }, []);

  const value = useMemo<ProgressContextValue>(() => {
    const known = articles.filter((a) => state.readSlugs.includes(a.id)).length;
    const total = articles.length;
    return {
      ...state,
      readCount: known,
      overallProgress: total === 0 ? 0 : Math.round((known / total) * 100),
      markRead,
      markUnread,
      isRead,
      getCategoryProgress,
      touchLastRead,
      resetProgress,
    };
  }, [state, markRead, markUnread, isRead, getCategoryProgress, touchLastRead, resetProgress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress 必须在 <ProgressProvider> 内使用');
  return ctx;
}
