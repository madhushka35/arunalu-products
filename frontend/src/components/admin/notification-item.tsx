import { ClipboardList, Globe, Mail, RefreshCw } from "lucide-react"

import type { SampleNotification } from "@/features/admin/sample-data"
import { cn } from "@/lib/utils"

const ICON = { order: ClipboardList, export: Globe, contact: Mail, status: RefreshCw } as const

/** Figma "Notification Item": Unread = teal 6% tint + dot. */
export function NotificationItem({ n }: { n: SampleNotification }) {
  const Icon = ICON[n.kind]
  return (
    <div className={cn("flex items-start gap-3.5 rounded-lg p-4", n.unread && "bg-teal/6")}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-white">
        <Icon aria-hidden className="size-[18px] text-teal-strong" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm font-semibold text-navy">
          {n.title}
          {n.unread && <span className="sr-only"> (unread)</span>}
        </p>
        <p className="truncate text-sm text-ink-muted">{n.description}</p>
        <p className="text-xs text-ink-muted">{n.time}</p>
      </div>
      {n.unread && <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-teal" />}
    </div>
  )
}
