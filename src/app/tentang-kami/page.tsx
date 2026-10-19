import { BookOpen, ShieldCheck, Heart, Quote, Compass } from "lucide-react";
import FadeOnScroll from "@/components/public/FadeOnScroll"; // <-- Import animasi

export const metadata = {
  title: "Tentang Kami | Islam Kaffah",
  description: "Mengenal lebih dekat visi, misi, dan landasan keimanan portal dakwah Islam Kaffah.",
};

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16 overflow-hidden">
      
      {/* 1. HEADER SECTION */}
      <FadeOnScroll>
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-islamic-100 text-islamic-700 mb-2 shadow-inner">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Tentang <span className="text-islamic-700">Islam Kaffah</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Media dakwah yang hadir untuk menebarkan cahaya kebenaran, mengajak umat kembali kepada kemurnian ajaran Islam berdasarkan Al-Qur'an dan As-Sunnah sesuai pemahaman Salafus Shalih.
          </p>
        </div>
      </FadeOnScroll>

      {/* 2. LANDASAN AL-QUR'AN (MAKNA KAFFAH) */}
      <FadeOnScroll delay={200}>
        <section className="bg-gradient-to-br from-islamic-900 to-islamic-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <BookOpen className="w-96 h-96" />
          </div>
          
          <div className="relative z-10 space-y-8 text-center max-w-3xl mx-auto">
            <Quote className="w-12 h-12 text-gold-500 mx-auto opacity-50" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-400">Landasan Berislam Kaffah</h2>
            
            <div className="space-y-6">
              <p className="font-arabic text-3xl sm:text-4xl lg:text-5xl leading-relaxed sm:leading-loose drop-shadow-md" dir="rtl">
                يَا أَيُّهَا الَّذِينَ آمَنُوا ادْخُلُوا فِي السِّلْمِ كَافَّةً وَلَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ ۚ إِنَّهُ لَكُمْ عَدُوٌّ مُبِينٌ
              </p>
              <div className="space-y-2">
                <p className="text-base sm:text-lg text-islamic-100 italic leading-relaxed">
                  "Hai orang-orang yang beriman, masuklah kamu ke dalam Islam keseluruhan, dan janganlah kamu turut langkah-langkah syaitan. Sesungguhnya syaitan itu musuh yang nyata bagimu."
                </p>
                <p className="text-sm font-bold text-gold-500 tracking-wider uppercase">
                  (QS. Al-Baqarah: 208)
                </p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-islamic-800/50 text-gray-300 text-sm sm:text-base leading-relaxed text-justify sm:text-center">
              Kami meyakini bahwa Islam bukanlah sekadar ibadah ritual, melainkan pandangan hidup (way of life) yang mengatur seluruh aspek kehidupan, mulai dari aqidah, akhlak, muamalah, hingga tata cara bernegara.
            </div>
          </div>
        </section>
      </FadeOnScroll>

      {/* 3. LANDASAN HADITS (KEIMANAN & SUNNAH) */}
      <section className="space-y-12 pt-8">
        <FadeOnScroll>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900">Prinsip & Manhaj</h2>
            <p className="text-gray-600">
              Berpegang teguh pada dua wasiat Rasulullah ﷺ agar tidak tersesat selamanya.
            </p>
          </div>
        </FadeOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Hadits 1 */}
          <FadeOnScroll delay={100}>
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-islamic-50 text-islamic-600 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Berpegang pada Dua Pusaka</h3>
                <p className="font-arabic text-2xl leading-loose text-right text-gray-800" dir="rtl">
                  تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ
                </p>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  "Aku telah tinggalkan pada kamu dua perkara. Kamu tidak akan sesat selama berpegang kepada keduanya, (yaitu) Kitab Allah (Al-Qur'an) dan Sunnah Rasul-Nya."
                </p>
              </div>
              <p className="text-xs font-bold text-islamic-600 uppercase">
                (HR. Malik dalam Al-Muwatha')
              </p>
            </div>
          </FadeOnScroll>

          {/* Card Hadits 2 */}
          <FadeOnScroll delay={300}>
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-islamic-50 text-islamic-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Menjauhi Kebatilan (Bid'ah)</h3>
                <p className="font-arabic text-2xl leading-loose text-right text-gray-800" dir="rtl">
                  مَنْ أَحْدَثَ فِى أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ
                </p>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  "Barangsiapa membuat suatu perkara baru dalam agama kami ini yang tidak ada asalnya, maka perkara tersebut tertolak."
                </p>
              </div>
              <p className="text-xs font-bold text-islamic-600 uppercase">
                (HR. Bukhari dan Muslim)
              </p>
            </div>
          </FadeOnScroll>
        </div>
      </section>

      {/* 4. VISI & MISI */}
      <FadeOnScroll>
        <section className="bg-islamic-50 rounded-3xl p-8 sm:p-12 border border-islamic-100 shadow-sm mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-islamic-700">
                <Heart className="w-8 h-8" />
                <h2 className="text-3xl font-extrabold text-gray-900">Visi Kami</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg text-justify">
                Menjadi media rujukan utama bagi umat Islam dalam mempelajari aqidah yang lurus, ibadah yang shahih, dan akhlak mulia guna mewujudkan peradaban Islam yang rahmatan lil 'alamin.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-gray-900 border-b border-islamic-200 pb-3">
                Misi Kami
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-islamic-200 text-islamic-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                  <p className="text-gray-700 text-sm leading-relaxed">Menyajikan berita dan kajian yang ilmiah berdasarkan Al-Qur'an dan hadits shahih.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-islamic-200 text-islamic-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                  <p className="text-gray-700 text-sm leading-relaxed">Membantah syubhat (keraguan) dan penyimpangan dalam agama dengan hikmah dan nasihat yang baik.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-islamic-200 text-islamic-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                  <p className="text-gray-700 text-sm leading-relaxed">Membangun kesadaran umat akan pentingnya ukhuwah Islamiyah di atas manhaj (jalan) kebenaran.</p>
                </li>
              </ul>
            </div>

          </div>
        </section>
      </FadeOnScroll>

    </main>
  );
}
