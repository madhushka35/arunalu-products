import { CircleCheck } from "lucide-react"

import { MediaImage } from "@/components/public/media-image"
import { Reveal } from "@/components/public/reveal"
import { illustrative, quality } from "@/features/home/content"

/** 07 Quality and Safety (surface background). */
export function QualitySection() {
  return (
    <section aria-labelledby="quality-title" className="section-y bg-surface">
      <div className="container-site grid items-center gap-10 md:gap-12 xl:grid-cols-[600px_1fr] xl:gap-20">
        <Reveal className="relative hidden aspect-[3/2] overflow-hidden rounded-md md:block xl:aspect-square">
          <MediaImage
            src={illustrative.qa}
            alt="Quality inspection — illustrative image"
            label="Quality inspection photo"
            tone="light"
            sizes="(min-width: 1280px) 600px, 100vw"
          />
        </Reveal>

        <div className="flex flex-col gap-5 md:gap-7">
          <Reveal className="flex flex-col gap-4">
            <p className="type-overline text-teal-strong">{quality.overline}</p>
            <h2 id="quality-title" className="type-h2 max-w-[560px] text-navy">
              <span className="hidden md:inline">{quality.title}</span>
              <span className="md:hidden">{quality.titleMobile}</span>
            </h2>
          </Reveal>
          <ul className="flex flex-col gap-5 md:gap-7">
            {quality.items.map((item, i) => (
              <Reveal as="li" index={i} key={item.title} className="flex items-center gap-3 md:items-start md:gap-4">
                <span className="flex shrink-0 items-center justify-center md:size-11 md:rounded-md md:border md:border-line md:bg-white">
                  <CircleCheck aria-hidden className="size-5 text-teal-strong" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base text-ink md:type-h4 md:text-navy">{item.title}</h3>
                  <p className="hidden text-sm text-ink-muted md:block">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
