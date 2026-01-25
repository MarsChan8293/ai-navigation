# API 接口文档

## 项目简介

AI 导航是一个现代化的人工智能网站导航系统，提供了完整的RESTful API接口，用于管理网站、分类、案例和系统设置。

## 基础信息

- **API 基础路径**: `/api`
- **响应格式**: JSON
- **成功响应结构**: 
  ```json
  {
    "success": true,
    "data": { /* 响应数据 */ },
    "message": "操作成功"
  }
  ```
- **失败响应结构**:
  ```json
  {
    "success": false,
    "data": null,
    "message": "错误信息"
  }
  ```

---

## 接口分类

### 1. 通用接口

#### 1.1 健康检查

**接口地址**: `GET /api`

**功能**: 检查API服务是否正常

**请求参数**: 无

**响应示例**:
```json
{
  "success": true,
  "data": "hello world",
  "message": "操作成功"
}
```

---

### 2. 分类管理

#### 2.1 获取所有分类

**接口地址**: `GET /api/categories`

**功能**: 获取所有分类列表

**请求参数**: 无

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "AI 对话平台",
      "slug": "ai-chat",
      "likes": 100,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "操作成功"
}
```

#### 2.2 创建分类

**接口地址**: `POST /api/categories`

**功能**: 创建新分类

**请求参数**:
```json
{
  "name": "分类名称",
  "slug": "分类标识"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "新分类",
    "slug": "new-category",
    "likes": 0,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "操作成功"
}
```

#### 2.3 更新分类

**接口地址**: `PUT /api/categories/[id]`

**功能**: 更新分类信息

**路径参数**:
- `id`: 分类ID

**请求参数**:
```json
{
  "name": "新分类名称",
  "slug": "新分类标识"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "更新后的分类",
    "slug": "updated-category",
    "likes": 0,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "操作成功"
}
```

#### 2.4 删除分类

**接口地址**: `DELETE /api/categories/[id]`

**功能**: 删除分类

**路径参数**:
- `id`: 分类ID

**响应示例**:
```json
{
  "success": true,
  "data": null,
  "message": "操作成功"
}
```

#### 2.5 分类点赞

**接口地址**: `POST /api/categories/[id]/like`

**功能**: 给分类点赞

**路径参数**:
- `id`: 分类ID

**响应示例**:
```json
{
  "success": true,
  "data": { "likes": 101 },
  "message": "操作成功"
}
```

#### 2.6 取消分类点赞

**接口地址**: `DELETE /api/categories/[id]/like`

**功能**: 取消分类点赞

**路径参数**:
- `id`: 分类ID

**响应示例**:
```json
{
  "success": true,
  "data": { "likes": 100 },
  "message": "操作成功"
}
```

---

### 3. 网站管理

#### 3.1 获取网站列表

**接口地址**: `GET /api/websites`

**功能**: 获取网站列表，支持按状态筛选

**查询参数**:
- `status`: 网站状态 (approved/pending/rejected, 默认 approved)

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "ChatGPT",
      "url": "https://chat.openai.com",
      "description": "OpenAI 旗舰产品",
      "category_id": 1,
      "visits": 1000,
      "likes": 500,
      "dislikes": 10,
      "status": "approved",
      "active": 1,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "操作成功"
}
```

#### 3.2 创建网站

**接口地址**: `POST /api/websites`

**功能**: 创建新网站

**请求参数**:
```json
{
  "title": "网站标题",
  "url": "https://example.com",
  "description": "网站描述",
  "category_id": 1,
  "thumbnail": "缩略图URL",
  "thumbnail_base64": "Base64编码的缩略图"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "新网站",
    "url": "https://example.com",
    "description": "网站描述",
    "category_id": 1,
    "visits": 0,
    "likes": 0,
    "dislikes": 0,
    "status": "pending",
    "active": 1,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "操作成功"
}
```

#### 3.3 获取网站详情

**接口地址**: `GET /api/websites/[id]`

**功能**: 获取网站详细信息

