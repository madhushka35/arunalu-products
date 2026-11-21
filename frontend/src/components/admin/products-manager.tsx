"use client"

import * as React from "react"
import Image from "next/image"
import { Eye, PencilLine, Trash2 } from "lucide-react"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { DataTable } from "@/components/admin/data-table"
import { AdminPageHeader, AdminSearch, ChipFilter, FilterSelect, IconAction, StatusBadge } from "@/components/admin/ui"
import { CtaLink, ctaClassName } from "@/components/public/cta-link"
import { FormBanner } from "@/components/public/forms/form-banner"
import type { AdminProduct } from "@/features/admin/sample-data"
import { categories, productHref } from "@/features/products/catalog"

type Chip = "all" | "Published" | "Draft" | "featured"
const CHIPS: { value: Chip; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Published", label: "Published" },
  { value: "Draft", label: "Draft" },
  { value: "featured", label: "Featured" },
]

const editHref = (slug: string) => `/admin/products/${slug}/edit`

function ProductCell({ p }: { p: AdminProduct }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-surface">
        <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium text-navy">{p.name}</span>
        <span className="truncate text-xs font-normal text-ink-muted">SKU to be assigned by Arunalu Products</span>
      </span>
    </span>
  )
}

/** Figma "Admin – 04 Product Management" (+ tablet / mobile "Product Management"). */
export function ProductsManager({ products }: { products: AdminProduct[] }) {
  const [q, setQ] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [chip, setChip] = React.useState<Chip>("all")
  const [toDelete, setToDelete] = React.useState<AdminProduct | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)

  const shown = products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q.trim().toLowerCase())) return false
    if (category !== "all" && !p.categorySlugs.includes(category as never)) return false
    if (status !== "all" && p.status !== status) return false
    if (chip === "featured" && !p.featured) return false
    if ((chip === "Published" || chip === "Draft") && p.status !== chip) return false
    return true
  })

  const actions = (p: AdminProduct) => (
    <span className="-my-1.5 flex items-center">
      <IconAction icon={Eye} label={`View ${p.name} on the website`} href={productHref(p.slug)} />
      <IconAction icon={PencilLine} label={`Edit ${p.name}`} href={editHref(p.slug)} />
      <IconAction icon={Trash2} label={`Delete ${p.name}`} danger onClick={() => setToDelete(p)} />
    </span>
  )

  return (
    <>
      <AdminPageHeader
        title="Products"
        subtitle={`${products.length} products`}
        actions={
          <>
            <button type="button" className={ctaClassName("outline", "hidden h-11 xl:inline-flex")} onClick={() => setNotice("CSV export is added with the backend.")}>
              Export CSV
            </button>
            <CtaLink href="/admin/products/new" className="hidden h-11 md:inline-flex">Add product</CtaLink>
          </>
        }
      />

      {notice && (
        <FormBanner kind="warning">
          {notice}
        </FormBanner>
      )}

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <AdminSearch label="Search products" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full xl:w-[360px]" />
        <FilterSelect
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[{ value: "all", label: "All categories" }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]}
          className="hidden xl:block xl:w-[200px]"
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[{ value: "all", label: "All statuses" }, { value: "Published", label: "Published" }, { value: "Draft", label: "Draft" }]}
          className="hidden xl:block xl:w-[180px]"
        />
        <ChipFilter label="Filter products" options={CHIPS} value={chip} onChange={setChip} className="xl:hidden" />
      </div>

      {shown.length === 0 ? (
        <p className="rounded-xl border border-line bg-white px-5 py-12 text-center text-sm text-ink-muted">No products match these filters.</p>
      ) : (
        <DataTable
          caption="Products"
          rows={shown}
          rowKey={(p) => p.slug}
          columns={[
            { header: "Product", cell: (p) => <ProductCell p={p} /> },
            { header: "Category", width: "w-[150px]", desktopOnly: true, cell: (p) => p.category },
            { header: "Pack size", width: "w-[100px]", desktopOnly: true, cell: (p) => p.packSize },
            { header: "Featured", width: "w-[90px]", desktopOnly: true, cell: (p) => (p.featured ? "Yes" : "—") },
            { header: "Status", width: "w-[130px]", cell: (p) => <StatusBadge status={p.status} /> },
            { header: "Updated", width: "w-[120px]", desktopOnly: true, cell: (p) => p.updated },
            { header: "Actions", width: "w-[156px]", cell: actions },
          ]}
          card={(p) => ({
            title: p.name,
            badge: <StatusBadge status={p.status} />,
            line1: p.category,
            line2: `Pack size: ${p.packSize}`,
            meta: `Updated ${p.updated}`,
          })}
          href={(p) => editHref(p.slug)}
          firstColumnLink={false}
        />
      )}

      <CtaLink href="/admin/products/new" block className="md:hidden">Add product</CtaLink>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete product?"
        message={
          <>
            “{toDelete?.name}” will be removed from the website. This is recorded in the activity log.
          </>
        }
        confirmLabel="Delete product"
        danger
        onConfirm={() => setNotice(`Preview only: “${toDelete?.name}” was not deleted. Changes are saved once the backend is connected.`)}
      />
    </>
  )
}
