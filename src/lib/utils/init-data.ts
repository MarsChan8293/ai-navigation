import { prisma } from '../db/db';
import type { Prisma, Category } from '@prisma/client';
import { WebsiteSettings } from '../constraint';

const defaultCategories = [
  { name: 'AI 对话工具', slug: 'ai-chat' },
  { name: 'AI 模型社区', slug: 'ai-hubs' },
  { name: 'AI 编程助手', slug: 'ai-coding' },
  { name: 'AI 推理框架', slug: 'ai-infra' },
  { name: 'AI 智能代理', slug: 'ai-agents' },
  { name: 'AI 绘画设计', slug: 'ai-art' },
  { name: 'AI 办公助手', slug: 'ai-office' },
  { name: 'AI 智能搜索', slug: 'ai-search' },
  { name: 'AI 其他工具', slug: 'ai-others' },
];

interface WebsiteInput {
  title: string;
  url: string;
  description: string;
  category_slug: string;
  thumbnail: string;
  status: 'pending' | 'approved' | 'rejected';
}

const defaultWebsites = [
  // AI 对话工具
  { title: 'ChatGPT', url: 'https://chat.openai.com', description: 'OpenAI 旗舰产品，全球领先的通用 AI，插件与 GPTs 生态丰富。 [Top]', category_slug: 'ai-chat', thumbnail: 'https://chat.openai.com/favicon.ico', status: 'approved' },
  { title: 'DeepSeek', url: 'https://www.deepseek.com', description: '国内技术代表，逻辑推理与代码能力极强，价格极具竞争力的国产之光。 [Top]', category_slug: 'ai-chat', thumbnail: 'https://www.deepseek.com/favicon.ico', status: 'approved' },
  { title: 'Claude', url: 'https://claude.ai', description: '以长文本理解和安全性著称，代码生成与创意文案质量公认第一。 [Top]', category_slug: 'ai-chat', thumbnail: 'https://claude.ai/favicon.ico', status: 'approved' },
  { title: 'Kimi', url: 'https://kimi.moonshot.cn', description: '国产长文本处理的先行者，支持超长上下文阅读与联网搜索。 [Top]', category_slug: 'ai-chat', thumbnail: 'https://kimi.moonshot.cn/favicon.ico', status: 'approved' },
  { title: 'Gemini', url: 'https://gemini.google.com', description: 'Google 旗下的多模态先行者，深度集成 Google Workspace 与 Android 生态。', category_slug: 'ai-chat', thumbnail: 'https://gemini.google.com/favicon.ico', status: 'approved' },
  { title: 'Mistral / Le Chat', url: 'https://chat.mistral.ai', description: '欧洲开源之王，模型高效且对话体验极简流畅。', category_slug: 'ai-chat', thumbnail: 'https://chat.mistral.ai/favicon.ico', status: 'approved' },
  { title: 'Grok', url: 'https://x.ai', description: 'X (Twitter) 旗下 AI，主打实时社交数据获取与无限制的对话风格。', category_slug: 'ai-chat', thumbnail: 'https://x.ai/favicon.ico', status: 'approved' },
  { title: '豆包', url: 'https://www.doubao.com', description: '字节跳动旗下，语音交互体验极佳，国内移动端用户基数庞大。', category_slug: 'ai-chat', thumbnail: 'https://www.doubao.com/favicon.ico', status: 'approved' },

  // AI 模型社区
  { title: 'Hugging Face', url: 'https://huggingface.co', description: '全球 AI 开源界的事实标准，“AI 版 GitHub”，托管百万级模型与数据集。 [Top]', category_slug: 'ai-hubs', thumbnail: 'https://huggingface.co/favicon.ico', status: 'approved' },
  { title: '魔搭社区 ModelScope', url: 'https://modelscope.cn', description: '阿里支持的国内最大开源模型社区，针对国产硬件有深度优化。 [Top]', category_slug: 'ai-hubs', thumbnail: 'https://modelscope.cn/favicon.ico', status: 'approved' },
  { title: 'OpenRouter', url: 'https://openrouter.ai', description: '聚合全球顶尖大模型的一站式 API 平台，支持按量计费与无缝切换。 [Top]', category_slug: 'ai-hubs', thumbnail: 'https://openrouter.ai/favicon.ico', status: 'approved' },
  { title: '昇腾', url: 'https://www.hiascend.com', description: '华为主导的国产算力平台，提供从硬件到开发框架的全栈 AI 生态。', category_slug: 'ai-hubs', thumbnail: 'https://www.hiascend.com/favicon.ico', status: 'approved' },

  // AI 编程助手
  { title: 'GitHub Copilot', url: 'https://github.com/features/copilot', description: '微软与 OpenAI 联手打造，依然是目前集成度最高、生态最稳的标杆。 [Top]', category_slug: 'ai-coding', thumbnail: 'https://github.com/favicon.ico', status: 'approved' },
  { title: 'Cursor', url: 'https://www.cursor.com', description: '开发者公认的 Top 1 AI 编辑器，原生 AI 集成彻底改变编程工作流认识。 [Recommend]', category_slug: 'ai-coding', thumbnail: 'https://www.cursor.com/favicon.ico', status: 'approved' },
  { title: 'Windsurf', url: 'https://codeium.com/windsurf', description: 'Codeium 推出的首个 Agentic IDE，具备极强的上下文感知与自主修复能力。 [Recommend]', category_slug: 'ai-coding', thumbnail: 'https://codeium.com/favicon.ico', status: 'approved' },
  { title: 'Claude Code', url: 'https://claude.ai/code', description: 'Anthropic 推出的命令行编程助手，解决复杂工程问题的能力惊人。 [Top]', category_slug: 'ai-coding', thumbnail: 'https://claude.ai/favicon.ico', status: 'approved' },
  { title: 'Trae', url: 'https://www.trae.ai', description: '字节跳动推出的 AI 编程新秀，主打“自适应学习”与原生中文支持。 [Top]', category_slug: 'ai-coding', thumbnail: 'https://www.trae.ai/favicon.ico', status: 'approved' },

  // AI 推理框架
  { title: 'vLLM', url: 'https://github.com/vllm-project/vllm', description: '目前最主流的开源大模型高性能推理引擎，高吞吐量与节省显存的首选。 [Top]', category_slug: 'ai-infra', thumbnail: 'https://github.com/favicon.ico', status: 'approved' },
  { title: 'Ollama', url: 'https://ollama.com', description: '本地运行大模型的最简单、最流行工具，支持一键部署各种开源模型。 [Top]', category_slug: 'ai-infra', thumbnail: 'https://ollama.com/favicon.ico', status: 'approved' },
  { title: 'TensorRT-LLM', url: 'https://github.com/NVIDIA/TensorRT-LLM', description: 'NVIDIA 官方加速库，针对英伟达显卡提供极致的硬件性能优化。 [Top]', category_slug: 'ai-infra', thumbnail: 'https://github.com/favicon.ico', status: 'approved' },
  { title: 'SGLang', url: 'https://github.com/sgl-project/sglang', description: '优秀的结构化生成框架，在处理长文本与复杂 Prompt 时推理速度极快。', category_slug: 'ai-infra', thumbnail: 'https://github.com/favicon.ico', status: 'approved' },
  { title: 'Mooncake/LMCache', url: 'https://github.com/kvcache-ai/Mooncake', description: '专注于 KVCache 优化，显著降低超长对话的推理成本与延迟。', category_slug: 'ai-infra', thumbnail: 'https://github.com/favicon.ico', status: 'approved' },

  // AI 智能代理
  { title: 'Dify', url: 'https://dify.ai', description: '最流行的开源 LLM 应用开发平台，支持可视化的工作流编排与模型管理。 [Top]', category_slug: 'ai-agents', thumbnail: 'https://dify.ai/favicon.ico', status: 'approved' },
  { title: 'Coze (扣子)', url: 'https://www.coze.cn', description: '字节出品，拥有极其丰富的插件与工作流组件，Agent 搭建门槛最低。 [Top]', category_slug: 'ai-agents', thumbnail: 'https://www.coze.cn/favicon.ico', status: 'approved' },
  { title: 'LangGraph', url: 'https://www.langchain.com/langgraph', description: 'LangChain 团队推出的有向无环图框架，是构建复杂、有状态 Agent 的工业级选择。', category_slug: 'ai-agents', thumbnail: 'https://www.langchain.com/favicon.ico', status: 'approved' },
  { title: 'n8n', url: 'https://n8n.io', description: '支持上千种集成的自动化工作流平台，通过 AI 节点可轻松连接现有业务系统。', category_slug: 'ai-agents', thumbnail: 'https://n8n.io/favicon.ico', status: 'approved' },

  // AI 绘画设计
  { title: 'Midjourney', url: 'https://www.midjourney.com', description: '艺术表现力与设计感的天花板，风格极其多样且审美在线. [Top]', category_slug: 'ai-art', thumbnail: 'https://www.midjourney.com/favicon.ico', status: 'approved' },
  { title: 'Flux.1', url: 'https://blackforestlabs.ai', description: '2025 年最强开源黑马，人物手部、身体结构及图片文字渲染效果惊人. [Top]', category_slug: 'ai-art', thumbnail: 'https://blackforestlabs.ai/favicon.ico', status: 'approved' },
  { title: 'Ideogram', url: 'https://ideogram.ai', description: '图像内文本渲染领域的世界第一，平面设计与海报生成的专业选. [Recommend]', category_slug: 'ai-art', thumbnail: 'https://ideogram.ai/favicon.ico', status: 'approved' },
  { title: 'Stable Diffusion', url: 'https://stability.ai', description: '自由度最高的开源方案，支持插件扩展、深度定制与本地离线部署. [Top]', category_slug: 'ai-art', thumbnail: 'https://stability.ai/favicon.ico', status: 'approved' },
  { title: 'Adobe Firefly', url: 'https://firefly.adobe.com', description: '唯一大规模商用合规的 AI，深度集成于 Photoshop，提供强大的填充与修改能力。', category_slug: 'ai-art', thumbnail: 'https://firefly.adobe.com/favicon.ico', status: 'approved' },

  // AI 办公助手
  { title: 'Gamma', url: 'https://gamma.app', description: '重新定义演示文稿，只需一个大纲或描述即可生成精美、交互式的页面。 [Top]', category_slug: 'ai-office', thumbnail: 'https://gamma.app/favicon.ico', status: 'approved' },
  { title: 'Notion AI', url: 'https://www.notion.so/product/ai', description: '嵌入式 AI 助手，擅长整理会议纪要、润色文档、头脑风暴及翻译列表。 [Top]', category_slug: 'ai-office', thumbnail: 'https://www.notion.so/favicon.ico', status: 'approved' },
  { title: 'Canva Magic Studio', url: 'https://www.canva.com/magic-studio', description: '设计小白的创意中心，自动排版、扩图、去背景等 AI 功能极大提升作图效率。', category_slug: 'ai-office', thumbnail: 'https://www.canva.com/favicon.ico', status: 'approved' },
  { title: 'WPS AI / Microsoft Copilot', url: 'https://ai.wps.cn', description: '深度集成在 Office 套件中，自动化处理表格、文档与幻灯片生成。', category_slug: 'ai-office', thumbnail: 'https://ai.wps.cn/favicon.ico', status: 'approved' },

  // AI 智能搜索
  { title: 'Perplexity', url: 'https://www.perplexity.ai', description: '重新定义搜索，直接给出带权威信源引用的答案，彻底告别广告干扰。 [Top]', category_slug: 'ai-search', thumbnail: 'https://www.perplexity.ai/favicon.ico', status: 'approved' },
  { title: 'Genspark', url: 'https://www.genspark.ai', description: '搜索即生成，自动为你的查询聚合所有相关信息并生成精美的专题网页。 [Top]', category_slug: 'ai-search', thumbnail: 'https://www.genspark.ai/favicon.ico', status: 'approved' },
  { title: 'Felo', url: 'https://felo.ai', description: '国内出海的热门搜索，内置极强的跨语言翻译搜索能力，一键阅读全球一手资料。', category_slug: 'ai-search', thumbnail: 'https://felo.ai/favicon.ico', status: 'approved' },
  { title: '秘塔 AI 搜索', url: 'https://metaso.cn', description: '国内学术与深度调研的首选，支持结构化思维导图展示与大规模文档参考。', category_slug: 'ai-search', thumbnail: 'https://metaso.cn/favicon.ico', status: 'approved' },
] as WebsiteInput[];

