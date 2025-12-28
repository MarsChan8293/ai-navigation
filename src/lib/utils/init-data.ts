import { prisma } from '../db/db';
import { WebsiteSettings } from '../constraint';
import fs from 'fs';
import path from 'path';

const defaultCategories = [
  { id: 7, name: '需求研究', slug: 'ipd-requirement-research' },
  { id: 8, name: '需求分析', slug: 'ipd-requirement-analysis' },
  { id: 11, name: '架构设计', slug: 'ipd-design-architecture' },
  { id: 12, name: '概念设计', slug: 'ipd-design-concept' },
  { id: 16, name: '代码编写', slug: 'ipd-coding-code-write' },
  { id: 22, name: '构建清洗', slug: 'ipd-build-cleancode' },
  { id: 30, name: '测试设计', slug: 'ipd-test-test-design' },
  { id: 36, name: '发布实施', slug: 'ipd-release-release-publish' },
];

interface WebsiteInput {
  title: string;
  url: string;
  description: string;
  category_slug: string;
  thumbnail: string;
  status: 'pending' | 'approved' | 'rejected';
}

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
    for (const category of defaultCategories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      });
    }

    // 获取所有分类的映射
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(
      categories.map((c: any) => [c.slug, c.id])
    );

    // 读取网站数据
    const websitesPath = path.join(process.cwd(), 'data', 'websites.json');
    const websitesData = fs.readFileSync(websitesPath, 'utf-8');
    const defaultWebsites: WebsiteInput[] = JSON.parse(websitesData);

    // 初始化网站
    for (const website of defaultWebsites) {
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

    // 初始化页脚链接
    for (const link of defaultFooterLinks) {
      const existingLink = await prisma.footerLink.findUnique({
        where: { url: link.url }
      });

      if (existingLink) {
        await prisma.footerLink.update({
          where: { id: existingLink.id },
          data: link
        });
      } else {
        await prisma.footerLink.create({
          data: link
        });
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
    { key: WebsiteSettings.siteUrl, value: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
    { key: WebsiteSettings.siteEmail, value: process.env.SITE_EMAIL || 'admin@example.com' },
    { key: WebsiteSettings.siteCopyright, value: '© 2024 AI导航. All rights reserved.' },
    { key: WebsiteSettings.googleAnalytics, value: process.env.GOOGLE_ANALYTICS || '' },
    { key: WebsiteSettings.baiduAnalytics, value: process.env.BAIDU_ANALYTICS || '' },
  ];
  
  for (const setting of requiredSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
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
