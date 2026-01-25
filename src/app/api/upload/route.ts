import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { AjaxResponse } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        AjaxResponse.fail("No file provided"),
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        AjaxResponse.fail("Invalid file type. Allowed: JPEG, PNG, WebP, GIF"),
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        AjaxResponse.fail(`File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`),
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const ext = file.type.split('/')[1];
    const filename = `${timestamp}.${ext}`;
    const filepath = join(process.cwd(), 'public', 'screenshots', filename);

    await writeFile(filepath, buffer);

    return NextResponse.json(
      AjaxResponse.ok({ path: `/screenshots/${filename}` })
    );

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      AjaxResponse.fail("Failed to upload file"),
      { status: 500 }
    );
  }
}
