import { CtaLink } from "@/components/public/cta-link"
import { Reveal } from "@/components/public/reveal"
import { HOME_ICONS } from "@/components/public/home/icons"
import { brandIntro, pillars } from "@/features/home/content"

/** 03 Brand Introduction + pillars (pillars are not part of the mobile design). */
export function BrandIntroSection() {
  return (
    <section aria-labelledby="intro-title" className="section-y bg-white">
      <div className="container-site flex flex-col gap-16">
        <div className="grid gap-5 xl:grid-cols-[560px_1fr] xl:gap-24">
          <Reveal className="flex flex-col gap-4">
            <p className="type-overline text-teal-strong">{brandIntro.overline}</p>
            <h2 id="intro-title" className="type-h2 text-navy">
              {brandIntro.title}
            </h2>
          </Reveal>
          <Reveal index={1} className="flex flex-col items-start gap-5 xl:gap-6 xl:pt-11">
            <p className="text-base leading-relaxed text-ink-muted md:text-lg md:text-ink">
              {brandIntro.lead}
            </p>
            <p className="hidden text-base leading-relaxed text-ink-muted md:block">
              {brandIntro.body}
            </p>
            <CtaLink href={brandIntro.cta.href} variant="text">
              {brandIntro.cta.label}
            </CtaLink>
          </Reveal>
        </div>

        <ul className="hidden gap-8 md:grid md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar, i) => {
            const Icon = HOME_ICONS[pillar.icon]
            return (
              <Reveal
                as="li"
                index={i}
                key={pillar.title}
                className="flex flex-col gap-3.5 border-t border-line pt-7"
              >
                <span className="type-overline text-teal-strong">0{i + 1}</span>
                <Icon aria-hidden className="size-7 text-navy" strokeWidth={1.75} />
                <h3 className="type-h4 text-navy">{pillar.title}</h3>
                <p className="text-sm leading-normal text-ink-muted">{pillar.text}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
