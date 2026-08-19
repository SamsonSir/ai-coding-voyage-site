---
title: "如何正式发布你的网站产品？"
category: jichu
order: 5
summary: "用 Vercel 一键部署网站并绑定自己的域名，提交代码即上线"
---

**五、如何正式发布你的网站产品？**

**视频**

![](images/media/05-deploy-image1.webp)

**5.1 在本课中，我们将会完成什么任务？**

💡

任务：

1.

注册一个心仪的域名，用户访问域名就可以看到你的产品！

2.

在 Cursor 里提交代码更改，立即上线最新版本！

**5.2 认识 Vercel 平台**

![](images/media/05-deploy-image2.webp)

**Vercel 是什么？**

Vercel 是一个面向开发者的云平台，它让网站和应用的发布变得异常简单。想象一下，Vercel 就像是一个特殊的"网站管家"，它帮你把你制作的网站放到互联网上，让全世界的人都能看到。

**为什么新手适合使用 Vercel？**

**简单易用**：不需要复杂的服务器知识，几分钟内就能完成发布

**免费起步**：个人项目可以使用免费计划，不需要一开始就付费

**自动化流程**：当你更新代码后，网站会自动更新，不需要手动操作

**直观界面**：清晰的仪表盘和操作界面，让新手也能轻松理解

**详细教程**：有大量的中文教程和文档可以参考

官方文档：https://vercel.com/docs/production-checklist

**Vercel 能为我们解决什么问题？**

作为初学者，你可能不知道如何管理服务器、配置网络或处理安全问题。Vercel 把这些复杂的技术问题都帮你解决了，你只需要专注于做出好看、实用的网站内容。

**Vercel 与 NextJS 的完美配合**

**Vercel 是 NextJS 的创建公司**，这意味着它对 NextJS 有着最佳的支持。当你使用 Vercel 部署 NextJS 项目时，你会获得：

自动优化的性能

内置的 CDN 加速（让你的网站在世界各地都能快速加载）

零配置部署（不需要任何额外设置）

自动的预览环境（可以提前看到更改效果）

无缝的 API 支持

对于我们这些初学者来说，这种无缝集成意味着我们可以专注于学习和创建，而不是被复杂的部署问题困扰。

**5.3 使用 Vercel 发布你的网站**

vercel 部署新项目，请看视频演示。

打开 vercel

![](images/media/05-deploy-image3.webp)

创建新的项目

![](images/media/05-deploy-image4.webp)

选择 GitHub 账号

![](images/media/05-deploy-image5.webp)

选择部署的项目，点击 import

![](images/media/05-deploy-image6.webp)

点击部署（如有环境变量需要填写）

![](images/media/05-deploy-image7.webp)

部署成功

![](images/media/05-deploy-image8.webp)

项目发生变动，自动部署更改

提交代码修改

![](images/media/05-deploy-image8.webp)

Vercel 自动部署

![](images/media/05-deploy-image9.webp)

💡

Tips： 在提交代码到 GitHub 之前，请你先在本机运行 **npm run build**，确保代码编译不会出错，再提交。这是一个好习惯。

![](images/media/05-deploy-image10.webp)

注册 Vercel 账号 ，建议用 GitHub 账号直接登录

连接你的 GitHub 账号

导入你的项目（选择正确的仓库）

项目设置与部署

查看你的网站上线了！

自动部署机制

特别注意：

在 Vercel 管理后台，配置你的环境变量 （比如 API KEY）

在 Vercel 管理后台，也可以手动点击部署（Deploy）或重新部署（Redeploy）

可以使用 Cursor，告诉它你需要每次提交代码能自动部署到 Vercel，Cursor 会帮你完成

Tips

1.

在提交代码之前，可以在 Cursor 本地 Terminal 里执行 npm run build， 提前查看可能的编译问题。

**5.4 让你的网站有个好记的地址：域名**

