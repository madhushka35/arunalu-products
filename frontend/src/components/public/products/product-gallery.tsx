"use client"

import * as React from "react"
import Image from "next/image"
import { Plus, X } from "lucide-react"

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type GalleryImage = { src: string; alt: string; label: string }

/**
 * Figma "Product Image Gallery".
 * Desktop/tablet: 4:5 main image + zoom button + thumbnails (photo, original photo).
 * Mobile: swipe gallery (scroll-snap) with pager dots.
 * Zoom opens a lightbox dialog (Esc / close button, focus returned).
 */
export function ProductGallery({
  images,
  name,
  variant,
}: {
  images: GalleryImage[]
  name: string
  /** "mobile" = swipe gallery (<768px); "desktop" = main image + thumbnails (≥768px). */
  variant: "mobile" | "desktop"
}) {
  const [active, setActive] = React.useState(0)
  const [zoom, setZoom] = React.useState(false)
  const track = React.useRef<HTMLDivElement>(null)
  const current = images[active]

  const onScroll = () => {
    const el = track.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== active) setActive(i)
  }

  if (variant === "mobile") {
    return (
      <div className="relative">
        <div
          ref={track}
          onScroll={onScroll}
          className="flex h-[488px] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={`${name} images`}
          role="region"
          tabIndex={0}
        >
          {images.map((img, i) => (
            <div key={img.src} className="relative h-full w-full shrink-0 snap-center bg-surface">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                loading={i === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden>
          {images.map((img, i) => (
            <span
              key={img.src}
              className={cn("size-1.5 rounded-full bg-white", i === active ? "opacity-100" : "opacity-50")}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {/* Tablet / desktop main image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1280px) 560px, 100vw"
          className="object-cover animate-in fade-in-0 duration-300 motion-reduce:animate-none"
        />
        <button
          type="button"
          onClick={() => setZoom(true)}
          aria-label="Zoom image"
          className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-full bg-white text-navy shadow-sm outline-none transition-colors hover:bg-sand focus-visible:ring-3 focus-visible:ring-teal/60"
        >
          <Plus aria-hidden className="size-[18px]" />
        </button>
      </div>

      {/* Thumbnails */}
      <ul className="flex gap-3" aria-label="Choose image">
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={img.label}
              className={cn(
                "relative block h-[100px] w-20 overflow-hidden rounded-md bg-surface outline-none focus-visible:ring-3 focus-visible:ring-teal/60 xl:h-[120px] xl:w-24",
                i === active ? "ring-2 ring-teal" : "ring-1 ring-line hover:ring-ink-muted"
              )}
            >
              <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[92dvh] w-[min(92vw,720px)] max-w-none gap-0 rounded-2xl bg-navy p-0 ring-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">{current.alt}</DialogTitle>
          <div className="relative aspect-[4/5] max-h-[92dvh] w-full">
            <Image src={current.src} alt={current.alt} fill sizes="720px" className="object-contain" />
          </div>
          <DialogClose
            aria-label="Close"
            className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full bg-white text-navy outline-none hover:bg-sand focus-visible:ring-3 focus-visible:ring-teal/60"
          >
            <X aria-hidden className="size-5" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}
