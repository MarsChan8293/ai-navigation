# AGENTS.md - AI 导航项目指南（中文翻译）

本文件为 AI 导航项目中的智能代码代理（如 Claude/Opencode）提供工作指南。它定义了保持代码质量和一致性的技术标准、工作流程和约束。

## 1. 构建、Lint 和测试命令

### 1.1 开发生命周期
- `npm run dev`: 使用 Turbopack 启动 Next.js 开发服务器。推荐用于本地开发。
- `npm run build`: 为生产环境编译应用。在最终提交 PR 之前请始终运行此命令以确保没有构建时错误。
- `npm run start`: 在成功构建后启动生产服务器。

### 1.2 代码质量与类型安全
- `npx tsc --noEmit`: 以“不输出”模式运行 TypeScript 编译器。本项目启用了严格的 TypeScript 设置；所有代码变更必须通过此检查。
- `npm run lint`: 使用 Next.js 特定规则运行 ESLint。
- `npx prisma validate`: 验证 Prisma 模式文件（`prisma/schema.prisma`）。
- `npx prisma generate`: 在更改模式后重新生成 Prisma Client。

### 1.3 数据库管理
- `npx prisma migrate dev`: 应用迁移并更新本地数据库。
- `npx prisma studio`: 启动用于数据探索的 Web GUI。
- `npm run init-data`: 运行位于 `src/lib/utils/init-data.ts` 的初始化脚本。用于重置或初始化本地环境。

### 1.4 测试流程
- **完整套件**: `node tests/api-test.js`。这是一个按顺序测试 API 端点的自定义 Node.js 脚本。
- **运行单个测试**: 由于测试套件是过程式脚本，若要隔离单个测试：
    1. 打开 `tests/api-test.js`。
    2. 注释掉不想运行的 `testCases.push(...)` 调用。
    3. 运行 `node tests/api-test.js`。
- **注意**: 该项目当前未使用 Jest 或 Vitest。请使用提供的脚本或浏览器手动测试来验证 API 行为。

## 2. 代码风格指南

### 2.1 TypeScript 配置
- **严格模式**: `tsconfig.json` 中启用了 `strict: true`。
- **禁止隐式 any**: 所有函数参数和非平凡变量需显式类型。
- **枚举 vs 联合类型**: 对于简单状态值，优先使用联合类型（如 `'approved' | 'pending'`）而不是 Enums。

### 2.2 命名约定
- **React 组件**: PascalCase（例如 `CategorySidebar.tsx`, `WebsiteGrid.tsx`）。
- **自定义 Hook**: 使用小驼峰并以 `use` 前缀（例如 `useAuth.ts`）。
- **状态原子**: 小驼峰并以 `Atom` 后缀（例如 `searchQueryAtom.ts`）。
- **工具文件**: 使用 kebab-case（例如 `fetch-metadata.ts`）。
- **常量**: 对环境变量或固定配置使用 UPPER_SNAKE_CASE。

### 2.3 导入与导出模式
- **路径别名**: 总是使用 `@/` 别名来导入 `src/` 下的内容。
- **导入顺序**:
    1. React 与 Next.js 核心库。
    2. 第三方依赖（如 `lucide-react`, `jotai`）。
    3. 内部 `@/` 导入。
    4. 相对导入（`./` 或 `../`）。
- **导出**: 工具函数优先使用命名导出；React 组件优先默认导出（每个文件一个组件）。

### 2.4 组件指令
- **'use client'**: 对于使用 React Hook（状态、effect）或事件监听的文件，将此指令置于文件顶部。
- **服务端组件**: 服务端组件为默认首选。除非需要交互，否则优先使用服务端组件以优化 SEO 与包体积。

## 3. 架构模式与标准

### 3.1 数据库（Prisma）
- **单例模式**: 切勿在路由中直接实例化 `PrismaClient`。
- **标准做法**: 使用 `import { prisma } from "@/lib/db/db";`。这能防止在开发中耗尽数据库连接。
- **迁移**: 运行 `prisma migrate dev --name <描述>` 时请提供描述性名称。

