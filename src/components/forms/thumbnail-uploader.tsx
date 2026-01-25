"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/ui/common/button";

interface ThumbnailUploaderProps {
  value?: string;
  onChange: (value: string) => void;
}

export function ThumbnailUploader({ value, onChange }: ThumbnailUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        onChange(result.data.path);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("上传失败：" + (error instanceof Error ? error.message : "未知错误"));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] w-full max-w-[400px] overflow-hidden rounded-xl border border-border/40 bg-muted/10">
        {value ? (
          <Image
            src={value}
            alt="缩略图预览"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/40">
            <Upload className="w-12 h-12" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "上传中..." : "手动上传"}
          </Button>
        </label>

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        💡 提示：也可以在任意网站使用 Tampermonkey 脚本自动截图收藏
      </p>
    </div>
  );
}
