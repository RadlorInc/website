/**
 * ⚠️ The part of the app's `src/features/lessons/chalk.ts` (RadlorInc/learn) the board needs to play: colours, the mark
 * shape and the word timing. Copied 2026-09-25 with Chalkboard.tsx; the drawing helpers stay in the app.
 */

export type ChalkColor = 'w' | 'y' | 'b' | 'r' | 'd'   // white, yellow, blue, coral, dim
export const CHALK: Record<ChalkColor, string> = { w: '#F0EBDA', y: '#F2CE6B', b: '#8AC0DB', r: '#E88E74', d: '#A9A897' }

export interface ChalkMark {
  beat: number
  /** A word of that beat's `say`: the mark goes up as she says it. None = at the start of the line. */
  at?: string
  d?: string            // a chalk line (SVG path), traced
  t?: string            // chalk writing, written letter by letter, centred on x, y
  x?: number; y?: number; s?: number
  wash?: boolean        // `d` filled with a thin wash of colour instead of traced
  c?: ChalkColor
  w?: number            // line width (default 3.4)
  /** Does not hold the hand: the next mark starts a moment later instead of waiting for this one (a clock's numbers). */
  quick?: boolean
}

/** How long a line takes to say. The same estimate paces the silent-mode beat clock, so the chalk matches either way. */
export const beatMs = (say: string) => Math.min(6500, 1500 + say.length * 55)

const norm = (w: string) => w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')

/** When, in ms into the line, `at` is said: its place among the words times the line's length. -1 = not in the line. */
export function wordMs(say: string, at?: string): number {
  if (!at) return 0
  const words = say.split(/\s+/).map(norm)
  const i = words.indexOf(norm(at))
  return i < 0 ? -1 : Math.round((i / words.length) * beatMs(say))
}
