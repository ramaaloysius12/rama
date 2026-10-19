import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/public/Navbar"; // <-- Ini import yang wajib ditambahkan

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Judul tab browser sudah saya sesuaikan dengan nama web Anda
export const metadata: Metadata = {
  title: "Islam Kaffah | Portal Berita & Dakwah",
  description: "Menyajikan khazanah ilmu keislaman berlandaskan Al-Qur'an dan As-Sunnah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* Navbar akan muncul di semua halaman publik */}
        <Navbar /> 
        
        {children}
      </body>
    </html>
  );
}
