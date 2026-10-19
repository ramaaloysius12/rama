import Link from "next/link";
import { MoonStar } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
        <div className="h-14 w-14 bg-islamic-50 text-islamic-700 rounded-2xl mx-auto flex items-center justify-center">
          <MoonStar className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">404</h1>
        <h2 className="text-lg font-bold text-gray-800">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500">Maaf, halaman atau artikel yang Anda cari tidak tersedia atau telah dipindahkan.</p>
        <div className="pt-4">
          <Link href="/" className="px-6 py-3 bg-islamic-600 text-white rounded-xl text-sm font-semibold shadow-md inline-block">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
