"use client"

import * as React from "react"
import { PencilLine, Trash2 } from "lucide-react"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { DataTable } from "@/components/admin/data-table"
import { AdminPageHeader, AdminSearch, ChipFilter, IconAction, StatusBadge } from "@/components/admin/ui"
import { CtaLink } from "@/components/public/cta-link"
import { FormBanner } from "@/components/public/forms/form-banner"
import type { AdminArticle } from "@/features/admin/sample-data"

type Chip = "all" | "Published" | "Draft"
const editHref = (a: AdminArticle) => `/admin/news/${a.id}/edit`

/** Figma "Admin – 14 News Management". Articles here are samples; the public News page stays empty until real articles are published. */
export function NewsManager({ articles }: { articles: AdminArticle[] }) {
  const [q, setQ] = React.useState("")
  const [chip, setChip] = React.useState<Chip>("all")
  const [toDelete, setToDelete] = React.useState<AdminArticle | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)
  const needle = q.trim().toLowerCase()
  const shown = articles.filter((a) => (chip === "all" || a.status === chip) && (!needle || a.title.toLowerCase().includes(needle)))

  return (
    <>
      <AdminPageHeader
        title="News"
        subtitle={`${articles.length} articles · sample`}
        actions={<CtaLink href="/admin/news/new" className="h-11 w-full md:w-auto">New article</CtaLink>}
      />
      {notice && <FormBanner kind="warning">{notice}</FormBanner>}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <AdminSearch label="Search articles" placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full xl:w-[360px]" />
        <ChipFilter
          label="Filter by status"
          value={chip}
          onChange={setChip}
          options={[
            { value: "all", label: "All" },
            { value: "Published", label: "Published" },
            { value: "Draft", label: "Draft" },
          ]}
        />
      </div>
      {shown.length === 0 ? (
        <p className="rounded-xl border border-line bg-white px-5 py-12 text-center text-sm text-ink-muted">No articles match these filters.</p>
      ) : (
        <DataTable
          caption="News articles"
          rows={shown}
          rowKey={(a) => a.id}
          firstColumnLink={false}
          href={editHref}
          columns={[
            { header: "Title", cell: (a) => a.title },
            { header: "Category", width: "w-[150px]", desktopOnly: true, cell: (a) => a.category },
            { header: "Author", width: "w-[150px]", desktopOnly: true, cell: (a) => a.author },
            { header: "Published", width: "w-[120px]", desktopOnly: true, cell: (a) => a.published },
            { header: "Status", width: "w-[120px]", cell: (a) => <StatusBadge status={a.status} /> },
            {
              header: "Actions",
              width: "w-[112px]",
              cell: (a) => (
                <span className="-my-1.5 flex items-center">
                  <IconAction icon={PencilLine} label={`Edit ${a.title}`} href={editHref(a)} />
                  <IconAction icon={Trash2} label={`Delete ${a.title}`} danger onClick={() => setToDelete(a)} />
                </span>
              ),
            },
          ]}
          card={(a) => ({ title: a.title, badge: <StatusBadge status={a.status} />, line1: a.category, meta: `${a.author} · ${a.published}` })}
        />
      )}
      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete article?"
        message={`“${toDelete?.title}” will be removed from the website.`}
        confirmLabel="Delete article"
        danger
        onConfirm={() => setNotice(`Preview only: “${toDelete?.title}” was not deleted. Changes are saved once the backend is connected.`)}
      />
    </>
  )
}
