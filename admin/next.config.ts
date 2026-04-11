import type { NextConfig } from "next";
import path from "path";

// Resolve shared dir
const sharedDir = path.resolve(process.cwd(), "../shared");
const sharedDirPosix = sharedDir.split(path.sep).join("/");

const nextConfig: NextConfig = {
  // Use Webpack for production build (Turbopack doesn't support external modules in client chunks)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@shared/types": path.join(sharedDir, "types/index.ts"),
      "@shared/constants": path.join(sharedDir, "constants.ts"),
      "@shared/utils": path.join(sharedDir, "utils.ts"),
      "@shared/validators": path.join(sharedDir, "validators.ts"),
      "@shared/mock-data": path.join(sharedDir, "mock-data.ts"),
    };
    return config;
  },

  // Turbopack config for dev server
  turbopack: {
    resolveAlias: {
      "@shared/types": `${sharedDirPosix}/types/index.ts`,
      "@shared/types/*": `${sharedDirPosix}/types/*`,
      "@shared/constants": `${sharedDirPosix}/constants.ts`,
      "@shared/utils": `${sharedDirPosix}/utils.ts`,
      "@shared/validators": `${sharedDirPosix}/validators.ts`,
      "@shared/mock-data": `${sharedDirPosix}/mock-data.ts`,
    },
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
