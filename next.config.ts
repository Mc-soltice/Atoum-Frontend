/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 🔹 Local dev
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      // 🔹 Production via ngrok
      {
        protocol: "https",
        hostname: "kecia-orthostyle-dayna.ngrok-free.dev",
        pathname: "/**",
      },
    ],
    qualities: [60, 70, 75, 80],
  },

  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

module.exports = nextConfig;
