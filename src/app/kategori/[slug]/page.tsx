import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/public/ArticleCard";
import Link from "next/link";
import { ChevronRight, Compass, BookOpen } from "lucide-react";

// Generate SEO Metadata Otomatis
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) return { title: "Kategori Tidak Ditemukan | Islam Kaffah" };

  return {
    title: `Kategori: ${category.name} | Islam Kaffah`,
    description: `Kumpulan artikel dan kajian dakwah seputar ${category.name}.`,
  };
}

export default async function CategoryDetailPage({ params }: { params: { slug: string } }) {
  // Ambil data kategori sekaligus menarik semua artikel PUBLISHED di dalamnya
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      articles: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: {
          category: true, // Untuk komponen ArticleCard
          // Jika Anda pakai sistem komentar di ArticleCard, aktifkan baris di bawah ini:
          // _count: { select: { comments: { where: { status: "APPROVED" } } } }
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const articles = category.articles;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigasi */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-islamic-700 transition">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/kategori" className="hover:text-islamic-700 transition">Kategori</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-800 font-bold">{category.name}</span>
      </nav>

      {/* Header Kategori */}
      <div className="bg-gradient-to-br from-islamic-50 to-white rounded-3xl p-8 sm:p-12 text-center border border-islamic-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 text-islamic-100/50">
          <Compass className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Kategori: <span className="text-islamic-700">{category.name}</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Menampilkan kumpulan artikel, berita, dan kajian dakwah terbaru seputar {category.name}.
          </p>
        </div>
      </div>

      {/* Daftar Artikel Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Belum ada artikel</h3>
          <p className="text-gray-500 mt-2 text-sm">Insya Allah redaksi akan segera menambahkan kajian di kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            // Menggunakan komponen ArticleCard yang sama seperti di Homepage
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
