import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client"],
};
module.exports = {
  allowedDevOrigins: ['justice-remember-enigmatic.ngrok-free.dev'],
}
export default nextConfig;
