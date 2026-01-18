import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const websites = await prisma.website.findMany({
        where: {
            OR: [
                { title: { contains: 'Test' } },
                { title: { contains: 'test' } },
                { title: { contains: '测试' } },
                { url: { contains: 'test' } },
                { url: { contains: 'example.com' } },
                { description: { contains: 'test' } },
                { description: { contains: '测试' } },
            ],
        },
        select: {
            id: true,
            title: true,
            url: true,
            description: true,
        }
    })

    console.log(JSON.stringify(websites, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
