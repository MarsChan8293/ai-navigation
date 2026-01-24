"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { Button } from "@/ui/common/button";
import { isAdminModeAtom, footerSettingsAtom } from "@/lib/atoms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/common/dialog";
import { Input } from "@/ui/common/input";
import { useToast } from "@/hooks/use-toast";
import type { FooterSettings } from "@/lib/types";

export default function FooterContent({
  initialSettings,
}: {
  initialSettings: FooterSettings;
}) {
  const [isAdmin] = useAtom(isAdminModeAtom);
  const [settings, setSettings] = useAtom(footerSettingsAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const { toast } = useToast();

  // Initialize settings
  useEffect(() => {
    setSettings({
      copyright: initialSettings.copyright || "",
      icpBeian: initialSettings.icpBeian || "",
      links:
        initialSettings.links?.map((link) => ({
          title: link.title,
          url: link.url,
        })) || [],
      customHtml: initialSettings.customHtml || "",
    });
  }, [initialSettings, setSettings]);

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "错误",
        description: "请填写完整的链接信息",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/footer-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLink),
      });

      if (!response.ok) throw new Error("Failed to add link");

      setSettings((prev) => ({
        ...prev,
        links: [...prev.links, { title: newLink.title, url: newLink.url }],
      }));

      setNewLink({ title: "", url: "" });
      setIsDialogOpen(false);

      toast({
        title: "添加成功",
        description: "新的页脚链接已添加",
      });
    } catch {
      toast({
        title: "添加失败",
        description: "添加页脚链接时出错",
        variant: "destructive",
      });
    }
  };

  const handleRemoveLink = async (index: number) => {
    try {
      const response = await fetch(`/api/footer-links?id=${index}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove link");

      setSettings((prev) => ({
        ...prev,
        links: prev.links.filter((_, i) => i !== index),
      }));

      toast({
        title: "删除成功",
        description: "页脚链接已删除",
      });
    } catch {
      toast({
        title: "删除失败",
        description: "删除页脚链接时出错",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <footer className="px-8 py-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <p>{settings.copyright || "© 2024 AI NAV — EXPLORE THE NEW ERA"}</p>
          {settings.icpBeian && (
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {settings.icpBeian}
            </a>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {settings.links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {link.title}
              </a>
              {isAdmin && (
                <button
                  onClick={() => handleRemoveLink(index)}
                  className="hover:text-destructive transition-colors text-xs"
                >
                  [REMOVE]
                </button>
              )}
            </div>
          ))}
          {isAdmin && (
            <button
              onClick={() => setIsDialogOpen(true)}
              className="hover:text-primary transition-colors"
            >
              [ADD LINK]
            </button>
          )}
        </div>
        {settings.customHtml && (
          <div
            className="w-full text-center md:text-right"
            dangerouslySetInnerHTML={{ __html: settings.customHtml }}
          />
        )}
      </footer>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>添加页脚链接</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              请填写链接的名称和地址
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                链接名称
              </label>
              <Input
                value={newLink.title}
                onChange={(e) =>
                  setNewLink((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="输入链接名称"
                className="border-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                链接地址
              </label>
              <Input
                value={newLink.url}
                onChange={(e) =>
                  setNewLink((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="输入链接地址"
                className="border-input"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-input hover:bg-accent hover:text-accent-foreground"
              >
                取消
              </Button>
              <Button
                onClick={handleAddLink}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                添加
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
