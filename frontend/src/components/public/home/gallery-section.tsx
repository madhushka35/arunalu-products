import Link from "next/link"
import { Play } from "lucide-react"

import { CtaLink } from "@/components/public/cta-link"
import { MediaImage } from "@/components/public/media-image"
import { Reveal } from "@/components/public/reveal"
import { gallery, illustrative } from "@/features/home/content"
import { cn } from "@/lib/utils"

type Tile = {
  category: string
  caption: string
  src: string | null
  video?: boolean
}

/** Masonry tiles as placed in Figma (columns: 1 / 2 / 2). */
const COLUMNS: Tile[][] = [
  [{ category: "Facilities", caption: "Processing floor", src: illustrative.facility }],
  [
    { category: "Products", caption: "Head-on Sprats · 200g", src: "/images/products/head-on-sprats-200g.jpg" },
    { category: "Packaging", caption: "Packing line", src: illustrative.packaging },
  ],
  [
    { category: "Production", caption: "Drying process video", src: illustrative.drying, video: true },
    { category: "Team", caption: "Production team", src: illustrative.team },
  ],
]

function GalleryTile({ tile, className, compact }: { tile: Tile; className?: string; compact?: boolean }) {
  const isProduct = tile.src?.startsWith("/images/products")
  return (
    <Link
      href={gallery.cta.href}
      className={cn(
        "group relative block overflow-hidden rounded-sm bg-navy outline-none focus-visible:ring-3 focus-visible:ring-teal/60",
        className
      )}
    >
      <MediaImage
        src={tile.src}
        alt={`${tile.caption}${isProduct ? "" : " — illustrative image"}`}
        label={tile.video ? "" : `${tile.category} image`}
        tone="deep"
        sizes={compact ? "50vw" : "(min-width: 1280px) 410px, 33vw"}
        imageClassName="transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
      />
      {tile.video && (
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-navy md:size-16"
        >
          <Play className="size-5 fill-navy md:size-[22px]" />
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-b from-navy/0 to-navy/85 px-3 pt-8 pb-3 md:px-5 md:pt-10 md:pb-5">
        <span className="type-overline text-sand">{tile.category}</span>
        {!compact && <span className="text-base text-white">{tile.caption}</span>}
      </span>
    </Link>
  )
}

/** 11 Gallery Preview. Desktop/tablet: 3-column masonry. Mobile: 2×2. */
export function GallerySection() {
  const mobileTiles = [COLUMNS[0][0], COLUMNS[2][0], COLUMNS[1][0], COLUMNS[1][1]]
  return (
    <section aria-labelledby="gallery-title" className="section-y bg-white">
      <div className="container-site flex flex-col gap-5 md:gap-8 xl:gap-12">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-4">
            <p className="type-overline text-teal-strong">{gallery.overline}</p>
            <h2 id="gallery-title" className="type-h2 text-navy">
              {gallery.title}
            </h2>
          </div>
          <CtaLink href={gallery.cta.href} variant="outline" icon className="hidden md:inline-flex">
            {gallery.cta.label}
          </CtaLink>
        </Reveal>

        <div className="hidden h-[480px] grid-cols-3 gap-6 md:grid xl:h-[640px]">
          {COLUMNS.map((col, c) => (
            <Reveal key={c} index={c} className="flex flex-col gap-6">
              {col.map((tile) => (
                <GalleryTile key={tile.caption} tile={tile} className="flex-1" />
              ))}
            </Reveal>
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-3 md:hidden">
          {mobileTiles.map((tile) => (
            <li key={tile.caption}>
              <GalleryTile tile={tile} compact className="h-[150px]" />
            </li>
          ))}
        </ul>

        <CtaLink href={gallery.cta.href} variant="outline" icon block className="md:hidden">
          {gallery.cta.label}
        </CtaLink>
      </div>
    </section>
  )
}
