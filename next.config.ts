/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
        domains: [
      'unsubscribe-allergy-turned-inspection.trycloudflare.com',
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: '**.trycloudflare.com',
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
