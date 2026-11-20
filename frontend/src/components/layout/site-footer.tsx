import Link from "next/link"
import { ChevronDown, Mail, MapPin, MessageCircle, Phone } from "lucide-react"

import { SiteLogo } from "@/components/layout/site-logo"
import {
  footerColumns,
  legalLinks,
  siteConfig,
  type FooterColumn,
} from "@/config/site"

const linkClass =
  "rounded-sm text-sm text-white/75 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:ring-3 focus-visible:ring-ring/60"

function ColumnLinks({ column }: { column: FooterColumn }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {column.links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={linkClass}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function ContactList() {
  const { contact } = siteConfig
  const rows = [
    { icon: Mail, label: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: contact.phoneDisplay, href: contact.phoneHref },
    {
      icon: MessageCircle,
      label: contact.whatsappDisplay,
      href: contact.whatsappHref,
      external: true,
    },
    { icon: MapPin, label: contact.address },
  ]
  return (
    <ul className="flex flex-col gap-3.5">
      {rows.map(({ icon: Icon, label, href, external }) => (
        <li key={label} className="flex items-start gap-2.5">
          <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-teal" />
          {href ? (
            <a
              href={href}
              className={`${linkClass} ${href.startsWith("mailto:") ? "[overflow-wrap:anywhere]" : ""}`}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {label}
            </a>
          ) : (
            <address className="text-sm not-italic text-white/75">
              {label}
            </address>
          )}
        </li>
      ))}
    </ul>
  )
}

/** Public site footer (navy). Link columns collapse into accordions below 768px. */
export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-site pt-16 pb-10 md:pt-20 xl:pt-24">
        <div className="grid gap-10 md:grid-cols-4 md:gap-12 xl:grid-cols-[minmax(0,380px)_repeat(3,minmax(0,1fr))_minmax(0,280px)] xl:gap-16">
          {/* Brand */}
          <div className="flex flex-col gap-5 md:col-span-4 xl:col-span-1">
            <SiteLogo theme="dark" className="h-20" />
            <p className="font-heading text-[22px] leading-snug font-bold uppercase">
              Precision in processing.
              <br />
              Quality in every pack.
            </p>
            <p className="max-w-sm text-sm text-white/60">
              {siteConfig.description}
            </p>
          </div>

          {/* Link columns — tablet / desktop */}
          {footerColumns.map((column) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className="hidden md:block"
            >
              <h2 className="mb-4 type-overline font-sans text-sand">
                {column.title}
              </h2>
              <ColumnLinks column={column} />
            </nav>
          ))}

          {/* Link columns — mobile accordions */}
          <div className="divide-y divide-white/10 border-y border-white/10 md:hidden">
            {footerColumns.map((column) => (
              <details key={column.title} className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between type-overline text-sand outline-none focus-visible:ring-3 focus-visible:ring-ring/60 [&::-webkit-details-marker]:hidden">
                  {column.title}
                  <ChevronDown
                    aria-hidden
                    className="size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  />
                </summary>
                <nav aria-label={column.title} className="pb-5">
                  <ColumnLinks column={column} />
                </nav>
              </details>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h2 className="mb-4 type-overline font-sans text-sand">Contact</h2>
            <ContactList />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/12 pt-8 text-[13px] text-white/55 md:mt-16 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Arunalu Products. All rights reserved.</p>
          <ul className="flex gap-6">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-sm outline-none hover:text-white focus-visible:text-white focus-visible:ring-3 focus-visible:ring-ring/60"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
