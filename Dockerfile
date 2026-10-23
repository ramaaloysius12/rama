# 1. Tahap Dependencies (Install modul)
FROM node:22-slim AS deps
# Install openssl bawaan Debian yang sangat disukai Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

# 2. Tahap Builder (Membangun aplikasi)
FROM node:22-slim AS builder
RUN apt-get update && apt-get install -y openssl ca-certificates
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# 3. Tahap Runner (Menjalankan aplikasi di Production)
FROM node:22-slim AS runner
RUN apt-get update && apt-get install -y openssl ca-certificates
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
