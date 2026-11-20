"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Fish,
  Layers,
  Package,
  Shrimp,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  megaMenuCategories,
  megaMenuExplore,
  megaMenuFeatured,
  type CategoryLink,
} from "@/config/site"
import { cn } from "@/lib/utils"

const OPEN_DELAY = 150
const CLOSE_DELAY = 200

const ICONS: Record<CategoryLink["icon"], React.ElementType> = {
  fish: Fish,
  layers: Layers,
  shrimp: Shrimp,
  package: Package,
}

type ProductsMegaMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Text colour of the trigger: "light" on the transparent header, "dark" on the solid header. */
  tone: "light" | "dark"
  active: boolean
  linkClassName: string
}

/**
 * Desktop "Products" navigation item with its mega menu panel.
 * - Opens on hover (150ms intent delay) or via the chevron button (click / Enter / Space).
 * - Closes on mouse leave, Esc (focus returns to the chevron), outside click,
 *   focus leaving the menu, or when a link inside it is chosen.
 * The panel is positioned against the closest positioned ancestor (the header).
 */
export function ProductsMegaMenu({
  open,
  onOpenChange,
  tone,
  active,
  linkClassName,
}: ProductsMegaMenuProps) {
  const panelId = React.useId()
  const rootRef = React.useRef<HTMLLIElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = React.useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }, [])

  const schedule = React.useCallback(
    (next: boolean) => {
      clearTimer()
      timer.current = setTimeout(
        () => onOpenChange(next),
        next ? OPEN_DELAY : CLOSE_DELAY
      )
    },
    [clearTimer, onOpenChange]
  )

  React.useEffect(() => clearTimer, [clearTimer])

  // Esc + outside click while open.
  React.useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        clearTimer()
        onOpenChange(false)
        triggerRef.current?.focus()
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        clearTimer()
        onOpenChange(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open, onOpenChange, clearTimer])

  const close = () => {
    clearTimer()
    onOpenChange(false)
  }

  return (
    <li
      ref={rootRef}
      className="flex h-full items-center"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") schedule(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") schedule(false)
      }}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null
        if (open && (!next || !rootRef.current?.contains(next))) close()
      }}
    >
      <div className="flex items-center">
        <Link
          href="/products"
          className={linkClassName}
          aria-current={active ? "page" : undefined}
          data-active={active || undefined}
          onClick={close}
        >
          Products
        </Link>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label="Show product categories"
          onClick={() => {
            clearTimer()
            onOpenChange(!open)
          }}
          className={cn(
            "-ml-1 inline-flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/60",
            tone === "light"
              ? "text-white hover:text-teal"
              : "text-navy hover:text-teal-strong"
          )}
        >
          <ChevronDown
            aria-hidden
            className={cn(
              "size-4 transition-transform duration-200 motion-reduce:transition-none",
              open && "rotate-180"
            )}
          />
        </button>
      </div>

      {open && (
        <div
          id={panelId}
          role="region"
          aria-label="Products menu"
          className="absolute inset-x-0 top-full border-t border-line bg-white text-ink shadow-[0_16px_40px_-12px_rgb(11_31_51/0.25)] animate-in fade-in-0 slide-in-from-top-1 duration-150 motion-reduce:animate-none"
          onPointerEnter={clearTimer}
        >
          <div className="container-site grid grid-cols-[minmax(0,460px)_minmax(0,380px)_minmax(0,1fr)] gap-12 pt-10 pb-12">
            {/* Categories */}
            <div>
              <p className="mb-2 type-overline text-teal-strong">
                Product categories
              </p>
              <ul className="flex flex-col gap-1">
                {megaMenuCategories.map((category) => {
                  const Icon = ICONS[category.icon]
                  return (
                    <li key={category.href}>
                      <Link
                        href={category.href}
                        onClick={close}
                        className="group flex items-center gap-4 rounded-md px-4 py-3.5 outline-none transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface transition-colors group-hover:bg-white">
                          <Icon aria-hidden className="size-5 text-teal-strong" />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="text-sm font-semibold text-navy">
                            {category.label}
                          </span>
                          <span className="text-[13px] text-ink-muted">
                            {category.description}
                          </span>
                        </span>
                        <ChevronRight
                          aria-hidden
                          className="size-[18px] text-ink-muted transition-colors group-hover:text-teal-strong"
                        />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Featured product */}
            <div className="flex flex-col gap-4">
              <p className="type-overline text-teal-strong">Featured product</p>
              <Link
                href={megaMenuFeatured.href}
                onClick={close}
                className="group flex flex-col gap-4 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="relative block h-[260px] overflow-hidden rounded-sm bg-surface">
                  <Image
                    src={megaMenuFeatured.image}
                    alt={megaMenuFeatured.imageAlt}
                    fill
                    sizes="380px"
                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </span>
                <span className="font-heading text-[22px] font-bold leading-tight text-navy">
                  {megaMenuFeatured.label}
                </span>
                <span className="text-sm text-ink-muted">
                  Pack size: {megaMenuFeatured.packSize}
                </span>
                <span className="inline-flex items-center gap-2 type-button text-teal-strong">
                  View product
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </div>

            {/* Explore */}
            <div className="flex flex-col gap-3.5">
              <p className="type-overline text-teal-strong">Explore</p>
              <ul className="flex flex-col gap-3.5">
                {megaMenuExplore.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="rounded-sm text-base text-navy outline-none transition-colors hover:text-teal-strong focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/products"
                onClick={close}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "mt-2 h-11 self-start border-navy px-5 type-button text-navy hover:bg-navy hover:text-white"
                )}
              >
                View all products
              </Link>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
