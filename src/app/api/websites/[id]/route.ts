import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";
import { prisma } from "@/lib/db/db";
import { websiteFormSchema } from "@/lib/utils/validations";

// GET /api/websites/[id]
// 获取单个网站
export async function GET(
  _request: Request,
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
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(AjaxResponse.fail("Website ID is required"), {
        status: 400,
      });
    }

    const websiteId = parseInt(id);
    if (isNaN(websiteId)) {
      return NextResponse.json(AjaxResponse.fail("Invalid Website ID"), {
        status: 400,
      });
    }

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
    const json = await request.json();
    const result = websiteFormSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        AjaxResponse.fail(result.error.errors[0].message),
        { status: 400 }
      );
    }

    const data = result.data;
    const { id } = await params;
    const websiteId = parseInt(id);

    const existingWebsite = await prisma.website.findUnique({
      where: { id: websiteId },
    });

    if (!existingWebsite) {
      return NextResponse.json(AjaxResponse.fail("Website not found"), {
        status: 404,
      });
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(data.category_id) },
    });

    if (!category) {
      return NextResponse.json(AjaxResponse.fail("Category does not exist"), {
        status: 400,
      });
    }

    // 处理缩略图（如果更新了 URL 或缩略图地址）
    let imageBase64 = existingWebsite.thumbnail_base64;
    if (data.thumbnail && data.thumbnail !== existingWebsite.thumbnail) {
      try {
        const image = await fetch(data.thumbnail);
        if (image.ok) {
          const imageBuffer = await image.arrayBuffer();
          imageBase64 = `data:${image.headers.get(
            "content-type"
          )};base64,${Buffer.from(imageBuffer).toString("base64")}`;
        }
      } catch (e) {
        console.error("Failed to fetch thumbnail:", e);
      }
    }

    const website = await prisma.website.update({
      where: { id: websiteId },
      data: {
        title: data.title,
        url: data.url,
        description: data.description,
        category_id: Number(data.category_id),
        thumbnail: data.thumbnail || "",
        thumbnail_base64: imageBase64,
        status: json.status || existingWebsite.status,
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
