/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",   // ✅ Required for EC2 deployment

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

  // ✅ API proxy only for local development
  // ❗ This does NOT affect production
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5500/api/:path*",
      },
    ];
  },
};

export default nextConfig;
