---
title: 哄哄模拟器 · 项目规格说明书
category: zuixin
subcat: 项目实战
order: 9
date: 
summary: 情侣互动 AI 游戏的项目规格说明书
---

# 哄哄模拟器 - 项目规格说明书

---

## 1. 项目概述

### 1.1 产品定位

情侣互动游戏：AI 扮演生气的对象，用户通过选择题的方式在 10 轮内把对方哄好。

### 1.2 核心特性

- **动态对话生成**: 每轮对话和选项都由 LLM 实时生成，无预设题库

- **情绪化语音**: 使用 TTS 自动生成语音，体现情绪变化

- **趣味减分选项**: 包含搞笑、离谱的选项，增强分享欲

- **好感度系统**: 隐藏数值，通过进度条展示

### 1.3 游戏流程

```

开始界面 → 选择性别/场景/语音 → 游戏主界面 → 10轮互动 → 结束界面

```

---

## 2. 技术栈

### 2.1 核心框架

- **框架**: Next.js 16 (App Router)

- **语言**: TypeScript 5

- **运行时**: Node.js 24

### 2.2 前端技术

- **UI 框架**: React 19

- **样式**: Tailwind CSS 4

- **组件库**: shadcn/ui (Radix UI)

- **图标**: Lucide React

### 2.3 AI 集成

- **LLM**: coze-coding-dev-sdk (对话生成)

- **TTS**: coze-coding-dev-sdk (语音合成)

### 2.4 状态管理

- **方案**: React Context API

- **全局状态**: GameContext

### 2.5 开发工具

- **包管理器**: pnpm (强制要求)

- **初始化工具**: Coze CLI

- **代码规范**: Airbnb Style Guide

---

## 3. 功能需求

### 3.1 开始界面

#### 功能要求

- 选择对方性别（女/男）

- 选择预设场景（5个）

- 选择语音类型（根据性别动态显示）

#### 预设场景列表

\| ID \| 标题 \| 描述 \|

\|---\|---\|---\|

\| anniversary \| 忘记纪念日 \| 今天是你们在一起三周年，你完全忘了... \|

\| late-night \| 深夜不回消息 \| 你昨晚打游戏到凌晨三点，对方发了十几条消息你都没回... \|

\| flirty-chat \| 被发现和异性聊天 \| 对方看到你和异性朋友的暧昧聊天记录... \|

\| lost-cat \| 把对方的猫弄丢了 \| 你帮对方照顾猫的时候，猫跑丢了... \|

\| public-joke \| 当众让对方没面子 \| 你在朋友聚会上开了一个过分的玩笑... \|

#### 语音配置

\| VoiceType \| Speaker \| Label \| 适用性别 \|

\|-----------\|---------\|-------\|---------\|

\| gentle-female \| zh_female_xiaohe_uranus_bigtts \| 温柔女声 \| 女 \|

\| cool-female \| zh_female_vv_uranus_bigtts \| 霸道御姐 \| 女 \|

\| cute-female \| saturn_zh_female_keainvsheng_tob \| 可爱软妹 \| 女 \|

\| deep-male \| zh_male_m191_uranus_bigtts \| 低沉男声 \| 男 \|

\| gentle-male \| zh_male_taocheng_uranus_bigtts \| 温柔男声 \| 男 \|

### 3.2 游戏主界面

#### 功能要求

- 对话气泡显示（对方左侧，用户右侧）

- 好感度进度条（顶部）

- 当前轮次显示（第 X 轮 / 共 10 轮）

- 6个选项按钮（支持换行）

- 语音播放按钮（仅对方消息）

- 加载动画（生成时显示）

- 错误提示和重试功能

#### 好感度规则

- **初始值**: 20

- **范围**: -50 \~ 100

- **胜利条件**: 10轮内好感度 >= 80

- **失败条件**: 好感度 \< -50 或 10轮用完好感度 \< 80

- **展示**: 隐藏具体数值，只显示进度条

#### 选项生成规则

每轮生成 6 个选项：

- **加分选项**: 2个（+5 到 +20）

- 真诚道歉

- 具体弥补方案

- 提起共同回忆

