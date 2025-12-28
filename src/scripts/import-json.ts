import { prisma } from '../lib/db/db';
import fs from 'fs';
import path from 'path';

async function importData() {
  const dataDir = path.join(process.cwd(), 'data');

  if (!fs.existsSync(dataDir)) {
    console.error('❌ Data directory not found:', dataDir);
    console.log('💡 Run "npm run db:export" first to generate the data directory.');
    process.exit(1);
  }

  console.log('🚀 Starting data import...');

  // 1. Import Settings
  const settingsPath = path.join(dataDir, 'settings.json');
  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    console.log(`Processing ${settings.length} settings...`);
    
    for (const item of settings) {
      await prisma.setting.upsert({
        where: { key: item.key },
        update: { value: item.value },
        create: {
          key: item.key,
          value: item.value
        }
      });
    }
    console.log('✅ Settings imported');
  }

  // 2. Import Categories
  const categoriesPath = path.join(dataDir, 'categories.json');
  if (fs.existsSync(categoriesPath)) {
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
    console.log(`Processing ${categories.length} categories...`);

    for (const item of categories) {
      await prisma.category.upsert({
        where: { slug: item.slug },
        update: { name: item.name },
        create: {
          name: item.name,
          slug: item.slug
        }
      });
    }
    console.log('✅ Categories imported');
  }

  // 3. Import Footer Links
  const footerLinksPath = path.join(dataDir, 'footer-links.json');
  if (fs.existsSync(footerLinksPath)) {
    const footerLinks = JSON.parse(fs.readFileSync(footerLinksPath, 'utf-8'));
    console.log(`Processing ${footerLinks.length} footer links...`);

    for (const item of footerLinks) {
      await prisma.footerLink.upsert({
        where: { url: item.url },
        update: { 
          title: item.title,
          isExternal: item.isExternal
        },
        create: {
          title: item.title,
          url: item.url,
          isExternal: item.isExternal
        }
      });
    }
    console.log('✅ Footer links imported');
  }

  // 4. Import Websites
  const websitesPath = path.join(dataDir, 'websites.json');
  if (fs.existsSync(websitesPath)) {
    const websites = JSON.parse(fs.readFileSync(websitesPath, 'utf-8'));
    console.log(`Processing ${websites.length} websites...`);

    for (const item of websites) {
      // Find category by slug
      const category = await prisma.category.findUnique({
        where: { slug: item.category_slug }
      });

      if (!category) {
        console.warn(`⚠️ Category not found for website "${item.title}" (slug: ${item.category_slug}). Skipping.`);
        continue;
      }

      // Find IPD category by slug if exists
      let ipdCategoryId = null;
      if (item.ipd_category_slug) {
        const ipdCategory = await prisma.category.findUnique({
          where: { slug: item.ipd_category_slug }
        });
        if (ipdCategory) {
          ipdCategoryId = ipdCategory.id;
        } else {
          console.warn(`⚠️ IPD Category not found for website "${item.title}" (slug: ${item.ipd_category_slug}). Ignoring IPD category.`);
        }
      }

      // Remove fields that shouldn't be directly imported or need transformation
      // We keep created_at/updated_at if they exist in JSON to preserve history, 
      // but Prisma might override updated_at on update.
      const { id, category_slug, ipd_category_slug, rank, ...data } = item;

      // Convert date strings to Date objects if they exist
      const formattedData = {
        ...data,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
        updated_at: data.updated_at ? new Date(data.updated_at) : undefined,
        category_id: category.id,
        ipd_category_id: ipdCategoryId
      };

      await prisma.website.upsert({
        where: { url: item.url },
        update: formattedData,
        create: formattedData
      });
    }
    console.log('✅ Websites imported');
  }
  
  console.log('🎉 Data import completed!');
}

importData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
