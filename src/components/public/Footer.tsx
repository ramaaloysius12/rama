import Link from "next/link";
import { MoonStar, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-islamic-950 text-white pt-16 pb-12 border-t border-islamic-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-islamic-600 flex items-center justify-center text-white shadow-md">
                <MoonStar className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">Islam Kaffah</span>
            </div>
            <p className="text-sm text-islamic-200/80 leading-relaxed">
              Portal berita Islam, dakwah, kajian, dan artikel keislaman yang menyajikan khazanah ilmu berdasarkan Al-Qur'an dan As-Sunnah secara utuh dan menyejukkan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2.5 text-sm text-islamic-200/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-white transition-colors">Semua Berita</Link>
              </li>
              <li>
                <Link href="/kategori" className="hover:text-white transition-colors">Kategori Dakwah</Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="hover:text-white transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-white transition-colors">Kontak Redaksi</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              Kebijakan
            </h3>
            <ul className="space-y-2.5 text-sm text-islamic-200/80">
              <li>
                <Link href="/kebijakan-privasi" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Login Redaksi Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              Hubungi Kami
            </h3>
            <div className="flex items-start space-x-3 text-sm text-islamic-200/80">
              <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <span>Jl. Dakwah Islamiyah No. 144, Jakarta Selatan, Indonesia</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-islamic-200/80">
              <Mail className="w-5 h-5 text-gold-400 shrink-0" />
              <span>redaksi@islamkaffah.id</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-islamic-200/80">
              <Phone className="w-5 h-5 text-gold-400 shrink-0" />
              <span>+62 812-3456-7890</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-islamic-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-islamic-300 gap-4">
          <p>© 2026 Islam Kaffah. All rights reserved. Rama Design.</p>
          <div className="flex space-x-6">
            <Link href="/kebijakan-privasi" className="hover:text-white transition-colors">Privasi</Link>
            <Link href="/kontak" className="hover:text-white transition-colors">Bantuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
