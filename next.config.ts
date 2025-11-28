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
};

export default nextConfig;
