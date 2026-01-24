import { NextResponse } from "next/server";
import type { Website } from "@/lib/types";
import { AjaxResponse } from "@/lib/utils";
import { prisma } from "@/lib/db/db";
import { websiteFormSchema } from "@/lib/utils/validations";

// GET /api/websites
// 获取所有指定分类的网站
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status =
    (searchParams.get("status") as Website["status"]) || "approved";
  const websites = await prisma.website.findMany({
    where: { status: status === "all" ? undefined : status },
  });
  return NextResponse.json(AjaxResponse.ok(websites));
}

// POST /api/websites
// 创建网站
export async function POST(request: Request) {
  if (!request.body) {
    return NextResponse.json(AjaxResponse.fail("Request body is required"), {
      status: 400,
    });
  }

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

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: Number(data.category_id) },
    });

    if (!category) {
      return NextResponse.json(AjaxResponse.fail("Category does not exist"), {
        status: 400,
      });
    }

    // Check if URL already exists
    const existingWebsite = await prisma.website.findFirst({
      where: { url: data.url },
    });

    if (existingWebsite) {
      return NextResponse.json(AjaxResponse.fail("URL already exists"), {
        status: 400,
      });
    }

    // 处理缩略图
    let imageBase64 = null;
    if (data.thumbnail) {
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

    const website = await prisma.website.create({
      data: {
        title: data.title.trim(),
        url: data.url.trim(),
        description: data.description.trim(),
        category_id: Number(data.category_id),
        thumbnail: data.thumbnail?.trim() || "",
        thumbnail_base64: imageBase64,
        status: "pending", // Default to pending for public submissions
      },
    });

    return NextResponse.json(AjaxResponse.ok(website));
  } catch (error) {
    console.error("Failed to create website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to create website"), {
      status: 500,
    });
  }
}
