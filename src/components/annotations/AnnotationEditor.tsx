/**
 * 批注编辑器卡片：textarea + 截图上传（文件选择器 + Ctrl+V 粘贴）+ 保存/取消。
 * 被三种入口复用：划线气泡、整篇笔记 Dialog、批注面板编辑 Dialog。
 */
import { useRef, useState } from 'react';
import type { ClipboardEvent } from 'react';
import { ImagePlus, Trash2, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { compressImages } from './image';
import { quoteExcerpt } from './utils';

interface AnnotationEditorProps {
  initialText: string;
  initialImages: string[];
  /** 划线批注时显示原文摘要 */
  quote?: string;
  autoFocus?: boolean;
  onSave: (text: string, images: string[]) => void;
  onCancel: () => void;
  /** 编辑已有批注时提供删除入口（父组件处理二次确认） */
  onDelete?: () => void;
  /** 删除按钮是否处于「确认删除」态 */
  deleteConfirm?: boolean;
}

export default function AnnotationEditor({
  initialText,
  initialImages,
  quote,
  autoFocus = true,
  onSave,
  onCancel,
  onDelete,
  deleteConfirm = false,
}: AnnotationEditorProps) {
  const [text, setText] = useState(initialText);
  const [images, setImages] = useState<string[]>(initialImages);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (files: (File | Blob)[]) => {
    if (files.length === 0) return;
    setBusy(true);
    try {
      const urls = await compressImages(files);
      if (urls.length > 0) setImages((prev) => [...prev, ...urls]);
    } finally {
      setBusy(false);
    }
  };

  // Ctrl+V 粘贴截图
  const onPaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const f = item.getAsFile();
        if (f) imageFiles.push(f);
      }
    }
    if (imageFiles.length > 0) {
      e.preventDefault();
      void addFiles(imageFiles);
    }
  };

  const canSave = !busy && (text.trim().length > 0 || images.length > 0);

  return (
    <div onPaste={onPaste} className="flex flex-col gap-3">
      {quote && (
        <p className="border-l-[3px] border-gold bg-gold/10 px-3 py-2 text-[13px] leading-[1.7] text-ink-soft">
          {quoteExcerpt(quote)}
        </p>
      )}

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="记录这段航路的心得…（可直接 Ctrl+V 粘贴截图）"
        autoFocus={autoFocus}
        rows={4}
        className="min-h-[96px] resize-y border-line bg-white text-[14px] leading-[1.8] text-ink placeholder:text-ink-faint focus-visible:ring-teal/40"
      />

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-md border border-line shadow-card"
            >
              <img src={src} alt={`截图 ${i + 1}`} className="h-14 w-14 object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                aria-label={`删除截图 ${i + 1}`}
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-teal px-3 py-1 text-xs font-medium text-teal transition-colors hover:bg-teal-mist disabled:opacity-50"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            {busy ? '压缩中…' : '上传截图'}
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                deleteConfirm
                  ? 'bg-vermilion text-white'
                  : 'text-vermilion hover:bg-vermilion/10',
              )}
            >
              <Trash2 className="h-3 w-3" />
              {deleteConfirm ? '确认删除' : '删除'}
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = '';
            void addFiles(files);
          }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-1.5 text-[13px] font-medium text-ink-faint transition-colors hover:text-ink"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => canSave && onSave(text.trim(), images)}
            disabled={!canSave}
            className="rounded-full bg-teal px-4 py-1.5 text-[13px] font-medium text-white shadow-card transition-all duration-200 hover:-translate-y-px hover:bg-teal-deep disabled:pointer-events-none disabled:opacity-50"
          >
            保存批注
          </button>
        </div>
      </div>
    </div>
  );
}
