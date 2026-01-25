import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";
import { CategoryService } from "@/lib/services/category";

// PUT: 更新分类
export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { name, slug } = await request.json();
    const id = parseInt(params.id);

    if (!name || !slug) {
      return NextResponse.json(
        AjaxResponse.fail("Missing required fields: name or slug"),
        { status: 400 }
      );
    }

    const updatedCategory = await CategoryService.updateCategory(id, { name, slug });
    return NextResponse.json(AjaxResponse.ok(updatedCategory));
  } catch (error) {
    console.error("Error updating category:", error);
    const message = error instanceof Error ? error.message : "更新分类失败";
    return NextResponse.json(AjaxResponse.fail(message), {
      status: message.includes("not found") ? 404 : 500,
    });
  }
}

// DELETE: 删除分类
export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);
    await CategoryService.deleteCategory(id);
    return NextResponse.json(AjaxResponse.ok(null));
  } catch (error) {
    console.error("Error deleting category:", error);
    const message = error instanceof Error ? error.message : "删除分类失败";
    return NextResponse.json(AjaxResponse.fail(message), {
      status: message.includes("无法删除") ? 409 : 500,
    });
  }
}
