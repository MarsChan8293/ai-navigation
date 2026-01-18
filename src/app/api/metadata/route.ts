import { NextResponse } from "next/server";
import { fetchMetadata } from "@/lib/utils";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ success: false, message: "URL is required" }, { status: 400 });
    }

    try {
        const metadata = await fetchMetadata(url);
        return NextResponse.json({ success: true, data: metadata });
    } catch (error) {
        console.error("Metadata fetch error:", error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "Failed to fetch metadata" },
            { status: 500 }
        );
    }
}
