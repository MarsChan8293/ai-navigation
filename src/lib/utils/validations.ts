import * as z from "zod";

export const websiteFormSchema = z.object({
  title: z
    .string()
    .min(2, "标题至少需要2个字符")
    .max(100, "标题不能超过100个字符"),
  url: z.string().url("请输入有效的网址"),
  description: z
    .string()
    .min(10, "描述至少需要10个字符")
    .max(500, "描述不能超过500个字符"),
  category_id: z.union([z.string().min(1, "请选择分类"), z.number()]),
  thumbnail: z.string().optional(),
});

const imageFileSchema = z
  .any()
  .refine(
    (file) => !file || (typeof File !== "undefined" && file instanceof File),
    "请上传有效的图片文件"
  )
  .refine(
    (file) => !file || file.size <= 2 * 1024 * 1024,
    "图片不能超过2MB"
  );

export const useCaseFormSchema = z.object({
  title: z
    .string()
    .min(1, "标题不能为空")
    .max(100, "标题不能超过100个字符"),
  content: z.string().min(20, "内容至少需要20个字符"),
  website_id: z.string().min(1, "请选择关联网站"),
  image: imageFileSchema.optional(),
  external_link: z.string().url("请输入有效的网址").optional(),
});
