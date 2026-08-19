/**
 * 学习路线页 `/path`（design/path.md）
 * S1 页头锚点 → S2 互动航海图（横滑卷轴 + 5 岛手风琴）→ S3 五站详细说明
 * → S4 知识架构图 → S5 行动 CTA
 */
import PathHeader from '@/pages/path/PathHeader';
import SeaChart from '@/pages/path/SeaChart';
import StationSections from '@/pages/path/StationSections';
import KnowledgeMap from '@/pages/path/KnowledgeMap';
import PathCta from '@/pages/path/PathCta';

export default function Path() {
  return (
    <>
      <PathHeader />
      <SeaChart />
      <StationSections />
      <KnowledgeMap />
      <PathCta />
    </>
  );
}
