/** 目录页阅读进度筛选（对应路由参数 ?filter=unread|read|all） */
export type ProgressFilter = 'all' | 'unread' | 'read';

export function parseFilter(raw: string | null): ProgressFilter {
  return raw === 'unread' || raw === 'read' ? raw : 'all';
}
