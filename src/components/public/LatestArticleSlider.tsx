"use client";

import { useEffect, useRef } from "react";
import ArticleCard from "./ArticleCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LatestArticleSlider({ articles }: { articles: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // Jika sudah mentok di ujung kanan, kembali ke awal (kiri)
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Geser sejauh 1 kartu (sekitar 350px) ke kanan
          scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
        }
      }
    }, 4000); // Otomatis bergeser setiap 4 detik

    return () => clearInterval(interval);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (!articles || articles.length === 0) return null;

  return (
    <div className="relative group">
      {/* Tombol Panah Kiri (Sembunyi di HP, muncul di Laptop saat di-hover) */}
      <button 
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white p-3 rounded-full shadow-lg border border-gray-100 text-islamic-600 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-islamic-50"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Kontainer Slider Utama */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-2 px-2 -mx-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {articles.map((article) => (
          <div key={article.id} className="w-[85vw] sm:w-[350px] shrink-0 snap-center sm:snap-start">
            <ArticleCard article={article} />
          </div>
        ))}
      </div>

      {/* Tombol Panah Kanan */}
      <button 
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white p-3 rounded-full shadow-lg border border-gray-100 text-islamic-600 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-islamic-50"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