- **减分选项**: 4个（-5 到 -30）

- 普通减分（1-2个）：敷衍、转移话题、找借口

- 奇葩搞笑选项（2-3个）：离谱到好笑

**要求**:

- 选项顺序随机打乱

- 支持换行显示

- **不提示用户选项的好坏**

#### 对话生成规则

- 与前面的对话连贯，模拟连续对话

- 不出现重复的题目和选项

- 情绪根据好感度变化：

\| 好感度范围 \| 情绪表现 \|

\|-----------\|---------\|

\| -50 \~ 0 \| 非常生气，冷暴力或激烈质问 \|

\| 0 \~ 30 \| 还在生气，但愿意听你说 \|

\| 30 \~ 60 \| 开始软化，嘴上生气但语气缓和 \|

\| 60 \~ 80 \| 快被哄好了，可能撒娇或小声说"哼" \|

\| 80+ \| 原谅了，但还要你保证不再犯 \|

### 3.3 结束界面

#### 成功

- 撒花动画

- 甜蜜的结束对话

- 语音播放

- "通关！分享给朋友试试？"

- 重玩按钮

#### 失败

- 心碎动画

- 绝情的结束对话

- 语音播放

- "再试一次？"

- 重玩按钮

---

## 4. 数据结构设计

### 4.1 类型定义 (`src/types/game.ts`)

```typescript

// 性别

export type Gender = 'female' \| 'male';

// 语音类型

export type VoiceType = 'gentle-female' \| 'cool-female' \| 'cute-female' \| 'deep-male' \| 'gentle-male';

// 场景

export interface Scenario {

id: string;

title: string;

description: string;

}

// 消息

export interface Message {

role: 'user' \| 'partner';

content: string;

}

// 选项

export interface Option {

id: string;

content: string;

score: number; // 好感度变化值

}

// 游戏状态

export interface GameState {

step: number; // 当前轮次 (1-10)

affection: number; // 好感度 (-50 到 100)

gender: Gender \| null; // 对方性别

scenario: Scenario \| null; // 当前场景

voiceType: VoiceType \| null; // 语音类型

messages: Message\[\]; // 对话历史

currentOptions: Option\[\]; // 当前选项

gameOver: boolean; // 游戏是否结束

won: boolean; // 是否获胜

}

// 常量

export const INITIAL_AFFECTION = 20;

export const MAX_AFFECTION = 100;

export const MIN_AFFECTION = -50;

export const WIN_AFFECTION = 80;

export const MAX_ROUNDS = 10;

```

### 4.2 Context 结构 (`src/context/GameContext.tsx`)

```typescript

interface GameContextType {

gameState: GameState;

setGender: (gender: Gender) => void;

setScenario: (scenario: Scenario) => void;

setVoiceType: (voiceType: VoiceType) => void;

startGame: () => void;

selectOption: (option: Option) => void;

resetGame: () => void;

addPartnerMessage: (content: string, options: Option\[\]) => void;

}

```

---

## 5. API 接口设计

### 5.1 对话生成接口

**路径**: `POST /api/chat`

**请求体**:

```typescript

{

gender: Gender; // 对方性别

scenario: string; // 场景标题

messages: Message\[\]; // 对话历史（包含所有消息）

affection: number; // 当前好感度

step: number; // 当前轮次

isGameOver: boolean; // 是否游戏结束

won: boolean; // 是否获胜

}

```

**响应体**:

```typescript

{

partnerMessage: string; // 对方的回复

options: Option\[\]; // 6个选项

}

```

**⚠️ 关键实现要点**:

1\. **对话历史必须包含所有消息**:

```typescript

// ✅ 正确：包含所有消息

const chatHistory = messages.map(msg => ({

role: msg.role === 'partner' ? 'assistant' : 'user',

content: msg.content,

}));

// ❌ 错误：过滤掉 user 消息，会导致对话重复

const chatHistory = messages

.filter(m => m.role === 'partner')

.map(m => ({ role: 'assistant', content: m.content }));

```

2\. **Prompt 设计**:

- 要求 LLM 根据好感度调整情绪

- 确保每轮生成 6 个选项

- 要求选项中有搞笑内容

