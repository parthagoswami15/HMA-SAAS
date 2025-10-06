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
  experimental: ((): any => {
    // Hard-disable Next package import optimizer
    (process.env as any).NEXT_DISABLE_PACKAGE_IMPORT_OPTIMIZATION = "1";
    return { optimizePackageImports: [] } as any;
  })(),
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Alias Tabler icons to local shim to avoid optimizer issues
      "@tabler/icons-react": resolveFromCwd("src/shims/tabler-icons"),

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
