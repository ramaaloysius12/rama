/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Mengabaikan error ESLint (seperti tanda kutip) saat build di Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mengabaikan error tipe data TypeScript saat build di Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
