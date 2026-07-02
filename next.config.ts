import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow HMR and dev assets when accessed via port-forwarded / cloud IDE URLs
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "*.cursor.app",
    "*.cursor.sh",
    "*.github.dev",
    "*.codespaces.dev",
    "*.gitpod.io",
  ],
};

export default nextConfig;
