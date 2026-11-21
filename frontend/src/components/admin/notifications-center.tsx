"use client"

import * as React from "react"

import { NotificationItem } from "@/components/admin/notification-item"
import { AdminPageHeader, Panel } from "@/components/admin/ui"
import { FormBanner } from "@/components/public/forms/form-banner"
import { ctaClassName } from "@/components/public/cta-link"
import { Switch } from "@/components/ui/switch"
import { siteConfig } from "@/config/site"
import { sampleNotifications, type NotificationKind } from "@/features/admin/sample-data"
import { cn } from "@/lib/utils"

const TABS: { id: string; label: string; match: (k: NotificationKind) => boolean }[] = [
  { id: "all", label: "All", match: () => true },
  { id: "unread", label: "Unread", match: () => true },
  { id: "orders", label: "Orders", match: (k) => k === "order" || k === "status" },
  { id: "exports", label: "Exports", match: (k) => k === "export" },
  { id: "contact", label: "Contact", match: (k) => k === "contact" },
]

const EMAIL_SETTINGS = [
  { id: "order", label: "New order request", on: true },
  { id: "export", label: "New export inquiry", on: true },
  { id: "contact", label: "New contact message", on: false },
  { id: "daily", label: "Daily summary email", on: true },
]

/** Figma "Admin – 03 Notifications": tabs, list, email notification settings (sample, not saved). */
export function NotificationsCenter() {
  const [items, setItems] = React.useState(sampleNotifications)
  const [tab, setTab] = React.useState("all")
  const unread = items.filter((n) => n.unread).length
  const t = TABS.find((x) => x.id === tab)!
  const shown = items.filter((n) => t.match(n.kind) && (tab !== "unread" || n.unread))

  return (
    <>
      <AdminPageHeader
        title="Notifications"
        subtitle="Dashboard + email notifications"
        actions={
          <button
            type="button"
            disabled={unread === 0}
            onClick={() => setItems((all) => all.map((n) => ({ ...n, unread: false })))}
            className={ctaClassName("outline", "h-11 w-full md:w-auto")}
          >
            Mark all as read
          </button>
        }
      />
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
        <Panel className="min-w-0 flex-1 p-2">
          <div role="tablist" aria-label="Filter notifications" className="flex gap-6 overflow-x-auto border-b border-line px-3 [scrollbar-width:none] md:gap-7">
            {TABS.map((x) => {
              const on = x.id === tab
              return (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(x.id)}
                  className={cn(
                    "-mb-px flex h-12 shrink-0 items-center border-b-2 text-sm font-medium whitespace-nowrap outline-none focus-visible:text-navy focus-visible:underline",
                    on ? "border-teal text-navy" : "border-transparent text-ink-muted hover:text-navy"
                  )}
                >
                  {x.id === "unread" ? `Unread (${unread})` : x.label}
                </button>
              )
            })}
          </div>
          <div role="tabpanel" aria-label={t.label} className="flex flex-col gap-1 pt-2">
            {shown.length ? shown.map((n) => <NotificationItem key={n.id} n={n} />) : <p className="px-4 py-10 text-center text-sm text-ink-muted">No notifications here.</p>}
          </div>
        </Panel>

        <Panel aria-labelledby="email-settings" className="flex flex-col gap-4 p-6 xl:w-[400px] xl:shrink-0">
          <h2 id="email-settings" className="font-heading text-lg font-bold text-navy">Email notifications</h2>
          <ul className="flex flex-col gap-4">
            {EMAIL_SETTINGS.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4">
                <label htmlFor={`email-${s.id}`} className="flex flex-col text-sm text-ink">
                  {s.label}
                  {s.id !== "daily" && <span className="text-xs text-ink-muted">→ {siteConfig.contact.email}</span>}
                </label>
                <Switch id={`email-${s.id}`} defaultChecked={s.on} />
              </li>
            ))}
          </ul>
          <FormBanner kind="warning">
            Email delivery is set up with the backend. These switches are a preview and are not saved.
          </FormBanner>
        </Panel>
      </div>
    </>
  )
}
