import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function addCategoryAction(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  if (!name || !slug) return;

  try {
    await prisma.category.create({
      data: { name, slug, description },
    });
    revalidatePath("/admin/kategori");
    revalidatePath("/kategori");
  } catch (err) {
    console.error(err);
  }
}

export default async function AdminKategoriPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Kelola Kategori Dakwah</h1>

      {/* Form Tambah Kategori */}
      <form action={addCategoryAction} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-gray-900">Tambah Kategori Baru</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Nama Kategori (Contoh: Ibadah)"
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
          />
          <input
            type="text"
            name="slug"
            required
            placeholder="Slug URL (Contoh: ibadah)"
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
          />
        </div>
        <textarea
          name="description"
          placeholder="Deskripsi singkat kategori..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
          rows={2}
        />
        <button type="submit" className="px-5 py-2.5 bg-islamic-600 text-white rounded-xl text-sm font-semibold shadow-md">
          Simpan Kategori
        </button>
      </form>

      {/* Tabel Kategori */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="py-3 px-6">Nama Kategori</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Jumlah Artikel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="py-3 px-6 font-medium text-gray-900">{cat.name}</td>
                <td className="py-3 px-4 text-gray-600 font-mono text-xs">{cat.slug}</td>
                <td className="py-3 px-4 text-gray-600">{cat._count.articles} Artikel</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
