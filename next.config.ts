/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "kecia-orthostyle-dayna.ngrok-free.dev",
        pathname: "/storage/**",
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
