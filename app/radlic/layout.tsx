/**
 * radlor.com/radlic wears the app's own faces (Fredoka, Nunito, and Gaegu for the chalk), so the page looks like the
 * product it sells. `next/font` downloads them at BUILD time and serves them from this site — nothing is fetched from
 * Google by a visitor, which is what /privacy promises.
 */
import { Fredoka, Nunito, Gaegu } from 'next/font/google'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['600', '700'], variable: '--rl-fredoka' })
const nunito = Nunito({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--rl-nunito' })
const gaegu = Gaegu({ subsets: ['latin'], weight: ['700'], variable: '--rl-gaegu' })

export default function RadlicLayout({ children }: LayoutProps<'/radlic'>) {
  return <div className={`${fredoka.variable} ${nunito.variable} ${gaegu.variable}`}>{children}</div>
}
