"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations";
import { loginAdminAction } from "@/actions/auth.actions";
import { Lock, Mail, Loader2, MoonStar } from "lucide-react";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    setError(null);
    startTransition(async () => {
      const result = await loginAdminAction(data);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-islamic-800 via-islamic-900 to-islamic-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Elemen Dekoratif Cahaya & Ornamen Halus */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-islamic-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-2xl border border-islamic-200 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-islamic-600 to-islamic-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-islamic-600/30">
            <MoonStar className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Islam Kaffah
          </h1>
          <p className="mt-1 text-sm font-medium text-islamic-700">
            Portal Berita & Dakwah Islam
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Masuk ke panel kontrol redaksi admin
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3.5 rounded-lg text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                {...register("email")}
                placeholder="admin@islamkaffah.id"
                className="appearance-none block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-islamic-500 focus:border-islamic-500 text-sm text-gray-900 bg-gray-50/50"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="appearance-none block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-islamic-500 focus:border-islamic-500 text-sm text-gray-900 bg-gray-50/50"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-islamic-600 hover:bg-islamic-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-islamic-500 transition-all duration-200 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-gray-100">
          <a
            href="/"
            className="text-xs font-medium text-islamic-700 hover:text-islamic-900 transition-colors inline-flex items-center gap-1"
          >
            ← Kembali ke Beranda Islam Kaffah
          </a>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-islamic-200/70 relative z-10">
        © 2026 Islam Kaffah. All rights reserved. Rama Design.
      </footer>
    </main>
  );
}
