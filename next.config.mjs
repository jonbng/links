import MillionLint from "@million/lint";
import NextBundleAnalyzer from "@next/bundle-analyzer";
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  productionBrowserSourceMaps: true,
};
const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(MillionLint.next({
  enabled: true,
  rsc: true,
})(nextConfig));
