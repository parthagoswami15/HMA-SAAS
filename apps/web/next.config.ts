import type { NextConfig } from "next";
import path from "path";

const resolveFromCwd = (p: string) => path.resolve(process.cwd(), p);

const nextConfig: NextConfig = {
  eslint: {
    // Prevent ESLint warnings from failing production builds
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Disable package import optimizer to allow our webpack aliases/shims
    optimizePackageImports: [],
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Use trailing $ so only bare imports are aliased, keeping CSS subpaths intact
      '@tabler/icons-react$': resolveFromCwd('src/shims/tabler-icons'),
      '@mantine/charts$': resolveFromCwd('src/shims/mantine-charts'),
      '@mantine/dates$': resolveFromCwd('src/shims/mantine-dates'),
    };
    return config;
  },
};

export default nextConfig;
