import type { Project } from '../types/project';

const img = (seed: string, w = 1600, h = 1000) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const projects: Project[] = [
  {
    id: 'quiet-forest',
    title: 'Quiet Forest',
    subtitle: '独立出版刊物视觉系统',
    year: '2025',
    client: 'Quiet Forest Press',
    category: 'Editorial',
    cover: img('junxi-forest-1'),
    gallery: [
      img('junxi-forest-2', 1600, 1000),
      img('junxi-forest-3', 1200, 1600),
      img('junxi-forest-4', 1600, 1000),
      img('junxi-forest-5', 1400, 1000),
    ],
    description:
      '为独立出版刊物 Quiet Forest 设计的完整视觉系统,从封面装帧到内页版式、字体、插图与数字衍生物料。',
    body: [
      '这是一个关于「慢阅读」的独立出版物,每一期围绕一种自然声音展开。整体设计克制,以留白与衬线字体为骨架,封面以极简的插画 + 烫印工艺呈现。',
      '字体选择 Playfair Display 与 Noto Serif SC 的组合,在保留设计感的同时,兼顾中文段落的可读性。',
      '项目覆盖:封面设计、内页网格系统、插画与图形语言、数字版本网页、书店陈列物料。',
    ],
    tags: ['Editorial', 'Typography', 'Print'],
  },
  {
    id: 'noema-brand',
    title: 'Noema',
    subtitle: '概念香氛品牌视觉与包装',
    year: '2024',
    client: 'Noema Parfum',
    category: 'Brand',
    cover: img('junxi-noema-1'),
    gallery: [
      img('junxi-noema-2', 1600, 1000),
      img('junxi-noema-3', 1200, 1600),
      img('junxi-noema-4', 1600, 1000),
    ],
    description:
      'Noema 是一支以「记忆碎片」为概念的小众香氛品牌,品牌标识以拆字游戏的方式呈现「不可言说之意」。',
    body: [
      '品牌的核心概念来自希腊语 noema —— 被思考之物。视觉系统以极简几何为骨架,在瓶身、包装纸、贴纸等物料上反复出现一组断裂的字形。',
      '色彩系统以象牙白、赭石、墨绿三个主色构成,避免跳脱的饱和色,以保持气味的余韵。',
    ],
    tags: ['Brand', 'Packaging', 'Art Direction'],
  },
  {
    id: 'atlas-web',
    title: 'Atlas Studio',
    subtitle: '建筑事务所官方网站',
    year: '2024',
    client: 'Atlas Architects',
    category: 'Web',
    cover: img('junxi-atlas-1'),
    gallery: [
      img('junxi-atlas-2', 1600, 1000),
      img('junxi-atlas-3', 1600, 1000),
      img('junxi-atlas-4', 1600, 1000),
    ],
    description:
      '一家关注公共空间的建筑工作室官网,以时间线式的项目叙事替代传统列表展示。',
    body: [
      '在结构上,我们把每个项目当作一条时间轴,参观者可以在滚动中看到图纸、施工、现场、完工四个阶段。',
      '前端使用 React + Tailwind,以极低复杂度实现复杂的滚动叙事。',
    ],
    tags: ['Web', 'Frontend', 'Design Engineering'],
  },
  {
    id: 'echo-illustration',
    title: 'Echoes',
    subtitle: '系列插画与海报',
    year: '2023',
    client: 'Self initiated',
    category: 'Illustration',
    cover: img('junxi-echo-1'),
    gallery: [
      img('junxi-echo-2', 1200, 1600),
      img('junxi-echo-3', 1200, 1600),
      img('junxi-echo-4', 1600, 1000),
    ],
    description: '一组关于「回声」的概念插画,探索图形在重复与错位中形成的情绪性节奏。',
    body: [
      '每一幅画都从一个简单几何开始,在重复过程中加入微小扰动,最终形成一种近似声音波形的视觉。',
    ],
    tags: ['Illustration', 'Poster'],
  },
  {
    id: 'soft-room',
    title: 'Soft Room',
    subtitle: '展览空间视觉与导视系统',
    year: '2023',
    client: 'Soft Room Gallery',
    category: 'Exhibition',
    cover: img('junxi-soft-1'),
    gallery: [
      img('junxi-soft-2', 1600, 1000),
      img('junxi-soft-3', 1600, 1000),
    ],
    description: '为一场年轻艺术家群展设计的空间视觉与导视系统,以「柔软的房间」为概念。',
    body: [
      '导视以布料的褶皱图形语言贯穿,配合可变字体在不同尺寸物料上的弹性应用。',
    ],
    tags: ['Exhibition', 'Signage'],
  },
  {
    id: 'nocturne',
    title: 'Nocturne',
    subtitle: '音乐演出海报系列',
    year: '2022',
    client: 'Nocturne Live',
    category: 'Editorial',
    cover: img('junxi-nocturne-1'),
    gallery: [
      img('junxi-nocturne-2', 1200, 1600),
      img('junxi-nocturne-3', 1600, 1000),
    ],
    description: '为一场每月一次的夜间音乐演出设计的持续视觉系列,每期海报以不同字形呼应不同风格的演出。',
    body: [
      '每一期使用不同的展示字体,但保持同一套版式骨架,在印刷物料上形成可被辨认的系列性。',
    ],
    tags: ['Poster', 'Music', 'Series'],
  },
];

export const findProject = (id: string) => projects.find((p) => p.id === id);
