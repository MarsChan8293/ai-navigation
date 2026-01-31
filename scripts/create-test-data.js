const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 示例分类数据
const categories = [
  { name: 'AI 对话', slug: 'ai-chat' },
  { name: '图像生成', slug: 'image-generation' },
  { name: '写作助手', slug: 'writing-assistant' },
  { name: '编程工具', slug: 'coding-tools' },
  { name: '视频制作', slug: 'video-creation' },
];

// 示例网站数据，包含分类、描述和案例
const websitesData = [
  // AI 对话
  {
    category: 'ai-chat',
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'OpenAI 开发的智能对话助手，支持多种语言和多轮对话',
    visits: 5000,
    likes: 320,
    useCases: [
      {
        title: '学术论文润色',
        content: '使用 ChatGPT 进行学术论文的语言润色，提升专业性和可读性。通过与 AI 的多轮对话，不断优化论文表达。',
        external_link: 'https://chat.openai.com/demo/academic',
      },
      {
        title: '代码调试助手',
        content: '在遇到编程问题时，向 ChatGPT 描述错误信息，获取详细的调试建议和代码示例。特别适合新手程序员学习。',
        external_link: 'https://chat.openai.com/demo/coding',
      },
      {
        title: '创意写作',
        content: '利用 ChatGPT 进行小说情节构思、角色设定和对话创作。AI 能提供独特的创意视角和写作建议。',
        external_link: null,
      },
    ],
  },
  {
    category: 'ai-chat',
    title: 'Claude',
    url: 'https://claude.ai',
    description: 'Anthropic 开发的 AI 助手，以安全性和有用性著称',
    visits: 2500,
    likes: 180,
    useCases: [
      {
        title: '长篇文档分析',
        content: '上传 PDF 或长文文档，让 Claude 帮助提取关键信息、总结要点并回答文档中的具体问题。',
        external_link: 'https://claude.ai/demo/document-analysis',
      },
      {
        title: '复杂推理任务',
        content: '处理需要多步推理的复杂问题，如数学题求解、逻辑推理、商业决策分析等。',
        external_link: null,
      },
    ],
  },
  {
    category: 'ai-chat',
    title: '文心一言',
    url: 'https://yiyan.baidu.com',
    description: '百度开发的 AI 对话大模型，针对中文场景优化',
    visits: 8000,
    likes: 450,
    useCases: [
      {
        title: '中文公文写作',
        content: '使用文心一言协助撰写各类中文公文、报告和商务邮件，确保语言规范且符合中文表达习惯。',
        external_link: 'https://yiyan.baidu.com/demo/office-writing',
      },
      {
        title: '古诗词创作',
        content: '输入主题或情感，文心一言能生成符合格律的古诗词，适合文学爱好者学习和创作。',
        external_link: 'https://yiyan.baidu.com/demo/poetry',
      },
      {
        title: '历史知识问答',
        content: '对中国历史、文化进行深度问答，文心一言在中文知识领域有更好的理解和回答能力。',
        external_link: null,
      },
    ],
  },
  
  // 图像生成
  {
    category: 'image-generation',
    title: 'Midjourney',
    url: 'https://www.midjourney.com',
    description: '业界领先的 AI 图像生成工具，可生成高质量艺术图像',
    visits: 6200,
    likes: 390,
    useCases: [
      {
        title: '游戏概念设计',
        content: '使用 Midjourney 快速生成游戏角色、场景和道具的概念图，为美术团队提供创作参考。',
        external_link: 'https://www.midjourney.com/showcase/game-design',
      },
      {
        title: '电商产品展示图',
        content: '为电商产品生成精美的场景展示图，无需真实摄影即可制作出专业的营销图片。',
        external_link: 'https://www.midjourney.com/showcase/ecommerce',
      },
    ],
  },
  {
    category: 'image-generation',
    title: 'Stable Diffusion',
    url: 'https://stability.ai',
    description: '开源的 AI 图像生成模型，可本地部署使用',
    visits: 4500,
    likes: 280,
    useCases: [
      {
        title: '本地隐私图像生成',
        content: '在公司内网或本地服务器部署 Stable Diffusion，确保敏感图像数据不出内网，满足隐私要求。',
        external_link: 'https://stability.ai/demo/local-deployment',
      },
      {
        title: '定制化模型训练',
        content: '使用自己的图像数据集训练定制化 LoRA 模型，生成特定风格或特定对象的图像。',
        external_link: 'https://stability.ai/demo/lora-training',
      },
      {
        title: '批量图像生成',
        content: '结合脚本实现批量图像生成，适合需要大量配图的内容创作者和设计师。',
        external_link: null,
      },
    ],
  },
  
  // 写作助手
  {
    category: 'writing-assistant',
    title: 'Jasper',
    url: 'https://www.jasper.ai',
    description: '专业的营销文案写作 AI 工具',
    visits: 2800,
    likes: 150,
    useCases: [
      {
        title: '广告文案创作',
        content: '输入产品信息和目标受众，Jasper 能自动生成多种风格的广告文案供选择和 A/B 测试。',
        external_link: 'https://www.jasper.ai/templates/ads',
      },
      {
        title: 'SEO 博客文章',
        content: '根据关键词和主题，自动生成符合 SEO 规范的博客文章，帮助网站获取搜索引擎流量。',
        external_link: 'https://www.jasper.ai/templates/blog-posts',
      },
    ],
  },
  {
    category: 'writing-assistant',
    title: 'Notion AI',
    url: 'https://www.notion.so',
    description: 'Notion 内置的 AI 写作助手，与笔记无缝集成',
    visits: 7200,
    likes: 520,
    useCases: [
      {
        title: '会议纪要自动整理',
        content: '在 Notion 中记录会议内容后，使用 AI 自动整理成结构化的会议纪要，提取行动项和决策点。',
        external_link: 'https://www.notion.so/ai/meeting-notes',
      },
      {
        title: '文档快速起草',
        content: '使用 /ai 命令快速生成项目文档、产品需求文档的初稿，大幅提升文档撰写效率。',
        external_link: 'https://www.notion.so/ai/document-generation',
      },
      {
        title: '头脑风暴助手',
        content: '与 AI 进行头脑风暴，获取创意点子、问题解决方案或项目计划建议。',
        external_link: null,
      },
    ],
  },
  {
    category: 'writing-assistant',
    title: 'Grammarly',
    url: 'https://www.grammarly.com',
    description: '专业的英语写作辅助工具，实时纠正语法和风格',
    visits: 9500,
    likes: 680,
    useCases: [
      {
        title: '学术论文英语润色',
        content: '使用 Grammarly 检查学术论文的语法错误，确保使用恰当的学术语体，提升论文被接收的概率。',
        external_link: 'https://www.grammarly.com/demo/academic',
      },
      {
        title: '商务邮件优化',
        content: '在发送重要商务邮件前使用 Grammarly 检查，确保语气恰当、表达清晰，提升专业形象。',
        external_link: 'https://www.grammarly.com/demo/business-email',
      },
    ],
  },
  
  // 编程工具
  {
    category: 'coding-tools',
    title: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    description: 'AI 编程助手，实时提供代码补全和建议',
    visits: 12000,
    likes: 850,
    useCases: [
      {
        title: '快速原型开发',
        content: '在项目原型阶段使用 Copilot 快速生成代码，将想法快速转化为可运行的代码原型。',
        external_link: 'https://github.com/features/copilot/demo/prototype',
      },
      {
        title: '学习新编程语言',
        content: '学习不熟悉的编程语言时，Copilot 提供代码示例和最佳实践，加速学习过程。',
        external_link: 'https://github.com/features/copilot/demo/learning',
      },
      {
        title: '单元测试编写',
        content: '编写业务代码后，让 Copilot 自动生成对应的单元测试代码，提升代码质量和测试覆盖率。',
        external_link: null,
      },
    ],
  },
  {
    category: 'coding-tools',
    title: 'Cursor',
    url: 'https://cursor.sh',
    description: 'AI 原生的代码编辑器，基于 VS Code 开发',
    visits: 4800,
    likes: 340,
    useCases: [
      {
        title: '全项目代码理解',
        content: '使用 Cursor 的 AI 功能理解整个项目代码结构，快速上手新项目或维护遗留代码。',
        external_link: 'https://cursor.sh/demo/codebase-understanding',
      },
      {
        title: '自然语言编程',
        content: '用自然语言描述功能需求，Cursor 自动生成实现代码，适合快速原型和产品开发。',
        external_link: 'https://cursor.sh/demo/natural-language',
      },
      {
        title: '代码重构',
        content: '选中需要重构的代码，让 Cursor AI 提供重构建议并自动执行，改善代码质量。',
        external_link: null,
      },
    ],
  },
  {
    category: 'coding-tools',
    title: 'Replit Ghostwriter',
    url: 'https://replit.com',
    description: '在线编程环境中的 AI 编程助手',
    visits: 3200,
    likes: 190,
    useCases: [
      {
        title: '编程教学辅助',
        content: '在编程教学过程中使用 Replit，学生可以在浏览器中直接编写代码并获得 AI 实时帮助。',
        external_link: 'https://replit.com/demo/education',
      },
      {
        title: '快速部署原型',
        content: '编写代码后直接在 Replit 中部署，无需配置服务器，快速验证想法。',
        external_link: 'https://replit.com/demo/deployment',
      },
    ],
  },
  
  // 视频制作
  {
    category: 'video-creation',
    title: 'Runway ML',
    url: 'https://runwayml.com',
    description: '专业级的 AI 视频编辑和生成工具',
    visits: 3800,
    likes: 260,
    useCases: [
      {
        title: '视频背景移除',
        content: '使用 Runway 的绿幕功能，无需真实绿幕即可移除视频背景，替换为任意场景。',
        external_link: 'https://runwayml.com/ai-magic-tools/green-screen',
      },
      {
        title: 'AI 视频生成',
        content: '输入文本描述或参考图片，Runway 生成高质量的视频片段，适合创意视频制作。',
        external_link: 'https://runwayml.com/ai-magic-tools/gen-2',
      },
    ],
  },
  {
    category: 'video-creation',
    title: 'Synthesia',
    url: 'https://www.synthesia.io',
    description: 'AI 数字人视频生成平台',
    visits: 2400,
    likes: 140,
    useCases: [
      {
        title: '企业内部培训视频',
        content: '使用 Synthesia 快速制作多语言的企业培训视频，无需聘请演员和摄影团队。',
        external_link: 'https://www.synthesia.io/demo/corporate-training',
      },
      {
        title: '产品演示视频',
        content: '创建由 AI 数字人讲解的产品介绍视频，适合营销网站和社交媒体推广。',
        external_link: 'https://www.synthesia.io/demo/product-demo',
      },
      {
        title: '个性化营销视频',
        content: '批量生成个性化的营销视频，为不同客户群体定制专属内容。',
        external_link: null,
      },
    ],
  },
  {
    category: 'video-creation',
    title: 'Pictory',
    url: 'https://pictory.ai',
    description: '将长文本转换为短视频的 AI 工具',
    visits: 1800,
    likes: 95,
    useCases: [
      {
        title: '博客文章转视频',
        content: '将现有博客文章输入 Pictory，自动生成配有字幕和背景音乐的短视频，适合社交媒体分发。',
        external_link: 'https://pictory.ai/demo/blog-to-video',
      },
      {
        title: '会议录制视频摘要',
        content: '上传会议录像，Pictory 提取关键内容生成简短的视频摘要，方便团队快速回顾。',
        external_link: null,
      },
    ],
  },
];

