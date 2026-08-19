---
title: 内功篇小测验
category: neigong
order: 11
summary: 内功篇知识点自测题，检验 HTML、CSS、JS 等掌握程度。
---

**十一、内功篇小测验**

💡

HTML

1、关于 HTML 文档的基本结构，下列哪一项描述是正确的？

A\) ＜head＞ 标签用于显示网页的主要内容 B) ＜body＞ 标签用于存放后台资料 C) ＜head＞ 标签存放如字符编码、关键字等后台资料 D) ＜body＞ 标签不会显示在网页中

2、下列哪个标签用于插入图片，并且需要设置图片路径和替代文本？

A\) ＜img＞ B) ＜blockquote＞ C) ＜ol＞ D) ＜div＞

3、关于 HTML 标题标签（Heading），下列说法正确的是？

A\) 只有 ＜h1＞ 标签可用 B) 共分为 6 个层级，从 ＜h1＞ 到 ＜h6＞ C) ＜h6＞ 是最高级别标题 D) ＜h1＞ 标签只能用于 LOGO

4、下列哪个标签属于“区块元素”，常用于组织页面内容，使其更具结构性，可以包含标题、段落、列表等？

A\) ＜section＞ B) ＜strong＞ C) ＜em＞ D) ＜br＞

5、关于 ＜a＞ 标签的用法，下列哪项说法正确？

A\) ＜a＞ 标签只能用于页面内跳转 B) ＜a＞ 标签必须配合 href 属性指定目标网址 C) ＜a＞ 标签不能和列表标签一起用 D) ＜a＞ 标签只能放在 ＜head＞ 里

💡

CSS

1、关于 CSS 的三种添加方式，下列哪种方式可以同时控制多个网页的外观？

A\) 内联样式 B) 内部样式表 C) 外部样式表 D) 行内脚本

2、下列哪种写法是“类选择器”的正确用法？

A\) p { color: red; } B) \#intro { color: red; } C) .intro { color: red; } D) div p { color: red; }

3、关于 CSS 的盒子模型，下列哪个属性用于设置元素的“外边距”？

A\) border B) padding C) margin D) width

4、如果要让所有 ＜p＞ 标签的文字变成蓝色，应该使用哪种选择器？

A\) .p { color: blue; } B) \#p { color: blue; } C) p { color: blue; } D) div p { color: blue; }

5、下列哪个 CSS 属性可以用来设置网页元素的背景颜色？

A\) color B) background-color C) font-family D) border

💡

TypeScript / JavaScript

1、关于 TypeScript 和 JavaScript 的关系，下列哪项说法符合文档内容？

A\) TypeScript 比 JavaScript 更宽松 B) TypeScript 是 JavaScript 的“亲哥”，更严格 C) JavaScript 只能运行在浏览器，TypeScript 不能 D) TypeScript 不需要类型声明

2、下列哪种写法能在 TypeScript 中声明一个只能存放数字的变量？

A\) let age = “25岁”; B) let age: number = 25; C) let age: string = 25; D) let age = true;

3、关于 const 和 let 的区别，文档中是如何比喻的？

A\) const 是普通盒子，let 是上锁的盒子 B) let 是普通盒子，可以随时换内容，const 是上锁的盒子，内容固定不变 C) let 只能存数字，const 只能存字符串 D) 没有区别

4、下列哪种写法可以在 TypeScript 中定义一个有可选属性的接口？

A\) interface Student { name: string; age: number; major?: string; } B) interface Student { name: string; age: number; major: string; } C) interface Student { name: string; age: string; } D) interface Student { name?: string; age?: number; }

5、关于 .js、.ts、.jsx、.tsx 文件的区别，下列哪项说法符合文档内容？

A\) .js 只能写类型安全的代码 B) .ts 文件有类型检查，.js 没有 C) .jsx 文件不能写界面 D) .tsx 文件没有类型检查

Next.JS

1、下列哪项比喻最能体现 NodeJS、NPM 和 NextJS 的关系？

A\) 车、轮胎、方向盘 B) 地基和框架、工具箱和建材商店、预制的房屋设计 C) CPU、内存、硬盘 D) 画笔、颜料、画布

