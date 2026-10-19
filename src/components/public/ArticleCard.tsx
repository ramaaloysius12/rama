import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Calendar, User, MessageSquare } from "lucide-react";

interface ArticleCardProps {
  article: {
    title: string;
    slug: string;
    excerpt: string;
    thumbnailUrl?: string | null;
    imageAlt?: string | null;
    authorName: string;
    publishedAt: Date | string | null;
    category: { name: string; slug: string };
    _count?: { comments: number };
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      <Link href={`/berita/${article.slug}`} className="relative aspect-[16/10] overflow-hidden bg-gray-100 block">
        {article.thumbnailUrl ? (
          <Image
            src={article.thumbnailUrl}
            alt={article.imageAlt || article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-islamic-50 text-islamic-700 font-semibold text-xs">
            Islam Kaffah
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-islamic-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {article.category.name}
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-islamic-600" />
              {formatDate(article.publishedAt)}
            </span>
            {article._count && article._count.comments > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-islamic-600" />
                {article._count.comments} Komentar
              </span>
            )}
          </div>

          <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-islamic-700 transition-colors line-clamp-2">
            <Link href={`/berita/${article.slug}`}>{article.title}</Link>
          </h3>

          <p className="mt-2 text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-medium text-gray-700 truncate max-w-[200px]">
            <User className="w-3.5 h-3.5 text-islamic-600" />
            {article.authorName}
          </span>
          <Link
            href={`/berita/${article.slug}`}
            className="font-semibold text-islamic-600 hover:text-islamic-800 transition-colors inline-flex items-center gap-1"
          >
            Baca Selengkapnya →
          </Link>
        </div>
      </div>
    </article>
  );
}
