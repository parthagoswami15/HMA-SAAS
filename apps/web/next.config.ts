import type { NextConfig } from "next";
import path from "path";

const resolveFromCwd = (p: string) => path.resolve(process.cwd(), p);

const nextConfig: NextConfig = {
  eslint: {
    // Prevent ESLint warnings from failing production builds
    ignoreDuringBuilds: true,
  },
  experimental: ((): any => {
    (process.env as any).NEXT_DISABLE_PACKAGE_IMPORT_OPTIMIZATION = '1';
    return { optimizePackageImports: [] } as any;
  })(),
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Alias Tabler icons to local shim to avoid optimizer issues
      '@tabler/icons-react': resolveFromCwd('src/shims/tabler-icons'),
      // use real mantine packages
    };
    return config;
  },
};

export default nextConfig;
