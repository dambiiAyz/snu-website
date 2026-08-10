const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'i.ibb.co',
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: 'res.cloudinary.com',
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: 'lh3.googleusercontent.com',
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdnp.cody.mn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.cody.mn",
        pathname: "/**",
      }
    ],
  },
}

module.exports = nextConfig
