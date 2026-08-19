/**
 * 共享布局 —— Children 模式（Layout 包裹 <Routes>，渲染 {children}）。
 * Navbar 为 fixed 覆盖式导航，这里统一给内容槽补偿 72px 顶部内边距；
 * 全屏 Hero 等出血区块在页面内部用 -mt-[72px] 自行抵消。
 */
import type { ReactNode } from 'react';
import Navbar, { NAV_HEIGHT } from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-paper">
      <Navbar />
      <main className="flex-1" style={{ paddingTop: NAV_HEIGHT }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
