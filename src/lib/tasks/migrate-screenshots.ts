import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Screenshot Migration ---');

    const websites = await prisma.website.findMany();
    console.log(`Found ${websites.length} websites to update.`);

    for (const website of websites) {
        const screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(website.url)}?w=1280&h=720`;

        console.log(`Updating [${website.title}] with screenshot...`);

        await prisma.website.update({
            where: { id: website.id },
            data: {
                thumbnail: screenshotUrl,
                thumbnail_base64: null, // Clear base64 icons to prioritize the new screenshot URL
            },
        });
    }

    console.log('--- Migration Completed Successfully ---');
}

main()
    .catch((e) => {
        console.error('Migration failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
