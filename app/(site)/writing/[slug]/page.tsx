import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import { COMPANY, SITE_URL } from '@/site'
import { body, bySlug, posts } from '@/content/posts'

export const dynamicParams = false
export const generateStaticParams = () => posts.map(p => ({ slug: p.slug }))

export async function generateMetadata({ params }: PageProps<'/writing/[slug]'>): Promise<Metadata> {
  const post = bySlug((await params).slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      // Overriding `openGraph` drops the root's file-based card; `opengraph-image.tsx` in this
      // same folder supplies the per-post one, and Next attaches it once it is not overridden here.
    },
  }
}

export default async function Article({ params }: PageProps<'/writing/[slug]'>) {
  const post = bySlug((await params).slug)
  if (!post) notFound()

  const html = await marked.parse(body(post.slug))

  return (
    <article className="relative isolate overflow-hidden">
      {/* Decorative, `aria-hidden`, behind the text — a screen reader gets the copy alone. */}
      <div className="rl-progress" aria-hidden="true" />
      <div className="rl-lightfield" aria-hidden="true">
        <div className="rl-glow rl-parallax" style={{ '--p': '30px' } as React.CSSProperties} />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20">
      <Link href="/writing" className="rl-rise rl-link text-sm text-accent">
        ← Writing
      </Link>
      <header className="mt-6">
        <time dateTime={post.date} className="rl-rise block text-sm text-muted tabular-nums" style={{ '--d': '0.08s' } as React.CSSProperties}>
          {post.date}
        </time>
        <h1 className="rl-focus font-display text-4xl sm:text-5xl leading-tight mt-2 max-w-3xl" style={{ '--d': '0.14s' } as React.CSSProperties}>{post.title}</h1>
        <p className="rl-rise mt-5 text-lg text-muted max-w-2xl leading-relaxed" style={{ '--d': '0.22s' } as React.CSSProperties}>{post.description}</p>
      </header>

      {/* The one raw-HTML write on the site, and it is unavoidable: rendering markdown IS
          producing HTML. The input is our own `content/posts/*.md`, never anything a visitor
          supplies — the moment that stops being true this needs sanitizing.
          ⚠️ The JSON-LD blocks deliberately do NOT use this. React escapes `</script>` inside a
          text child while leaving the JSON byte-identical, so `<script …>{json}</script>` is both
          safe and correct — measured, not assumed. The app repo gates on exactly this. */}
      <div className="rl-prose prose mt-12" dangerouslySetInnerHTML={{ __html: html }} />

      <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [{
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.updated ?? post.date,
            mainEntityOfPage: `${SITE_URL}/writing/${post.slug}`,
            author: { '@type': 'Organization', name: COMPANY, url: SITE_URL },
            publisher: { '@id': `${SITE_URL}/#organization` },
            }, {
              // So a result shows `radlor.com › Writing › …` instead of a raw URL.
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Writing', item: `${SITE_URL}/writing` },
                { '@type': 'ListItem', position: 3, name: post.title },
              ],
            }],
          })}</script>
      </div>
    </article>
  )
}
