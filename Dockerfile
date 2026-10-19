# 1. Tahap Dependencies (Install modul)
FROM node:18-alpine AS deps
# Perlu libc6-compat untuk Prisma di Alpine Linux
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy file dependency dan prisma
COPY package.json package-lock.json ./
COPY prisma ./prisma/
# Install semua package
RUN npm ci

# 2. Tahap Builder (Membangun aplikasi)
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client & Build Next.js
RUN npx prisma generate
RUN npm run build

# 3. Tahap Runner (Menjalankan aplikasi di Production)
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Buat user non-root demi keamanan server
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy folder public
COPY --from=builder /app/public ./public

# Copy hasil build standalone dan static files (Otomatis dibuat oleh output: 'standalone')
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# Jalankan server Next.js (bukan npm run start, melainkan server.js bawaan standalone)
CMD ["node", "server.js"]