**路径参数**:
- `id`: 网站ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "ChatGPT",
    "url": "https://chat.openai.com",
    "description": "OpenAI 旗舰产品",
    "category_id": 1,
    "visits": 1000,
    "likes": 500,
    "dislikes": 10,
    "status": "approved",
    "active": 1,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "操作成功"
}
```

#### 3.4 更新网站

**接口地址**: `PUT /api/websites/[id]`

**功能**: 更新网站信息

**路径参数**:
- `id`: 网站ID

**请求参数**:
```json
{
  "title": "新网站标题",
  "url": "https://newexample.com",
  "description": "新网站描述",
  "category_id": 2,
  "status": "approved"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "新网站标题",
    "url": "https://newexample.com",
    "description": "新网站描述",
    "category_id": 2,
    "visits": 1000,
    "likes": 500,
    "dislikes": 10,
    "status": "approved",
    "active": 1,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "操作成功"
}
```

#### 3.5 删除网站

**接口地址**: `DELETE /api/websites/[id]`

**功能**: 删除网站

**路径参数**:
- `id`: 网站ID

**响应示例**:
```json
{
  "success": true,
  "data": "Website deleted successfully",
  "message": "操作成功"
}
```

#### 3.6 增加网站访问量

**接口地址**: `POST /api/websites/[id]/visit`

**功能**: 增加网站访问计数

**路径参数**:
- `id`: 网站ID

**响应示例**:
```json
{
  "success": true,
  "data": { "visits": 1001 },
  "message": "操作成功"
}
```

#### 3.7 网站点赞

**接口地址**: `POST /api/websites/[id]/like`

**功能**: 给网站点赞

**路径参数**:
- `id`: 网站ID

**响应示例**:
```json
{
  "success": true,
  "data": { "likes": 501 },
  "message": "操作成功"
}
```

#### 3.8 取消网站点赞

**接口地址**: `DELETE /api/websites/[id]/like`

**功能**: 取消网站点赞

**路径参数**:
- `id`: 网站ID

**响应示例**:
```json
{
  "success": true,
  "data": { "likes": 500 },
  "message": "操作成功"
}
```

#### 3.9 网站点踩

**接口地址**: `POST /api/websites/[id]/dislike`

**功能**: 给网站点踩（超过10次会自动删除网站）

**路径参数**:
- `id`: 网站ID

**响应示例**:
```json
{
  "success": true,
  "data": { "dislikes": 11, "deleted": true },
  "message": "操作成功"
}
```

#### 3.10 更新网站状态

**接口地址**: `PUT /api/websites/[id]/status`

**功能**: 更新网站审核状态

**路径参数**:
- `id`: 网站ID

**请求参数**:
```json
{
  "status": "approved" // pending/rejected/approved
}
```

**响应示例**:
```json
{
  "success": true,
  "data": "Status updated",
  "message": "操作成功"
}
```

#### 3.11 检查网站活跃度

**接口地址**: `POST /api/websites/active`

**功能**: 检查网站是否可访问（用于标记网站活跃度）

**请求参数**:
```json
{
  "url": "https://example.com",
  "id": 1
}
```

**响应示例**:
```json
{
  "success": true,
  "data": { "active": 1 },
  "message": "操作成功"
}
```

---

### 4. 案例管理

#### 4.1 获取案例列表

**接口地址**: `GET /api/use-cases`

**功能**: 获取案例列表，支持分页和按网站过滤

**查询参数**:
- `page`: 页码 (默认 1)
- `pageSize`: 每页数量 (默认 10, 最大 50)
- `websiteId`: 网站ID (可选，用于过滤特定网站的案例)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "title": "案例标题",
        "content": "案例内容",
        "image_base64": "Base64编码的图片",
        "website_id": 1,
        "status": "published",
        "created_at": "2024-01-01T00:00:00Z",
        "website": {
          "id": 1,
          "title": "ChatGPT",
          "url": "https://chat.openai.com",
          "thumbnail": "缩略图URL"
        }
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10
  },
  "message": "操作成功"
}
```

#### 4.2 创建案例

**接口地址**: `POST /api/use-cases`

**功能**: 创建新案例

**请求参数**:
```json
{
  "title": "案例标题",
  "content": "案例内容",
  "image_base64": "Base64编码的图片",
  "website_id": 1
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "新案例",
    "content": "案例内容",
    "image_base64": "Base64编码的图片",
    "website_id": 1,
    "status": "published",
    "created_at": "2024-01-01T00:00:00Z",
    "website": {
      "id": 1,
      "title": "ChatGPT",
      "url": "https://chat.openai.com",
      "thumbnail": "缩略图URL"
    }
  },
  "message": "操作成功"
}
```

