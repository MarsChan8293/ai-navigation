// API 测试脚本
const fetch = require('node-fetch');
const API_BASE_URL = 'http://localhost:3000/api';

// 测试结果对象
const testResults = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  results: []
};

// 测试用例类
class TestCase {
  constructor(name, endpoint, method, expectedStatus, testFn) {
    this.name = name;
    this.endpoint = endpoint;
    this.method = method;
    this.expectedStatus = expectedStatus;
    this.testFn = testFn;
  }

  async run() {
    testResults.totalTests++;
    let result = {
      name: this.name,
      endpoint: this.endpoint,
      method: this.method,
      expectedStatus: this.expectedStatus,
      actualStatus: null,
      passed: false,
      error: null,
      responseData: null
    };

    try {
      const response = await this.testFn();
      result.actualStatus = response.status;
      
      // 检查响应体是否已经被读取
      if (!response.bodyUsed) {
        try {
          result.responseData = await response.json();
        } catch (error) {
          // 如果无法解析为JSON，可能是其他格式或空响应
          result.responseData = null;
        }
      }
      
      if (response.status === this.expectedStatus) {
        result.passed = true;
        testResults.passedTests++;
      } else {
        result.error = `Expected status ${this.expectedStatus}, got ${response.status}`;
        testResults.failedTests++;
      }
    } catch (error) {
      result.error = error.message;
      testResults.failedTests++;
    }

    testResults.results.push(result);
    return result;
  }
}

// 测试用例集合
const testCases = [];

// 通用请求函数
const makeRequest = async (endpoint, method = 'GET', body = null, headers = {}) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // 使用导入的fetch函数
  return fetch(`${API_BASE_URL}${endpoint}`, options);
};

// 1. 登录API测试
// 正面测试
 testCases.push(new TestCase(
  '登录 - 正确密码',
  '/login',
  'POST',
  200,
  () => makeRequest('/login', 'POST', { password: '123456' })
));

// 负面测试
 testCases.push(new TestCase(
  '登录 - 错误密码',
  '/login',
  'POST',
  401,
  () => makeRequest('/login', 'POST', { password: 'wrong-password' })
));

testCases.push(new TestCase(
  '登录 - 缺少密码',
  '/login',
  'POST',
  401,
  () => makeRequest('/login', 'POST', {})
));

// 2. 网站API测试
// 2.1 获取网站列表
// 正面测试
 testCases.push(new TestCase(
  '获取网站列表 - 默认状态（approved）',
  '/websites',
  'GET',
  200,
  () => makeRequest('/websites')
));

testCases.push(new TestCase(
  '获取网站列表 - 所有状态',
  '/websites?status=all',
  'GET',
  200,
  () => makeRequest('/websites?status=all')
));

testCases.push(new TestCase(
  '获取网站列表 - 待审核状态',
  '/websites?status=pending',
  'GET',
  200,
  () => makeRequest('/websites?status=pending')
));

// 2.2 创建网站
// 正面测试
 testCases.push(new TestCase(
  '创建网站 - 有效数据',
  '/websites',
  'POST',
  200,
  () => makeRequest('/websites', 'POST', {
    title: 'Test Website ' + Date.now(),
    url: 'https://testwebsite' + Date.now() + '.com',
    category_id: 1,
    thumbnail: 'https://example.com/thumbnail.jpg',
    description: 'This is a test website'
  })
));

// 负面测试
 testCases.push(new TestCase(
  '创建网站 - 缺少必填字段',
  '/websites',
  'POST',
  400,
  () => makeRequest('/websites', 'POST', {
    title: 'Test Website'
    // 缺少 url 和 category_id
  })
));

testCases.push(new TestCase(
  '创建网站 - 无效URL格式',
  '/websites',
  'POST',
  400,
  () => makeRequest('/websites', 'POST', {
    title: 'Test Website',
    url: 'invalid-url',
    category_id: 1
  })
));

testCases.push(new TestCase(
  '创建网站 - 不存在的分类',
  '/websites',
  'POST',
  400,
  () => makeRequest('/websites', 'POST', {
    title: 'Test Website',
    url: 'https://testwebsite.com',
    category_id: 9999 // 不存在的分类ID
  })
));

// 2.3 获取单个网站
// 正面测试
 testCases.push(new TestCase(
  '获取单个网站 - 有效ID',
  '/websites/1',
  'GET',
  200,
  () => makeRequest('/websites/1')
));