- 要求对话连贯不重复

3\. **错误处理**:

- 超时时间：30秒

- 失败降级：返回预设的默认对话和选项

### 5.2 语音合成接口

**路径**: `POST /api/tts`

**请求体**:

```typescript

{

text: string; // 要朗读的文本

speaker: string; // 语音ID

uid: string; // 用户ID（用于去重）

}

```

**响应体**:

```typescript

{

audioUri: string; // 音频文件URL

audioSize: number; // 音频大小

}

```

**⚠️ 关键实现要点**:

1\. **文本清理**（必须）:

- 去掉括号里的动作描述和情绪提示

- 支持 `()` `（）` `\[\]` 等括号

```typescript

const cleanTextForSpeech = (text: string): string => {

return text

.replace(/（\[^）\]*）/g, '') // 去掉中文括号

.replace(/\\(\[^)\]*\\)/g, '') // 去掉英文括号

.replace(/\\\[\[^\\\]\]*\\\]/g, '') // 去掉中括号

.replace(/\[「」『』\]/g, '') // 去掉其他标点

.trim();

};

```

2\. **超时处理**:

- 超时时间：15秒

- 失败不影响游戏继续

---

## 6. UI/UX 设计规范

### 6.1 布局设计

#### 开始界面

- 居中卡片布局

- 表单分组（性别、场景、语音）

- 渐变背景（粉紫色系）

#### 游戏主界面

- 顶部：好感度进度条 + 轮次显示

- 中间：对话区域（滚动）

- 底部：选项区域（固定）

- 背景渐变：pink-100 → purple-50 → blue-100

#### 结束界面

- 居中布局

- 大图标 + 标题 + 结束对话

- 重玩按钮

### 6.2 对话气泡设计

#### 对方消息（左侧）

- 背景色：白色

- 圆角：rounded-bl-md（左下直角）

- 头像：粉色圆形 + "TA"

#### 用户消息（右侧）

- 背景色：blue-500

- 文字色：白色

- 圆角：rounded-br-md（右下直角）

- 头像：蓝色圆形 + "我"

### 6.3 好感度进度条

- 背景：灰色

- 填充：根据好感度变色

- 0以下：红色

- 0-50：黄色

- 50-80：蓝色

- 80以上：绿色

- **⚠️ 使用原生 div 实现**，不要使用自定义 Progress 组件

```typescript

// ✅ 正确：使用原生 div

\<div className="flex-1 bg-gray-200 rounded-full h-full overflow-hidden">

\<div

className="h-full rounded-full transition-all duration-300"

style={{

width: `${(affection / 100) * 100}%`,

backgroundColor: getColor(),

}}

/>

\</div>

// ❌ 错误：使用 Progress 组件可能导致显示问题

\<Progress value={(affection / 100) * 100} className="flex-1" />

```

### 6.4 加载动画

- 跳动爱心图标

- 动态文字："她正在思考..." / "他正在思考..."

- 位置：对话区域底部

### 6.5 响应式设计

- 手机：单列布局

- 电脑：单列布局（最大宽度 800px）

- 选项按钮：自适应高度，支持换行

---

## 7. 关键实现逻辑

### 7.1 游戏状态管理

#### 初始化流程

```typescript

// 1. 用户选择性别、场景、语音

setGender('female');

setScenario(scenarios\[0\]);

setVoiceType('gentle-female');

// 2. 开始游戏

startGame(); // 生成第一条对话和选项

// 3. 用户选择选项

selectOption(option); // 更新好感度，生成下一轮

```

#### ⚠️ 闭包陷阱修复

**问题**: `startGame` 函数中读取 `gameState.gender` 等值时，可能读取到旧值（闭包陷阱）。

**解决方案**: 使用函数式更新

```typescript

// ❌ 错误：可能读取旧值

const startGame = () => {

const gender = gameState.gender; // 可能为空

const scenario = gameState.scenario; // 可能为空

// ...

};

// ✅ 正确：从最新状态读取

const startGame = () => {

setGameState(prev => {

const gender = prev.gender;

const scenario = prev.scenario;

const voiceType = prev.voiceType;

if (!gender \|\| !scenario \|\| !voiceType) {

console.error('Missing game config');

return prev;

}

return {

...prev,

step: 1,

messages: \[\],

gameOver: false,

won: false,

};

});

};

```

