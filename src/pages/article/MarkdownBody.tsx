/**
 * 正文 Markdown 渲染区（article.md S2）
 * react-markdown + remark-gfm，自定义组件映射：
 * 段落 / H2(§编号+板块色竖条) / H3 / H4 / 图片(Lightbox) / 代码块(复制栏) /
 * 行内代码 / 引用块 / 提示框(注意·提示·警告) / 列表 / 表格(斑马纹) / 分隔线 / 外链。
 * 各块进入视口 15% 处淡入上移（0.5s，一次性）。
 */
import { Children, isValidElement, useMemo } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components, ExtraProps } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion } from 'framer-motion';
import { AlertTriangle, ExternalLink, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import CodeBlock from './CodeBlock';
import ArticleImage from './ArticleImage';
import { flattenText } from './utils';

const ENTER = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -15% 0px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
} as const;

/** 去掉 react-markdown 注入的 node 属性（避免透传到 DOM） */
function stripNode<T extends { node?: unknown }>(props: T): Omit<T, 'node'> {
  const { node, ...rest } = props;
  void node;
  return rest;
}

function headingId(node: ExtraProps['node']): string | undefined {
  const line = node?.position?.start.line;
  return line ? `h-${line}` : undefined;
}

/** 判断段落是否仅包裹一张图片（避免 figure 嵌套进 p 的非法结构） */
function isImageOnlyParagraph(children: ReactNode): boolean {
  const arr = Children.toArray(children);
  if (arr.length !== 1) return false;
  const only = arr[0];
  return (
    isValidElement(only) &&
    (only.type === 'img' ||
      typeof (only.props as { src?: unknown }).src === 'string')
  );
}

/** 提示框类型识别：`> **注意/提示/警告** …` */
type CalloutKind = 'tip' | 'warn' | null;
function detectCallout(children: ReactNode): CalloutKind {
  const text = flattenText(children).trimStart();
  if (/^(提示|小提示|贴士|tips?|note)[:：\s]*/i.test(text)) return 'tip';
  if (/^(注意|警告|caution|warning)[:：\s]*/i.test(text)) return 'warn';
  return null;
}

const H2_CLASS =
  'mb-5 mt-16 border-l-4 pl-4 font-serif text-2xl font-bold leading-[1.3] tracking-[0.02em] text-ink [counter-increment:h2sec] before:mr-3 before:font-display before:text-[0.72em] before:font-semibold before:text-[var(--h2-accent)] before:content-[\'§\'_counter(h2sec)] md:text-[32px]';

interface MarkdownBodyProps {
  content: string;
  /** 板块专属色（H2 竖条 / 列表标记 / § 编号） */
  catColor: string;
  /** 容器 ref（批注划线锚定需要遍历正文 DOM） */
  containerRef?: Ref<HTMLDivElement>;
}