![](images/media/05-deploy-image11.webp)

**域名是什么？**

域名就像是你网站在互联网上的"门牌号码"。想象一下，如果互联网是一座巨大的城市，那么每个网站就是这座城市里的一栋建筑，而域名就是这栋建筑的地址。当人们想要访问你的网站时，他们只需要在浏览器中输入这个域名，就能直接找到你。

例如，你可能经常使用的网站域名有：

baidu.com（百度）

taobao.com（淘宝）

bilibili.com（哔哩哔哩）

没有域名，人们就需要记住复杂的 IP 地址（如193.168.1.1）才能访问你的网站，这显然不够友好和专业。

**域名的组成部分**

一个完整的域名通常包含几个部分，以shop.example.com为例：

**顶级域名（TLD，Top-Level Domain）**：最右侧的部分，如.com、.org、.cn等

**二级域名（Second-Level Domain，SLD）、主域名**：中间部分，如example 你注册购买的域名，从学术意义上讲叫做二级域名。我们一般也称为“主域名”。 在中文世界大家日常使用里，常常把“主域名”称为“顶级域名”，其实是不正确的。不过大家已经习惯这么说了，不影响日常交流。为了避免歧义，我主张讲它称为“主域名”

**三级域名（Subdomain）、子域名**：最左侧的部分，如shop 也有人习惯将"www"这个子域名，当成主域名来用。得到类似于**www**.example.com 的效果。

不同的顶级域名有不同的含义和用途：

.com：最常见，适合各类商业网站

.org：通常用于非营利组织

.edu：教育机构专用

.gov：政府部门专用

.cn、.jp：国家或地区专用

.io、.dev：.ai常被技术类网站使用

.shop、.store：适合电商网站

**如何选择适合自己的域名？**

选择一个好域名就像给你的网站起一个好名字，应该考虑以下因素：

1.

简短易记：越短的域名越容易被记住，如apple.com比applecomputersinc.com更好

2.

相关性：与你的网站内容、品牌或名字相关

3.

易于拼写：避免使用容易拼错的单词或太长的组合

4.

避免歧义：注意域名的不同解读方式（例如expertsexchange.com可能会被误读）

5.

考虑关键词：包含相关关键词有助于搜索引擎优化

6.

考虑长期使用：选择一个你能长期使用的域名，避免频繁更换

对于初学者项目，如果你的理想域名已被注册，可以考虑：

使用不同的顶级域名（如.net、.io、.dev代替.com）

添加前缀或后缀（如my-、get-、-app）

使用相近的同义词

记住，一个好的域名应该是你网站身份的延伸，能够帮助用户记住并找到你。

**5.5 如何脑暴和购买域名**

![](images/media/05-deploy-image12.webp)

**使用域名搜索工具查询可用域名**

在购买域名之前，你需要先确认你心仪的域名是否已被他人注册。互联网上的域名是独一无二的，就像每个人的身份证号码一样，不可能有两个完全相同的。

**推荐工具：**Instant Domain Search

这个工具的优势在于：

**即时反馈**：当你输入时就能立即看到结果，不需要等待

**替代建议**：如果你想要的域名已被注册，它会推荐类似的可用域名

**多种顶级域名**：可以同时查看多种后缀（如。com、.net、.org 等）的可用性

**价格估算**：显示不同域名的预估价格

**如何使用域名搜索工具：**

1.

打开 Instant Domain Search 网站

2.

在搜索框中输入你想要的域名（不需要输入。com 等后缀）

3.

系统会立即显示该域名在各种后缀下的可用状态

4.

绿色表示可注册，红色表示已被注册

5.

浏览推荐的替代域名，可能会有更好的选择

**从哪里购买域名**

找到心仪且可用的域名后，你需要选择一个域名注册商进行购买。域名注册商是经过授权可以销售和管理域名的公司。

**推荐平台：**Namecheap

Namecheap 的优势：

