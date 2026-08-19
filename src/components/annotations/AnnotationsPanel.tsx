/**
 * 批注列表面板：右侧 Drawer（移动端从底部弹出）。
 * 列出本篇全部批注：引用摘要 / 笔记 / 截图缩略图 / 时间，支持编辑、删除、
 * 点击划线批注滚动定位到正文高亮并闪烁；空态沿用 empty-treasure.svg 风格。
 */
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useAnnotations } from '@/contexts/AnnotationsContext';
import type { Annotation } from '@/contexts/AnnotationsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import AnnotationEditor from './AnnotationEditor';
import ThumbGallery from './ThumbGallery';
import { formatTime, quoteExcerpt } from './utils';

interface AnnotationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  annotations: Annotation[];
  /** 当前成功锚定到正文的批注 id 集合 */
  anchoredIds: Set<string>;
  /** 点击划线批注：滚动定位 + 闪烁（面板会先关闭） */
  onLocate: (id: string) => void;
}

export default function AnnotationsPanel({
  open,
  onOpenChange,
  slug,
  annotations,
  anchoredIds,
  onLocate,
}: AnnotationsPanelProps) {
  const isMobile = useIsMobile();
  const { updateAnnotation, removeAnnotation } = useAnnotations();
  const [editing, setEditing] = useState<Annotation | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // 新的在前
  const ordered = [...annotations].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side={isMobile ? 'bottom' : 'right'}
          className={cn(
            'border-line bg-paper text-ink',
            isMobile
              ? 'max-h-[80dvh] rounded-t-2xl'
              : 'w-[380px] sm:max-w-[380px]',
          )}
        >
          <SheetHeader className="border-b border-line pb-3">
            <SheetTitle className="font-serif text-lg font-bold text-ink">
              批注（{annotations.length}）
            </SheetTitle>
            <SheetDescription className="sr-only">
              本篇文章的全部批注列表
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-6">
            {ordered.length === 0 ? (
              <div className="mt-14 text-center">
                <img
                  src="/empty-treasure.svg"
                  alt="空宝箱"
                  className="mx-auto h-28 w-auto opacity-90"
                />
                <p className="mt-4 font-serif text-base font-bold text-ink">
                  这片海域还没有批注
                </p>
                <p className="mt-1 text-[13px] text-ink-soft">
                  选中正文文字写下心得，或点击「写批注」记录整篇笔记。
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3 pt-4">
                {ordered.map((a) => {
                  const anchored = a.quote ? anchoredIds.has(a.id) : false;
                  return (
                    <li
                      key={a.id}
                      className="rounded-xl border border-line bg-white p-4 shadow-card"
                    >
                      {a.quote ? (
                        <button
                          type="button"
                          onClick={() => anchored && onLocate(a.id)}
                          className={cn(
                            'block w-full border-l-[3px] border-gold bg-gold/10 px-3 py-2 text-left text-[13px] leading-[1.7] text-ink-soft transition-colors',
                            anchored ? 'hover:bg-gold/20' : 'opacity-70',
                          )}
                          title={anchored ? '点击定位到正文' : undefined}
                        >
                          {quoteExcerpt(a.quote)}
                          {!anchored && (
                            <span className="ml-2 inline-block rounded-full bg-vermilion/10 px-2 py-0.5 text-[11px] text-vermilion">
                              原文已变动
                            </span>
                          )}
                        </button>
                      ) : (
                        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-teal">
                          整篇笔记
                        </p>
                      )}

                      {a.text && (
                        <p className="mt-2 whitespace-pre-wrap text-[14px] leading-[1.8] text-ink">
                          {a.text}
                        </p>
                      )}

                      <ThumbGallery images={a.images} className="mt-2" />

                      <div className="mt-3 flex items-center justify-between">
                        <time className="text-xs text-ink-faint">
                          {formatTime(a.updatedAt)}
                        </time>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditing(a)}
                            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-teal transition-colors hover:bg-teal-mist"
                          >
                            <Pencil className="h-3 w-3" />
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirmDeleteId === a.id) {
                                removeAnnotation(slug, a.id);
                                setConfirmDeleteId(null);
                              } else {
                                setConfirmDeleteId(a.id);
                                window.setTimeout(() => {
                                  setConfirmDeleteId((cur) => (cur === a.id ? null : cur));
                                }, 3000);
                              }
                            }}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                              confirmDeleteId === a.id
                                ? 'bg-vermilion text-white'
                                : 'text-vermilion hover:bg-vermilion/10',
                            )}
                          >
                            <Trash2 className="h-3 w-3" />
                            {confirmDeleteId === a.id ? '确认删除' : '删除'}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* 面板内编辑：居中 Dialog */}
      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="border-line bg-paper sm:max-w-md">
          <DialogTitle className="font-serif text-base font-bold text-ink">
            编辑批注
          </DialogTitle>
          {editing && (
            <AnnotationEditor
              initialText={editing.text}
              initialImages={editing.images}
              quote={editing.quote}
              onSave={(text, images) => {
                if (updateAnnotation(slug, editing.id, { text, images })) {
                  setEditing(null);
                }
              }}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