export default function MarkdownBody({ content, catColor, containerRef }: MarkdownBodyProps) {
  const components = useMemo<Components>(() => {
    const h2Style: CSSProperties = {
      borderColor: catColor,
      ['--h2-accent' as string]: catColor,
    };

    const renderH2 = (props: ExtraProps & { children?: ReactNode }) => (
      // 正文中的 H1 也视作 H2 级别渲染（部分文章以 # 作小节标题）
      <motion.h2
        id={headingId(props.node)}
        className={H2_CLASS}
        style={h2Style}
        {...ENTER}
      >
        {props.children}
      </motion.h2>
    );

    return {
      h1: renderH2,
      h2: renderH2,
      h3: ({ node, children }) => (
        <motion.h3
          id={headingId(node)}
          className="mb-4 mt-12 font-serif text-xl font-bold leading-[1.4] tracking-[0.02em] text-ink before:mr-2 before:font-display before:font-semibold before:text-gold before:content-['§'] md:text-2xl"
          {...ENTER}
        >
          {children}
        </motion.h3>
      ),
      h4: (props) => (
        <h4
          className="mb-3 mt-8 font-sans text-[17px] font-bold leading-[1.5] tracking-[0.01em] text-ink md:text-[19px]"
          {...stripNode(props)}
        />
      ),
      p: ({ children }) => {
        if (isImageOnlyParagraph(children)) {
          return <>{children}</>;
        }
        return (
          <motion.p className="my-6 leading-[1.85] text-ink" {...ENTER}>
            {children}
          </motion.p>
        );
      },
      img: ({ src, alt }) => <ArticleImage src={src} alt={alt} />,
      pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
      code: (props) => {
        // 代码块内部由 CodeBlock 接管，这里只处理行内代码
        const { className, children } = props;
        if (className && className.includes('language-')) {
          return <code {...stripNode(props)} />;
        }
        return (
          <code
            className="rounded bg-paper-dark px-1.5 py-0.5 font-mono text-[13px] text-vermilion"
            {...stripNode(props)}
          >
            {children}
          </code>
        );
      },
      blockquote: ({ children }) => {
        const kind = detectCallout(children);
        if (kind) {
          const isTip = kind === 'tip';
          const Icon = isTip ? Lightbulb : AlertTriangle;
          return (
            <motion.div
              className={cn(
                'my-8 flex gap-3 rounded-l-sm rounded-r-lg border-l-4 px-6 py-5',
                isTip
                  ? 'border-gold bg-gold/10 text-[#7A6221]'
                  : 'border-vermilion bg-vermilion/10 text-[#8E3B28]',
              )}
              {...ENTER}
            >
              <Icon className="mt-1 h-4 w-4 shrink-0" aria-hidden />
              <div className="min-w-0 flex-1 leading-[1.8] [&_p]:my-0">{children}</div>
            </motion.div>
          );
        }
        return (
          <motion.blockquote
            className="my-8 rounded-r-lg border-l-4 border-teal bg-teal-mist px-6 py-5 text-teal-deep [&_p]:my-2"
            {...ENTER}
          >
            {children}
          </motion.blockquote>
        );
      },
      ul: (props) => (
        <ul
          className="my-6 list-disc space-y-2 pl-6 [&_li]:marker:text-[var(--mk)] [&_ol]:my-2 [&_ul]:my-2"
          {...stripNode(props)}
        />
      ),
      ol: (props) => (
        <ol
          className="my-6 list-decimal space-y-2 pl-6 [&_li]:marker:font-display [&_li]:marker:font-semibold [&_li]:marker:text-[var(--mk)] [&_ol]:my-2 [&_ul]:my-2"
          {...stripNode(props)}
        />
      ),
      li: (props) => <li className="leading-[1.8] [&>p]:my-1" {...stripNode(props)} />,
      hr: (props) => (
        <hr
          className="my-12 border-0 border-t-2 border-dashed border-gold opacity-50"
          {...stripNode(props)}
        />
      ),
      a: (props) => {
        const { href, children } = props;
        const external = !!href && /^https?:\/\//.test(href);
        return (
          <a
            className="text-teal underline underline-offset-4 transition-colors duration-200 hover:text-vermilion"
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...stripNode(props)}
          >
            {children}
            {external && (
              <ExternalLink className="mb-0.5 ml-0.5 inline h-3 w-3" aria-hidden />
            )}
          </a>
        );
      },
      table: (props) => (
        <motion.div
          className="my-8 overflow-x-auto rounded-lg border border-line bg-white shadow-card"
          {...ENTER}
        >
          <table
            className="w-full border-collapse text-sm [&_tbody>tr:nth-child(odd)]:bg-paper-deep"
            {...stripNode(props)}
          />
        </motion.div>
      ),
      thead: (props) => <thead className="bg-teal-mist" {...stripNode(props)} />,
      th: (props) => (
        <th
          className="border-b border-line px-4 py-3 text-left font-sans font-bold text-teal-deep"
          {...stripNode(props)}
        />
      ),
      td: (props) => <td className="px-4 py-3 align-top [&>p]:my-0" {...stripNode(props)} />,
      strong: (props) => <strong className="font-bold text-ink" {...stripNode(props)} />,
    };
  }, [catColor]);

  // 支持 ==金色高亮== 重点标记语法（转为 <mark>，由 rehype-raw 渲染）
  const processed = useMemo(
    () => content.replace(/==([^=\n]+)==/g, '<mark>$1</mark>'),
    [content],
  );

  return (
    <div
      ref={containerRef}
      className="relative mt-4 text-[15px] text-ink [counter-reset:h2sec] md:text-base"
      style={{ ['--mk' as string]: catColor } as CSSProperties}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
