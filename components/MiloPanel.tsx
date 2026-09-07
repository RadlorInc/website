import Image from 'next/image'

/**
 * A dark band carrying the Milo mascot beside a line of copy.
 *
 * ⚠️ THIS EXISTS TO STOP THE SAME TWENTY LINES BEING PASTED ONTO EIGHT PAGES, and that is the only
 * reason it exists. It is not the start of a component library — `CLAUDE.md` says ship the small
 * version, and a second component should not appear here unless it is earning its keep the same
 * way this one is.
 *
 * Two rules are baked in rather than left to each caller, because each was got wrong once already:
 *
 * ⚠️ `rl-dark` PINS THE PANEL DARK IN BOTH THEMES. Every mascot render is on a PURE BLACK ground,
 * and the site has a light theme (#f5f8fc) where a black-backed image reads as a black rectangle.
 * The wordmark has exactly this property and the header solves it exactly this way.
 *
 * ⚠️ `rl-onblack` IS `mix-blend-mode: screen`, AND IT IS ARITHMETIC, NOT TASTE. #000 against the
 * panel's #070b11 looks identical in a swatch and does NOT on screen — the image's own box shows
 * as a darker rectangle around the robot. screen(base, 0) === base, so black resolves to whatever
 * the panel is painted and the seam cannot exist. It only works on a dark ground, which is why it
 * is welded to `rl-dark` here instead of being a class a caller can forget.
 *
 * ⚠️ THE IMAGE IS ALWAYS DECORATIVE — `alt=""` plus `aria-hidden`. The children beside it carry
 * the meaning, so announcing the mascot would hand a screen reader a noun it cannot act on. If a
 * mascot image ever becomes the ONLY carrier of a fact, it needs a real alt and this component is
 * the wrong tool for it.
 */
export function MiloPanel({
  src,
  width,
  height,
  children,
  priority = false,
  size = 'md',
}: {
  src: string
  width: number
  height: number
  children: React.ReactNode
  /** Set on a panel that is above the fold — otherwise it lazy-loads and the panel sits empty. */
  priority?: boolean
  size?: 'sm' | 'md'
}) {
  const img = size === 'sm' ? 'w-28 sm:w-36' : 'w-44 sm:w-60'
  return (
    <div className="rl-dark rl-rise rounded-2xl border border-line overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-9 p-7 sm:p-9">
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          priority={priority}
          className={`rl-onblack ${img} h-auto shrink-0`}
        />
        <div className="text-center sm:text-left leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
