"use client";

import { Card } from "@/ui/common/card";
import { Button } from "@/ui/common/button";
import {
  ThumbsUp,
  ThumbsDown,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import type { Website, Category } from "@/lib/types";
import { useState } from "react";
import { WebsiteThumbnail } from "./website-thumbnail";
import { toast } from "@/hooks/use-toast";
import { useCardTilt } from "@/hooks/use-card-tilt";

interface WebsiteCardProps {
  website: Website;
  category?: Category;
  isAdmin: boolean;
  onVisit: (website: Website) => void;
  onStatusUpdate: (id: number, status: Website["status"]) => void;
}

export function WebsiteCard({
  website,
  isAdmin,
  onVisit,
  onStatusUpdate,
}: WebsiteCardProps) {
  const [likes, setLikes] = useState(website.likes);
  const [dislikes, setDislikes] = useState(website.dislikes || 0);
  const [isDeleted, setIsDeleted] = useState(false);
  const { cardRef, tiltProps } = useCardTilt();

  const handleLike = async () => {
    const key = `website-${website.id}-liked`;
    const lastLiked = localStorage.getItem(key);
    const now = new Date().getTime();

    if (lastLiked) {
      const lastLikedTime = parseInt(lastLiked);
      const oneDay = 24 * 60 * 60 * 1000;

      if (now - lastLikedTime < oneDay) {
        toast({
          title: "已点赞",
          description: "每天只能点赞一次哦，明天再来吧 (｡•́︿•̀｡)",
        });
        return;
      }
    }

    const method = "POST";
    fetch(`/api/websites/${website.id}/like`, { method });
    localStorage.setItem(key, now.toString());
    setLikes(likes + 1);
  };

  const handleDislike = async () => {
    const key = `website-${website.id}-disliked`;
    const lastDisliked = localStorage.getItem(key);
    const now = new Date().getTime();

    // Check local (optimistic) first, but server is truth?
    // User wants 24h limit, reused from likes
    if (lastDisliked) {
      const lastDislikedTime = parseInt(lastDisliked);
      const oneDay = 24 * 60 * 60 * 1000;

      if (now - lastDislikedTime < oneDay) {
        toast({
          title: "已踩",
          description: "每天只能踩一次哦，明天再来吧 (｡•́︿•̀｡)",
        });
        return;
      }
    }

    try {
      const response = await fetch(`/api/websites/${website.id}/dislike`, { method: "POST" });
      const result = await response.json();

      if (result.success) {
        localStorage.setItem(key, now.toString());
        setDislikes(result.data.dislikes);
        if (result.data.deleted) {
          setIsDeleted(true);
          toast({
            title: "已删除",
            description: "该网站因踩数过多已被删除",
          });
        }
      }
    } catch (error) {
      console.error("Failed to dislike:", error);
    }
  };

  if (isDeleted) return null;

  return (
    <div
      ref={cardRef}
      onMouseMove={tiltProps.onMouseMove}
      onMouseEnter={tiltProps.onMouseEnter}
      onMouseLeave={tiltProps.onMouseLeave}
      className="card-container relative [perspective:1000px]"
    >
      <div className="h-full">
        <Card
          className={cn(
            "group relative flex flex-col overflow-hidden h-full",
            "bg-transparent border-none shadow-none",
            "transition-all duration-300 ease-out",
            "rounded-xl"
          )}
        >
          {/* Top Image Section */}
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-muted/10 border border-border/10 group-hover:border-primary/20 transition-all duration-300 shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/5">
            <WebsiteThumbnail
              url={website.url}
              thumbnail={website.thumbnail}
              thumbnail_base64={website.thumbnail_base64}
              title={website.title}
              variant="large"
            />



            {/* Status Indicator (Subtle) */}
            <div className="absolute top-2 right-2 z-10">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full shadow-sm",
                website.active ? "bg-green-500" : "bg-red-500"
              )} />
            </div>

            {/* Visit Button Overlay (Hover only) */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <Button
                onClick={() => onVisit(website)}
                size="sm"
                className="rounded-full font-bold text-xs px-6 bg-white text-black hover:bg-white/90"
              >
                View Site
              </Button>
            </div>
          </div>

          {/* Content Section (Simplified) */}
          <div className="py-3 px-1 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors leading-tight tracking-tight text-foreground/90">
                {website.title}
              </h3>
            </div>

            <p className="text-[12px] text-muted-foreground/60 line-clamp-1 leading-relaxed font-medium">
              {website.description}
            </p>

            {/* Stats (Very subtle) */}
            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              <span>{website.visits} visits</span>
              <button
                onClick={handleLike}
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <Heart className={cn("w-3 h-3", likes > website.likes && "fill-primary text-primary")} /> {likes}
              </button>
              <button
                onClick={handleDislike}
                className="hover:text-red-500 transition-colors flex items-center gap-1"
                title="踩一下 (超过10次会自动删除)"
              >
                <ThumbsDown className={cn("w-3 h-3", dislikes > (website.dislikes || 0) && "fill-red-500 text-red-500")} /> {dislikes}
              </button>
              {isAdmin && (
                <div className="ml-auto flex gap-2">
                  <button onClick={() => onStatusUpdate(website.id, "approved")} className="hover:text-green-500"><ThumbsUp className="w-3 h-3" /></button>
                  <button onClick={() => onStatusUpdate(website.id, "rejected")} className="hover:text-red-500"><ThumbsDown className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
