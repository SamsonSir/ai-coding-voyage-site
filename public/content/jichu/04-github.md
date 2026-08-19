---
title: "如何使用 GitHub 管理源代码？"
category: jichu
order: 4
summary: "GitHub 入门：用版本控制管理代码，告别改崩无法回退"
---

**四、如何使用 GitHub 管理源代码？**

**视频**

第四课·如何用Github管理源代码.mp4【在线播放】

![](images/media/04-github-image1.webp)

**4.1 什么是 GitHub？为什么要用它？**

GitHub 是全世界最大的开源社区。如果你想找一个开源软件，请先到 GitHub 找。

💡

当你能够熟练的使用 GitHub，你就离成为合格的程序员近了一大步！请千万不要错过！

此外，我们还需要它……

![](images/media/04-github-image2.webp)

想象一下，你和朋友一起写一个故事，但你们住在不同的地方。你们可能会遇到这些问题：

谁改了哪些部分？

两个人同时修改了同一段怎么办？

我今天突然对上周我写作的所有内容不满意，想要回滚到上周一的那一版，怎么办？

GitHub 就是为解决这些问题而生的，只不过它是为代码设计的（当然，也可以用于管理其他文件，我了解到也有人用 GitHub 来管理写书的）。

简单来说，GitHub 有这些作用：

**保存所有历史版本**：就像游戏的存档点，随时可以回到过去的任何一个版本

**备份代码**：代码保存在云端，电脑坏了也不怕

**多人协作**：多人可以同时修改，然后合并各自的修改

**4.2 GitHub 基础概念**

![](images/media/04-github-image3.webp)

在开始实际操作前，我们先了解几个基本概念。别担心，我会用生活中的例子来解释：

**仓库（Repository）**：就像一个特殊的文件夹，里面包含了你的项目文件和所有的修改历史。

生活例子：想象它是一个魔法相册，不仅保存了最新的照片，还记录了每张照片所有的修改过程。

**提交（Commit）**：相当于保存一个新的版本，并添加说明。

生活例子：就像在写日记，"今天我修改了第三段的错别字，并添加了一个新角色"。

**分支（Branch）**：同一个项目的不同版本线。

生活例子：想象你在写一本书，不确定结局应该是大团圆还是悲剧，所以你复制了一份手稿，在两个版本上分别尝试不同的结局。

**拉取请求（Pull Request）**：请求把你的修改合并到主项目中。

生活例子：你在朋友的食谱上做了改进，然后问："嘿，我加了点香料，你要不要也加到你的食谱中？"

**克隆（Clone）**：复制一份仓库到你的电脑上。

生活例子：借一本书回家，你可以在家里看和做笔记，之后再把你的笔记分享给大家。

**推送（Push）**：把你本地的修改上传到 GitHub。

生活例子：把你修改后的食谱发给所有的朋友。

**拉取（Pull）**：从 GitHub 上下载最新的修改。

生活例子：从群聊中获取朋友们最新分享的照片。

**4.3 账号设置与第一步**

1.

打开 GitHub 官网

2.

点击右上角的"Sign up"（注册）

![](images/media/04-github-image4.webp)

3.

填写用户名、邮箱和密码

4.

验证你不是机器人（通常是选择图片或者输入验证码）

5.

选择免费计划（Free）

6.

完成一些简单的兴趣调查（可跳过）

7.

验证你的邮箱（GitHub 会发送一封验证邮件）

8.

设置个人资料

![](images/media/04-github-image5.webp)

![](images/media/04-github-image6.webp)

登录后，点击右上角的头像，选择"Your profile"（你的个人资料），然后点击"Edit profile"（编辑资料）。这里你可以：

上传头像

添加个人简介

设置你的位置、个人网站等

**4.4 GitHub Desktop：小白使用 GitHub 的救星**

虽然很多教程会教你使用命令行来操作 Git，但对于初学者来说，这可能会很困难。别担心，GitHub Desktop 就是为我们这样的人准备的！

1.

下载和安装 GitHub Desktop

2.

访问 GitHub Desktop 官网

3.

下载适合你操作系统的版本（Windows/Mac）

![](images/media/04-github-image7.webp)

![](images/media/04-github-image8.webp)

4.

安装程序

5.

打开 GitHub Desktop，用你的 GitHub 账号登录

6.

GitHub Desktop 界面介绍

7.

用 GitHub Desktop 打开 github.com 上的代码（自己的或者别人的）

**4.5 在 Cursor 里使用 GitHub**

1.

在 Cursor 里登录 GitHub 账号

2.