### 7.2 语音生成逻辑

#### ⚠️ 语音更新问题修复

**问题**: 第一轮对话后 `audioUri` 被设置，第二轮对话时 `audioUri` 仍然存在，不会生成新语音。

**解决方案**: 跟踪消息 ID，每轮生成新语音

```typescript

// 1. 为每条消息生成唯一 ID

const messageId = `${lastPartnerMessage.role}-${lastPartnerMessage.content}-${partnerMessageCount}`;

// 2. 检测新消息

if (currentAudioMessageId !== messageId && gameState.voiceType) {

// 清除旧语音

setAudioUri(undefined);

setCurrentAudioMessageId(messageId);

// 生成新语音

const cleanText = cleanTextForSpeech(lastPartnerMessage.content);

// ... 调用 TTS API

}

// 3. 用户选择选项时重置

const handleSelectOption = async (option: Option) => {

setAudioUri(undefined);

setCurrentAudioMessageId(null); // 重置当前语音消息ID

selectOption(option);

};

```

### 7.3 防重复生成

**问题**: 用户快速点击选项可能触发多次 API 请求。

**解决方案**: 使用 `useRef` 跟踪生成状态

```typescript

const isGeneratingRef = useRef(false);

const generateNextRound = async () => {

// 防止重复生成

if (isGeneratingRef.current \|\| isLoading) {

return;

}

isGeneratingRef.current = true;

try {

// ... API 调用

} finally {

isGeneratingRef.current = false;

}

};

```

### 7.4 useEffect 依赖管理

**问题**: `useEffect` 依赖数组不正确导致无限循环或不触发。

**解决方案**: 精确控制依赖

```typescript

// ✅ 对话生成

useEffect(() => {

generateNextRound();

}, \[

gameState.step, // 轮次变化时生成

gameState.currentOptions.length, // 选项为空时生成

gameState.gameOver, // 游戏结束时不生成

lastGeneratedStep, // 避免重复生成同一轮

\]);

// ✅ 语音生成

useEffect(() => {

// ... 语音生成逻辑

}, \[

gameState.messages, // 消息变化时生成

gameState.voiceType, // 语音类型变化时生成

currentAudioMessageId, // 检测新消息

\]);

```

---

## 8. 开发规范

### 8.1 项目初始化

**必须使用 Coze CLI**:

```bash

# 初始化 Next.js 项目

coze init ${COZE_WORKSPACE_PATH} --template nextjs

# 工作目录

cd /workspace/projects

```

**⚠️ 禁止**:

- 禁止使用 `npm create` 或 `pnpm create`

- 禁止使用其他初始化方式

### 8.2 包管理

**强制使用 pnpm**:

```bash

# 安装依赖

pnpm install

# 添加依赖

pnpm add \<package>

# 添加开发依赖

pnpm add -D \<package>

# 移除依赖

pnpm remove \<package>

```

**⚠️ 禁止**:

- 禁止使用 `npm` 或 `yarn`

### 8.3 项目运行

**开发环境**:

```bash

coze dev # 默认端口 5000，支持 HMR

```

**生产环境**:

```bash

coze build

coze start

```

**⚠️ 注意**:

- 开发环境运行在 5000 端口

- 修改代码自动触发热更新（HMR）

- 不需要手动重启服务

### 8.4 .coze 配置文件

**初始化后无需修改**（模板已预置完美配置）:

```toml

\[project\]

requires = \["nodejs-24"\]

\[dev\]

build = \["pnpm", "install"\]

run = \["pnpm", "run", "dev"\]

\[deploy\]

build = \["pnpm", "run", "build"\]

run = \["pnpm", "run", "start"\]

```

### 8.5 目录结构

