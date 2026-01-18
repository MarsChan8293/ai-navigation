import { prisma } from "@/lib/prisma";
import { RankingsClient } from "@/components/website/rankings-client";
import { cachedPrismaQuery } from "@/lib/db/cache";

// 使用ISR（增量静态再生）
export const revalidate = 3600; // 每小时重新生成页面

export default async function RankingsPage() {
  const websites = await cachedPrismaQuery(
    "rankings-websites",
    () =>
      prisma.website.findMany({
        where: {
          status: "approved",
        },
        orderBy: [{ visits: "desc" }, { likes: "desc" }],
        // 只选择必要的字段
        select: {
          id: true,
          title: true,
          url: true,
          description: true,
          visits: true,
          likes: true,
        },
      }),
    { ttl: 3600 } // 1小时缓存
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div className="max-w-4xl mx-auto">
            <RankingsClient websites={websites} />
          </div>
        </div>
      </div>
    </div>
  );
}
