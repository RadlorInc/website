import type { MetadataRoute } from 'next'
import { PAGES, SITE_URL } from '@/site'
import { SAMPLES, samplePath } from '@/content/samples'
import { posts } from '@/content/posts'

/** Built from `PAGES` and `posts`, so a new page cannot be added without appearing here. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map(n => ({
      url: `${SITE_URL}${n.href === '/' ? '' : n.href}`,
      changeFrequency: 'monthly' as const,
      priority: n.href === '/' ? 1 : 0.8,
    })),
    ...SAMPLES.map(s => ({ url: `${SITE_URL}${samplePath(s.id)}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...posts.map(p => ({
      url: `${SITE_URL}/writing/${p.slug}`,
      lastModified: p.updated ?? p.date,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
