"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { CtaLink } from "@/components/public/cta-link"
import { MediaImage } from "@/components/public/media-image"
import { illustrative, journey } from "@/features/home/content"
import { cn } from "@/lib/utils"

const pad = (n: number) => String(n).padStart(2, "0")
const EASE = [0.22, 1, 0.36, 1] as const

/**
 * 06 Production Journey (navy). Interactive: choose a stage on the timeline
 * (desktop) or list (tablet/mobile); previous / next buttons step through.
 */
export function JourneySection() {
  const [active, setActive] = React.useState(journey.initialStage)
  const total = journey.stages.length
  const stage = journey.stages[active]
  const go = (i: number) => setActive((i + total) % total)

  return (
    <section aria-labelledby="journey-title" className="section-y bg-navy text-white">
      <div className="container-site flex flex-col gap-6 md:gap-10 xl:gap-16">
        <div className="flex flex-col gap-4">
          <p className="type-overline text-sand">{journey.overline}</p>
          <h2 id="journey-title" className="type-h2 max-w-[820px]">
            <span className="hidden xl:inline">{journey.title}</span>
            <span className="xl:hidden">{journey.titleMobile}</span>
          </h2>
        </div>

        {/* Desktop timeline */}
        <ol className="hidden grid-cols-10 xl:grid" aria-label="Production stages">
          {journey.stages.map((s, i) => {
            const done = i <= active
            const current = i === active
            return (
              <li key={s.title} className="flex flex-col gap-3.5">
                <div className="flex h-[22px] items-center">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={current ? "step" : undefined}
                    aria-label={`Stage ${pad(i + 1)}: ${s.title}`}
                    className="-m-3 flex size-11 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-teal/60"
                  >
                    <span
                      className={cn(
                        "block rounded-full transition-all duration-200 motion-reduce:transition-none",
                        current ? "size-[22px] border-3 border-white bg-teal" : "size-3.5",
                        !current && (done ? "bg-teal" : "bg-ocean")
                      )}
                    />
                  </button>
                  {i < total - 1 && (
                    <span
                      aria-hidden
                      className={cn(
                        "ml-3 h-0.5 flex-1 transition-colors duration-200",
                        i < active ? "bg-teal" : "bg-white/15"
                      )}
                    />
                  )}
                </div>
                <span className={cn("type-overline", done ? "text-teal" : "text-white/45")}>
                  {pad(i + 1)}
                </span>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-[110px] text-left text-sm leading-snug transition-opacity hover:opacity-100",
                    done ? "opacity-100" : "opacity-55"
                  )}
                >
                  {s.title}
                </button>
              </li>
            )
          })}
        </ol>

        {/* Tablet / mobile list */}
        <ol className="flex flex-col xl:hidden" aria-label="Production stages">
          {journey.stages.map((s, i) => {
            const current = i === active
            return (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex min-h-12 w-full items-center gap-4 rounded-sm px-3.5 py-3.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-teal/60",
                    current ? "bg-teal/14" : "border-b border-white/8"
                  )}
                >
                  <span className={cn("type-overline", i <= active ? "text-teal" : "text-white/45")}>
                    {pad(i + 1)}
                  </span>
                  <span className={cn("text-base", i <= active ? "text-white" : "text-white/60")}>
                    {s.title}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        {/* Active stage (desktop) */}
        <div className="hidden grid-cols-[700px_1fr] items-center gap-16 xl:grid">
          <div className="relative h-[440px] overflow-hidden rounded-md">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <MediaImage
                  src={illustrative[stage.image]}
                  alt={`${stage.title} — illustrative image`}
                  label={`${stage.title} · process photo`}
                  tone="deep"
                  sizes="700px"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-5" aria-live="polite">
            <p className="type-overline text-teal">
              Stage {pad(active + 1)} / {total}
            </p>
            <h3 className="type-h2">{stage.title}</h3>
            {stage.text && (
              <p className="text-lg leading-relaxed text-white/72">{stage.text}</p>
            )}
            <div className="flex items-center gap-3 pt-4">
              <CtaLink href={journey.cta.href} variant="outline-light" icon>
                {journey.cta.label}
              </CtaLink>
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous stage"
                className="flex size-12 items-center justify-center rounded-lg bg-white text-navy outline-none transition-colors hover:bg-sand focus-visible:ring-3 focus-visible:ring-teal/60"
              >
                <ArrowLeft aria-hidden className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next stage"
                className="flex size-12 items-center justify-center rounded-lg bg-teal text-navy outline-none transition-colors hover:bg-[#13a69f] focus-visible:ring-3 focus-visible:ring-white/60"
              >
                <ArrowRight aria-hidden className="size-5" />
              </button>
            </div>
          </div>
        </div>

        <CtaLink href={journey.cta.href} variant="outline-light" icon block className="xl:hidden">
          {journey.cta.label}
        </CtaLink>
      </div>
    </section>
  )
}
