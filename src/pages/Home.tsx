/**
 * 首页 `/`（design/home.md）
 * Hero → 数据总览条 → 学习路径航线图（GSAP 滚动叙事）→ 五大板块卡片 → 新内容速览 → CTA
 */
import HeroSection from '@/pages/home/HeroSection';
import StatsBar from '@/pages/home/StatsBar';
import VoyageMap from '@/pages/home/VoyageMap';
import CategoryCards from '@/pages/home/CategoryCards';
import LatestSection from '@/pages/home/LatestSection';
import CtaSection from '@/pages/home/CtaSection';
import WaveDivider from '@/pages/home/WaveDivider';

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      {/* 浅色 → 深色 波浪衔接 */}
      <div className="bg-paper">
        <WaveDivider fill="var(--teal-deep)" />
      </div>
      <VoyageMap />
      {/* 深色 → 浅色 波浪衔接 */}
      <div className="bg-paper">
        <WaveDivider fill="var(--teal-deep)" flip />
      </div>
      <CategoryCards />
      <LatestSection />
      <CtaSection />
    </>
  );
}
