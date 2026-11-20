import { CtaLink } from "@/components/public/cta-link"
import { FeaturedProductCard } from "@/components/public/featured-product-card"
import { ProductCard } from "@/components/public/product-card"
import { Reveal } from "@/components/public/reveal"
import { SectionHeading } from "@/components/public/section-heading"
import { featured } from "@/features/home/content"
import { getProduct } from "@/features/products/catalog"

/**
 * 04 Featured Products.
 * Desktop: featured card + 3-up grid. Tablet: 2-up grid. Mobile: 2 stacked cards.
 */
export function FeaturedProductsSection() {
  const lead = getProduct(featured.featuredSlug)
  const grid = featured.gridSlugs.map(getProduct)
  const tablet = [getProduct("head-on-sprats"), getProduct("headless-sprats")]
  const mobile = featured.mobileSlugs.map(getProduct)

  return (
    <section aria-labelledby="featured-title" className="section-y bg-surface">
      <div className="container-site flex flex-col gap-8 md:gap-8 xl:gap-12">
        <Reveal className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <SectionHeading
            overline={featured.overline}
            title={featured.title}
            body={featured.body}
            id="featured-title"
            titleClassName="max-w-[640px]"
            className="hidden xl:flex"
          />
          <div className="flex flex-col gap-4 xl:hidden">
            <p className="type-overline text-teal-strong">{featured.overline}</p>
            <h2 className="type-h2 text-navy">
              {featured.titleMobile}
            </h2>
          </div>
          <CtaLink
            href={featured.cta.href}
            variant="outline"
            icon
            className="hidden xl:inline-flex"
          >
            {featured.cta.label}
          </CtaLink>
        </Reveal>

        {/* Desktop */}
        <div className="hidden flex-col gap-10 xl:flex">
          <Reveal>
            <FeaturedProductCard product={lead} />
          </Reveal>
          <ul className="grid grid-cols-3 gap-10">
            {grid.map((p, i) => (
              <Reveal as="li" index={i} key={p.slug} className="flex">
                <ProductCard product={p} className="w-full" sizes="400px" />
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Tablet */}
        <ul className="hidden grid-cols-2 gap-6 md:grid xl:hidden">
          {tablet.map((p, i) => (
            <Reveal as="li" index={i} key={p.slug} className="flex">
              <ProductCard product={p} className="w-full" sizes="50vw" />
            </Reveal>
          ))}
        </ul>

        {/* Mobile */}
        <ul className="flex flex-col gap-5 md:hidden">
          {mobile.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} sizes="100vw" />
            </li>
          ))}
        </ul>

        <CtaLink href={featured.cta.href} variant="outline" icon block className="xl:hidden">
          {featured.cta.label}
        </CtaLink>
      </div>
    </section>
  )
}
