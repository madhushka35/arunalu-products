import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Breadcrumbs } from "@/components/public/breadcrumbs"
import { CtaLink } from "@/components/public/cta-link"
import { ProductCard } from "@/components/public/product-card"
import { ProductGallery } from "@/components/public/products/product-gallery"
import {
  AvailabilityBadge,
  MobileActionBar,
  NoAccountNote,
  SpecRows,
  exportInquiryHref,
} from "@/components/public/products/product-details"
import { siteConfig } from "@/config/site"
import {
  findProduct,
  getRelatedProducts,
  primaryCategorySlug,
  productHref,
  products,
  requestOrderHref,
} from "@/features/products/catalog"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = findProduct(slug)
  if (!product) return { title: "Product not found" }
  const description = `Arunalu ${product.name}, ${product.packSize} pack. ${product.category}. Available on request.`
  return {
    title: `${product.name} ${product.packSize}`,
    description,
    alternates: { canonical: productHref(product.slug) },
    openGraph: { title: `${product.name} ${product.packSize}`, description, images: [product.image] },
  }
}

/** Product details — Figma "Product Details – Desktop / Tablet (768) / Mobile". */
export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = findProduct(slug)
  if (!product) notFound()

  const related = getRelatedProducts(product.slug, 3)
  const categoryHref = `/products?category=${primaryCategorySlug(product)}`
  const requestHref = requestOrderHref(product.slug)
  const exportHref = exportInquiryHref(product.slug)

  const images = [
    { src: product.image, alt: product.imageAlt, label: "Product photo" },
    {
      src: product.originalImage,
      alt: `${product.imageAlt} — original photo`,
      label: "Original photo",
    },
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} ${product.packSize}`,
    image: images.map((i) => new URL(i.src, siteConfig.url).toString()),
    category: product.category,
    brand: { "@type": "Brand", name: siteConfig.name },
    url: new URL(productHref(product.slug), siteConfig.url).toString(),
  }

  return (
    <>
      <section aria-labelledby="product-title" className="bg-white">
        {/* Mobile: edge-to-edge swipe gallery above the content */}
        <div className="md:hidden">
          <ProductGallery images={images} name={product.name} variant="mobile" />
        </div>

        <div className="container-site flex flex-col gap-4 pt-6 pb-8 md:gap-5 md:pt-6 md:pb-12 xl:gap-10 xl:pt-8 xl:pb-24">
          <Breadcrumbs
            className="hidden md:block"
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: product.category, href: categoryHref },
              { label: product.name },
            ]}
          />
          <Breadcrumbs
            className="md:hidden"
            structuredData={false}
            items={[
              { label: "Products", href: "/products" },
              { label: product.category, href: categoryHref },
            ]}
          />

          <div className="grid gap-5 md:gap-6 xl:grid-cols-[560px_1fr] xl:gap-16">
            <div className="hidden md:block">
              <ProductGallery images={images} name={product.name} variant="desktop" />
            </div>

            <div className="flex flex-col gap-4 md:gap-5">
              <p className="type-overline text-teal-strong">{product.category}</p>
              <h1
                id="product-title"
                className="font-heading text-[30px] leading-[1.15] font-bold text-navy md:text-[40px] md:leading-[1.12] xl:text-[52px] xl:leading-[1.08]"
              >
                {product.name}
              </h1>
              <div className="md:hidden">
                <AvailabilityBadge compact />
              </div>
              <div className="hidden md:block">
                <AvailabilityBadge />
              </div>
              {product.description && (
                <p className="text-base leading-relaxed text-ink/80 md:text-lg">
                  {product.description}
                </p>
              )}
              <SpecRows product={product} />
              {product.storage && (
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm font-semibold text-navy">Storage</h2>
                  <p className="text-sm text-ink/80">{product.storage}</p>
                </div>
              )}
              <p className="text-[13px] text-ink-muted">
                Prices, minimum order quantities, nutritional information and technical
                specifications are provided on request.
              </p>
              <div className="hidden flex-wrap gap-3 pt-2 md:flex">
                <CtaLink href={requestHref} icon className="md:flex-1 xl:flex-none">
                  Request order
                </CtaLink>
                <CtaLink href={exportHref} variant="outline" className="md:flex-1 xl:flex-none">
                  Export inquiry
                </CtaLink>
              </div>
              <div className="hidden md:block">
                <NoAccountNote />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related products (tablet + desktop; not part of the mobile frame) */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="hidden bg-surface md:block">
          <div className="container-site flex flex-col gap-6 py-12 xl:gap-10 xl:py-24">
            <div className="flex items-end justify-between gap-6">
              <div className="flex flex-col gap-4">
                <p className="hidden type-overline text-teal-strong xl:block">Related products</p>
                <h2 id="related-title" className="type-h2 text-navy">
                  <span className="hidden xl:inline">More from Arunalu</span>
                  <span className="xl:hidden">Related products</span>
                </h2>
              </div>
              <CtaLink href="/products" variant="outline" icon className="hidden xl:inline-flex">
                View all products
              </CtaLink>
            </div>
            <ul className="grid grid-cols-2 gap-6 xl:grid-cols-3 xl:gap-10">
              {related.map((p, i) => (
                <li key={p.slug} className={i === 2 ? "hidden xl:flex" : "flex"}>
                  <ProductCard product={p} className="w-full" sizes="(min-width: 1280px) 400px, 50vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Spacer so the fixed mobile action bar never covers the footer */}
      <div aria-hidden className="h-[92px] md:hidden" />
      <MobileActionBar requestHref={requestHref} exportHref={exportHref} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  )
}
