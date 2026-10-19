import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";
import { updateArticleAction } from "@/actions/article.actions";

export default async function EditBeritaPage({ params }: { params: { id: string } }) {
  // Ambil data artikel berdasarkan ID dan daftar kategori secara bersamaan
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  // Jika artikel tidak ditemukan, tampilkan 404
  if (!article) {
    notFound();
  }

  // Bind ID artikel ke dalam Server Action update agar kita tahu artikel mana yang diedit
  const boundUpdateAction = updateArticleAction.bind(null, article.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Berita</h1>
        <p className="text-sm text-gray-500">Perbarui isi artikel, gambar thumbnail, atau status publikasi.</p>
      </div>
      
      {/* Panggil komponen form dengan menyisipkan initialData */}
      <ArticleForm 
        initialData={article} 
        categories={categories} 
        action={boundUpdateAction} 
      />
    </div>
  );
}
