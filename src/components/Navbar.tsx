/**
 * 全站导航（design.md 6.1）
 * 覆盖式导航（overlay nav）：fixed top-0 z-50，初始透明叠在 Hero 上，
 * 滚动超过 80px 变为毛玻璃纸色。Layout 内容槽统一补偿 72px 顶部内边距。
 */
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ProgressRing from '@/components/ProgressRing';
import { useProgress } from '@/contexts/ProgressContext';
import { ARTICLE_MAP } from '@/data/articles';
import { publicUrl } from '@/lib/utils';

export const NAV_HEIGHT = 72;

const NAV_LINKS = [
  { to: '/', label: '首页' },
  { to: '/catalog', label: '目录' },
  { to: '/path', label: '学习路线' },
  { to: '/search', label: '搜索' },
];

function isActivePath(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/';
  return pathname.startsWith(to);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { overallProgress, lastRead } = useProgress();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 抽屉内的导航点击时关闭抽屉（见下方 NavLink onClick）

  const continueTarget = lastRead ? `/article/${lastRead.slug}` : '/catalog';
  const continueTitle = lastRead ? ARTICLE_MAP[lastRead.slug]?.title : undefined;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          height: NAV_HEIGHT,
          backgroundColor: scrolled ? 'rgba(247,242,233,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        }}
      >
        <div className="mx-auto flex h-full max-w-wide items-center justify-between px-5 md:px-8 lg:px-12">
          {/* 左：站点标志 */}
          <Link to="/" className="group flex items-center gap-3" aria-label="返回首页">
            <img
              src={publicUrl('/logo-compass.svg')}
              alt="罗盘 Logo"
              className="h-9 w-9 transition-transform duration-500 group-hover:rotate-45"
            />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold text-ink">AI 编程航海学院</span>
              <span className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-ink-faint">
                AI Coding Voyage
              </span>
            </span>
          </Link>

          {/* 中：导航链接（桌面） */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="主导航">
            {NAV_LINKS.map((link) => {
              const active = isActivePath(location.pathname, link.to);
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
                    active ? 'text-ink' : 'text-ink-soft hover:text-teal'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-vermilion"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* 右：进度环 + 继续学习 */}
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/catalog"
              title={`总进度 ${overallProgress}%`}
              className="transition-transform duration-200 hover:scale-105"
            >
              <ProgressRing percent={overallProgress} size={28} strokeWidth={3} />
            </Link>
            <button
              type="button"
              onClick={() => navigate(continueTarget)}
              title={continueTitle ? `继续学习《${continueTitle}》` : '开始你的第一篇文章'}
              className="rounded-full bg-vermilion px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-vermilion-soft active:scale-[0.98]"
            >
              {lastRead ? '继续学习' : '开始学习'}
            </button>
          </div>

          {/* 移动端汉堡 */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-paper-deep lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="打开菜单"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* 移动端全屏抽屉（右侧滑入 0.35s） */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="absolute inset-0 bg-ink/30"
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <motion.aside
              className="absolute right-0 top-0 flex h-full w-[78%] max-w-sm flex-col bg-paper px-8 pb-10 pt-5 shadow-lift"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <img src={publicUrl('/logo-compass.svg')} alt="" className="h-9 w-9" />
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-paper-deep"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="关闭菜单"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-2" aria-label="移动端导航">
                {NAV_LINKS.map((link, i) => {
                  const active = isActivePath(location.pathname, link.to);
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, duration: 0.35 }}
                    >
                      <NavLink
                        to={link.to}
                        onClick={() => setDrawerOpen(false)}
                        className={`block border-b border-line py-4 font-serif text-2xl font-bold transition-colors ${
                          active ? 'text-vermilion' : 'text-ink hover:text-teal'
                        }`}
                      >
                        {link.label}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </nav>
              <motion.div
                className="mt-auto flex items-center gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.35 }}
              >
                <ProgressRing percent={overallProgress} size={44} strokeWidth={4} />
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate(continueTarget);
                  }}
                  className="flex-1 rounded-full bg-vermilion px-4 py-3 text-sm font-medium text-white"
                >
                  {lastRead ? '继续学习' : '开始学习'}
                </button>
              </motion.div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
