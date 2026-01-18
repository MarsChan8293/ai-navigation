"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils/utils";

interface UseCaseRendererProps {
  content: string;
  className?: string;
}

export function UseCaseRenderer({ content, className }: UseCaseRendererProps) {
  return (
    <div
      className={cn("text-sm leading-relaxed text-foreground/90", className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}

        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-foreground mb-3 mt-6">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-foreground mb-3 mt-5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/40 pl-4 italic text-foreground/80 mb-3">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-muted/60 px-1 py-0.5 text-xs">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="rounded-lg bg-muted/60 p-3 text-xs overflow-x-auto mb-3">
              {children}
            </pre>
          ),
          a: ({ children, node, className, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("text-primary underline underline-offset-4", className)}
            >
              {children}
            </a>
          ),
        }}
      >
        {content || "暂无内容"}
      </ReactMarkdown>
    </div>
  );
}
