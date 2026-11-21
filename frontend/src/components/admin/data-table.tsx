import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export type Column<T> = {
  header: string
  cell: (row: T) => React.ReactNode
  /** Fixed width class, e.g. "w-[150px]". Omitted = grows. */
  width?: string
  /** "xl" = desktop only (tablet keeps the 3–4 key columns). */
  desktopOnly?: boolean
}

type DataTableProps<T> = {
  rows: T[]
  rowKey: (row: T) => string
  columns: Column<T>[]
  /** Below 768px rows become Admin Record Cards (Figma responsive rule). */
  card: (row: T) => { title: string; badge?: React.ReactNode; line1?: string; line2?: string; meta?: string }
  href?: (row: T) => string | undefined
  caption: string
  /** Figma "Table Title" row (e.g. "Recent order requests" + "View all"). */
  title?: string
  action?: React.ReactNode
  className?: string
}

/**
 * Figma "Data Table": header row on surface, 1-line truncated cells.
 * Tablet hides `desktopOnly` columns; mobile renders record cards.
 */
export function DataTable<T>({ rows, rowKey, columns, card, href, caption, title, action, className }: DataTableProps<T>) {
  return (
    <section aria-label={title ?? caption} className={cn("flex flex-col gap-3 md:gap-0", className)}>
      {title && (
        <div className="flex items-center justify-between md:hidden">
          <h2 className="font-heading text-lg font-bold text-navy">{title}</h2>
          {action}
        </div>
      )}
      <div className="hidden overflow-hidden rounded-xl border border-line bg-white md:block">
        {title && (
          <div className="flex min-h-14 items-center justify-between gap-3 border-b border-line px-5 py-3">
            <h2 className="font-heading text-lg font-bold text-navy">{title}</h2>
            {action}
          </div>
        )}
        <table className="w-full table-fixed text-left">
          <caption className="sr-only">{caption}</caption>
          <thead className="border-b border-line bg-surface">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.header}
                  scope="col"
                  className={cn("px-4 py-3 text-xs font-semibold tracking-wide text-ink-muted uppercase", c.width, c.desktopOnly && "hidden xl:table-cell")}
                >
                  {c.header}
                </th>
              ))}
              {href && <th scope="col" className="w-12 xl:hidden"><span className="sr-only">Open</span></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const link = href?.(r)
              return (
                <tr key={rowKey(r)} className={cn("border-b border-line last:border-0", link && "relative transition-colors hover:bg-surface/70")}>
                  {columns.map((c, i) => (
                    <td
                      key={c.header}
                      className={cn("truncate px-4 py-3 text-sm", i === 0 ? "font-medium text-navy" : "text-ink", c.desktopOnly && "hidden xl:table-cell")}
                    >
                      {i === 0 && link ? (
                        <Link href={link} className="outline-none after:absolute after:inset-0 focus-visible:underline">
                          {c.cell(r)}
                        </Link>
                      ) : (
                        c.cell(r)
                      )}
                    </td>
                  ))}
                  {href && (
                    <td className="px-3 xl:hidden">
                      <ChevronRight aria-hidden className="size-[18px] text-ink-muted" />
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden" aria-label={caption}>
        {rows.map((r) => {
          const c = card(r)
          const link = href?.(r)
          const body = (
            <>
              <span className="flex items-center gap-2">
                <span className="flex-1 truncate text-sm font-semibold text-navy">{c.title}</span>
                {c.badge}
              </span>
              {c.line1 && <span className="truncate text-sm text-ink">{c.line1}</span>}
              {c.line2 && <span className="truncate text-sm text-ink-muted">{c.line2}</span>}
              {(c.meta || link) && (
                <span className="flex items-center pt-1">
                  <span className="flex-1 truncate text-xs text-ink-muted">{c.meta}</span>
                  {link && <ChevronRight aria-hidden className="size-[18px] text-ink-muted" />}
                </span>
              )}
            </>
          )
          const cls = "flex min-h-11 flex-col gap-2 rounded-xl border border-line bg-white p-4"
          return (
            <li key={rowKey(r)}>
              {link ? (
                <Link href={link} className={cn(cls, "outline-none focus-visible:ring-3 focus-visible:ring-teal/50")}>
                  {body}
                </Link>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
