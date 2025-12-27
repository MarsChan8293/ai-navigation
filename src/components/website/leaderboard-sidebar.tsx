import { Card } from "@/ui/common/card";
import { Trophy } from "lucide-react";

export function LeaderboardSidebar() {
  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center gap-2 px-1">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h2 className="font-semibold text-lg">SWE-bench 排行榜</h2>
      </div>
      <p className="text-sm text-muted-foreground px-1 leading-relaxed">
        SWE-bench 是一个评估大语言模型解决真实软件工程问题能力的基准测试。它要求模型通过修复 GitHub 上的真实 issue 来展示其编程和系统设计能力。
      </p>
      <Card className="overflow-hidden h-[800px] sticky top-24 border-border/50 shadow-sm">
        <iframe
          src="https://www.swebench.com/"
          className="w-full h-full border-0 bg-white"
          title="SWE-bench Leaderboard"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          loading="lazy"
        />
      </Card>
    </div>
  );
}