用 Cursor 打开你之前的项目

3.

初始化仓库 （Initialize Repository）

![](images/media/04-github-image9.webp)

![](images/media/04-github-image10.webp)

4.

提交更改

![](images/media/04-github-image11.webp)

![](images/media/04-github-image12.webp)

5.

发布仓库 （Publish to GitHub）

![](images/media/04-github-image12.webp)

![](images/media/04-github-image13.webp)

a、可以选择 private 和 public

b、也可以用 GitHub Desktop 提交

打开 GitHub Desktop

![](images/media/04-github-image14.webp)

打开项目所在的文件夹

![](images/media/04-github-image15.webp)

拖拽文件夹到 GitHub Desktop

![](images/media/04-github-image16.webp)

点击 publish

![](images/media/04-github-image17.webp)

上传完成

![](images/media/04-github-image18.webp)

6.

上传仓库后，再次提交修改

修改内容自动出现

![](images/media/04-github-image19.webp)

点击后查看修改的前后变化

![](images/media/04-github-image20.webp)

Cursor 生成合适的修改描述

![](images/media/04-github-image21.webp)

点击提交

![](images/media/04-github-image22.webp)

提交记录出现

![](images/media/04-github-image23.webp)

也可以使用 GitHub Desktop 提交

![](images/media/04-github-image24.webp)

7.

项目进度回滚

在 GitHub desktop 中回滚

![](images/media/04-github-image25.webp)

由于回滚本身属于修改，需要提交

![](images/media/04-github-image26.webp)

修改完成

![](images/media/04-github-image27.webp)

**4.7 GitHub 界面介绍**

💡

为了让你在本环节充分彻底的掌握 GitHub，让我们来学习 GitHub 的整个界面操作

Git 和 GitHub

我们先来了解一下 Git 和 GitHub 是什么，有什么功能

先说结论，Git 和 GitHub 是两个东西，Git 是一个软件/工具/系统，GitHub 是一个网站/平台，GitHub 这个网站使用了 Git 这个工具。

Git 是一个分布式版本控制系统。

版本控制系统（version control system）像个数据库，它会记录所有对项目文件的更改（比如一个文件，前天加了三段文字，昨天删了一句话，今天改了几个词，这三个版本历史都能保存下来）。 版本控制系统不仅可以应用于软件源代码的文本文件，而且可以对任何类型的文件进行版本控制。 使用版本控制系统可以协同合作（多人编辑文件或代码而不出错），版本存储（你改动的每一版本都保存下来，如果改错可以回到之前的版本，如果想加上删除的内容也可以返回去找，也可以对比现在和之前的版本，看改了什么），文件备份（服务器和本地都有完整的历史版本，如果服务器坏了，本地还有一份完整的历史记录）。

总之， Git 可以避免文件丢失，改错，多人合作不同步导致的后果 。

GitHub 是通过 Git 进行版本控制的软件源代码托管服务平台，可以理解成放代码的地方，但往上放代码时用 Git 进行了版本控制。也就是 GitHub 使用了 Git 完成版本控制，下面来看看 GitHub 有哪些有用的功能！

代码托管：可以单纯地把它当成一个网盘放你的代码，同时使用 Git 功能记录你的代码历史。当然除代码外还能放其他文件。 学习优秀的开源项目：学习别人优秀的源码，写代码之前看别人是怎么写的（比如写作业的时候参考参考），看论文也可以上 GitHub 找源代码，还能找一些开源的软件，插件用。 当资料库：可以查资料，GitHub 上有总结好的面试宝典，入门指南，技术分析，论文合集，课程资料等。这些博客、公众号上有的内容 GitHub 上也有，还可能更全。 多人协作：多个人要一起写个程序，一起写本书，一起翻译一篇文章等，用 GitHub 可以管理项目保证你们的文件同步，写好后提交合并成一个完整的项目。 搭建博客：基于 GitHub Pages 搭建属于你的博客，你可以随心所欲的定制自己的样式，这是一个属于你的空间。 社交：就像微博、知乎一样，在这个网站你可以关注（following）别人，也可以有自己的粉丝（followers），看到好的开源项目可以给他点赞（star），你有啥想法还可以给这个项目改进改进（fork）。 个人简历：如果你的 GitHub 上有不错的项目，或者你改进过别人的项目，这些都能反映到你的账号上。GitHub 一定程度可以反反映你的能力，如果你的项目点赞多（star），还有很多粉丝关注（followers），你就像个大 V 一样，这就是你的另一份简历。 写作：Gitbook 可以写电子书。 GitHub 能做的还远不止这些，等待你的探索发现！

