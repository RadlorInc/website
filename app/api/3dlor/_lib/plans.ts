/**
 * 3Dlor prices: a rate for each video that falls with the size of the order, and add-ons.
 * ⚠️ DRAFT (founder, 23 Nov 2026; the partner has not agreed). This file is the ONLY place a price lives: the sign-up page,
 * the account page, the order route and Stripe Checkout all call `quote`. The order route saves the result on the order
 * (`build_price_cents`), and Checkout charges that saved number, never one from the browser.
 *
 * Source: video_ads/product-3d-test/PITCH-POINTS.md, "Per-video pricing with bulk rates". There is no
 * launch rate (founder, 24 Nov 2026). Fixed prices, no interest, no late fees. Never put profit numbers here; this file reaches the browser.
 */
export const RATES = [
  { from: 3, cents: 15000 },
  { from: 5, cents: 13500 },
  { from: 15, cents: 12000 },
  { from: 40, cents: 11000 },
  { from: 100, cents: 9500 },
] as const
export const MIN_VIDEOS = RATES[0].from
/** No limit on the size of an order (founder, 24 Nov 2026): from this many videos the form only asks "are you sure?". */
export const CONFIRM_FROM = 100
/** Not a business limit: Stripe refuses one card charge over this (,999.99), so half of the build must fit in it. */
export const STRIPE_MAX_CENTS = 99_999_999
export const START_VIDEOS = 10
/** One product is included for each 12 videos; one is always included. */
export const VIDEOS_PER_PRODUCT = 12
export const EXTRA_PRODUCT_CENTS = 20000
export const EXTRA_LANGUAGE_CENTS = 2000 // each video, each language after the first

/** The monthly care plan follows the size of the order. The keys are the `plan` values the database allows. */
export type PlanKey = 'basic' | 'growth' | 'pro'
export const CARE: Record<PlanKey, { from: number; cents: number; videos: string }> = {
  basic: { from: 0, cents: 14900, videos: '1 new video a month' },
  growth: { from: 40, cents: 39900, videos: '3 new videos a month' },
  pro: { from: 100, cents: 89900, videos: '8 new videos a month and a monthly problem report' },
}
export const isPlan = (v: unknown): v is PlanKey => typeof v === 'string' && Object.hasOwn(CARE, v)
const planOf = (videos: number): PlanKey => (videos >= CARE.pro.from ? 'pro' : videos >= CARE.growth.from ? 'growth' : 'basic')

export type Order = { videos: number; products: number; languages: number }

export function quote({ videos, products, languages }: Order) {
  const rate = RATES.findLast(r => videos >= r.from) ?? RATES[0]
  const included = Math.max(1, Math.floor(videos / VIDEOS_PER_PRODUCT))
  const extraProducts = Math.max(0, products - included)
  const extraLanguages = Math.max(0, languages - 1)
  const buildCents = videos * rate.cents + extraProducts * EXTRA_PRODUCT_CENTS + extraLanguages * videos * EXTRA_LANGUAGE_CENTS
  const plan = planOf(videos)
  return { rateFrom: rate.from, rateCents: rate.cents, included, extraProducts, extraLanguages, buildCents, plan, careCents: CARE[plan].cents }
}

/** A larger order that costs no more than this one (14 videos cost more than 15), or null. Never sell the dearer one quietly. */
export function cheaperAt(o: Order): number | null {
  const next = RATES.find(r => r.from > o.videos)
  return next && quote({ ...o, videos: next.from }).buildCents <= quote(o).buildCents ? next.from : null
}

/** The build is paid in two halves: one at the start (this checkout), one at delivery (PITCH-POINTS). */
export const depositCents = (buildCents: number) => Math.round(buildCents / 2)
export const balanceCents = (buildCents: number) => buildCents - depositCents(buildCents)

/** The care plan starts after this many free months. */
export const FREE_MONTHS = 3

export const payable = (buildCents: number) => depositCents(buildCents) <= STRIPE_MAX_CENTS

export const usd = (cents: number) =>
  '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: cents % 100 ? 2 : 0 })
