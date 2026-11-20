/**
 * Static product catalogue used until the products API is available.
 * Only verified data is included: name, category, pack size and the original
 * product photograph. Descriptions, prices and MOQs are intentionally absent —
 * they must come from Arunalu Products (later via the admin panel / API).
 */

export type ProductCategorySlug =
  | "dried-fish"
  | "dried-sprats"
  | "dried-prawns"
  | "dried-seafood"

export type CatalogProduct = {
  slug: string
  name: string
  /** Display category, as used on the product cards. */
  category: "Dried Fish" | "Dried Seafood"
  packSize: string
  image: string
  imageAlt: string
}

export const products: CatalogProduct[] = [
  {
    slug: "head-on-sprats",
    name: "Head-on Sprats",
    category: "Dried Fish",
    packSize: "200g",
    image: "/images/products/head-on-sprats-200g.jpg",
    imageAlt: "Arunalu Head-on Sprats 200g pack",
  },
  {
    slug: "dried-prawns",
    name: "Dried Prawns",
    category: "Dried Seafood",
    packSize: "100g",
    image: "/images/products/dried-prawns-100g.jpg",
    imageAlt: "Arunalu Dried Prawns 100g pack",
  },
  {
    slug: "headless-sprats",
    name: "Headless Sprats",
    category: "Dried Fish",
    packSize: "200g",
    image: "/images/products/headless-sprats-200g.jpg",
    imageAlt: "Arunalu Headless Sprats 200g pack",
  },
  {
    slug: "ready-to-cook-sprats",
    name: "Ready-to-Cook Sprats",
    category: "Dried Fish",
    packSize: "200g",
    image: "/images/products/ready-to-cook-sprats-200g.jpg",
    imageAlt: "Arunalu Ready-to-Cook Sprats 200g pack",
  },
  {
    slug: "baby-shrimp",
    name: "Baby Shrimp",
    category: "Dried Seafood",
    packSize: "100g",
    image: "/images/products/baby-shrimp-100g.jpg",
    imageAlt: "Arunalu Baby Shrimp 100g pack",
  },
]

export function getProduct(slug: string): CatalogProduct {
  const product = products.find((p) => p.slug === slug)
  if (!product) throw new Error(`Unknown product: ${slug}`)
  return product
}

/** Public availability label (approved wording). */
export const availabilityLabel = "Available on request"

export const productHref = (slug: string) => `/products/${slug}`
/** Order request flow entry point (route to be built in the Order Request stage). */
export const requestOrderHref = (slug: string) =>
  `/request-order?product=${encodeURIComponent(slug)}`
