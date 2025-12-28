import { prisma } from '../db/db';
import { WebsiteSettings } from '../constraint';





const defaultCategories = [
  { name: 'AI 聊天', slug: 'ai-chat' },
  { name: 'AI 绘画', slug: 'ai-art' },
  { name: 'AI 写作', slug: 'ai-writing' },
  { name: 'AI 编程', slug: 'ai-coding' },
  { name: 'AI 工具', slug: 'ai-tools' },
  { name: '大语言模型', slug: 'llm' },
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
  {
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'OpenAI 开发的 AI 聊天助手，能够进行自然对话并协助完成各种任务。',
    category_slug: 'ai-chat',
    thumbnail: 'https://chat.openai.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Claude',
    url: 'https://claude.ai',
    description: 'Anthropic 开发的 AI 助手，擅长写作、分析和编程等任务。',
    category_slug: 'ai-chat',
    thumbnail: 'https://claude.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Gemini',
    url: 'https://gemini.google.com',
    description: 'Google 开发的多模态 AI 助手，集成 Google 生态，支持多种任务。',
    category_slug: 'ai-chat',
    thumbnail: 'https://www.gstatic.com/lamda/images/favicon_v1_150160c13ff2af2630b3.png',
    status: 'approved',
  },
  {
    title: 'Poe',
    url: 'https://poe.com',
    description: 'Quora 推出的 AI 聚合平台，可访问多种领先的 AI 模型。',
    category_slug: 'ai-chat',
    thumbnail: 'https://poe.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Perplexity',
    url: 'https://www.perplexity.ai',
    description: '领先的 AI 搜索引擎，提供带引用的精准回答，改变信息检索方式。',
    category_slug: 'ai-chat',
    thumbnail: 'https://www.perplexity.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Kimi',
    url: 'https://kimi.moonshot.cn',
    description: '月之暗面开发，支持超长上下文处理，擅长长文本分析。',
    category_slug: 'ai-chat',
    thumbnail: 'https://kimi.moonshot.cn/favicon.ico',
    status: 'approved',
  },
  {
    title: 'DeepSeek',
    url: 'https://www.deepseek.com',
    description: '深度求索开发的国产开源大模型，在编程和数学方面表现出色。',
    category_slug: 'ai-chat',
    thumbnail: 'https://www.deepseek.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '豆包',
    url: 'https://www.doubao.com',
    description: '字节跳动推出的 AI 智能助手，国内用户量最大的 AI 应用之一。',
    category_slug: 'ai-chat',
    thumbnail: 'https://www.doubao.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '腾讯元宝',
    url: 'https://yuanbao.tencent.com',
    description: '腾讯基于混元大模型推出的 AI 助手，深度集成腾讯生态。',
    category_slug: 'ai-chat',
    thumbnail: 'https://yuanbao.tencent.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '通义千问',
    url: 'https://tongyi.aliyun.com',
    description: '阿里巴巴开发的超大规模语言模型，具备多轮对话、文案创作能力。',
    category_slug: 'ai-chat',
    thumbnail: 'https://img.alicdn.com/imgextra/i4/O1CN0176999917699999999_!!6000000000000-2-tps-128-128.png',
    status: 'approved',
  },
  {
    title: '文心一言',
    url: 'https://yiyan.baidu.com',
    description: '百度推出的知识增强大语言模型，能够回答问题、协助创作。',
    category_slug: 'ai-chat',
    thumbnail: 'https://yiyan.baidu.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '智谱清言',
    url: 'https://chatglm.cn',
    description: '智谱 AI 基于 ChatGLM 开发的 AI 助手，具备强大的对话和理解能力。',
    category_slug: 'ai-chat',
    thumbnail: 'https://chatglm.cn/favicon.ico',
    status: 'approved',
  },
  {
    title: '海螺AI',
    url: 'https://www.hailuoai.com',
    description: 'Minimax 推出的生产力助手，以极速响应和高质量语音交互著称。',
    category_slug: 'ai-chat',
    thumbnail: 'https://www.hailuoai.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '跃问',
    url: 'https://www.yuexia.com',
    description: '阶跃星辰推出的 AI 助手，具备强大的多模态理解和逻辑推理能力。',
    category_slug: 'ai-chat',
    thumbnail: 'https://www.yuexia.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '360智脑',
    url: 'https://chat.360.com',
    description: '360 集团推出的认知型通用大模型，擅长资料检索和安全分析。',
    category_slug: 'ai-chat',
    thumbnail: 'https://chat.360.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '万知',
    url: 'https://www.wanzhi.com',
    description: '零一万物推出的生产力工具，擅长会议纪要、文档解读和办公协作。',
    category_slug: 'ai-chat',
    thumbnail: 'https://www.wanzhi.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '百川大模型',
    url: 'https://www.baichuan-ai.com',
    description: '百川智能推出，在中文语境理解和医疗等专业领域表现出色。',
    category_slug: 'ai-chat',
    thumbnail: 'https://www.baichuan-ai.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Mistral AI',
    url: 'https://chat.mistral.ai',
    description: '欧洲 AI 领头羊 Mistral 推出的对话界面，提供强大的开源模型访问。',
    category_slug: 'ai-chat',
    thumbnail: 'https://chat.mistral.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Midjourney',
    url: 'https://www.midjourney.com',
    description: '强大的 AI 绘画工具，可以通过文字描述生成高质量图片。',
    category_slug: 'ai-art',
    thumbnail: 'https://www.midjourney.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    description: 'GitHub 和 OpenAI 合作开发的 AI 编程助手，提供智能代码补全。',
    category_slug: 'ai-coding',
    thumbnail: 'https://github.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Claude Code',
    url: 'https://claude.ai/code',
    description: 'Anthropic 推出的命令行 AI 助手，可直接在终端编写和调试代码。',
    category_slug: 'ai-coding',
    thumbnail: 'https://claude.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Trae',
    url: 'https://www.trae.ai',
    description: '字节跳动推出的自适应 AI IDE，基于 VS Code 构建，深度集成 AI 能力。',
    category_slug: 'ai-coding',
    thumbnail: 'https://www.trae.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Cursor',
    url: 'https://www.cursor.com',
    description: '目前最受欢迎的 AI 驱动代码编辑器，提供强大的代码补全和对话功能。',
    category_slug: 'ai-coding',
    thumbnail: 'https://www.cursor.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Windsurf',
    url: 'https://codeium.com/windsurf',
    description: 'Codeium 推出的新一代 AI IDE，具备强大的上下文理解和代理能力。',
    category_slug: 'ai-coding',
    thumbnail: 'https://codeium.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Tabnine',
    url: 'https://www.tabnine.com',
    description: '专注于私有化部署和企业安全的 AI 编程助手。',
    category_slug: 'ai-coding',
    thumbnail: 'https://www.tabnine.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Amazon Q',
    url: 'https://aws.amazon.com/q/developer',
    description: '亚马逊推出的 AI 助手，深度集成 AWS 服务。',
    category_slug: 'ai-coding',
    thumbnail: 'https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Codeium',
    url: 'https://codeium.com',
    description: '个人用户免费的 AI 编程助手，支持 70 多种编程语言。',
    category_slug: 'ai-coding',
    thumbnail: 'https://codeium.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Supermaven',
    url: 'https://supermaven.com',
    description: '以极速响应和超长上下文窗口 (1M tokens) 著称的 AI 插件。',
    category_slug: 'ai-coding',
    thumbnail: 'https://supermaven.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Continue',
    url: 'https://www.continue.dev',
    description: '开源的 AI 编程助手，支持自定义模型和本地 LLM 部署。',
    category_slug: 'ai-coding',
    thumbnail: 'https://www.continue.dev/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Sourcegraph Cody',
    url: 'https://about.sourcegraph.com/cody',
    description: '利用代码图谱提供精准上下文的 AI 编程助手。',
    category_slug: 'ai-coding',
    thumbnail: 'https://about.sourcegraph.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Replit Agent',
    url: 'https://replit.com/ai',
    description: 'Replit 推出的 AI 代理，可从零开始构建和部署完整应用。',
    category_slug: 'ai-coding',
    thumbnail: 'https://replit.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'MarsCode',
    url: 'https://www.marscode.cn',
    description: '字节跳动推出的国内版 AI 编程助手，提供云端 IDE 和插件。',
    category_slug: 'ai-coding',
    thumbnail: 'https://www.marscode.cn/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Baidu Comate',
    url: 'https://comate.baidu.com',
    description: '百度推出的智能代码助手，基于文心大模型。',
    category_slug: 'ai-coding',
    thumbnail: 'https://comate.baidu.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '通义灵码',
    url: 'https://lingma.aliyun.com',
    description: '阿里巴巴推出的 AI 编程助手，深度集成阿里云生态。',
    category_slug: 'ai-coding',
    thumbnail: 'https://lingma.aliyun.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '腾讯云 AI 代码助手',
    url: 'https://copilot.tencent.com',
    description: '腾讯云推出的 AI 编程助手，支持多种主流 IDE。',
    category_slug: 'ai-coding',
    thumbnail: 'https://copilot.tencent.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '讯飞 iFlyCode',
    url: 'https://iflycode.xfyun.cn',
    description: '科大讯飞推出的智能编程助手，基于星火大模型。',
    category_slug: 'ai-coding',
    thumbnail: 'https://iflycode.xfyun.cn/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Blackbox AI',
    url: 'https://www.blackbox.ai',
    description: '专注于快速代码搜索、生成和实时代码分析的 AI 助手。',
    category_slug: 'ai-coding',
    thumbnail: 'https://www.blackbox.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Aider',
    url: 'https://aider.chat',
    description: '强大的命令行 AI 编程助手，支持与 Git 深度集成进行配对编程。',
    category_slug: 'ai-coding',
    thumbnail: 'https://aider.chat/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Devin',
    url: 'https://www.cognition.ai',
    description: '全球首位 AI 软件工程师，能独立完成复杂的编程任务。',
    category_slug: 'ai-coding',
    thumbnail: 'https://www.cognition.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Plandex',
    url: 'https://plandex.ai',
    description: '开源的 AI 编程代理，擅长处理跨文件的复杂积压任务。',
    category_slug: 'ai-coding',
    thumbnail: 'https://plandex.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'MutableAI',
    url: 'https://mutable.ai',
    description: '专注于自动化文档编写、代码重构和测试生成的 AI 助手。',
    category_slug: 'ai-coding',
    thumbnail: 'https://mutable.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Sweep',
    url: 'https://sweep.dev',
    description: '将 GitHub Issue 直接转化为代码拉取请求 (PR) 的 AI 代理。',
    category_slug: 'ai-coding',
    thumbnail: 'https://sweep.dev/favicon.ico',
    status: 'approved',
  },
] as WebsiteInput[];



