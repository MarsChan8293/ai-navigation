"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { Button } from "@/ui/common/button";
import { cn } from "@/lib/utils/utils";

interface ImageUploaderProps {
  value?: string;
  onImageReady: (file: File | null, base64: string) => void;
  error?: string;
}

export function ImageUploader({ value, onImageReady, error }: ImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      if (file.size > 2 * 1024 * 1024) {
        setCompressedSize(null);
        onImageReady(file, "");
        return;
      }

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      });

      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
      setCompressedSize(compressedFile.size);
      onImageReady(file, base64);
    } catch (uploadError) {
      console.error("Image compression failed:", uploadError);
      onImageReady(null, "");
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/50 bg-background/40 p-4 text-center",
          value ? "bg-background/60" : "bg-background/30"
        )}
      >
        {value ? (
          <img
            src={value}
            alt="已上传图片预览"
            className="max-h-40 w-auto rounded-lg border border-border/40 object-contain"
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            上传封面图片（压缩后约 500KB）
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="inline-flex items-center justify-center rounded-lg border border-border/40 bg-background/60 px-3 py-1.5 text-xs font-bold text-foreground/80 transition hover:text-foreground">
              {isProcessing ? "压缩中..." : value ? "更换图片" : "选择图片"}
            </span>
          </label>

          {value && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setCompressedSize(null);
                onImageReady(null, "");
              }}
            >
              移除
            </Button>
          )}
        </div>

        {compressedSize !== null && (
          <p className="text-xs text-muted-foreground">
            已压缩至 {(compressedSize / 1024).toFixed(0)}KB
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-500/70">{error}</p>}
    </div>
  );
}
