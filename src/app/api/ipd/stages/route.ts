import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/db";
import { AjaxResponse } from "@/lib/utils/utils";

// POST - 创建新的IPD阶段项
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phase_id, order_num, bg_color, is_important } = body;

    if (!name || !phase_id || order_num === undefined) {
      return NextResponse.json(
        AjaxResponse.error("缺少必要字段"),
        { status: 400 }
      );
    }

    const stage = await prisma.iPDStage.create({
      data: {
        name,
        phase_id,
        order_num,
        bg_color: bg_color || null,
        is_important: is_important || false,
      },
    });

    return NextResponse.json(AjaxResponse.ok(stage));
  } catch (error) {
    console.error("Error creating IPD stage:", error);
    return NextResponse.json(
      AjaxResponse.error("创建IPD阶段项失败"),
      { status: 500 }
    );
  }
}
