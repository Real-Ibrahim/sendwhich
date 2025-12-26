import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allowed built image qualities - include 90 for background image
    qualities: [75, 90],
  },
};

export default nextConfig;
