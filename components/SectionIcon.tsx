import Image from 'next/image'

/**
 * A small dark chip carrying one illustration, sitting above a section heading.
 *
 * ⚠️ THIS IS DELIBERATELY NOT `MiloPanel`, AND THE DIFFERENCE IS THE POINT. A page with a mascot
 * band under every h2 stops reading as a page and starts reading as a template — the copy is what
 * a visitor came for, and eight identical black slabs bury it. So a SECTION gets a small object
 * that says what the section is about (a lens, a key, an empty tin), and a PAGE gets at most one
 * mascot band. The mascot is a character; it should not become wallpaper.
 *
 * ⚠️ SAME TWO WELDED RULES AS `MiloPanel`, for the same reason. Every illustration is rendered on
 * a PURE BLACK ground and the site has a light theme, so the chip is `rl-dark` (pinned dark in
 * both themes, as the header and the wordmark already are) and the image is `rl-onblack`
 * (mix-blend-mode: screen — screen(base, 0) === base, so the artwork's black resolves to exactly
 * the chip colour and no seam can exist). Neither is optional and neither is left to the caller.
 *
 * ⚠️ `not-prose` MATTERS. Half these headings live inside `.rl-prose prose`, which styles bare
 * elements; without it the chip inherits paragraph spacing and colour rules meant for body copy.
 *
 * The image is always decorative — the heading it sits above already names the section, so an alt
 * would only repeat it to a screen reader.
 */
export function SectionIcon({ src }: { src: string }) {
  return (
    <div
      className="rl-dark not-prose inline-flex items-center justify-center rounded-xl border border-line w-14 h-14 mb-4"
      aria-hidden="true"
    >
      <Image src={src} alt="" width={256} height={256} className="rl-onblack w-10 h-10" />
    </div>
  )
}
