---
title: 实战进阶(4-4)：Claude Code、MCP、Skills、产品迭代、开源生态 配套提示词
category: jinjie
order: 4.1
parent: 04-claude-code-mcp
summary: 配套提示词：Claude Code 实操、CLAUDE.md、Skills 与插件
---

本文是《实战进阶(4-4)：Claude Code、MCP、Skills、产品迭代、开源生态》的配套提示词与命令汇编，按直播实操顺序整理，可直接复制使用。

## 第 1 步：启动工具

```bash
$ cd /你的项目文件夹
$ claude
```

```text
┌────────────────────────────────────────┐
│  Claude Code (Sonnet 4.5)              │
│  Project: /Users/you/my-app            │
│  Context: 100% remaining               │
└────────────────────────────────────────┘

> _  ← 光标在这里,等你说话
```

## 和 Claude Code 说话的正确姿势

```text
❌ 错误: > create component navbar
   (这是传统命令思维)

✅ 正确: > 帮我在我的网页上创建一个导航栏组件,要响应式设计，无论是手机屏幕看还是电脑屏幕看，都很协调。导航栏包括：首页、价格页、博客、关于我们和登录
   (像和人类程序员说话一样)
```

## 它的工作过程

```text
⏺ 好的,我会创建一个响应式导航栏组件。
⏺ 我会创建以下文件:
   - src/components/Navbar.jsx (组件)
   - src/components/Navbar.css (样式)
⏺ 准备开始...

📝 Create(src/components/Navbar.jsx)
   [实时显示正在写入的代码...]
✅ File created

📝 Create(src/components/Navbar.css)
   [实时显示CSS代码...]
✅ File created

📝 Edit(src/App.js)
   [自动在App.js里引入Navbar组件]
❓ Can I edit src/App.js? [Press Enter to approve]
```

## 第 5 步：持续迭代（这才是精髓！）

```text
> 导航栏创建好了,现在帮我:
  1. 添加一个搜索框
  2. 把logo放在左边
  3. 用户头像放在右边

⏺ 收到,我来修改...
📝 Edit(src/components/Navbar.jsx)
...

> 搜索框的图标能换成放大镜吗?

⏺ 当然,我来调整...

> 完美!现在运行一下看看效果

⏺ 好的,我来启动开发服务器
🔧 Bash(npm run dev)
✅ Server running on http://localhost:3000
```

## 压缩对话历史

```text
> /compact

# 或者指定保留什么内容
> /compact 保留当前的认证实现和数据库设计决策
```

## 生成的 CLAUDE.md 示例

```markdown
# 项目概述
这是一个React + TypeScript的个人财务追踪应用

# 技术栈
- 前端: React 18, TypeScript, Tailwind CSS
- 后端: Node.js, Express
- 数据库: PostgreSQL

# 常用命令
- 启动开发服务器: npm run dev
- 运行测试: npm test
- 构建生产版本: npm run build
```

## MCP Server 状态

```text
显示内容:
⎿ MCP Server Status ⎿
⎿ • github: connected      ⎿
⎿ • puppeteer: connected   ⎿
⎿ • database: disconnected ⎿
```

## 克隆配套教材仓库

```bash
git clone https://github.com/luongnv89/claude-howto.git
cd claude-howto
```

```text
请用中文概括这个仓库的作用、目录结构、10个模块和推荐学习顺序
```

## 自定义斜杠命令

```bash
cd '/你的项目路径'

mkdir -p .claude/commands
（在当前项目里创建 Claude Code 的自定义命令目录）

cp ~/claude-howto/01-slash-commands/optimize.md .claude/commands/
（把教材仓库里现成的 optimize.md 文件，复制到你项目的命令文件夹里。）

find ~/claude-howto/01-slash-commands -name '*.md' ! -name 'README.md' -exec cp {} .claude/commands/ \;
```

## 提示词：为当前项目生成 CLAUDE.md

