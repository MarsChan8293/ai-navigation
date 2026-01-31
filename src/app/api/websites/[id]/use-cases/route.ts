import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/db";
import { AjaxResponse } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const websiteId = Number(params.id);

  if (!Number.isFinite(websiteId)) {
    return NextResponse.json(AjaxResponse.fail("Invalid website ID"), {
      status: 400,
    });
  }

  try {
    const useCases = await prisma.useCase.findMany({
      where: {
        website_id: websiteId,
        status: "published",
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(AjaxResponse.ok(useCases));
  } catch (error) {
    console.error("Failed to fetch use cases:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to fetch use cases"), {
      status: 500,
    });
  }
}
