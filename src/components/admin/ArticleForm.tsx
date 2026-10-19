"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { slugify } from "@/lib/utils";
import { Loader2, Upload, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ArticleFormProps {
  initialData?: any;
  categories: Category[];
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

export default function ArticleForm({ initialData, categories, action }: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "Redaksi Islam Kaffah");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || "");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || "");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.thumbnailUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialData) {
      setSlug(slugify(val));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    formData.append("authorName", authorName);
    formData.append("status", status);
    formData.append("isFeatured", String(isFeatured));
    formData.append("imageAlt", imageAlt);
    formData.append("seoTitle", seoTitle);
    formData.append("seoDescription", seoDescription);
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      const res = await action(formData);
      if (res && res.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Judul Berita</label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="Masukkan judul berita..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-islamic-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Slug URL (Otomatis)</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="judul-berita-islam"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-gray-50 font-mono focus:ring-2 focus:ring-islamic-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Ringkasan (Excerpt)</label>
            <textarea
              rows={3}
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan singkat isi berita..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-islamic-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Isi Artikel (Mendukung HTML & Rich Text)</label>
            <textarea
              rows={12}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<h2>Sub Judul</h2><p>Paragraf isi artikel lengkap...</p>"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-islamic-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Sidebar Form */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Publikasi & Kategori</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Status Berita</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published (Terbit)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nama Penulis</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-islamic-600 rounded focus:ring-islamic-500"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Jadikan Berita Unggulan</label>
            </div>
          </div>

          {/* Upload Gambar Thumbnail */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Gambar Thumbnail (Upload dari Perangkat)</h3>
            
            {imagePreview && (
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-gray-200">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              </div>
            )}

            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-islamic-50 file:text-islamic-700 hover:file:bg-islamic-100"
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Alt Text Gambar</label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Deskripsi gambar untuk SEO"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-islamic-600 hover:bg-islamic-700 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {initialData ? "Simpan Perubahan Berita" : "Terbitkan / Simpan Berita"}
          </button>
        </div>
      </div>
    </form>
  );
}