2、在 NextJS 项目中，哪个文件夹用于存放静态资源（如图片、字体等）？

A\) app B) public C) src D) assets

3、NextJS 的 app 文件夹的主要作用是什么？

A\) 存放静态资源 B) 管理全局配置 C) 路由的核心，每个文件/文件夹对应一个页面路由 D) 存放数据库文件

4、在 NextJS 中，如何实现动态路由？

A\) 在 app 文件夹下创建以 \[参数名\] 命名的文件夹 B) 在 public 文件夹下新建文件 C) 修改 tsconfig.json D) 只能通过配置文件实现

5、下列关于 NextJS 的 Server Components 说法正确的是？

A\) 只能在客户端运行 B) 运行在 Node 边缘/Serverless，可直接调用后端 SDK、数据库等 C) 只能处理静态页面 D) 不能访问数据库

6、如果你需要在 NextJS 页面中实现用户交互（如按钮点击），应该使用哪种组件？

A\) Server Component B) Client Component C) Static Component D) Layout Component

7、在 NextJS 中，声明一个组件为客户端组件需要做什么？

A\) 在文件顶部添加 “use client” B) 在文件顶部添加 “use server” C) 在 package.json 配置 D) 不需要任何声明

8、public 文件夹中的资源如何在页面中引用？

A\) 通过绝对路径 B) 通过相对路径（如 /logo.png） C) 只能通过 import D) 只能放在 app 文件夹下

9、NextJS 的 layout.tsx 文件的作用是什么？

A\) 存放静态资源 B) 提供所有子路由的根布局，实现页面间的 UI 共享 C) 管理 API 路由 D) 存放环境变量

10、在 NextJS 中，如何启动本地开发环境？

A\) npm start B) npm run dev C) npm build D) node index.js

11、下列关于 NextJS 路由机制的说法正确的是？

A\) 文件=路由，文件夹=层级，layout 包壳 page B) 只能通过配置文件定义路由 C) 路由只能写在 public 文件夹 D) 路由和页面无关

12、NextJS 的 API 路由本质上是什么？

A\) 基于文件系统的路由，每个文件代表一个 API 端点 B) 只能通过代码注册 C) 只能在 public 文件夹下 D) 需要手动配置

13、在 NextJS 中，如何为页面设置元数据（如标题、描述等）？

A\) 在页面组件中导出 metadata 对象 B) 只能在 public 文件夹设置 C) 只能通过 HTML 写死 D) 只能在 layout.tsx 设置

14、下列关于 NextJS 图片优化组件 ＜Image＞ 的说法正确的是？

A\) 只能显示 PNG 格式 B) 支持响应式图片和自动压缩 C) 不能设置占位符 D) 只能在 public 文件夹使用

15、NextJS 支持哪几种主要的渲染策略？

A\) 只有静态生成 B) 静态生成、服务器端渲染、增量静态再生成 C) 只有客户端渲染 D) 只有 SSR

16、在 NextJS 中，动态路由参数如何在页面组件中获取？

A\) 通过 props.params B) 通过 window.location C) 通过全局变量 D) 通过 import

17、下列关于 NextJS 的中间件（Middleware）说法正确的是？

A\) 只能在客户端运行 B) 在页面或 API 路由被访问前执行，可做认证、重定向等 C) 只能处理图片 D) 只能在 public 文件夹下

18、在 NextJS 中，环境变量的作用是什么？

A\) 存储配置信息，如 API 密钥、数据库连接字符串等 B) 存放静态资源 C) 管理页面路由 D) 优化图片

19、下列关于 NextJS 的动态导入（dynamic import）说法正确的是？

A\) 只能在服务器端使用 B) 允许代码分割，只在需要时加载特定组件 C) 不能和 Suspense 一起用 D) 只能导入 CSS

20、NextJS 的 Streaming 与 Suspense 主要用于什么场景？

A\) 提高首次内容绘制速度，分批加载 UI 片段 B) 优化图片加载 C) 管理环境变量 D) 静态资源管理

HTML：

1-5：C A B A B

CSS：

1-5：C C C C B

TypeScript / JavaScript：

1-5：B B B A B

Next.JS：

1-5：B B C A B

6-10：B A B B B

11-15：A A A B B

16-20：A B A B A
