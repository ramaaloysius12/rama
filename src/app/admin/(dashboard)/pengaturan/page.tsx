import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function updateSettings(formData: FormData) {
  "use server";
  const siteName = formData.get("siteName") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const address = formData.get("address") as string;

  try {
    await prisma.siteSetting.upsert({
      where: { id: "default" },
      update: { siteName, tagline, description, contactEmail, contactPhone, address },
      create: { id: "default", siteName, tagline, description, contactEmail, contactPhone, address },
    });
    revalidatePath("/");
  } catch (err) {
    console.error(err);
  }
}

export default async function AdminPengaturanPage() {
  const setting = await prisma.siteSetting.findUnique({ where: { id: "default" } });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Pengaturan Identitas Website</h1>

      <form action={updateSettings} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Website</label>
          <input
            type="text"
            name="siteName"
            defaultValue={setting?.siteName || "Islam Kaffah"}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tagline Dakwah</label>
          <input
            type="text"
            name="tagline"
            defaultValue={setting?.tagline || ""}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Deskripsi Situs</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={setting?.description || ""}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Redaksi</label>
            <input
              type="email"
              name="contactEmail"
              defaultValue={setting?.contactEmail || ""}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nomor Telepon / WhatsApp</label>
            <input
              type="text"
              name="contactPhone"
              defaultValue={setting?.contactPhone || ""}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Alamat Kantor</label>
          <input
            type="text"
            name="address"
            defaultValue={setting?.address || ""}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
          />
        </div>

        <button type="submit" className="px-6 py-3 bg-islamic-600 text-white rounded-xl text-sm font-semibold shadow-md">
          Simpan Pengaturan
        </button>
      </form>
    </div>
  );
}
