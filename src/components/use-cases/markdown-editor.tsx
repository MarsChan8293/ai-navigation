"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/utils";
import { UseCaseRenderer } from "./use-case-renderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function MarkdownEditor({ value, onChange, error }: MarkdownEditorProps) {
  const [mode, setMode] = useState<"split" | "write" | "preview">("split");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div 
      className={cn(
        "space-y-3",
        isFullScreen && "fixed inset-0 z-50 bg-background/95 backdrop-blur-lg p-4 md:p-6 lg:p-8 overflow-auto"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {
            [
              { key: "write", label: "编辑" },
              { key: "preview", label: "预览" },
              { key: "split", label: "分栏" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setMode(item.key as typeof mode)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg border transition-all",
                  mode === item.key
                    ? "bg-primary text-primary-foreground border-primary/40"
                    : "bg-background/50 border-border/40 text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))
          }
        </div>
        
        <button
          type="button"
          onClick={toggleFullScreen}
          className={cn(
            "px-3 py-1.5 text-xs font-bold rounded-lg border transition-all",
            "bg-background/50 border-border/40 text-muted-foreground hover:text-foreground"
          )}
          aria-label={isFullScreen ? "退出全屏" : "全屏显示"}
        >
          {isFullScreen ? "退出全屏" : "全屏显示"}
        </button>
      </div>

      <div
        className={cn(
          "grid gap-4",
          mode === "split" ? "md:grid-cols-2" : "grid-cols-1",
          isFullScreen && "min-h-[calc(100vh-8rem)]"
        )}
      >
        {mode !== "preview" && (
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="用 Markdown 书写你的使用案例..."
            className={cn(
              "w-full rounded-xl border border-border/40 bg-background/50 p-3 text-sm text-foreground/90 shadow-inner focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all",
              !isFullScreen && "min-h-[260px]",
              isFullScreen && "min-h-[calc(100vh-8rem)] h-full"
            )}
          />
        )}

        {mode !== "write" && (
          <div className={cn(
            "rounded-xl border border-border/40 bg-background/40 p-3",
            !isFullScreen && "min-h-[260px]",
            isFullScreen && "min-h-[calc(100vh-8rem)] h-full overflow-auto"
          )}>
            <UseCaseRenderer content={value} />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500/70">{error}</p>}
    </div>
  );
}
