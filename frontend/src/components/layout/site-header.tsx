"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { ProductsMegaMenu } from "@/components/layout/products-mega-menu"
import { SiteLogo } from "@/components/layout/site-logo"
import { isActivePath, mainNav, quoteHref } from "@/config/site"
import { useScrolled } from "@/hooks/use-scrolled"
import { cn } from "@/lib/utils"

/**
 * Public site header.
 * - Desktop (≥1280px): 88px, full navigation + Products mega menu + quote button.
 * - Tablet (768–1279px): 72px, logo + quote button + menu button.
 * - Mobile (<768px): 64px, logo + menu button.
 * On the homepage it overlays the hero (transparent, white text) and turns solid
 * white with a bottom border after 80px of scroll. Other pages: always solid, sticky.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const scrolled = useScrolled(80)

  // Menus are keyed to the pathname they were opened on, so they close on navigation.
  const [megaFor, setMegaFor] = React.useState<string | null>(null)
  const [mobileFor, setMobileFor] = React.useState<string | null>(null)
  const megaOpen = megaFor === pathname
  const mobileOpen = mobileFor === pathname

  const setMegaOpen = React.useCallback(
    (open: boolean) => setMegaFor(open ? pathname : null),
    [pathname]
  )
  const setMobileOpen = React.useCallback(
    (open: boolean) => setMobileFor(open ? pathname : null),
    [pathname]
  )

  const transparent = isHome && !scrolled && !megaOpen
  const tone = transparent ? "light" : "dark"

  const linkClassName = cn(
    "relative inline-flex h-11 items-center rounded-sm text-[13px] font-semibold uppercase tracking-[0.06em] outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/60",
    "after:absolute after:inset-x-0 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-teal after:transition-transform after:duration-200 data-[active]:after:scale-x-100 motion-reduce:after:transition-none",
    transparent
      ? "text-white hover:text-teal"
      : "text-navy hover:text-teal-strong"
  )

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-200 motion-reduce:transition-none",
        isHome ? "fixed" : "sticky",
        transparent
          ? "bg-transparent"
          : "bg-white shadow-[0_1px_0_var(--color-line)]"
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-6 md:h-[72px] xl:h-[88px]">
        <SiteLogo
          theme={transparent ? "dark" : "light"}
          priority
          className="h-12 md:h-14 xl:h-16"
        />

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden h-full xl:block">
          <ul className="flex h-full items-center gap-[26px]">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href)
              if (item.href === "/products") {
                return (
                  <ProductsMegaMenu
                    key={item.href}
                    open={megaOpen}
                    onOpenChange={setMegaOpen}
                    tone={tone}
                    active={active}
                    linkClassName={linkClassName}
                  />
                )
              }
              return (
                <li key={item.href} className="flex h-full items-center">
                  <Link
                    href={item.href}
                    className={linkClassName}
                    aria-current={active ? "page" : undefined}
                    data-active={active || undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={quoteHref}
            className={cn(
              buttonVariants(),
              "hidden h-11 px-5 type-button md:inline-flex"
            )}
          >
            Request a quote
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-haspopup="dialog"
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/60 xl:hidden",
              transparent
                ? "text-white hover:bg-white/10"
                : "text-navy hover:bg-surface"
            )}
          >
            <Menu aria-hidden className="size-6" />
          </button>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        pathname={pathname}
      />
    </header>
  )
}
