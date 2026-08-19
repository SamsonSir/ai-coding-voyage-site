/** 批注截图缩略图组：点击查看大图（shadcn Dialog 简易 Lightbox） */
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ThumbGalleryProps {
  images: string[];
  className?: string;
}

export default function ThumbGallery({ images, className }: ThumbGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (images.length === 0) return null;

  return (
    <>
      <div className={cn('flex flex-wrap gap-2', className)}>
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex(i);
            }}
            className="overflow-hidden rounded-md border border-line shadow-card transition-transform duration-200 hover:-translate-y-px"
            aria-label={`查看截图 ${i + 1}`}
          >
            <img
              src={src}
              alt={`批注截图 ${i + 1}`}
              className="h-14 w-14 object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <DialogContent className="max-w-3xl border-line bg-paper p-3">
          <DialogTitle className="sr-only">批注截图</DialogTitle>
          {openIndex !== null && (
            <img
              src={images[openIndex]}
              alt={`批注截图 ${openIndex + 1}`}
              className="max-h-[75dvh] w-full rounded-md object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