```

src/

├── app/

│ ├── api/

│ │ ├── chat/

│ │ │ └── route.ts # 对话生成 API

│ │ └── tts/

│ │ └── route.ts # 语音合成 API

│ ├── layout.tsx # 全局布局

│ └── page.tsx # 主页面

├── components/

│ ├── ui/ # shadcn/ui 组件（预置）

│ ├── StartScreen.tsx # 开始界面

│ ├── GameScreen.tsx # 游戏主界面

│ ├── GameOverScreen.tsx # 结束界面

│ ├── AffectionBar.tsx # 好感度进度条

│ └── LoadingAnimation.tsx # 加载动画

├── context/

│ └── GameContext.tsx # 游戏状态管理

├── types/

│ └── game.ts # 类型定义

└── tests/

├── logic.test.ts # 逻辑测试

├── api.test.ts # API 测试

└── ...

```

### 8.6 代码规范

**命名规范**:

- 组件：PascalCase (`GameScreen.tsx`)

- 函数：camelCase (`handleSelectOption`)

- 常量：UPPER_SNAKE_CASE (`MAX_ROUNDS`)

- 类型：PascalCase (`GameState`, `Message`)

**注释规范**:

- 复杂逻辑必须添加注释

- 注释说明"为什么"而不是"是什么"

- 关键修复添加 `// ⚠️ 关键实现要点` 标记

**错误处理**:

- 所有 API 调用必须 try-catch

- 错误信息必须打印到 console

- 必须提供降级方案（默认值或重试）

---

## 9. 常见问题与解决方案

### 9.1 点击"开始游戏"无反应

**症状**: 点击按钮后没有任何反应。

**原因**: `GameContext` 的 `startGame` 函数存在闭包陷阱，读取到空的 `gameState.gender` 等。

**解决方案**:

```typescript

// 使用函数式更新

const startGame = () => {

setGameState(prev => {

// 从 prev 读取最新值

const gender = prev.gender;

const scenario = prev.scenario;

const voiceType = prev.voiceType;

if (!gender \|\| !scenario \|\| !voiceType) {

console.error('Missing game config');

return prev;

}

return {

...prev,

step: 1,

messages: \[\],

gameOver: false,

won: false,

};

});

};

```

### 9.2 对话重复

**症状**: 对方每次说的话都是一样的。

**原因**: `/api/chat` 接口在构建对话历史时过滤掉了用户的消息，导致 LLM 只能看到 partner 的消息。

**解决方案**:

```typescript

// ✅ 正确：包含所有消息

const chatHistory = messages.map(msg => ({

role: msg.role === 'partner' ? 'assistant' : 'user',

content: msg.content,

}));

```

### 9.3 进度条不显示

**症状**: 顶部进度条没走，进度条里也没显示。

**原因**: 使用自定义 Progress 组件可能存在样式冲突或渲染问题。

**解决方案**: 使用原生 div 实现进度条

```typescript

\<div className="flex-1 bg-gray-200 rounded-full h-full overflow-hidden">

\<div

className="h-full rounded-full transition-all duration-300"

style={{

width: `${(affection / 100) * 100}%`,

backgroundColor: getColor(),

}}

/>

\</div>

```

### 9.4 语音未更新

**症状**: 第二次说的语音是第一次的语音。

**原因**: 语音生成的条件是 `!audioUri`，第一轮后 `audioUri` 被设置，第二轮不会生成新语音。

**解决方案**: 跟踪消息 ID

```typescript

const \[currentAudioMessageId, setCurrentAudioMessageId\] = useState\<string \| null>(null);

// 为每条消息生成唯一 ID

const messageId = `${lastPartnerMessage.role}-${lastPartnerMessage.content}-${partnerMessageCount}`;

// 检测新消息

if (currentAudioMessageId !== messageId && gameState.voiceType) {

setAudioUri(undefined);

setCurrentAudioMessageId(messageId);

// ... 生成新语音

}

```

### 9.5 语音念括号内容

**症状**: 语音会念出 `(吸吸鼻子，语气软下来)` 等括号里的动作描述。

**原因**: 直接将包含括号的文本发送给 TTS。

**解决方案**: 清理文本

