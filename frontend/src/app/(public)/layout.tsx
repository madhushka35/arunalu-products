import { Suspense } from "react"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteLogo } from "@/components/layout/site-logo"

/**
 * Static stand-in shown only while the header waits for the URL
 * (e.g. future dynamic routes under Cache Components). Same height = no layout shift.
 */
function HeaderFallback() {
  return (
    <div className="sticky top-0 z-40 bg-white shadow-[0_1px_0_var(--color-line)]">
      <div className="container-site flex h-16 items-center md:h-[72px] xl:h-[88px]">
        <SiteLogo className="h-12 md:h-14 xl:h-16" />
      </div>
    </div>
  )
}

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-navy px-4 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      <Suspense fallback={<HeaderFallback />}>
        <SiteHeader />
      </Suspense>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
