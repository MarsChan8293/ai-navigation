import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";
import { prisma } from "@/lib/db/db";
import { invalidateCache } from "@/lib/db/cache";


// GET /api/websites/[id]
// 获取单个网站
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const websiteId = parseInt((await params).id);
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: { category: true },
    });

    if (!website) {
      return NextResponse.json(AjaxResponse.fail("Website not found"), {
        status: 404,
      });
    }

    return NextResponse.json(AjaxResponse.ok(website));
  } catch (error) {
    console.error("Failed to fetch website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to fetch website"), {
      status: 500,
    });
  }
}

// DELETE /api/websites/[id]
// 删除网站
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log("DELETE request params:", resolvedParams);
    
    if (!resolvedParams.id) {
      return NextResponse.json(AjaxResponse.fail("Website ID is required"), {});
    }

    const websiteId = parseInt(resolvedParams.id);
    console.log("Parsed websiteId:", websiteId);

    // Check if website exists first
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
    });

    if (!website) {
      return NextResponse.json(AjaxResponse.fail("Website not found"), {
        status: 404,
      });
    }

    // Delete the website
    await prisma.website.delete({
      where: { id: websiteId },
    });

    invalidateCache("approved-websites");

    return NextResponse.json(AjaxResponse.ok("Website deleted successfully"));
  } catch (error) {
    console.error("Failed to delete website:", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(AjaxResponse.fail("Website not found"), {
        status: 404,
      });
    }
    return NextResponse.json(AjaxResponse.fail("Failed to delete website"), {
      status: 500,
    });
  }
}

// PUT /api/websites/[id]
// 更新网站
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const websiteId = parseInt((await params).id);

    const existingWebsite = await prisma.website.findUnique({
      where: { id: websiteId },
    });

    if (!existingWebsite) {
      return NextResponse.json(AjaxResponse.fail("Website not found"), {
        status: 404,
      });
    }

    if (!data.title || !data.url || !data.category_id) {
      return NextResponse.json(
        AjaxResponse.fail(
          "Missing required fields: title, url, or category_id"
        ),
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(data.category_id) },
    });

    if (!category) {
      return NextResponse.json(AjaxResponse.fail("Category does not exist"), {
        status: 400,
      });
    }

    // Check if IPD category exists if provided
    if (data.ipd_category_id) {
      const ipdCategory = await prisma.category.findUnique({
        where: { id: Number(data.ipd_category_id) },
      });

      if (!ipdCategory) {
        return NextResponse.json(AjaxResponse.fail("IPD Category does not exist"), {
          status: 400,
        });
      }
    }

    const website = await prisma.website.update({
      where: { id: websiteId },
      data: {
        title: data.title,
        url: data.url,
        description: data.description || "",
        category_id: Number(data.category_id),
        ipd_category_id: data.ipd_category_id ? Number(data.ipd_category_id) : null,
        thumbnail: data.thumbnail || "",
        status: data.status || existingWebsite.status,
      },
    });

    return NextResponse.json(AjaxResponse.ok(website));
  } catch (error) {
    console.error("Failed to update website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to update website"), {
      status: 500,
    });
  }
}
