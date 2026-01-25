import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/db";
import { ScreenshotService } from "@/lib/services/screenshot";
import { AjaxResponse } from "@/lib/utils";

export async function POST() {
  try {
    const websites = await prisma.website.findMany({
      where: {
        status: 'approved',
      },
    });

    if (websites.length === 0) {
      return NextResponse.json(
        AjaxResponse.ok({ message: "没有需要更新的网站", updated: 0 }),
        { status: 200 }
      );
    }

    let updatedCount = 0;
    const results = [];

    for (const website of websites) {
      try {
        console.log(`正在为 ${website.title} (${website.url}) 生成截图...`);
        
        const screenshotData = await ScreenshotService.captureScreenshot(website.url);
        
        await prisma.website.update({
          where: { id: website.id },
          data: {
            thumbnail: screenshotData.thumbnail,
          },
        });

        updatedCount++;
        results.push({
          id: website.id,
          title: website.title,
          status: 'success',
          thumbnail: screenshotData.thumbnail,
        });
        
        console.log(`✓ ${website.title} 缩略图更新成功`);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`✗ ${website.title} 缩略图更新失败:`, error);
        results.push({
          id: website.id,
          title: website.title,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json(
      AjaxResponse.ok({
        message: `缩略图更新完成，共更新 ${updatedCount}/${websites.length} 个网站`,
        updated: updatedCount,
        total: websites.length,
        results,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("批量更新缩略图失败:", error);
    return NextResponse.json(
      AjaxResponse.fail(
        error instanceof Error ? error.message : "Failed to update thumbnails"
      ),
      { status: 500 }
    );
  }
}
