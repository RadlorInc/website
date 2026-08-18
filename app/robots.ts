import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/site'

/**
 * The whole site is public and meant to be read — by crawlers and by answer engines alike. There is
 * nothing to hide here, so the policy is "everything", stated explicitly rather than left implicit.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
