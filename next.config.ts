import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/scroll-animation-hero",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