async function main() {
  console.log('开始创建丰富的测试数据...\n');

  // 创建分类
  console.log('=== 创建分类 ===');
  const categoryMap = {};
  for (const cat of categories) {
    const category = await prisma.category.create({
      data: cat,
    });
    categoryMap[cat.slug] = category.id;
    console.log(`✓ 分类: ${cat.name} (ID: ${category.id})`);
  }

  console.log('\n=== 创建网站和案例 ===');
  let totalWebsites = 0;
  let totalUseCases = 0;

  for (const siteData of websitesData) {
    // 创建网站
    const website = await prisma.website.create({
      data: {
        title: siteData.title,
        url: siteData.url,
        description: siteData.description,
        category_id: categoryMap[siteData.category],
        status: 'approved',
        active: 1,
        visits: siteData.visits,
        likes: siteData.likes,
        dislikes: Math.floor(Math.random() * 10),
      },
    });
    totalWebsites++;
    console.log(`\n✓ 网站: ${siteData.title} (ID: ${website.id})`);
    console.log(`  访问: ${siteData.visits}, 点赞: ${siteData.likes}`);

    // 创建关联的案例
    for (const caseData of siteData.useCases) {
      const useCase = await prisma.useCase.create({
        data: {
          title: caseData.title,
          content: caseData.content,
          website_id: website.id,
          status: 'published',
          external_link: caseData.external_link,
        },
      });
      totalUseCases++;
      const linkStatus = caseData.external_link ? '🔗' : '⛔';
      console.log(`  ✓ 案例: ${caseData.title} ${linkStatus}`);
    }
  }

  console.log('\n=== 数据创建完成 ===');
  console.log(`分类数量: ${categories.length}`);
  console.log(`网站数量: ${totalWebsites}`);
  console.log(`案例数量: ${totalUseCases}`);
  console.log('\n所有数据已成功添加到数据库！');
}

main()
  .catch((e) => {
    console.error('错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
