import { prisma } from "@/lib/db/db";
import type { Website, Category } from "@/lib/types";

export interface SettingsObject {
  title: string;
  description: string;
  keywords: string;
  logo: string;
  siteIcp: string;
  siteFooter: string;
  allowSubmissions: string;
  requireApproval: string;
  itemsPerPage: string;
  adminPassword: string;
  siteUrl: string;
  siteEmail: string;
  siteCopyright: string;
  googleAnalytics: string;
  baiduAnalytics: string;
  copyright: string;
}

export async function getWebsites(): Promise<Website[]> {
  try {
    const websites = await prisma.website.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return websites as Website[];
  } catch (error) {
    console.error("Error fetching websites:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return categories as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getSettings(): Promise<SettingsObject | null> {
  try {
    // 获取所有设置
    const settings = await prisma.setting.findMany({
      select: {
        id: true,
        key: true,
        value: true,
      },
    });

    // 转换为对象格式
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    console.log(settingsObject);

    return settingsObject as unknown as SettingsObject;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}
