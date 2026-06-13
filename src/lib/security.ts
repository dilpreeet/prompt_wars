/** Shared security limits for API routes. */
export const MAX_ENHANCE_BODY_BYTES = 8192;

export function buildContentSecurityPolicy(isDevelopment: boolean): string {
  const scriptSrc = isDevelopment
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

  const connectSrc = isDevelopment
    ? "connect-src 'self' ws: wss:"
    : "connect-src 'self'";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    connectSrc,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

export function getSecurityHeaders(
  isDevelopment = false,
): Record<string, string> {
  return {
    "Content-Security-Policy": buildContentSecurityPolicy(isDevelopment),
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "X-DNS-Prefetch-Control": "on",
  };
}

/** Production CSP — used in tests and prod builds. */
export const SECURITY_HEADERS = getSecurityHeaders(false);
