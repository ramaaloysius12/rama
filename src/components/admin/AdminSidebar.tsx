"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdminAction } from "@/actions/auth.actions";
import {
  LayoutDashboard,
  Newspaper,
  PlusCircle,
  FolderTree,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  MoonStar,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Kelola Berita", href: "/admin/berita", icon: Newspaper },
  { name: "Tambah Berita", href: "/admin/berita/tambah", icon: PlusCircle },
  { name: "Kategori", href: "/admin/kategori", icon: FolderTree },
  { name: "Kelola Komentar", href: "/admin/komentar", icon: MessageSquare },
  { name: "Pengaturan Situs", href: "/admin/pengaturan", icon: Settings },
];

export default function AdminSidebar({
  adminName,
  adminEmail,
}: {
  adminName: string;
  adminEmail: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari panel admin?")) {
      await logoutAdminAction();
    }
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-islamic-900 text-white flex items-center justify-between px-4 py-3 sticky top-0 z-40 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-islamic-600 flex items-center justify-center text-white">
            <MoonStar className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight">Islam Kaffah Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-islamic-200 hover:text-white hover:bg-islamic-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Responsive Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-islamic-950 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-islamic-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-islamic-600 to-islamic-500 flex items-center justify-center text-white shadow-lg">
              <MoonStar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">Islam Kaffah</h2>
              <p className="text-xs text-islamic-300 font-medium">Panel Redaksi</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-islamic-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Admin Info Profile */}
        <div className="px-6 py-4 bg-islamic-900/50 border-b border-islamic-800/60 mx-4 mt-4 rounded-xl">
          <p className="text-xs text-islamic-300 font-medium uppercase tracking-wider">Masuk Sebagai</p>
          <p className="text-sm font-semibold text-white truncate mt-0.5">{adminName}</p>
          <p className="text-xs text-islamic-400 truncate">{adminEmail}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-islamic-700 text-white shadow-md shadow-islamic-900/40"
                    : "text-islamic-200 hover:bg-islamic-900/80 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-islamic-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-islamic-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-950/50 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar (Logout)
          </button>
          <div className="mt-4 text-center">
            <span className="text-[11px] text-islamic-400">© 2026 Islam Kaffah • Rama Design</span>
          </div>
        </div>
      </aside>
    </>
  );
}
