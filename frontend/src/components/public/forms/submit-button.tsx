import { ArrowRight, LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  pending?: boolean
  pendingLabel?: string
  children: React.ReactNode
  block?: boolean
  className?: string
  type?: "submit" | "button"
  onClick?: () => void
  icon?: boolean
}

/** Figma Button / Primary with the "Loading" state (spinner, disabled). */
export function SubmitButton({
  pending,
  pendingLabel = "Sending…",
  children,
  block,
  className,
  type = "submit",
  onClick,
  icon = true,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={pending}
      aria-disabled={pending || undefined}
      className={cn(
        "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-teal px-6 type-button text-navy outline-none transition-colors hover:bg-[#13a69f] focus-visible:ring-3 focus-visible:ring-teal/60 disabled:cursor-wait disabled:opacity-80",
        block && "w-full",
        className
      )}
    >
      {pending ? (
        <>
          <LoaderCircle aria-hidden className="size-[18px] animate-spin" />
          {pendingLabel}
        </>
      ) : (
        <>
          {children}
          {icon && <ArrowRight aria-hidden className="size-[18px]" />}
        </>
      )}
    </button>
  )
}

/** Figma Button / Outline (used for "Back"). */
export function OutlineButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-12 shrink-0 items-center justify-center rounded-lg border border-navy px-6 type-button text-navy outline-none transition-colors hover:bg-navy hover:text-white focus-visible:ring-3 focus-visible:ring-teal/60 disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  )
}
