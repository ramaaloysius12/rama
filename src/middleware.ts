import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback_secret_key_minimal_32_bytes_long_here"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Jika mengakses halaman login, biarkan lewat
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Lindungi semua rute /admin lainnya
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("islam_kaffah_admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("islam_kaffah_admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
