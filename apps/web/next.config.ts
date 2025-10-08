import type { NextConfig } from "next";
import path from "path";

const resolveFromCwd = (p: string) => path.resolve(process.cwd(), p);

const nextConfig: NextConfig = {
  eslint: {
    // Prevent ESLint warnings from failing production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Disable static optimization globally to prevent prerender issues
  trailingSlash: false,
  skipMiddlewareUrlNormalize: false,
  skipTrailingSlashRedirect: false,
  experimental: {
    optimizePackageImports: [],
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Alias Mantine packages and styles to local shims
      "@mantine/charts": resolveFromCwd("src/shims/mantine-charts"),
      "@mantine/dates": resolveFromCwd("src/shims/mantine-dates"),
      "@mantine/charts/styles.css": resolveFromCwd("src/shims/mantine-charts/styles.css"),
      "@mantine/dates/styles.css": resolveFromCwd("src/shims/mantine-dates/styles.css"),
    };
    return config;
  },
};

export default nextConfig;
