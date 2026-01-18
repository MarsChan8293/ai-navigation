import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/websites/[id]/dislike - Add dislike
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const websiteId = parseInt((await params).id);

        // Increment dislikes
        const updatedWebsite = await prisma.website.update({
            where: { id: websiteId },
            data: { dislikes: { increment: 1 } },
        });

        // Check if dislikes exceed threshold
        if (updatedWebsite.dislikes > 10) {
            console.log(`Website ${websiteId} exceeded 10 dislikes. Deleting...`);
            await prisma.website.delete({
                where: { id: websiteId },
            });

            return NextResponse.json(AjaxResponse.ok({
                dislikes: updatedWebsite.dislikes,
                deleted: true
            }));
        }

        return NextResponse.json(AjaxResponse.ok({
            dislikes: updatedWebsite.dislikes,
            deleted: false
        }));
    } catch (error) {
        console.error("Failed to dislike website:", error);
        return NextResponse.json(AjaxResponse.fail("Failed to dislike website"), {
            status: 500,
        });
    }
}