### 3.2 状态管理（Jotai）
- **全局状态**: 在 `src/lib/atoms/` 中定义。
- **持久化**: 对于用户设置（如主题、管理员模式），使用 `atomWithStorage`，以确保刷新后状态仍然存在。
- **读写**: 在组件中使用 `useAtom`；使用 `useSetAtom` / `useAtomValue` 优化重渲染。

### 3.3 API 响应一致性
- **AjaxResponse**: `src/app/api/` 下的所有 API 处理器必须使用 `@/lib/utils/utils.ts` 中的 `AjaxResponse` 封装返回数据。
- **成功示例**: `return NextResponse.json(AjaxResponse.ok(result));`
- **失败示例**: `return NextResponse.json(AjaxResponse.fail("Unauthorized", 401));`

### 3.4 表单验证（Zod）
- **验证模式**: 所有表单数据和 API 请求体必须使用 Zod 验证。
- **集中式逻辑**: 将公共的 schema 放在 `src/lib/utils/validations.ts`，以确保前后端一致。

### 3.5 样式与 UI
- **Tailwind CSS**: 仅使用工具类。
- **类合并**: 使用 `cn(...)` 助手处理条件类名。
- **主题**: 使用 CSS 变量（例如 `hsl(var(--primary))`）以支持暗色模式。
- **动画**: 对于复杂 UI 动画，统一使用 `framer-motion`。

## 4. 项目结构（关键目录）
- `src/app/`: Next.js App Router（路由与 API 端点）。
- `src/components/`: 业务逻辑组件（例如 `AdminDashboard`）。
- `src/ui/common/`: 低阶、可重用的 UI 原语（例如 `Button`, `Dialog`）。
- `src/lib/`: 核心逻辑，包括 `db`（Prisma）、`atoms`（Jotai）和 `utils`。
- `src/hooks/`: 可复用的 React Hook。
- `tests/`: API 测试脚本与报告。

## 5. 安全与防护规则
- **环境变量**: 切勿提交 `.env` 文件。使用 `.env.example` 作为模板。
- **输入清洗**: 在保存到数据库前务必验证 URL 与用户输入字符串。
- **管理员操作**: 对任何破坏性 API 操作，验证 `isAdminMode` 或会话令牌。

## 6. 离线部署规则（完全本地化环境）

本项目可能部署在无法访问外网的环境中，所有资源必须本地化。以下规则必须严格遵守：

### 6.1 禁止的外部资源
- **Google Fonts**: 禁止使用 `fonts.googleapis.com` 和 `fonts.gstatic.com`
  - 删除 `src/app/layout.tsx:33-34,37-39` 中的预连接和 DNS 预解析
  - 替代方案：将必需的字体文件下载到 `public/fonts/`，通过 CSS `@font-face` 加载
- **Favicon 服务**: 禁止使用 `icon.horse`
  - 删除 `src/app/layout.tsx:32,37` 中的相关预连接
  - 删除 `src/components/website/website-thumbnail.tsx:26` 的 faviconUrl 引用
  - 删除 `next.config.ts:14-18` 中的 `remotePatterns` 配置
  - 替代方案：使用本地图标或从 `public/icons/` 加载默认图标
- **Google Analytics**: 禁止使用 `googletagmanager.com`
  - 删除 `src/app/layout.tsx:65` 中的 `<OtherAnalytics>` 组件
  - 删除 `src/components/analytics.tsx` 中的 Google Analytics 相关代码
- **百度统计**: 禁止使用 `hm.baidu.com`
  - 删除 `src/components/analytics.tsx:12-27` 中的百度统计代码
- **Vercel Analytics**: 禁止使用 `@vercel/analytics`
  - 删除 `src/app/layout.tsx:8,64` 中的 Vercel Analytics 引入

### 6.5 本地化检查清单
在提交代码前，确保：
1. 所有 `https://` 和 `http://` 外部链接已被移除或替换为本地资源
2. 删除或注释掉所有外部分析脚本（GA、百度、Vercel）
3. 字体文件已下载到 `public/fonts/` 并在 `globals.css` 中正确引用
4. favicon 使用本地图标或生成机制
5. 禁用所有自动获取外部元数据的功能
