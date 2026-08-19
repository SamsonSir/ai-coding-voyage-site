---
title: Next.js 学习指引（非常重要）
category: neigong
order: 7
summary: Next.js 系统学习路线：官方教程、核心概念与验收标准。
---

**七、Next.JS（非常重要）**

💡

非常重要。

本章节只是你学习NextJS的指引，并不是NextJS的教程本身。

请你花足够多的时间，沿着指引，去系统性学习NextJS。

NextJS官方教程 https://nextjs.org/learn/ (这也是学习NextJS最好的教程，可以快速入门，预计需要10小时）

视频教程 https://www.youtube.com/watch?v=b4ba60j_4o8&list=PLC3y8-rFHvwhIEc4I4YsRz5C7GOBnxSJY （详细，预计需要20小时）

怎么才算学会？

你本人能够读懂每一行由AI工具生成的代码。

![](images/07-nextjs/image1.webp)

**7.1 核心概念**

💡

**NodeJS、npm、NextJS 三者的关系？**

![](images/07-nextjs/image2.webp)

就像盖房子一样！

想象你要建一座房子，这三个东西就是这样的关系：

**NodeJS：地基和框架**

这就像房子的地基和主体框架

提供了坚实的基础，让一切能够运行

没有它，其他部分都无法存在

**NPM：工具箱和建材商店**

这就像你的工具箱和一家便利的建材商店

当你需要门窗、瓷砖或其他配件时，NPM 帮你找到并安装它们

它让你不用自己制造每一个零件，可以直接使用别人做好的部分

**NextJS：预制的房屋设计**

这就像是一个现成的房屋设计方案

已经帮你规划好了房间布局、门窗位置等

让你不必从零开始设计，省时又省力

**它们如何一起工作？**

1\.

首先安装 NodeJS（打好地基）

2\.

NodeJS 自带 NPM（有了工具箱和建材商店）

3\.

用 NPM 安装 NextJS（选用一个预制的房屋设计）

4\.

然后开始建造你的网站，需要什么额外的功能，就用 NPM 去"购买"

**7.1.1 小时入门 NextJS**

**7.1.1.1 环境准备**

打开终端，输入npx create-next-app@latest，点击回车

![](images/07-nextjs/image3.webp)

一直点击回车，都选默认项

![](images/07-nextjs/image4.webp)

等待项目创建完成，记住项目的存储路径

![](images/07-nextjs/image5.webp)

打开 Cursor，打开项目(Open project)

![](images/07-nextjs/image6.webp)

选择刚刚创建的文件存储路径

![](images/07-nextjs/image7.webp)

查看已经创建的Next.JS项目

![](images/07-nextjs/image8.webp)

**重点关注：**

**APP文件夹**

解释：它是 Next.js 中路由的核心所在。在这个文件夹下，每个文件或文件夹都对应一个页面路由。例如，创建一个 home.js（或 home.tsx 等 ）文件在 app 文件夹下，就可以通过浏览器访问对应的首页；如果创建子文件夹，如 app/blog/\[slug\].js ，可以实现动态路由，用于展示博客详情等。

比喻：相当于你家的 “房间分布图”，每个 “房间”（文件 / 文件夹）都是一个网页。

举例：

创建 app/home.js → 访问 http://localhost:3000 就能看到这个页面。

创建 app/blog/\[id\].js → 访问 http://localhost:3000/blog/123 会根据 id 动态显示文章。

**public 文件夹**

解释：用于存放静态资源，如图像、字体、图标等。在页面中可以通过相对路径直接引用这些资源，例如在组件中使用 ＜img src="/logo.png" alt="公司 logo"＞ ，这里的 logo.png 就可以放在 public 文件夹下。

比喻：像你家的 “公共储物间”，放图片、视频、PDF 等大家都能用的东西。

举例：

把 logo.png 放这里，代码里直接写 ＜img src="/logo.png" /＞ 就能用。

启动开发环境，查看当前界面，终端运行 npm run dev

运行 npm run dev

![](images/07-nextjs/image9.webp)

打开http://localhost:3000/ ，查看当前项目页面

![](images/07-nextjs/image10.webp)

启动开发环境后，你就可以正常访问 3000 端口网页了，3000 端口是开发中约定俗成的端口，我们会在 Cursor 启动一个终端窗口，来固定启动开发环境。

![](images/07-nextjs/image11.webp)

当你的代码发生了更新，比如将主页做成学员欢迎页

让 Cursor 生成代码

![](images/07-nextjs/image12.webp)

检查生成的代码

![](images/07-nextjs/image13.webp)

无误后点击接受

![](images/07-nextjs/image14.webp)

我们可以看到，本次修改的页面文件，在app 文件夹下的 page.tsx 文件，也就是主页

![](images/07-nextjs/image15.webp)

让我们回到开发界面，查看当前的代码效果

![](images/07-nextjs/image16.webp)

很好，界面已经成功完成了，在这一步，如果你的代码改动比较大，你需要重新启动开发环境

结合我们前面的知识，你需要在开发环境的终端窗口，先结束服务，再重新启动，快捷操作如下

