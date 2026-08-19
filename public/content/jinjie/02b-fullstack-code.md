---
title: 实战进阶(1)：前后端、源代码、数据库、用户认证、Next.js 配套代码
category: jinjie
order: 2.1
parent: 02-fullstack-nextjs
summary: 配套代码与提示词：项目结构、SQL、环境变量配置
---

本文是《实战进阶(1)：前后端、源代码、数据库、用户认证与 Next.js》的配套代码与提示词汇编，包含示例项目的目录结构、常用 SQL 语句、数据库连接串格式以及从沙箱复制环境变量的提示词，可直接对照直播内容使用。

## 示例项目「哄哄模拟器」目录结构

```text
哄哄模拟器/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts
│   │   │   └── tts/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── StartScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── GameOverScreen.tsx
│   │   ├── AffectionBar.tsx
│   │   ├── LoadingAnimation.tsx
│   │   └── ui/ (shadcn/ui 组件)
│   ├── context/
│   │   └── GameContext.tsx
│   ├── types/
│   │   └── game.ts
│   └── tests/
│       └── logic.test.ts
├── package.json
├── tsconfig.json
└── .coze
```

## 「手动管理源代码」的反面教材

```text
毕业论文.doc
毕业论文-修改版.doc
毕业论文-最终版.doc
毕业论文-最终版(真的最终).doc
毕业论文-打死不改版.doc
毕业论文-导师又让改版.doc
```

## 常用 SQL 语句

```sql
SELECT * FROM blog_posts;
```

```sql
INSERT INTO blog_posts (title, summary, content)
VALUES ('新文章标题', '这是摘要', '这是正文内容...');
```

```sql
DELETE FROM blog_posts WHERE id = 3;
```

## 加上登录、注册、排行榜后的完整目录结构

```text
哄哄模拟器/
├── src/
│   ├── app/
│   │   ├── page.tsx                 ← 首页（网址：/）
│   │   ├── layout.tsx               ← 全局布局（导航栏、整体结构）
│   │   ├── globals.css              ← 全局样式
│   │   ├── login/
│   │   │   └── page.tsx             ← 登录页（网址：/login）
│   │   ├── register/
│   │   │   └── page.tsx             ← 注册页（网址：/register）
│   │   ├── leaderboard/
│   │   │   └── page.tsx             ← 排行榜页（网址：/leaderboard）
│   │   ├── api/
│   │   │   ├── chat/route.ts        ← 后端：LLM对话接口
│   │   │   ├── tts/route.ts         ← 后端：文字转语音接口
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts   ← 后端：处理登录
│   │   │   │   └── register/route.ts← 后端：处理注册
│   │   │   └── game-records/route.ts← 后端：保存/查询游戏记录
```

## 数据库连接串格式

```text
postgresql://username:password@host:5432/database_name
```

## 提示词：从沙箱复制环境变量

```text
从沙箱中找到coze-coding-dev-sdk的
COZE_WORKLOAD_IDENTITY_API_KEY、COZE_INTEGRATION_BASE_URL、COZE_INTEGRATION_MODEL_BASE_URL
这几个环境变量env，明文输出，方便我复制到自己的电脑里。
```

```text
把下面的变量也加到.env.local当中

 (下面整段换成你复制的）
# Coze SDK 核心配置
COZE_WORKLOAD_IDENTITY_API_KEY=xxx
COZE_INTEGRATION_BASE_URL=xxx
COZE_INTEGRATION_MODEL_BASE_URL=xx
```

## 提示词：启动项目

```text
请帮我启动这个 Next.js 项目。
```
