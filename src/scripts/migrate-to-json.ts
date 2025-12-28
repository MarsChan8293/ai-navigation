import fs from 'fs'
import path from 'path'
import { JSONFilePreset } from 'lowdb/node'
import { Data } from '../lib/db/json-db'

const dataDir = path.join(process.cwd(), 'data')
const dbFile = path.join(dataDir, 'db.json')

async function migrate() {
  console.log('Starting migration to JSON DB...')

  const categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf-8'))
  const websitesRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'websites.json'), 'utf-8'))
  const settings = JSON.parse(fs.readFileSync(path.join(dataDir, 'settings.json'), 'utf-8'))
  const footerLinks = JSON.parse(fs.readFileSync(path.join(dataDir, 'footer-links.json'), 'utf-8'))

  const websites = websitesRaw.map((w: any) => {
    const category = categories.find((c: any) => c.slug === w.category_slug)
    return {
      id: w.id,
      title: w.title,
      url: w.url,
      description: w.description,
      category_id: category ? category.id : 1, // Default to 1 if not found
      thumbnail: w.thumbnail,
      thumbnail_base64: w.thumbnail_base64,
      status: w.status || 'approved',
      visits: w.visits || 0,
      likes: w.likes || 0,
      active: w.active !== undefined ? w.active : 1,
      created_at: w.created_at || new Date().toISOString(),
      updated_at: w.updated_at || new Date().toISOString()
    }
  })

  const defaultData: Data = { 
    settings, 
    websites, 
    categories, 
    footer_links: footerLinks 
  }

  const db = await JSONFilePreset<Data>(dbFile, defaultData)
  db.data = defaultData
  await db.write()

  console.log('Migration complete. Data written to data/db.json')
}

migrate().catch(console.error)
