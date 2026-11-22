/**
 * The 3D video packages. ⚠️ DRAFT PRICES (founder and partner have not agreed yet, 22 Nov 2026).
 * This file is the ONLY place a price lives: the sign-up page, the account page and the Stripe
 * Checkout session all read it, and Checkout sends these amounts as inline prices, so there are no
 * Stripe price IDs to keep in step. Change a number here and the next checkout uses it.
 *
 * Source: video_ads/product-3d-test/PITCH-POINTS.md, "Packages". Fixed prices, no interest, no late fees.
 * Never put profit numbers here; this file reaches the browser.
 */
export type PlanKey = 'basic' | 'growth' | 'pro'

export const PLANS: Record<PlanKey, {
  name: string
  buildCents: number
  products: string
  videos: number
  languages: number
  careCents: number
  careVideos: string
}> = {
  basic: { name: 'Basic', buildCents: 180000, products: '1 product', videos: 15, languages: 1, careCents: 14900, careVideos: '1 new video a month' },
  growth: { name: 'Growth', buildCents: 440000, products: 'Up to 3 products', videos: 40, languages: 2, careCents: 39900, careVideos: '3 new videos a month' },
  pro: { name: 'Pro', buildCents: 950000, products: 'Up to 8 products', videos: 100, languages: 3, careCents: 89900, careVideos: '8 new videos a month and a monthly problem report' },
}
export const PLAN_KEYS = Object.keys(PLANS) as PlanKey[]
export const isPlan = (v: unknown): v is PlanKey => typeof v === 'string' && v in PLANS

/** The build is paid in two halves: one at the start (this checkout), one at delivery (PITCH-POINTS). */
export const DEPOSIT_SHARE = 0.5
export const depositCents = (p: PlanKey) => Math.round(PLANS[p].buildCents * DEPOSIT_SHARE)
export const balanceCents = (p: PlanKey) => PLANS[p].buildCents - depositCents(p)

/** The care plan starts after this many free months. */
export const FREE_MONTHS = 3

export const usd = (cents: number) =>
  '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: cents % 100 ? 2 : 0 })
