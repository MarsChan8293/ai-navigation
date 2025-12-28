"use client";

import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { selectedCategoryAtom } from "@/lib/atoms/index";
import { Button } from "../ui/common/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/common/dropdown-menu";
import type { Category } from "@/lib/types";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/utils";

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <motion.button
          key="all"
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          全部
        </motion.button>
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
