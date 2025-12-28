"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink } from "lucide-react";
import { Card } from "@/ui/common/card";
import { Input } from "@/ui/common/input";
import { cn } from "@/lib/utils/utils";

// IPD阶段数据结构
interface IpdPhase {
  id: string;
  name: string;
  items: IpdItem[];
}

interface IpdItem {
  id: string;
  name: string;
  important?: boolean; // 是否标记星标
  color?: "yellow" | "green" | "default" | "dark";
  websites?: IpdWebsite[];
}

interface IpdWebsite {
  id: string;
  title: string;
  url: string;
  description: string;
}

// IPD流程数据
const ipdPhases: IpdPhase[] = [
  {
    id: "requirement",
    name: "需求阶段",
    items: [
      { id: "research", name: "需求调研", color: "default" },
      { id: "analysis", name: "需求分析", color: "yellow" },
      { id: "coding", name: "需求编写", color: "yellow" },
      { id: "review", name: "需求审讲&反审讲", color: "default" },
    ],
  },
  {
    id: "design",
    name: "设计阶段",
    items: [
      { id: "architecture", name: "架构设计", color: "yellow", important: true },
      { id: "concept", name: "概要设计", color: "yellow" },
      { id: "detail", name: "详细设计", color: "yellow", important: true },
      { id: "design-review", name: "设计评审", color: "default" },
      { id: "security", name: "网络安全设计", color: "default" },
    ],
  },
  {
    id: "coding",
    name: "编码阶段",
    items: [
      { id: "code-write", name: "代码编写", color: "green", important: true },
      { id: "code-read", name: "代码走读", color: "dark" },
      { id: "code-check", name: "代码检视", color: "green", important: true },
      { id: "unit-test", name: "单元测试", color: "green", important: true },
      { id: "code-union", name: "代码联调", color: "dark" },
      { id: "issue-fix", name: "问题单修改", color: "yellow" },
    ],
  },
  {
    id: "build",
    name: "构建阶段",
    items: [
      { id: "cleancode", name: "CleanCode门禁检查", color: "dark" },
      { id: "script-build", name: "构建脚本编写", color: "dark", important: true },
      { id: "auto-script", name: "自动化脚本编写", color: "dark", important: true },
      { id: "personal-build", name: "个人构建", color: "dark" },
      { id: "daily-build", name: "每日构建", color: "dark" },
      { id: "version-build", name: "版本级构建", color: "dark" },
      { id: "smoke-test", name: "冒烟测试", color: "dark" },
      { id: "leak-scan", name: "开源漏洞扫描", color: "dark" },
    ],
  },
  {
    id: "test",
    name: "测试阶段",
    items: [
      { id: "test-design", name: "测试方案设计", color: "yellow" },
      { id: "test-case-write", name: "测试用例编写", color: "yellow", important: true },
      { id: "test-case-auto", name: "自动化脚本编写", color: "yellow", important: true },
      { id: "version-test", name: "版本级测试", color: "dark" },
      { id: "issue-list", name: "提交问题单", color: "dark" },
      { id: "leak-analysis", name: "漏测分析", color: "dark" },
    ],
  },
  {
    id: "release",
    name: "实施阶段",
    items: [
      { id: "release-publish", name: "版本发布上网", color: "dark", important: true },
      { id: "deploy-online", name: "部署上线", color: "dark" },
      { id: "tech-support", name: "技术支持、运维", color: "dark", important: true },
      { id: "qa-improve", name: "网上问题修改", color: "yellow" },
    ],
  },
];

export function IpdNavigationClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<IpdItem | null>(null);

  // 过滤数据 - 使用 useMemo 优化性能
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

  // 获取颜色类名 - 统一使用白底黑字
  const getItemColorClass = useCallback(() => {
    return "bg-white dark:bg-gray-100 text-black border-gray-300 dark:border-gray-400";
  }, []);

  const handleItemClick = useCallback((item: IpdItem) => {
    setSelectedItem(item);
  }, []);

  return (
    <div className="min-h-screen bg-background/50">
      <div className="container mx-auto px-4 py-8">
        {/* 标题 */}
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

        {/* 搜索框 */}
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

        {/* IPD流程导航 */}
        <div className="mb-8">
          {/* 顶部阶段导航栏 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mb-6 overflow-x-auto"
          >
            <div className="flex items-center gap-4 min-w-max bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 rounded-lg">
              {/* IPD流程标题 */}
              <div className="px-6 py-3 bg-slate-700 text-white font-bold text-lg whitespace-nowrap">
                IPD流程
              </div>
              
              {/* 阶段按钮 */}
              {filteredPhases.map((phase, index) => (
                <div key={phase.id} className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setSelectedStage(
                        selectedStage === phase.id ? null : phase.id
                      )
                    }
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

          {/* 阶段详细内容 */}
          <AnimatePresence mode="wait">
            {selectedStage && (
              <motion.div
                key={selectedStage}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredPhases.map((phase) =>
                  phase.id === selectedStage ? (
                    <Card key={phase.id} className="p-6">
                      <h2 className="text-2xl font-bold mb-6">{phase.name}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {phase.items.map((item) => (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleItemClick(item)}
                            className={cn(
                              "relative p-4 rounded-lg border-2 text-left transition-all duration-200",
                              getItemColorClass(),
                              "hover:shadow-lg"
                            )}
                          >
                            <div className="font-medium">{item.name}</div>
                          </motion.button>
                        ))}
                      </div>
                    </Card>
                  ) : null
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 所有阶段网格视图（默认显示） */}
        {!selectedStage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPhases.map((phase) => (
              <Card key={phase.id} className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-2 h-6 bg-primary rounded-full" />
                  {phase.name}
                </h3>
                <div className="space-y-2">
                  {phase.items.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "relative w-full p-3 rounded-lg border text-left transition-all duration-200",
                        getItemColorClass(),
                        "hover:shadow-md"
                      )}
                    >
                      <div className="text-sm font-medium">{item.name}</div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* 选中项目的详细信息和相关网站 */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border border-border rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedItem.name}
                      </h2>
                      <p className="text-muted-foreground mt-2">
                        相关资源和工具网站
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <span className="text-2xl">×</span>
                    </button>
                  </div>

                  {/* 相关网站列表 */}
                  <div className="space-y-3">
                    {selectedItem.websites && selectedItem.websites.length > 0 ? (
                      selectedItem.websites.map((website) => (
                        <a
                          key={website.id}
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 rounded-lg border border-border hover:border-primary bg-card hover:shadow-md transition-all duration-200 group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {website.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {website.description}
                              </p>
                              <p className="text-xs text-muted-foreground/70 mt-2">
                                {website.url}
                              </p>
                            </div>
                            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-4" />
                          </div>
                        </a>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>暂无相关网站资源</p>
                        <p className="text-sm mt-2">
                          您可以通过&ldquo;提交网站&rdquo;功能为此阶段添加相关资源
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
