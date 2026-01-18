import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/ui/common/button";
import { UseCaseRenderer } from "@/components/use-cases/use-case-renderer";

export const dynamic = "force-dynamic";

interface UseCaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UseCaseDetailPage({
  params,
}: UseCaseDetailPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (Number.isNaN(id)) {
    notFound();
  }

  const useCase = await prisma.useCase.findUnique({
    where: { id },
    include: {
      website: {
        select: {
          id: true,
          title: true,
          url: true,
          description: true,
          thumbnail: true,
          thumbnail_base64: true,
        },
      },
    },
  });

  if (!useCase || useCase.status !== "published") {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-10">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex flex-col gap-4">
          <Link href="/use-cases" className="inline-flex">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回案例列表
            </Button>
          </Link>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              {useCase.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              发布于 {useCase.created_at.toLocaleDateString("zh-CN")}
            </p>
          </div>
        </div>

        {useCase.image_base64 && (
          <div className="overflow-hidden rounded-2xl border border-border/40">
            <img
              src={useCase.image_base64}
              alt={useCase.title}
              className="h-64 w-full object-cover"
            />
          </div>
        )}

        <div className="rounded-2xl border border-border/40 bg-background/40 p-6">
          <UseCaseRenderer content={useCase.content} />
        </div>

        {useCase.website && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-border/40 bg-background/30 p-6">
            <div>
              <h2 className="text-lg font-bold">{useCase.website.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {useCase.website.description}
              </p>
            </div>
            <a
              href={useCase.website.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="gap-2">
                访问关联网站
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
