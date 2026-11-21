import type { Metadata } from "next"
import Link from "next/link"

import { DataTable } from "@/components/admin/data-table"
import { NotificationItem } from "@/components/admin/notification-item"
import { AdminPageHeader, Panel, StatCard, StatusBadge } from "@/components/admin/ui"
import { CtaLink } from "@/components/public/cta-link"
import { requestHref } from "@/features/admin/requests"
import { sampleActivity, sampleAdminUser, sampleExports, sampleNotifications, sampleOrders, sampleStats } from "@/features/admin/sample-data"

export const metadata: Metadata = { title: "Dashboard" }

const viewAll = (href: string) => (
  <Link href={href} className="text-sm font-semibold text-teal-strong outline-none hover:text-navy focus-visible:underline">
    View all
  </Link>
)

/** Figma "Admin – 02 Dashboard" (+ tablet / mobile frames). All figures are sample data. */
export default function AdminDashboardPage() {
  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle={`Good morning, ${sampleAdminUser.name} · all figures are sample data`}
        actions={
          <>
            <CtaLink href="/" variant="outline" className="hidden h-11 xl:inline-flex">View website</CtaLink>
            <CtaLink href="/admin/products/new" className="hidden h-11 xl:inline-flex">Add product</CtaLink>
          </>
        }
      />

      <ul aria-label="Summary" className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4 xl:gap-6">
        {sampleStats.map((s) => (
          <li key={s.label}>
            <StatCard {...s} />
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
          <DataTable
            title="Recent order requests"
            action={viewAll("/admin/orders")}
            caption="Recent order requests (sample)"
            className="min-w-0 flex-1"
            rows={sampleOrders.slice(0, 5)}
            rowKey={(o) => o.reference}
            columns={[
              { header: "Reference", width: "w-[150px] xl:w-[148px]", cell: (o) => o.reference },
              { header: "Customer", cell: (o) => o.customer },
              { header: "Product", desktopOnly: true, cell: (o) => o.product },
              { header: "Qty", width: "w-[90px]", desktopOnly: true, cell: (o) => o.quantity },
              { header: "Status", width: "w-[160px]", cell: (o) => <StatusBadge status={o.status} /> },
            ]}
            href={(o) => requestHref({ kind: "order", reference: o.reference })}
            card={(o) => ({ title: o.reference, badge: <StatusBadge status={o.status} />, line1: o.customer, line2: `${o.product} · ${o.quantity}`, meta: `${o.received} · ${o.country}` })}
          />

        <Panel aria-labelledby="dash-notifications" className="p-2 xl:w-[380px] xl:shrink-0">
          <div className="flex items-center justify-between px-3 py-3">
            <h2 id="dash-notifications" className="font-heading text-lg font-bold text-navy">Notifications</h2>
            <Link href="/admin/notifications" className="text-sm font-semibold text-teal-strong outline-none hover:text-navy focus-visible:underline">
              3 new
            </Link>
          </div>
          {sampleNotifications.slice(0, 3).map((n) => (
            <NotificationItem key={n.id} n={n} />
          ))}
        </Panel>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
          <DataTable
            title="Recent export inquiries"
            action={viewAll("/admin/export-inquiries")}
            caption="Recent export inquiries (sample)"
            className="min-w-0 flex-1"
            rows={sampleExports.slice(0, 3)}
            rowKey={(e) => e.reference}
            columns={[
              { header: "Reference", width: "w-[150px] xl:w-[148px]", cell: (e) => e.reference },
              { header: "Company", cell: (e) => e.company },
              { header: "Product", desktopOnly: true, cell: (e) => e.product },
              { header: "Est. qty", width: "w-[100px]", desktopOnly: true, cell: (e) => e.quantity },
              { header: "Status", width: "w-[160px]", cell: (e) => <StatusBadge status={e.status} /> },
            ]}
            href={(e) => requestHref({ kind: "export", reference: e.reference })}
            card={(e) => ({ title: e.reference, badge: <StatusBadge status={e.status} />, line1: e.company, line2: `${e.product} · ${e.quantity}`, meta: e.destination })}
          />

        <Panel aria-labelledby="dash-activity" className="flex flex-col gap-4 p-6 xl:w-[380px] xl:shrink-0">
          <h2 id="dash-activity" className="font-heading text-lg font-bold text-navy">Recent activity</h2>
          <ul className="flex flex-col gap-4">
            {sampleActivity.map((a) => (
              <li key={a.what} className="flex gap-3">
                <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-teal" />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm text-ink">{a.who} {a.what}</span>
                  <span className="text-xs text-ink-muted">{a.when}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  )
}