```text
请基于本地claude-howto仓库中的 memory 模板，为当前项目迁移并生成项目根目录的 CLAUDE.md。

要求你必须先读取这个模板文件：
~/claude-howto/02-memory/project-CLAUDE.md

然后再读取并理解当前项目的 README、package.json、src 目录结构以及你认为必要的关键文件。

任务目标：
1. 以 ~/claude-howto/02-memory/project-CLAUDE.md 的结构和写法风格为基础
2. 不要机械照抄模板内容
3. 必须根据当前项目的真实情况，重写成"这个项目专属"的 CLAUDE.md
4. 直接在当前项目根目录创建或更新 CLAUDE.md
5. 如果已有内容，优先合并，不要粗暴覆盖

CLAUDE.md 至少要包含这些部分：
- 项目简介：这个项目是做什么的
- 技术栈：框架、语言、UI、数据库、认证、部署等
- 核心目录结构：哪些目录最重要，各自负责什么
- 常用命令：安装、开发、构建、检查、测试等
- 开发规范：你建议 Claude 在这个项目中如何工作
- 修改代码时的注意事项：哪些地方要谨慎，哪些文件先读
- 输出风格要求：以后 Claude 在这个项目里回答和改代码时应遵守什么规则

额外要求：
- 内容必须贴合当前项目，不要写空泛模板话术
- 对不确定的内容要明确标注"待确认"，不要编造
- 尽量写得适合长期复用，像团队项目说明书
- 生成完成后，先告诉我：
  1. 你参考了模板仓库中的哪些结构
  2. 你根据当前项目补充了哪些专属信息
  3. CLAUDE.md 已经写到了什么位置

现在开始执行：先读取模板，再分析当前项目，最后创建或更新根目录 CLAUDE.md。
```

## 安装 Skills

```bash
mkdir -p ~/.claude/skills
cp -r ~/claude-howto/03-skills/code-review ~/.claude/skills/code-review-specialist

ls ~/.claude/skills/code-review-specialist/SKILL.md
```

## 配置 Hooks

```bash
mkdir -p ~/.claude/hooks
cp ~/claude-howto/06-hooks/pre-tool-check.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/pre-tool-check.sh
```

```bash
cat > ~/.claude/settings.json << 'EOF'
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/pre-tool-check.sh"
          }
        ]
      }
    ]
  }
}
EOF

cat ~/.claude/settings.json

cat .claude/hooks/audit.log
```

## 配置 GitHub MCP

```bash
export GITHUB_TOKEN="你的新token"

claude mcp add --transport stdio --scope user github -- npx -y @modelcontextprotocol/server-github
```

## 配置子代理（Subagents）

```bash
mkdir -p .claude/agents
cp "/你的claude-howto本地路径/04-subagents/code-reviewer.md" .claude/agents/
```

```bash
claude --permission-mode plan
```

## 插件（Plugins）结构示例

```text
pr-review/
├── .claude-plugin/
│   └── plugin.json         ← 插件清单（名称、版本、描述）
├── commands/               ← 3个斜杠命令
│   ├── review-pr.md            /review-pr 综合审查
│   ├── check-security.md       /check-security 安全检查
│   └── check-tests.md          /check-tests 测试覆盖率
├── agents/                 ← 3个子代理
│   ├── security-reviewer.md    安全漏洞检测
│   ├── test-checker.md         测试分析
│   └── performance-analyzer.md 性能评估
├── hooks/                  ← 1个钩子
│   └── pre-review.js           审查前自动检查是否是 git 仓库
└── mcp/                    ← 1个 MCP 配置
    └── github-config.json      连接 GitHub 拉取 PR 数据
```

## 插件的试用与拆分安装

```bash
claude --plugin-dir ~/claude-howto/07-plugins/pr-review

# 斜杠命令
cp ~/claude-howto/07-plugins/pr-review/commands/*.md .claude/commands/

# 子代理
cp ~/claude-howto/07-plugins/pr-review/agents/*.md .claude/agents/

# 先添加官方 marketplace
/plugin marketplace add anthropics/claude-code

# 安装官方插件（比如 feature-dev）
/plugin install feature-dev
```

## 提示词：用 devtools MCP 看精华帖

```text
使用devtools mcp，
打开生财有术官网 scys.com
看最新的精华帖子，总结给我
```
