import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client"],
  allowedDevOrigins: ["justice-remember-enigmatic.ngrok-free.dev"],
};

export default withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnFrontendNav: true,
  maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
  disable: process.env.NODE_ENV !== "production",
})(nextConfig);
