"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { isCompactModeAtom, websitesAtom } from "@/lib/atoms";
import { useToast } from "@/hooks/use-toast";
import { WebsiteCard } from "./website-card";
import { CompactCard } from "./compact-card";
import { ViewModeToggle } from "./view-mode-toggle";
import { cn } from "@/lib/utils/utils";
import type { Website, Category } from "@/lib/types";
import { Globe } from "lucide-react";

interface WebsiteGridProps {
  websites: Website[];
  categories: Category[];
  // onVisit: (website: Website) => void;
  className?: string;
}

export default function WebsiteGrid({
  websites,
  categories,
  className,
}: WebsiteGridProps) {
  const { toast } = useToast();
  const [isCompact, setIsCompact] = useAtom(isCompactModeAtom);
  const [allWebsites, setWebsites] = useAtom(websitesAtom);

  const handleVisit = async (website: Website) => {
    fetch(`/api/websites/${website.id}/visit`, { method: "POST" });
    fetch(`/api/websites/active`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: website.url, id: website.id }),
    });

    window.open(website.url, "_blank");
  };

  const handleStatusUpdate = async (id: number, status: Website["status"]) => {
    fetch(`/api/websites/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    setWebsites(
      allWebsites.map((website) =>
        website.id === id ? { ...website, status } : website
      )
    );
    toast({
      title: "状态已更新",
      description: status === "approved" ? "网站已通过审核" : "网站已被拒绝",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个网站吗？")) return;

    const response = await fetch(`/api/websites/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setWebsites(allWebsites.filter((w) => w.id !== id));
      toast({
        title: "删除成功",
        description: "网站已成功删除",
      });
    } else {
      toast({
        title: "删除失败",
        description: "无法删除该网站",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("relative min-h-[500px]", className)}
      layout
    >
      <ViewModeToggle isCompact={isCompact} onChange={setIsCompact} />

      <motion.div
        layout
        className={cn(
          "grid gap-2 sm:gap-4",
          isCompact
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}
      >
        <AnimatePresence mode="popLayout">
          {!websites || websites.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto">
                  <Globe className="w-10 h-10 text-primary/40" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground/80">
                    暂无网站
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    当前分类下还没有添加任何网站
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            websites.map((website, index) => (
              <motion.div
                key={website.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: index * 0.05,
                }}
              >
                {isCompact ? (
                  <CompactCard website={website} onVisit={handleVisit} />
                ) : (
                  <WebsiteCard
                    website={website}
                    category={categories.find(
                      (c) => c.id === website.category_id
                    )}
                    onVisit={handleVisit}
                    onStatusUpdate={handleStatusUpdate}
                    onDelete={handleDelete}
                  />
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
