
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Starting verification test...")

    // 1. Create a dummy category if not exists
    let category = await prisma.category.findFirst({
        where: { slug: 'test-category-verify' }
    })

    if (!category) {
        category = await prisma.category.create({
            data: {
                name: 'Test Category Verify',
                slug: 'test-category-verify',
            }
        })
        console.log("Created test category.")
    }

    // 2. Create a website with use cases
    const website = await prisma.website.create({
        data: {
            title: 'Verify Delete Website',
            url: 'https://verify-delete.com',
            description: 'A website to verify delete functionality',
            category_id: category.id,
            status: 'pending',
            use_cases: {
                create: [
                    {
                        title: 'Use Case 1',
                        content: 'Content 1',
                        status: 'published'
                    }
                ]
            }
        }
    })
    console.log(`Created website: ${website.id} with use cases.`)

    // 3. Attempt to delete properly (simulating the fix)
    try {
        console.log("Attempting to delete website with transaction (The Fix)...")

        await prisma.$transaction([
            prisma.useCase.deleteMany({
                where: { website_id: website.id },
            }),
            prisma.website.delete({
                where: { id: website.id },
            }),
        ]);

        console.log("SUCCESS: Website and UseCases deleted successfully.")

        // Verify it's gone
        const check = await prisma.website.findUnique({ where: { id: website.id } })
        if (!check) {
            console.log("Verification passed: Website not found in DB.")
        } else {
            console.log("Verification failed: Website still exists!")
        }

    } catch (error) {
        console.error("FAILURE: Delete operation failed.", error)
    }

    // Cleanup category
    // await prisma.category.delete({ where: { id: category.id } })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
