import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Graceful fallback for local development or when Redis env vars are pending
let ratelimitInstance: {
  limit: (identifier: string) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }>;
};

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const upstashRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "60 s"),
    analytics: true,
    prefix: "@radiant/ratelimit",
  });

  ratelimitInstance = {
    limit: async (id: string) => {
      const res = await upstashRatelimit.limit(id);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
      };
    },
  };
} else {
  // In-memory sliding window fallback for dev environments
  const memoryStore = new Map<string, { count: number; resetAt: number }>();

  ratelimitInstance = {
    limit: async (identifier: string) => {
      const now = Date.now();
      const windowMs = 60 * 1000;
      const maxRequests = 30;

      const record = memoryStore.get(identifier);

      if (!record || now > record.resetAt) {
        memoryStore.set(identifier, { count: 1, resetAt: now + windowMs });
        return { success: true, limit: maxRequests, remaining: maxRequests - 1, reset: now + windowMs };
      }

      if (record.count >= maxRequests) {
        return { success: false, limit: maxRequests, remaining: 0, reset: record.resetAt };
      }

      record.count += 1;
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - record.count,
        reset: record.resetAt,
      };
    },
  };
}

export const rateLimiter = ratelimitInstance;
