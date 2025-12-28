import { Metadata } from "next";
import { IpdNavigationClient } from "./ipd-navigation-client";

export const metadata: Metadata = {
  title: "IPD网站导航 - AI 导航",
  description: "集成产品开发(IPD)流程网站导航，涵盖需求分析、设计、开发测试、发布部署等各阶段相关资源。",
};

export default function IpdNavigationPage() {
  return <IpdNavigationClient />;
}
