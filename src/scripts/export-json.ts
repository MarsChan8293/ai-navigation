import { prisma } from '../lib/db/db';
import fs from 'fs';
import path from 'path';

async function exportData() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log('🚀 Starting data export...');

  // 1. Export Categories
  const categories = await prisma.category.findMany({
    orderBy: { id: 'asc' }
  });
  fs.writeFileSync(
    path.join(dataDir, 'categories.json'),
    JSON.stringify(categories, null, 2)
  );
  console.log(`✅ Exported ${categories.length} categories`);

  // 2. Export Websites
  // Include category slug to make the data portable
  const websites = await prisma.website.findMany({
    include: {
      category: {
        select: { slug: true }
      }
    },
    orderBy: { id: 'asc' }
  });

  // Transform to flat structure with category_slug
  const websitesExport = websites.map(site => {
    const { category, category_id, ...rest } = site;
    return {
      ...rest,
      category_slug: category.slug
    };
  });

  fs.writeFileSync(
    path.join(dataDir, 'websites.json'),
    JSON.stringify(websitesExport, null, 2)
  );
  console.log(`✅ Exported ${websitesExport.length} websites`);

  // 3. Export Footer Links
  const footerLinks = await prisma.footerLink.findMany({
    orderBy: { id: 'asc' }
  });
  fs.writeFileSync(
    path.join(dataDir, 'footer-links.json'),
    JSON.stringify(footerLinks, null, 2)
  );
  console.log(`✅ Exported ${footerLinks.length} footer links`);

  // 4. Export Settings
  const settings = await prisma.setting.findMany({
    orderBy: { id: 'asc' }
  });
  fs.writeFileSync(
    path.join(dataDir, 'settings.json'),
    JSON.stringify(settings, null, 2)
  );
  console.log(`✅ Exported ${settings.length} settings`);
  
  console.log(`🎉 Data export completed to ${dataDir}`);
}

exportData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
