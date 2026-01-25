import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";
import { WebsiteService } from "@/lib/services/website";
import { websiteFormSchema } from "@/lib/utils/validations";

// GET /api/websites/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const websiteId = parseInt(id);

    if (isNaN(websiteId)) {
      return NextResponse.json(AjaxResponse.fail("Invalid Website ID"), { status: 400 });
    }

    const website = await WebsiteService.getWebsiteById(websiteId);

    if (!website) {
      return NextResponse.json(AjaxResponse.fail("Website not found"), { status: 404 });
    }

    return NextResponse.json(AjaxResponse.ok(website));
  } catch {
    return NextResponse.json(AjaxResponse.fail("Failed to fetch website"), { status: 500 });
  }
}

// DELETE /api/websites/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const websiteId = parseInt(id);

    if (isNaN(websiteId)) {
      return NextResponse.json(AjaxResponse.fail("Invalid Website ID"), { status: 400 });
    }

    await WebsiteService.deleteWebsite(websiteId);
    return NextResponse.json(AjaxResponse.ok("Website deleted successfully"));
  } catch (error) {
    console.error("Failed to delete website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to delete website"), { status: 500 });
  }
}

// PUT /api/websites/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const websiteId = parseInt(id);

    if (isNaN(websiteId)) {
      return NextResponse.json(AjaxResponse.fail("Invalid Website ID"), { status: 400 });
    }

    const json = await request.json();
    const result = websiteFormSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(AjaxResponse.fail(result.error.errors[0].message), { status: 400 });
    }

    const website = await WebsiteService.updateWebsite(websiteId, { ...result.data, status: json.status });
    return NextResponse.json(AjaxResponse.ok(website));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update website";
    return NextResponse.json(AjaxResponse.fail(message), {
      status: message.includes("not found") ? 404 : 500,
    });
  }
}
