import type { Pic } from './Scroll'

/**
 * Every illustration on the site, by name. Flat 2D, transparent ground, one style (generated 2026-09-29 to the
 * founder's brief: no metallic renders, men and boys only, full-length trousers). `w`/`h` are the files' real pixel
 * sizes, so next/image reserves the right space; re-measure if a file is replaced.
 */
export const ART = {
  radlicWatch: { src: '/il-radlic-watch.webp', w: 979, h: 842 },
  radlicPractice: { src: '/il-radlic-practice.webp', w: 692, h: 834 },
  radlicReview: { src: '/il-radlic-review.webp', w: 785, h: 872 },
  radlicCalm: { src: '/il-radlic-calm.webp', w: 849, h: 736 },
  radlicChoose: { src: '/il-radlic-choose.webp', w: 802, h: 837 },
  schoolsHero: { src: '/il-schools-hero.webp', w: 886, h: 655 },
  schoolsPractice: { src: '/il-schools-practice.webp', w: 764, h: 805 },
  schoolsIdeas: { src: '/il-schools-ideas.webp', w: 406, h: 870 },
  schoolsConfidence: { src: '/il-schools-confidence.webp', w: 758, h: 805 },
  schoolsTeacher: { src: '/il-schools-teacher.webp', w: 709, h: 632 },
  schoolsDevices: { src: '/il-schools-devices.webp', w: 1006, h: 541 },
  schoolsWrite: { src: '/il-schools-write.webp', w: 873, h: 858 },
  contactHero: { src: '/il-contact-hero.webp', w: 832, h: 805 },
  contactSupport: { src: '/il-contact-support.webp', w: 890, h: 762 },
  contactPress: { src: '/il-contact-press.webp', w: 926, h: 803 },
  writingHero: { src: '/il-writing-hero.webp', w: 604, h: 764 },
  postGap: { src: '/il-post-gap.webp', w: 1025, h: 1015 },
  postCamera: { src: '/il-post-camera.webp', w: 746, h: 608 },
  postInvisible: { src: '/il-post-invisible.webp', w: 904, h: 741 },
  safetyHero: { src: '/il-safety-hero.webp', w: 737, h: 666 },
  safetyStore: { src: '/il-safety-store.webp', w: 721, h: 642 },
  safetyNever: { src: '/il-safety-never.webp', w: 842, h: 656 },
  safetyAccess: { src: '/il-safety-access.webp', w: 932, h: 574 },
  safetyDelete: { src: '/il-safety-delete.webp', w: 650, h: 724 },
  safetyUnfinished: { src: '/il-safety-unfinished.webp', w: 944, h: 613 },
  homeInvisible: { src: '/il-home-invisible.webp', w: 877, h: 823 },
  privacy: { src: '/il-privacy.webp', w: 928, h: 594 },
  terms: { src: '/il-terms.webp', w: 769, h: 786 },
  aboutWhat: { src: '/about-what.webp', w: 906, h: 717 },
  aboutWhy: { src: '/about-why.webp', w: 878, h: 737 },
  aboutHow: { src: '/about-how.webp', w: 764, h: 814 },
  aboutWhere: { src: '/about-where.webp', w: 661, h: 675 },
  journeyTreasure: { src: '/journey-treasure.webp', w: 835, h: 701 },
  journeyAdapts: { src: '/journey-adapts.webp', w: 576, h: 789 },
  journeySteps: { src: '/journey-steps.webp', w: 850, h: 806 },
  journeyTogether: { src: '/journey-together.webp', w: 868, h: 850 },
  journeyRules: { src: '/journey-rules.webp', w: 829, h: 802 },
  journeyNext: { src: '/journey-next.webp', w: 638, h: 538 },
} satisfies Record<string, Pic>

/** The cover picture for each post in content/posts.ts, by slug. */
export const POST_COVERS: Record<string, Pic> = {
  'the-gap-is-lower-than-the-grade': ART.postGap,
  'a-camera-claim-you-can-check': ART.postCamera,
  'difficulty-should-be-invisible': ART.postInvisible,
}
