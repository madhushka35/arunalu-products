import { CtaLink } from "@/components/public/cta-link"
import { quoteHref } from "@/config/site"

/** Figma "Product Inquiry CTA" (sand band, desktop products page). */
export function ProductInquiryCta({ className }: { className?: string }) {
  return (
    <section aria-labelledby="product-cta-title" className={className}>
      <div className="bg-sand">
        <div className="container-site flex flex-col gap-8 py-[72px] xl:flex-row xl:items-center xl:gap-12">
          <div className="flex flex-1 flex-col gap-3">
            <h2 id="product-cta-title" className="type-h2 text-navy">
              Can&apos;t find what you need?
            </h2>
            <p className="text-lg leading-relaxed text-ink/75">
              Tell us the product, quantity and packaging you need and Arunalu Products will get
              back to you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CtaLink href={quoteHref} variant="dark" icon>
              Request a quote
            </CtaLink>
            <CtaLink href="/export-inquiry" variant="outline">
              Export inquiry
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  )
}
