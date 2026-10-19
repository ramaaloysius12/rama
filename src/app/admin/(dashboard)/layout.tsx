import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Autentikasi sesi di sisi server
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row antialiased">
      {/* Sidebar Responsif (Drawer untuk Android / Fixed untuk PC) */}
      <AdminSidebar adminName={admin.name} adminEmail={admin.email} />

      {/* Area Konten Utama (Menyesuaikan margin kiri di PC, lebar penuh di Android) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
