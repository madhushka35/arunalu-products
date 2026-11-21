import type { Metadata } from "next"

import { PageHero } from "@/components/public/page-hero"
import { GalleryGrid, type GalleryItem } from "@/components/public/pages/gallery-grid"
import { products } from "@/features/products/catalog"

export const metadata: Metadata = {
  title: "Gallery",
  description: "Original Arunalu Products photography.",
  alternates: { canonical: "/gallery" },
}

/*
 * Figma "Gallery – Desktop": only REAL Arunalu photography is shown (report
 * §4: AI images must not be presented as company facilities or staff).
 * Today that is the product photography; production, machinery, facility,
 * team and video items appear once real photos / videos are supplied
 * (gallery admin, Stage 7). The video gallery section is hidden until then.
 */
const items: GalleryItem[] = products.flatMap((p, i) => [
  { src: p.image, alt: p.imageAlt, category: "Products", caption: `${p.name} · ${p.packSize}`, ratio: i % 2 ? "3 / 4" : "4 / 5" },
  { src: p.originalImage, alt: `${p.imageAlt} — original photo`, category: "Products", caption: `${p.name} · original photo`, ratio: "2 / 3" },
])

export default function GalleryPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        overline="Gallery"
        title="Inside our production."
      />
      <section aria-label="Photos" className="bg-white">
        <div className="container-site pt-8 pb-16 md:pt-12 xl:pt-12 xl:pb-28">
          <GalleryGrid items={items} />
        </div>
      </section>
    </>
  )
}
