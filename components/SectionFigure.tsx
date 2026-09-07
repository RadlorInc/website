import Image from 'next/image'

/**
 * A wide illustration that DRAWS what its section says, with a caption that says it in words.
 *
 * ⚠️ THIS IS THE THIRD AND LAST OF THESE, AND EACH ONE ANSWERS A DIFFERENT QUESTION.
 * `SectionIcon` marks what a section is about (a lens, a key). `MiloPanel` gives a page its one
 * mascot moment. This one illustrates a specific claim the copy already makes — the scaffolding
 * falling away across four chapter stages, a camera frame reduced to coordinates and discarded,
 * one locker open and four shut. If a proposed image does not draw a sentence that is already on
 * the page, it does not belong in this component; it is decoration, and it should be an icon.
 *
 * ⚠️ THE CAPTION CARRIES THE INFORMATION, THE IMAGE IS DECORATIVE, AND THAT IS DELIBERATE — it is
 * the pattern this repo already uses for the difficulty-line figure on /adaptivelearn, whose SVG
 * is `aria-hidden` with a `<figcaption>` beside it. A crawler, an answer engine and a screen
 * reader all read the caption; none of them can read a render. So the caption must state the point
 * in full rather than gesture at the picture ("A frame becomes a few coordinates", never "see the
 * diagram above").
 *
 * ⚠️ AND THE CAPTION MAY NOT INTRODUCE A CLAIM. Every one of these restates a sentence from the
 * section it sits in. A figure is the easiest place in a codebase for a new promise to appear
 * unreviewed, because it reads as an illustration rather than as copy. See CLAUDE.md, "say true
 * things".
 *
 * `rl-dark` + `rl-onblack` for the same welded reason as the other two: pure-black renders, a
 * light theme, and screen blending that only resolves the seam on a dark ground.
 */
export function SectionFigure({
  src,
  width,
  height,
  children,
}: {
  src: string
  width: number
  height: number
  /** The caption. States the point in words — this is what non-visual readers get. */
  children: React.ReactNode
}) {
  return (
    <figure className="not-prose my-9">
      <div className="rl-dark rounded-2xl border border-line overflow-hidden">
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          className="rl-onblack w-full h-auto"
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted max-w-2xl">{children}</figcaption>
    </figure>
  )
}
