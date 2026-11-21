"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { FieldShell } from "@/components/public/forms/fields"
import { products } from "@/features/products/catalog"
import { cn } from "@/lib/utils"

type Props = {
  id: string
  label: string
  name: string
  defaultValue?: string[]
  error?: string
  onChange?: (values: string[]) => void
}

/**
 * Figma "Dropdown" (Interested product *) that allows several products
 * (report §6.1 "Interested product(s)"; Stage 5 plan Q2).
 * Built on <details> + real checkboxes, so it also submits without JavaScript.
 */
export function ProductMultiSelect({ id, label, name, defaultValue = [], error, onChange }: Props) {
  const [selected, setSelected] = React.useState<string[]>(defaultValue)
  const details = React.useRef<HTMLDetailsElement>(null)

  // Close when clicking outside or pressing Escape.
  React.useEffect(() => {
    const el = details.current
    if (!el) return
    const onDown = (e: PointerEvent) => {
      if (el.open && !el.contains(e.target as Node)) el.open = false
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        el.open = false
        el.querySelector("summary")?.focus()
      }
    }
    document.addEventListener("pointerdown", onDown)
    el.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      el.removeEventListener("keydown", onKey)
    }
  }, [])

  const toggle = (slug: string, on: boolean) => {
    const next = on ? [...selected, slug] : selected.filter((s) => s !== slug)
    const ordered = products.map((p) => p.slug).filter((s) => next.includes(s))
    setSelected(ordered)
    onChange?.(ordered)
  }

  const summary =
    selected.length === 0
      ? "Select product"
      : products
          .filter((p) => selected.includes(p.slug))
          .map((p) => p.name)
          .join(", ")

  return (
    <FieldShell id={id} label={label} required error={error} hint={selected.length === 0 && !error ? "Select one or more products" : undefined}>
      <details ref={details} className="group relative">
        <summary
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "flex h-[52px] cursor-pointer list-none items-center justify-between gap-3 rounded-md border bg-white px-4 text-base outline-none transition-colors focus-visible:ring-3 [&::-webkit-details-marker]:hidden",
            error
              ? "border-error-strong focus-visible:ring-error/25"
              : "border-line hover:border-ink-muted/60 focus-visible:border-teal focus-visible:ring-teal/30"
          )}
        >
          <span className={cn("truncate", selected.length ? "text-ink" : "text-ink-muted/80")}>{summary}</span>
          <ChevronDown aria-hidden className="size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <fieldset className="absolute inset-x-0 top-full z-20 mt-1 flex flex-col rounded-md border border-line bg-white py-1 shadow-[0_16px_40px_-12px_rgb(11_31_51/0.25)]">
          <legend className="sr-only">{label}</legend>
          {products.map((p) => {
            const on = selected.includes(p.slug)
            return (
              <label key={p.slug} className="flex min-h-11 cursor-pointer items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-surface">
                <input
                  type="checkbox"
                  name={name}
                  value={p.slug}
                  checked={on}
                  onChange={(e) => toggle(p.slug, e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "flex size-[18px] shrink-0 items-center justify-center rounded-sm border peer-focus-visible:ring-3 peer-focus-visible:ring-teal/40",
                    on ? "border-teal bg-teal text-navy" : "border-line bg-white"
                  )}
                >
                  {on && <Check className="size-3.5" />}
                </span>
                <span className="flex-1">
                  {p.name} <span className="text-ink-muted">· {p.packSize}</span>
                </span>
              </label>
            )
          })}
        </fieldset>
      </details>
    </FieldShell>
  )
}
