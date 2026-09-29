import type { Pic } from './Scroll'

/**
 * Every illustration on the site, by name. Flat 2D, transparent ground, one style (generated 2026-09-29 to the
 * founder's brief: no metallic renders; since 2026-09-29 no people at all — objects that draw each section's words). `w`/`h` are the files' real pixel
 * sizes, so next/image reserves the right space; re-measure if a file is replaced.
 */
export const ART = {
  radlicWatch: { src: '/il-radlic-watch.webp', w: 895, h: 606 },
  radlicPractice: { src: '/il-radlic-practice.webp', w: 711, h: 889 },
  radlicReview: { src: '/il-radlic-review.webp', w: 877, h: 806 },
  radlicCalm: { src: '/il-radlic-calm.webp', w: 726, h: 745 },
  radlicChoose: { src: '/il-radlic-choose.webp', w: 797, h: 747 },
  schoolsHero: { src: '/il-schools-hero.webp', w: 994, h: 558 },
  schoolsPractice: { src: '/il-schools-practice.webp', w: 810, h: 447 },
  schoolsIdeas: { src: '/il-schools-ideas.webp', w: 571, h: 1089 },
  schoolsConfidence: { src: '/il-schools-confidence.webp', w: 790, h: 712 },
  schoolsTeacher: { src: '/il-schools-teacher.webp', w: 922, h: 735 },
  schoolsDevices: { src: '/il-schools-devices.webp', w: 1246, h: 557 },
  schoolsWrite: { src: '/il-schools-write.webp', w: 924, h: 406 },
  contactHero: { src: '/il-contact-hero.webp', w: 928, h: 701 },
  contactSupport: { src: '/il-contact-support.webp', w: 824, h: 754 },
  contactPress: { src: '/il-contact-press.webp', w: 914, h: 586 },
  writingHero: { src: '/il-writing-hero.webp', w: 836, h: 1004 },
  postGap: { src: '/il-post-gap.webp', w: 910, h: 739 },
  postCamera: { src: '/il-post-camera.webp', w: 675, h: 796 },
  postInvisible: { src: '/il-post-invisible.webp', w: 885, h: 482 },
  safetyHero: { src: '/il-safety-hero.webp', w: 517, h: 566 },
  safetyStore: { src: '/il-safety-store.webp', w: 721, h: 642 },
  safetyNever: { src: '/il-safety-never.webp', w: 1018, h: 822 },
  safetyAccess: { src: '/il-safety-access.webp', w: 1091, h: 366 },
  safetyDelete: { src: '/il-safety-delete.webp', w: 747, h: 860 },
  safetyUnfinished: { src: '/il-safety-unfinished.webp', w: 1200, h: 884 },
  homeInvisible: { src: '/il-home-invisible.webp', w: 900, h: 602 },
  privacy: { src: '/il-privacy.webp', w: 952, h: 656 },
  terms: { src: '/il-terms.webp', w: 872, h: 869 },
  aboutWhat: { src: '/about-what.webp', w: 962, h: 637 },
  aboutWhy: { src: '/about-why.webp', w: 1024, h: 847 },
  aboutHow: { src: '/about-how.webp', w: 804, h: 723 },
  aboutWhere: { src: '/about-where.webp', w: 729, h: 791 },
  journeyTreasure: { src: '/journey-treasure.webp', w: 713, h: 769 },
  journeyAdapts: { src: '/journey-adapts.webp', w: 750, h: 1001 },
  journeySteps: { src: '/journey-steps.webp', w: 836, h: 822 },
  journeyTogether: { src: '/journey-together.webp', w: 914, h: 672 },
  journeyRules: { src: '/journey-rules.webp', w: 903, h: 872 },
  journeyNext: { src: '/journey-next.webp', w: 638, h: 538 },
} satisfies Record<string, Pic>

/** The cover picture for each post in content/posts.ts, by slug. */
export const POST_COVERS: Record<string, Pic> = {
  'the-gap-is-lower-than-the-grade': ART.postGap,
  'a-camera-claim-you-can-check': ART.postCamera,
  'difficulty-should-be-invisible': ART.postInvisible,
}
