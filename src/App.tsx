import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { AnnotationsProvider } from '@/contexts/AnnotationsContext';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import Article from '@/pages/Article';
import Path from '@/pages/Path';
import Search from '@/pages/Search';
import NotFound from '@/pages/NotFound';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const { pathname } = useLocation();

  // Lenis 全站平滑滚动（lerp 0.1），与 GSAP ScrollTrigger 同步
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // 路由切换回顶部
  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <ProgressProvider>
      <AnnotationsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            {/* manifest 中 slug 为复合形式 `{category}/{file}` */}
            <Route path="/article/:category/:slug" element={<Article />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/path" element={<Path />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster position="top-center" richColors />
      </AnnotationsProvider>
    </ProgressProvider>
  );
}
