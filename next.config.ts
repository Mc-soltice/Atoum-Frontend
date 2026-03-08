/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: "https",
        hostname: '**.trycloudflare.com',
        pathname: "/storage/**",
      },
    ],
    qualities: [60, 70, 75, 80],
  },

};

module.exports = nextConfig;
