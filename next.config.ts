/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
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
      {
        protocol: "https",
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: "https",
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: "https",
        hostname: 'google.com',
      },
    ],
    qualities: [60, 70, 75, 80],
  },

};

module.exports = nextConfig;
