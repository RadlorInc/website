import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The product page moved when the product was renamed (AdaptiveLearn → Radlic, 2026-09-24/25). A 308 keeps every
  // old link and search result working and tells search engines the move is permanent.
  async redirects() {
    return [{ source: "/adaptivelearn", destination: "/radlic", permanent: true }];
  },
};

export default nextConfig;
