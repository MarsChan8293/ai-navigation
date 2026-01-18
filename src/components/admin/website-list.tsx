"use client";

import { useState, useEffect } from "react";
import { Button } from "@/ui/common/button";
import { Badge } from "@/ui/common/badge";
import {
  Eye,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  ExternalLink,
  Clock,
  Pencil,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import { websitesAtom } from "@/lib/atoms";
import { WebsiteThumbnail } from "@/components/website/website-thumbnail";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/common/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/common/dialog";
import { WebsiteForm } from "@/components/forms/website-form";
import { cn } from "@/lib/utils/utils";
import type { Website, Category } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface WebsiteListProps {
  websites: Website[];
  categories: Category[];
  showActions?: boolean;
}

export function WebsiteList({
  websites: initialWebsites,
  categories,
  showActions = false,
}: WebsiteListProps) {
  const { toast } = useToast();
  const [websites, setWebsites] = useState(initialWebsites);
  const [, setAllWebsites] = useAtom(websitesAtom);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    setWebsites(initialWebsites);
  }, [initialWebsites]);

  const handleStatusUpdate = async (id: number, status: Website["status"]) => {
    const response = await fetch(`/api/websites/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      setAllWebsites((prevWebsites) =>
        prevWebsites.map((website) =>
          website.id === id ? { ...website, status } : website
        )
      );

      setWebsites((prevWebsites) =>
        prevWebsites.filter((website) => website.id !== id)
      );

      toast({
        title: "状态已更新",
        description: status === "approved" ? "网站已通过审核" : "网站已被拒绝",
      });
    }
  };

  const handleLike = async (id: number, increment: boolean) => {
    try {
      const response = await fetch(`/api/websites/${id}/like`, {
        method: increment ? "POST" : "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        const newLikes = result.data.likes;

        setWebsites((prev) =>
          prev.map((w) => (w.id === id ? { ...w, likes: newLikes } : w))
        );
        setAllWebsites((prev) =>
          prev.map((w) => (w.id === id ? { ...w, likes: newLikes } : w))
        );

        toast({
          title: increment ? "点赞成功" : "已踩",
          description: `当前点赞数：${newLikes}`,
        });
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setAllWebsites((prevWebsites) =>
          prevWebsites.filter((website) => website.id !== id)
        );

        setWebsites((prevWebsites) =>
          prevWebsites.filter((website) => website.id !== id)
        );

        toast({
          title: "删除成功",
          description: "网站已被删除",
        });
      } else {
        toast({
          title: "删除失败",
          description: result.message || "无法删除该网站",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "错误",
        description: "网络错误，请稍后再试",
        variant: "destructive",
      });
    }
  };

  const handleVisit = (url: string) => {
    window.open(url, "_blank");
  };

  const getStatusColor = (status: Website["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "approved":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "rejected":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "";
    }
  };

  const getStatusText = (status: Website["status"]) => {
    switch (status) {
      case "pending":
        return "待审核";
      case "approved":
        return "已通过";
      case "rejected":
        return "已拒绝";
      default:
        return "";
    }
  };

  const openEditDialog = (website: Website) => {
    setEditingWebsite(website);
    setIsEditDialogOpen(true);
  };

  if (websites.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-background/20 mx-auto mb-4 flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground/60" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">暂无网站</h3>
          <p className="text-sm text-muted-foreground">
            当前分类或状态下没有符合条件的网站
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-border/30">
        <AnimatePresence mode="popLayout">
          {websites.map((website, index) => (
            <motion.div
              key={website.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="group px-4 py-3 hover:bg-background/30 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <WebsiteThumbnail
                  url={website.url}
                  thumbnail={website.thumbnail}
                  thumbnail_base64={website.thumbnail_base64}
                  title={website.title}
                  className="w-12 h-12 rounded-lg shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium truncate text-foreground">
                      {website.title}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="bg-background/30 border-border/40 text-xs px-1.5 py-0 h-5"
                      >
                        {categories.find((c) => c.id === website.category_id)
                          ?.name || "未分类"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 bg-background/30 text-xs px-1.5 py-0 h-5",
                          getStatusColor(website.status)
                        )}
                      >
                        {getStatusText(website.status)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
                    {website.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{website.visits}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{website.likes}</span>
                    </div>
                  </div>
                </div>
                {showActions && (
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVisit(website.url);
                      }}
                      title="访问网站"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-background/50"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(website.id, true);
                      }}
                      title="点赞"
                      className="h-7 w-7 text-pink-600/70 hover:text-pink-600 hover:bg-pink-500/20"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(website.id, false);
                      }}
                      title="踩"
                      className="h-7 w-7 text-gray-600/70 hover:text-gray-600 hover:bg-gray-500/20"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(website);
                      }}
                      title="编辑"
                      className="h-7 w-7 text-blue-600/70 hover:text-blue-600 hover:bg-blue-500/20"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>

                    {website.status !== "approved" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(website.id, "approved");
                        }}
                        title="审核通过"
                        className="h-7 w-7 text-green-600/70 hover:text-green-600 hover:bg-green-500/20"
                      >
                        <Heart className="h-3.5 w-3.5" />
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="删除"
                          className="h-7 w-7 text-red-600/70 hover:text-red-600 hover:bg-red-500/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background/95 backdrop-blur-sm border-border/40">
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            此操作无法撤销，确定要删除这个网站吗？
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-background/50">
                            取消
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(website.id);
                            }}
                            className="bg-red-600/90 hover:bg-red-600"
                          >
                            确认删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>编辑网站</DialogTitle>
          </DialogHeader>
          {editingWebsite && (
            <WebsiteForm
              initialData={editingWebsite}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setEditingWebsite(null);
                // The website form will refresh the router, but we want to update the local state if possible
                // For simplicity here, let the page refresh
                window.location.reload();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
