import * as React from "react"
import { CircleAlert, CircleCheck, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const KINDS = {
  error: { box: "border-error/35 bg-error/8", icon: CircleAlert, color: "text-error-strong" },
  success: { box: "border-success/35 bg-success/8", icon: CircleCheck, color: "text-success-strong" },
  warning: { box: "border-warning/35 bg-warning/10", icon: Info, color: "text-warning-strong" },
} as const

type BannerProps = {
  kind: keyof typeof KINDS
  children: React.ReactNode
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

/** Figma "Banner / error | success | warning". Focusable so errors can be announced. */
export function FormBanner({ kind, children, className, ref }: BannerProps) {
  const k = KINDS[kind]
  const Icon = k.icon
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={kind === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-md border p-4 text-sm text-ink outline-none", k.box, className)}
    >
      <Icon aria-hidden className={cn("mt-px size-5 shrink-0", k.color)} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
