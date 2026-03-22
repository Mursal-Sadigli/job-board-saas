import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // turbopack: {}, // Enable if needed, but keeping it simple for now
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
