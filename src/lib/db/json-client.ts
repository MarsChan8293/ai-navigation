import { getDb, Data, Website, Category, Setting, FooterLink } from './json-db'

// Helper to convert string dates back to Date objects
const parseDates = <T>(item: T): T => {
  if (!item) return item
  const newItem = { ...item } as any
  if (newItem.created_at && typeof newItem.created_at === 'string') newItem.created_at = new Date(newItem.created_at)
  if (newItem.updated_at && typeof newItem.updated_at === 'string') newItem.updated_at = new Date(newItem.updated_at)
  return newItem
}

// Helper to get next ID
const getNextId = (items: { id: number }[]) => {
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
}

class ModelDelegate<T extends { id: number }> {
  constructor(
    protected tableName: keyof Data,
    protected getDbInstance: () => Promise<any>
  ) {}

  async findMany(args?: any) {
    const db = await this.getDbInstance()
    let items = db.data[this.tableName] as T[]
    
    if (args?.where) {
      items = items.filter(item => {
        for (const key in args.where) {
          if ((item as any)[key] !== args.where[key]) return false
        }
        return true
      })
    }

    // Basic orderBy support (single field)
    if (args?.orderBy) {
      const key = Object.keys(args.orderBy)[0]
      const direction = args.orderBy[key]
      items = [...items].sort((a: any, b: any) => {
        if (direction === 'asc') return a[key] > b[key] ? 1 : -1
        return a[key] < b[key] ? 1 : -1
      })
    }

    return items.map(parseDates)
  }

  async findUnique(args: { where: { id?: number; [key: string]: any }; include?: any }) {
    const db = await this.getDbInstance()
    const items = db.data[this.tableName] as T[]
    const item = items.find(i => {
      for (const key in args.where) {
        if ((i as any)[key] !== args.where[key]) return false
      }
      return true
    })
    return item ? parseDates(item) : null
  }
  
  async findFirst(args?: any) {
      const items = await this.findMany(args);
      return items.length > 0 ? items[0] : null;
  }

  async count(args?: any) {
    const items = await this.findMany(args)
    return items.length
  }

  async create(args: { data: any }) {

    const db = await this.getDbInstance()
    const newItem = {
      id: getNextId(db.data[this.tableName]),
      ...args.data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    db.data[this.tableName].push(newItem)
    await db.write()
    return parseDates(newItem)
  }

  async update(args: { where: { id?: number; [key: string]: any }; data: any }) {
    const db = await this.getDbInstance()
    const index = db.data[this.tableName].findIndex((i: any) => {
        for (const key in args.where) {
            if (i[key] !== args.where[key]) return false
        }
        return true
    })
    if (index === -1) throw new Error('Record not found')
    
    const updatedItem = {
      ...db.data[this.tableName][index],
      ...args.data,
      updated_at: new Date().toISOString()
    }
    db.data[this.tableName][index] = updatedItem
    await db.write()
    return parseDates(updatedItem)
  }

  async delete(args: { where: { id?: number; [key: string]: any } }) {
    const db = await this.getDbInstance()
    const index = db.data[this.tableName].findIndex((i: any) => {
        for (const key in args.where) {
            if (i[key] !== args.where[key]) return false
        }
        return true
    })
    if (index === -1) throw new Error('Record not found')
    
    const deletedItem = db.data[this.tableName][index]
    db.data[this.tableName].splice(index, 1)
    await db.write()
    return parseDates(deletedItem)
  }

  async upsert(args: { where: any; create: any; update: any }) {
    const existing = await this.findUnique({ where: args.where })
    if (existing) {
      // For upsert, we need to handle the case where update might need the ID from existing
      // But findUnique returns the item with ID.
      // The update method expects where: { id: ... } usually, but here we pass args.where which might be { key: ... }
      // My update method implementation:
      // async update(args: { where: { id?: number; [key: string]: any }; data: any })
      // It uses findIndex with args.where. So it should work if args.where is unique.
      return this.update({ where: args.where, data: args.update })
    } else {
      return this.create({ data: args.create })
    }
  }
}

// Website specific delegate to handle relations
class WebsiteDelegate extends ModelDelegate<Website> {
  async findMany(args?: any) {
    const websites = await super.findMany(args)
    if (args?.include?.category) {
      const db = await this.getDbInstance()
      const categories = db.data.categories as Category[]
      return websites.map((w: any) => ({
        ...w,
        category: parseDates(categories.find(c => c.id === w.category_id))
      }))
    }
    return websites
  }

  async findUnique(args: { where: { id?: number; [key: string]: any }; include?: any }) {
    const website = await super.findUnique(args)
    if (website && args?.include?.category) {
      const db = await this.getDbInstance()
      const categories = db.data.categories as Category[]
      return {
        ...website,
        category: parseDates(categories.find(c => c.id === website.category_id))
      }
    }
    return website
  }
}


export class JsonClient {
  website: WebsiteDelegate
  category: ModelDelegate<Category>
  setting: ModelDelegate<Setting>
  footerLink: ModelDelegate<FooterLink>

  constructor() {
    this.website = new WebsiteDelegate('websites', getDb)
    this.category = new ModelDelegate<Category>('categories', getDb)
    this.setting = new ModelDelegate<Setting>('settings', getDb)
    this.footerLink = new ModelDelegate<FooterLink>('footer_links', getDb)
  }

  async $disconnect() {
    // No-op for JSON DB
  }
}

export const prisma = new JsonClient()

