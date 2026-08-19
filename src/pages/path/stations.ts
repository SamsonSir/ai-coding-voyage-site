/**
 * 学习路线页文案数据（design/path.md S3）
 * 每站：定位语（为什么学这一站）+「你将学会」要点清单。
 */
import type { CategoryId } from '@/data/categories';

export interface StationCopy {
  /** 定位语：为什么学这一站（1–2 句） */
  why: string;
  /** 「你将学会」要点（3–4 条） */
  learn: string[];
}

export const STATION_COPY: Record<CategoryId, StationCopy> = {
  renzhi: {
    why: '出海之前，先看懂海图。这一站建立商业认知：什么样的产品值得做、如何验证需求、AI 编程的完整流程长什么样。',
    learn: ['看懂海外软件产品的变现逻辑', '建立 MVP 与需求验证思维', '了解 AI 编程的整体流程'],
  },
  jichu: {
    why: '把认知落地为行动。跟着主线课程一步步动手，用 AI 对话式编程做出你的第一个可运行产品，并部署上线。',
    learn: ['完成第一个可运行的产品', '掌握 AI 对话式编程的基本操作', '学会部署上线'],
  },
  neigong: {
    why: '船要行得远，船体必须稳。这一站补齐技术内功，让你读懂 AI 生成的代码、看懂报错、写得出精准的提示词。',
    learn: ['理解前端 / 后端 / 数据库基础概念', '读懂 AI 生成的代码', '掌握提示词工程'],
  },
  jinjie: {
    why: '驶入深海，完成变现闭环。登录、支付、Claude Code 工作流——把产品从作品变成真正的生意。',
    learn: ['实现用户登录系统', '接入支付完成变现闭环', '掌握 Claude Code 工作流'],
  },
  zuixin: {
    why: '新大陆在不断延伸。2026 年的新工具、新打法与学员实战案例持续更新，学无止境，常回来看看。',
    learn: ['快速入门热身', '跟进 2026 最新工具与打法', '借鉴学员实战案例'],
  },
};

/** 站点序号中文名（与 CATEGORIES 顺序一致） */
export const STATION_NAMES = ['第一站', '第二站', '第三站', '第四站', '第五站'] as const;

/** 页头快捷锚点（S1） */
export const PATH_ANCHORS = [
  { id: 'station-1', label: '第一站' },
  { id: 'station-2', label: '第二站' },
  { id: 'station-3', label: '第三站' },
  { id: 'station-4', label: '第四站' },
  { id: 'station-5', label: '第五站' },
  { id: 'knowledge-map', label: '架构图' },
] as const;
