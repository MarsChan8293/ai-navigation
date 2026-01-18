"use client";

import { useState } from "react";
import { Card } from "@/ui/common/card";
import { Button } from "@/ui/common/button";
import { Badge } from "@/ui/common/badge";
import { Heart, Eye, Trophy, ArrowUpRight, Crown, Medal } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import type { Website } from "@/lib/types";

interface RankingsProps {
  websites: Website[];
  onVisit: (website: Website) => void;
}

export function Rankings({ websites, onVisit }: RankingsProps) {
  const [activeTab, setActiveTab] = useState<"visits" | "likes">("visits");

  // 只取前5名
  const sortedWebsites = [...websites]
    .sort((a, b) => {
      if (activeTab === "visits") {
        return b.visits - a.visits;
      }
      return b.likes - a.likes;
    })
    .slice(0, 5); // Top 5

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="relative">
            <Crown className="h-4 w-4 text-amber-400 drop-shadow-glow animate-shine" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        );
      case 1:
        return <Medal className="h-4 w-4 text-gray-300 drop-shadow" />;
      case 2:
        return <Medal className="h-4 w-4 text-amber-600 drop-shadow" />;
      default:
        return (
          <span className="text-sm font-medium text-muted-foreground/80">
            {index + 1}
          </span>
        );
    }
  };

  // 根据排名获取特殊样式
  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-primary/5 hover:bg-primary/10";
      case 1:
        return "bg-muted/5 hover:bg-muted/10";
      case 2:
        return "bg-accent/5 hover:bg-accent/10";
      default:
        return "hover:bg-accent/5";
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden",
        "bg-background/95 backdrop-blur-xl backdrop-saturate-150",
        "border-border/50",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300"
      )}
    >
      {/* 标题栏 */}
      <div
        className={cn(
          "p-3 border-b border-border/50",
          "bg-gradient-to-r from-muted/50 via-background to-muted/50"
        )}
      >
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            TOP 5 排行榜
          </h2>
        </div>
      </div>

      {/* 标签页 */}
      <div className="p-1.5 border-b border-border/50 bg-muted/20">
        <div className="flex gap-1">
          <Button
            variant={activeTab === "visits" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("visits")}
            className={cn(
              "flex-1 transition-all duration-200 h-8",
              activeTab === "visits"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            访问榜
          </Button>
          <Button
            variant={activeTab === "likes" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("likes")}
            className={cn(
              "flex-1 transition-all duration-200 h-8",
              activeTab === "likes"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Heart className="h-3.5 w-3.5 mr-1.5" />
            点赞榜
          </Button>
        </div>
      </div>

      {/* 排行榜列表 */}
      <div className="divide-y divide-border/50">
        {sortedWebsites.map((website, index) => (
          <div
            key={`${website.id}-${activeTab}`}
            className={cn(
              "relative p-3 flex items-center gap-3 group cursor-pointer",
              getRankStyle(index),
              "active:bg-accent/10",
              "transition-all duration-200"
            )}
            onClick={() => onVisit(website)}
          >
            {/* 排名图标 */}
            <div
              className={cn(
                "w-8 h-8 flex items-center justify-center shrink-0",
                "bg-muted/30 rounded-full",
                "group-hover:bg-muted/50",
                "transition-colors duration-200"
              )}
            >
              {getRankIcon(index)}
            </div>

            {/* 网站信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate text-foreground group-hover:text-primary transition-colors">
                  {website.title}
                </h3>
                {index === 0 && (
                  <Badge
                    variant="default"
                    className="bg-primary/20 text-primary text-[10px] px-1 py-0"
                  >
                    No.1
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground/80 line-clamp-1 mt-0.5 mb-1 group-hover:text-muted-foreground transition-colors">
                {website.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span
                    className="tabular-nums font-medium"
                  >
                    {website.visits}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  <span
                    className="tabular-nums font-medium"
                  >
                    {website.likes}
                  </span>
                </div>
              </div>
            </div>

            {/* 访问箭头 */}
            <div
              className={cn(
                "w-8 flex items-center justify-center",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200"
              )}
            >
              <div>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
