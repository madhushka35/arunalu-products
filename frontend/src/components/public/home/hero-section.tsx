import Image from "next/image"

import { CtaLink } from "@/components/public/cta-link"
import { HeroStage } from "@/components/public/home/hero-stage"
import { HeroWaves } from "@/components/public/home/hero-waves"
import { hero } from "@/features/home/content"

/**
 * 02 Hero.
 * - Desktop ≥1280: "Cinematic 3D" (900px, content left, 3D stage right).
 * - Tablet 768–1279: reduced hero, content + static render below.
 * - Mobile <768: lightweight fallback (no WebGL), static image at the bottom.
 */
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-gradient-to-b from-ocean to-navy text-white"
    >
      {/* Depth / Glow orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[40px] left-[140px] size-[360px] rounded-full bg-teal/25 blur-[120px] xl:top-[60px] xl:left-[calc(50%+100px)] xl:size-[680px] xl:bg-teal/26 xl:blur-[200px]" />
        <div className="absolute top-[420px] -left-[160px] size-[360px] rounded-full bg-ocean/70 blur-[120px] xl:top-[480px] xl:-left-[220px] xl:size-[600px] xl:blur-[180px]" />
        <div className="absolute top-[560px] left-[calc(50%+400px)] hidden size-[420px] rounded-full bg-sand/12 blur-[160px] xl:block" />
        <HeroWaves className="absolute bottom-[-20px] left-0 hidden h-[460px] w-full xl:block" />
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <HeroStage />

        <div className="container-site relative flex min-h-[844px] flex-col pt-28 pb-10 md:min-h-0 md:pt-[140px] md:pb-20 xl:h-[900px] xl:justify-start xl:pt-[230px] xl:pb-0">
          <div className="flex max-w-[800px] flex-col gap-5 md:gap-6 xl:gap-7">
            <p className="type-overline text-teal">
              <span className="md:hidden">{hero.overlineMobile}</span>
              <span className="hidden md:inline">{hero.overline}</span>
            </p>
            <h1
              id="hero-title"
              className="type-hero max-w-[600px] uppercase xl:max-w-[800px]"
            >
              {hero.headline[0]}
              <br />
              {hero.headline[1]}
            </h1>
            <p className="max-w-[520px] text-base leading-relaxed text-white/75 md:text-lg">
              {hero.description}
            </p>
            <div className="flex flex-col gap-3 pt-2 md:flex-row md:gap-4 md:pt-3">
              <CtaLink href={hero.primary.href} icon block className="md:w-auto">
                {hero.primary.label}
              </CtaLink>
              <CtaLink
                href={hero.secondary.href}
                variant="outline-light"
                icon
                block
                className="md:w-auto"
              >
                <span className="md:hidden xl:inline">{hero.secondary.label}</span>
                <span className="hidden md:inline xl:hidden">{hero.secondaryTablet}</span>
              </CtaLink>
            </div>
          </div>

          {/* Static hero image — tablet & mobile (no WebGL) */}
          <div className="relative mt-auto h-[200px] overflow-hidden rounded-md bg-ocean pt-0 md:mt-10 md:h-[320px] xl:hidden">
            <Image
              src="/images/products/head-on-sprats-200g.jpg"
              alt="Arunalu Head-on Sprats 200g pack"
              fill
              sizes="(min-width: 768px) 90vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>

        {/* Scroll indicator (desktop) */}
        <div
          aria-hidden
          className="absolute bottom-[56px] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 xl:flex"
        >
          <span className="flex h-[42px] w-[26px] justify-center rounded-full border border-white/40 pt-2">
            <span className="size-1.5 rounded-full bg-teal motion-safe:animate-[scroll-dot_1.8s_ease-in-out_infinite]" />
          </span>
          <span className="type-overline text-white/60">Scroll</span>
        </div>
      </div>
    </section>
  )
}
