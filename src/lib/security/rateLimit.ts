// Lightweight Edge-compatible In-Memory Rate Limiter
// Note: In a heavily distributed serverless environment, memory is isolated per edge node.
// This provides basic protection per region. For strict global limits, Upstash Redis is recommended.

interface RateLimitTracker {
  count: number;
  resetAt: number;
}

const limiters = new Map<string, RateLimitTracker>();

export function rateLimit(identifier: string, limit: number, windowMs: number): { success: boolean; limit: number; remaining: number } {
  const now = Date.now();
  const record = limiters.get(identifier);

  if (!record) {
    limiters.set(identifier, {
      count: 1,
      resetAt: now + windowMs
    });
    return { success: true, limit, remaining: limit - 1 };
  }

  if (now > record.resetAt) {
    // Window expired, reset
    record.count = 1;
    record.resetAt = now + windowMs;
    limiters.set(identifier, record);
    return { success: true, limit, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, limit, remaining: 0 };
  }

  record.count += 1;
  limiters.set(identifier, record);
  return { success: true, limit, remaining: limit - record.count };
}

// Memory cleanup utility to prevent Map from growing indefinitely on long-running nodes
export function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, value] of limiters.entries()) {
    if (now > value.resetAt) {
      limiters.delete(key);
    }
  }
}

// Run cleanup every 5 minutes if supported
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

