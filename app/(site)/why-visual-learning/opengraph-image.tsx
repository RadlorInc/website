// The site's share card. A page that sets its own `openGraph` metadata loses the inherited image, so it re-exports it.
export { default, size, contentType, alt } from '@/app/opengraph-image'
