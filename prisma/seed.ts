import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai proses seeding database Islam Kaffah...");

  const adminName = process.env.INITIAL_ADMIN_NAME || "Admin Utama Islam Kaffah";
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "❌ Gagal seed: INITIAL_ADMIN_EMAIL dan INITIAL_ADMIN_PASSWORD wajib diisi di dalam file .env!"
    );
  }

  if (adminPassword.length < 8) {
    throw new Error(
      "❌ Gagal seed: INITIAL_ADMIN_PASSWORD harus memiliki minimal 8 karakter demi keamanan."
    );
  }

  // 1. Seed Pengaturan Dasar Website
  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "Islam Kaffah",
      tagline: "Menebar Cahaya Islam secara Utuh, Ilmiah, dan Menyejukkan",
      description:
        "Islam Kaffah adalah portal berita Islam, dakwah, kajian, dan artikel keislaman yang menyajikan khazanah ilmu berdasarkan Al-Qur'an dan As-Sunnah dengan penyampaian yang santun, bersih, dan terpercaya.",
      contactEmail: "redaksi@islamkaffah.id",
      contactPhone: "+62 812-3456-7890",
      address: "Jl. Dakwah Islamiyah No. 144, Jakarta Selatan, Indonesia",
      facebookUrl: "https://facebook.com",
      instagramUrl: "https://instagram.com",
      youtubeUrl: "https://youtube.com",
      twitterUrl: "https://x.com",
    },
  });
  console.log("✅ Pengaturan situs berhasil dibuat.");

  // 2. Seed Akun Admin Awal
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail.toLowerCase().trim() },
    update: {
      name: adminName,
      passwordHash,
    },
    create: {
      name: adminName,
      email: adminEmail.toLowerCase().trim(),
      passwordHash,
      role: "SUPERADMIN",
    },
  });
  console.log(`✅ Akun Admin berhasil disiapkan untuk email: ${admin.email}`);

  // 3. Seed 8 Kategori Berita Awal (Dapat dikelola penuh di Dashboard Admin)
  const categoriesData = [
    {
      name: "Akidah",
      slug: "akidah",
      description: "Pembahasan mendasar seputar keimanan, tauhid, dan pokok-pokok keyakinan seorang Muslim.",
    },
    {
      name: "Akhlak",
      slug: "akhlak",
      description: "Tuntunan adab, penyucian jiwa (tazkiyatun nafs), dan kemuliaan budi pekerti dalam Islam.",
    },
    {
      name: "Fikih",
      slug: "fikih",
      description: "Kajian hukum Islam praktis mencakup ibadah, muamalah, dan persoalan kontemporer.",
    },
    {
      name: "Sirah Nabawiyah",
      slug: "sirah-nabawiyah",
      description: "Perjalanan hidup Rasulullah ﷺ, para sahabat, dan hikmah sejarah peradaban Islam.",
    },
    {
      name: "Kajian Islam",
      slug: "kajian-islam",
      description: "Rangkuman kajian ilmiah, tafsir Al-Qur'an, dan syarah hadits pilihan.",
    },
    {
      name: "Keluarga Muslim",
      slug: "keluarga-muslim",
      description: "Panduan membangun rumah tangga sakinah, mawaddah, warahmah dalam bingkai syariat.",
    },
    {
      name: "Pendidikan Islam",
      slug: "pendidikan-islam",
      description: "Wawasan tarbiyah anak, adab menuntut ilmu, dan penguatan generasi Rabbani.",
    },
    {
      name: "Berita Dunia Islam",
      slug: "berita-dunia-islam",
      description: "Perkembangan terkini, inspirasi, dan kabar umat Islam dari berbagai penjuru dunia.",
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }
  console.log("✅ 8 Kategori dakwah berhasil disiapkan.");
  console.log("ℹ️ Tidak ada artikel dummy yang dibuat. Berita & gambar akan di-upload langsung melalui Dashboard Admin.");
  console.log("🎉 Seeding database selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
