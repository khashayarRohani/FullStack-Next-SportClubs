/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = "cheap-module-source-map"; // Adjust as needed
    }
    return config;
  },
};

export default nextConfig;
