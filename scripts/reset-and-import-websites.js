const API_BASE = 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  return response.json();
}

async function getAllWebsites() {
  return await request('/websites');
}

async function deleteWebsite(id) {
  return await request(`/websites/${id}`, { method: 'DELETE' });
}

async function getAllCategories() {
  return await request('/categories');
}

async function createWebsite(data) {
  return await request('/websites', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function updateWebsiteStatus(id, status) {
  return await request(`/websites/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

async function main() {
  console.log('🚀 开始执行网站数据重置任务...\n');

  const websitesData = {
    'AI 对话工具': [
      { title: 'ChatGPT', url: 'https://chatgpt.com', description: 'OpenAI 旗舰产品，全球领先的通用 AI，插件与 GPTs 生态丰富。' },
      { title: 'DeepSeek', url: 'https://www.deepseek.com', description: '国内技术代表，逻辑推理与代码能力极强，价格极具竞争力的国产之光。' },
      { title: 'Claude', url: 'https://claude.ai', description: '以长文本理解和安全性著称，代码生成与创意文案质量公认第一。' },
      { title: 'Kimi', url: 'https://kimi.moonshot.cn', description: '国产长文本处理的先行者，支持超长上下文阅读与联网搜索。' },
      { title: 'Gemini', url: 'https://gemini.google.com', description: 'Google 旗下的多模态先行者，深度集成 Google Workspace 与 Android 生态。' },
      { title: 'Grok', url: 'https://x.ai', description: 'X (Twitter) 旗下 AI，主打实时社交数据获取与无限制的对话风格。' },
      { title: '豆包', url: 'https://www.doubao.com', description: '字节跳动旗下，语音交互体验极佳，国内移动端用户基数庞大。' },
    ],
    'AI 模型社区': [
      { title: 'Hugging Face', url: 'https://huggingface.co', description: '全球 AI 开源界的事实标准，"AI 版 GitHub"，托管百万级模型与数据集。' },
      { title: '魔搭社区 ModelScope', url: 'https://modelscope.cn', description: '阿里支持的国内最大开源模型社区，针对国产硬件有深度优化。' },
      { title: 'OpenRouter', url: 'https://openrouter.ai', description: '聚合全球顶尖大模型的一站式 API 平台，支持按量计费与无缝切换。' },
      { title: '昇腾', url: 'https://www.hiascend.com', description: '华为主导的国产算力平台，提供从硬件到开发框架的全栈 AI 生态。' },
    ],
    'AI 编程助手': [
      { title: 'GitHub Copilot', url: 'https://github.com/features/copilot', description: '微软与 OpenAI 联手打造，依然是目前集成度最高、生态最稳的标杆。' },
      { title: 'Cursor', url: 'https://cursor.com', description: '开发者公认的 Top 1 AI 编辑器，原生 AI 集成彻底改变编程工作流。' },
      { title: 'Windsurf', url: 'https://codeium.com/windsurf', description: 'Codeium 推出的首个 Agentic IDE，具备极强的上下文感知与自主修复能力。' },
      { title: 'Claude Code', url: 'https://anthropic.com/claude-code', description: 'Anthropic 推出的命令行编程助手，解决复杂工程问题的能力惊人。' },
      { title: 'Trae', url: 'https://www.trae.ai', description: '字节跳动推出的 AI 编程新秀，主打"自适应学习"与原生中文支持。' },
    ],
    'AI 推理框架': [
      { title: 'vLLM', url: 'https://github.com/vllm-project/vllm', description: '目前最主流的开源大模型高性能推理引擎，高吞吐量与节省显存的首选。' },
      { title: 'Ollama', url: 'https://ollama.com', description: '本地运行大模型的最简单、最流行工具，支持一键部署各种开源模型。' },
      { title: 'TensorRT-LLM', url: 'https://github.com/NVIDIA/TensorRT-LLM', description: 'NVIDIA 官方加速库，针对英伟达显卡提供极致的硬件性能优化。' },
      { title: 'SGLang', url: 'https://github.com/sgl-project/sglang', description: '优秀的结构化生成框架，在处理长文本与复杂 Prompt 时推理速度极快。' },
      { title: 'Mooncake/LMCache', url: 'https://github.com/kvcache-ai/Mooncake', description: '专注于 KVCache 优化，显著降低超长对话的推理成本与延迟。' },
    ],
    'AI 智能代理': [
      { title: 'Dify', url: 'https://dify.ai', description: '最流行的开源 LLM 应用开发平台，支持可视化的工作流编排与模型管理。' },
      { title: 'Coze (扣子)', url: 'https://www.coze.cn', description: '字节出品，拥有极其丰富的插件与工作流组件，Agent 搭建门槛最低。' },
      { title: 'LangGraph', url: 'https://langchain.com/langgraph', description: 'LangChain 团队推出的有向无环图框架，是构建复杂、有状态 Agent 的工业级选择。' },
      { title: 'n8n', url: 'https://n8n.io', description: '支持上千种集成的自动化工作流平台，通过 AI 节点可轻松连接现有业务系统。' },
    ],
    'AI 绘画设计': [
      { title: 'Midjourney', url: 'https://www.midjourney.com', description: '艺术表现力与设计感的天花板，风格极其多样且审美在线。' },
      { title: 'Flux.1', url: 'https://blackforestlabs.ai', description: '2025 年最强开源黑马，人物手部、身体结构及图片文字渲染效果惊人。' },
      { title: 'Ideogram', url: 'https://ideogram.ai', description: '图像内文本渲染领域的世界第一，世界第一，平面设计与海报生成的专业选。' },
      { title: 'Stable Diffusion', url: 'https://stability.ai', description: '自由度最高的开源方案，支持插件扩展、深度定制与本地离线部署。' },
      { title: 'Adobe Firefly', url: 'https://www.adobe.com/products/firefly.html', description: '唯一大规模商用合规的 AI，深度集成于 Photoshop，提供强大的填充与修改能力。' },
    ],
    'AI 办公助手': [
      { title: 'Gamma', url: 'https://gamma.app', description: '重新定义演示文稿，只需一个大纲或描述即可生成精美、交互式的页面。' },
      { title: 'Notion AI', url: 'https://www.notion.so/product/ai', description: '嵌入式 AI 助手，擅长整理会议纪要、润色文档、头脑风暴及翻译列表。' },
      { title: 'Canva Magic Studio', url: 'https://www.canva.com/magic-studio/', description: '设计小白的创意创意中心，自动排版、扩图、去背景等 AI 功能极大提升作图效率。' },
      { title: 'WPS AI / Microsoft Copilot', url: 'https://ai.wps.cn', description: '深度集成在 Office 套件中，自动化处理表格、文档与幻灯片生成。' },
    ],
    'AI 智能搜索': [
      { title: 'Perplexity', url: 'https://www.perplexity.ai', description: '重新定义搜索，直接给出带权威信源引用的答案，彻底告别广告干扰。' },
      { title: 'Genspark', url: 'https://www.genspark.ai', description: '搜索即生成，自动为你的查询聚合所有相关信息并生成精美的专题网页。' },
      { title: 'Felo', url: 'https://felo.ai', description: '国内出海的热门搜索，内置极强的跨语言翻译搜索能力，一键阅读全球一手资料。' },
      { title: '秘塔 AI 搜索', url: 'https://metaso.cn', description: '国内学术与深度调研的首选，支持结构化思维导图展示与大规模文档参考。' },
    ],
    'AI 其他工具': [
      { title: '沉浸式翻译', url: 'https://immersive-translate.com', description: '浏览器必备插件，支持双语对照、电子书翻译，极大提升外语阅读效率。' },
    ],
  };

  console.log('📋 步骤 1: 获取当前所有网站...');
  const websitesResponse = await getAllWebsites();
  if (!websitesResponse.success) {
    console.error('�❌ 获取网站列表失败:', websitesResponse.message);
    process.exit(1);
  }
  const allWebsites = websitesResponse.data;
  console.log(`✅ 当前共有 ${allWebsites.length} 个网站\n`);

  if (allWebsites.length > 0) {
    console.log('🗑️  步骤 2: 删除所有网站...');
    for (const website of allWebsites) {
      const deleteResponse = await deleteWebsite(website.id);
      if (deleteResponse.success) {
        console.log(`   ✓ 已删除: ${website.title}`);
      } else {
        console.error(`   ✗ 删除失败: ${website.title} - ${deleteResponse.message}`);
      }
    }
    console.log('✅ 所有网站已删除\n');
  }

  console.log('📂 步骤 3: 获取分类列表...');
  const categoriesResponse = await getAllCategories();
  if (!categoriesResponse.success) {
    console.error('❌ 获取分类列表失败:', categoriesResponse.message);
    process.exit(1);
  }
  const categories = categoriesResponse.data;
  console.log(`✅ 找到 ${categories.length} 个分类\n`);

  const categoryMap = {};
  for (const cat of categories) {
    categoryMap[cat.name] = cat.id;
  }

  console.log('➕ 步骤 4: 批量添加新网站...');
  let totalAdded = 0;

  for (const [categoryName, websites] of Object.entries(websitesData)) {
    const categoryId = categoryMap[categoryName];
    if (!categoryId) {
      console.warn(`⚠️  警告: 未找到分类 "${categoryName}"，跳过该分类下的 ${websites.length} 个网站`);
      continue;
    }

    console.log(`\n📁 分类: ${categoryName} (${categoryId})`);

    for (const website of websites) {
      console.log(`   ➕ 添加: ${website.title}`);
      
      const createResponse = await createWebsite({
        title: website.title,
        url: website.url,
        description: website.description,
        category_id: categoryId,
      });

      if (createResponse.success) {
        totalAdded++;
        const websiteId = createResponse.data.id;
        
        await updateWebsiteStatus(websiteId, 'approved');
        
        console.log(`      ✓ 成功 (ID: ${websiteId})`);
      } else {
        console.error(`      ✗ 失败: ${createResponse.message}`);
      }
    }
  }

  console.log('\n🎉 任务完成!');
  console.log(`   总共添加: ${totalAdded} 个网站`);
  console.log('\n💡 提示: 运行以下命令更新网站缩略图:');
  console.log('   curl -X POST http://localhost:3000/api/admin/update-thumbnails');
}

main().catch(console.error);