另外，GitHub 不用翻墙，有网就能打开，可能比国内网站反应慢些，这是正常现象；虽然网站都是英语，但模块不是很多，跟着下面的教程就能学会，用几次就会了；网站有很多中国用户，所以你可以搜到很多中文资源，不用担心语言问题 ～

总结：无论你是不是程序员，你都可以用 GitHub。你可以把它当个网盘存包括代码的文件，可以和团队一起做个项目（文件啥的就不用保存一堆迭代版本啦），可以找资源（里面有很多宝藏资源），可以建个博客，也可以像在微博、知乎、博客一样，分享你的东西。

**注册**

打开这个网址 https://github.com/，如果没有登陆的话，就会看到下面的主界面。

首先，Sign in 用来登陆，Sign up 用来注册账号。

![](images/media/04-github-image28.webp)

现在还没账号，可以直接在上面的页面注册，也可以点击 Sign up 到下面这个页面（其实注册内容都一样，注册网址：https://github.com/signup）。

![](images/media/04-github-image29.webp)

输入上面的信息后，按照流程完成注册即可。

如果需要验证邮箱（verify your email address），就打开刚刚写的邮箱，打开收到的邮件，点击 verify email address 即可。

注册成功你会进入 GitHub 主页面。

**登录**

当你有账号后，你就可以登陆啦。

登陆是点击上面任意页面的 Sign in 按钮，进入下面这个界面（登录网址：https://github.com/login）。

输入用户名或邮箱，密码，点击 Sign in 或者回车即可。

![](images/media/04-github-image30.webp)

登录成功你也会进入 GitHub 主页面。

**主界面**

登录状态下，网站主界面如下：

![](images/media/04-github-image31.webp)

**首先我们来看页面最上方的灰色条**

1.最左侧为导航栏

![](images/media/04-github-image32.webp)

2.点击后展开目录清单

![](images/media/04-github-image33.webp)

目录展开的按钮，我们会用到的功能如下：

**Home** ：进入你的 GitHub 主页，查看动态、推荐项目、关注人的更新等。

**Projects** ：项目管理工具。可以用看板（类似 Trello）方式管理任务、进度和优先级，适合团队协作。

**Repositories 区域** ：显示你常用或最近访问的代码仓库（项目），点击可以快速进入对应项目。

3.左边是 GitHub 的 logo，点它就返回现在这个主界面

![](images/media/04-github-image34.webp)

4.搜索框，和搜索引擎一样用来搜索（搜源码，搜资料）

![](images/media/04-github-image35.webp)

5.GitHub 的对话 ai 助手

![](images/media/04-github-image36.webp)

6.新建，初期常用的是新建仓库 **New repository**

![](images/media/04-github-image37.webp)

**  
再来看看下面的一大块**

左边是你的项目

![](images/media/04-github-image38.webp)

Repository：翻译为仓库，也是你的项目。

你可以理解成一个大的文件夹，或者笔记本。一个项目对应一个 Repository。

中间是 Home 和 Feed 功能，用于帮助你快速了解项目动态、获取学习资源

![](images/media/04-github-image39.webp)

Home 是你的个人工作台，聚合常用入口和学习资源，提升效率。

Feed 是你的信息流，帮你追踪社区动态、发现新项目，保持技术敏感度。

右侧的“Latest changes”和“Explore repositories”用来了解发现优质开源项目

![](images/media/04-github-image40.webp)

Latest changes（最新变化） ：可以第一时间看到 GitHub 推出的新特性、修复的 bug、重要的安全提示等

Explore repositories（探索仓库） ：这里会推荐一些优质、热门或与你兴趣相关的开源项目（Repository）

**个人界面**

右上角那个头像就是个人

1.点击个人头像，展开个人目录

![](images/media/04-github-image41.webp)

2.个人目录详情

![](images/media/04-github-image42.webp)

目录展开后，我们会用到的功能

**Your profile：**查看和编辑你的 GitHub 个人主页，包括头像、简介、项目展示等。

**Your repositories：**快速访问你拥有或参与的所有代码仓库（项目）。

**Your projects：**查看和管理你创建或参与的项目管理面板（Project），用于任务规划和进度跟踪。

**Your stars：**查看你“收藏”过的项目（Starred repositories），方便以后快速找到感兴趣的开源项目。

**Your organizations：**查看你加入的所有组织（Organization），适合团队或公司统一管理多个项目和成员。

**GitHub 官方支持区域**

**Settings：**进入个人设置页面，管理账号信息、安全、通知、API 密钥等。

