import type { NextConfig } from "next";
import { getSecurityHeaders } from "./src/lib/security";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  async headers() {
    const securityHeaders = getSecurityHeaders(isDevelopment);

    return [
      {
        source: "/(.*)",
        headers: Object.entries(securityHeaders).map(([key, value]) => ({
          key,
          value,
        })),
      },
    ];
  },
};

export default nextConfig;
