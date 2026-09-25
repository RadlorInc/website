import { SiteChrome } from '@/components/SiteChrome'

/** Every company page wears the Radlor header and footer. `/radlic` sits outside this group and does not. */
export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return <SiteChrome>{children}</SiteChrome>
}
