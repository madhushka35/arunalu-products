import { Suspense } from "react"
import type { Metadata } from "next"

import { PageHero } from "@/components/public/page-hero"
import {
  ProductCatalog,
  ProductCatalogFallback,
} from "@/components/public/products/product-catalog"
import { ProductInquiryCta } from "@/components/public/products/product-inquiry-cta"

export const metadata: Metadata = {
  title: "Products",
  description:
    "Arunalu dried fish and preserved seafood, shown with original product photography. Availability, pricing and order quantities are confirmed on request.",
  alternates: { canonical: "/products" },
}

/** Products listing — Figma "Products – Desktop / Tablet (768) / Mobile". */
export default function ProductsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        overline="Product catalog"
        title="Our products"
        body="Arunalu dried fish and preserved seafood, shown with original product photography. Availability, pricing and order quantities are confirmed on request."
        bodyCompact="Original Arunalu product photography."
      />
      <Suspense fallback={<ProductCatalogFallback />}>
        <ProductCatalog />
      </Suspense>
      {/* The inquiry band is part of the desktop frame only. */}
      <ProductInquiryCta className="hidden xl:block" />
    </>
  )
}
