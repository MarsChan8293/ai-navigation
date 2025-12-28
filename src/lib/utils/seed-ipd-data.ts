import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedIPDData() {
  console.log("Starting IPD data seeding...");

  // 清除现有IPD数据
  await prisma.iPDWebsite.deleteMany();
  await prisma.iPDStage.deleteMany();
  await prisma.iPDPhase.deleteMany();

  // 创建IPD阶段
  const phases = [
    {
      name: "IPD流程",
      slug: "ipd-process",
      order_num: 1,
      color: "#475569",
      stages: [
        { name: "需求阶段", order_num: 1, bg_color: "white", is_important: false },
        { name: "设计阶段", order_num: 2, bg_color: "white", is_important: false },
        { name: "编码阶段", order_num: 3, bg_color: "white", is_important: false },
        { name: "需求串讲&反串讲", order_num: 4, bg_color: "white", is_important: false },
      ],
    },
    {
      name: "需求分析",
      slug: "requirement-analysis",
      order_num: 2,
      color: "#2563eb",
      stages: [
        { name: "需求调研", order_num: 1, bg_color: "white", is_important: false },
        { name: "需求分析", order_num: 2, bg_color: "light_yellow", is_important: false },
        { name: "需求编写", order_num: 3, bg_color: "light_yellow", is_important: false },
      ],
    },
    {
      name: "设计",
      slug: "design",
      order_num: 3,
      color: "#9333ea",
      stages: [
        { name: "架构设计", order_num: 1, bg_color: "light_yellow", is_important: true },
        { name: "概要设计", order_num: 2, bg_color: "light_yellow", is_important: false },
        { name: "详细设计", order_num: 3, bg_color: "light_yellow", is_important: true },
        { name: "设计评审", order_num: 4, bg_color: "white", is_important: false },
        { name: "网络安全设计", order_num: 5, bg_color: "white", is_important: false },
      ],
    },
    {
      name: "开发&测试",
      slug: "development-testing",
      order_num: 4,
      color: "#4f46e5",
      stages: [
        { name: "代码编写", order_num: 1, bg_color: "light_green", is_important: true },
        { name: "代码走读", order_num: 2, bg_color: "navy", is_important: false },
        { name: "代码检视", order_num: 3, bg_color: "light_green", is_important: true },
        { name: "单元测试", order_num: 4, bg_color: "light_green", is_important: true },
        { name: "代码联调", order_num: 5, bg_color: "navy", is_important: false },
        { name: "问题单修改", order_num: 6, bg_color: "light_yellow", is_important: false },
      ],
    },
    {
      name: "发布&部署",
      slug: "release-deployment",
      order_num: 5,
      color: "#059669",
      stages: [
        { name: "Cleancode门禁检查", order_num: 1, bg_color: "white", is_important: false },
        { name: "构建脚本编写", order_num: 2, bg_color: "white", is_important: true },
        { name: "测试用例编写", order_num: 3, bg_color: "white", is_important: true },
        { name: "自动化脚本编写", order_num: 4, bg_color: "white", is_important: true },
        { name: "个人构建", order_num: 5, bg_color: "white", is_important: false },
        { name: "每日构建", order_num: 6, bg_color: "navy", is_important: false },
        { name: "版本级构建", order_num: 7, bg_color: "navy", is_important: false },
        { name: "冒烟测试", order_num: 8, bg_color: "navy", is_important: false },
        { name: "开源漏洞扫描", order_num: 9, bg_color: "navy", is_important: false },
        { name: "版本发布上网", order_num: 10, bg_color: "white", is_important: true },
        { name: "部署上线", order_num: 11, bg_color: "white", is_important: false },
        { name: "技术支持、运维", order_num: 12, bg_color: "light_yellow", is_important: true },
        { name: "网上问题修改", order_num: 13, bg_color: "light_yellow", is_important: false },
        { name: "版本测试", order_num: 14, bg_color: "navy", is_important: false },
        { name: "提交问题单", order_num: 15, bg_color: "navy", is_important: false },
        { name: "漏测分析", order_num: 16, bg_color: "navy", is_important: false },
      ],
    },
  ];

  // 创建阶段和子阶段
  for (const phaseData of phases) {
    const { stages, ...phaseInfo } = phaseData;
    const phase = await prisma.iPDPhase.create({
      data: {
        ...phaseInfo,
        stages: {
          create: stages,
        },
      },
      include: {
        stages: true,
      },
    });
    console.log(`Created phase: ${phase.name} with ${phase.stages.length} stages`);
  }

  // 添加示例网站（可选）
  const exampleWebsites = [
    {
      stageName: "需求调研",
      websites: [
        {
          title: "问卷星",
          url: "https://www.wjx.cn/",
          description: "在线问卷调查平台",
          order_num: 1,
        },
        {
          title: "腾讯问卷",
          url: "https://wj.qq.com/",
          description: "腾讯旗下问卷调查工具",
          order_num: 2,
        },
      ],
    },
    {
      stageName: "架构设计",
      websites: [
        {
          title: "ProcessOn",
          url: "https://www.processon.com/",
          description: "在线流程图、架构图绘制工具",
          order_num: 1,
        },
        {
          title: "Draw.io",
          url: "https://app.diagrams.net/",
          description: "免费在线绘图工具",
          order_num: 2,
        },
      ],
    },
    {
      stageName: "代码编写",
      websites: [
        {
          title: "GitHub",
          url: "https://github.com/",
          description: "全球最大的代码托管平台",
          order_num: 1,
        },
        {
          title: "GitLab",
          url: "https://gitlab.com/",
          description: "开源的代码托管和CI/CD平台",
          order_num: 2,
        },
      ],
    },
    {
      stageName: "代码检视",
      websites: [
        {
          title: "SonarQube",
          url: "https://www.sonarqube.org/",
          description: "代码质量管理平台",
          order_num: 1,
        },
      ],
    },
  ];

  // 添加示例网站到对应的阶段
  for (const example of exampleWebsites) {
    const stage = await prisma.iPDStage.findFirst({
      where: { name: example.stageName },
    });

    if (stage) {
      for (const website of example.websites) {
        await prisma.iPDWebsite.create({
          data: {
            ...website,
            stage_id: stage.id,
          },
        });
      }
      console.log(`Added ${example.websites.length} websites to stage: ${example.stageName}`);
    }
  }

  console.log("IPD data seeding completed!");
}

async function main() {
  try {
    await seedIPDData();
  } catch (error) {
    console.error("Error seeding IPD data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
