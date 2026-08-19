/**
 * 五大板块元信息（design.md 第 7 节）
 * 固定推荐顺序：认知篇 → 基础篇 → 内功篇 → 进阶篇 → 最新更新
 */

export type CategoryId = 'renzhi' | 'jichu' | 'neigong' | 'jinjie' | 'zuixin';

export interface CategoryMeta {
  /** 目录名 / 路由参数 / content 目录名 */
  id: CategoryId;
  /** 中文名 */
  name: string;
  /** 英文代号（Cormorant Garamond 展示） */
  en: string;
  /** 板块专属色 */
  color: string;
  /** 板块专属色（CSS 变量形式） */
  colorVar: string;
  /** 线性图标文件名（位于 /public 根目录） */
  icon: string;
  /** 一句话简介 */
  tagline: string;
  /** 航线节点上的「收获」描述 */
  gain: string;
  /** 推荐学习顺序（1 起） */
  order: number;
  /** 篇数 */
  count: number;
  /** 序号展示（01–05） */
  index: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'renzhi',
    name: '认知篇',
    en: 'THE LIGHTHOUSE',
    color: '#5B7B8C',
    colorVar: 'var(--cat-renzhi)',
    icon: '/icon-renzhi.svg',
    tagline: '商业认知打地基，先看懂海图再出海',
    gain: '先看懂海图：建立商业认知与变现思路',
    order: 1,
    count: 12,
    index: '01',
  },
  {
    id: 'jichu',
    name: '基础篇',
    en: 'THE FIRST SAIL',
    color: '#2F6B66',
    colorVar: 'var(--cat-jichu)',
    icon: '/icon-jichu.svg',
    tagline: '动手实操主线，做出你的第一个产品',
    gain: '第一次扬帆：动手做出第一个产品',
    order: 2,
    count: 13,
    index: '02',
  },
  {
    id: 'neigong',
    name: '内功篇',
    en: 'INNER CRAFT',
    color: '#6B7A4E',
    colorVar: 'var(--cat-neigong)',
    icon: '/icon-neigong.svg',
    tagline: '修炼技术内功，让船更稳更快',
    gain: '修炼内功：技术基础让船更稳',
    order: 3,
    count: 14,
    index: '03',
  },
  {
    id: 'jinjie',
    name: '进阶篇',
    en: 'DEEP WATERS',
    color: '#A8793E',
    colorVar: 'var(--cat-jinjie)',
    icon: '/icon-jinjie.svg',
    tagline: '登录 / 支付 / Claude Code 工作流实战',
    gain: '深海实战：登录、支付与 Claude Code 工作流',
    order: 4,
    count: 7,
    index: '04',
  },
  {
    id: 'zuixin',
    name: '最新更新',
    en: 'NEW HORIZONS',
    color: '#C4553B',
    colorVar: 'var(--cat-zuixin)',
    icon: '/icon-zuixin.svg',
    tagline: '2026 新资料，持续更新的新大陆',
    gain: '新大陆：2026 持续更新的新内容',
    order: 5,
    count: 20,
    index: '05',
  },
];

export const CATEGORY_MAP: Record<CategoryId, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryMeta>;

/** 最新更新板块的子分类（design.md 第 7 节） */
export const ZUIXIN_SUBCATS = [
  '快速入门',
  '海外AI产品',
  '商业化',
  '学员分享',
  '项目实战',
] as const;

export type ZuixinSubcat = (typeof ZUIXIN_SUBCATS)[number];

/** 全站正文总篇数（design.md：共 66 篇正文；板块 count 含前言/补充等，故不直接求和） */
export const TOTAL_ARTICLES = 66;

/** 推荐学习路径说明 */
export const RECOMMENDED_PATH_NOTE =
  '零基础？可以从「最新更新 > 快速入门」两篇热身，再回到第一站。';
