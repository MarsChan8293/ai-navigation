import { prisma } from "@/lib/db/db";
import { websiteFormSchema } from "@/lib/utils/validations";
import { z } from "zod";

export class WebsiteService {
  static async getWebsites(status: string = "approved") {
    return prisma.website.findMany({
      where: { status: status === "all" ? undefined : status },
      orderBy: { visits: 'desc' }
    });
  }

  static async getWebsiteById(id: number) {
    return prisma.website.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  static async createWebsite(data: z.infer<typeof websiteFormSchema>) {
    const category = await prisma.category.findUnique({
      where: { id: Number(data.category_id) },
    });

    if (!category) {
      throw new Error("Category does not exist");
    }

    const existingWebsite = await prisma.website.findFirst({
      where: { url: data.url },
    });

    if (existingWebsite) {
      throw new Error("URL already exists");
    }

    return prisma.website.create({
      data: {
        title: data.title.trim(),
        url: data.url.trim(),
        description: data.description.trim(),
        category_id: Number(data.category_id),
        thumbnail: data.thumbnail || null,
        status: "pending",
      },
    });
  }

  static async updateWebsite(id: number, data: z.infer<typeof websiteFormSchema> & { status?: string }) {
    const existingWebsite = await prisma.website.findUnique({
      where: { id },
    });

    if (!existingWebsite) {
      throw new Error("Website not found");
    }

    return prisma.website.update({
      where: { id },
      data: {
        title: data.title,
        url: data.url,
        description: data.description,
        category_id: Number(data.category_id),
        thumbnail: data.thumbnail || null,
        status: data.status || existingWebsite.status,
      },
    });
  }

  static async deleteWebsite(id: number) {
    return prisma.$transaction([
      prisma.useCase.deleteMany({
        where: { website_id: id },
      }),
      prisma.website.delete({
        where: { id },
      }),
    ]);
  }
}
