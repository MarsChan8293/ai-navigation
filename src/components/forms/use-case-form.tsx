"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCaseFormSchema } from "@/lib/utils";
import type { UseCaseFormInputs, Website } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/ui/common/input";
import { Button } from "@/ui/common/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/common/select";
import { ImageUploader } from "@/components/use-cases/image-uploader";
import { MarkdownEditor } from "@/components/use-cases/markdown-editor";

export function UseCaseForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [imageBase64, setImageBase64] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<UseCaseFormInputs>({
    resolver: zodResolver(useCaseFormSchema),
    defaultValues: {
      title: "",
      content: "",
      website_id: "",
      image: null,
    },
  });

  useEffect(() => {
    const loadWebsites = async () => {
      try {
        const response = await fetch("/api/websites?status=approved");
        if (!response.ok) throw new Error("Failed to load websites");
        const result = await response.json();
        setWebsites(result.data || []);
      } catch {
        toast({
          title: "加载网站失败",
          description: "请刷新页面重试",
          variant: "destructive",
        });
      }
    };

    loadWebsites();
  }, [toast]);

  const { setValue, watch } = form;
  const contentValue = watch("content");

  const handleImageReady = (file: File | null, base64: string) => {
    setValue("image", file, { shouldValidate: true });
    setImageBase64(base64);
  };

  const onSubmit = async (values: UseCaseFormInputs) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          website_id: values.website_id,
          image_base64: imageBase64 || null,
        }),
      });

      if (!response.ok) {
        throw new Error((await response.text()) || "提交失败");
      }

      toast({
        title: "发布成功",
        description: "案例已发布到使用案例列表",
      });

      router.push("/use-cases");
      router.refresh();
    } catch (error) {
      toast({
        title: "提交失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground/80">
          案例标题
        </label>
        <Input
          {...form.register("title")}
          placeholder="简洁概括本次使用案例"
          className="w-full bg-background/50 apple-glass border-border/40 hover:bg-background/70 hover:border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300"
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-500/70 mt-1">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-foreground/80">
          关联网站
        </label>
        <Select
          onValueChange={(value) =>
            setValue("website_id", value, { shouldValidate: true })
          }
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full bg-background/50 apple-glass border-border/40 hover:bg-background/70 hover:border-border/60 transition-all duration-300">
            <SelectValue placeholder="选择要关联的网站" />
          </SelectTrigger>
          <SelectContent className="bg-background/80 apple-glass border-border/30">
            {websites.map((website) => (
              <SelectItem
                key={website.id}
                value={website.id.toString()}
                className="hover:bg-primary/10 focus:bg-primary/10"
              >
                {website.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.website_id && (
          <p className="text-sm text-red-500/70 mt-1">请选择关联网站</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-foreground/80">
          案例内容
        </label>
        <MarkdownEditor
          value={contentValue}
          onChange={(value) => setValue("content", value, { shouldValidate: true })}
          error={form.formState.errors.content?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-foreground/80">
          封面图片（可选）
        </label>
        <ImageUploader
          value={imageBase64}
          onImageReady={handleImageReady}
          error={form.formState.errors.image?.message as string | undefined}
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-primary/90 hover:bg-primary text-primary-foreground shadow-[0_2px_10px_-3px_rgba(var(--primary),0.3)] transition-all duration-300"
        >
          {isSubmitting ? "发布中..." : "发布案例"}
        </Button>
      </div>
    </form>
  );
}
