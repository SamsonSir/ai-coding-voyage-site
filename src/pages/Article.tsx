/**
 * 文章页 —— `/article/:category/:slug`（兼容 `/article/:slug`）
 * design/article.md 全量实现：
 * S0 阅读进度条 · S1 标头入场动画 · S2 Markdown 排版 · S3 左侧章节导航 ·
 * S4 右侧滚动联动 TOC · S5 篇尾操作区（标记已读 + 跨板块上一篇/下一篇）·
 * S6 同板块推荐 · 骨架屏 / 404 空态 · 移动端底部抽屉。
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useArticle } from '@/hooks/useArticle';
import { useProgress, saveLastCategory } from '@/contexts/ProgressContext';
import ArticleAnnotations from '@/components/annotations/ArticleAnnotations';
import { getArticlesByCategory, resolveRouteArticle } from '@/data/articles';
import type { ArticleMeta } from '@/data/articles';
import { CATEGORY_MAP } from '@/data/categories';
import type { CategoryMeta } from '@/data/categories';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import ReadingProgressBar from './article/ReadingProgressBar';
import ArticleHeader from './article/ArticleHeader';
import MarkdownBody from './article/MarkdownBody';
import ChapterNav from './article/ChapterNav';
import ArticleToc from './article/ArticleToc';
import ArticleFooter from './article/ArticleFooter';
import ArticleSkeleton from './article/ArticleSkeleton';
import ArticleNotFound from './article/ArticleNotFound';
import { GLOBAL_ARTICLES, extractHeadings } from './article/utils';

type DrawerKind = 'chapters' | 'toc' | null;

interface ArticleContentProps {
  meta: ArticleMeta;
  catMeta: CategoryMeta;
  content: string;
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
}

/** 已加载的文章主体（按 routeSlug key 重挂载，保证标头动画与抽屉状态重置） */
function ArticleContent({ meta, catMeta, content, prev, next }: ArticleContentProps) {
  const catArticles = useMemo(() => getArticlesByCategory(catMeta.id), [catMeta.id]);
  const tocItems = useMemo(() => extractHeadings(content), [content]);
  const [activeHeading, setActiveHeading] = useState('');
  const [drawer, setDrawer] = useState<DrawerKind>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // 滚动联动 TOC（article.md S4：当前阅读标题高亮）
  useEffect(() => {
    if (tocItems.length === 0) return;
    let raf = 0;
    const update = () => {
      const y = window.scrollY + 120;
      let current = '';
      for (const item of tocItems) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= y) current = item.id;
      }
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 8) {
        current = tocItems[tocItems.length - 1].id;
      }
      setActiveHeading((prevId) => (prevId === current ? prevId : current));
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    // 等 Markdown 渲染完再测一次
    schedule();
    const t = window.setTimeout(schedule, 300);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [tocItems]);

  return (
    <div className="mx-auto max-w-wide px-5 pb-24 md:px-8 lg:px-12">
      <div className="flex items-start justify-center gap-10 pt-12 xl:gap-14">
        {/* S3 左侧章节导航（≥1024px） */}
        <motion.aside
          className="sticky top-[104px] hidden h-[calc(100dvh-128px)] w-60 shrink-0 lg:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChapterNav
            catMeta={catMeta}
            articles={catArticles}
            currentId={meta.id}
          />
        </motion.aside>

        {/* 中栏：标头 + 正文 + 篇尾 */}
        <div className="w-full min-w-0 max-w-read shrink">
          <ArticleHeader
            meta={meta}
            catMeta={catMeta}
            onOpenChapters={() => setDrawer('chapters')}
            onOpenToc={() => setDrawer('toc')}
          />
          {/* 批注：写批注入口 + 列表面板 + 选区划线交互 */}
          <ArticleAnnotations slug={meta.id} containerRef={bodyRef} />
          <MarkdownBody content={content} catColor={catMeta.color} containerRef={bodyRef} />
          <ArticleFooter meta={meta} prev={prev} next={next} />
        </div>

        {/* S4 右侧 TOC（≥1280px） */}
        <motion.aside
          className="sticky top-[104px] hidden max-h-[calc(100dvh-128px)] w-[200px] shrink-0 overflow-y-auto xl:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
            本篇目录
          </h2>
          <div className="mt-4">
            <ArticleToc items={tocItems} activeId={activeHeading} />
          </div>
        </motion.aside>
      </div>

      {/* 移动端底部抽屉：章节 / 本篇目录 */}
      <Drawer open={drawer === 'chapters'} onOpenChange={(o) => !o && setDrawer(null)}>
        <DrawerContent className="max-h-[75dvh] rounded-t-2xl bg-paper">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="font-serif text-lg font-bold text-ink">
              章节
            </DrawerTitle>
          </DrawerHeader>
          <div className="min-h-0 overflow-y-auto px-6 pb-8 pt-4">
            <ChapterNav
              catMeta={catMeta}
              articles={catArticles}
              currentId={meta.id}
              onNavigate={() => setDrawer(null)}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={drawer === 'toc'} onOpenChange={(o) => !o && setDrawer(null)}>
        <DrawerContent className="max-h-[75dvh] rounded-t-2xl bg-paper">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="font-serif text-lg font-bold text-ink">
              本篇目录
            </DrawerTitle>
          </DrawerHeader>
          <div className="min-h-0 overflow-y-auto px-6 pb-8 pt-4">
            <ArticleToc
              items={tocItems}
              activeId={activeHeading}
              onNavigate={() => setDrawer(null)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function Article() {
  const params = useParams();
  const navigate = useNavigate();
  // 两段路由 /article/:category/:slug 精确匹配复合键；
  // 单段路由 /article/:slug 时 slug 落在 params.category 上，按裸 slug 解析
  const { meta, needRedirect } = resolveRouteArticle(params.category, params.slug);
  const categoryParamValid =
    !params.category || !params.slug || params.category in CATEGORY_MAP;
  const notFound = !meta || !categoryParamValid;

  // 裸 slug 命中重复文章（如 preface）→ 重定向到规范复合路由
  useEffect(() => {
    if (meta && needRedirect) {
      navigate(`/article/${meta.id}`, { replace: true });
    }
  }, [meta, needRedirect, navigate]);

  // 内容文件路径即复合 id：/content/{category}/{slug}.md
  const fetchSlug = meta ? meta.id : undefined;
  const { loading, error, content } = useArticle(fetchSlug);

  const { touchLastRead } = useProgress();

  // 记录「最后阅读」+「当前篇章」（目录页据此定位）
  useEffect(() => {
    if (meta && !loading && !error) touchLastRead(meta.id);
  }, [meta, loading, error, touchLastRead]);

  useEffect(() => {
    if (meta) saveLastCategory(meta.category);
  }, [meta]);

  // 跨板块上一篇/下一篇（全站顺序 renzhi→…→zuixin，类目内按 order）
  const { prev, next } = useMemo(() => {
    if (!meta) return { prev: null, next: null };
    const i = GLOBAL_ARTICLES.findIndex((a) => a.id === meta.id);
    return {
      prev: i > 0 ? GLOBAL_ARTICLES[i - 1] : null,
      next: i >= 0 && i < GLOBAL_ARTICLES.length - 1 ? GLOBAL_ARTICLES[i + 1] : null,
    };
  }, [meta]);

  const catMeta = meta ? CATEGORY_MAP[meta.category] : null;

  return (
    <div>
      <ReadingProgressBar />
      {notFound ? (
        <ArticleNotFound />
      ) : loading ? (
        <div className="mx-auto max-w-read px-5 pb-24 md:px-8">
          <ArticleSkeleton />
        </div>
      ) : error ? (
        <ArticleNotFound message={error} />
      ) : meta && catMeta ? (
        <ArticleContent
          key={meta.id}
          meta={meta}
          catMeta={catMeta}
          content={content}
          prev={prev}
          next={next}
        />
      ) : null}
    </div>
  );
}
