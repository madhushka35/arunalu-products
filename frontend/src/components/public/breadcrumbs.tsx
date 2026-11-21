import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export type Crumb = { label: string; href?: string }

type BreadcrumbsProps = {
  items: Crumb[]
  /** White text for navy page heroes. */
  dark?: boolean
  className?: string
  /** Emit schema.org BreadcrumbList JSON-LD (design handoff requirement). */
  structuredData?: boolean
}

/** Figma "Breadcrumb": Body/Caption, chevron separators, last item current. */
export function Breadcrumbs({ items, dark, className, structuredData = true }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, siteConfig.url).toString() } : {}),
    })),
  }
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-[13px]">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/60",
                    dark ? "text-white/60 hover:text-white" : "text-ink-muted hover:text-navy"
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={dark ? "text-white" : "text-navy"}
                >
                  {item.label}
                </span>
              )}
              {!last && (
                <ChevronRight
                  aria-hidden
                  className={cn("size-3.5", dark ? "text-white/50" : "text-ink-muted")}
                />
              )}
            </li>
          )
        })}
      </ol>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
    </nav>
  )
}
