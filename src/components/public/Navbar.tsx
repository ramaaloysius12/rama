"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react"; // MoonStar dihapus karena diganti gambar

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Berita", href: "/berita" },
  { name: "Tentang Kami", href: "/tentang-kami" },
  { name: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // State untuk menu swipe fade-in
  const [isSwipeMenuOpen, setIsSwipeMenuOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const pathname = usePathname();
  const router = useRouter();

  // 1. Logika deteksi scroll (Sembunyi saat scroll bawah, muncul saat scroll atas)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNav(false); 
      } else {
        setShowNav(true);  
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 2. Logika deteksi usap (Swipe) layar HP
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setIsSwipeMenuOpen(true); // Buka menu jika diusap ke kiri
    }
    if (isRightSwipe) {
      setIsSwipeMenuOpen(false); // Tutup menu jika diusap ke kanan
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/berita?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSwipeMenuOpen(false);
    }
  };

  return (
    <>
      {/* HEADER UTAMA */}
      <header 
        // Deteksi sentuhan (swipe) di area Navbar
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-500 ease-in-out ${
          showNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              
              {/* --- BAGIAN LOGO GAMBAR --- */}
              <img 
                src="/logo.png" 
                alt="Logo Islam Kaffah" 
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
              
              {/* Teks di Samping Logo */}
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight block">
                  Islam Kaffah
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-islamic-700 tracking-wider uppercase block -mt-1">
                  Portal Dakwah
                </span>
              </div>
            </Link>

            {/* Desktop Navigation (Sembunyi di HP) */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-islamic-50 text-islamic-700"
                        : "text-gray-600 hover:text-islamic-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Search Bar (Sembunyi di HP) */}
            <div className="hidden md:flex items-center">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari..."
                  className="w-40 lg:w-56 xl:w-64 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-islamic-500 focus:bg-white transition-all"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </form>
            </div>

            {/* Petunjuk Visual untuk HP */}
            <div className="md:hidden flex items-center text-[10px] text-gray-400 font-medium tracking-wide animate-pulse">
              &larr; Usap Layar
            </div>

          </div>
        </div>
      </header>

      {/* OVERLAY MENU (FADE IN SAAT DIUSAP KE KIRI) */}
      <div 
        // Deteksi usap di layar penuh agar menu bisa ditutup dengan usap ke kanan
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          isSwipeMenuOpen ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-95"
        }`}
      >
        <button 
          onClick={() => setIsSwipeMenuOpen(false)} 
          className="absolute top-6 right-6 p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full max-w-sm px-6 space-y-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berita & kajian..."
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-islamic-500 shadow-inner"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </form>

          <nav className="flex flex-col space-y-4 text-center">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsSwipeMenuOpen(false)}
                  // Menambahkan efek delay perlahan (stagger) berdasarkan urutan
                  style={{ transitionDelay: `${index * 50}ms` }}
                  className={`text-2xl font-bold tracking-tight transition-all duration-500 transform ${
                    isSwipeMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  } ${
                    isActive ? "text-islamic-600" : "text-gray-800 hover:text-islamic-500"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          
          <p className="text-center text-xs text-gray-400 pt-10">
            Usap ke kanan untuk menutup
          </p>
        </div>
      </div>
    </>
  );
}
