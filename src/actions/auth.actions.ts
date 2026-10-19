"use server";

import { prisma } from "@/lib/prisma";
import { loginSchema, LoginInput } from "@/lib/validations";
import { setAdminSessionCookie, clearAdminSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function loginAdminAction(data: LoginInput): Promise<{ error?: string }> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { email, password } = parsed.data;

  // Rate limiting berdasarkan IP / email (maksimal 5 percobaan dalam 10 menit)
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
  const rateLimitKey = `login-${ip}-${email}`;
  
  const limiter = await checkRateLimit(rateLimitKey, "ADMIN_LOGIN", 5, 10);
  if (!limiter.success) {
    return { error: "Terlalu banyak percobaan login gagal. Silakan coba lagi setelah 10 menit." };
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return { error: "Email atau password salah." };
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isPasswordValid) {
    return { error: "Email atau password salah." };
  }

  // Buat sesi cookie aman
  await setAdminSessionCookie({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
