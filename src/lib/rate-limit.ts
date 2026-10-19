import { prisma } from "@/lib/prisma";

export async function checkRateLimit(
  identifier: string,
  action: string,
  maxAttempts: number = 5,
  windowMinutes: number = 15
): Promise<{ success: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

  // Bersihkan log lama
  await prisma.rateLimitLog.deleteMany({
    where: {
      createdAt: { lt: windowStart },
    },
  });

  const attemptsCount = await prisma.rateLimitLog.count({
    where: {
      identifier,
      action,
      createdAt: { gte: windowStart },
    },
  });

  if (attemptsCount >= maxAttempts) {
    return { success: false, remaining: 0 };
  }

  await prisma.rateLimitLog.create({
    data: {
      identifier,
      action,
    },
  });

  return { success: true, remaining: maxAttempts - attemptsCount - 1 };
}
