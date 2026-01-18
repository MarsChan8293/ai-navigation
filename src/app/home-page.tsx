"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import {
  websitesAtom,
  categoriesAtom,
  searchQueryAtom,
  selectedCategoryAtom
} from "@/lib/atoms/index";
import WebsiteGrid from "@/components/website/website-grid";
import { SearchBox } from "@/components/search-box";
import type { Website, Category } from "@/lib/types";
// 移除懒加载，直接导入LeaderboardSidebar组件
import { LeaderboardSidebar } from "@/components/website/leaderboard-sidebar";

interface HomePageProps {
  initialWebsites: Website[];
  initialCategories: Category[];
  categorySlug?: string;
}

export default function HomePage({
  initialWebsites,
  initialCategories,
  categorySlug = "all",
}: HomePageProps) {
  const [websites, setWebsites] = useAtom(websitesAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);

  // Init data
  useEffect(() => {
    setWebsites(initialWebsites || []);
    setCategories(initialCategories || []);
  }, [initialWebsites, initialCategories, setWebsites, setCategories]);

  // Sync slug to atom for backward compatibility (component sync)
  useEffect(() => {
    if (categories.length > 0) {
      if (categorySlug === "all") {
        setSelectedCategory(null);
      } else {
        const category = categories.find((c) => c.slug === categorySlug);
        if (category) {
          setSelectedCategory(category.id);
        }
      }
    }
  }, [categorySlug, categories, setSelectedCategory]);

  // Filter logic
  useEffect(() => {
    if (!websites) return;

    const filtered = websites.filter((website) => {
      const matchesSearch =
        !searchQuery ||
        website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        website.description.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesCategory = true;
      if (categorySlug && categorySlug !== "all") {
        const category = categories.find((c) => c.slug === categorySlug);
        if (category) {
          matchesCategory = website.category_id === category.id;
        }
      }

      return matchesSearch && matchesCategory;
    });

    setFilteredWebsites(filtered);
  }, [websites, searchQuery, categorySlug, categories]);

  const currentCategory =
    categorySlug === "all"
      ? null
      : categories.find((c) => c.slug === categorySlug);
  const showLeaderboard = currentCategory?.slug === "llm";

  return (
    <div className="flex flex-col min-h-full bg-background/50">
      {/* Top Header Section */}
      <header className="sticky top-0 z-30 w-full bg-background/60 backdrop-blur-2xl border-b border-border/40 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              {currentCategory?.name || "全部工具"}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Discover the best AI resources
                </p>
              </div>

            </div>
          </div>

          <div className="w-full md:w-[400px] relative group">
            <SearchBox value={searchQuery} onChange={(val) => setSearchQuery(val)} />
            <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 p-6 md:p-8">
        <div className="flex gap-8 items-start">
          <div className="flex-1 min-w-0">
            <WebsiteGrid
              websites={filteredWebsites}
              categories={categories}
            />
          </div>

          {showLeaderboard && (
            <aside className="hidden 2xl:block w-[320px] shrink-0 sticky top-28">
              <LeaderboardSidebar />
            </aside>
          )}
        </div>
      </main>

      {/* Optional: Simple Footer if needed */}
      <footer className="px-8 py-6 border-t border-border/40 flex items-center justify-between text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
        <p>© 2024 AI NAV — EXPLORE THE NEW ERA</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
