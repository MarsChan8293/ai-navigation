"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/utils";
import type { UseCase } from "@/lib/types";

interface WebsiteUseCasesProps {
  websiteId: number;
}

export function WebsiteUseCases({ websiteId }: WebsiteUseCasesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUseCases() {
      try {
        const res = await fetch(`/api/websites/${websiteId}/use-cases`);
        const data = await res.json();
        if (data.success) {
          setUseCases(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch use cases:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUseCases();
  }, [websiteId]);

  if (loading || useCases.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-border/40">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4" />
            收起案例
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            查看 {useCases.length} 个案例
          </>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              {useCases.map((useCase) => (
                <motion.div
                  key={useCase.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={cn(
                    "p-3 rounded-lg border border-border/30 bg-muted/20",
                    "hover:border-border/50 hover:bg-muted/30 transition-colors"
                  )}
                >
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {useCase.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {useCase.content.length > 100
                      ? `${useCase.content.slice(0, 100)}...`
                      : useCase.content}
                  </p>
                  {useCase.external_link && (
                    <a
                      href={useCase.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <span>查看演示</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
