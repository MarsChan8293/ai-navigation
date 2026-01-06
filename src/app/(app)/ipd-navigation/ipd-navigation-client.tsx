"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Loader2 } from "lucide-react";
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
}

const ipdPhases: IpdPhase[] = [
  { id: "requirement", name: "需求阶段" },
  { id: "design", name: "设计阶段" },
  { id: "coding", name: "编码阶段" },
  { id: "build", name: "构建阶段" },
  { id: "test", name: "测试阶段" },
  { id: "release", name: "实施阶段" },
];

const stageSlugMap: Record<string, string> = {
  requirement: "ipd-requirement",
  design: "ipd-design",
  coding: "ipd-coding",
  build: "ipd-build",
  test: "ipd-test",
  release: "ipd-release",
};

export function IpdNavigationClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string | null>("requirement");
  const [viewMode, setViewMode] = useState<"list" | "submit">("list");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useAtom(categoriesAtom);

  const resultsRef = useRef<HTMLDivElement>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);

  const filteredPhases = useMemo(
    () =>
      ipdPhases.filter((phase) =>
        phase.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const currentPhase = useMemo(
    () => ipdPhases.find((p) => p.id === selectedStage),
    [selectedStage]
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
    if (!selectedStage) {
      setCurrentCategoryId(null);
      return;
    }

    const slug = stageSlugMap[selectedStage];
    const category = categories.find((c) => c.slug === slug);

    if (category) {
      setCurrentCategoryId(category.id);
    } else {
      setCurrentCategoryId(null);
    }
  }, [selectedStage, categories]);

  const fetchWebsites = useCallback(async (categoryId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/websites?ipd_category_id=${categoryId}`);
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

  const handleStageClick = useCallback((stageId: string) => {
    setSelectedStage(stageId);
    setViewMode("list");

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
              placeholder="搜索IPD流程阶段..."
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
                    onClick={() => handleStageClick(phase.id)}
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

              <div ref={resultsRef} className="space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase text-primary tracking-widest">当前阶段</div>
                  <h3 className="text-2xl font-bold mt-1">{currentPhase.name}</h3>
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
                      hideCategory={true}
                      defaultValues={{
                        category_id: "2",
                        ipd_category_id: currentCategoryId?.toString()
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
