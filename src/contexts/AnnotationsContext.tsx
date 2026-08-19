/**
 * 文章批注系统
 * localStorage 键 `voyage-annotations` → { [articleSlug]: Annotation[] }
 * 持久化 / 跨标签页同步模式与 ProgressContext 一致。
 * 写入失败（如 QuotaExceededError，约 5MB 上限）时 toast 提示且不更新内存状态。
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
import { toast } from 'sonner';

export const ANNOTATIONS_STORAGE_KEY = 'voyage-annotations';

export interface Annotation {
  id: string;
  /** 划线批注：选中的原文（整篇笔记为空） */
  quote?: string;
  /** 原文前 30 字上下文（锚定用） */
  prefix?: string;
  /** 原文后 30 字上下文（锚定用） */
  suffix?: string;
  /** 笔记内容 */
  text: string;
  /** 截图 dataURL 列表（已压缩） */
  images: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AnnotationDraft {
  quote?: string;
  prefix?: string;
  suffix?: string;
  text: string;
  images: string[];
}

export type AnnotationsMap = Record<string, Annotation[]>;

interface AnnotationsContextValue {
  map: AnnotationsMap;
  /** 某篇文章的批注（按创建时间升序） */
  getFor: (slug: string) => Annotation[];
  countFor: (slug: string) => number;
  /** 新增批注；写入 localStorage 失败时返回 null */
  addAnnotation: (slug: string, draft: AnnotationDraft) => Annotation | null;
  /** 更新笔记文字 / 截图；失败返回 false */
  updateAnnotation: (
    slug: string,
    id: string,
    patch: { text: string; images: string[] },
  ) => boolean;
  removeAnnotation: (slug: string, id: string) => void;
}

const AnnotationsContext = createContext<AnnotationsContextValue | null>(null);

/** 空列表共享引用，避免每次返回新数组导致下游 effect 抖动 */
const EMPTY_LIST: Annotation[] = [];

function normalizeAnnotation(raw: unknown): Annotation | null {
  if (!raw || typeof raw !== 'object') return null;
  const a = raw as Partial<Annotation>;
  if (typeof a.id !== 'string' || typeof a.text !== 'string') return null;
  return {
    id: a.id,
    quote: typeof a.quote === 'string' ? a.quote : undefined,
    prefix: typeof a.prefix === 'string' ? a.prefix : undefined,
    suffix: typeof a.suffix === 'string' ? a.suffix : undefined,
    text: a.text,
    images: Array.isArray(a.images)
      ? a.images.filter((s): s is string => typeof s === 'string')
      : [],
    createdAt: typeof a.createdAt === 'number' ? a.createdAt : Date.now(),
    updatedAt: typeof a.updatedAt === 'number' ? a.updatedAt : Date.now(),
  };
}

function loadState(): AnnotationsMap {
  try {
    const raw = localStorage.getItem(ANNOTATIONS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const map: AnnotationsMap = {};
    for (const [slug, list] of Object.entries(parsed)) {
      if (!Array.isArray(list)) continue;
      const items = list
        .map(normalizeAnnotation)
        .filter((a): a is Annotation => a !== null)
        .sort((a, b) => a.createdAt - b.createdAt);
      if (items.length > 0) map[slug] = items;
    }
    return map;
  } catch {
    return {};
  }
}

/** 先写 localStorage，成功返回 true；配额不足等失败时 toast 并返回 false */
function saveState(map: AnnotationsMap): boolean {
  try {
    localStorage.setItem(ANNOTATIONS_STORAGE_KEY, JSON.stringify(map));
    return true;
  } catch {
    toast.error('存储空间不足，请删除部分截图');
    return false;
  }
}

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `ann-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function AnnotationsProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<AnnotationsMap>(() =>
    typeof window === 'undefined' ? {} : loadState(),
  );

  // 跨标签页同步（与 ProgressContext 相同模式）
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ANNOTATIONS_STORAGE_KEY) setMap(loadState());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /** 写入成功才更新内存状态 */
  const commit = useCallback((next: AnnotationsMap): boolean => {
    if (!saveState(next)) return false;
    setMap(next);
    return true;
  }, []);

  const getFor = useCallback((slug: string) => map[slug] ?? EMPTY_LIST, [map]);
  const countFor = useCallback((slug: string) => map[slug]?.length ?? 0, [map]);

  const addAnnotation = useCallback(
    (slug: string, draft: AnnotationDraft): Annotation | null => {
      const now = Date.now();
      const annotation: Annotation = {
        id: createId(),
        quote: draft.quote,
        prefix: draft.prefix,
        suffix: draft.suffix,
        text: draft.text,
        images: draft.images,
        createdAt: now,
        updatedAt: now,
      };
      const next = { ...map, [slug]: [...(map[slug] ?? []), annotation] };
      if (!commit(next)) return null;
      return annotation;
    },
    [map, commit],
  );

  const updateAnnotation = useCallback(
    (
      slug: string,
      id: string,
      patch: { text: string; images: string[] },
    ): boolean => {
      const list = map[slug];
      if (!list) return false;
      const next = {
        ...map,
        [slug]: list.map((a) =>
          a.id === id
            ? { ...a, text: patch.text, images: patch.images, updatedAt: Date.now() }
            : a,
        ),
      };
      return commit(next);
    },
    [map, commit],
  );

  const removeAnnotation = useCallback(
    (slug: string, id: string) => {
      const list = map[slug];
      if (!list) return;
      const rest = list.filter((a) => a.id !== id);
      const next = { ...map };
      if (rest.length > 0) next[slug] = rest;
      else delete next[slug];
      commit(next);
    },
    [map, commit],
  );

  const value = useMemo<AnnotationsContextValue>(
    () => ({ map, getFor, countFor, addAnnotation, updateAnnotation, removeAnnotation }),
    [map, getFor, countFor, addAnnotation, updateAnnotation, removeAnnotation],
  );

  return (
    <AnnotationsContext.Provider value={value}>
      {children}
    </AnnotationsContext.Provider>
  );
}

export function useAnnotations(): AnnotationsContextValue {
  const ctx = useContext(AnnotationsContext);
  if (!ctx) throw new Error('useAnnotations 必须在 <AnnotationsProvider> 内使用');
  return ctx;
}
