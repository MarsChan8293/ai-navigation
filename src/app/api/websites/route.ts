import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";
import { WebsiteService } from "@/lib/services/website";
import { websiteFormSchema } from "@/lib/utils/validations";
import { clearCache } from "@/lib/db/cache";

// GET /api/websites
// 获取所有指定状态的网站
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "approved";
  
  try {
    const websites = await WebsiteService.getWebsites(status);
    return NextResponse.json(AjaxResponse.ok(websites));
  } catch {
    return NextResponse.json(AjaxResponse.fail("Failed to fetch websites"), { status: 500 });
  }
}

// POST /api/websites
// 创建网站
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = websiteFormSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        AjaxResponse.fail(result.error.errors[0].message),
        { status: 400 }
      );
    }

    const website = await WebsiteService.createWebsite(result.data);
    await clearCache("approved-websites");
    return NextResponse.json(AjaxResponse.ok(website));
  } catch (error) {
    console.error("Failed to create website:", error);
    const message = error instanceof Error ? error.message : "Failed to create website";
    return NextResponse.json(AjaxResponse.fail(message), {
      status: message.includes("exists") || message.includes("Category") ? 400 : 500,
    });
  }
}
