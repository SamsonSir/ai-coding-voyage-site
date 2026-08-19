/**
 * 全站页脚（design.md 6.2）
 * teal-deep 深色底，顶部金色虚线航线点缀，4 栏内容，学习数据与 localStorage 联动。
 */
import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/data/categories';
import { manifest } from '@/data/articles';
import { useProgress } from '@/contexts/ProgressContext';
import { publicUrl } from '@/lib/utils';

const QUICK_LINKS = [
  { to: '/catalog', label: '目录' },
  { to: '/path', label: '学习路线' },
  { to: '/search', label: '搜索' },
  { to: '/catalog?cat=zuixin', label: '最新更新' },
];

export default function Footer() {
  const { readCount, overallProgress } = useProgress();

  return (
    <footer className="relative bg-teal-deep text-[#EFE7D8]">
      {/* 顶部金色虚线航线 + 罗盘点缀 */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-6 overflow-hidden" aria-hidden>
        <span className="h-px flex-1 border-t border-dashed border-gold/50" />
        <img src={publicUrl('/logo-compass.svg')} alt="" className="h-6 w-6 opacity-70" />
        <span className="h-px w-16 border-t border-dashed border-gold/50" />
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold/70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="5" r="2" />
          <line x1="12" y1="7" x2="12" y2="21" />
          <line x1="7" y1="11" x2="17" y2="11" />
          <path d="M4 15 Q4 21 12 20 Q20 21 20 15" />
        </svg>
        <span className="h-px flex-1 border-t border-dashed border-gold/50" />
      </div>

      <div className="mx-auto max-w-wide px-5 pb-8 pt-16 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* 品牌栏 */}
          <div>
            <div className="flex items-center gap-3">
              <img src={publicUrl('/logo-compass.svg')} alt="罗盘 Logo" className="h-10 w-10" />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold">AI 编程航海学院</span>
                <span className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
                  AI Coding Voyage
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#EFE7D8]/75">
              从零基础到出海变现，一张地图走完全程。
            </p>
          </div>

          {/* 五大板块 */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-[#EFE7D8]/60">
              五大篇章
            </h4>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/catalog?cat=${cat.id}`}
                    className="group flex items-center gap-2 text-sm text-[#EFE7D8]/85 transition-colors hover:text-white"
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                    <span className="font-display text-xs tracking-[0.2em] text-[#EFE7D8]/45">
                      {cat.en}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 快捷入口 */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-[#EFE7D8]/60">
              快捷入口
            </h4>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#EFE7D8]/85 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 学习数据 */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-[#EFE7D8]/60">
              学习数据
            </h4>
            <p className="mt-4 font-display text-3xl font-semibold text-gold">
              {overallProgress}%
            </p>
            <p className="mt-1 text-sm text-[#EFE7D8]/75">
              已读 {readCount}/{manifest.totalArticles} 篇 · 总进度 {overallProgress}%
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[#EFE7D8]/50">
              进度保存在本机浏览器中，换设备不会同步。
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-[#EFE7D8]/15 pt-6 text-center text-xs text-[#EFE7D8]/55">
          © 2026 AI 编程航海学院 · 用 AI 建造你的产品航线
        </div>
      </div>
    </footer>
  );
}