interface FooterLinkInput {
  title: string;
  url: string;
}

const defaultFooterLinks: FooterLinkInput[] = [
  { title: 'GitHub', url: 'https://github.com' }
];
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
      categories.map((c: any) => [c.slug, c.id])
    );


    // 初始化网站
    await Promise.all(
      defaultWebsites.map(async website => {
        const { category_slug, ...websiteData } = website;
        const category_id = categoryMap.get(category_slug);
        
        if (category_id) {
          const createData = {
            ...websiteData,
            category_id: Number(category_id)
          };

          const updateData = {
            ...websiteData,
            category_id: Number(category_id)
          };


          const existingWebsite = await prisma.website.findUnique({
            where: { url: website.url }
          });

          if (existingWebsite) {
            return prisma.website.update({
              where: { id: existingWebsite.id },
              data: updateData
            });
          } else {
            return prisma.website.create({
              data: createData
            });
          }
        }
      })
    );

    // 初始化页脚链接
    await Promise.all(
      defaultFooterLinks.map(async link => {
        const existingLink = await prisma.footerLink.findUnique({
          where: { url: link.url }
        });

        if (existingLink) {
          return prisma.footerLink.update({
            where: { id: existingLink.id },
            data: link
          });
        } else {
          return prisma.footerLink.create({
            data: link
          });
        }
      })
    );

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