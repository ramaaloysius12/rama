import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback_secret_key_minimal_32_bytes_long_here"
);

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function encryptSession(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function decryptSession(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function setAdminSessionCookie(payload: AdminSessionPayload) {
  const token = await encryptSession(payload);
  cookies().set("islam_kaffah_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 Jam
  });
}

export async function clearAdminSessionCookie() {
  cookies().set("islam_kaffah_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export const getCurrentAdmin = cache(async (): Promise<AdminSessionPayload | null> => {
  const token = cookies().get("islam_kaffah_admin_session")?.value;
  if (!token) return null;

  const payload = await decryptSession(token);
  if (!payload) return null;

  // Verifikasi ke database apakah admin masih aktif
  const admin = await prisma.admin.findUnique({
    where: { id: payload.adminId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!admin) return null;

  return {
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
});
