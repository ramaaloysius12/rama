import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata = {
  title: "Kategori Kajian | Islam Kaffah",
  description: "Jelajahi berbagai kategori artikel dan kajian Islam.",
};

export default async function AllCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { articles: { where: { status: "PUBLISHED" } } } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Jelajahi Kategori Dakwah</h1>
        <p className="text-gray-600">Pilih topik kajian dan berita Islam yang ingin Anda pelajari hari ini.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/kategori/${cat.slug}`}
            className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-islamic-500 hover:shadow-lg transition-all group text-center flex flex-col items-center gap-3"
          >
            <div className="p-3 bg-islamic-50 rounded-xl group-hover:bg-islamic-600 group-hover:text-white text-islamic-600 transition-colors">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 group-hover:text-islamic-700">{cat.name}</h2>
              <p className="text-xs text-gray-500 mt-1">{cat._count.articles} Artikel</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
