import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/admin/ArticleForm";
import { createArticleAction } from "@/actions/article.actions";

export default async function TambahBeritaPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Berita Baru</h1>
        <p className="text-sm text-gray-500">Buat artikel kajian atau berita dakwah Islam Kaffah.</p>
      </div>
      <ArticleForm categories={categories} action={createArticleAction} />
    </div>
  );
}
