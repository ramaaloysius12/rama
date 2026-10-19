import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/public/ArticleCard";
import Link from "next/link";
import { BookOpen, Compass, Search, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Berita & Kajian Terkini | Islam Kaffah",
  description: "Kumpulan seluruh berita, artikel, dan kajian dakwah Islam Kaffah.",
};

export default async function AllNewsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  // 1. Ambil semua kategori
  const categories = await prisma.category.findMany({
    where: {
      articles: { some: { status: "PUBLISHED" } } 
    },
    include: { 
      _count: { select: { articles: { where: { status: "PUBLISHED" } } } } 
    },
    orderBy: { name: "asc" },
  });

  // 2. Ambil seluruh berita (beserta filter pencarian jika ada)
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      _count: { select: { comments: { where: { status: "APPROVED" } } } },
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
      
      {/* --- HEADER DENGAN BACKGROUND AL-QUR'AN --- */}
      <div className="relative bg-islamic-900 rounded-3xl overflow-hidden shadow-xl">
        
        {/* Gambar Background Al-Qur'an */}
        <div className="absolute inset-0">
          <img 
            // Anda bisa mengganti URL ini dengan "/gambar-quran.jpg" jika punya file sendiri di folder public
            src="https://images.unsplash.com/photo-1609599006353-e629aaab315f?q=80&w=2000&auto=format&fit=crop" 
            alt="Background Al-Qur'an" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          {/* Efek gradasi gelap agar teks putih mudah dibaca */}
          <div className="absolute inset-0 bg-gradient-to-t from-islamic-950 via-islamic-900/80 to-transparent"></div>
        </div>
        
        {/* Teks di atas gambar */}
        <div className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-islamic-800/60 text-gold-400 mb-2 shadow-lg backdrop-blur-sm border border-islamic-700/50">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            {query ? "Hasil Pencarian" : "Khazanah Kajian & Berita"}
          </h1>
          <p className="text-islamic-100 text-lg leading-relaxed drop-shadow">
            {query 
              ? `Menampilkan hasil pencarian untuk kata kunci: "${query}"` 
              : "Jelajahi seluruh khazanah keilmuan, berita terkini, dan kajian dakwah berlandaskan pemahaman yang lurus."}
          </p>
        </div>
      </div>
      {/* --- AKHIR HEADER AL-QUR'AN --- */}

      {/* NAVIGASI KATEGORI CEPAT */}
      {!query && categories.length > 0 && (
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
            <Compass className="w-5 h-5 text-islamic-600" /> Jelajahi Berdasarkan Kategori
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/berita"
              className="px-5 py-2 rounded-full text-sm font-semibold bg-islamic-600 text-white shadow-md transition-all"
            >
              Semua Berita
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="px-5 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-islamic-50 hover:text-islamic-700 hover:border-islamic-200 transition-all"
              >
                {cat.name} <span className="text-gray-400 text-xs ml-1">({cat._count.articles})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* GRID DAFTAR BERITA */}
      <section>
        {articles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm max-w-2xl mx-auto space-y-4">
            <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
              {query ? <Search className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {query ? "Berita Tidak Ditemukan" : "Belum Ada Berita Diterbitkan"}
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              {query 
                ? `Maaf, kami tidak menemukan berita atau kajian yang cocok dengan kata kunci "${query}". Silakan coba kata kunci lain.` 
                : "Tim redaksi sedang menyiapkan artikel dan kajian dakwah terbaik untuk Anda."}
            </p>
            {query && (
              <div className="pt-4">
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-islamic-600 hover:bg-islamic-700 shadow-md transition-all"
                >
                  Lihat Semua Berita
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
      
    </main>
  );
}
