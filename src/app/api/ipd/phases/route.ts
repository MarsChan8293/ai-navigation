import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/db";
import { AjaxResponse } from "@/lib/utils/utils";

// GET - 获取所有IPD阶段及其子阶段和网站
export async function GET() {
  try {
    const phases = await prisma.iPDPhase.findMany({
      orderBy: { order_num: "asc" },
      include: {
        stages: {
          orderBy: { order_num: "asc" },
          include: {
            websites: {
              orderBy: { order_num: "asc" },
            },
          },
        },
      },
    });

    return NextResponse.json(AjaxResponse.ok(phases));
  } catch (error) {
    console.error("Error fetching IPD phases:", error);
    return NextResponse.json(
      AjaxResponse.error("获取IPD阶段失败"),
      { status: 500 }
    );
  }
}

// POST - 创建新的IPD阶段
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, order_num, color } = body;

    if (!name || !slug || order_num === undefined) {
      return NextResponse.json(
        AjaxResponse.error("缺少必要字段"),
        { status: 400 }
      );
    }

    const phase = await prisma.iPDPhase.create({
      data: {
        name,
        slug,
        order_num,
        color: color || null,
      },
    });

    return NextResponse.json(AjaxResponse.ok(phase));
  } catch (error) {
    console.error("Error creating IPD phase:", error);
    return NextResponse.json(
      AjaxResponse.error("创建IPD阶段失败"),
      { status: 500 }
    );
  }
}
