import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Newspaper, Edit } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminBeritaPage() {
  const articles = await prisma.article.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Berita & Kajian</h1>
          <p className="text-sm text-gray-500 mt-0.5">Daftar semua artikel dakwah di portal Anda.</p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-islamic-600 hover:bg-islamic-700 shadow-md transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Berita Baru
        </Link>
      </div>

      {/* Tabel Daftar Berita */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {articles.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm space-y-2">
            <Newspaper className="w-10 h-10 text-islamic-600 mx-auto" />
            <p>Belum ada artikel di database. Silakan klik Tambah Berita Baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Judul Berita</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900 max-w-xs truncate">{art.title}</td>
                    <td className="py-4 px-4">
                      <span className="bg-islamic-50 text-islamic-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        {art.category.name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          art.status === "PUBLISHED" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      {/* Tombol Edit */}
                      <Link
                        href={`/admin/berita/edit/${art.id}`}
                        className="inline-flex items-center gap-1 text-islamic-600 hover:text-islamic-800 bg-islamic-50 hover:bg-islamic-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Link>
                      
                      {/* Tombol Hapus */}
                      <DeleteButton id={art.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
