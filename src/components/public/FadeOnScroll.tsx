"use client";

import { useEffect, useRef, useState } from "react";

export default function FadeOnScroll({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Fade In (Muncul) saat elemen masuk ke layar
            setVisible(true);
          } else {
            // Fade Out (Menghilang) saat elemen keluar dari layar
            setVisible(false);
          }
        });
      },
      { threshold: 0.15 } // Efek terpicu saat 15% elemen sudah masuk layar
    );

    const current = domRef.current;
    if (current) observer.observe(current);
    
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
