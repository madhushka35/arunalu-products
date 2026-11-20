import type { Metadata } from "next"

import { BrandIntroSection } from "@/components/public/home/brand-intro-section"
import { CapabilitiesSection } from "@/components/public/home/capabilities-section"
import { CategoriesSection } from "@/components/public/home/categories-section"
import { ExportSection } from "@/components/public/home/export-section"
import { FeaturedProductsSection } from "@/components/public/home/featured-products-section"
import { FinalCtaSection } from "@/components/public/home/final-cta-section"
import { GallerySection } from "@/components/public/home/gallery-section"
import { HeroSection } from "@/components/public/home/hero-section"
import { JourneySection } from "@/components/public/home/journey-section"
import { PackagingSection } from "@/components/public/home/packaging-section"
import { QualitySection } from "@/components/public/home/quality-section"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: { absolute: "Arunalu Products | Dried Fish & Seafood Processing, Sri Lanka" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
}

/** Homepage — section order follows the approved Figma "Home – Desktop" frame. */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandIntroSection />
      <FeaturedProductsSection />
      <CategoriesSection />
      <JourneySection />
      <QualitySection />
      <CapabilitiesSection />
      <PackagingSection />
      <ExportSection />
      <GallerySection />
      <FinalCtaSection />
    </>
  )
}
