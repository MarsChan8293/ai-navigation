import { getDb, Data, Website, Category, Setting, FooterLink } from './json-db'
import * as z from "zod"
import { websiteFormSchema } from '../utils/validations'

class Mutex {
  private mutex = Promise.resolve();

  lock(): Promise<() => void> {
    let begin: (unlock: () => void) => void = () => {};

    this.mutex = this.mutex.then(() => {
      return new Promise(resolve => {
        begin = resolve as any;
      });
    });

    return new Promise(resolve => {
      begin(() => resolve(undefined as any));
    });
  }

  async dispatch<T>(fn: (() => T) | (() => PromiseLike<T>)): Promise<T> {
    const unlock = await this.lock();
    try {
      return await Promise.resolve(fn());
    } finally {
      unlock();
    }
  }
}

const writeLock = new Mutex();

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
          const filterValue = args.where[key];
          const itemValue = (item as any)[key];

          if (typeof filterValue === 'object' && filterValue !== null) {
             if ('not' in filterValue) {
                 if (itemValue === filterValue.not) return false;
             } else if ('in' in filterValue && Array.isArray(filterValue.in)) {
                 if (!filterValue.in.includes(itemValue)) return false;
             } else {
                 if (itemValue !== filterValue) return false
             }
          } else {
             if (itemValue !== filterValue) return false
          }
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

    // Select support
    if (args?.select) {
        items = items.map(item => {
            const selectedItem: any = {};
            for (const key in args.select) {
                if (args.select[key]) {
                    selectedItem[key] = (item as any)[key];
                }
            }
            return selectedItem as T;
        });
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
    return writeLock.dispatch(async () => {
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
    })
  }

  async update(args: { where: { id?: number; [key: string]: any }; data: any }) {
    return writeLock.dispatch(async () => {
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
    })
  }

  async delete(args: { where: { id?: number; [key: string]: any } }) {
    return writeLock.dispatch(async () => {
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
    })
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

// Website specific delegate to handle relations and validation
class WebsiteModelDelegate extends ModelDelegate<Website> {
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

  async create(args: { data: any }) {
    // Validate data using websiteFormSchema
    // We need to handle potential type mismatches (e.g. category_id as number)
    // and exclude fields that are not in the schema (id, created_at, etc.)
    
    const dataToValidate = { ...args.data }
    
    // Convert category_id to string for validation if it exists
    if (dataToValidate.category_id !== undefined) {
      dataToValidate.category_id = String(dataToValidate.category_id)
    }
    
    // Handle thumbnail being null (schema expects string or undefined)
    if (dataToValidate.thumbnail === null) {
      dataToValidate.thumbnail = undefined
    }

    // Validate against schema
    // This will throw ZodError if validation fails
    const parsed = websiteFormSchema.parse(dataToValidate)

    // Validate category_id exists in database
    const db = await this.getDbInstance()
    const categories = db.data.categories as Category[]
    const categoryExists = categories.some(c => c.id === Number(parsed.category_id))
    
    if (!categoryExists) {
      throw new Error(`Category with id ${parsed.category_id} not found`)
    }

    return super.create(args)
  }

  async update(args: { where: { id?: number; [key: string]: any }; data: any }) {
    // Validate data using websiteFormSchema (partial for updates)
    const dataToValidate = { ...args.data }
    
    if (dataToValidate.category_id !== undefined) {
      dataToValidate.category_id = String(dataToValidate.category_id)
    }
    
    if (dataToValidate.thumbnail === null) {
      dataToValidate.thumbnail = undefined
    }

    // Use partial schema for updates
    const parsed = websiteFormSchema.partial().parse(dataToValidate)

    // If category_id is being updated, validate it exists
    if (parsed.category_id) {
      const db = await this.getDbInstance()
      const categories = db.data.categories as Category[]
      const categoryExists = categories.some(c => c.id === Number(parsed.category_id))
      
      if (!categoryExists) {
        throw new Error(`Category with id ${parsed.category_id} not found`)
      }
    }

    return super.update(args)
  }
}


export class JsonClient {
  website: WebsiteModelDelegate
  category: ModelDelegate<Category>
  setting: ModelDelegate<Setting>
  footerLink: ModelDelegate<FooterLink>

  constructor() {
    this.website = new WebsiteModelDelegate('websites', getDb)
    this.category = new ModelDelegate<Category>('categories', getDb)
    this.setting = new ModelDelegate<Setting>('settings', getDb)
    this.footerLink = new ModelDelegate<FooterLink>('footer_links', getDb)
  }

  async $disconnect() {
    // No-op for JSON DB
  }
}

export const prisma = new JsonClient()

