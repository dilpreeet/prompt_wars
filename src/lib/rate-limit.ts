import type { NextRequest } from "next/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "anonymous";
  }

  return request.headers.get("x-real-ip") ?? "anonymous";
}

export function checkRateLimit(request: NextRequest): {
  ok: boolean;
  retryAfterSeconds?: number;
} {
  const clientId = getClientId(request);
  const now = Date.now();
  const entry = store.get(clientId);

  if (!entry || now >= entry.resetAt) {
    store.set(clientId, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      ok: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  store.set(clientId, entry);
  return { ok: true };
}

export function resetRateLimitStore(): void {
  store.clear();
}
