"use client";

import { Suspense } from "react";
import { SearchBox } from "@/components/search-box";
import CategoryFilter from "@/components/category-filter";
import Fallback from "@/components/loading/fallback";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils/utils";

interface PersistentHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  isScrolled: boolean;
}

export function PersistentHeader({
  searchQuery,
  onSearchChange,
  categories,
  isScrolled,
}: PersistentHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-14 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b shadow-sm py-2"
          : "bg-transparent py-3 sm:py-2 md:py-4"
      )}
    >
      <div className="w-full px-2 md:px-4">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-3 md:space-y-4">
          <div className="max-w-2xl mx-auto relative h-[36px] sm:h-[40px] md:h-[44px] w-full">
            <SearchBox value={searchQuery} onChange={onSearchChange} />
          </div>
          <div className="relative pt-2 min-h-[32px] sm:min-h-[36px] md:min-h-[40px] mt-1 sm:mt-2">
            <Suspense fallback={<Fallback />}>
              <CategoryFilter categories={categories} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
