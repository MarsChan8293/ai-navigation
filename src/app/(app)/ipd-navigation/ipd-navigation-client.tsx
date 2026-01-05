"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Loader2, ChevronRight } from "lucide-react";
import { Card } from "@/ui/common/card";
import { Input } from "@/ui/common/input";
import { Button } from "@/ui/common/button";
import { cn } from "@/lib/utils/utils";
import { WebsiteForm } from "@/components/forms/website-form";
import { useAtom } from "jotai";
import { categoriesAtom } from "@/lib/atoms";
import WebsiteGrid from "@/components/website/website-grid";
import type { Website } from "@/lib/types";

interface IpdPhase {
  id: string;
  name: string;
  items: IpdItem[];
}

interface IpdItem {
  id: string;
  name: string;
  phaseId: string;
  important?: boolean;
  color?: "yellow" | "green" | "default" | "dark";
}

const ipdPhases: IpdPhase[] = [
  {
    id: "requirement",
    name: "需求阶段",
    items: [
      { id: "research", name: "需求调研", color: "default", phaseId: "requirement" },
      { id: "analysis", name: "需求分析", color: "yellow", phaseId: "requirement" },
      { id: "coding", name: "需求编写", color: "yellow", phaseId: "requirement" },
      { id: "review", name: "需求审讲&反审讲", color: "default", phaseId: "requirement" },
    ],
  },
  {
    id: "design",
    name: "设计阶段",
    items: [
      { id: "architecture", name: "架构设计", color: "yellow", important: true, phaseId: "design" },
      { id: "concept", name: "概要设计", color: "yellow", phaseId: "design" },
      { id: "detail", name: "详细设计", color: "yellow", important: true, phaseId: "design" },
      { id: "design-review", name: "设计评审", color: "default", phaseId: "design" },
      { id: "security", name: "网络安全设计", color: "default", phaseId: "design" },
    ],
  },
  {
    id: "coding",
    name: "编码阶段",
    items: [
      { id: "code-write", name: "代码编写", color: "green", important: true, phaseId: "coding" },
      { id: "code-read", name: "代码走读", color: "dark", phaseId: "coding" },
      { id: "code-check", name: "代码检视", color: "green", important: true, phaseId: "coding" },
      { id: "unit-test", name: "单元测试", color: "green", important: true, phaseId: "coding" },
      { id: "code-union", name: "代码联调", color: "dark", phaseId: "coding" },
      { id: "issue-fix", name: "问题单修改", color: "yellow", phaseId: "coding" },
    ],
  },
  {
    id: "build",
    name: "构建阶段",
    items: [
      { id: "cleancode", name: "CleanCode门禁检查", color: "dark", phaseId: "build" },
      { id: "script-build", name: "构建脚本编写", color: "dark", important: true, phaseId: "build" },
      { id: "auto-script", name: "自动化脚本编写", color: "dark", important: true, phaseId: "build" },
      { id: "personal-build", name: "个人构建", color: "dark", phaseId: "build" },
      { id: "daily-build", name: "每日构建", color: "dark", phaseId: "build" },
      { id: "version-build", name: "版本级构建", color: "dark", phaseId: "build" },
      { id: "smoke-test", name: "冒烟测试", color: "dark", phaseId: "build" },
      { id: "leak-scan", name: "开源漏洞扫描", color: "dark", phaseId: "build" },
    ],
  },
  {
    id: "test",
    name: "测试阶段",
    items: [
      { id: "test-design", name: "测试方案设计", color: "yellow", phaseId: "test" },
      { id: "test-case-write", name: "测试用例编写", color: "yellow", important: true, phaseId: "test" },
      { id: "test-case-auto", name: "自动化脚本编写", color: "yellow", important: true, phaseId: "test" },
      { id: "version-test", name: "版本级测试", color: "dark", phaseId: "test" },
      { id: "issue-list", name: "提交问题单", color: "dark", phaseId: "test" },
      { id: "leak-analysis", name: "漏测分析", color: "dark", phaseId: "test" },
    ],
  },
  {
    id: "release",
    name: "实施阶段",
    items: [
      { id: "release-publish", name: "版本发布上网", color: "dark", important: true, phaseId: "release" },
      { id: "deploy-online", name: "部署上线", color: "dark", phaseId: "release" },
      { id: "tech-support", name: "技术支持、运维", color: "dark", important: true, phaseId: "release" },
      { id: "qa-improve", name: "网上问题修改", color: "yellow", phaseId: "release" },
    ],
  },
];

