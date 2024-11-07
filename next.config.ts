import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn2.thecatapi.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "*.media.tumblr.com",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
