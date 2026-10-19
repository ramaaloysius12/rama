import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/public/ArticleCard";
import LatestArticleSlider from "@/components/public/LatestArticleSlider"; // <-- Import Slider Baru
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Compass, Sparkles, BookHeart, MoonStar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const revalidate = 60; // ISR cache revalidation setiap 60 detik

export default async function HomePage() {
  const [featuredArticles, latestArticles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      include: { 
        category: true, 
        _count: { select: { comments: { where: { status: "APPROVED" } } } } 
      },
      orderBy: { publishedAt: "desc" },
      take: 2,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: { 
        category: true, 
        _count: { select: { comments: { where: { status: "APPROVED" } } } } 
      },
      orderBy: { publishedAt: "desc" },
      take: 8, // Diubah jadi 8 agar slidernya terasa panjang dan bagus
    }),
    prisma.category.findMany({
      include: { 
        _count: { select: { articles: { where: { status: "PUBLISHED" } } } } 
      },
      take: 8,
    }),
  ]);

  const hasArticles = featuredArticles.length > 0 || latestArticles.length > 0;

  return (
    <>
      <div className="space-y-16 pb-16">
        {/* 1. Hero Section */}
        <section className="relative bg-gradient-to-br from-islamic-800 via-islamic-900 to-islamic-950 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-islamic-700/60 text-gold-300 text-xs font-semibold backdrop-blur-md border border-islamic-600 shadow-sm mt-4">
              <Sparkles className="w-4 h-4" />
              Portal Berita & Dakwah Islam Kaffah
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
              Menebar Cahaya Islam secara <span className="text-gold-400">Utuh, Ilmiah</span>, dan Menyejukkan
            </h1>
            <p className="text-base sm:text-lg text-islamic-200/90 max-w-2xl mx-auto leading-relaxed">
              Menyajikan khazanah ilmu keislaman berlandaskan Al-Qur'an dan As-Sunnah dengan pemahaman para salafus shalih untuk pencerahan umat.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/berita"
                className="px-6 py-3.5 rounded-xl font-semibold text-islamic-950 bg-gold-400 hover:bg-gold-500 shadow-lg shadow-gold-500/25 transition-all inline-flex items-center gap-2"
              >
                Jelajahi Berita & Kajian <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kategori"
                className="px-6 py-3.5 rounded-xl font-semibold text-white bg-islamic-700/80 hover:bg-islamic-700 border border-islamic-600 transition-all"
              >
                Lihat Kategori
              </Link>
            </div>
          </div>
        </section>

        {/* Navigasi Kategori (Swipeable) */}
        <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-40 -mt-16 pt-4 pb-2 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex overflow-x-auto py-2 gap-3 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <Link
                href="/"
                className="snap-start shrink-0 whitespace-nowrap px-5 py-2 bg-islamic-600 text-white border border-islamic-600 rounded-full text-sm font-semibold shadow-md transition-all"
              >
                Semua Terbaru
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className="snap-start shrink-0 whitespace-nowrap px-5 py-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-islamic-50 hover:text-islamic-700 hover:border-islamic-200 rounded-full text-sm font-medium transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* 2. Kategori Cepat */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-islamic-600" /> Kategori Dakwah
              </h2>
              <Link href="/kategori" className="text-sm font-semibold text-islamic-600 hover:text-islamic-800">
                Semua Kategori →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className="bg-white p-4 rounded-2xl border border-gray-200 text-center hover:border-islamic-500 hover:shadow-md transition-all group"
                >
                  <p className="font-bold text-sm text-gray-900 group-hover:text-islamic-700 truncate">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{cat._count.articles} Artikel</p>
                </Link>
              ))}
            </div>
          </section>

          {!hasArticles ? (
            <section className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm max-w-2xl mx-auto space-y-4">
              <div className="h-16 w-16 bg-islamic-50 text-islamic-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Belum Ada Berita Diterbitkan</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Tim redaksi sedang menyiapkan artikel dan kajian dakwah. Silakan masuk ke panel admin untuk mulai mengunggah.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-islamic-600 hover:bg-islamic-700 shadow-md transition-all"
                >
                  Login Admin Redaksi
                </Link>
              </div>
            </section>
          ) : (
            <>
              {/* 4. Berita Unggulan */}
              {featuredArticles.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold-500" /> Berita Unggulan
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featuredArticles.map((article) => (
                      <article
                        key={article.id}
                        className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row group"
                      >
                        <div className="relative sm:w-1/2 aspect-[16/10] sm:aspect-auto bg-gray-100">
                          {article.thumbnailUrl && (
                            <Image
                              src={article.thumbnailUrl}
                              alt={article.imageAlt || article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                        </div>
                        <div className="p-6 sm:w-1/2 flex flex-col justify-between">
                          <div>
                            <span className="bg-islamic-50 text-islamic-700 px-3 py-1 rounded-full text-xs font-semibold">
                              {article.category.name}
                            </span>
                            <h3 className="font-bold text-gray-900 text-lg mt-3 leading-snug group-hover:text-islamic-700 transition-colors line-clamp-2">
                              <Link href={`/berita/${article.slug}`}>{article.title}</Link>
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                              {article.excerpt}
                            </p>
                          </div>
                          <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <span>{formatDate(article.publishedAt)}</span>
                            <Link
                              href={`/berita/${article.slug}`}
                              className="font-semibold text-islamic-600 hover:text-islamic-800"
                            >
                              Baca →
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* --- 5. SLIDER BERITA TERBARU --- */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-islamic-600" /> Berita & Kajian Terbaru
                  </h2>
                  <Link href="/berita" className="text-sm font-semibold text-islamic-600 hover:text-islamic-800">
                    Lihat Semua →
                  </Link>
                </div>
                
                {/* Memanggil Komponen Slider yang baru dibuat */}
                <LatestArticleSlider articles={latestArticles} />

              </section>
              {/* --- AKHIR SLIDER BERITA --- */}
            </>
          )}

          {/* Mengapa Harus Islam Kaffah */}
          <section className="bg-gradient-to-br from-islamic-50 to-white rounded-3xl p-8 sm:p-12 border border-islamic-100 shadow-sm relative overflow-hidden mt-16">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 text-islamic-100/40">
              <BookHeart className="w-64 h-64" />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  Mengapa Harus <span className="text-islamic-700">Islam Kaffah?</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Berislam secara kaffah (menyeluruh) bukanlah sebuah pilihan, melainkan perintah langsung dari Sang Pencipta untuk meraih keselamatan dunia dan akhirat.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-islamic-100 text-islamic-700 flex items-center justify-center font-bold text-lg mb-2">1</div>
                  <h3 className="text-lg font-bold text-gray-900">Syariat yang Sempurna</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Islam adalah agama yang paripurna. Mengamalkannya secara kaffah berarti menjadikan Al-Qur'an dan As-Sunnah sebagai solusi atas seluruh aspek kehidupan.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-islamic-100 text-islamic-700 flex items-center justify-center font-bold text-lg mb-2">2</div>
                  <h3 className="text-lg font-bold text-gray-900">Menjaga dari Kesesatan</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Mengambil sebagian ajaran Islam dan membuang sebagian lainnya dapat menjerumuskan pada pemahaman yang keliru dan hawa nafsu.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-islamic-100 text-islamic-700 flex items-center justify-center font-bold text-lg mb-2">3</div>
                  <h3 className="text-lg font-bold text-gray-900">Kunci Ridha Allah</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Hanya dengan ketundukan yang utuh (kaffah) kita bisa meraih ketenangan hati dan kebahagiaan yang hakiki di surga kelak.
                  </p>
                </div>
              </div>

              <div className="bg-islamic-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg text-center space-y-6">
                <p className="font-arabic text-3xl sm:text-4xl lg:text-5xl leading-relaxed sm:leading-loose text-gold-400" dir="rtl">
                  يَا أَيُّهَا الَّذِينَ آمَنُوا ادْخُلُوا فِي السِّلْمِ كَافَّةً وَلَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ ۚ إِنَّهُ لَكُمْ عَدُوٌّ مُبِينٌ
                </p>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base text-islamic-100 italic leading-relaxed max-w-3xl mx-auto">
                    "Hai orang-orang yang beriman, masuklah kamu ke dalam Islam keseluruhan, dan janganlah kamu turut langkah-langkah syaitan. Sesungguhnya syaitan itu musuh yang nyata bagimu."
                  </p>
                  <p className="text-sm font-bold text-gold-500">
                    (QS. Al-Baqarah: 208)
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Video Youtube */}
          <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm relative mt-12 animate-fadeIn">
            <div className="max-w-4xl mx-auto space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  Kenapa Islam Harus <span className="text-islamic-700">Kaffah?</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Simak penjelasan mendalam dan mencerahkan melalui kajian video berikut ini untuk memperkuat pemahaman kita.
                </p>
              </div>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/4HpkvHRzcvQ"
                  title="Kenapa Islam Harus Kaffah"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 sm:py-16 mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MoonStar className="w-6 h-6 text-gold-500" /> Islam Kaffah
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Portal dakwah dan berita Islam terpercaya. Berkomitmen mengedepankan dakwah yang lurus, berlandaskan pemahaman Al-Qur'an dan As-Sunnah yang murni.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Jelajahi</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/" className="hover:text-gold-400 transition-colors">Beranda</Link></li>
                <li><Link href="/berita" className="hover:text-gold-400 transition-colors">Berita & Kajian Terkini</Link></li>
                <li><Link href="/kategori" className="hover:text-gold-400 transition-colors">Kategori Dakwah</Link></li>
                <li><Link href="/tentang-kami" className="hover:text-gold-400 transition-colors">Tentang Kami</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Hubungi Kami</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li>Email: redaksi@islamkaffah.com</li>
                <li>WhatsApp: +62 812 3456 7890</li>
                <li>Alamat: Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between">
            <p>&copy; {new Date().getFullYear()} Islam Kaffah. Seluruh hak cipta dilindungi.</p>
            <div className="mt-4 md:mt-0 space-x-4">
              <Link href="/privacy" className="hover:text-gold-400 transition-colors">Kebijakan Privasi</Link>
              <Link href="/terms" className="hover:text-gold-400 transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
