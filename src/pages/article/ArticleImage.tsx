/**
 * 文章图片（article.md S2）：圆角 12px + 描边 + shadow-card，懒加载，
 * 加载前 paper-deep 16:9 占位；alt 作为图注（▲ 前缀）；点击打开 Lightbox
 * （shadcn Dialog，暗色遮罩 80%，scale 0.9→1 进入，ESC/点击遮罩关闭）。
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';

interface ArticleImageProps {
  src?: string;
  alt?: string;
}

export default function ArticleImage({ src, alt }: ArticleImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  if (!src) return null;

  return (
    <>
      <motion.figure
        className="my-8"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
          aria-label={alt ? `放大图片：${alt}` : '放大图片'}
        >
          <span className="relative block overflow-hidden rounded-xl border border-line bg-paper-deep shadow-card">
            {!loaded && <span className="block aspect-video animate-pulse" aria-hidden />}
            <img
              src={src}
              alt={alt ?? ''}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={cn(
                'block w-full transition-opacity duration-300',
                loaded ? 'relative opacity-100' : 'absolute inset-0 opacity-0',
              )}
            />
          </span>
        </button>
        {alt && (
          <figcaption className="mt-2.5 text-center text-[13px] leading-[1.7] text-ink-faint">
            ▲ {alt}
          </figcaption>
        )}
      </motion.figure>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="z-[90] bg-ink/80 backdrop-blur-[2px]" />
          <DialogPrimitive.Content
            className="fixed left-1/2 top-1/2 z-[95] w-[92vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-90 data-[state=closed]:zoom-out-95 duration-300"
          >
            <DialogTitle className="sr-only">{alt || '图片预览'}</DialogTitle>
            <img
              src={src}
              alt={alt ?? ''}
              className="mx-auto max-h-[82vh] w-auto max-w-full rounded-lg shadow-lift"
            />
            {alt && (
              <p className="mt-3 text-center text-sm text-paper-dark">▲ {alt}</p>
            )}
            <DialogPrimitive.Close
              className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-paper transition-colors hover:bg-white/20"
              aria-label="关闭图片预览"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
}
