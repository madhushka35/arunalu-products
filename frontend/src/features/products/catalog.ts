/**
 * Static product catalogue used until the products API is available
 * (report section 11: GET /api/v1/products, /categories).
 * Only verified data is included: name, category, pack size and the original
 * product photograph. Descriptions, prices and MOQs are intentionally absent —
 * they must come from Arunalu Products (later via the admin panel / API).
 */

export type ProductCategorySlug =
  | "dried-fish"
  | "dried-sprats"
  | "dried-prawns"
  | "dried-seafood"

export type ProductCategory = {
  slug: ProductCategorySlug
  name: string
  /** Display order (admin "Display Order"). */
  order: number
}

/** Categories (Figma admin "Product categories" table). */
export const categories: ProductCategory[] = [
  { slug: "dried-fish", name: "Dried Fish", order: 1 },
  { slug: "dried-sprats", name: "Dried Sprats", order: 2 },
  { slug: "dried-prawns", name: "Dried Prawns", order: 3 },
  { slug: "dried-seafood", name: "Dried Seafood", order: 4 },
]

export type CatalogProduct = {
  slug: string
  name: string
  /** Primary display category, as used on the product cards and breadcrumbs. */
  category: "Dried Fish" | "Dried Seafood"
  packSize: string
  /** Enhanced product photograph (4:5). */
  image: string
  imageAlt: string
  /** Original, unedited product photograph (Figma "Thumb 2 · original photo"). */
  originalImage: string
  /** Business-approved copy only. `null` until supplied → section hidden. */
  description: string | null
  storage: string | null
}

export const products: CatalogProduct[] = [
  {
    slug: "head-on-sprats",
    name: "Head-on Sprats",
    category: "Dried Fish",
    packSize: "200g",
    image: "/images/products/head-on-sprats-200g.jpg",
    imageAlt: "Arunalu Head-on Sprats 200g pack",
    originalImage: "/images/products/originals/head-on-sprats-200g.jpg",
    description: null,
    storage: null,
  },
  {
    slug: "dried-prawns",
    name: "Dried Prawns",
    category: "Dried Seafood",
    packSize: "100g",
    image: "/images/products/dried-prawns-100g.jpg",
    imageAlt: "Arunalu Dried Prawns 100g pack",
    originalImage: "/images/products/originals/dried-prawns-100g.jpg",
    description: null,
    storage: null,
  },
  {
    slug: "headless-sprats",
    name: "Headless Sprats",
    category: "Dried Fish",
    packSize: "200g",
    image: "/images/products/headless-sprats-200g.jpg",
    imageAlt: "Arunalu Headless Sprats 200g pack",
    originalImage: "/images/products/originals/headless-sprats-200g.jpg",
    description: null,
    storage: null,
  },
  {
    slug: "ready-to-cook-sprats",
    name: "Ready-to-Cook Sprats",
    category: "Dried Fish",
    packSize: "200g",
    image: "/images/products/ready-to-cook-sprats-200g.jpg",
    imageAlt: "Arunalu Ready-to-Cook Sprats 200g pack",
    originalImage: "/images/products/originals/ready-to-cook-sprats-200g.jpg",
    description: null,
    storage: null,
  },
  {
    slug: "baby-shrimp",
    name: "Baby Shrimp",
    category: "Dried Seafood",
    packSize: "100g",
    image: "/images/products/baby-shrimp-100g.jpg",
    imageAlt: "Arunalu Baby Shrimp 100g pack",
    originalImage: "/images/products/originals/baby-shrimp-100g.jpg",
    description: null,
    storage: null,
  },
]

/**
 * Product ↔ category assignments (many-to-many, mirrors the planned
 * `product_category` pivot). Counts match the Figma admin categories table:
 * Dried Fish 3 · Dried Sprats 3 · Dried Prawns 1 · Dried Seafood 2.
 */
export const productCategories: { product: string; category: ProductCategorySlug }[] = [
  { product: "head-on-sprats", category: "dried-fish" },
  { product: "headless-sprats", category: "dried-fish" },
  { product: "ready-to-cook-sprats", category: "dried-fish" },
  { product: "head-on-sprats", category: "dried-sprats" },
  { product: "headless-sprats", category: "dried-sprats" },
  { product: "ready-to-cook-sprats", category: "dried-sprats" },
  { product: "dried-prawns", category: "dried-prawns" },
  { product: "dried-prawns", category: "dried-seafood" },
  { product: "baby-shrimp", category: "dried-seafood" },
]

export function isCategorySlug(value: string | null | undefined): value is ProductCategorySlug {
  return categories.some((c) => c.slug === value)
}

export function getCategory(slug: ProductCategorySlug): ProductCategory {
  const category = categories.find((c) => c.slug === slug)
  if (!category) throw new Error(`Unknown category: ${slug}`)
  return category
}

export function getCategorySlugsFor(productSlug: string): ProductCategorySlug[] {
  return productCategories.filter((pc) => pc.product === productSlug).map((pc) => pc.category)
}

export function getProductsInCategory(slug: ProductCategorySlug): CatalogProduct[] {
  const inCategory = new Set(
    productCategories.filter((pc) => pc.category === slug).map((pc) => pc.product)
  )
  return products.filter((p) => inCategory.has(p.slug))
}

/** Slug of the primary display category (used for breadcrumbs). */
export function primaryCategorySlug(product: CatalogProduct): ProductCategorySlug {
  return product.category === "Dried Fish" ? "dried-fish" : "dried-seafood"
}

/** Other products sharing at least one category, in catalogue order. */
export function getRelatedProducts(slug: string, limit = 3): CatalogProduct[] {
  const own = new Set(getCategorySlugsFor(slug))
  const related = products.filter(
    (p) => p.slug !== slug && getCategorySlugsFor(p.slug).some((c) => own.has(c))
  )
  // Fill with the rest of the catalogue when a category has fewer products.
  const rest = products.filter((p) => p.slug !== slug && !related.includes(p))
  return [...related, ...rest].slice(0, limit)
}

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
] as const

export type SortValue = (typeof sortOptions)[number]["value"]

export function isSortValue(value: string | null | undefined): value is SortValue {
  return sortOptions.some((o) => o.value === value)
}

export function sortProducts(list: CatalogProduct[], sort: SortValue): CatalogProduct[] {
  if (sort === "featured") return list
  const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name))
  return sort === "name-desc" ? sorted.reverse() : sorted
}

export function getProduct(slug: string): CatalogProduct {
  const product = products.find((p) => p.slug === slug)
  if (!product) throw new Error(`Unknown product: ${slug}`)
  return product
}

/** Public availability label (approved wording). */
export const availabilityLabel = "Available on request"

export function findProduct(slug: string): CatalogProduct | undefined {
  return products.find((p) => p.slug === slug)
}

export const productHref = (slug: string) => `/products/${slug}`
/** Order request flow entry point (route to be built in the Order Request stage). */
export const requestOrderHref = (slug: string) =>
  `/request-order?product=${encodeURIComponent(slug)}`
