import type { NextConfig } from "next";
import path from "path";

// Convert Windows paths to POSIX for Turbopack compatibility
const sharedDir = path.resolve(process.cwd(), "../shared").split(path.sep).join("/");

const nextConfig: NextConfig = {
  // Turbopack config (Next.js 16+ default bundler)
  turbopack: {
    resolveAlias: {
      "@shared/types": `${sharedDir}/types/index.ts`,
      "@shared/types/*": `${sharedDir}/types/*`,
      "@shared/constants": `${sharedDir}/constants.ts`,
      "@shared/utils": `${sharedDir}/utils.ts`,
      "@shared/validators": `${sharedDir}/validators.ts`,
      "@shared/mock-data": `${sharedDir}/mock-data.ts`,
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
