import Image from "next/image"

import { CtaLink } from "@/components/public/cta-link"
import {
  availabilityLabel,
  productHref,
  requestOrderHref,
  type CatalogProduct,
} from "@/features/products/catalog"

/**
 * Figma "Featured Product Card" (1280×520, navy): 416px product photo on the
 * left, content on the right. Stacks on tablet/mobile.
 */
export function FeaturedProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="grid overflow-hidden rounded-md bg-navy text-white md:grid-cols-[minmax(0,320px)_1fr] xl:h-[520px] xl:grid-cols-[416px_1fr]">
      <div className="relative aspect-[4/5] bg-ocean md:aspect-auto md:min-h-[400px]">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1280px) 416px, (min-width: 768px) 320px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center gap-5 p-6 md:p-10 xl:p-14">
        <p className="type-overline text-teal">Featured product</p>
        <h3 className="type-h2 text-white">{product.name}</h3>
        <p className="max-w-xl text-base leading-relaxed text-white/72">
          Pack size {product.packSize} · {availabilityLabel}.
        </p>
        <p className="type-overline text-sand">Pack size</p>
        <ul className="flex flex-wrap gap-2">
          <li className="rounded-sm border border-white/25 px-3 py-[7px] text-[13px] text-white">
            {product.packSize}
          </li>
        </ul>
        <div className="flex flex-wrap gap-3 pt-3">
          <CtaLink href={requestOrderHref(product.slug)}>Request order</CtaLink>
          <CtaLink href={productHref(product.slug)} variant="outline-light" icon>
            View details
          </CtaLink>
        </div>
      </div>
    </article>
  )
}
