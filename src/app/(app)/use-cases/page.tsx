import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/ui/common/button";
import { UseCaseCard } from "@/components/use-cases/use-case-card";
import type { UseCase } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function UseCasesPage() {
  const useCases = await prisma.useCase.findMany({
    where: { status: "published" },
    orderBy: { created_at: "desc" },
    include: {
      website: {
        select: {
          id: true,
          title: true,
          url: true,
          thumbnail: true,
          thumbnail_base64: true,
        },
      },
    },
  });

  const normalized: UseCase[] = useCases.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    image_base64: item.image_base64,
    status: item.status as "published" | "draft",
    website_id: item.website_id,
    website: item.website ? {
      id: item.website.id,
      title: item.website.title,
      url: item.website.url,
      description: "",
      category_id: 0,
      thumbnail: item.website.thumbnail,
      thumbnail_base64: item.website.thumbnail_base64,
      active: 1,
      status: "approved",
      visits: 0,
      likes: 0,
      dislikes: 0,
    } : undefined,
    created_at: item.created_at.toISOString(),
  }));

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-10">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              使用案例
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              真实场景分享，快速了解工具落地效果
            </p>
          </div>
          <Link href="/use-cases/submit">
            <Button className="h-10 px-5">发布新案例</Button>
          </Link>
        </div>

        {normalized.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-background/40 p-10 text-center text-muted-foreground">
            暂无案例，欢迎发布你的第一条分享
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {normalized.map((useCase) => (
              <UseCaseCard key={useCase.id} useCase={useCase} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
