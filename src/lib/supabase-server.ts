import { createClient, SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "berita-images";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // Maksimal 5 MB

let supabaseAdminInstance: SupabaseClient | null = null;

/**
 * Mengambil instance Supabase Client dengan Service Role Key.
 * HANYA boleh dipanggil di sisi server (Server Actions / Route Handlers).
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("KEAMANAN: Supabase Admin Client tidak boleh dijalankan di browser!");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Konfigurasi NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diisi di .env"
    );
  }

  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return supabaseAdminInstance;
}

/**
 * Validasi file gambar berdasarkan ukuran, MIME type, dan ekstensi file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file || file.size === 0) {
    return { valid: false, error: "File gambar tidak boleh kosong." };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Ukuran gambar terlalu besar. Maksimal ukuran file adalah 5 MB.",
    };
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Format gambar tidak didukung. Gunakan format JPG, PNG, atau WEBP.",
    };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: "Ekstensi file tidak valid. Gunakan .jpg, .jpeg, .png, atau .webp.",
    };
  }

  return { valid: true };
}

/**
 * Upload file gambar ke Supabase Storage dengan nama unik acak
 */
export async function uploadArticleImage(
  file: File,
  folder: "thumbnails" | "content" = "thumbnails"
): Promise<{ publicUrl: string; filePath: string }> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const supabase = getSupabaseAdmin();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomId = crypto.randomBytes(12).toString("hex");
  const filePath = `${folder}/${datePrefix}-${randomId}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    console.error("[Supabase Upload Error]:", uploadError.message);
    throw new Error("Gagal mengunggah gambar ke server penyimpanan.");
  }

  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return {
    publicUrl: publicUrlData.publicUrl,
    filePath,
  };
}

/**
 * Hapus gambar dari Supabase Storage secara aman
 */
export async function deleteArticleImage(filePath: string | null | undefined): Promise<void> {
  if (!filePath) return;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);

  if (error) {
    console.error("[Supabase Delete Error]:", error.message);
  }
}
