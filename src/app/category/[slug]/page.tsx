import { prisma } from "@/lib/db/db";
import HomePage from "@/app/home-page";
import { cachedPrismaQuery } from "@/lib/db/cache";
import { notFound } from "next/navigation";

// Use ISR
export const revalidate = 3600;

export async function generateStaticParams() {
    const categories = await prisma.category.findMany({
        select: { slug: true },
    });
    return categories.map((category) => ({
        slug: category.slug,
    }));
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const startTime = Date.now();

    const [websitesData, categoriesData] = await Promise.all([
        cachedPrismaQuery(
            "approved-websites",
            () =>
                prisma.website.findMany({
                    where: { status: "approved" },
                    select: {
                        id: true,
                        title: true,
                        url: true,
                        description: true,
                        category_id: true,
                        thumbnail: true,
                        thumbnail_base64: true,
                        status: true,
                        visits: true,
                        likes: true,
                        active: true,
                    },
                }),
            { ttl: 86400 }
        ),
        cachedPrismaQuery(
            "all-categories",
            () =>
                prisma.category.findMany({
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        // @ts-ignore
                        likes: true,
                    },
                }),
            { ttl: 604800 }
        ),
    ]);

    // Check if category exists
    const categoryExists =
        slug === "all" || categoriesData.some((c) => c.slug === slug);

    if (!categoryExists) {
        notFound();
    }

    const endTime = Date.now();
    console.log(`Data load time: ${endTime - startTime}ms`);

    const preFilteredWebsites = websitesData.map((website) => ({
        ...website,
        status: website.status as "approved" | "pending" | "rejected" | "all",
        searchText: `${website.title.toLowerCase()} ${website.description.toLowerCase()}`,
    }));

    return (
        <HomePage
            initialWebsites={preFilteredWebsites}
            initialCategories={categoriesData as any}
            categorySlug={slug}
        />
    );
}
