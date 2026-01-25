const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3000/api';

async function fetchAPI(endpoint, options = {}) {
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

async function deleteAllWebsites() {
  console.log('正在获取所有网站...');
  const result = await fetchAPI('/websites');
  
  if (!result.success) {
    console.error('获取网站失败:', result.message);
    return;
  }

  const websites = result.data;
  console.log(`找到 ${websites.length} 个网站，开始删除...`);

  for (const website of websites) {
    await fetchAPI(`/websites/${website.id}`, {
      method: 'DELETE',
    });
    console.log(`已删除: ${website.title}`);
  }

  console.log('所有网站已删除');
}

function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const websites = [];
  let currentCategory = null;

  const categoryMap = {
    '一、AI 对话工具': 'ai-chat',
    '二、AI 模型社区': 'ai-hubs',
    '三、AI 编程助手': 'ai-coding',
    '四、AI 推理框架': 'ai-infra',
    '五、AI 智能代理': 'ai-agents',
    '六、AI 绘画设计': 'ai-art',
    '七、AI 办公助手': 'ai-office',
    '八、AI 智能搜索': 'ai-search',
    '九、AI 其他工具': 'ai-others',
  };

  for (const line of lines) {
    if (line.startsWith('### ')) {
      const headerText = line.replace('### ', '').trim();
      currentCategory = categoryMap[headerText];
      if (!currentCategory) {
        console.log(`  ⚠️  未找到分类映射: "${headerText}"`);
      }
      continue;
    }

    if (line.includes('**') && line.includes('-') && currentCategory) {
      const match = line.match(/\*\*([^*]+)\*\*\s*-\s*(.+)/);
      if (match) {
        const title = match[1].trim();
        const description = match[2].trim();
        websites.push({
          title,
          description,
          category_slug: currentCategory,
          url: '',
        });
      }
    }
  }

  console.log(`  解析出的网站数量: ${websites.length}`);
  console.log(`  前3个网站:`, websites.slice(0, 3).map(w => w.title));
  return websites;
}

async function fetchMetadata(url) {
  try {
    const result = await fetchAPI(`/metadata?url=${encodeURIComponent(url)}`);
    if (result.success && result.data) {
      return result.data;
    }
  } catch (error) {
    console.log(`  无法获取元数据: ${error.message}`);
  }
  return null;
}

async function importWebsitesFromMarkdown() {
  const markdownPath = path.join(__dirname, '../AI_NAV.md');
  const websites = parseMarkdownFile(markdownPath);
  
  console.log(`从 AI_NAV.md 解析出 ${websites.length} 个网站`);
  console.log('正在导入网站...\n');

  const categoryResult = await fetchAPI('/categories');
  const categories = categoryResult.data || [];
  const categoryMap = {};
  categories.forEach(c => categoryMap[c.slug] = c.id);

  const urlMap = {
    'ChatGPT (Top)': 'https://chat.openai.com',
    'DeepSeek (Top)': 'https://www.deepseek.com',
    'Claude (Top)': 'https://claude.ai',
    'Kimi (Top)': 'https://kimi.moonshot.cn',
    'Gemini': 'https://gemini.google.com',
    'Mistral / Le Chat': 'https://chat.mistral.ai',
    'Grok': 'https://x.ai',
    '豆包': 'https://www.doubao.com',
    'Hugging Face (Top)': 'https://huggingface.co',
    '魔搭社区 ModelScope (Top)': 'https://modelscope.cn',
    'OpenRouter (Top)': 'https://openrouter.ai',
    '昇腾': 'https://www.hiascend.com',
    'GitHub Copilot (Top)': 'https://github.com/features/copilot',
    'Cursor (Recommend)': 'https://www.cursor.com',
    'Windsurf (Recommend)': 'https://codeium.com/windsurf',
    'Claude Code (Top)': 'https://claude.ai/code',
    'Trae (Top)': 'https://www.trae.ai',
    'vLLM (Top)': 'https://github.com/vllm-project/vllm',
    'Ollama (Top)': 'https://ollama.com',
    'TensorRT-LLM (Top)': 'https://github.com/NVIDIA/TensorRT-LLM',
    'SGLang': 'https://github.com/sgl-project/sglang',
    'Mooncake/LMCache': 'https://github.com/kvcache-ai/Mooncake',
    'Dify (Top)': 'https://dify.ai',
    'Coze (扣子) (Top)': 'https://www.coze.cn',
    'LangGraph': 'https://www.langchain.com/langgraph',
    'n8n': 'https://n8n.io',
    'Midjourney (Top)': 'https://www.midjourney.com',
    'Flux.1 (Top)': 'https://blackforestlabs.ai',
    'Ideogram (Recommend)': 'https://ideogram.ai',
    'Stable Diffusion (Top)': 'https://stability.ai',
    'Adobe Firefly': 'https://firefly.adobe.com',
    'Gamma (Top)': 'https://gamma.app',
    'Notion AI (Top)': 'https://www.notion.so/product/ai',
    'Canva Magic Studio': 'https://www.canva.com/magic-studio',
    'WPS AI / Microsoft Copilot': 'https://ai.wps.cn',
    'Perplexity (Top)': 'https://www.perplexity.ai',
    'Genspark (Top)': 'https://www.genspark.ai',
    'Felo': 'https://felo.ai',
    '秘塔 AI 搜索': 'https://metaso.cn',
    'Kling 可灵': 'https://klingai.com',
    'Runway Gen-3 Alpha': 'https://runwayml.com',
    'Luma Dream Machine': 'https://lumalabs.ai/dream-machine',
    'Minimax / 海螺视频': 'https://hailuo.ai',
    'Sora': 'https://openai.com/sora',
    'Suno': 'https://suno.com',
    'Udio': 'https://udio.com',
    'ElevenLabs': 'https://elevenlabs.io',
    'DeepL': 'https://www.deepl.com',
    '沉浸式翻译': 'https://immersive-translate.owenyoung.com',
    'Trancy': 'https://trancy.org',
  };

  for (const website of websites) {
    const categoryId = categoryMap[website.category_slug];
    
    if (!categoryId) {
      console.log(`⚠️  跳过 "${website.title}" - 分类 "${website.category_slug}" 不存在`);
      continue;
    }

    const url = urlMap[website.title] || `https://example.com/${encodeURIComponent(website.title)}`;

    console.log(`导入: ${website.title}`);
    
    const payload = {
      title: website.title,
      url: url,
      description: website.description,
      category_id: categoryId,
      status: 'approved',
    };

    await fetchAPI('/websites', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  console.log('\n导入完成!');
}

async function main() {
  console.log('=== AI 导航网站导入工具 ===\n');
  
  await deleteAllWebsites();
  console.log('\n' + '='.repeat(40) + '\n');
  await importWebsitesFromMarkdown();
}

main().catch(console.error);
