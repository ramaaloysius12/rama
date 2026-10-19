import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Calendar, User, Eye, ChevronRight, MessageSquare, Send, ArrowRight } from "lucide-react";
import { revalidatePath } from "next/cache";

// 1. Generate SEO Metadata Otomatis
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
  });

  if (!article) return { title: "Artikel Tidak Ditemukan | Islam Kaffah" };

  return {
    title: article.seoTitle || `${article.title} | Islam Kaffah`,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.thumbnailUrl ? [{ url: article.thumbnailUrl }] : [],
    },
  };
}

// 2. Server Action untuk Mengirim Komentar
async function addComment(formData: FormData) {
  "use server";
  
  const name = formData.get("name") as string;
  const content = formData.get("content") as string;
  const articleId = formData.get("articleId") as string;
  const slug = formData.get("slug") as string;

  if (name && content && articleId) {
    await prisma.comment.create({
      data: {
        name,
        content,
        articleId,
        status: "PENDING", // Status PENDING agar admin bisa filter komentar kotor
      },
    });
    // Refresh halaman secara otomatis agar form kosong
    revalidatePath(`/berita/${slug}`);
  }
}

// 3. Komponen Utama Halaman Detail Berita
export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  // Ambil data artikel, kategori, dan daftar komentar yang sudah disetujui (APPROVED)
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: { 
      category: true,
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" }
      }
    },
  });

  if (!article) {
    notFound();
  }

  // Tambah jumlah tayangan (view count)
  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  });

  // Ambil "Berita Lainnya / Selengkapnya" dari kategori yang sama
  const relatedArticles = await prisma.article.findMany({
    where: { 
      categoryId: article.categoryId, 
      status: "PUBLISHED",
      id: { not: article.id } // Kecualikan artikel yang sedang dibaca
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
    include: { category: true }
  });

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      
      {/* Breadcrumb Navigasi */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-islamic-700 transition">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href={`/kategori/${article.category.slug}`} className="hover:text-islamic-700 transition">
          {article.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-800 truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
      </nav>

      {/* Header Artikel */}
      <header className="space-y-6">
        <Link 
          href={`/kategori/${article.category.slug}`} 
          className="bg-islamic-50 text-islamic-700 px-4 py-1.5 rounded-full text-xs font-bold inline-block hover:bg-islamic-100 transition-colors"
        >
          {article.category.name}
        </Link>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-5 text-xs text-gray-500 pt-2 border-b border-gray-100 pb-6">
          <span className="flex items-center gap-1.5 font-medium text-gray-700">
            <User className="w-4 h-4 text-islamic-600" /> {article.authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-islamic-600" /> {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-islamic-600" /> {article.viewCount + 1} Dilihat
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-islamic-600" /> {article.comments.length} Komentar
          </span>
        </div>
      </header>

      {/* Gambar Utama */}
      {article.thumbnailUrl && (
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-md bg-gray-100 border border-gray-200">
          <Image
            src={article.thumbnailUrl}
            alt={article.imageAlt || article.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Isi Berita */}
      <article
        className="text-gray-800 leading-relaxed font-serif text-lg whitespace-pre-wrap 
        [&_p]:mb-6 
        [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-8 [&_ol]:mt-4
        [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-8 [&_ul]:mt-4
        [&_li]:mb-5 [&_li>p]:mb-2 
        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 
        [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <hr className="border-gray-200 my-10" />

      {/* --- FITUR KOMENTAR --- */}
      <section className="space-y-8" id="komentar">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-islamic-600" /> Komentar ({article.comments.length})
        </h3>

        {/* Form Kirim Komentar */}
        <div className="bg-gray-50 p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-inner">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Tinggalkan Komentar</h4>
          <form action={addComment} className="space-y-4">
            <input type="hidden" name="articleId" value={article.id} />
            <input type="hidden" name="slug" value={params.slug} />
            
            <div>
              <input 
                type="text" 
                name="name" 
                placeholder="Nama Lengkap Anda" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-islamic-500 focus:border-islamic-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <textarea 
                name="content" 
                placeholder="Tulis pendapat atau pertanyaan Anda dengan bahasa yang baik..." 
                required 
                rows={4} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-islamic-500 focus:border-islamic-500 focus:outline-none transition-all resize-none"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 bg-islamic-600 hover:bg-islamic-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Kirim Komentar
            </button>
            <p className="text-xs text-gray-500 mt-2">*Komentar Anda akan dimoderasi oleh admin sebelum ditampilkan.</p>
          </form>
        </div>

        {/* Daftar Komentar yang sudah di-Approve */}
        <div className="space-y-6">
          {article.comments.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-6">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
          ) : (
            article.comments.map((comment) => (
              <div key={comment.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                <div className="w-10 h-10 rounded-full bg-islamic-100 flex items-center justify-center text-islamic-700 font-bold shrink-0">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-bold text-gray-900 text-sm">{comment.name}</h5>
                    <span className="text-xs text-gray-400">• {formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- BERITA SELENGKAPNYA / TERKAIT --- */}
      {relatedArticles.length > 0 && (
        <section className="pt-12 mt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Baca Berita Lainnya</h2>
            <Link 
              href={`/kategori/${article.category.slug}`} 
              className="text-sm font-semibold text-islamic-600 hover:text-islamic-800 flex items-center gap-1"
            >
              Selengkapnya <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedArticles.map((relArticle) => (
              <Link 
                key={relArticle.id} 
                href={`/berita/${relArticle.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex gap-4 p-4"
              >
                {relArticle.thumbnailUrl && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    <Image 
                      src={relArticle.thumbnailUrl} 
                      alt={relArticle.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-islamic-600 uppercase tracking-wider mb-1">
                    {relArticle.category.name}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-islamic-700 transition-colors">
                    {relArticle.title}
                  </h3>
                  <span className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(relArticle.publishedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