鼠标来到开发环境的终端

![](images/07-nextjs/image17.webp)

按住 Ctrl + c ，停止服务 (Windows电脑也是 Ctrl + c )

![](images/07-nextjs/image18.webp)

按住方向按键的⬆️，出现上一条指令

![](images/07-nextjs/image19.webp)

💡

点击回车，此时开发环境就成功的重新启动了

**7.1.1.2 项目结构 & 路由**

**口诀：文件=路由、文件夹=层级、layout 包壳 page。**

├── app/ \# ➜\*App Router 核心\* │ ├── layout.tsx \# 所有子路由的根布局 │ ├── page.tsx \# 访问 / 时渲染 │ └── globals.css ├── public/ \# 静态资源 ├── tsconfig.json └── tailwind.config.ts

在 Next.JS 项目里，页面路由主要和 app 文件夹相关。打开项目目录，找到 app 文件夹，在里面新建一个文件，比如 about.tsx 。这就相当于创建了一个新的页面，用来展示 about 的内容。

Cursor 描述需求

![](images/07-nextjs/image20.webp)

查看代码增加内容

![](images/07-nextjs/image21.webp)

查看页面效果

![](images/07-nextjs/image22.webp)

知识拆解

首先我们在 page 文件夹中，创建了一个 about 文件夹

![](images/07-nextjs/image23.webp)

接着在 about 文件夹中，创建了 page 文件

![](images/07-nextjs/image24.webp)

最后在 http://localhost:3000/ 后添加 /about，查看页面

![](images/07-nextjs/image25.webp)

我们会使用这种方式，逐步增加网站的子页面。详细讲解下 Next.JS 的文件系统的路由机制

Next.js 会自动将 app 文件夹下的文件和文件夹结构映射为对应的 URL 路径

文件夹名对应 URL 路径中的路径段 。创建的 about 文件夹，就对应了 URL 中的 /about 路径部分。

page 文件是可公开访问的页面组件载体 。当在 about 文件夹中创建 page 文件时，它所导出的 React 组件内容，会被渲染到与该文件夹对应的 URL 路径页面上。比如 about/page.tsx 中导出的组件，会在访问 /about 时展示给用户。page文件就像是一个 “页面内容提供者” ，告诉浏览器在对应的 URL 路径下要显示什么。

**7.1.1.3 组件**

NextJS 里有两种组件(Components)，分别是服务端组件和客户端组件。

NextJS默认 **Server Components**，仅在需要浏览器交互时才标注 "use client"。

**服务端组件(Server Components)**

特点：

运行在 Node 边缘 / Serverless。

可直接调用后端 SDK、数据库、文件系统。

生成纯 HTML，体积小，SEO 友好。

// app/users/page.tsx (Server 组件) import { fetchUsers } from "@/lib/api"; export default async function Users() { const users = await fetchUsers(); // 直接 await return ( ＜ul＞ {users.map(u =＞ ＜li key={u.id}＞{u.name}＜/li＞)} ＜/ul＞ ); }

**客户端组件 (Client Components)**

"use client"; import { useState } from "react"; export default function Counter() { const \[n, setN\] = useState(0); return ( ＜button className="rounded bg-blue-600 px-3 py-1 text-white" onClick={() =＞ setN(n + 1)} ＞ 点击 {n} ＜/button＞ ); }

**共享布局 layout.tsx**

// app/layout.tsx export const metadata = { title: "一小时 Next.js" }; export default function RootLayout({ children }: { children: React.ReactNode }) { return ( ＜html lang="zh"＞ ＜body className="prose mx-auto p-4"＞{children}＜/body＞ ＜/html＞ ); }

让我们先创建一个公共 component，点击后有页面的交互动效

Cursor 描述需求

![](images/07-nextjs/image26.webp)

查看代码修改

![](images/07-nextjs/image27.webp)

![](images/07-nextjs/image28.webp)

查看界面效果

![](images/07-nextjs/image29.webp)

![](images/07-nextjs/image30.webp)

接下来我们将解析代码，首先看 Cursor 生成的这个公共组件

![](images/07-nextjs/image31.webp)

我们可以看出，这个是签到按钮，具备了两种形态（签到/已签到）

查看 app 文件夹下的page，我们会发现，在最上方引入了创建的公共组件，并且添加了一个 div 用于展示

![](images/07-nextjs/image32.webp)

![](images/07-nextjs/image33.webp)

在 app/about 文件夹下的 page 文件同理

![](images/07-nextjs/image34.webp)

因此，用这种方法，能够复用功能完好的组件，加速开发流程

**7.1.1.4 数据获取**

如果在Server Component里，可以直接使用fetch()函数获取数据、以及调用API。

// app/api-example/page.tsx export default async function ApiExample() { const res = await fetch("https://jsonplaceholder.typicode.com/users", { // 缓存 60 秒，等同 ISR next: { revalidate: 60 } }); const users: { id: number; name: string }\[\] = await res.json(); return ( ＜ul className="list-disc pl-5"＞ {users.map(u =＞ ( ＜li key={u.id}＞{u.name}＜/li＞ ))} ＜/ul＞ ); }