export function IpdNavigationClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string | null>("requirement");
  const [selectedItem, setSelectedItem] = useState<IpdItem | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "submit">("list");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useAtom(categoriesAtom);

  const resultsRef = useRef<HTMLDivElement>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);

  const filteredPhases = useMemo(
    () =>
      ipdPhases.map((phase) => ({
        ...phase,
        items: phase.items.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })),
    [searchQuery]
  );

  const currentPhase = useMemo(
    () => filteredPhases.find((p) => p.id === selectedStage),
    [filteredPhases, selectedStage]
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    if (categories.length === 0) {
      loadCategories();
    }
  }, [categories.length, setCategories]);

  useEffect(() => {
    if (!currentPhase) {
      setSelectedItem(null);
      setWebsites([]);
      return;
    }

    const firstItem = currentPhase.items[0];
    if (!firstItem) {
      setSelectedItem(null);
      setWebsites([]);
      return;
    }

    const exists = currentPhase.items.some((item) => item.id === selectedItem?.id);
    if (!exists) {
      setSelectedItem(firstItem);
      setViewMode("list");
    }
  }, [currentPhase, selectedItem]);

  useEffect(() => {
    if (!selectedItem) {
      setCurrentCategoryId(null);
      return;
    }

    const slug = `ipd-${selectedItem.phaseId}-${selectedItem.id}`;
    const category = categories.find((c) => c.slug === slug);

    if (category) {
      setCurrentCategoryId(category.id);
    } else {
      setCurrentCategoryId(null);
    }
  }, [selectedItem, categories]);

  const fetchWebsites = useCallback(async (categoryId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/websites?category_id=${categoryId}`);
      const data = await response.json();
      if (data.success) {
        setWebsites(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch websites:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentCategoryId && viewMode === "list") {
      fetchWebsites(currentCategoryId);
    }
  }, [currentCategoryId, viewMode, fetchWebsites]);

  const handleItemClick = useCallback((item: IpdItem, mode: "list" | "submit" = "list") => {
    setSelectedItem(item);
    setViewMode(mode);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  const handleSubmissionSuccess = () => {
    setViewMode("list");
    if (currentCategoryId) {
      fetchWebsites(currentCategoryId);
    }
  };

  return (
    <div className="min-h-screen bg-background/50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">IPD网站导航</h1>
          <p className="text-muted-foreground">
            集成产品开发(Integrated Product Development)流程导航
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索IPD流程阶段或活动..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </motion.div>

        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mb-6 overflow-x-auto no-scrollbar"
          >
            <div className="flex items-center justify-start md:justify-center gap-4 min-w-max bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 rounded-lg mx-auto">
              <div className="px-6 py-3 bg-slate-700 text-white font-bold text-lg whitespace-nowrap">
                IPD流程
              </div>

              {filteredPhases.map((phase, index) => (
                <div key={phase.id} className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedStage(phase.id);
                      setSelectedItem(null);
                    }}
                    className={cn(
                      "px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all duration-200",
                      selectedStage === phase.id
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "bg-slate-600 text-white hover:bg-slate-500"
                    )}
                  >
                    {phase.name}
                  </button>
                  {index < filteredPhases.length - 1 && (
                    <div className="w-8 border-t-2 border-slate-500" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {currentPhase && (
            <Card key={currentPhase.id} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{currentPhase.name}</h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={viewMode === "submit" ? "default" : "outline"}
                    onClick={() => setViewMode("submit")}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>提交网站</span>
                  </Button>
                </div>
              </div>

              <div className="flex gap-6 flex-col lg:flex-row">
                <div className="space-y-2 flex-shrink-0">
                  {currentPhase.items.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      onClick={() => handleItemClick(item, "list")}
                      className={cn(
                        "w-full max-w-[180px] text-left p-3 rounded-lg border transition-all duration-200 flex items-center justify-between gap-2.5",
                        selectedItem?.id === item.id
                          ? "border-primary bg-primary/5 text-primary shadow-md"
                          : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
                      )}
                    >
                      <div className="flex-1">
                        <div className="font-semibold leading-snug">{item.name}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>

                <div ref={resultsRef} className="flex-1">
                  {selectedItem ? (
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-bold uppercase text-primary tracking-widest">当前活动</div>
                        <h3 className="text-2xl font-bold mt-1">{selectedItem.name}</h3>
                        <p className="text-sm text-muted-foreground">{viewMode === "list" ? "为您精选的相关网站" : "提交新的相关资源"}</p>
                      </div>

                      {viewMode === "list" ? (
                        isLoading ? (
                          <div className="flex items-center justify-center py-16 text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>正在加载资源...</span>
                          </div>
                        ) : (
                          <WebsiteGrid
                            websites={websites}
                            categories={categories}
                            className="mt-2"
                          />
                        )
                      ) : (
                        <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
                          <WebsiteForm
                            onSuccess={handleSubmissionSuccess}
                            hideIpdCategory={true}
                            hideCategory={true}
                            defaultValues={{
                              category_id: "2",
                              ipd_category_id: currentCategoryId?.toString() || ""
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[240px] text-muted-foreground">
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
