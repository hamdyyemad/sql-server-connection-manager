import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude msnodesqlv8 from webpack bundling on server side
      config.externals.push("msnodesqlv8");
    }
    return config;
  },
  serverExternalPackages: ["msnodesqlv8", "mssql"],
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
