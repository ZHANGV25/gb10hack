import type { NextConfig } from "next";

// PAGES_BASE=/gb10hack npm run build → static export for GitHub Pages.
// Unset in local dev so `next dev` / `next start` behave normally.
const pagesBase = process.env.PAGES_BASE;

const nextConfig: NextConfig =
  pagesBase !== undefined
    ? { output: "export", basePath: pagesBase, trailingSlash: true }
    : {};

export default nextConfig;
