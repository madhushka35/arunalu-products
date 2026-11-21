"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type GalleryItem = { src: string; alt: string; category: string; caption: string; ratio: string }

/**
 * Figma "Gallery – Desktop / Tablet / Mobile" + "Gallery – Lightbox Open":
 * category filters, masonry grid (3 / 2 / 2 columns), lightbox with counter,
 * previous / next (buttons and arrow keys), caption and thumbnails.
 */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))]
  const [filter, setFilter] = React.useState("All")
  const [open, setOpen] = React.useState<number | null>(null)
  const shown = filter === "All" ? items : items.filter((i) => i.category === filter)
  const current = open === null ? null : shown[open]
  const go = (d: number) => setOpen((o) => (o === null ? o : (o + d + shown.length) % shown.length))

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      {categories.length > 2 && (
        <ul aria-label="Filter gallery" className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
          {categories.map((c) => {
            const on = c === filter
            return (
              <li key={c} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "inline-flex h-11 items-center rounded-sm border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-teal/50",
                    on ? "border-navy bg-navy text-white" : "border-line bg-white text-ink hover:border-navy"
                  )}
                >
                  {c}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <ul className="columns-2 gap-3 md:gap-6 xl:columns-3">
        {shown.map((item, i) => (
          <li key={item.src} className="mb-3 break-inside-avoid md:mb-6">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-sm bg-surface text-left outline-none focus-visible:ring-3 focus-visible:ring-teal/60"
              style={{ aspectRatio: item.ratio }}
              aria-label={`Open image: ${item.caption}`}
            >
              <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1280px) 410px, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none" />
              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-b from-navy/0 to-navy/85 px-3 pt-8 pb-3 md:px-5 md:pt-10 md:pb-5">
                <span className="type-overline text-sand">{item.category}</span>
                <span className="hidden text-base text-white md:block">{item.caption}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={current !== null} onOpenChange={(o) => !o && setOpen(null)}>
        {current && (
          <DialogContent
            showCloseButton={false}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(1)
              if (e.key === "ArrowLeft") go(-1)
            }}
            className="flex h-dvh max-h-none w-screen max-w-none flex-col gap-5 rounded-none bg-navy/96 p-4 text-white ring-0 sm:max-w-none md:p-6 xl:px-10"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/70" aria-live="polite">
                {(open ?? 0) + 1} / {shown.length}
              </p>
              <DialogTitle className="sr-only">{current.caption}</DialogTitle>
              <DialogClose aria-label="Close" className="flex size-11 items-center justify-center rounded-full border border-white/30 outline-none hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-teal/60">
                <X aria-hidden className="size-5" />
              </DialogClose>
            </div>
            <div className="flex min-h-0 flex-1 items-center gap-3 md:gap-6">
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="hidden size-12 shrink-0 items-center justify-center rounded-lg bg-white text-navy outline-none hover:bg-sand focus-visible:ring-3 focus-visible:ring-teal/60 md:flex">
                <ArrowLeft aria-hidden className="size-5" />
              </button>
              <div className="relative h-full min-h-0 flex-1">
                <Image key={current.src} src={current.src} alt={current.alt} fill sizes="90vw" className="object-contain animate-in fade-in-0 duration-200 motion-reduce:animate-none" />
              </div>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className="hidden size-12 shrink-0 items-center justify-center rounded-lg bg-white text-navy outline-none hover:bg-sand focus-visible:ring-3 focus-visible:ring-teal/60 md:flex">
                <ArrowRight aria-hidden className="size-5" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="type-overline text-sand">{current.category}</p>
              <p className="text-base">{current.caption}</p>
            </div>
            <div className="flex items-center justify-center gap-3 md:hidden">
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="flex size-11 items-center justify-center rounded-lg bg-white text-navy">
                <ArrowLeft aria-hidden className="size-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className="flex size-11 items-center justify-center rounded-lg bg-white text-navy">
                <ArrowRight aria-hidden className="size-5" />
              </button>
            </div>
            <ul className="hidden justify-center gap-2.5 md:flex" aria-label="Thumbnails">
              {shown.map((it, i) => (
                <li key={it.src}>
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    aria-label={it.caption}
                    aria-current={i === open ? "true" : undefined}
                    className={cn("relative block h-14 w-20 overflow-hidden rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-teal/60", i === open ? "ring-2 ring-teal" : "opacity-60 hover:opacity-100")}
                  >
                    <Image src={it.src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
