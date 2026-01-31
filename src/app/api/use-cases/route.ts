import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/db";
import { AjaxResponse } from "@/lib/utils";

// GET /api/use-cases
// 获取案例列表，支持分页和按网站过滤
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const pageSize = Math.min(
    Math.max(Number(searchParams.get("pageSize") || 10), 1),
    50
  );
  const websiteIdParam = searchParams.get("websiteId");
  const websiteId = websiteIdParam ? Number(websiteIdParam) : null;

  const where: Record<string, unknown> = {
    status: "published",
    ...(websiteId !== null && Number.isFinite(websiteId) ? { website_id: websiteId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.useCase.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        website: {
          select: {
            id: true,
            title: true,
            url: true,
            thumbnail: true,
          },
        },
      },
    }),
    prisma.useCase.count({ where }),
  ]);

  return NextResponse.json(
    AjaxResponse.ok({
      items,
      total,
      page,
      pageSize,
    })
  );
}

// POST /api/use-cases
// 创建案例，直接发布
export async function POST(request: Request) {
  if (!request.body) {
    return NextResponse.json(AjaxResponse.fail("Request body is required"), {
      status: 400,
    });
  }

  try {
    const data = await request.json();

    if (!data.title || !data.content || !data.website_id) {
      return NextResponse.json(
        AjaxResponse.fail("Missing required fields: title, content, website_id"),
        { status: 400 }
      );
    }

    const website = await prisma.website.findUnique({
      where: { id: Number(data.website_id) },
    });

    if (!website) {
      return NextResponse.json(AjaxResponse.fail("Website does not exist"), {
        status: 400,
      });
    }

    const useCase = await prisma.useCase.create({
      data: {
        title: data.title.trim(),
        content: data.content.trim(),
        image_base64: data.image_base64 || null,
        website_id: Number(data.website_id),
        external_link: data.external_link || null,
        status: "published",
      },
      include: {
        website: {
          select: {
            id: true,
            title: true,
            url: true,
            thumbnail: true,
          },
        },
      },
    });

    return NextResponse.json(AjaxResponse.ok(useCase));
  } catch (error) {
    console.error("Failed to create use case:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to create use case"), {
      status: 500,
    });
  }
}
