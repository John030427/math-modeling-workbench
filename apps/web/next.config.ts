import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@math-modeling/ui"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
