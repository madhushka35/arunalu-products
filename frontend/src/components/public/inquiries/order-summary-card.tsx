import Image from "next/image"
import { Info } from "lucide-react"

import { siteConfig } from "@/config/site"
import { formatQuantity, labelOf, packagingOptions } from "@/features/inquiries/options"
import type { CatalogProduct } from "@/features/products/catalog"

/** Figma "Request Summary" card (desktop/tablet order request). */
export function OrderSummaryCard({
  product,
  quantity,
  unit,
  packaging,
}: {
  product?: CatalogProduct
  quantity: string
  unit: string
  packaging: string
}) {
  const rows = [
    ["Quantity", quantity ? formatQuantity(quantity, unit) : "—"],
    ["Packaging", packaging ? labelOf(packagingOptions, packaging) : "—"],
  ]
  return (
    <aside aria-label="Your request" className="flex flex-col gap-4 rounded-xl border border-line bg-white p-7">
      <p className="type-overline text-teal-strong">Your request</p>
      <div className="flex items-center gap-3.5">
        <span className="relative size-[72px] shrink-0 overflow-hidden rounded-md bg-surface">
          {product && <Image src={product.image} alt="" fill sizes="72px" className="object-cover" />}
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-navy">{product ? `${product.name} ${product.packSize}` : "No product selected"}</span>
          {product && <span className="text-[13px] text-ink-muted">{product.category}</span>}
        </span>
      </div>
      <dl className="border-t border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-4 border-b border-line py-3 text-sm">
            <dt className="w-[110px] shrink-0 text-ink-muted">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="flex items-start gap-2.5 rounded-md bg-sand/45 p-3.5 text-[13px] text-ink">
        <Info aria-hidden className="mt-px size-4 shrink-0 text-warning-strong" />
        This is an order request — not a confirmed or paid order. No payment is taken on this website.
      </p>
      <p className="text-[13px] text-ink-muted">
        Questions? {siteConfig.contact.email} · WhatsApp {siteConfig.contact.phoneDisplay}
      </p>
    </aside>
  )
}
