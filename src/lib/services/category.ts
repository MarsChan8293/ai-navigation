import { prisma } from "@/lib/db/db";

export class CategoryService {
  /**
   * 获取所有分类
   */
  static async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  /**
   * 创建新分类
   */
  static async createCategory(data: { name: string, slug: string }) {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug
      },
    });
  }

  /**
   * 根据 ID 获取分类
   */
  static async getCategoryById(id: number) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  /**
   * 更新分类
   */
  static async updateCategory(id: number, data: { name?: string, slug?: string }) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  /**
   * 删除分类
   */
  static async deleteCategory(id: number) {
    return prisma.$transaction(async (tx) => {
      const websiteCount = await tx.website.count({
        where: { category_id: id },
      });

      if (websiteCount > 0) {
        throw new Error(`无法删除：该分类下包含 ${websiteCount} 个网站。请先移除或转移这些网站。`);
      }

      return tx.category.delete({
        where: { id },
      });
    });
  }
}
