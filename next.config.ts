import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pics.avs.io",
      },
    ],
  },
};

export default nextConfig;
