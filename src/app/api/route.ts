import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";

/**
 * @swagger
 * /api:
 *   get:
 *     description: Returns the hello world
 *     tags:
 *       - 网站
 */
export async function GET() {
  try {
    return NextResponse.json(AjaxResponse.ok("hello world"));
  } catch {
    return NextResponse.json(AjaxResponse.fail("Failed to process request"), {
      status: 500,
    });
  }
}
