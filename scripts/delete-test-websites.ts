import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const idsToDelete = [45, 46, 47, 48, 49]

    // Also delete related use cases first if necessary (though Cascade might handle it, better be safe)
    // But schema doesn't specify onDelete: Cascade, so we might need to delete them manually if relations exist.
    // Actually, let's check if they have use cases.
    // For now, let's try deleting them.

    const deletedUseCases = await prisma.useCase.deleteMany({
        where: {
            website_id: {
                in: idsToDelete
            }
        }
    })
    console.log(`Deleted ${deletedUseCases.count} related use cases.`)

    const deletedWebsites = await prisma.website.deleteMany({
        where: {
            id: {
                in: idsToDelete
            }
        }
    })

    console.log(`Deleted ${deletedWebsites.count} test websites.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
