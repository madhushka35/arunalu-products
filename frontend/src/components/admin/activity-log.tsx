"use client"

import * as React from "react"

import { DataTable } from "@/components/admin/data-table"
import { AdminPageHeader, AdminSearch, FilterSelect } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { FormBanner } from "@/components/public/forms/form-banner"
import type { activityLog } from "@/features/admin/sample-data"

type Entry = (typeof activityLog)[number]

/** Figma "Admin – 19 Activity Logs": every admin action is recorded (read-only). */
export function ActivityLog({ entries }: { entries: Entry[] }) {
  const [q, setQ] = React.useState("")
  const [user, setUser] = React.useState("all")
  const [notice, setNotice] = React.useState(false)
  const users = Array.from(new Set(entries.map((e) => e.user)))
  const needle = q.trim().toLowerCase()
  const shown = entries.filter((e) => (user === "all" || e.user === user) && (!needle || `${e.action} ${e.entity}`.toLowerCase().includes(needle)))

  return (
    <>
      <AdminPageHeader
        title="Activity logs"
        subtitle="Every admin action is recorded · sample entries"
        actions={
          <button type="button" onClick={() => setNotice(true)} className={ctaClassName("outline", "hidden h-11 xl:inline-flex")}>
            Export CSV
          </button>
        }
      />
      {notice && <FormBanner kind="warning">CSV export is added with the backend.</FormBanner>}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <AdminSearch label="Search activity" placeholder="Search action or entity…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full md:w-[360px]" />
        <FilterSelect label="User" value={user} onChange={(e) => setUser(e.target.value)} options={[{ value: "all", label: "All users" }, ...users.map((u) => ({ value: u, label: u }))]} className="md:w-[220px]" />
      </div>
      {shown.length === 0 ? (
        <p className="rounded-xl border border-line bg-white px-5 py-12 text-center text-sm text-ink-muted">No activity matches these filters.</p>
      ) : (
        <DataTable
          caption="Activity log"
          rows={shown}
          rowKey={(e) => e.id}
          columns={[
            { header: "Time", width: "w-[140px]", cell: (e) => e.time },
            { header: "User", width: "w-[170px]", cell: (e) => e.user },
            { header: "Action", cell: (e) => e.action },
            { header: "Entity", width: "w-[160px]", desktopOnly: true, cell: (e) => e.entity },
            { header: "IP address", width: "w-[150px]", desktopOnly: true, cell: (e) => e.ip },
          ]}
          card={(e) => ({ title: e.action, line1: e.entity, line2: e.user, meta: `${e.time} · ${e.ip}` })}
        />
      )}
    </>
  )
}
