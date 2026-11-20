"use client"

import Link from "next/link"
import { Mail, MessageCircle, Phone, X } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { SiteLogo } from "@/components/layout/site-logo"
import { isActivePath, mainNav, quoteHref, siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

type MobileMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pathname: string
}

/**
 * Full-screen navy navigation for mobile and tablet.
 * Built on the shadcn Sheet (Base UI Dialog): focus trap, Esc to close,
 * body scroll lock and focus return to the menu button are handled there.
 */
export function MobileMenu({ open, onOpenChange, pathname }: MobileMenuProps) {
  const close = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 overflow-y-auto border-0 bg-navy p-0 text-white data-[side=right]:w-full data-[side=right]:border-l-0 data-[side=right]:sm:max-w-none"
      >
        <SheetTitle className="sr-only">Site menu</SheetTitle>
        <SheetDescription className="sr-only">
          Main navigation for Arunalu Products
        </SheetDescription>

        <div className="container-site flex h-16 shrink-0 items-center justify-between md:h-[72px]">
          <SiteLogo theme="dark" className="h-12 md:h-14" onClick={close} />
          <SheetClose
            className="inline-flex size-11 items-center justify-center rounded-md text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-ring/60"
            aria-label="Close menu"
          >
            <X aria-hidden className="size-6" />
          </SheetClose>
        </div>

        <nav aria-label="Mobile" className="container-site flex-1 pt-6 pb-8">
          <ul className="flex flex-col">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href)
              return (
                <li key={item.href} className="border-b border-white/10">
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-14 items-center font-heading text-2xl font-bold outline-none transition-colors focus-visible:text-teal",
                      active ? "text-teal" : "text-white hover:text-teal"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <Link
            href={quoteHref}
            onClick={close}
            className={cn(
              buttonVariants(),
              "mt-8 h-12 w-full type-button md:w-auto md:px-8"
            )}
          >
            Request a quote
          </Link>

          <ul className="mt-10 flex flex-col gap-1 text-sm text-white/75">
            <li>
              <a
                href={siteConfig.contact.phoneHref}
                className="flex min-h-11 items-center gap-3 hover:text-white"
              >
                <Phone aria-hidden className="size-4 text-teal" />
                {siteConfig.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 hover:text-white"
              >
                <MessageCircle aria-hidden className="size-4 text-teal" />
                {siteConfig.contact.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex min-h-11 items-center gap-3 break-all hover:text-white"
              >
                <Mail aria-hidden className="size-4 shrink-0 text-teal" />
                {siteConfig.contact.email}
              </a>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
