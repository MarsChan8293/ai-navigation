"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/common/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/common/dropdown-menu";
import type { Category } from "@/lib/types";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categoriesWithAll = [
    { id: -1, name: "全部资料", slug: "all", likes: 0 },
    ...categories,
  ];

  // Determine active category based on pathname
  // / -> all
  // /category/ai-chat -> ai-chat
  const currentSlug = pathname === "/" || pathname === "/category/all"
    ? "all"
    : pathname.startsWith("/category/")
      ? pathname.split("/category/")[1]
      : "all";

  const selectedCategory = categoriesWithAll.find(c => c.slug === currentSlug) || categoriesWithAll[0];
  const selectedCategoryName = selectedCategory.name;

  const handleCategorySelect = (slug: string) => {
    if (slug === "all") {
      router.push("/");
    } else {
      router.push(`/category/${slug}`);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Mobile: Dropdown Menu */}
      <div className="bg-background/20 backdrop-blur-xl border-border/40 shadow-lg md:hidden rounded-xl">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-background/40 backdrop-blur-sm border-border/30 hover:bg-background/60 hover:border-border/50 h-10 px-4 rounded-xl"
            >
              <motion.span
                initial={false}
                animate={{
                  color:
                    currentSlug === "all"
                      ? "hsl(var(--primary))"
                      : "hsl(var(--foreground))",
                }}
                className="font-medium"
              >
                {selectedCategoryName}
              </motion.span>
              <motion.div
                initial={false}
                animate={{ rotate: 0 }}
                exit={{ rotate: 180 }}
              >
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </motion.div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[calc(100vw-2rem)] min-w-[200px] bg-background/95 backdrop-blur-md border-border/30 shadow-lg rounded-lg overflow-hidden"
            align="center"
            sideOffset={8}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="py-1"
            >
              {categoriesWithAll.map((category) => (
                <DropdownMenuItem
                  key={category.slug}
                  onClick={() => handleCategorySelect(category.slug)}
                  className={`${currentSlug === category.slug
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/80 hover:text-foreground"
                    } h-11 flex items-center px-4 hover:bg-accent/50 focus:bg-accent active:bg-accent/70 transition-colors duration-200`}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop: Tiled Categories */}
      <div className="hidden md:block">
        <div className="flex flex-wrap items-center justify-center gap-2 px-4">
          {categoriesWithAll.map((category) => (
            <motion.button
              key={category.slug}
              onClick={() => handleCategorySelect(category.slug)}
              className={`h-8 px-4 text-sm whitespace-nowrap transition-colors duration-300 rounded-md
                ${currentSlug === category.slug
                  ? "bg-white dark:bg-primary text-primary dark:text-primary-foreground font-medium shadow-[0_2px_12px_-2px_rgba(0,0,0,0.2)] dark:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.4)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: currentSlug === category.slug ? 1.08 : 1,
                y: currentSlug === category.slug ? -1 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
