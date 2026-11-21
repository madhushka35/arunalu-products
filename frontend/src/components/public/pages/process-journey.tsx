"use client"

import * as React from "react"

import { MediaImage } from "@/components/public/media-image"
import { illustrative } from "@/features/home/content"
import { processStages } from "@/features/process/stages"
import { cn } from "@/lib/utils"

const pad = (n: number) => String(n).padStart(2, "0")

/**
 * Figma "Production Journey" (Our Process – Desktop): sticky stage navigation
 * with progress on the left, stage cards on the right. The active stage
 * follows the scroll position ("Active stage · scroll-linked").
 */
export function ProcessJourney() {
  const [active, setActive] = React.useState(0)
  const refs = React.useRef<(HTMLElement | null)[]>([])

  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        const i = refs.current.indexOf(top.target as HTMLElement)
        if (i >= 0) setActive(i)
      },
      { rootMargin: "-45% 0px -45% 0px" }
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section aria-label="Production stages" className="bg-white">
      <div className="container-site grid gap-10 py-12 md:py-16 xl:grid-cols-[300px_1fr] xl:gap-16 xl:py-24">
        <nav aria-label="Stages" className="hidden xl:block">
          <div className="sticky top-[112px] flex flex-col">
            <p className="type-overline mb-2 px-3.5 text-teal-strong">Stages</p>
            <ol>
              {processStages.map((s, i) => (
                <li key={s.title}>
                  <a
                    href={`#stage-${i + 1}`}
                    aria-current={i === active ? "step" : undefined}
                    className={cn(
                      "flex items-center gap-3.5 rounded-sm px-3.5 py-3 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-teal/50",
                      i === active ? "bg-navy" : "hover:bg-surface"
                    )}
                  >
                    <span className={cn("type-overline", i <= active ? "text-teal" : "text-ink-muted")}>{pad(i + 1)}</span>
                    <span className={cn("text-sm font-medium", i === active ? "text-white" : i < active ? "text-navy" : "text-ink-muted")}>
                      {s.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-2 px-3.5 pt-6">
              <p className="text-[13px] text-ink-muted">
                Progress {pad(active + 1)} / {processStages.length}
              </p>
              <div className="h-1 overflow-hidden rounded-full bg-line">
                <div className="h-full bg-teal transition-[width] duration-300" style={{ width: `${((active + 1) / processStages.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </nav>

        <ol className="flex flex-col gap-6 xl:gap-8">
          {processStages.map((s, i) => {
            const on = i === active
            return (
              <li
                key={s.title}
                id={`stage-${i + 1}`}
                ref={(el) => {
                  refs.current[i] = el
                }}
                className={cn(
                  "grid scroll-mt-28 items-center gap-6 rounded-md p-5 transition-colors duration-300 md:grid-cols-[280px_1fr] md:p-8 xl:grid-cols-[360px_1fr] xl:gap-10",
                  on ? "bg-navy text-white" : "border border-line bg-white"
                )}
              >
                <div className="relative h-[200px] overflow-hidden rounded-sm md:h-[200px] xl:h-[240px]">
                  <MediaImage
                    src={illustrative[s.image]}
                    alt={`${s.title} — illustrative image`}
                    label={`${s.title} photo`}
                    tone={on ? "deep" : "light"}
                    sizes="(min-width: 1280px) 360px, (min-width: 768px) 280px, 100vw"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="type-overline text-teal">Stage {pad(i + 1)}</p>
                  <h2 className={cn("font-heading text-[24px] leading-tight font-bold md:type-h3", on ? "text-white" : "text-navy")}>{s.title}</h2>
                  <p className={cn("text-base leading-relaxed", on ? "text-white/75" : "text-ink-muted")}>{s.text}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
