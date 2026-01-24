import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";
import { prisma } from "@/lib/db/db";

// POST /api/categories/[id]/like - Add like
export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const categoryId = parseInt((await params).id);
        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: { likes: { increment: 1 } },
        });

        return NextResponse.json(AjaxResponse.ok({ likes: updatedCategory.likes }));
    } catch (error) {
        console.error("Failed to like category:", error);
        return NextResponse.json(AjaxResponse.fail("Failed to like category"), {
            status: 500,
        });
    }
}

// DELETE /api/categories/[id]/like - Remove like
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const categoryId = parseInt((await params).id);
        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: { likes: { decrement: 1 } },
        });

        return NextResponse.json(AjaxResponse.ok({ likes: updatedCategory.likes }));
    } catch (error) {
        console.error("Failed to unlike category:", error);
        return NextResponse.json(AjaxResponse.fail("Failed to unlike category"), {
            status: 500,
        });
    }
}
