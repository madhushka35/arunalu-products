import Image from "next/image"
import { ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Placeholder tones from the Figma image placeholders. */
const TONES = {
  dark: "from-[#1b5675] to-[#0b1f33] text-white/55",
  deep: "from-[#2a7393] to-[#123f5a] text-white/55",
  sand: "from-[#f3ead8] to-[#d8c397] text-navy/55",
  light: "from-[#eef3f5] to-[#cfdce3] text-navy/55",
} as const

export type MediaTone = keyof typeof TONES

type MediaImageProps = {
  /** Image path. `null` = asset not supplied yet → tonal placeholder (same box). */
  src: string | null
  alt: string
  /** Shown on the placeholder only ("" hides it). */
  label?: string
  tone?: MediaTone
  sizes: string
  fit?: "cover" | "contain"
  priority?: boolean
  className?: string
  imageClassName?: string
}

/**
 * Fills its (relatively positioned, sized) parent with an image, or with the
 * design's tonal placeholder when the asset is not available yet.
 */
export function MediaImage({
  src,
  alt,
  label,
  tone = "deep",
  sizes,
  fit = "cover",
  priority,
  className,
  imageClassName,
}: MediaImageProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-gradient-to-br",
          TONES[tone],
          className
        )}
      >
        {label !== "" && (
          <span className="flex items-center gap-2 px-4 text-center text-xs">
            <ImageIcon aria-hidden className="size-4 shrink-0" />
            {label ?? "Image to be supplied"}
          </span>
        )}
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn(
        fit === "contain" ? "object-contain" : "object-cover",
        imageClassName,
        className
      )}
    />
  )
}
