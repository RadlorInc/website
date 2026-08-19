import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/site'

/**
 * The whole site is public and meant to be read — by search crawlers and by answer engines alike.
 *
 * ⚠️ THE `*` RULE DELIBERATELY INCLUDES THE AI CRAWLERS. DO NOT "HARDEN" THIS BY BLOCKING THEM.
 * Being cited by an answer engine is the entire GEO strategy, and these are the agents that decide
 * it: GPTBot / OAI-SearchBot / ChatGPT-User (OpenAI) · ClaudeBot / Claude-SearchBot (Anthropic) ·
 * PerplexityBot · Google-Extended (Gemini — a SEPARATE token from Googlebot, and opt-OUT only, so
 * silence here means allowed) · Applebot-Extended · CCBot (Common Crawl).
 *
 * Blocking them protects nothing a public marketing site has; it only removes Radlor from the
 * answers. If that ever becomes the wanted trade, add the disallows here and say so in
 * `docs/seo-geo-setup.md` §D3 — do not leave the two disagreeing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
