import type { NextConfig } from "next";
import path from "path";

// Resolve shared dir for webpack aliases
const sharedDir = path.resolve(process.cwd(), "../shared");

const nextConfig: NextConfig = {
  // Transpile the shared package
  transpilePackages: ["@dapoer-ajung/shared"],

  // Use Webpack for production build (Turbopack doesn't support external modules in client chunks)
  // Turbopack is still used for `next dev` (it handles resolveAlias fine for dev server)
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

  // Turbopack config for dev server only
  turbopack: {
    resolveAlias: {
      "@shared/types": path.join(sharedDir, "types/index.ts").split(path.sep).join("/"),
      "@shared/types/*": path.join(sharedDir, "types/*").split(path.sep).join("/"),
      "@shared/constants": path.join(sharedDir, "constants.ts").split(path.sep).join("/"),
      "@shared/utils": path.join(sharedDir, "utils.ts").split(path.sep).join("/"),
      "@shared/validators": path.join(sharedDir, "validators.ts").split(path.sep).join("/"),
      "@shared/mock-data": path.join(sharedDir, "mock-data.ts").split(path.sep).join("/"),
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