**价格实惠**：相比其他大型注册商，价格通常更便宜

**免费隐私保护**：提供免费的 WhoisGuard 服务，保护你的个人信息

**简单易用**：操作界面友好，适合新手

**客户支持**：提供 24/7 的客服支持

**自动续费选项**：可设置自动续费，避免域名过期

**其他常见域名注册平台：**

![](images/media/05-deploy-image13.webp)

**域名价格与注意事项：**

常见域名（如。com）首年价格通常在 60-100 元人民币

注意查看**续费价格**，有些平台首年优惠但续费较贵

大多数域名需要按年付费，可以选择一次性购买多年

部分特殊域名（如。io、.app）价格会更高

查看是否包含隐私保护服务，保护你的个人信息不被公开

**域名注册步骤演示（以 Namecheap 为例）**

1.

准备工作：

准备一个可用的电子邮箱

准备支付方式（信用卡或 PayPal）。如果信用卡和 Paypal 你都没有，你可以考虑用国内的其他域名注册平台（如阿里云万网）。不过我更建议你在海外平台注册域名。

确认你想注册的域名是可用的

2.

注册账号：

访问 Namecheap 官网

点击右上角的"Sign Up"创建账号

填写基本信息并验证电子邮箱

3.

搜索并选择域名：

在首页搜索框输入你想要的域名

浏览结果，查看可用域名及价格

点击"Add to Cart"将域名添加到购物车

4.

完成购买：

点击购物车图标，进入结算页面

选择购买年限（通常 1-5 年）

默认勾选 WhoisGuard（隐私保护）服务

填写联系信息（请使用真实信息）

选择支付方式并完成付款

5.

验证域名所有权：

付款成功后，你会收到验证邮件

按照邮件指引完成域名所有者联系信息验证

这一步很重要，否则域名可能会被暂停

6.

查看域名控制面板：

登录 Namecheap 账号，进入"Domain List"

这里可以管理你的域名设置、续费和 DNS 记录

恭喜你！完成以上步骤后，你就拥有了自己的域名。接下来我们将学习如何将这个域名连接到你的 Vercel 项目。

**5.6 将域名连接到你的网站**

请看视频

vercel 后台，setting- domain

![](images/media/05-deploy-image14.webp)

点击 add domain，输入购买的网址

![](images/media/05-deploy-image15.webp)

选择第二项

![](images/media/05-deploy-image16.webp)

打开 namacheap，在购买的域名界面点击 MANAGE

![](images/media/05-deploy-image17.webp)

更改 DNS 配置

![](images/media/05-deploy-image18.webp)

删除默认的内容

![](images/media/05-deploy-image19.webp)

返回 vercel，复制相关信息

![](images/media/05-deploy-image20.webp)

![](images/media/05-deploy-image21.webp)

回到 namacheap，进行填写

![](images/media/05-deploy-image22.webp)

点击保存，即可等待自动刷新

![](images/media/05-deploy-image23.webp)

在 Vercel 中添加自定义域名

设置 DNS 记录

验证域名所有权

**5.7 阶段梳理：Cursor-GitHub-vercel 产品上线一纸通**

**为什么要有这个章节？**

💡

你已经学过了 **Cursor 修改代码、GitHub 仓库管理、Vercel 发版管理**

接下来我们用一个章节来梳理全流程

**流程讲解**

**⭐️该流程涉及的 4 个核心工具**

**名称**：Cursor

**作用**：创建、编辑代码文件

**使用地址**：https://www.Cursor.com/

**名称**：GitHub

**作用**：代码仓库，存储你的代码

**使用地址**：https://github.com/

**名称**：GitHub Desktop

**作用**：辅助工具，便于代码在 Cursor 与 GitHub 间的传输

**使用地址**：https://desktop.github.com/

**名称**：Vercel

**作用**：部署工具，让用户点击网址看到你的产品

**使用地址**：<https://vercel.com/>

配合流程：