**Sign out：**退出当前 GitHub 账号，安全登出。

在这里详细展示下我们的常用功能

3.点击 your profile

![](images/media/04-github-image43.webp)

4.可以查看个人在 GitHub 中活动的详细信息

![](images/media/04-github-image44.webp)

5.点击 repositories

![](images/media/04-github-image45.webp)

6.查看个人在 GitHub 上已经创建的仓库

![](images/media/04-github-image46.webp)

7.点击 setting

![](images/media/04-github-image47.webp)

8.进入设置界面，GitHub 的通用型设置在此完成

![](images/media/04-github-image48.webp)

9.点击 GitHub community

![](images/media/04-github-image49.webp)

10.浏览开源项目，查找自己需要的项目

![](images/media/04-github-image50.webp)

**项目界面**

下面我们看看项目界面。

我们使用 GitHub ，无论存放东西，还是查资料，主要都是看自己或别人的项目/仓库，所以这个界面一定要熟悉。

你可以通过搜索项目、点击别人的界面、推荐页面打开一个项目。

我们以 Python 为例介绍界面，你可以在搜索框输入 Python 搜索，选择第一个项目，看点赞数就知道它是最欢迎的一个。

![](images/media/04-github-image51.webp)

点进去就是项目/仓库界面啦，我们认识一下主要功能

首先项目标题的一条我们可以看到这个仓库的信息，像关注点赞都是按钮，点击可以看具体的人。

![](images/media/04-github-image52.webp)

这里涉及到两个新词语。

Watch：关注观察 ，也就是你既可以关注（follow）一个人，也可以关注（watch）一个项目，你关注内容的动态都会显示在主页面。

Fork：直译是刀叉，它是指将 GitHub 的某个特定仓库（所有文件）原封不动地复制到自己的账户下。比如你想改进这个项目，加点儿自己的东西，就可以复制一下整个仓库再修改，但是不影响原作者的仓库，你点击 Fork 就能复制。

最上方是标签页，比如默认的一个标签页 Code 就是展示代码的页面；如果你想看别人提的问题就点击 Issues 页，也许你遇到的问题别人提过并且解决了；有的人想参与这个项目，他改好后就向作者发起了 Pull Requests，希望作者接受他的改进，点进去可以看谁提交过什么样的改进，作者是否采纳。

![](images/media/04-github-image53.webp)

下面这个主要部分就是仓库里的东西了，你可以看到就是一个个文件夹或文件，里面可能是代码文件，也可能是其他文档，图片什么的。

![](images/media/04-github-image54.webp)

点击可以看，你也可以点击 Clone or downloads 下载到本地，具体学习。

![](images/media/04-github-image55.webp)

滑到最下面，可以看到一个叫 README.md 的一段文字，仔细看，它就是仓库里的一个文件，只不过展示出来了。它就像产品说明书，或者是一个介绍页，告诉你这个仓库的有关信息，让你对仓库有了简单的了解。

![](images/media/04-github-image56.webp)

以后你要建个仓库（Repository），为了方便别人了解，也要写这样的文件。

💡

总结：这一部分我们学会了注册登录，认识了主要界面，知道了怎么查找需要的资料，相信到这里，你已经可以认识到它的搜索功能了。

**4.7 常见问题**

使用 GitHub 的过程中，你可能会遇到一些问题。别担心，这很正常！这里是一些常见问题和解决方法：

1、推送被拒绝

**问题**： 你尝试推送更改，但 GitHub 拒绝了。

**解决方法**： 这通常是因为 GitHub 上有你本地没有的更改。先执行"拉取"操作，然后再尝试推送。

2、合并冲突

**问题**： 拉取时，GitHub 说有"合并冲突"。

**解决方法**： 这意味着同一个文件的同一部分被不同人修改了。在 GitHub Desktop 中，你会看到冲突的文件。打开这些文件，你会看到冲突的部分被特殊标记。编辑文件以保留你想要的内容，然后提交这个合并。

3、忘记了提交某些文件

**问题**： 你已经推送了，但发现忘记添加某些文件。

**解决方法**： 没关系！添加这些文件，进行新的提交，然后再次推送。

4、想撤销最后一次提交

**问题**： 你提交了错误的内容，想要撤销。

**解决方法**： 在 GitHub Desktop 中，点击"历史"标签，右键点击最近的提交，选择"Revert changes in commit"（撤销提交中的更改）。

**4.8 课后作业**

请把自己前几课的产品的源代码，使用 GitHub 管理起来。

练习 GitHub 教程中的实操教程

![](images/media/04-github-image1.webp)
