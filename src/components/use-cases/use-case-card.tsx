"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import type { UseCase } from "@/lib/types";

interface UseCaseCardProps {
  useCase: UseCase;
}

export function UseCaseCard({ useCase }: UseCaseCardProps) {
  const previewText =
    useCase.content.length > 140
      ? `${useCase.content.slice(0, 140)}...`
      : useCase.content;

  return (
    <Link
      href={`/use-cases/${useCase.id}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/40 bg-background/30 p-5 transition-all",
        "hover:border-primary/40 hover:bg-background/50"
      )}
    >
      <div className="flex flex-col gap-4">
        {useCase.image_base64 && (
          <div className="overflow-hidden rounded-xl border border-border/30">
            <Image
              src={useCase.image_base64}
              alt={useCase.title}
              width={400}
              height={160}
              className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-foreground">{useCase.title}</h3>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-sm text-muted-foreground">{previewText}</p>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>{useCase.website?.title || "未关联网站"}</span>
          <span>
            {new Date(useCase.created_at).toLocaleDateString("zh-CN")}
          </span>
        </div>
      </div>
    </Link>
  );
}