// 负面测试
 testCases.push(new TestCase(
  '获取单个网站 - 无效ID',
  '/websites/9999',
  'GET',
  404,
  () => makeRequest('/websites/9999')
));

testCases.push(new TestCase(
  '获取单个网站 - 非数字ID',
  '/websites/abc',
  'GET',
  500,
  () => makeRequest('/websites/abc')
));

// 2.4 更新网站
// 正面测试
 testCases.push(new TestCase(
  '更新网站 - 有效数据',
  '/websites/1',
  'PUT',
  200,
  () => makeRequest('/websites/1', 'PUT', {
    title: 'Updated Website',
    url: 'https://updatedwebsite.com',
    category_id: 1,
    description: 'Updated description'
  })
));

// 负面测试
 testCases.push(new TestCase(
  '更新网站 - 缺少必填字段',
  '/websites/1',
  'PUT',
  400,
  () => makeRequest('/websites/1', 'PUT', {
    title: 'Updated Website'
    // 缺少 url 和 category_id
  })
));

testCases.push(new TestCase(
  '更新网站 - 无效ID',
  '/websites/9999',
  'PUT',
  404,
  () => makeRequest('/websites/9999', 'PUT', {
    title: 'Updated Website',
    url: 'https://updatedwebsite.com',
    category_id: 1
  })
));

// 2.5 删除网站
// 正面测试（注意：这会删除实际数据，谨慎运行）
// testCases.push(new TestCase(
//   '删除网站 - 有效ID',
//   '/websites/2',
//   'DELETE',
//   200,
//   () => makeRequest('/websites/2', 'DELETE')
// ));

// 负面测试
 testCases.push(new TestCase(
  '删除网站 - 无效ID',
  '/websites/9999',
  'DELETE',
  404,
  () => makeRequest('/websites/9999', 'DELETE')
));

// 2.6 检查网站活跃度
// 正面测试
 testCases.push(new TestCase(
  '检查网站活跃度 - 有效URL',
  '/websites/active',
  'POST',
  200,
  () => makeRequest('/websites/active', 'POST', {
    url: 'https://example.com',
    id: 1
  })
));

// 负面测试
 testCases.push(new TestCase(
  '检查网站活跃度 - 缺少URL',
  '/websites/active',
  'POST',
  200,
  () => makeRequest('/websites/active', 'POST', {
    id: 1
    // 缺少 url
  })
));

testCases.push(new TestCase(
  '检查网站活跃度 - 无效ID',
  '/websites/active',
  'POST',
  400,
  () => makeRequest('/websites/active', 'POST', {
    url: 'https://example.com',
    id: 'invalid-id'
  })
));

// 2.7 点赞网站
// 正面测试
 testCases.push(new TestCase(
  '点赞网站 - 有效ID',
  '/websites/1/like',
  'POST',
  200,
  () => makeRequest('/websites/1/like', 'POST')
));

// 2.8 取消点赞网站
// 正面测试
 testCases.push(new TestCase(
  '取消点赞网站 - 有效ID',
  '/websites/1/like',
  'DELETE',
  200,
  () => makeRequest('/websites/1/like', 'DELETE')
));

// 2.9 更新网站状态
// 正面测试
 testCases.push(new TestCase(
  '更新网站状态 - 有效状态',
  '/websites/1/status',
  'PUT',
  200,
  () => makeRequest('/websites/1/status', 'PUT', {
    status: 'approved'
  })
));

// 2.10 增加网站访问量
// 正面测试
 testCases.push(new TestCase(
  '增加网站访问量 - 有效ID',
  '/websites/1/visit',
  'POST',
  200,
  () => makeRequest('/websites/1/visit', 'POST')
));

// 3. 分类API测试
// 3.1 获取所有分类
// 正面测试
 testCases.push(new TestCase(
  '获取所有分类 - 正常情况',
  '/categories',
  'GET',
  200,
  () => makeRequest('/categories')
));

// 3.2 创建分类
// 正面测试
 testCases.push(new TestCase(
  '创建分类 - 有效数据',
  '/categories',
  'POST',
  200,
  () => makeRequest('/categories', 'POST', {
    name: 'Test Category ' + Date.now(),
    slug: 'test-category-' + Date.now()
  })
));

