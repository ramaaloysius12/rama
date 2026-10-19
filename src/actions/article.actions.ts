"use server";

import { prisma } from "@/lib/prisma";
import { articleSchema, ArticleInput } from "@/lib/validations";
import { getCurrentAdmin } from "@/lib/auth";
import { uploadArticleImage, deleteArticleImage } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createArticleAction(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized: Silakan login terlebih dahulu." };
  }

  const rawData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    categoryId: formData.get("categoryId") as string,
    authorName: formData.get("authorName") as string,
    status: formData.get("status") as any,
    isFeatured: formData.get("isFeatured") === "true",
    imageAlt: formData.get("imageAlt") as string,
    seoTitle: formData.get("seoTitle") as string,
    seoDescription: formData.get("seoDescription") as string,
  };

  const parsed = articleSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  // Cek apakah slug sudah ada
  const existing = await prisma.article.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: "Slug URL sudah digunakan. Harap gunakan slug yang lain." };
  }

  let thumbnailUrl: string | null = null;
  let thumbnailPath: string | null = null;

  const imageFile = formData.get("imageFile") as File;
  if (imageFile && imageFile.size > 0) {
    try {
      const uploadRes = await uploadArticleImage(imageFile, "thumbnails");
      thumbnailUrl = uploadRes.publicUrl;
      thumbnailPath = uploadRes.filePath;
    } catch (err: any) {
      return { error: err.message || "Gagal mengunggah gambar thumbnail." };
    }
  }

  const status = parsed.data.status;
  const publishedAt = status === "PUBLISHED" ? new Date() : null;

  try {
    await prisma.article.create({
      data: {
        ...parsed.data,
        thumbnailUrl,
        thumbnailPath,
        publishedAt,
        authorId: admin.adminId,
      },
    });

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath(`/kategori`);
  } catch (err) {
    console.error(err);
    if (thumbnailPath) await deleteArticleImage(thumbnailPath);
    return { error: "Gagal menyimpan berita ke database." };
  }

  // Diarahkan langsung ke Homepage setelah berhasil menambah berita
  redirect("/");
}

export async function updateArticleAction(id: string, formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return { error: "Berita tidak ditemukan." };

  const rawData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    categoryId: formData.get("categoryId") as string,
    authorName: formData.get("authorName") as string,
    status: formData.get("status") as any,
    isFeatured: formData.get("isFeatured") === "true",
    imageAlt: formData.get("imageAlt") as string,
    seoTitle: formData.get("seoTitle") as string,
    seoDescription: formData.get("seoDescription") as string,
  };

  const parsed = articleSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  // Cek konflik slug
  const conflict = await prisma.article.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) {
    return { error: "Slug URL sudah digunakan oleh berita lain." };
  }

  let thumbnailUrl = article.thumbnailUrl;
  let thumbnailPath = article.thumbnailPath;

  const imageFile = formData.get("imageFile") as File;
  if (imageFile && imageFile.size > 0) {
    try {
      const uploadRes = await uploadArticleImage(imageFile, "thumbnails");
      if (thumbnailPath) await deleteArticleImage(thumbnailPath);
      thumbnailUrl = uploadRes.publicUrl;
      thumbnailPath = uploadRes.filePath;
    } catch (err: any) {
      return { error: err.message || "Gagal mengunggah gambar baru." };
    }
  }

  const status = parsed.data.status;
  let publishedAt = article.publishedAt;
  if (status === "PUBLISHED" && !publishedAt) {
    publishedAt = new Date();
  }

  try {
    await prisma.article.update({
      where: { id },
      data: {
        ...parsed.data,
        thumbnailUrl,
        thumbnailPath,
        publishedAt,
      },
    });

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath(`/berita/${article.slug}`);
    revalidatePath(`/berita/${parsed.data.slug}`);
  } catch (err) {
    console.error(err);
    return { error: "Gagal memperbarui berita." };
  }

  redirect("/admin/berita");
}

export async function deleteArticleAction(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Unauthorized." };

  try {
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) return { error: "Berita tidak ditemukan." };

    if (article.thumbnailPath) {
      await deleteArticleImage(article.thumbnailPath);
    }

    await prisma.article.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/berita");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Gagal menghapus berita." };
  }
}
