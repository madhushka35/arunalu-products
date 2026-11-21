"use client"

import * as React from "react"
import { AlertDialog as AD } from "@base-ui/react/alert-dialog"

import { ctaClassName } from "@/components/public/cta-link"
import { cn } from "@/lib/utils"

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: React.ReactNode
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
}

/**
 * Figma "Modal": 480 wide, radius 12, Deep Navy 60% overlay, focus trapped,
 * Esc closes, primary action on the right.
 */
export function ConfirmDialog({ open, onOpenChange, title, message, confirmLabel, danger, onConfirm }: ConfirmDialogProps) {
  return (
    <AD.Root open={open} onOpenChange={onOpenChange}>
      <AD.Portal>
        <AD.Backdrop className="fixed inset-0 z-50 bg-navy/60 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <AD.Popup className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-40px)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_24px_48px_rgba(11,31,51,0.24)] outline-none transition-all duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 md:p-8">
          <AD.Title className="font-heading text-xl font-bold text-navy">{title}</AD.Title>
          <AD.Description className="text-sm leading-relaxed text-ink-muted">{message}</AD.Description>
          <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AD.Close className={ctaClassName("outline", "h-11")}>Cancel</AD.Close>
            <button
              type="button"
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
              className={ctaClassName("primary", cn("h-11", danger && "bg-error-strong text-white hover:bg-error-strong/90 focus-visible:ring-error/40"))}
            >
              {confirmLabel}
            </button>
          </div>
        </AD.Popup>
      </AD.Portal>
    </AD.Root>
  )
}
