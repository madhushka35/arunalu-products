import * as React from "react"
import Link from "next/link"
import { ChevronDown, ClipboardList, Globe, Mail, Package, Search, type LucideIcon } from "lucide-react"

import type { AnyStatus } from "@/features/admin/sample-data"
import { cn } from "@/lib/utils"

/* Figma "Status Badge": tinted pill + colour dot, dark label (AA contrast). */
const BADGE: Record<AnyStatus, { pill: string; dot: string; label?: string }> = {
  New: { pill: "bg-teal/12", dot: "bg-teal" },
  Reviewing: { pill: "bg-warning/12", dot: "bg-warning" },
  Contacted: { pill: "bg-ocean/12", dot: "bg-ocean" },
  "Quotation Sent": { pill: "bg-sand/70", dot: "bg-navy" },
  Completed: { pill: "bg-success/12", dot: "bg-success" },
  "Rejected or Closed": { pill: "bg-error/12", dot: "bg-error", label: "Rejected / Closed" },
  Draft: { pill: "bg-ink-muted/12", dot: "bg-ink-muted" },
  Published: { pill: "bg-success/12", dot: "bg-success" },
  Active: { pill: "bg-success/12", dot: "bg-success" },
  Inactive: { pill: "bg-ink-muted/12", dot: "bg-ink-muted" },
}

export function StatusBadge({ status, className }: { status: AnyStatus; className?: string }) {
  const b = BADGE[status]
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-ink", b.pill, className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", b.dot)} />
      {b.label ?? status}
    </span>
  )
}

/** Figma "Admin/Page Title" + subtitle, with page actions on the right. */
export function AdminPageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="font-heading text-[22px] leading-tight font-bold text-navy md:sr-only xl:not-sr-only xl:text-[28px]">{title}</h1>
        {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}

/** White bordered panel (Figma "Panel"). */
export function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("rounded-xl border border-line bg-white", className)} {...props} />
}

export function PanelHeader({ title, action, className }: { title: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-h-14 items-center justify-between gap-3 border-b border-line px-5 py-3", className)}>
      <h2 className="font-heading text-lg font-bold text-navy">{title}</h2>
      {action}
    </div>
  )
}

const STAT_ICONS = { package: Package, clipboard: ClipboardList, globe: Globe, mail: Mail } as const

/** Figma "Admin Stat Card": label + icon chip, value, delta (sample). */
export function StatCard({ label, value, delta, icon }: { label: string; value: string; delta: string; icon: keyof typeof STAT_ICONS }) {
  const Icon = STAT_ICONS[icon]
  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-line bg-white p-4 md:p-6">
      <div className="flex items-center gap-3">
        <p className="flex-1 text-sm text-ink-muted">{label}</p>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-teal/12">
          <Icon aria-hidden className="size-5 text-teal-strong" />
        </span>
      </div>
      <p className="font-heading text-[28px] leading-none font-bold text-navy xl:text-[32px]">{value}</p>
      <p className="text-xs text-success-strong">{delta}</p>
    </div>
  )
}

const iconActionClass =
  "flex size-11 shrink-0 items-center justify-center rounded-lg text-ink-muted outline-none transition-colors hover:bg-surface hover:text-navy focus-visible:ring-3 focus-visible:ring-teal/50"

/** Table row action (Figma 44px icon targets): link or button. */
export function IconAction({
  icon: Icon,
  label,
  href,
  danger,
  ...props
}: { icon: LucideIcon; label: string; href?: string; danger?: boolean } & Omit<React.ComponentProps<"button">, "children">) {
  const cls = cn(iconActionClass, danger && "hover:bg-error/8 hover:text-error-strong")
  if (href)
    return (
      <Link href={href} aria-label={label} title={label} className={cls}>
        <Icon aria-hidden className="size-[18px]" />
      </Link>
    )
  return (
    <button type="button" aria-label={label} title={label} className={cls} {...props}>
      <Icon aria-hidden className="size-[18px]" />
    </button>
  )
}

/** Figma "Search Field" (48px). */
export function AdminSearch({ className, label, ...props }: { label: string } & React.ComponentProps<"input">) {
  return (
    <div className={cn("relative", className)}>
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-ink-muted" />
      <input
        type="search"
        aria-label={label}
        className="h-12 w-full rounded-md border border-line bg-white pr-4 pl-11 text-sm text-ink outline-none placeholder:text-ink-muted/80 focus-visible:border-teal focus-visible:ring-3 focus-visible:ring-teal/30"
        {...props}
      />
    </div>
  )
}

/** Toolbar filter (Figma "Filter / …": 48px bordered dropdown). */
export function FilterSelect({
  label,
  options,
  className,
  ...props
}: { label: string; options: { value: string; label: string }[] } & React.ComponentProps<"select">) {
  return (
    <div className={cn("relative", className)}>
      <select
        aria-label={label}
        className="h-12 w-full cursor-pointer appearance-none rounded-md border border-line bg-white pr-10 pl-3.5 text-sm font-medium text-ink outline-none hover:border-ink-muted/60 focus-visible:border-teal focus-visible:ring-3 focus-visible:ring-teal/30"
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-muted" />
    </div>
  )
}

/** Tablet / mobile filter chips (Figma "chipRow"). */
export function ChipFilter<V extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  options: { value: V; label: string }[]
  value: V
  onChange: (v: V) => void
  className?: string
}) {
  return (
    <div role="group" aria-label={label} className={cn("-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0", className)}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-teal/50",
              on ? "border-navy bg-navy text-white" : "border-line bg-white text-ink hover:border-navy"
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
