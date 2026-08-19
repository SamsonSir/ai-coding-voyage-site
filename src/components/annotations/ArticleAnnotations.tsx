/**
 * 文章批注交互层（每篇文章挂载一次）：
 * - 顶部操作行：「写批注」（整篇笔记，带数量徽标）+「批注（n）」（打开列表面板）
 * - 正文选区浮动工具条（「批注」）→ 划线批注编辑气泡（textarea + 截图上传/粘贴）
 * - 批注视觉：朱红色字 + 金色 2px 下划线；正文左沟槽气泡图标（<lg 降级为内联小图标）
 * - 交互：hover 高亮文字 / 气泡图标 → 150ms 后弹出预览卡片（全文 + 截图 + 时间 + 编辑）；
 *         点击高亮文字 / 气泡图标 → 直接打开编辑气泡（可改 / 可删）
 * - 锚定 effect：正文渲染后包裹高亮 span；面板点击滚动定位并闪烁一次
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Highlighter,
  MessageCircle,
  MessageSquarePlus,
  NotebookPen,
  Pencil,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAnnotations } from '@/contexts/AnnotationsContext';
import type { Annotation } from '@/contexts/AnnotationsContext';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  HIGHLIGHT_ATTR,
  HIGHLIGHT_CSS,
  applyHighlights,
  clearHighlights,
  insertInlineMarkers,
} from './anchors';
import AnnotationEditor from './AnnotationEditor';
import AnnotationsPanel from './AnnotationsPanel';
import ThumbGallery from './ThumbGallery';
import { formatTime, useMediaQuery } from './utils';

interface RectLike {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface SelInfo {
  quote: string;
  prefix: string;
  suffix: string;
  rect: RectLike;
}

interface EditorState {
  mode: 'bubble' | 'dialog';
  /** 编辑已有批注时的 id */
  id?: string;
  quote?: string;
  prefix?: string;
  suffix?: string;
  text: string;
  images: string[];
  rect?: RectLike;
  /** bubble 模式新建批注时保留实时 Range，滚动时重定位 */
  range?: Range;
  /** bubble 模式编辑已有批注时的锚定 id，滚动时按高亮 span 重定位 */
  anchorId?: string;
}

/** hover 预览卡片状态 */
interface PreviewState {
  id: string;
  rect: RectLike;
}

const toRect = (r: DOMRect): RectLike => ({
  top: r.top,
  left: r.left,
  right: r.right,
  bottom: r.bottom,
  width: r.width,
  height: r.height,
});

/** 浮动条定位：选区上方居中，贴顶时改放下方 */
function toolbarStyle(rect: RectLike): CSSProperties {
  const vw = window.innerWidth;
  let left = rect.left + rect.width / 2;
  left = Math.max(70, Math.min(left, vw - 70));
  const top = rect.top - 48 >= 8 ? rect.top - 48 : rect.bottom + 8;
  return { position: 'fixed', top, left, transform: 'translateX(-50%)', zIndex: 50 };
}

const BUBBLE_W = 340;

/** 气泡 / 预览卡定位：锚点下方，空间不足时翻到上方；水平防溢出 */
function bubbleStyle(rect: RectLike): CSSProperties {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(BUBBLE_W, vw - 16);
  let left = rect.left + rect.width / 2 - width / 2;
  left = Math.max(8, Math.min(left, vw - width - 8));
  const placeAbove = rect.bottom + 8 + 320 > vh && rect.top > 220;
  if (placeAbove) {
    return { position: 'fixed', bottom: vh - rect.top + 8, left, width, zIndex: 50 };
  }
  return { position: 'fixed', top: rect.bottom + 8, left, width, zIndex: 50 };
}

const BUBBLE_MOTION = {
  initial: { opacity: 0, scale: 0.95, y: 4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 4 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
} as const;

/** 沟槽气泡弹入动画（scale 0→1 弹簧） */
const GUTTER_MOTION = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  exit: { scale: 0 },
  transition: { type: 'spring', stiffness: 500, damping: 22 },
} as const;

/** 沟槽气泡垂直堆叠间隔（px） */
const GUTTER_STACK_GAP = 28;
/** 同段落判定时向上查找的块级祖先选择器 */
const BLOCK_SELECTOR = 'p, li, blockquote, h1, h2, h3, h4, td, th, pre';

interface ArticleAnnotationsProps {
  slug: string;
  containerRef: RefObject<HTMLDivElement | null>;
}

