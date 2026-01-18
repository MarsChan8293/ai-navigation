"use client";

import { useState } from "react";
import { Globe, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import Image from "next/image";
import { AspectRatio } from "@/ui/common/aspect-ratio";

interface WebsiteThumbnailProps {
  url: string;
  thumbnail: string | null;
  thumbnail_base64: string | null;
  title: string;
  className?: string;
  variant?: "square" | "large";
}

export function WebsiteThumbnail({
  url,
  thumbnail,
  thumbnail_base64,
  title,
  className,
  variant = "square",
}: WebsiteThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const hostname = new URL(url).hostname;
  const faviconUrl = `https://icon.horse/icon/${hostname}`;
  const thumbnailSrc = thumbnail_base64 || thumbnail || "";
  const isLarge = variant === "large";

  const renderFallback = () => (
    <div
      className={cn(
        "relative flex items-center justify-center bg-muted/30 group-hover:bg-muted/50 transition-colors duration-300",
        isLarge ? "w-full h-full" : "w-10 h-10 rounded-lg",
        className
      )}
    >
      {isLarge ? (
        <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
          <ImageIcon className="w-10 h-10" />
          <span className="text-xs font-medium">{title}</span>
        </div>
      ) : (
        <>
          <Image
            src={faviconUrl}
            alt={title}
            width={20}
            height={20}
            className="w-5 h-5 z-10"
            unoptimized
            onError={(e) => {
              // @ts-expect-error - Accessing DOM element style
              e.target.style.display = "none";
              // @ts-expect-error - Accessing DOM element sibling
              e.target.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <Globe className="h-5 w-5 text-primary/50 hidden" />
        </>
      )}
    </div>
  );

  const renderImage = () => (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        isLarge ? "w-full h-full" : "w-10 h-10 rounded-lg",
        !isLarge && "group-hover:ring-2 ring-primary/20",
        className
      )}
    >
      <Image
        src={thumbnailSrc}
        alt={title}
        fill
        sizes={isLarge ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : "40px"}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        // 启用懒加载
        loading="lazy"
        // 使用 blurDataURL 作为占位符
        placeholder={thumbnail_base64 ? "blur" : "empty"}
        blurDataURL={thumbnail_base64 || undefined}
        // 启用图片优化
        quality={85}
        onError={() => setImageError(true)}
      />
      {isLarge && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  );

  if (isLarge) {
    return (
      <AspectRatio ratio={16 / 9} className="w-full">
        {(!thumbnailSrc || imageError) ? renderFallback() : renderImage()}
      </AspectRatio>
    );
  }

  return (!thumbnailSrc || imageError) ? renderFallback() : renderImage();
}
