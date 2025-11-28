import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kzarre-products.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kzarre-products.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },

  // ✅ ✅ ✅ API PROXY (FIXES COOKIE ISSUE ON LOCALHOST)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5500/api/:path*", // ✅ your backend
      },
    ];
  },
};

export default nextConfig;
