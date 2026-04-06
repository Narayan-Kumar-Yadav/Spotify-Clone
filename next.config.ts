import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["spotify-clone.localtest.me", "*.localtest.me"],
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "**.scdn.co",
        protocol: "https",
      },
      {
        hostname: "**.spotifycdn.com",
        protocol: "https",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
