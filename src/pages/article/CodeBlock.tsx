/**
 * 代码块（article.md S2）：深色底 + 顶部代码栏（语言标签 + 复制按钮）。
 * 复制后按钮变对勾 + 「已复制」，1.5s 后还原。暖色语法高亮。
 */
import { isValidElement, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { flattenText } from './utils';

/** 暖色航海风语法高亮主题（design.md：关键字/字符串/注释/函数配色） */
const voyageCodeTheme: Record<string, CSSProperties> = {
  'code[class*="language-"]': {
    color: '#EFE7D8',
    background: 'none',
    fontFamily: 'inherit',
    textShadow: 'none',
    whiteSpace: 'pre',
  },
  'pre[class*="language-"]': {
    color: '#EFE7D8',
    background: 'none',
    fontFamily: 'inherit',
    textShadow: 'none',
  },
  comment: { color: '#8A8172', fontStyle: 'italic' },
  prolog: { color: '#8A8172' },
  doctype: { color: '#8A8172' },
  cdata: { color: '#8A8172' },
  keyword: { color: '#E8A58F' },
  tag: { color: '#E8A58F' },
  important: { color: '#E8A58F' },
  string: { color: '#C9A24B' },
  char: { color: '#C9A24B' },
  regex: { color: '#C9A24B' },
  'attr-value': { color: '#C9A24B' },
  number: { color: '#C9A24B' },
  boolean: { color: '#C9A24B' },
  function: { color: '#9BC4BE' },
  'class-name': { color: '#9BC4BE' },
  'attr-name': { color: '#9BC4BE' },
  selector: { color: '#9BC4BE' },
  property: { color: '#9BC4BE' },
  operator: { color: '#B0A894', background: 'none' },
  punctuation: { color: '#B0A894' },
  variable: { color: '#EFE7D8' },
  constant: { color: '#E8A58F' },
  builtin: { color: '#9BC4BE' },
};

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

export default function CodeBlock({ children }: { children?: ReactNode }) {
  // react-markdown 会把 <pre> 的唯一子元素渲染为 <code className="language-x">
  const codeEl = Array.isArray(children) ? children[0] : children;
  const codeProps = isValidElement(codeEl)
    ? (codeEl.props as { className?: string; children?: ReactNode })
    : {};
  const lang = /language-([\w-]+)/.exec(codeProps.className ?? '')?.[1] ?? 'text';
  const text = flattenText(codeProps.children ?? children).replace(/\n$/, '');

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      className="my-8 overflow-hidden rounded-lg bg-code-bg shadow-card"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 代码栏 */}
      <div className="flex items-center justify-between bg-[#3A342B] px-4 py-2">
        <span className="font-mono text-xs tracking-wide text-gold">{lang}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#B0A894] transition-colors duration-200 hover:bg-white/5 hover:text-[#EFE7D8]"
          aria-label={copied ? '已复制' : '复制代码'}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#9BC4BE]" />
              已复制
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              复制
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={lang}
          style={voyageCodeTheme}
          customStyle={{
            margin: 0,
            padding: '20px',
            background: 'transparent',
            fontSize: '14px',
            lineHeight: 1.7,
            fontFamily: '"JetBrains Mono", Menlo, monospace',
          }}
          codeTagProps={{
            style: { fontFamily: '"JetBrains Mono", Menlo, monospace' },
          }}
        >
          {text}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  );
}
