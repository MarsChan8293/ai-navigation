import { Metadata } from "next";
import { prisma } from "@/lib/db/db";
import { IPDNavigationClient } from "@/components/ipd/ipd-navigation-client";

export const metadata: Metadata = {
  title: "IPD网站导航 - AI导航",
  description: "IPD流程相关网站导航，涵盖需求分析、设计、开发测试、发布部署全流程",
};

export default async function IPDNavigationPage() {
  // 获取所有IPD阶段及其子阶段和网站
  const phases = await prisma.iPDPhase.findMany({
    orderBy: { order_num: "asc" },
    include: {
      stages: {
        orderBy: { order_num: "asc" },
        include: {
          websites: {
            orderBy: { order_num: "asc" },
          },
        },
      },
    },
  });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-6 md:py-8">
      <div className="container mx-auto px-4">
        <IPDNavigationClient phases={phases} />
      </div>
    </div>
  );
}
