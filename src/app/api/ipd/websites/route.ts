import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/db";
import { AjaxResponse } from "@/lib/utils/utils";

// POST - 创建新的IPD网站
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, description, stage_id, order_num } = body;

    if (!title || !url || !stage_id) {
      return NextResponse.json(
        AjaxResponse.error("缺少必要字段"),
        { status: 400 }
      );
    }

    const website = await prisma.iPDWebsite.create({
      data: {
        title,
        url,
        description: description || null,
        stage_id,
        order_num: order_num || 0,
      },
    });

    return NextResponse.json(AjaxResponse.ok(website));
  } catch (error) {
    console.error("Error creating IPD website:", error);
    return NextResponse.json(
      AjaxResponse.error("创建IPD网站失败"),
      { status: 500 }
    );
  }
}

// DELETE - 删除IPD网站
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        AjaxResponse.error("缺少网站ID"),
        { status: 400 }
      );
    }

    await prisma.iPDWebsite.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(AjaxResponse.ok({ message: "删除成功" }));
  } catch (error) {
    console.error("Error deleting IPD website:", error);
    return NextResponse.json(
      AjaxResponse.error("删除IPD网站失败"),
      { status: 500 }
    );
  }
}
