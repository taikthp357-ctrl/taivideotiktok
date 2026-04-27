type RateEntry = { count: number; resetAt: number };

const store = new Map<string, RateEntry>();

const WINDOW_MS = 60_000;
const DEFAULT_LIMIT = Number(import.meta.env.RATE_LIMIT_PER_MINUTE ?? 20);

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const safeKey = key || 'anonymous';
  const current = store.get(safeKey);

  if (!current || current.resetAt <= now) {
    store.set(safeKey, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: DEFAULT_LIMIT - 1 };
  }

  if (current.count >= DEFAULT_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  store.set(safeKey, current);

  return { allowed: true, remaining: Math.max(0, DEFAULT_LIMIT - current.count) };
}
