import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";
import { CategoryService } from "@/lib/services/category";

// GET: 查询所有分类
export async function GET() {
  try {
    const categories = await CategoryService.getAllCategories();
    return NextResponse.json(AjaxResponse.ok(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(AjaxResponse.fail("获取分类数据失败"), { status: 500 });
  }
}

// POST: 创建新分类
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newCategory = await CategoryService.createCategory(data);
    return NextResponse.json(AjaxResponse.ok(newCategory));
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(AjaxResponse.fail("创建分类失败"), { status: 500 });
  }
}
