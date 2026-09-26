// The site's one card. /radlic sets its own `openGraph` (page.tsx), and a segment's openGraph REPLACES the root's —
// taking the root's file-based image with it — so the card is attached here again. No new artwork.
export { default, size, contentType, alt } from '../opengraph-image'
