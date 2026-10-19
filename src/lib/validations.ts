import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid.").toLowerCase(),
  password: z.string().min(8, "Password minimal 8 karakter."),
});

export const articleSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter.").max(200, "Judul maksimal 200 karakter."),
  slug: z.string().min(5, "Slug minimal 5 karakter.").regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)."),
  excerpt: z.string().min(10, "Ringkasan minimal 10 karakter.").max(500, "Ringkasan maksimal 500 karakter."),
  content: z.string().min(20, "Isi artikel minimal 20 karakter."),
  categoryId: z.string().cuid("Kategori tidak valid."),
  authorName: z.string().min(3, "Nama penulis minimal 3 karakter."),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isFeatured: z.boolean().default(false),
  imageAlt: z.string().optional(),
  seoTitle: z.string().max(100).optional(),
  seoDescription: z.string().max(250).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter.").max(50),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip (-)."),
  description: z.string().max(250).optional(),
});

export const commentSchema = z.object({
  authorName: z.string().min(2, "Nama minimal 2 karakter.").max(50, "Nama maksimal 50 karakter."),
  content: z.string().min(5, "Komentar minimal 5 karakter.").max(1000, "Komentar maksimal 1000 karakter."),
  articleId: z.string().cuid(),
});

export const siteSettingSchema = z.object({
  siteName: z.string().min(2),
  tagline: z.string().min(5),
  description: z.string().min(10),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  address: z.string().min(5),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type SiteSettingInput = z.infer<typeof siteSettingSchema>;
