import type { Pic } from './Scroll'

/**
 * Every picture on the site, by name. `w`/`h` are the files' real pixel sizes, so next/image reserves the right space;
 * re-measure if a file is replaced.
 *
 * Two kinds (2026-11-23). The `/photos/*.webp` rows are REAL PHOTOS (founder: "use real images"), chosen by the founder
 * from a side-by-side proposal: free Unsplash License, no people, no hands, no logos. Every one has its source,
 * photographer and licence in `docs/image-credits.md`; a new photo needs a row there in the same commit. The other
 * rows are the older flat drawings (generated 2026-09-29, transparent ground), still used on pages the photos did not
 * reach (/privacy, /terms, /data-and-safety, /radlic, the 404 page and the hidden /for-schools).
 */
export const ART = {
  radlicWatch: { src: '/il-radlic-watch.webp', w: 895, h: 606 },
  radlicPractice: { src: '/il-radlic-practice.webp', w: 711, h: 889 },
  radlicReview: { src: '/il-radlic-review.webp', w: 877, h: 806 },
  radlicCalm: { src: '/il-radlic-calm.webp', w: 726, h: 745 },
  radlicChoose: { src: '/il-radlic-choose.webp', w: 797, h: 747 },
  schoolsHero: { src: '/photos/contact-schools.webp', w: 1200, h: 900, photo: true },
  schoolsPractice: { src: '/il-schools-practice.webp', w: 810, h: 447 },
  schoolsIdeas: { src: '/il-schools-ideas.webp', w: 571, h: 1089 },
  schoolsConfidence: { src: '/il-schools-confidence.webp', w: 790, h: 712 },
  schoolsTeacher: { src: '/il-schools-teacher.webp', w: 922, h: 735 },
  schoolsDevices: { src: '/il-schools-devices.webp', w: 1246, h: 557 },
  schoolsWrite: { src: '/il-schools-write.webp', w: 924, h: 406 },
  contactHero: { src: '/il-contact-hero.webp', w: 928, h: 701 },  // drawing: /data-and-safety still uses it
  contactPhoto: { src: '/photos/contact-hero.webp', w: 1200, h: 900, photo: true },
  contactSupport: { src: '/photos/contact-support.webp', w: 1200, h: 900, photo: true },
  contactPress: { src: '/photos/contact-press.webp', w: 1200, h: 900, photo: true },
  writingHero: { src: '/photos/writing-hero.webp', w: 1200, h: 900, photo: true },
  postGap: { src: '/photos/post-gap.webp', w: 1200, h: 900, photo: true },
  postCamera: { src: '/photos/post-camera.webp', w: 1200, h: 900, photo: true },
  postInvisible: { src: '/photos/post-invisible.webp', w: 1200, h: 900, photo: true },
  safetyHero: { src: '/il-safety-hero.webp', w: 517, h: 566 },
  safetyStore: { src: '/il-safety-store.webp', w: 721, h: 642 },
  safetyNever: { src: '/il-safety-never.webp', w: 1018, h: 822 },
  safetyAccess: { src: '/il-safety-access.webp', w: 1091, h: 366 },
  safetyDelete: { src: '/il-safety-delete.webp', w: 747, h: 860 },
  safetyUnfinished: { src: '/il-safety-unfinished.webp', w: 1200, h: 884 },
  homeInvisible: { src: '/il-home-invisible.webp', w: 900, h: 602 },
  privacy: { src: '/il-privacy.webp', w: 952, h: 656 },
  terms: { src: '/il-terms.webp', w: 872, h: 869 },
  aboutWhat: { src: '/photos/about-what.webp', w: 1200, h: 900, photo: true },
  aboutWhy: { src: '/photos/about-why.webp', w: 1200, h: 900, photo: true },
  aboutHow: { src: '/photos/about-how.webp', w: 1200, h: 900, photo: true },
  aboutWhere: { src: '/photos/about-where.webp', w: 1200, h: 900, photo: true },
  journeyTreasure: { src: '/photos/about-hero.webp', w: 1200, h: 900, photo: true },
  journeyAdapts: { src: '/journey-adapts.webp', w: 750, h: 1001 },
  journeySteps: { src: '/journey-steps.webp', w: 836, h: 822 },
  journeyTogether: { src: '/journey-together.webp', w: 914, h: 672 },
  journeyRules: { src: '/journey-rules.webp', w: 903, h: 872 },
  journeyNext: { src: '/journey-next.webp', w: 638, h: 538 },
} satisfies Record<string, Pic>

/** One wide photo under each research section's heading on /why-visual-learning, by section id in content/evidence.ts. */
export const WHY_PHOTOS: Record<string, Pic> = {
  mind: { src: '/photos/why-mind.webp', w: 1600, h: 900, photo: true },
  video: { src: '/photos/why-video.webp', w: 1600, h: 900, photo: true },
  math: { src: '/photos/why-math.webp', w: 1600, h: 900, photo: true },
  medicine: { src: '/photos/why-medicine.webp', w: 1600, h: 900, photo: true },
  brain: { src: '/photos/why-brain.webp', w: 1600, h: 900, photo: true },
}

/** The cover picture for each post in content/posts.ts, by slug. */
export const POST_COVERS: Record<string, Pic> = {
  'the-gap-is-lower-than-the-grade': ART.postGap,
  'a-camera-claim-you-can-check': ART.postCamera,
  'difficulty-should-be-invisible': ART.postInvisible,
}