export default function ArticleAnnotations({ slug, containerRef }: ArticleAnnotationsProps) {
  const { getFor, addAnnotation, updateAnnotation, removeAnnotation } = useAnnotations();
  const annotations = getFor(slug);

  const [toolbar, setToolbar] = useState<SelInfo | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [anchoredIds, setAnchoredIds] = useState<Set<string>>(new Set());
  /** 桌面端沟槽气泡：id + 相对正文容器的 top */
  const [gutterPos, setGutterPos] = useState<{ id: string; top: number }[]>([]);
  /** 移动端内联气泡 portal 挂载点 */
  const [markers, setMarkers] = useState<Record<string, HTMLElement>>({});
  /** <lg 无左沟槽：气泡降级为高亮文字后的内联小图标 */
  const narrow = useMediaQuery('(max-width: 1023.98px)');

  /** 编辑器 / 面板打开时抑制选区工具条（预览卡为瞬时 hover UI，不抑制） */
  const uiOpen = !!editor || panelOpen;
  const uiOpenRef = useRef(uiOpen);
  useEffect(() => {
    uiOpenRef.current = uiOpen;
  }, [uiOpen]);

  /* ── 锚定：正文 / 批注 / 断点变化后重扫高亮（先清理旧包裹） ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const anchored = applyHighlights(container, annotations);
    setAnchoredIds(anchored);
    if (narrow) {
      setMarkers(Object.fromEntries(insertInlineMarkers(container, anchored)));
    } else {
      setMarkers({});
    }
    return () => clearHighlights(container);
  }, [containerRef, annotations, narrow]);

  /* ── 沟槽气泡定位：高亮 span 相对容器的 top；同段落垂直堆叠 ── */
  const measureGutter = useCallback(() => {
    const container = containerRef.current;
    if (!container || narrow) {
      setGutterPos([]);
      return;
    }
    const cRect = container.getBoundingClientRect();
    interface Item {
      id: string;
      top: number;
      block: Element | null;
    }
    const items: Item[] = [];
    anchoredIds.forEach((id) => {
      const el = container.querySelector(`span[${HIGHLIGHT_ATTR}="${id}"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      items.push({
        id,
        top: r.top - cRect.top + 2,
        block: el.closest(BLOCK_SELECTOR),
      });
    });
    // 同一块级祖先内的多条批注：按 top 排序后向下堆叠（间隔 28px）
    const byBlock = new Map<Element | null, Item[]>();
    for (const it of items) {
      const arr = byBlock.get(it.block) ?? [];
      arr.push(it);
      byBlock.set(it.block, arr);
    }
    const out: { id: string; top: number }[] = [];
    byBlock.forEach((arr) => {
      arr.sort((a, b) => a.top - b.top);
      let prev = -Infinity;
      for (const it of arr) {
        const top = Math.max(it.top, prev + GUTTER_STACK_GAP);
        prev = top;
        out.push({ id: it.id, top });
      }
    });
    setGutterPos((old) => {
      if (
        old.length === out.length &&
        old.every((o, i) => o.id === out[i].id && Math.abs(o.top - out[i].top) < 0.5)
      ) {
        return old;
      }
      return out;
    });
  }, [containerRef, anchoredIds, narrow]);

  /* 布局变化后（rAF + ResizeObserver + window resize，含图片加载）重算气泡位置 */
  useLayoutEffect(() => {
    if (narrow) {
      setGutterPos([]);
      return;
    }
    let raf = requestAnimationFrame(measureGutter);
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measureGutter);
    };
    const container = containerRef.current;
    const ro = new ResizeObserver(schedule);
    if (container) ro.observe(container);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [containerRef, measureGutter, narrow]);

  /* ── 选区监听（触屏与鼠标通用）：读取选中文字 + 前后 30 字上下文 ── */
  useEffect(() => {
    let timer = 0;
    const read = () => {
      const container = containerRef.current;
      const sel = window.getSelection();
      if (
        uiOpenRef.current ||
        !container ||
        !sel ||
        sel.isCollapsed ||
        sel.rangeCount === 0
      ) {
        setToolbar(null);
        return;
      }
      const range = sel.getRangeAt(0);
      if (!container.contains(range.commonAncestorContainer)) {
        setToolbar(null);
        return;
      }
      const quote = sel.toString().trim();
      if (!quote) {
        setToolbar(null);
        return;
      }
      const pre = document.createRange();
      pre.selectNodeContents(container);
      pre.setEnd(range.startContainer, range.startOffset);
      const post = document.createRange();
      post.selectNodeContents(container);
      post.setStart(range.endContainer, range.endOffset);
      setToolbar({
        quote,
        prefix: pre.toString().slice(-30),
        suffix: post.toString().slice(0, 30),
        rect: toRect(range.getBoundingClientRect()),
      });
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(read, 120);
    };
    const soon = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(read, 10);
    };
    document.addEventListener('selectionchange', schedule);
    document.addEventListener('mouseup', soon);
    document.addEventListener('touchend', soon);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('selectionchange', schedule);
      document.removeEventListener('mouseup', soon);
      document.removeEventListener('touchend', soon);
    };
  }, [containerRef]);

  /* ── hover 预览：150ms 延迟出现，移出 200ms 后消失 ── */
  const showTimer = useRef(0);
  const hideTimer = useRef(0);
  const clearHoverTimers = useCallback(() => {
    window.clearTimeout(showTimer.current);
    window.clearTimeout(hideTimer.current);
  }, []);
  const scheduleShow = useCallback(
    (id: string) => {
      window.clearTimeout(hideTimer.current);
      window.clearTimeout(showTimer.current);
      showTimer.current = window.setTimeout(() => {
        const el = containerRef.current?.querySelector(`span[${HIGHLIGHT_ATTR}="${id}"]`);
        if (!el) return;
        setPreview({ id, rect: toRect(el.getBoundingClientRect()) });
      }, 150);
    },
    [containerRef],
  );
  const scheduleHide = useCallback(() => {
    window.clearTimeout(showTimer.current);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setPreview(null), 200);
  }, []);

  /* 高亮文字 hover（事件委托）；同批注的两个 span 之间移动不触发隐藏 */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const hit = (t: EventTarget | null) =>
      (t as HTMLElement | null)?.closest?.(`span[${HIGHLIGHT_ATTR}]`) ?? null;
    const onOver = (e: MouseEvent) => {
      const span = hit(e.target);
      const id = span?.getAttribute(HIGHLIGHT_ATTR);
      if (id) scheduleShow(id);
    };
    const onOut = (e: MouseEvent) => {
      const span = hit(e.target);
      if (!span) return;
      const relSpan = hit(e.relatedTarget);
      if (relSpan && relSpan.getAttribute(HIGHLIGHT_ATTR) === span.getAttribute(HIGHLIGHT_ATTR)) {
        return;
      }
      if ((e.relatedTarget as HTMLElement | null)?.closest?.('[data-annotation-preview]')) {
        return; // 移入预览卡片，保持显示
      }
      scheduleHide();
    };
    container.addEventListener('mouseover', onOver);
    container.addEventListener('mouseout', onOut);
    return () => {
      container.removeEventListener('mouseover', onOver);
      container.removeEventListener('mouseout', onOut);
    };
  }, [containerRef, scheduleShow, scheduleHide]);

  useEffect(() => clearHoverTimers, [clearHoverTimers]);

  /* ── 动作：点击高亮 / 气泡 → 打开编辑气泡 ── */
  const openEditBubble = useCallback(
    (id: string) => {
      const ann = annotations.find((a) => a.id === id);
      const el = containerRef.current?.querySelector(`span[${HIGHLIGHT_ATTR}="${id}"]`);
      if (!ann || !el) return;
      clearHoverTimers();
      setPreview(null);
      setToolbar(null);
      setConfirmDelete(false);
      setEditor({
        mode: 'bubble',
        id: ann.id,
        quote: ann.quote,
        text: ann.text,
        images: ann.images,
        rect: toRect(el.getBoundingClientRect()),
        anchorId: id,
      });
    },
    [annotations, containerRef, clearHoverTimers],
  );

  /* 点击高亮文字 → 编辑气泡（事件委托） */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const span = target?.closest?.(`span[${HIGHLIGHT_ATTR}]`);
      if (!span) return;
      const id = span.getAttribute(HIGHLIGHT_ATTR);
      if (!id) return;
      e.preventDefault();
      openEditBubble(id);
    };
    container.addEventListener('click', onClick);
    return () => container.removeEventListener('click', onClick);
  }, [containerRef, openEditBubble]);

  /* ── 点击 UI 外部关闭；滚动时隐藏工具条/预览并重定位气泡 ── */
  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('[data-annotation-ui]')) return;
      setToolbar(null);
      setEditor(null);
      clearHoverTimers();
      setPreview(null);
    };
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setToolbar(null);
        setPreview(null);
        setEditor((ed) => {
          if (!ed || ed.mode !== 'bubble') return ed;
          if (ed.range) {
            return { ...ed, rect: toRect(ed.range.getBoundingClientRect()) };
          }
          if (ed.anchorId) {
            const el = containerRef.current?.querySelector(
              `span[${HIGHLIGHT_ATTR}="${ed.anchorId}"]`,
            );
            return el ? { ...ed, rect: toRect(el.getBoundingClientRect()) } : ed;
          }
          return ed;
        });
      });
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('scroll', onScroll, { capture: true });
      cancelAnimationFrame(raf);
    };
  }, [containerRef, clearHoverTimers]);

  const openSelectionEditor = () => {
    if (!toolbar) return;
    const sel = window.getSelection();
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : undefined;
    setEditor({
      mode: 'bubble',
      quote: toolbar.quote,
      prefix: toolbar.prefix,
      suffix: toolbar.suffix,
      text: '',
      images: [],
      rect: toolbar.rect,
      range,
    });
    setToolbar(null);
  };

  const saveEditor = (text: string, images: string[]) => {
    if (!editor) return;
    let ok: boolean;
    if (editor.id) {
      ok = updateAnnotation(slug, editor.id, { text, images });
    } else {
      ok =
        addAnnotation(slug, {
          quote: editor.quote,
          prefix: editor.prefix,
          suffix: editor.suffix,
          text,
          images,
        }) !== null;
    }
    if (ok) {
      toast.success('批注已保存');
      setEditor(null);
      setPreview(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const deleteAnnotation = useCallback(
    (id: string) => {
      removeAnnotation(slug, id);
      setEditor(null);
      setPreview(null);
      setConfirmDelete(false);
    },
    [removeAnnotation, slug],
  );

  /** 编辑器删除按钮：第一次点击进入确认态，3 秒内再点确认 */
  const handleEditorDelete = () => {
    if (!editor?.id) return;
    const id = editor.id;
    if (confirmDelete) {
      deleteAnnotation(id);
    } else {
      setConfirmDelete(true);
      window.setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  /** 面板点击划线批注：滚动定位 + 闪烁一次 */
  const locate = useCallback(
    (id: string) => {
      setPanelOpen(false);
      // 等面板关闭动画与布局稳定后再滚动
      window.setTimeout(() => {
        const el = containerRef.current?.querySelector(`span[${HIGHLIGHT_ATTR}="${id}"]`);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        containerRef.current
          ?.querySelectorAll(`span[${HIGHLIGHT_ATTR}="${id}"]`)
          .forEach((span) =>
            (span as HTMLElement).animate(
              [
                { backgroundColor: 'rgba(201, 162, 75, 0.45)' },
                { backgroundColor: 'rgba(201, 162, 75, 0)' },
              ],
              { duration: 900, easing: 'ease-out' },
            ),
          );
      }, 60);
    },
    [containerRef],
  );

  const previewAnnotation: Annotation | null = preview
    ? (annotations.find((a) => a.id === preview.id) ?? null)
    : null;
  const count = annotations.length;
  const gutterHost = containerRef.current;

  return (
    <>
      {/* 高亮样式注入（不改动 index.css） */}
      <style>{HIGHLIGHT_CSS}</style>

      {/* 顶部操作行：写批注（整篇笔记）+ 批注列表入口 */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            setEditor({ mode: 'dialog', text: '', images: [] })
          }
          className="relative inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-teal px-4 py-1.5 text-[13px] font-medium text-teal transition-colors hover:bg-teal-mist"
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
          写批注
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-vermilion px-1 text-[10px] font-bold leading-none text-white">
              {count}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-teal px-4 py-1.5 text-[13px] font-medium text-teal transition-colors hover:bg-teal-mist"
        >
          <NotebookPen className="h-3.5 w-3.5" />
          批注（{count}）
        </button>
      </div>

      {/* 桌面端：正文左沟槽气泡（portal 进 MarkdownBody 容器，absolute 定位） */}
      {!narrow &&
        gutterHost &&
        gutterPos.length > 0 &&
        createPortal(
          <>
            {gutterPos.map(({ id, top }) => (
              <motion.button
                key={id}
                type="button"
                data-annotation-ui
                aria-label="查看批注"
                style={{ position: 'absolute', left: -32, top, zIndex: 10 }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white shadow-card transition-colors hover:bg-vermilion"
                onMouseEnter={() => scheduleShow(id)}
                onMouseLeave={scheduleHide}
                onClick={() => openEditBubble(id)}
                {...GUTTER_MOTION}
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </motion.button>
            ))}
          </>,
          gutterHost,
        )}

      {/* 移动端（<lg）：内联小气泡紧跟高亮文字之后 */}
      {narrow &&
        Object.entries(markers).map(([id, el]) =>
          createPortal(
            <motion.button
              type="button"
              data-annotation-ui
              aria-label="查看批注"
              className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gold text-white shadow-card"
              onClick={() => openEditBubble(id)}
              {...GUTTER_MOTION}
            >
              <MessageCircle className="h-3 w-3" />
            </motion.button>,
            el,
            id,
          ),
        )}

      <AnimatePresence>
        {/* 选区浮动工具条 */}
        {toolbar && !editor && (
          <motion.div
            key="annotation-toolbar"
            data-annotation-ui
            style={toolbarStyle(toolbar.rect)}
            {...BUBBLE_MOTION}
          >
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={openSelectionEditor}
              className="inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-[13px] font-medium text-white shadow-lift transition-colors hover:bg-teal-deep"
            >
              <Highlighter className="h-3.5 w-3.5" />
              批注
            </button>
          </motion.div>
        )}

        {/* hover 预览卡片：批注全文 + 截图 + 时间 + 编辑入口 */}
        {preview && previewAnnotation && !editor && (
          <motion.div
            key="annotation-preview"
            data-annotation-ui
            data-annotation-preview
            style={bubbleStyle(preview.rect)}
            className="rounded-xl border border-line bg-white p-4 shadow-lift"
            onMouseEnter={clearHoverTimers}
            onMouseLeave={scheduleHide}
            {...BUBBLE_MOTION}
          >
            {previewAnnotation.text && (
              <p className="max-h-40 overflow-y-auto whitespace-pre-wrap text-[14px] leading-[1.8] text-ink">
                {previewAnnotation.text}
              </p>
            )}
            <ThumbGallery
              images={previewAnnotation.images}
              className={previewAnnotation.text ? 'mt-2' : undefined}
            />
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <time className="text-xs text-ink-faint">
                {formatTime(previewAnnotation.updatedAt)}
              </time>
              <button
                type="button"
                onClick={() => openEditBubble(previewAnnotation.id)}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-teal transition-colors hover:bg-teal-mist"
              >
                <Pencil className="h-3 w-3" />
                编辑
              </button>
            </div>
          </motion.div>
        )}

        {/* 划线批注编辑气泡（新建 / 点击高亮或气泡编辑已有批注） */}
        {editor?.mode === 'bubble' && editor.rect && (
          <motion.div
            key="annotation-editor"
            data-annotation-ui
            style={bubbleStyle(editor.rect)}
            className="rounded-xl border border-line bg-white p-4 shadow-lift"
            {...BUBBLE_MOTION}
          >
            <AnnotationEditor
              initialText={editor.text}
              initialImages={editor.images}
              quote={editor.quote}
              onSave={saveEditor}
              onCancel={() => setEditor(null)}
              onDelete={editor.id ? handleEditorDelete : undefined}
              deleteConfirm={confirmDelete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 整篇笔记：居中 Dialog */}
      <Dialog
        open={editor?.mode === 'dialog'}
        onOpenChange={(o) => {
          if (!o) setEditor(null);
        }}
      >
        <DialogContent className="border-line bg-paper sm:max-w-md">
          <DialogTitle className="font-serif text-base font-bold text-ink">
            {editor?.id ? '编辑批注' : '写批注'}
          </DialogTitle>
          {editor?.mode === 'dialog' && (
            <AnnotationEditor
              initialText={editor.text}
              initialImages={editor.images}
              quote={editor.quote}
              onSave={saveEditor}
              onCancel={() => setEditor(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 批注列表面板 */}
      <AnnotationsPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        slug={slug}
        annotations={annotations}
        anchoredIds={anchoredIds}
        onLocate={locate}
      />
    </>
  );
}
