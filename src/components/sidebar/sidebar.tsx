"use client";

import { motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Brain,
} from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils/utils";
import { useState } from "react";
import { Button } from "@/ui/common/button";
import Link from "next/link";
import ThemeSwitch from "@/components/theme-switcher/theme-switch";
import { usePathname } from "next/navigation";

interface SidebarProps {
    categories: Category[];
}

function SidebarItem({ href, label, isCollapsed, isAll, slug }: { href: string, label: string, isCollapsed: boolean, isAll: boolean, slug: string }) {
    const pathname = usePathname();
    const isActive = isAll ? (pathname === "/" || pathname === "/category/all") : pathname === `/category/${slug}`;

    return (
        <Link
            href={href}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative border border-transparent",
                isActive
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                    : "text-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/20"
            )}
        >
            {!isCollapsed && (
                <span className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full text-left font-mono tracking-wide">
                    {label}
                </span>
            )}
            {isActive && !isCollapsed && (
                <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                />
            )}

            {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-card/95 backdrop-blur text-cyan-300 text-xs font-bold rounded-lg border border-cyan-500/50 opacity backdrop-blur-xl 0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-[0_0_20px_rgba(0,255,255,0.3)] z-[100]">
                    {label}
                </div>
            )}
        </Link>
    )
}

export function Sidebar({ categories }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const categoriesWithAll = [
        { id: null, name: "全部资料", slug: "all" },
        ...categories,
    ];

    const mainNavLinks = [
        { name: "使用案例", href: "/use-cases" },
        { name: "排行榜", href: "/rankings" },
        { name: "提交网站", href: "/submit" },
        { name: "管理", href: "/admin" },
    ];

    return (
        <div
            className={cn(
                "relative h-screen bg-card/60 backdrop-blur-2xl border-r border-cyan-500/20 transition-all duration-300 flex flex-col z-50",
                isCollapsed ? "w-[72px]" : "w-56"
            )}
        >
            {/* Sidebar Header / Logo */}
            <div className={cn(
                "p-6 flex items-center transition-all duration-300",
                isCollapsed ? "justify-center" : "justify-start gap-4"
            )}>
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/50 flex items-center justify-center shrink-0 tech-border">
                        <Brain className="w-5.5 h-5.5 text-cyan-300 neon-text" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-black text-lg tracking-tighter leading-none font-mono text-cyan-300">AI Nav</span>
                            <span className="text-[9px] font-bold text-cyan-500/60 uppercase tracking-widest mt-1 font-mono">CYBER.DECK</span>
                        </div>
                    )}
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
                <div className="mb-4">
                    {!isCollapsed && <p className="px-2 mb-2 text-[10px] font-bold text-cyan-500/60 uppercase tracking-widest font-mono">分类浏览</p>}
                    {categoriesWithAll.map((category) => {
                        const href = category.slug === "all" ? "/" : `/category/${category.slug}`;
                        const isAll = category.slug === "all";

                        return (
                            <SidebarItem
                                key={category.slug || "all"}
                                href={href}
                                label={category.name}
                                isCollapsed={isCollapsed}
                                isAll={isAll}
                                slug={category.slug || "all"}
                            />
                        );
                    })}
                </div>

                <div className="pt-4 border-t border-cyan-500/20">
                    {!isCollapsed && <p className="px-2 mb-2 text-[10px] font-bold text-fuchsia-500/60 uppercase tracking-widest font-mono">导航链接</p>}
                    {mainNavLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const isExternal = link.href.startsWith("http");

                        if (isExternal) {
                            return (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                        "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                    )}
                                >
                                    {!isCollapsed && (
                                        <span className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                                            {link.name}
                                        </span>
                                    )}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-bold rounded-lg border border-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-[100]">
                                            {link.name}
                                        </div>
                                    )}
                                </a>
                            );
                        }

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                {!isCollapsed && (
                                    <span className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                                        {link.name}
                                    </span>
                                )}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-bold rounded-lg border border-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-[100]">
                                        {link.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Sidebar Footer / Toggle */}
            <div className="p-4 border-t border-border/40 flex flex-col gap-3">
                {!isCollapsed && (
                    <div className="flex items-center justify-between px-2 bg-muted/40 rounded-xl p-2.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase py-1">暗色模式</span>
                        <ThemeSwitch />
                    </div>
                )}

                {isCollapsed && (
                    <div className="flex justify-center">
                        <ThemeSwitch />
                    </div>
                )}

                <Button
                    variant="secondary"
                    size="sm"
                    className={cn(
                        "w-full flex items-center justify-center gap-2 h-9 rounded-xl font-bold text-xs transition-all",
                        isCollapsed && "p-0 h-9 w-9 mx-auto"
                    )}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /> 收起侧栏</>}
                </Button>
            </div>
        </div>
    );
}
