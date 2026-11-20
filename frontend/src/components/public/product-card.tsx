import Image from "next/image"
import Link from "next/link"

import { CtaLink } from "@/components/public/cta-link"
import {
  availabilityLabel,
  productHref,
  requestOrderHref,
  type CatalogProduct,
} from "@/features/products/catalog"
import { cn } from "@/lib/utils"

type ProductCardProps = {
  product: CatalogProduct
  className?: string
  sizes?: string
}

/**
 * Figma "Product Card": 4:5 photo with category chip, category, name,
 * pack size + availability, "Request order" and "View details".
 * Whole card is clickable (stretched link); the two actions sit above it.
 * Hover: teal border, elevated shadow, image zoom.
 */
export function ProductCard({
  product,
  className,
  sizes = "(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw",
}: ProductCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-line bg-white transition-[border-color,box-shadow] duration-150 hover:border-teal hover:shadow-[0_16px_40px_-12px_rgb(11_31_51/0.25)] has-focus-visible:border-teal motion-reduce:transition-none",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <span className="absolute top-4 left-4 rounded-sm bg-white px-2.5 py-1.5 type-overline text-navy">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <p className="type-overline text-teal-strong">{product.category}</p>
        <h3 className="type-h4 text-navy">
          <Link
            href={productHref(product.slug)}
            className="outline-none after:absolute after:inset-0 after:z-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-ink-muted">
          Pack size {product.packSize} · {availabilityLabel}
        </p>
        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-2">
          <CtaLink href={requestOrderHref(product.slug)} variant="dark" className="px-5">
            Request order
          </CtaLink>
          <CtaLink href={productHref(product.slug)} variant="text">
            View details
          </CtaLink>
        </div>
      </div>
    </article>
  )
}
