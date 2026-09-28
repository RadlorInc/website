import type { NextConfig } from "next";

/**
 * Security headers on every page. The site loads nothing from another origin (check:site-claims holds that on the
 * live pages), so the policy is `'self'` everywhere, with two allowances:
 *   · `'unsafe-inline'` scripts: Next's own hydration scripts and the JSON-LD blocks are inline; a nonce would force
 *     every page to render dynamically. The site has no user input to inject.
 *   · `'unsafe-eval'` in development only: React's dev build uses eval; production never gets it.
 * HSTS stays Vercel's default: `includeSubDomains` would also bind the *.radlor.com forwards, which this repo does not
 * control. `npm run check:headers` fails if any of these goes missing from the live site.
 */
const dev = process.env.NODE_ENV !== "production";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
  // The product page moved when the product was renamed (AdaptiveLearn → Radlic, 2026-09-24/25). A 308 keeps every
  // old link and search result working and tells search engines the move is permanent.
  async redirects() {
    return [
      { source: "/adaptivelearn", destination: "/radlic", permanent: true },
      // The waitlist is no longer the way in: "Try Radlic" is (founder, N23, 2026-09-26). Exact path only — the form's
      // outcome pages /waitlist/thanks and /waitlist/problem stay, because /api/waitlist still answers old forms.
      { source: "/waitlist", destination: "/radlic", permanent: true },
    ];
  },
};

export default nextConfig;