![](images/media/05-deploy-image24.webp)

💡

**流程看得太抽象？没关系，按照步骤全流程给你演示**

💡

当你在 GitHub 上，clone 了一个代码仓库/本地新建了一个代码项目

必要工具：GitHub desktop、Cursor、vercel、GitHub

前置条件：GitHub desktop、Cursor、GitHub 都已登录账号，且为同一个账号

**第一步 Cursor 打开代码文件，启动开发环境，确认代码可提交**

运行 npm run dev，确认效果

![](images/media/05-deploy-image25.webp)

运行 npm run build，确认代码正确

![](images/media/05-deploy-image26.webp)

问题处理

1.运行 npm run dev 失败怎么办

答：将报错信息发给 Cursor，让 Cursor 来修复/根据报错日志手动排查问题

技巧补充

1.在 Cursor 打开一个新代码项目时，让他阅读全部代码文件，了解项目背景

2.保持 Cursor 的一个对话窗口，只做一件事情

3.运行 npm run dev 的终端窗口，仅开启一个，当更改代码需要重新运行开发环境，在该终端先终止当前任务运行（快捷键 control+C），再重新运行 npm run dev，保持你的开发环境端口只有一个

4.安装中文扩展包，界面变为中文，有利于小白玩家上手

**第二步：初始化仓库**

点击初始化仓库

![](images/media/05-deploy-image27.webp)

描述提交内容，并提交

![](images/media/05-deploy-image28.webp)

点击【是】

![](images/media/05-deploy-image29.webp)

问题处理

1.没有初始化仓库按钮怎么办

答：在对话窗口和 Cursor 说，“要将当前项目上传到 GitHub 中，帮我执行操作”

2.提交代码，无法提交到 GitHub，一直在缓慢转圈

答：当你第一次打开 Cursor，需要将 Cursor 弹出的 8 位数验证码输入到 GitHub 中，点击提交后 Cursor 左下角会弹出附带 8 位数验证码的小弹窗，记住这个 8 位数验证码，输入到 GitHub 的验证码界面；如果完成了这一步，你的 Cursor 还是无法提交代码，则是由于网络原因。此时打开 GitHub desktop，将项目代码文件拖动到界面中，创建一个新仓库，再在 GitHub desktop 中点击代码提交

**第三步：向 GitHub 提交代码**

点击发布 branch

![](images/media/05-deploy-image30.webp)

选择个人可见版本

![](images/media/05-deploy-image31.webp)

弹出成功的弹窗

![](images/media/05-deploy-image32.webp)

💡

如果你第一次使用 Cursor 向 GitHub 提交代码，在此步的第二步后，在左下角会弹出验证的流程

需要记住左下角弹窗的 8 位数验证码，点击弹窗中的链接，会跳转到 GitHub 中，输入验证码即可顺利提交

此时你的代码已经成功提交到 GitHub 中

![](images/media/05-deploy-image33.webp)

**  
第四步：前往 vercel 部署项目**

点击部署

![](images/media/05-deploy-image34.webp)

如有调用了 API，需要填写环境变量

常见问题

1.为什么部署显示报错呢

答：首先要确保你的本地运行 npm run build 是成功的，接着检查你的环境变量、框选选择是否正确，如果检查都无误，根据报错日志定位问题，将报错日志发送给 Cursor

2.如果发生了代码提交，仓库变更，vercel 需要重新创建项目部署吗

答：不需要，vercel 自动拉取代码，自动重新部署

3.域名可以变更吗

答：可以的，详情参考基础篇 vercel 部分的视频讲解

使用技巧

1.在功能开发时，注意维护各个环境的 env 文件

💡

此刻项目就成功发布啦 https://answer-book-two.vercel.app/

**5.8 课后作业**

为你的产品注册一个域名，正式上线！

以正式域名的形式，向朋友展示你的作品！

![](images/media/05-deploy-image1.webp)
