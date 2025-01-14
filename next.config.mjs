import MillionLint from "@million/lint";
import NextBundleAnalyzer from "@next/bundle-analyzer";
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  productionBrowserSourceMaps: true,
};

let config = {};

const env = process.env.NODE_ENV;
if (env == "development") {
  const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
  });
  config = withBundleAnalyzer(
    MillionLint.next({
      enabled: true,
      rsc: true,
    })(nextConfig)
  );
} else {
  config = nextConfig;
}

export default config;
