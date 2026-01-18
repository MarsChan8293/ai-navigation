# 网站错误修复计划

## 测试结果总结

### 🔴 严重问题

#### 1. Hydration 不匹配错误
**位置**: `src/components/sidebar/sidebar.tsx:99`

**问题描述**:
- 管理链接使用了硬编码的完整 URL `http://192.168.0.232:3001/admin`
- 导致服务端渲染的 HTML 与客户端渲染不一致
- 触发 React hydration 失败

**错误信息**:
```
Hydration failed because the server rendered HTML didn't match the client
+ href="/about"
- href="http://192.168.0.232:3001/admin"
```

**修复方案**:
将第 99 行的硬编码 URL 改为相对路径 `/admin`:

```typescript
// 修复前
{ name: "管理", href: "http://192.168.0.232:3001/admin", icon: Settings },

// 修复后
{ name: "管理", href: "/admin", icon: Settings },
```

#### 2. 图标映射不匹配
**位置**: `src/components/sidebar/sidebar.tsx:37-48`

**问题描述**:
iconMap 中的图标 slug 与数据库中的分类 slug 不完全匹配，导致部分分类使用回退图标，造成服务端和客户端图标渲染不一致。

**数据库中的分类**:
- `ai-chat` ✅
- `ai-coding` ✅
- `ai-infra` ✅
- `ai-office` ❌ (不在 iconMap 中)
- `ai-search` ❌ (不在 iconMap 中)
- `ai-hubs` ❌ (iconMap 中是 `ai-model`)
- `ai-agents` ❌ (不在 iconMap 中)
- `ai-art` ❌ (iconMap 中是 `ai-drawing`)
- `ai-others` ❌ (不在 iconMap 中)

**iconMap 中的键**:
- `ai-chat` ✅
- `ai-drawing` ❌ (数据库中没有)
- `ai-writing` ❌ (数据库中没有)
- `ai-coding` ✅
- `ai-tools` ❌ (数据库中没有)
- `ai-model` ❌ (数据库中是 `ai-hubs`)
- `ai-agent` ❌ (数据库中是 `ai-agents`)
- `ai-prompt` ❌ (数据库中没有)
- `ai-infra` ✅

**修复方案**:
更新 iconMap 以匹配数据库中的实际 slug，并添加缺失的映射:

```typescript
const iconMap: Record<string, typeof Globe> = {
    "all": LayoutGrid,
    "ai-chat": MessageCircle,
    "ai-drawing": Palette,
    "ai-writing": PenTool,
    "ai-coding": Code2,
    "ai-tools": Wrench,
    "ai-model": Brain,
    "ai-agent": Bot,
    "ai-prompt": Command,
    "ai-infra": Server,
    // 添加缺失的分类映射
    "ai-office": Briefcase,           // AI 办公与幻灯片
    "ai-search": Search,               // AI 搜索与深度研究
    "ai-hubs": Brain,                  // AI 模型与社区
    "ai-agents": Bot,                  // AI Agent 开发/自动化
    "ai-art": Palette,                 // AI 绘画与设计
    "ai-others": Wrench,               // 其他 AI 工具
};
```

需要在文件顶部添加缺失的图标导入:
```typescript
import {
    Globe,
    MessageSquare,
    Palette,
    PenTool,
    Code2,
    Wrench,
    Brain,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    Trophy,
    Plus,
    Settings,
    Info,
    Server,
    Bot,
    Command,
    MessageCircle,
    Briefcase,      // 新增
    Search,         // 新增
} from "lucide-react";
```

### 🟡 中等问题

#### 3. Build Manifest ENOENT 错误

**问题描述**:
运行时尝试读取 `.next/server/app/(app)/use-cases/page/build-manifest.json` 文件时报告文件不存在，但实际上该文件存在。

**可能的根本原因**:
1. Next.js 开发模式下的缓存问题
2. 文件权限问题
3. Turbopack 构建配置问题

**修复方案**:
1. 清理 Next.js 缓存并重新构建:
   ```bash
   rm -rf .next
   npm run build
   ```

2. 检查 `use-cases/page.tsx` 中的 `dynamic = "force-dynamic"` 配置是否正确

3. 如果问题持续，考虑将 use-cases 页面改为客户端组件

#### 4. 表单验证 null 值错误

**问题描述**:
出现 "path: Expected string, received null" 和 "filter: Expected string, received null" 验证错误。

**可能的原因**:
1. API 返回的数据中包含 null 值
2. 表单字段未正确初始化
3. Zod schema 未正确处理可选字段

**修复方案**:
检查相关 API 路由和数据模型，确保:
1. 数据库查询中正确处理 null 值
2. API 响应中不包含意外的 null 值
3. Zod schema 中对可选字段使用 `.nullable().optional()`

需要调查的文件:
- `src/app/api/websites/route.ts`
- `src/app/api/categories/route.ts`
- `src/lib/utils/validations.ts`

## 修复步骤

### 第一步: 修复侧边栏 Hydration 问题
1. 编辑 `src/components/sidebar/sidebar.tsx:99`
2. 将 `href: "http://192.168.0.232:3001/admin"` 改为 `href: "/admin"`

### 第二步: 修复图标映射
1. 编辑 `src/components/sidebar/sidebar.tsx:6-24`
2. 添加缺失的图标导入
3. 更新 iconMap 添加缺失的分类 slug 映射

### 第三步: 重建 Next.js 缓存
1. 运行 `rm -rf .next` 清理缓存
2. 运行 `npm run build` 重新构建
3. 重启开发服务器

### 第四步: 测试验证
1. 使用浏览器测试工具重新测试所有页面
2. 检查控制台是否还有错误
3. 验证所有链接和图标显示正常

## 预期结果

修复完成后，应该:
- ✅ 不再出现 Hydration 不匹配错误
- ✅ 所有分类图标正确显示，不再有图标不匹配
- ✅ 不再出现 build-manifest.json ENOENT 错误
- ✅ 表单提交功能正常工作
- ✅ 网站控制台无错误信息

## 时间估计

- 第一步: 1 分钟
- 第二步: 3 分钟
- 第三步: 5-10 分钟（取决于构建时间）
- 第四步: 5 分钟

**总计**: 约 15-20 分钟
