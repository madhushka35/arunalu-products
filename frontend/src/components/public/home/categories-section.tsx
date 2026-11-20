import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/public/reveal"
import { categories } from "@/features/home/content"

/**
 * 05 Product Categories.
 * Desktop: 4 tiles × 460px. Tablet: 2×2 × 240px. Mobile: 2×2 × 200px (title only).
 */
export function CategoriesSection() {
  return (
    <section aria-labelledby="categories-title" className="section-y bg-white">
      <div className="container-site flex flex-col gap-5 md:gap-8 xl:gap-12">
        <Reveal className="flex flex-col gap-4">
          <p className="type-overline text-teal-strong">
            <span className="hidden xl:inline">{categories.overline}</span>
            <span className="xl:hidden">{categories.overlineMobile}</span>
          </p>
          <h2 id="categories-title" className="type-h2 max-w-[720px] text-navy">
            <span className="hidden xl:inline">{categories.title}</span>
            <span className="xl:hidden">{categories.titleMobile}</span>
          </h2>
        </Reveal>

        <ul className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4 xl:gap-6">
          {categories.items.map((cat, i) => (
            <Reveal as="li" index={i} key={cat.href}>
              <Link
                href={cat.href}
                className="group relative flex h-[200px] flex-col justify-end overflow-hidden rounded-sm bg-navy p-4 text-white outline-none focus-visible:ring-3 focus-visible:ring-teal/60 md:h-[240px] md:p-6 xl:h-[460px] xl:p-7"
              >
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] motion-reduce:transition-none"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-b from-navy/5 to-navy/90"
                />
                <span className="relative flex flex-col gap-2">
                  <span className="hidden type-overline text-teal xl:block">0{i + 1}</span>
                  <span className="font-heading text-[22px] leading-tight font-semibold md:type-h3 xl:type-h3">
                    {cat.name}
                  </span>
                  <span className="hidden text-sm text-white/70 xl:block">{cat.text}</span>
                  <span className="mt-1 hidden items-center gap-2 type-button text-teal transition-colors group-hover:text-white xl:inline-flex">
                    Explore
                    <ArrowRight
                      aria-hidden
                      className="size-[18px] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