export async function initializeData() {
  try {
    // 初始化分类
    await Promise.all(
      defaultCategories.map(category =>
        prisma.category.upsert({
          where: { slug: category.slug },
          update: category,
          create: category,
        })
      )
    );

    // 获取所有分类的映射
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(
      categories.map((c: Category) => [c.slug, c.id])
    );

    // 初始化网站
    for (const website of defaultWebsites) {
      const { category_slug, ...websiteData } = website;
      const category_id = categoryMap.get(category_slug);
      
      if (category_id) {
        const createData: Prisma.WebsiteCreateInput = {
          ...websiteData,
          category: { 
            connect: { id: Number(category_id) } 
          }
        };

        const updateData: Prisma.WebsiteUpdateInput = {
          ...websiteData,
          category: { 
            connect: { id: Number(category_id) } 
          }
        };

        const existingWebsite = await prisma.website.findUnique({
          where: { url: website.url }
        });

        if (existingWebsite) {
          await prisma.website.update({
            where: { id: existingWebsite.id },
            data: updateData
          });
        } else {
          await prisma.website.create({
            data: createData
          });
        }
      }
    }

    console.log('数据初始化完成');
  } catch (error) {
    console.error('数据初始化失败:', error);
    throw error;
  }
}

export async function initializeSettings() {
  const requiredSettings = [
    { key: WebsiteSettings.title, value: 'AI导航' },
    { key: WebsiteSettings.description, value: '发现、分享和收藏优质AI工具与资源' },
    { key: WebsiteSettings.keywords, value: 'AI导航,AI工具,人工智能,AI资源' },
    { key: WebsiteSettings.logo, value: '/static/logo.png' },
    { key: WebsiteSettings.siteIcp, value: '' },
    { key: WebsiteSettings.siteFooter, value: '© 2024 AI导航. All rights reserved.' },
    { key: WebsiteSettings.allowSubmissions, value: 'true' },
    { key: WebsiteSettings.requireApproval, value: 'true' },
    { key: WebsiteSettings.itemsPerPage, value: '12' },
    { key: WebsiteSettings.adminPassword, value: process.env.ADMIN_PASSWORD || 'admin' },
    { key: WebsiteSettings.siteUrl, value: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
    { key: WebsiteSettings.siteEmail, value: process.env.SITE_EMAIL || 'admin@example.com' },
    { key: WebsiteSettings.siteCopyright, value: '© 2024 AI导航. All rights reserved.' },
    { key: WebsiteSettings.googleAnalytics, value: process.env.GOOGLE_ANALYTICS || '' },
    { key: WebsiteSettings.baiduAnalytics, value: process.env.BAIDU_ANALYTICS || '' },
  ];
  
  await Promise.all(
    requiredSettings.map(setting =>
      prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      })
    )
  );
}

if (require.main === module) {
  (async () => {
    try {
      await initializeData();
      await initializeSettings();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}
