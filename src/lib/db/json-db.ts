import { JSONFilePreset } from 'lowdb/node'

export interface Setting {
  id: number
  key: string
  value: string
  created_at: string
  updated_at: string
}

export interface Website {
  id: number
  title: string
  url: string
  description: string
  category_id: number
  thumbnail?: string | null
  thumbnail_base64?: string | null
  status: string
  visits: number
  likes: number
  active: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface FooterLink {
  id: number
  title: string
  url: string
  isExternal: boolean
  created_at: string
  updated_at: string
}

export interface Data {
  settings: Setting[]
  websites: Website[]
  categories: Category[]
  footer_links: FooterLink[]
}

const defaultData: Data = { settings: [], websites: [], categories: [], footer_links: [] }

let dbInstance: any = null

// Initialize the database
// We use 'data/db.json' as the storage file
export const getDb = async () => {
  if (dbInstance) return dbInstance
  dbInstance = await JSONFilePreset<Data>('data/db.json', defaultData)
  return dbInstance
}