---

### 5. 系统设置

#### 5.1 获取所有设置

**接口地址**: `GET /api/settings`

**功能**: 获取所有系统设置

**响应示例**:
```json
{
  "success": true,
  "data": {
    "site_title": "AI 导航",
    "site_description": "发现、分享和管理优质 AI 工具与资源",
    "admin_email": "admin@example.com"
  },
  "message": "操作成功"
}
```

#### 5.2 更新设置

**接口地址**: `PUT /api/settings`

**功能**: 更新系统设置

**请求参数**:
```json
{
  "site_title": "新网站标题",
  "site_description": "新网站描述"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": { "updated": 2, "total": 2 },
  "message": "操作成功"
}
```

#### 5.3 获取特定设置

**接口地址**: `POST /api/settings`

**功能**: 获取特定的系统设置

**请求参数**:
```json
{
  "key": "site_title" // 单个设置
  // 或
  "keys": ["site_title", "site_description"] // 多个设置
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "site_title": "AI 导航"
  },
  "message": "操作成功"
}
```

#### 5.4 删除设置

**接口地址**: `DELETE /api/settings?key=site_title`

**功能**: 删除系统设置

**查询参数**:
- `key`: 设置键名

**响应示例**:
```json
{
  "success": true,
  "data": null,
  "message": "操作成功"
}
```

---

### 6. 页脚链接管理

#### 6.1 获取所有页脚链接

**接口地址**: `GET /api/footer-links`

**功能**: 获取所有页脚链接

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "关于我们",
      "url": "https://example.com/about",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "操作成功"
}
```

#### 6.2 创建页脚链接

**接口地址**: `POST /api/footer-links`

**功能**: 创建新的页脚链接

**请求参数**:
```json
{
  "title": "链接标题",
  "url": "https://example.com/link"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "新链接",
    "url": "https://example.com/link",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "操作成功"
}
```

#### 6.3 更新页脚链接

**接口地址**: `PUT /api/footer-links`

**功能**: 更新页脚链接

**请求参数**:
```json
{
  "id": 2,
  "title": "更新后的链接",
  "url": "https://example.com/updated-link"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "更新后的链接",
    "url": "https://example.com/updated-link",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "操作成功"
}
```

#### 6.4 删除页脚链接

**接口地址**: `DELETE /api/footer-links?id=2`

**功能**: 删除页脚链接

**查询参数**:
- `id`: 链接ID

**响应示例**:
```json
{
  "success": true,
  "data": "success",
  "message": "操作成功"
}
```

---

### 7. 元数据抓取

#### 7.1 抓取网站元数据

**接口地址**: `GET /api/metadata?url=https://example.com`

**功能**: 抓取指定网站的元数据（标题、描述、图标等）

**查询参数**:
- `url`: 目标网站URL

**响应示例**:
```json
{
  "success": true,
  "data": {
    "title": "Example Domain",
    "description": "This domain is for use in illustrative examples in documents.",
    "icon": "https://example.com/favicon.ico"
  },
  "message": "操作成功"
}
```

---

### 8. 管理员功能

#### 8.1 管理员登录

**接口地址**: `POST /api/login`

**功能**: 管理员登录

**请求参数**:
```json
{
  "password": "admin123"
}
```

**成功响应**:
```json
{
  "message": "登录成功"
}
```

**失败响应**:
```json
{
  "message": "密码错误"
}
```

#### 8.2 更新网站缩略图

**接口地址**: `POST /api/admin/update-thumbnails`

**功能**: 手动触发网站缩略图更新任务

**响应示例**:
```json
{
  "success": true,
  "data": "缩略图更新完成",
  "message": "操作成功"
}
```

---

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 参数错误 |
| 401 | 未授权 |
| 404 | 资源未找到 |
| 500 | 服务器内部错误 |

---

## 使用示例

### 示例：获取所有分类

```javascript
// JavaScript 示例
fetch('/api/categories')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 示例：创建新网站

```javascript
// JavaScript 示例
fetch('/api/websites', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '新网站',
    url: 'https://example.com',
    description: '这是一个新网站',
    category_id: 1
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## 开发说明

- 所有API接口均使用 `AjaxResponse` 类统一包装响应
- 错误处理遵循 RESTful 规范
- 数据库操作使用 Prisma ORM
- 表单验证使用 Zod 库