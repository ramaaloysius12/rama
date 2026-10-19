import { Mail, MapPin, Phone, Send, MessageCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Hubungi Kami | Islam Kaffah",
  description: "Hubungi redaksi Islam Kaffah untuk pertanyaan, masukan, atau kerja sama dakwah.",
};

export default function ContactPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16">
      
      {/* Bagian Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
          Hubungi <span className="text-islamic-700">Kami</span>
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Kami senantiasa terbuka untuk menerima masukan, pertanyaan seputar agama, maupun tawaran kerja sama dakwah dari antum semua.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-islamic-50 to-white p-8 rounded-3xl border border-islamic-100 shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4">
              Informasi Kontak Redaksi
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-islamic-100 flex items-center justify-center text-islamic-700 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Alamat Kantor</h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    Jl. Dakwah Islamiyah No. 123, Komplek Islamic Center,<br />
                    Jakarta Selatan, Indonesia 12345
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-islamic-100 flex items-center justify-center text-islamic-700 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Telepon / WhatsApp</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    +6288227142563<br />
                    (Senin - Jumat, 08.00 - 16.00 WIB)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-islamic-100 flex items-center justify-center text-islamic-700 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    redaksi@islamkaffah.com<br />
                    info@islamkaffah.com
                  </p>
                </div>
              </div>
            </div>

            {/* Tombol WhatsApp Langsung */}
            <div className="pt-6">
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5" /> Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Kolom Formulir Kontak */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Kirim Pesan</h3>
          <p className="text-sm text-gray-500 mb-8">Silakan isi formulir di bawah ini untuk mengirimkan pesan langsung ke email redaksi kami.</p>
          
          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                <input 
                  type="text" 
                  id="name" 
                  placeholder="Fulan bin Fulan"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-islamic-500 focus:border-islamic-500 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">Alamat Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="fulan@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-islamic-500 focus:border-islamic-500 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subjek Topik</label>
              <input 
                type="text" 
                id="subject" 
                placeholder="Pertanyaan Agama / Kerja Sama / dll"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-islamic-500 focus:border-islamic-500 focus:outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-semibold text-gray-700">Isi Pesan</label>
              <textarea 
                id="message" 
                rows={5}
                placeholder="Tuliskan pesan antum di sini..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-islamic-500 focus:border-islamic-500 focus:outline-none transition-all bg-gray-50 focus:bg-white resize-none"
              ></textarea>
            </div>

            <button 
              type="button" 
              className="w-full flex items-center justify-center gap-2 bg-islamic-600 hover:bg-islamic-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md hover:shadow-lg mt-4"
            >
              <Send className="w-5 h-5" /> Kirim Pesan Sekarang
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
