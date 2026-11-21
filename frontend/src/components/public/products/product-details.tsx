import { CircleCheck, ShieldCheck } from "lucide-react"

import { CtaLink } from "@/components/public/cta-link"
import { availabilityLabel, type CatalogProduct } from "@/features/products/catalog"
import { cn } from "@/lib/utils"

/** Figma "Availability" chip (+ lead-time note when not compact). */
export function AvailabilityBadge({ compact }: { compact?: boolean }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="inline-flex items-center gap-2 rounded-sm bg-teal/14 px-3 py-1.5 text-sm font-medium text-teal-strong">
        <CircleCheck aria-hidden className="size-4" />
        {availabilityLabel}
      </span>
      {!compact && (
        <p className="text-sm text-ink-muted">
          Lead time and minimum order are confirmed when you request an order.
        </p>
      )}
    </div>
  )
}

/** Figma "Product Details (verified fields only)": Category, Pack size, Availability. */
export function SpecRows({ product, className }: { product: CatalogProduct; className?: string }) {
  const rows = [
    ["Category", product.category],
    ["Pack size", `${product.packSize} net weight (as printed on the pack)`],
    ["Availability", availabilityLabel],
  ]
  return (
    <dl className={cn("border-t border-line", className)}>
      {rows.map(([k, v]) => (
        <div key={k} className="flex gap-6 border-b border-line py-3.5 text-sm">
          <dt className="w-[100px] shrink-0 text-ink-muted md:w-[200px]">{k}</dt>
          <dd className="text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export const exportInquiryHref = (slug: string) =>
  `/export-inquiry?product=${encodeURIComponent(slug)}`

/** "No account or payment needed" note under the actions. */
export function NoAccountNote() {
  return (
    <p className="flex items-center gap-2 text-[13px] text-ink-muted">
      <ShieldCheck aria-hidden className="size-4 shrink-0" />
      No account or payment needed — order requests are reviewed by Arunalu Products.
    </p>
  )
}

/** Mobile "Sticky Action Bar" (Request order + Export inquiry). */
export function MobileActionBar({
  requestHref,
  exportHref,
}: {
  requestHref: string
  exportHref: string
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2.5 border-t border-line bg-white px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:hidden">
      <CtaLink href={requestHref} className="flex-1 px-4">
        Request order
      </CtaLink>
      <CtaLink href={exportHref} variant="outline" className="px-4">
        Export inquiry
      </CtaLink>
    </div>
  )
}
