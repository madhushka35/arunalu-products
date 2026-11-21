"use client"

import * as React from "react"
import { X } from "lucide-react"

import { ctaClassName } from "@/components/public/cta-link"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"

type FormDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  submitLabel: string
  /** Return true to close the drawer (validation passed). */
  onSubmit: (data: FormData, form: HTMLFormElement) => boolean
  children: React.ReactNode
}

/**
 * Figma "Add Category Drawer" pattern: 480px right drawer, header with close,
 * scrolling body, Cancel / primary action footer. Children are remounted on
 * every open (Base UI unmounts closed popups), so forms start fresh.
 */
export function FormDrawer({ open, onOpenChange, title, submitLabel, onSubmit, children }: FormDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton={false} className="w-full gap-0 bg-white p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[480px]">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            if (onSubmit(new FormData(e.currentTarget), e.currentTarget)) onOpenChange(false)
          }}
          className="flex h-full flex-col"
        >
          <div className="flex items-center justify-between border-b border-line py-4 pr-4 pl-5 md:pl-7">
            <SheetTitle className="font-heading text-lg font-bold text-navy">{title}</SheetTitle>
            <SheetDescription className="sr-only">{title} form</SheetDescription>
            <SheetClose aria-label="Close" className="flex size-11 items-center justify-center rounded-full text-navy outline-none hover:bg-surface focus-visible:ring-3 focus-visible:ring-teal/50">
              <X aria-hidden className="size-5" />
            </SheetClose>
          </div>
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5 md:p-7">{children}</div>
          <div className="flex justify-end gap-3 border-t border-line px-5 py-4 md:px-7">
            <SheetClose className={ctaClassName("outline", "h-11")}>Cancel</SheetClose>
            <button type="submit" className={ctaClassName("primary", "h-11")}>
              {submitLabel}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
