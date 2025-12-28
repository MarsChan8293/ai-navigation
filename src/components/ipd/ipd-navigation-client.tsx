"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink, Star } from "lucide-react";
import { Card } from "@/ui/common/card";
import { Input } from "@/ui/common/input";
import { Badge } from "@/ui/common/badge";
import { cn } from "@/lib/utils/utils";
import type { IPDPhase } from "@/lib/types";

interface IPDNavigationClientProps {
  phases: IPDPhase[];
}

export function IPDNavigationClient({ phases }: IPDNavigationClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);

  // 根据搜索过滤网站
  const filteredPhases = useMemo(() => {
    if (!searchQuery.trim()) return phases;

    return phases
      .map((phase) => ({
        ...phase,
        stages: phase.stages
          .map((stage) => ({
            ...stage,
            websites: stage.websites.filter(
              (website) =>
                website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                website.description?.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          }))
          .filter((stage) => stage.websites.length > 0),
      }))
      .filter((phase) => phase.stages.length > 0);
  }, [phases, searchQuery]);

  // 获取选中阶段的网站
  const selectedStageWebsites = useMemo(() => {
    if (!selectedStageId) return [];
    
    for (const phase of phases) {
      const stage = phase.stages.find((s) => s.id === selectedStageId);
      if (stage) return stage.websites;
    }
    return [];
  }, [phases, selectedStageId]);

  // 背景色映射
  const getBgColorClass = (bgColor: string | null) => {
    const colorMap: Record<string, string> = {
      light_yellow: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
      light_green: "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800",
      navy: "bg-slate-800 dark:bg-slate-900 text-white border-slate-700",
      white: "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700",
    };
    return colorMap[bgColor || "white"] || "bg-background border-border";
  };

  // 阶段名称颜色映射
  const getPhaseColor = (phaseName: string) => {
    const colorMap: Record<string, string> = {
      "IPD流程": "bg-slate-700 dark:bg-slate-800",
      "需求分析": "bg-blue-600 dark:bg-blue-700",
      "设计": "bg-purple-600 dark:bg-purple-700",
      "开发&测试": "bg-indigo-600 dark:bg-indigo-700",
      "发布&部署": "bg-emerald-600 dark:bg-emerald-700",
    };
    return colorMap[phaseName] || "bg-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* 标题和搜索栏 */}
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            IPD网站导航
          </h1>
          <p className="mt-2 text-muted-foreground">
            集成产品开发流程相关网站导航
          </p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索网站..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-background/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* IPD流程图 */}
      <div className="space-y-4">
        {filteredPhases.map((phase) => (
          <Card
            key={phase.id}
            className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* 阶段标题 */}
            <div
              className={cn(
                "px-4 py-3 text-white font-semibold text-lg",
                getPhaseColor(phase.name)
              )}
            >
              {phase.name}
            </div>

            {/* 阶段项网格 */}
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {phase.stages.map((stage) => (
                  <motion.button
                    key={stage.id}
                    onClick={() => setSelectedStageId(stage.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative p-3 rounded-lg border-2 transition-all text-left",
                      "hover:shadow-md active:shadow-sm",
                      getBgColorClass(stage.bg_color),
                      selectedStageId === stage.id
                        ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-background"
                        : ""
                    )}
                  >
                    {/* 重要标记 */}
                    {stage.is_important && (
                      <Star className="absolute top-2 right-2 h-4 w-4 text-red-500 fill-red-500" />
                    )}

                    {/* 阶段名称 */}
                    <div className="font-medium text-sm pr-6">
                      {stage.name}
                    </div>

                    {/* 网站数量 */}
                    {stage.websites.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="mt-2 text-xs"
                      >
                        {stage.websites.length} 个网站
                      </Badge>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 选中阶段的网站列表 */}
      <AnimatePresence mode="wait">
        {selectedStageId && selectedStageWebsites.length > 0 && (
          <motion.div
            key={selectedStageId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 border-border/50 shadow-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>相关网站</span>
                <Badge variant="outline">{selectedStageWebsites.length}</Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedStageWebsites.map((website) => (
                  <motion.a
                    key={website.id}
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03 }}
                    className={cn(
                      "group block p-4 rounded-lg border border-border/50",
                      "bg-background/50 hover:bg-accent/50",
                      "transition-all duration-200",
                      "hover:shadow-md hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {website.title}
                        </h4>
                        {website.description && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {website.description}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 无搜索结果提示 */}
      {searchQuery && filteredPhases.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            没有找到匹配 "{searchQuery}" 的网站
          </p>
        </Card>
      )}
    </div>
  );
}