```typescript

const cleanTextForSpeech = (text: string): string => {

return text

.replace(/（\[^）\]*）/g, '') // 去掉中文括号

.replace(/\\(\[^)\]*\\)/g, '') // 去掉英文括号

.replace(/\\\[\[^\\\]\]*\\\]/g, '') // 去掉中括号

.replace(/\[「」『』\]/g, '') // 去掉其他标点

.trim();

};

// 调用 TTS 时使用清理后的文本

const cleanText = cleanTextForSpeech(lastPartnerMessage.content);

```

### 9.6 选择选项后卡住

**症状**: 选择选项后页面一直显示"正在思考..."。

**原因**:

1\. 防重复生成逻辑不完善

2\. useEffect 依赖数组不正确

3\. API 请求超时

**解决方案**:

1\. 添加 `isGeneratingRef` 防止重复请求

2\. 优化 `useEffect` 依赖数组

3\. 添加超时处理和错误重试

---

## 10. 测试要求

### 10.1 单元测试

**测试文件位置**: `src/tests/`

**必需测试**:

1\. **逻辑测试** (`logic.test.ts`):

- 好感度计算

- 游戏胜负判定

- 轮次递增

2\. **API 测试** (`api.test.ts`):

- `/api/chat` 接口调用

- `/api/tts` 接口调用

- 错误处理

3\. **语音更新测试** (`voice-update.test.ts`):

- 第一条消息触发语音生成

- 同一条消息不重复生成

- 新消息触发语音更新

- 连续多轮对话每轮都有唯一语音ID

4\. **文本清理测试** (`clean-text.test.ts`):

- 中文括号内容被去除

- 英文括号内容被去除

- 中括号内容被去除

- 多个括号都能正确处理

### 10.2 集成测试

**测试流程**:

1\. 初始化项目

2\. 启动开发服务 (`coze dev`)

3\. 检查 5000 端口存活

4\. 完整游戏流程测试：

- 选择性别/场景/语音

- 完成 10 轮对话

- 检查好感度变化

- 检查语音播放

- 检查结束界面

### 10.3 构建测试

**必需执行**:

```bash

# 类型检查

npx tsc --noEmit

# 构建检查

pnpm run build

```

**⚠️ 禁止**: 绝不允许交付 Build Failed 的代码

### 10.4 接口冒烟测试

**必需测试**:

```bash

# 测试对话生成接口

curl -X POST -H "Content-Type: application/json" \\

-d '{"gender":"female","scenario":"忘记纪念日","messages":\[\],"affection":20,"step":1,"isGameOver":false,"won":false}' \\

http://localhost:5000/api/chat

# 测试语音合成接口

curl -X POST -H "Content-Type: application/json" \\

-d '{"text":"你好","speaker":"zh_female_xiaohe_uranus_bigtts","uid":"test"}' \\

http://localhost:5000/api/tts

```

### 10.5 端口检测

**推荐做法**:

```bash

# 检查 5000 端口是否存活

curl -I --max-time 3 http://localhost:5000

# 检查 5000 端口的进程PID

ss -lptn 'sport = :5000'

```

**禁止做法**:

```bash

# ❌ 禁止：会检测出所有包含 5000 的连接

lsof -i:5000

# ❌ 禁止：可能误检出 50001 端口

netstat -tunlp \| grep 5000

```

---

## 11. 附录

### 11.1 环境变量

- `COZE_WORKSPACE_PATH`: 项目工作目录（默认 `/workspace/projects/`）

### 11.2 关键常量

```typescript

export const INITIAL_AFFECTION = 20;

export const MAX_AFFECTION = 100;

export const MIN_AFFECTION = -50;

export const WIN_AFFECTION = 80;

export const MAX_ROUNDS = 10;

```

### 11.3 超时设置

- LLM 请求：30秒

- TTS 请求：15秒

### 11.4 日志目录

- `/app/work/logs/bypass/app.log`: 主流程日志

- `/app/work/logs/bypass/dev.log`: 调试日志

- `/app/work/logs/bypass/console.log`: 浏览器控制台日志

### 11.5 相关文档

- \[Bug 修复记录\](./BUGFIXES.md)

- \[原始需求文档\](./GAME_REQUIREMENTS.md)

- \[开发规范\](./DEVELOPMENT_GUIDELINES.md)

---

---

**文档维护**: 本文档应与代码同步更新，确保每次修改都有对应的文档记录。