如果是在Client Component里，可以使用Ajax的方式获取数据。

要点

"use client" —— 声明这是 Client Component。

用 useEffect 把网络请求放到浏览器执行，避免 SSR 时跑两遍。

本地维护 loading / error / data 三态即可；初学者先别上管理库。

与 Server 组件不同，这里无法使用 revalidate 等 Next.js 缓存指令，完全由浏览器缓存策略决定。

"use client"; import { useEffect, useState } from "react"; type User = { id: number; name: string }; export default function UsersClient() { const \[users, setUsers\] = useState＜User\[\]＞(\[\]); const \[loading, setLoading\] = useState(true); const \[error, setError\] = useState＜Error \| null＞(null); useEffect(() =＞ { fetch("https://jsonplaceholder.typicode.com/users") .then(r =＞ { if (!r.ok) throw new Error("请求失败"); return r.json(); }) .then((data: User\[\]) =＞ setUsers(data)) .catch(err =＞ setError(err)) .finally(() =＞ setLoading(false)); }, \[\]); // 只在首屏执行一次 if (loading) return ＜p＞加载中…＜/p＞; if (error) return ＜p className="text-red-600"＞出错：{error.message}＜/p＞; return ( ＜ul className="list-disc pl-5"＞ {users.map(u =＞ ( ＜li key={u.id}＞{u.name}＜/li＞ ))} ＜/ul＞ ); }

**7.1.1.5 public目录**

在 Next.js 中，public 文件夹是一个特殊的目录，用于存放不需要经过 Webpack 等构建工具处理的静态资源。这些资源可以直接通过 URL 访问，是项目中存放公开静态文件的标准位置。

让我们在项目中，添加一个图片

Cursor 描述需求

![](images/07-nextjs/image35.webp)

查看代码修改

![](images/07-nextjs/image36.webp)

查看界面效果

![](images/07-nextjs/image37.webp)

代码解析

首先在 public 中添加了一张 1 图片

![](images/07-nextjs/image38.webp)

在 app 文件夹下的 page 实现导入

![](images/07-nextjs/image39.webp)

![](images/07-nextjs/image40.webp)

以上就是在做产品中，添加图片的方式，当你的产品逐渐功能开始完善，你将会在 public 中创建多层文件夹，来管理你的各项图片

**7.1.1.6 内置优化 & 资源管理**

NextJS 把性能优化做成了「默认开启」。只要用对官方组件，就能自动获得更小的包体、更快的首屏和更好的 SEO。下面列出初学者需要优先关注的4 个点——**图片、链接、字体、元数据**——每个都配一段可直接复制的代码。

**＜Image＞—— 响应式图片 & 自动压缩**

import Image from "next/image"; // pages 或 app 组件里 export default function Hero() { return ( ＜Image src="/banner.jpg" // 本地 /public 里的资源 alt="首页横幅" width={1200} height={400} // 固定基准尺寸 sizes="100vw" // 告诉浏览器在各断点占满宽度 priority // 首屏优先加载 placeholder="blur" // 先用模糊占位 className="rounded-xl" /＞ ); }

自动格式转换：支持 AVIF/WebP，依据浏览器能力回落到 JPEG/PNG。

多尺寸裁切：只下载当前视口需要的尺寸，移动端节省流量。

远程图片：在 next.config.js 里 images.remotePatterns 白名单即可。

**＜Link＞—— 预取 & 无刷新跳转**

import Link from "next/link"; ＜Link href="/pricing" prefetch＞价格计划＜/Link＞

prefetch 默认就开（视口内自动），当链接滚入可视范围时提前把目标页面 **HTML + JS** 都下载好；点击几乎 0 延迟。

**next/font** **—— 零 FOIT/FOUC 的可变量字体**

// app/layout.tsx import { Inter } from "next/font/google"; const inter = Inter({ subsets: \["latin"\], variable: "--font-inter", display: "swap" // 避免闪白 }); export default function RootLayout({ children }: { children: React.ReactNode }) { return ( ＜html lang="zh" className={inter.variable}＞ ＜body＞{children}＜/body＞ ＜/html＞ ); }

字体文件 **按需子集化**，只打包用到的字形。

自动加 preload/font-display，首屏不闪。

也支持本地字体：next/font/local({ src: "./AlibabaSans.woff2" })。

**元数据 & SEO —— metadata / generateMetadata**

// app/blog/\[slug\]/page.tsx export const revalidate = 60; // ISR export async function generateMetadata({ params }) { const post = await fetchPost(params.slug); return { title: post.title, description: post.excerpt, openGraph: { images: post.cover } }; }

Next .js 会把返回值注入 ＜head＞，同时输出到 /\_next/data/\*.json 供客户端水合。

**动态页面也能静态化**：结合 revalidate，既有 SEO 又可频繁更新。

支持 Twitter Card、robots、viewport… 一律类型安全。

**7.1.2 二十小时精通 Next.JS**

**创建一个 Next.JS 文件**

1.在 vscode/Cursor 打开想要新建 Next.JS 的文件

![](images/07-nextjs/image41.webp)

2.并在该文件内新建一个终端并打开

![](images/07-nextjs/image42.webp)

3.输入 npx create-next-app@latest

![](images/07-nextjs/image43.webp)

4.按下图设定 yes/no（通过键盘左右键切换）

![](images/07-nextjs/image44.webp)

5.即可在以下路径找到你的文件

![](images/07-nextjs/image45.webp)

6.即可看到你创建的 nextJS 程序啦～

![](images/07-nextjs/image46.webp)

**运行 Next.JS**

cd 到项目文件夹，再输入npm run dev

![](images/07-nextjs/image47.webp)

npm run dev 和 npm build 区别总结：

命令

作用

适用环境

主要特点

npm run dev

运行本地开发服务器

开发环境

热重载、实时编译、调试友好

npm build

构建优化后的静态文件

生产环境

代码压缩、优化、打包成可部署版本

b\.

然后在浏览器中转到 http://localhost:3000/ ，您将可以看到 Next.JS 为您设置的样式

![](images/07-nextjs/image48.webp)

**Page（页面）**

💡

比喻：房间

每个页面就像房子里的一个房间，有特定的用途和内容

你可以从一个房间走到另一个房间（导航）

![](images/07-nextjs/image49.webp)

你可以在这里发现"app"等文件夹，其中 app 文件夹包含全局 CSS 文件中的所有页面和组件。

如果仔细观察，就会发现有一个名为"page.tsx"的 JavaScript 文件。打开它时，您将看到我们最初启动 NextJS 应用时出现的样式页面代码。

![](images/07-nextjs/image50.webp)

![](images/07-nextjs/image51.webp)

![](images/07-nextjs/image52.webp)

**  
API 路由**

Next.JS 使用 app router（应用程序路由器），并用文件夹定义路由。即：Next.JS 的 API 路由本质上是一个基于文件系统的路由，每个文件都代表一个 API 端点。

💡

比喻：传话员

就像一个传话员，负责在前台（前端）和后厨（后端）之间传递信息

顾客（用户）通过传话员点餐，厨师（服务器）通过传话员送出菜品

1\.

例如 page.tsx 位于我们的 app 文件夹中，这使得我们的 page.tsx 成为主页，可通过 http://localhost:3000/ 访问。

![](images/07-nextjs/image53.webp)

2\.

此时，如果我们想去 localhost 3000/about

只需要在 app 文件夹中创建一个新文件夹，并将其命名为"about"，再在"about"文件夹中创建一个名为"page.tsx"的新文件。这将是"about"路由对应的页面 http://localhost:3000/about

![](images/07-nextjs/image54.webp)

如果你想在"about"目录中添加更多嵌套路由，可以使用相同的逻辑。先在"about"文件夹内创建一个新的文件夹“projects”，再这个文件夹下创建一个名为"page.tsx"的新文件。

3\.

如果您想创建部分 URL 是动态的路由，只需在文件夹中使用方括号。

如："localhost:3000/about/projects/\[projectId\]"

a\.

在"projects"文件夹中，创建一个为“\[projectId\]”的文件夹。这将允许您捕获 URL 的 \[projectId\] 动态部分作为参数。

b\.

这样，如果你导航到 localhost:3000/about/projects/ 后跟任意数字或单词，例如 123（localhost:3000/about/projects/123），它将提供"projectId"文件夹内的 page.tsx 文件。

![](images/07-nextjs/image55.webp)

c\.

params（参数）：在页面内部，我们可以访问关键字"params（参数）"，"params"对象用于捕获 Next.JS 中的动态路由参数，特别是在处理动态路线时。

1 在我们的示例中，代码引用了动态路由，localhost:3000/about/projects/\[projectId\],在这种情况下，"projectId"是 URL 的动态部分，并且 Next.JS 在访问路由时会自动用相应的值填充"params"对象，即 **project Id: 123**

💡

const **page** = ({ params }) =＞ { return ＜div＞project Id: {params.projectId}＜/div＞; }; export default page;

2 假设您想根据"projectId"从 API 或数据库中获取项目详细信息。您可以使用"params"对象来访问项目 ID，然后调用接口以检索该特定项目的数据。

💡

const ProjectPage = async ({ params }) =＞ { //获取服务器上的项目数据 const response = await fetch(\`/API/projects/${params.projectid}\`); const projectData = await response.JSon();

动态路由非常适用于具有单个实体页面的应用，例如博客文章、产品或用户资料，这些页面数据经常变化但布局或设计保持一致。

如果没有动态路由，您将需要为每个实体手动创建单独的页面，这导致大量静态页面，维护既耗时又难以扩展。

**布局系统（Layouts 文件）**

📌

比喻：房子的框架结构

就像房子的墙壁和走廊，决定了各个房间如何连接

所有房间共享同样的屋顶和地基（页眉、页脚）

![](images/07-nextjs/image56.webp)

在 Next.JS 中，布局是一种在应用程序的不同页面之间共享一致 UI 的方式，只需将布局视为页面的模板（Templates）即可。

**RootLayout**（根布局）**：**在代码中，该布局的文件由 Next.JS 自动生成，它采用"**children**"参数。

![](images/07-nextjs/image57.webp)

这意味着这个布局模板将适用于任何地方，无论是在"home"目录（http://localhost:3000/）还是"about"目录（http://localhost:3000/about）。

布局文件通常用于需要出现在每个页面上的元素，例如导航栏、页脚和侧边栏。这可以防止重复并确保 UI 保持一致。

![](images/07-nextjs/image58.webp)

**字体**

如果我们去检查我们的网站，我们可以看到字体、Geist Mono 和 sans 已经实现。

![](images/07-nextjs/image59.webp)

提供一个例子～：假设您不知道，它已经包含 Google 字体。您想导入"inter"作为您的字体，可以从"next/font/google 目录中获取它，然后创建一个常量，再在类名中应用它，就可以使用全局 CSS 来设置字体。

//从"next/font/google目录中获取inter import { Inter }from "next/font/google"; //创建一个常量 const inter=Inter({ subsets: \["latin"\], //**只会加载拉丁字符**，减少不必要的字体文件，提高性能。 display: "swap", //加载策略，先用系统字体，加载完成后替换为 Inter，避免空白问题。 }); //把 inter.className 应用到 ＜HTML＞ 标签,使整个页面都会继承 Inter 字体。 export default function **RootLayout**({ children}) { return ( ＜HTML lang="en" className={inter.className}＞ ＜body＞ ＜Navbar/＞ {children} ＜/body＞ ＜/HTML＞ ); }

**元数据**

有助于向浏览器和搜索引擎描述、解释或提供有关网页的背景。这反过来又使页面 SEO 对搜索引擎更友好，使其能够索引你的页面，并在搜索结果中正确显示。

A. 例如，在项目页面中，我们希望该页面具有适当的标题和描述以及元数据，要在"项目"页面中声明元数据，我们只需输入export const metadata={}；，该对象里面是标题和描述，您还可以列出与页面内容和作者相关的关键字列表。

![](images/07-nextjs/image60.webp)

export const metadata ={ title: "My Next.JS App", description: "This is a description of my Next.JS app.", keywords: \["Next.JS", "react", "seo"\], author: "Your Name", };

B. 如果我们处理的是不同项目等动态数据（例如**\[projectld\]**文件夹中的数据），不能对每个元数据都进行硬编码，可以引入**动态元数据**。

**动态元数据：**依赖于不断变化的信息，例如当前路径参数，外部数据，或者来自父段的元数据。可以通过导出一个返回元数据对象的 generateMetadata 函数来进行配置。

💡

export async function **generateMetadata**({ params}, parent) { const { projectld } = params; const product = await fetch(\`https://.../${projectid}\`).then((res) =＞res.JSon()) return { title: product.title, description: product.description, }; }

以上代码的作用为：

这个 generateMetadata 函数的作用是**根据当前页面的 URL 参数动态生成元数据**，比如 title 和 description。

它会**从 API 获取数据**，然后返回页面的元信息。

适用于 **SEO（搜索引擎优化）**，让不同的项目页面有不同的 title 和 description，提升网页的搜索引擎排名。

**组件（Components）**

**小组件可以组成更大的组件（树状结构）**

Next.JS 的组件就像乐高积木，你可以用它们搭建整个网站

**服务器组件和客户端组件：Next.JS 中的两个主要类型组件**

NextJS 将服务器组件设置为默认组件。通过服务器和客户端组件的组合，Next，JS 可以创建高效的应用程序，有效的平衡速度和交互性。

1\.

服务器组件会在服务器上呈现，并向客户端发送静态 HTML（例如直接从服务器获取的标题或数据。），通过减少 JavaScript 包的大小和数量，以缩短加载时间、更快地传递内容。

**服务器组件比喻**：由工厂预先组装好的积木套装，顾客拿到手就可以直接使用，不需要自己组装（减少客户端 JavaScript）

2\.

客户端组件可以处理用户交互，如按钮、表格或动画；或使用状态、效果和事件监听器，这意味着他们可以向用户提供即时反馈并更新 UI。

**客户端组件比喻**：需要顾客自己组装的积木，但能实现更多互动功能（比如积木可以旋转、发光）

**如何组合应用客户端组件和服务端组件：**

通过仅在必要时选择性地使用客户端组件，Next.JS 优化了应用程序的性能，同时仍提供了响应迅速、交互式的用户体验。

服务器组件和客户端组件在 Next.JS 中协同工作时，服务器端渲染，加快初始加载时间，并将 SEO 优化与客户端交互相结合，实现动态丰富的用户体验。

通过适当分离关注点，将繁重的任务转移到服务器上，并使用客户端进行交互，确保性能和用户体验都得到优化，从而实现速度更快、更具可扩展性的网络应用程序。

**将服务器组件转换为客户端组件的方式：**

只需在文件的第一行添加带有双引号的使用客户端即可。

注意：

a\.

机密数据不要放到客户端使用，避免数据泄露

b\.

服务器没有浏览器状态，部分组件只能运行在客户端（比如输入框的整个组件）

"use client"

**举个几个例子：**

3\.

简单的函数组件：

💡

// components/Hello.tsx import React from 'react'; // 定义一个简单的函数组件 const Hello = () =＞ { return ＜h1＞Hello, Next.JS!＜/h1＞; }; export default Hello;

**解释：**

import React from 'react';：引入 React，这是 Next.JS 中写组件的必要操作。

const Hello = () =＞ {}：这是一个函数组件，名字叫 Hello。

return ＜h1＞Hello, Next.JS!＜/h1＞;：它返回一个简单的 HTML 标题标签 ＜h1＞，并在页面上显示文字“Hello， Next.JS！”.

export default Hello;：这行代码导出组件，方便在其他文件中引用。

a\.

如何使用这个组件：

💡

// pages/index.tsx import Hello from '@/components/Hello'; // 使用 Hello 组件 export default function Home() { return ( ＜div＞ ＜Hello /＞ ＜/div＞ ); }

**解释：**

import Hello from '@/components/Hello';：引入我们刚刚创建的 Hello 组件。

＜Hello /＞：像 HTML 标签一样使用组件，这是 React 的组件语法。

页面上会显示：**Hello， Next.JS！**

4\.

带 Props 的组件

// components/Greeting.tsx import React from 'react'; // 定义 Props 类型 type GreetingProps = { name: string; }; // 定义带有 Props 的组件 const Greeting: React.FC＜GreetingProps＞ = ({ name }) =＞ { return ＜h1＞Hello, {name}!＜/h1＞; }; export default Greeting;

**解释：**

**Props**：是组件的“属性”，类似于 HTML 标签的属性。通过 Props 可以向组件传递数据。

type GreetingProps = { name: string; };：定义了 Props 的类型，确保 name 只能是字符串。

{ name }：在函数参数中解构出 name 属性。

＜h1＞Hello, {name}!＜/h1＞：通过 {name} 动态显示传入的名字。

a\.

如何使用带 Props 的组件：

💡

// pages/index.tsx import Greeting from '@/components/Greeting'; // 使用 Greeting 组件，并传入不同的名字 export default function Home() { return ( ＜div＞ ＜Greeting name="Alice" /＞ ＜Greeting name="Bob" /＞ ＜/div＞ ); }

**解释：**

＜Greeting name="Alice" /＞：给组件传递一个 name 属性，值是 "Alice"。

＜Greeting name="Bob" /＞：再传递一个 name 属性，值是 "Bob"。

💡

Hello, Alice! Hello, Bob!

5\.

使用状态的组件

// components/Counter.tsx import React, { useState } from 'react'; // 定义一个计数器组件 const Counter: React.FC = () =＞ { const \[count, setCount\] = useState(0); return ( ＜div＞ ＜p＞当前计数: {count}＜/p＞ ＜button onClick={() =＞ setCount(count + 1)}＞增加＜/button＞ ＜/div＞ ); }; export default Counter;

**解释：**

useState(0)：useState 是 React 的 Hook，用来创建一个状态变量。这里 count 的初始值是 0。

setCount(count + 1)：点击按钮时，setCount 会把 count 的值加 1，触发页面更新。

＜p＞当前计数: {count}＜/p＞：通过 {count} 动态展示当前的计数。

＜button＞：点击按钮后执行 onClick 事件，更新 count。

a\.

如何使用这个组件：

💡

// pages/index.tsx import Counter from '@/components/Counter'; export default function Home() { return ( ＜div＞ ＜Counter /＞ ＜/div＞ ); }

**解释：**

页面加载时，count 的初始值是 0。

每点击一次按钮，数字就会加 1。

页面显示类似：

💡

当前计数: 0 \[增加\]

6\.

页面组件和路由

💡

// pages/about.tsx export default function About() { return ＜h1＞关于我们＜/h1＞; }

**解释：**

在 Next.JS 中，pages 文件夹中的每个 .tsx 文件都会自动变成一个页面。

export default function About()：这是一个页面组件，表示 /about 路由。

＜h1＞关于我们＜/h1＞：这是页面上的内容。

**如何访问：**

启动你的 Next.JS 项目后，访问 http://localhost:3000/about。

页面会显示：**关于我们**

7\.

组件组合：布局组件

💡

// components/Layout.tsx import React from 'react'; type LayoutProps = { children: React.ReactNode; // 接收子组件 }; // 创建一个布局组件 const Layout: React.FC＜LayoutProps＞ = ({ children }) =＞ { return ( ＜div＞ ＜header＞网站头部＜/header＞ ＜main＞{children}＜/main＞ ＜footer＞网站底部＜/footer＞ ＜/div＞ ); }; export default Layout;

**解释：**

LayoutProps：定义 Props 的类型，children 是 React 内置的属性，用于嵌套其他组件。

{children}：表示组件中嵌套的内容。

＜header＞ 和 ＜footer＞：布局的固定部分，类似网页的导航栏和页脚。

8\.

如何使用布局组件：

💡

// pages/index.tsx import Layout from '@/components/Layout'; export default function Home() { return ( ＜Layout＞ ＜h1＞欢迎来到我的网站！＜/h1＞ ＜/Layout＞ ); }

**解释：**

＜Layout＞：使用布局组件，将内容包裹在它的 children 中。

＜h1＞欢迎来到我的网站！＜/h1＞：这个内容会显示在 ＜main＞ 标签内。

页面显示：

网站头部 欢迎来到我的网站！ 网站底部

**中间件（Middleware）**

💡

比喻：门卫/安检

在访客进入建筑前进行身份检查、引导方向

可以决定是放行、拒绝还是引导到其他地方

中间件是在页面或 API 路由被访问之前执行的代码。可以用来处理认证、重定向、日志记录等。

中间件在服务器端执行，在页面或 API 路由被处理前拦截请求，可以修改响应或执行其他操作。

// middleware.JS (放在项目根目录) export function middleware(request) { const currentUrl = new URL(request.url) // 检查用户是否已登录，否则重定向到登录页 if (currentUrl.pathname.startsWith('/dashboard') && !isAuthenticated()) { return NextResponse.redirect(new URL('/login', request.url)) } // 为请求添加自定义头部 const response = NextResponse.next() response.headers.set('x-custom-header', 'my-value') return response } // 配置中间件应用的路径 export const config = { matcher: \['/dashboard/:path\*', '/API/:path\*'\], }

**环境变量**

💡

比喻：私密保险箱

保存各种敏感信息的保险箱，里面存放钥匙、密码等

根据不同场合（开发、生产环境）使用不同的保险箱

环境变量用于存储配置信息，如 API 密钥、数据库连接字符串等。

\# .env.local 文件 DATABASE_URL=postgres://user:password@localhost:5432/mydb API_KEY=my-secret-API-key \# .env.development 文件 (开发环境变量) NEXT_PUBLIC_API_URL=http://localhost:3000/API \# .env.production 文件 (生产环境变量) NEXT_PUBLIC_API_URL=https://myapp.com/API

在代码中使用环境变量：

// 服务器端可以访问所有环境变量 console.log(process.env.DATABASE_URL) console.log(process.env.API_KEY) // 客户端只能访问NEXT_PUBLIC_开头的环境变量 console.log(process.env.NEXT_PUBLIC_API_URL)

**边缘运行时（Edge Runtime）**

💡

比喻：本地快递站点

不是从总部发货，而是从离客户最近的分站发货，送达更快

适合处理简单但需要快速响应的任务

边缘运行时是一个轻量级的 JavaScript 环境，在离用户最近的服务器上运行，提供更快的响应时间。

边缘运行时适合用于不需要完整 Node.JS 功能的简单 API，如地理位置检测、简单身份验证等。

// app/API/edge/route.JS export const runtime = 'edge' // 声明使用边缘运行时 export async function GET() { return new Response(JSON.stringify({ message: '这是边缘API' }), { headers: { 'content-type': 'application/JSon' }, }) }

**数据获取方法**

💡

比喻：不同的采购方式

直接使用 fetch：亲自去市场采购新鲜食材

缓存策略：有些食材可以批量购买并储存一段时间，有些则需要每天新鲜采购

SSG 和 SSR：有些菜可以提前做好（SSG），有些需要客人来了才现做（SSR）

Next.JS 提供了多种数据获取方式：

1\.

Server Components 中的数据获取：

// app/users/page.JS async function getUsers() { const res = await fetch('https://API.example.com/users') return res.JSon() } export default async function UsersPage() { const users = await getUsers() return ( ＜div＞ ＜h1＞用户列表＜/h1＞ ＜ul＞ {users.map(user =＞ ( ＜li key={user.id}＞{user.name}＜/li＞ ))} ＜/ul＞ ＜/div＞ ) }

2\.

客户端数据获取 （SWR 或 React Query）

'use client' import { useState, useEffect } from 'react' import useSWR from 'swr' const fetcher = (...args) =＞ fetch(...args).then(res =＞ res.JSon()) export default function ProfilePage() { const { data, error, isLoading } = useSWR('/API/profile', fetcher) if (isLoading) return ＜div＞加载中...＜/div＞ if (error) return ＜div＞加载失败＜/div＞ return ( ＜div＞ ＜h1＞{data.name}的个人资料＜/h1＞ ＜p＞邮箱: {data.email}＜/p＞ ＜/div＞ ) }

**渲染策略**

💡

比喻：餐厅供餐方式

静态生成：自助餐，提前做好所有菜品，客人来了直接取用（最快）

服务器端渲染：点菜后厨房现做，端上来就能吃（平衡新鲜和速度）

客户端渲染：送来食材和菜谱，客人自己在桌上烹饪（最灵活但初始加载慢）

增量静态再生成：自助餐定时更换新鲜菜品，保持食物新鲜但不用每位客人都等待

**Next.JS 支持多种渲染策略：**

![](images/07-nextjs/image61.webp)

1\.

静态生成 （Static Generation）

页面在构建时生成，适合内容不经常变化的页面。

// app/blog/\[slug\]/page.JS export async function generateStaticParams() { const posts = await getPosts() return posts.map((post) =＞ ({ slug: post.slug, })) } export default async function BlogPost({ params }) { const post = await getPostBySlug(params.slug) return ( ＜article＞ ＜h1＞{post.title}＜/h1＞ ＜div＞{post.content}＜/div＞ ＜/article＞ ) }

2\.

服务器端渲染 （Server-Side Rendering）

每次请求时在服务器上渲染页面。

// app/dashboard/page.JS export const dynamic = 'force-dynamic' // 强制SSR export default async function Dashboard() { const data = await fetch('https://API.example.com/dashboard', { cache: 'no-store' }) // 不缓存 const dashboardData = await data.JSon() return ( ＜div＞ ＜h1＞仪表盘＜/h1＞ ＜p＞当前时间: {new Date().toLocaleTimeString()}＜/p＞ {/\* 显示实时数据 \*/} ＜/div＞ ) }

3\.

增量静态再生成 （ISR）

静态页面可以在后台重新生成，兼顾性能和新鲜度。

// app/products/\[id\]/page.JS export default async function Product({ params }) { const product = await fetch(\`https://API.example.com/products/${params.id}\`, { next: { revalidate: 3600 } }) // 1小时后重新验证 const data = await product.JSon() return ( ＜div＞ ＜h1＞{data.name}＜/h1＞ ＜p＞价格: ${data.price}＜/p＞ ＜/div＞ ) }

**Streaming 与 Suspense**

💡

比喻：餐厅分批上菜

不用等所有菜都做好才开始吃，先上好的先吃

等慢菜时有临时的小吃垫垫肚子（加载状态）

![](images/07-nextjs/image62.webp)

Streaming 允许服务器组件逐步发送 UI 片段，而不是等待所有数据加载完成。结合 Suspense 可以实现更好的加载体验。

Streaming 和 Suspense 的主要优点是可以提高首次内容绘制（FCP）的速度，优先加载关键内容，同时为其他部分显示加载状态。

// app/dashboard/page.JS import { Suspense } from 'react' import UserProfile from './user-profile' import RecentActivity from './recent-activity' import RecommendedPosts from './recommended-posts' export default function Dashboard() { return ( ＜div＞ ＜h1＞控制面板＜/h1＞ {/\* 用户资料会立即加载 \*/} ＜UserProfile /＞ {/\* 活动记录会展示加载状态，然后在数据准备好时显示 \*/} ＜Suspense fallback={＜div＞加载活动记录中...＜/div＞}＞ ＜RecentActivity /＞ ＜/Suspense＞ {/\* 推荐文章会在最后加载，但不会阻塞页面其他部分 \*/} ＜Suspense fallback={＜div＞加载推荐中...＜/div＞}＞ ＜RecommendedPosts /＞ ＜/Suspense＞ ＜/div＞ ) }

**动态导入（Dynamic Imports）**

💡

比喻：按需购买家具

搬进新家时，不是一次买齐所有家具，而是住进去后根据需要逐渐添置

减轻初始负担，提高启动速度

动态导入允许代码分割，只在需要时加载特定组件，提高应用性能。

动态导入的好处：

减小初始包体积

按需加载组件

可以结合 Suspense 实现更好的加载体验

// app/page.JS import { Suspense } from 'react' import dynamic from 'next/dynamic' // 动态导入重量级组件 const HeavyChart = dynamic(() =＞ import('../components/heavy-chart'), { loading: () =＞ ＜p＞加载图表中...＜/p＞, ssr: false // 仅客户端渲染，不在服务器端渲染 }) // 动态导入普通组件 const Comments = dynamic(() =＞ import('../components/comments')) export default function HomePage() { return ( ＜div＞ ＜h1＞首页＜/h1＞ ＜p＞这部分内容会立即加载＜/p＞ ＜Suspense fallback={＜div＞加载评论中...＜/div＞}＞ ＜Comments /＞ ＜/Suspense＞ ＜Suspense fallback={＜div＞加载图表中...＜/div＞}＞ ＜HeavyChart /＞ ＜/Suspense＞ ＜/div＞ ) }

**Next.JS 概念之间的关系**

![](images/07-nextjs/image63.webp)

**数据流动关系**

![](images/07-nextjs/image64.webp)

**  
性能优化关系（快递比喻）**

![](images/07-nextjs/image65.webp)

**Next.JS 核心思想总结**

![](images/07-nextjs/image66.webp)

所有这些概念就像齿轮一样彼此啮合，共同驱动一个快速、灵活且开发友好的 web 应用。无论你是构建简单博客还是复杂电商网站，这些概念都以不同方式组合，解决各种实际问题。

**（附）学习资源**

Next.JS 官方文档

Next.JS 学习课程

Vercel 示例库

**7.2 实战项目**

**7.2.1 入门项目**

尝试基于本课程进阶篇中的的 starter 框架，开发一个自己的产品

**7.2.2 项目升级：结业产品**

在整体学习完课程后，可将课程的知识（产品 idea、如何做成功的网站等）融入，开发一个成熟的结业产品

**7.3 常见疑问**

问题

答案

期待你的提问，可在此直接评论

![](images/07-nextjs/image1.webp)
