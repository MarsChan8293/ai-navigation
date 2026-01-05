# AI 导航 | AI Navigation

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-%5E18.2.0-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-14.1.0-black)

</div>

## 📖 简介

AI 导航是一个现代化的人工智能网站导航系统，致力于帮助用户发现、分享和管理优质的 AI 工具与资源。项目采用最新的 Web 技术栈构建，提供流畅的用户体验和强大的管理功能。首页展示基于 IPD（集成产品开发）流程的网站分类导航，让用户能够按产品开发阶段快速找到所需工具。

### ✨ 特性

- 🎯 **精选内容**: 严选优质 AI 网站，分类清晰直观
- 🔍 **智能搜索**: 支持多搜索引擎集成和实时搜索
- 🎨 **现代设计**: 精美的 UI 设计，支持浅色/深色主题
- 📱 **响应式**: 完美适配桌面端、平板和移动设备
- 🚀 **智能抓取**: 自动获取网站标题、描述和图片
- 👮‍♂️ **后台管理**: 完善的管理员功能和审核机制
- 💾 **数据安全**: 支持数据备份与云端同步

## 🚀 界面展示

### 示例站点

- [AI 导航](https://ainavix.com) - 发现、分享和收藏优质 AI 工具与资源

### 界面预览

#### IPD 导航首页（浅色主题）

![IPD 导航首页浅色主题](/public/compose.png)

#### IPD 导航首页（深色主题）

![IPD 导航首页深色主题](/public/compose-dark.png)



## 🛠️ 开发步骤

### 1. 环境准备

- 安装 [Node.js](https://nodejs.org/) (>= 18.0.0)
- 安装 [Git](https://git-scm.com/)
- 准备一个代码编辑器 (推荐 VS Code)
- 确保有可用的包管理器 (npm >= 8.0.0)

### 2. 项目设置

1. Fork 项目仓库到你的 GitHub 账号

2. 克隆项目到本地:

```bash
git clone https://github.com/liyown/AI-NAV.git
cd AI-NAV
```

3. 安装项目依赖:

```bash
npm install
```

4. 环境变量配置:

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local 文件，填入必要的环境变量
```

5. 初始化数据库:

```bash
npm run init-data
```

### 3. 开发流程

1. 创建新的功能分支:

```bash
git checkout -b feature/your-feature-name
```

2. 启动开发服务器:

```bash
npm run dev
```

3. 代码质量检查:

```bash
# 运行代码检查
npm run lint

# 运行类型检查
npm run type-check
```

4. 提交代码:

```bash
git add .
git commit -m "feat: 添加新功能"
git push origin feature/your-feature-name
```

## 📦 部署步骤

### 1. Vercel 部署（推荐）

1. Fork 本项目到你的 GitHub 账号

2. 在 [Vercel](https://vercel.com/) 注册账号并连接 GitHub

3. 在 Vercel 中导入项目:

   - 点击 "New Project"
   - 选择你 fork 的仓库
   - 配置项目设置:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Node.js Version: 18.x

4. 配置环境变量:

   - 在 Vercel 项目设置中添加必要的环境变量
   - 确保所有 .env.local 中的变量都已配置

5. 部署项目:
   - 点击 "Deploy"
   - 等待部署完成
   - 访问分配的域名检查部署结果

### 2. 自托管部署

#### Docker 部署

1. 构建 Docker 镜像:

```bash
docker build -t ai-nav .
```

2. 运行容器:

```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL=your_database_url \
  -e NEXT_PUBLIC_API_URL=your_api_url \
  --name ai-nav \
  ai-nav
```

## 🔧 核心功能

### 网站管理

- **网站提交**

  - 支持手动填写和自动抓取
  - 分类管理和标签系统
  - 审核流程和状态追踪

- **资讯管理**
  - AI 相关新闻和资讯
  - 自动获取文章摘要
  - 支持多媒体内容

### 浏览器扩展

- **一键收藏**
  - 支持快速收藏网站和资讯
  - 自动提取网页元数据
  - 快捷键操作支持

#### 安装油猴脚本

1. 安装浏览器扩展

   - Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - Edge: [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. 安装收藏脚本

   - 点击 [安装脚本](/scripts/tamper-monkey-script.user.js)
   - 或手动复制 `public/scripts/tamper-monkey-script.user.js` 内容创建新脚本

3. 使用方法
   - 浮动按钮：页面右下角的收藏按钮
   - 快捷键：
     - `Alt + S`: 收藏网站
     - `Alt + N`: 收藏资讯
   - 右键菜单：通过 Tampermonkey 扩展菜单操作

## � 数据管理

本项目使用本地 JSON 文件作为数据库，同时也支持通过 JSON 文件管理初始种子数据。

### 种子数据 (Seed Data)

初始网站数据存储在 `data/websites.json` 中。这是一个标准的 JSON 文件，用于维护项目的默认数据。

- **位置**: `data/websites.json`
- **用途**: 存储初始化的网站列表
- **修改**: 您可以直接编辑此文件来添加、删除或修改默认网站数据

### 初始化/重置数据

如果您修改了 `data/websites.json`，可以通过以下命令将更改应用到数据库：

```bash
npm run init-data
```

> **注意**: 此命令会更新现有记录（基于 URL 匹配）或创建新记录，不会删除用户添加的数据。

### 运行时数据库

应用程序的实际运行数据存储在 `data/db.json` 中。

- **位置**: `data/db.json`
- **用途**: 存储应用程序的实时状态（包括用户提交、点赞、浏览量等）
- **警告**: 请勿在程序运行时手动修改此文件

## �🛠️ 技术栈

- **前端框架**:

  - Next.js 14 (App Router)
  - React 18
  - TypeScript

- **状态管理**:

  - Zustand
  - React Query

- **UI 框架**:

  - Tailwind CSS
  - shadcn/ui
  - Framer Motion

- **数据存储**:

  - JSON File (Lowdb)
  - Custom JSON Client (Prisma-like API)

- **认证授权**:

  - NextAuth.js
  - JWT

- **工具链**:
  - React Hook Form
  - Zod
  - Lucide React
  - ESLint
  - Prettier

## 📄 开源协议 本项目采用 [MIT](LICENSE) 协议开源。

<div align="center">

**AI 导航** © 2024 Made with ❤️

</div>
