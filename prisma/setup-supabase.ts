import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

// Muat file .env secara otomatis
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    throw new Error("❌ File .env tidak ditemukan di root proyek!");
  }
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

async function setupSupabase() {
  console.log("🔍 Memeriksa konfigurasi .env Supabase...");
  loadEnv();

  const requiredVars = [
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  for (const key of requiredVars) {
    const val = process.env[key];
    if (!val || val.includes("[PROJECT-REF]") || val.includes("[DB-PASSWORD]") || val.endsWith("...")) {
      throw new Error(
        `❌ Variabel ${key} di dalam file .env masih menggunakan nilai placeholder! Silakan isi dengan kredensial asli dari Dashboard Supabase.`
      );
    }
  }
  console.log("✅ Seluruh variabel environment Supabase sudah terisi.");

  // 1. Tes Koneksi Database PostgreSQL via Prisma
  console.log("🔌 Menguji koneksi ke Supabase PostgreSQL...");
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Koneksi Database Supabase PostgreSQL BERHASIL!");
  } catch (err) {
    throw new Error(
      `❌ Gagal terhubung ke Database PostgreSQL. Periksa kembali DATABASE_URL dan password database Anda.\nDetail: ${(err as Error).message}`
    );
  } finally {
    await prisma.$disconnect();
  }

  // 2. Setup Otomatis Bucket Supabase Storage (berita-images)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "berita-images";

  console.log(`🪣 Mengonfigurasi Supabase Storage Bucket: "${bucketName}"...`);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(
      `❌ Gagal mengakses Supabase Storage API. Periksa NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.\nDetail: ${listError.message}`
    );
  }

  const bucketExists = buckets?.some((b) => b.name === bucketName);

  if (!bucketExists) {
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5242880, // 5 MB
      allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    });
    if (createError) {
      throw new Error(`❌ Gagal membuat bucket "${bucketName}": ${createError.message}`);
    }
    console.log(`✅ Bucket "${bucketName}" berhasil dibuat secara otomatis (Public Read, Max 5MB, JPG/PNG/WEBP).`);
  } else {
    const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
      public: true,
      fileSizeLimit: 5242880,
      allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    });
    if (updateError) {
      throw new Error(`❌ Gagal memperbarui konfigurasi bucket "${bucketName}": ${updateError.message}`);
    }
    console.log(`✅ Bucket "${bucketName}" sudah ada dan konfigurasinya berhasil diperbarui.`);
  }

  console.log("🎉 Konfigurasi Supabase (Database + Storage Bucket) 100% SIAP DIGUNAKAN!");
}

setupSupabase().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
