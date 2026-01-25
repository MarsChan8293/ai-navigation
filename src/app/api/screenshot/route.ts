import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";
import { ScreenshotService } from "@/lib/services/screenshot";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      AjaxResponse.fail("URL is required"),
      { status: 400 }
    );
  }

  try {
    const screenshotPath = await ScreenshotService.captureScreenshot(url);
    return NextResponse.json(AjaxResponse.ok({ path: screenshotPath }));
  } catch (error) {
    console.error("Screenshot capture error:", error);
    const message = error instanceof Error ? error.message : "Failed to capture screenshot";
    return NextResponse.json(AjaxResponse.fail(message), {
      status: 500,
    });
  }
}
