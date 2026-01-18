import { prisma } from "@/lib/db/db";
import HomePage from "@/app/home-page";
import { cachedPrismaQuery } from "@/lib/db/cache";

// 使用ISR（增量静态再生）替代force-dynamic
export const revalidate = 3600; // 每小时重新生成页面

export default async function Home() {
  const startTime = Date.now();

  // 在服务端获取初始数据，使用缓存，只选择需要的字段
  const [websitesData, categoriesData] = await Promise.all([
    cachedPrismaQuery(
      "approved-websites",
      () =>
        prisma.website.findMany({
          where: { status: "approved" },
          select: {
            id: true,
            title: true,
            url: true,
            description: true,
            category_id: true,
            thumbnail: true,
            thumbnail_base64: true,
            status: true,
            visits: true,
            likes: true,
            active: true,
          },
        }),
      { ttl: 86400 } // 1天缓存（秒）
    ),
    cachedPrismaQuery(
      "all-categories",
      () =>
        prisma.category.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            // @ts-ignore
            likes: true,
          },
        }),
      { ttl: 604800 } // 1周缓存（秒）
    ),
  ]);

  const endTime = Date.now();
  console.log(`数据加载耗时: ${endTime - startTime}ms`);

  // 预处理数据，减少客户端计算
  const preFilteredWebsites = websitesData.map((website) => ({
    ...website,
    status: website.status as "approved" | "pending" | "rejected" | "all",
    searchText: `${website.title.toLowerCase()} ${website.description.toLowerCase()}`,
  }));

  return (
    <HomePage
      initialWebsites={preFilteredWebsites}
      initialCategories={categoriesData as any}
      categorySlug="all"
    />
  );
}