// 3.3 更新分类
// 正面测试
 testCases.push(new TestCase(
  '更新分类 - 有效数据',
  '/categories/1',
  'PUT',
  200,
  () => makeRequest('/categories/1', 'PUT', {
    name: 'Updated Category',
    slug: 'updated-category'
  })
));

// 3.4 删除分类
// 负面测试（分类下有网站时）
 testCases.push(new TestCase(
  '删除分类 - 分类下有网站',
  '/categories/1',
  'DELETE',
  400,
  () => makeRequest('/categories/1', 'DELETE')
));

// 4. 页脚链接API测试
// 4.1 获取所有页脚链接
// 正面测试
 testCases.push(new TestCase(
  '获取所有页脚链接 - 正常情况',
  '/footer-links',
  'GET',
  200,
  () => makeRequest('/footer-links')
));

// 4.2 创建页脚链接
// 正面测试
 testCases.push(new TestCase(
  '创建页脚链接 - 有效数据',
  '/footer-links',
  'POST',
  200,
  () => makeRequest('/footer-links', 'POST', {
    title: 'Test Link',
    url: 'https://testlink.com'
  })
));

// 负面测试
 testCases.push(new TestCase(
  '创建页脚链接 - 无效URL',
  '/footer-links',
  'POST',
  200,
  async () => {
    // 使用一个绝对无效的URL
    const response = await makeRequest('/footer-links', 'POST', {
      title: 'Test Link',
      url: 'invalid-url://'
    });
    const data = await response.json();
    return response;
  }
));

// 5. 管理员API测试
// 5.1 更新缩略图
// 正面测试
 testCases.push(new TestCase(
  '更新缩略图 - 正常情况',
  '/admin/update-thumbnails',
  'POST',
  200,
  () => makeRequest('/admin/update-thumbnails', 'POST')
));

// 运行所有测试用例
async function runAllTests() {
  console.log('开始运行API测试...');
  console.log(`测试API基础URL: ${API_BASE_URL}`);
  console.log('====================================');

  for (const testCase of testCases) {
    const result = await testCase.run();
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
    if (!result.passed) {
      console.log(`   失败原因: ${result.error}`);
      console.log(`   端点: ${result.method} ${result.endpoint}`);
      console.log(`   预期状态: ${result.expectedStatus}, 实际状态: ${result.actualStatus}`);
    }
  }

  console.log('====================================');
  console.log('测试结果汇总:');
  console.log(`总测试数: ${testResults.totalTests}`);
  console.log(`通过测试数: ${testResults.passedTests}`);
  console.log(`失败测试数: ${testResults.failedTests}`);
  console.log(`通过率: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(2)}%`);

  // 保存测试报告
  const fs = require('fs');
  const reportPath = './tests/api-test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n测试报告已保存到: ${reportPath}`);

  // 生成HTML报告
  generateHtmlReport();
}

// 生成HTML报告
function generateHtmlReport() {
  const fs = require('fs');
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API测试报告</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    .summary { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .test-result { margin-bottom: 10px; padding: 10px; border-radius: 5px; }
    .passed { background-color: #d4edda; color: #155724; }
    .failed { background-color: #f8d7da; color: #721c24; }
    .test-details { margin-left: 20px; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>API测试报告</h1>
  <div class="summary">
    <p>测试时间: ${new Date().toLocaleString()}</p>
    <p>总测试数: ${testResults.totalTests}</p>
    <p>通过测试数: ${testResults.passedTests}</p>
    <p>失败测试数: ${testResults.failedTests}</p>
    <p>通过率: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(2)}%</p>
  </div>
  <h2>测试用例结果</h2>
  ${testResults.results.map(result => `
    <div class="test-result ${result.passed ? 'passed' : 'failed'}">
      <strong>${result.name}</strong> (${result.method} ${result.endpoint})
      <div class="test-details">
        <p>预期状态: ${result.expectedStatus}, 实际状态: ${result.actualStatus}</p>
        ${result.error ? `<p>错误信息: ${result.error}</p>` : ''}
      </div>
    </div>
  `).join('')}
</body>
</html>
  `;
  fs.writeFileSync('./tests/api-test-report.html', html);
  console.log(`HTML测试报告已保存到: ./tests/api-test-report.html`);
}

// 运行测试
runAllTests().catch(error => {
  console.error('测试运行失败:', error);
  process.exit(1);
});
