"use client"

import * as React from "react"
import { CircleCheck, Mail, MessageCircle } from "lucide-react"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { AdminPageHeader, Panel, StatusBadge } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { FormBanner } from "@/components/public/forms/form-banner"
import { statusesFor, requestConfig, type AdminRequest, type HistoryEntry, type NoteEntry } from "@/features/admin/requests"
import type { RequestStatus } from "@/features/admin/sample-data"
import { cn } from "@/lib/utils"

const label = (s: RequestStatus) => (s === "Rejected or Closed" ? "Rejected / Closed" : s)

function Card({ title, children, aside, className }: { title: string; children: React.ReactNode; aside?: React.ReactNode; className?: string }) {
  return (
    <Panel className={cn("flex flex-col gap-4 p-5 md:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-bold text-navy">{title}</h2>
        {aside}
      </div>
      {children}
    </Panel>
  )
}

/** Figma "kv" rows: label column + value, divided rows. */
function KeyValues({ rows }: { rows: { label: string; value?: React.ReactNode }[] }) {
  return (
    <dl className="border-t border-line">
      {rows
        .filter((r) => r.value)
        .map((r) => (
          <div key={r.label} className="grid grid-cols-[112px_1fr] gap-3 border-b border-line py-3 text-sm md:grid-cols-[180px_1fr]">
            <dt className="text-ink-muted">{r.label}</dt>
            <dd className="min-w-0 break-words text-ink">{r.value}</dd>
          </div>
        ))}
    </dl>
  )
}

function StatusControl({
  id,
  current,
  options,
  next,
  setNext,
  onUpdate,
  layout,
}: {
  id: string
  current: RequestStatus
  options: RequestStatus[]
  next: RequestStatus | ""
  setNext: (s: RequestStatus) => void
  onUpdate: () => void
  layout: "header" | "card"
}) {
  return (
    <div className={cn("flex gap-3", layout === "header" ? "items-center" : "flex-col")}>
      <div className={cn("relative", layout === "header" ? "w-[220px]" : "w-full")}>
        <label htmlFor={id} className="sr-only">
          Change status
        </label>
        <select
          id={id}
          value={next}
          onChange={(e) => setNext(e.target.value as RequestStatus)}
          className="h-11 w-full cursor-pointer rounded-md border border-line bg-white px-3.5 text-sm text-ink outline-none hover:border-ink-muted/60 focus-visible:border-teal focus-visible:ring-3 focus-visible:ring-teal/30"
        >
          <option value="">Change status…</option>
          {options
            .filter((s) => s !== current)
            .map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
        </select>
      </div>
      <button type="button" disabled={!next} onClick={onUpdate} className={ctaClassName("primary", cn("h-11", layout === "card" && "w-full"))}>
        Update status
      </button>
    </div>
  )
}

/**
 * Figma "Admin – 09 Order Details" (+ 09b update-status modal, 09c status
 * updated), "11 Export Inquiry Details" and the tablet / mobile details
 * frames. Status changes, notes and contact actions are local previews.
 */
export function RequestDetails({ request }: { request: AdminRequest }) {
  const cfg = requestConfig[request.kind]
  const [status, setStatus] = React.useState(request.status)
  const [next, setNext] = React.useState<RequestStatus | "">("")
  const [confirm, setConfirm] = React.useState(false)
  const [history, setHistory] = React.useState<HistoryEntry[]>(request.history)
  const [notes, setNotes] = React.useState<NoteEntry[]>(request.notes)
  const [note, setNote] = React.useState("")
  const [done, setDone] = React.useState<string | null>(null)
  const bannerRef = React.useRef<HTMLDivElement>(null)
  const options = statusesFor(request.kind)
  const phoneDigits = request.phone?.replace(/\D/g, "")

  function applyStatus() {
    if (!next) return
    const from = status
    setStatus(next)
    setHistory((h) => [...h, { status: next, note: "Updated by Admin User", when: "Just now" }])
    setDone(`${request.reference} is now ${label(next)} (was ${label(from)}). Preview only — not saved; the activity log is added with the backend.`)
    setNext("")
    requestAnimationFrame(() => bannerRef.current?.focus())
  }

  const control = (layout: "header" | "card") => (
    <StatusControl id={`status-${layout}`} current={status} options={options} next={next} setNext={setNext} onUpdate={() => setConfirm(true)} layout={layout} />
  )

  return (
    <>
      <AdminPageHeader
        title={`${request.reference} (sample)`}
        subtitle={`${cfg.singular.charAt(0).toUpperCase()}${cfg.singular.slice(1)} · received ${request.received}`}
        actions={
          <span className="hidden items-center gap-3 xl:flex">
            <StatusBadge status={status} />
            {control("header")}
          </span>
        }
      />

      {done && (
        <FormBanner kind="success" ref={bannerRef}>
          <strong className="font-semibold">Status updated.</strong> {done}
        </FormBanner>
      )}

      <div className="flex flex-col gap-4 md:gap-5 xl:flex-row xl:items-start xl:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5 xl:gap-6">
          <Card title="Status" className="xl:hidden" aside={<StatusBadge status={status} />}>
            {control("card")}
          </Card>

          <Card title={cfg.detailsTitle}>
            <KeyValues rows={request.details} />
          </Card>

          <Card
            title={cfg.personTitle}
            aside={
              <span className="hidden gap-2 md:flex">
                <a href={`mailto:${request.email}?subject=${encodeURIComponent(request.reference)}`} className={ctaClassName("outline", "h-11 px-4")}>
                  <Mail aria-hidden className="size-4" /> Email
                </a>
                {phoneDigits && (
                  <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer" className={ctaClassName("dark", "h-11 px-4")}>
                    <MessageCircle aria-hidden className="size-4" /> WhatsApp
                  </a>
                )}
              </span>
            }
          >
            <KeyValues
              rows={[
                { label: request.kind === "export" ? "Contact person" : "Full name", value: request.name },
                { label: "Company", value: request.company },
                { label: "Email", value: request.email },
                { label: "Phone / WhatsApp", value: request.phone },
                { label: "Country", value: request.country },
              ]}
            />
            <span className="flex gap-2.5 md:hidden">
              <a href={`mailto:${request.email}?subject=${encodeURIComponent(request.reference)}`} className={ctaClassName("outline", "h-11 flex-1 px-4")}>
                Email
              </a>
              {phoneDigits && (
                <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer" className={ctaClassName("dark", "h-11 flex-1 px-4")}>
                  WhatsApp
                </a>
              )}
            </span>
          </Card>

          <Card title={cfg.messageTitle}>
            <p className="text-base leading-relaxed whitespace-pre-line text-ink">{request.message}</p>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:gap-5 xl:w-[400px] xl:shrink-0 xl:gap-6">
          <Card title="Status history">
            <ol className="flex flex-col gap-4">
              {history.map((h, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="mt-1.5 size-2.5 shrink-0 rounded-full bg-teal" />
                  <span className="flex flex-col items-start gap-1">
                    <StatusBadge status={h.status} />
                    <span className="text-xs text-ink-muted">
                      {h.note} · {h.when}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Internal notes">
            {notes.length > 0 && (
              <ul className="flex flex-col gap-2.5">
                {notes.map((n, i) => (
                  <li key={i} className="flex flex-col gap-1 rounded-md bg-surface p-3">
                    <span className="text-sm text-ink">{n.text}</span>
                    <span className="text-xs text-ink-muted">
                      {n.by} · {n.when}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!note.trim()) return
                setNotes((l) => [...l, { text: note.trim(), by: "Admin User", when: "Just now (not saved)" }])
                setNote("")
              }}
              className="flex flex-col gap-3"
            >
              <label htmlFor="note" className="text-sm font-medium text-ink">
                Add note
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="Visible to admins only"
                className="min-h-[88px] w-full resize-y rounded-md border border-line bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-ink-muted/80 hover:border-ink-muted/60 focus-visible:border-teal focus-visible:ring-3 focus-visible:ring-teal/30"
              />
              <button type="submit" disabled={!note.trim()} className={ctaClassName("outline", "h-11 self-start max-md:w-full")}>
                Add note
              </button>
            </form>
          </Card>

          <Card title="Notifications">
            <ul className="flex flex-col gap-2.5">
              {["Dashboard notification created", `Email sent to ${cfg.notifyEmail}`, "Customer confirmation email sent"].map((x) => (
                <li key={x} className="flex items-center gap-2.5 text-sm text-ink">
                  <CircleCheck aria-hidden className="size-4 shrink-0 text-success" />
                  {x}
                </li>
              ))}
            </ul>
            <p className="text-xs text-ink-muted">Sample — email delivery is set up with the backend.</p>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={`Update ${cfg.singular} status?`}
        message={
          <>
            {request.reference} (sample) will move from <strong className="font-semibold text-ink">{label(status)}</strong> to{" "}
            <strong className="font-semibold text-ink">{next ? label(next) : "—"}</strong>. This action is recorded in the activity log.
          </>
        }
        confirmLabel="Update status"
        onConfirm={applyStatus}
      />
    </>
  )
}
