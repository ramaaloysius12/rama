/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Ini wajib agar gambar Supabase tidak diblokir
      },
      {
        protocol: 'https',
        hostname: '**', // (Opsional) Mengizinkan gambar dari URL luar mana pun
      }
    ],
  },
};

export default nextConfig;
