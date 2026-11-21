"use client"

import * as React from "react"

import { DataTable, type Column } from "@/components/admin/data-table"
import { AdminPageHeader, AdminSearch, ChipFilter, FilterSelect, StatusBadge } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { FormBanner } from "@/components/public/forms/form-banner"
import type { RequestStatus } from "@/features/admin/sample-data"
import { requestConfig, requestHref, statusesFor, type AdminRequest, type RequestKind } from "@/features/admin/requests"
import { cn } from "@/lib/utils"

const SHORT: Partial<Record<RequestStatus, string>> = { "Quotation Sent": "Quotation", "Rejected or Closed": "Closed" }

const COLUMNS: Record<RequestKind, Column<AdminRequest>[]> = {
  order: [
    { header: "Reference", width: "w-[150px]", cell: (r) => r.reference },
    { header: "Customer", cell: (r) => r.name },
    { header: "Product", desktopOnly: true, cell: (r) => r.product },
    { header: "Quantity", width: "w-[96px]", desktopOnly: true, cell: (r) => r.quantity },
    { header: "Country", width: "w-[100px]", desktopOnly: true, cell: (r) => r.country },
    { header: "Received", width: "w-[130px]", desktopOnly: true, cell: (r) => r.received },
    { header: "Status", width: "w-[180px]", cell: (r) => <StatusBadge status={r.status} /> },
  ],
  export: [
    { header: "Reference", width: "w-[150px]", cell: (r) => r.reference },
    { header: "Company", cell: (r) => r.company },
    { header: "Contact", desktopOnly: true, cell: (r) => r.name },
    { header: "Product", desktopOnly: true, cell: (r) => r.product },
    { header: "Est. qty", width: "w-[100px]", desktopOnly: true, cell: (r) => r.quantity },
    { header: "Destination", width: "w-[130px]", desktopOnly: true, cell: (r) => r.destination },
    { header: "Status", width: "w-[180px]", cell: (r) => <StatusBadge status={r.status} /> },
  ],
  contact: [
    { header: "Reference", width: "w-[150px]", cell: (r) => r.reference },
    { header: "Name", cell: (r) => r.name },
    { header: "Email", desktopOnly: true, cell: (r) => r.email },
    { header: "Subject", desktopOnly: true, cell: (r) => r.subject },
    { header: "Received", width: "w-[130px]", desktopOnly: true, cell: (r) => r.received },
    { header: "Status", width: "w-[180px]", cell: (r) => <StatusBadge status={r.status} /> },
  ],
}

const card = (r: AdminRequest) => {
  if (r.kind === "order") return { title: r.reference, badge: <StatusBadge status={r.status} />, line1: r.name, line2: `${r.product} · ${r.quantity}`, meta: `${r.received} · ${r.country}` }
  if (r.kind === "export") return { title: r.reference, badge: <StatusBadge status={r.status} />, line1: r.company, line2: `${r.product} · ${r.quantity}`, meta: `Destination: ${r.destination}` }
  return { title: r.reference, badge: <StatusBadge status={r.status} />, line1: r.name, line2: r.subject, meta: r.received }
}

/**
 * Figma "Admin – 08 Guest Order Management", "10 Export Inquiry Management",
 * "12 Contact Inquiry Management" (+ tablet / mobile lists): status tabs with
 * counts, search, filters, table → details.
 */
export function RequestsList({ kind, rows }: { kind: RequestKind; rows: AdminRequest[] }) {
  const cfg = requestConfig[kind]
  const [tab, setTab] = React.useState<"all" | RequestStatus>("all")
  const [q, setQ] = React.useState("")
  const [product, setProduct] = React.useState("all")
  const [notice, setNotice] = React.useState(false)

  const statuses = statusesFor(kind).filter((s) => rows.some((r) => r.status === s))
  const products = Array.from(new Set(rows.map((r) => r.product).filter(Boolean))) as string[]
  const count = (s: "all" | RequestStatus) => (s === "all" ? rows.length : rows.filter((r) => r.status === s).length)
  const needle = q.trim().toLowerCase()
  const shown = rows.filter(
    (r) =>
      (tab === "all" || r.status === tab) &&
      (product === "all" || r.product === product) &&
      (!needle || [r.reference, r.name, r.company, r.email].some((v) => v?.toLowerCase().includes(needle)))
  )
  const tabs = [{ value: "all" as const, label: "All" }, ...statuses.map((s) => ({ value: s, label: s === "Rejected or Closed" ? "Rejected / Closed" : s }))]

  return (
    <>
      <AdminPageHeader
        title={cfg.title}
        subtitle={cfg.subtitle}
        actions={
          <button type="button" onClick={() => setNotice(true)} className={ctaClassName("outline", "hidden h-11 xl:inline-flex")}>
            Export CSV
          </button>
        }
      />
      {notice && <FormBanner kind="warning">CSV export is added with the backend.</FormBanner>}

      <div role="tablist" aria-label="Filter by status" className="hidden gap-7 overflow-x-auto border-b border-line xl:flex">
        {tabs.map((t) => {
          const on = t.value === tab
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t.value)}
              className={cn(
                "-mb-px flex h-11 shrink-0 items-center border-b-2 text-sm font-medium whitespace-nowrap outline-none focus-visible:text-navy focus-visible:underline",
                on ? "border-teal text-navy" : "border-transparent text-ink-muted hover:text-navy"
              )}
            >
              {t.label} ({count(t.value)})
            </button>
          )
        })}
      </div>
      <ChipFilter
        label="Filter by status"
        className="xl:hidden"
        value={tab}
        onChange={setTab}
        options={tabs.map((t) => ({ value: t.value, label: `${t.value === "all" ? "All" : (SHORT[t.value] ?? t.label)} ${count(t.value)}` }))}
      />

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <AdminSearch label={`Search ${cfg.title.toLowerCase()}`} placeholder={cfg.search} value={q} onChange={(e) => setQ(e.target.value)} className="w-full xl:w-[360px]" />
        {products.length > 1 && (
          <FilterSelect
            label="Product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            options={[{ value: "all", label: "All products" }, ...products.map((p) => ({ value: p, label: p }))]}
            className="hidden xl:block xl:w-[220px]"
          />
        )}
      </div>

      {shown.length === 0 ? (
        <p className="rounded-xl border border-line bg-white px-5 py-12 text-center text-sm text-ink-muted">No {cfg.title.toLowerCase()} match these filters.</p>
      ) : (
        <DataTable caption={cfg.title} rows={shown} rowKey={(r) => r.reference} columns={COLUMNS[kind]} card={card} href={requestHref} />
      )}
      <p className="text-xs text-ink-muted">
        Showing {shown.length} of {rows.length} (sample data)
      </p>
    </>
  )
}
