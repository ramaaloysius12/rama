import { prisma } from "@/lib/prisma";
import { Newspaper, CheckCircle2, FileText, MessageSquare, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [totalArticles, publishedCount, draftCount, totalComments, recentArticles] =
    await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.comment.count(),
      prisma.article.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { category: true },
      }),
    ]);

  const stats = [
    {
      name: "Total Berita",
      value: totalArticles,
      icon: Newspaper,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "bg-blue-600 text-white",
    },
    {
      name: "Terbit (Published)",
      value: publishedCount,
      icon: CheckCircle2,
      color: "bg-islamic-50 text-islamic-800 border-islamic-200",
      iconColor: "bg-islamic-600 text-white",
    },
    {
      name: "Draft Berita",
      value: draftCount,
      icon: FileText,
      color: "bg-amber-50 text-amber-800 border-amber-200",
      iconColor: "bg-amber-600 text-white",
    },
    {
      name: "Total Komentar",
      value: totalComments,
      icon: MessageSquare,
      color: "bg-purple-50 text-purple-800 border-purple-200",
      iconColor: "bg-purple-600 text-white",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Utama</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Selamat datang kembali di panel pengelolaan portal dakwah Islam Kaffah.
          </p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-islamic-600 hover:bg-islamic-700 shadow-md transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Berita Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className={`p-6 rounded-2xl border shadow-sm flex items-center justify-between ${item.color}`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  {item.name}
                </p>
                <p className="text-3xl font-extrabold mt-2">{item.value}</p>
              </div>
              <div className={`p-3.5 rounded-xl shadow-sm ${item.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Berita Terbaru Diedit</h2>
          <Link
            href="/admin/berita"
            className="text-xs font-semibold text-islamic-600 hover:text-islamic-800 transition-colors inline-flex items-center gap-1"
          >
            Lihat Semua Berita <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            Belum ada berita yang dibuat. Klik tombol "Tambah Berita Baru" untuk mulai menulis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Judul Berita</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {recentArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900 max-w-xs truncate">
                      {article.title}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-islamic-50 text-islamic-700">
                        {article.category.name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          article.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/berita/edit/${article.id}`}
                        className="text-islamic-600 hover:text-islamic-800 font-medium text-xs bg-islamic-50 px-3 py-1.5 rounded-lg"
                      >
                        Edit
                      </Link>
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
