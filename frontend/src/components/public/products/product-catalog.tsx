"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronDown, Filter, Search, SearchX, X } from "lucide-react"

import { ProductCard } from "@/components/public/product-card"
import {
  categories,
  getCategorySlugsFor,
  isCategorySlug,
  isSortValue,
  products,
  sortOptions,
  sortProducts,
  type ProductCategorySlug,
  type SortValue,
} from "@/features/products/catalog"
import { cn } from "@/lib/utils"

type CatalogState = {
  category: ProductCategorySlug | null
  query: string
  sort: SortValue
}

function filterProducts({ category, query, sort }: CatalogState) {
  const q = query.trim().toLowerCase()
  const list = products.filter((p) => {
    const cats = getCategorySlugsFor(p.slug)
    if (category && !cats.includes(category)) return false
    if (!q) return true
    const haystack = [
      p.name,
      p.packSize,
      ...cats.map((c) => categories.find((x) => x.slug === c)?.name ?? ""),
    ]
      .join(" ")
      .toLowerCase()
    return q.split(/\s+/).every((word) => haystack.includes(word))
  })
  return sortProducts(list, sort)
}

type ViewProps = CatalogState & {
  onCategory?: (c: ProductCategorySlug | null) => void
  onQuery?: (q: string) => void
  onSort?: (s: SortValue) => void
  onClear?: () => void
}

/** Toolbar + grid (Figma "Products – Desktop / Tablet / Mobile"). */
function CatalogView({ category, query, sort, onCategory, onQuery, onSort, onClear }: ViewProps) {
  const list = filterProducts({ category, query, sort })
  const count = `Showing ${list.length} ${list.length === 1 ? "product" : "products"}`
  const chips: { slug: ProductCategorySlug | null; name: string }[] = [
    { slug: null, name: "All" },
    ...categories.map((c) => ({ slug: c.slug, name: c.name })),
  ]

  return (
    <>
      {/* Toolbar */}
      <div className="container-site flex flex-col gap-3.5 pt-5 md:gap-6 md:pt-8 xl:pt-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <label className="relative block w-full xl:w-[400px]">
            <span className="sr-only">Search products</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-ink-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => onQuery?.(e.target.value)}
              placeholder="Search products…"
              autoComplete="off"
              className="h-[52px] w-full rounded-md border border-line bg-white pr-4 pl-11 text-base text-ink outline-none transition-colors placeholder:text-ink-muted hover:border-ink-muted/60 focus-visible:border-teal focus-visible:ring-3 focus-visible:ring-teal/30"
            />
          </label>
          <p
            className="hidden text-sm text-ink-muted xl:ml-auto xl:block"
            role="status"
            aria-live="polite"
          >
            {count}
          </p>
          <label className="relative hidden xl:block">
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(e) => onSort?.(e.target.value as SortValue)}
              className="h-[52px] cursor-pointer appearance-none rounded-md border border-line bg-white pr-11 pl-4 text-sm font-medium text-ink outline-none hover:border-ink-muted/60 focus-visible:border-teal focus-visible:ring-3 focus-visible:ring-teal/30"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort: {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-muted"
            />
          </label>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden items-center gap-2.5 text-sm font-medium text-ink-muted xl:flex">
            <Filter aria-hidden className="size-4" />
            Category
          </span>
          <ul
            aria-label="Filter by category"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {chips.map((chip) => {
              const on = chip.slug === category
              return (
                <li key={chip.name} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => onCategory?.(on && chip.slug ? null : chip.slug)}
                    className={cn(
                      "inline-flex h-11 items-center gap-1.5 rounded-sm border px-3.5 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-teal/50 xl:h-auto xl:px-4 xl:py-[9px]",
                      on
                        ? "border-navy bg-navy text-white"
                        : "border-line bg-white text-ink hover:border-navy"
                    )}
                  >
                    {chip.name}
                    {on && chip.slug && <X aria-hidden className="size-3.5 opacity-70" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="text-[13px] text-ink-muted md:hidden" aria-hidden>
          {count}
        </p>
      </div>

      {/* Grid */}
      <div className="container-site flex flex-col gap-8 pt-2 pb-12 md:pt-6 md:pb-16 xl:pt-10 xl:pb-24">
        {list.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-x-10 xl:gap-y-12">
            {list.map((p) => (
              <li key={p.slug} className="flex">
                <ProductCard
                  product={p}
                  className="w-full"
                  sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-line px-6 py-16 text-center">
            <SearchX aria-hidden className="size-8 text-ink-muted" />
            <p className="type-h4 text-navy">No products match your search.</p>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-12 items-center rounded-lg border border-navy px-6 type-button text-navy outline-none transition-colors hover:bg-navy hover:text-white focus-visible:ring-3 focus-visible:ring-teal/60"
            >
              Clear filters
            </button>
          </div>
        )}
        <p className="text-[13px] text-ink-muted">
          Pack sizes match the net weight printed on each pack. Prices, minimum order quantities and
          specifications are provided on request.
        </p>
      </div>
    </>
  )
}

/** Static fallback rendered into the prerendered HTML (all products, no filters). */
export function ProductCatalogFallback() {
  return <CatalogView category={null} query="" sort="featured" />
}

/**
 * Interactive catalogue. Category, search and sort live in the URL
 * (`?category=dried-fish&q=sprats&sort=name-asc`) so the mega menu, footer and
 * homepage category links open the listing pre-filtered.
 */
export function ProductCatalog() {
  const params = useSearchParams()
  const pathname = usePathname()

  const categoryParam = params.get("category")
  const sortParam = params.get("sort")
  const category = isCategorySlug(categoryParam) ? categoryParam : null
  const sort: SortValue = isSortValue(sortParam) ? sortParam : "featured"

  // The search box is local state (instant typing); the URL follows it.
  const [query, setQuery] = React.useState(() => params.get("q") ?? "")

  const update = React.useCallback(
    (next: Partial<CatalogState>) => {
      const sp = new URLSearchParams(params.toString())
      const set = (key: string, value: string | null) => {
        if (value) sp.set(key, value)
        else sp.delete(key)
      }
      if ("category" in next) set("category", next.category ?? null)
      if ("query" in next) set("q", next.query?.trim() ? next.query : null)
      if ("sort" in next) set("sort", next.sort === "featured" ? null : (next.sort ?? null))
      const qs = sp.toString()
      // Native history update: Next.js syncs useSearchParams without a server round trip.
      window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname)
    },
    [params, pathname]
  )

  return (
    <CatalogView
      category={category}
      query={query}
      sort={sort}
      onCategory={(c) => update({ category: c })}
      onQuery={(q) => {
        setQuery(q)
        update({ query: q })
      }}
      onSort={(s) => update({ sort: s })}
      onClear={() => {
        setQuery("")
        window.history.replaceState(null, "", pathname)
      }}
    />
  )
}
