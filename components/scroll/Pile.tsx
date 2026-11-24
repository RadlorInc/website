import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { PathRow } from './Scroll'

/** Paper sheets that pile up as the page scrolls (CSS only, `.pile`): one idea and one picture per sheet. */
export function Pile({ rows }: { rows: PathRow[] }) {
  return (
    <ol className="pile mt-10">
      {rows.map((r, i) => (
        <li key={r.title} style={{ '--i': i } as CSSProperties}>
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">{r.title}</h2>
            <div className="mt-4 max-w-[28rem] text-lg leading-relaxed text-[#54524c]">{r.body}</div>
          </div>
          <Image src={r.src} alt="" width={r.w} height={r.h} sizes="(max-width: 900px) 90vw, 480px" className="max-h-[46svh] w-full object-cover" />
        </li>
      ))}
    </ol>
  )
}
