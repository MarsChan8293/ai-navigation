import Link from "next/link";
import { Trophy, Plus, Brain, Download, MessageSquare } from "lucide-react";
import { Button } from "@/ui/common/button";
import ThemeSwitch from "@/components/theme-switcher/theme-switch";
import MobileMenu from "./mobile-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/common/tooltip";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 apple-glass">
      <nav className="container mx-auto px-4 h-14">
        <div className="flex h-full items-center justify-between gap-4">
          {/* Logo and Title */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:scale-105 transition-transform apple-ease"
          >
            <Brain className="h-6 w-6 text-primary" />
            <div className="flex items-center gap-0.5">
              <span className="font-bold tracking-wider text-foreground">AI Nav</span>
              <span
                className="text-muted-foreground px-1.5 font-medium text-xs tracking-widest"
              >
                Navigation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/use-cases">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
              >
                <MessageSquare className="h-4 w-4" />
                <span>使用案例</span>
              </Button>
            </Link>

            <Link href="/rankings">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-fuchsia-300 hover:text-fuchsia-200 hover:bg-fuchsia-500/10 border border-transparent hover:border-fuchsia-500/30"
              >
                <Trophy className="h-4 w-4" />
                <span>排行榜</span>
              </Button>
            </Link>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/scripts/tamper-monkey-script.user.js">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30"
                    >
                      <Download className="h-4 w-4" />
                      <span>安装脚本</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] p-3 bg-card/95 backdrop-blur border-cyan-500/30">
                  <p className="font-medium mb-1 text-cyan-300">AI导航助手脚本</p>
                  <p className="text-sm text-muted-foreground">
                    功能：自动识别并采集当前网页的AI工具信息，快速提交到AI导航。
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    需要先安装 Tampermonkey 或 Violentmonkey 浏览器扩展。
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Link href="/submit">
              <Button size="sm" className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 hover:from-cyan-500/30 hover:to-fuchsia-500/30 border border-cyan-500/50 hover:border-fuchsia-500/50 text-cyan-200">
                <Plus className="h-4 w-4" />
                <span>提交网站</span>
              </Button>
            </Link>

            <ThemeSwitch />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
