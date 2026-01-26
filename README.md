# AI 导航 | AI Navigation

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-%5E19.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-15.1.2-black)

</div>

## 📖 简介

AI 导航是一个由 Apple 风格启发的现代化人工智能网站导航系统，致力于帮助用户发现、分享和管理优质的 AI 工具与资源。项目采用最新的 Next.js 15 和 Tailwind CSS 构建，提供极致流畅的用户体验和强大的管理功能。

### ✨ 特性

- 🍎 **Apple 风格 UI**: 精致的组件设计，平滑的动画效果和毛玻璃质感
- 🎯 **精选内容**: 严选优质 AI 网站，分类清晰直观
- 🔍 **智能搜索**: 支持多搜索引擎集成和全局实时搜索
- 📸 **智能截图**: 自动获取网站实时截图，支持 Microlink API
- 🎨 **主题感应**: 完美支持浅色/深色模式，随系统自动切换
- 📱 **全端适配**: 完美适配从移动端到超宽屏的各种设备
- 👮‍♂️ **后台管理**: 强大的管理员仪表盘，支持分类、网站和使用场景管理
- 💾 **数据安全**: 基于 Prisma 的 SQLite 数据库，支持高效的数据迁移和还原

## 🚀 界面展示

### 示例站点

- [AI 导航](https://ainavix.com) - 发现、分享和收藏优质 AI 工具与资源

### 界面预览

#### 首页看板 (Apple Redesign)

![首页看板](/public/compose.png)

#### 首页深色模式

![首页深色模式](/public/compose-dark.png)

#### 快捷搜索与过滤

![排行榜](/public/rankings.png)

#### 响应式设计

![深色模式](/public/dark.png)

##### 交互动画

![完整演示](/public/all.gif)
![底部效果](/public/footer.gif)
![顶部导航](/public/header-1735608882123.gif)

## 🛠️ 开发步骤

### 1. 环境准备

- 安装 [Node.js](https://nodejs.org/) (>= 18.0.0)
- 安装 [Git](https://git-scm.com/)
- 准备一个代码编辑器 (推荐 VS Code)
- 确保有可用的包管理器 (npm / pnpm / yarn)

### 2. 项目设置

1. 克隆项目到本地:

```bash
git clone https://github.com/MarsChan8293/ai-navigation.git
cd ai-navigation
```

2. 安装项目依赖:

```bash
npm install
```

3. 环境变量配置:

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入必要的环境变量
# 包括数据库配置、截图 API (MICROLINK_API_KEY) 等
```

4. 初始化数据库:

```bash
npx prisma migrate dev
npm run init-data
```

### 3. 开发流程

1. 启动开发服务器:

```bash
npm run dev
```

2. 代码质量检查:

```bash
# 运行代码检查
npm run lint

# 运行类型检查
npx tsc --noEmit
```

## 📦 部署步骤

### Vercel 部署

1. 在 [Vercel](https://vercel.com/) 导入你的 GitHub 仓库

2. 配置项目设置:
   - Framework Preset: Next.js
   - Node.js Version: 20.x

3. 配置环境变量:
   - `DATABASE_URL`: 你的数据库连接字符串
   - `ADMIN_PASSWORD`: 管理员登录密码
   - `MICROLINK_API_KEY`: (可选) 用于获取网页截图

## 🛠️ 技术栈

- **前端框架**: Next.js 15 (App Router), React 19, TypeScript
- **状态管理**: Jotai (全局原子状态), TanStack Query (数据请求缓存)
- **UI 框架**: Tailwind CSS, Framer Motion (动画), Lucide React (图标)
- **后端服务**: Prisma ORM, Next.js API Routes (Serverless)
- **数据存储**: SQLite / PostgreSQL
- **验证机制**: Zod, JSON Web Token (JWT)

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

<div align="center">

**AI 导航** © 2026 Made with ❤️

</div>
