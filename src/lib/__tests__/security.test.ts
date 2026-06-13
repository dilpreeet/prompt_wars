import { describe, expect, it, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { checkRateLimit, resetRateLimitStore } from "../rate-limit";
import { MAX_ENHANCE_BODY_BYTES, SECURITY_HEADERS, getSecurityHeaders } from "../security";

function createRequest(ip = "127.0.0.1"): NextRequest {
  return new NextRequest("http://localhost/api/enhance", {
    headers: { "x-forwarded-for": ip },
  });
}

describe("security", () => {
  it("defines required security headers", () => {
    expect(SECURITY_HEADERS["X-Frame-Options"]).toBe("DENY");
    expect(SECURITY_HEADERS["X-Content-Type-Options"]).toBe("nosniff");
    expect(SECURITY_HEADERS["Referrer-Policy"]).toBeTruthy();
    expect(SECURITY_HEADERS["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(SECURITY_HEADERS["Content-Security-Policy"]).not.toContain("unsafe-eval");
  });

  it("allows unsafe-eval in development CSP only", () => {
    const devHeaders = getSecurityHeaders(true);
    const prodHeaders = getSecurityHeaders(false);

    expect(devHeaders["Content-Security-Policy"]).toContain("'unsafe-eval'");
    expect(devHeaders["Content-Security-Policy"]).toContain("ws:");
    expect(prodHeaders["Content-Security-Policy"]).not.toContain("'unsafe-eval'");
  });

  it("caps enhance payload size", () => {
    expect(MAX_ENHANCE_BODY_BYTES).toBeGreaterThan(0);
    expect(MAX_ENHANCE_BODY_BYTES).toBeLessThanOrEqual(16384);
  });
});

describe("rate limit", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("allows requests under the limit", () => {
    const request = createRequest("10.0.0.1");
    expect(checkRateLimit(request).ok).toBe(true);
  });

  it("blocks requests over the limit", () => {
    const request = createRequest("10.0.0.2");

    for (let index = 0; index < 10; index += 1) {
      expect(checkRateLimit(request).ok).toBe(true);
    }

    const blocked = checkRateLimit(request);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});
