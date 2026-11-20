import { CtaLink } from "@/components/public/cta-link"
import { Reveal } from "@/components/public/reveal"
import { finalCta } from "@/features/home/content"

/** 12 Final Call to Action (deep ocean → navy gradient). */
export function FinalCtaSection() {
  return (
    <section
      aria-labelledby="cta-title"
      className="bg-gradient-to-b from-[#2a7393] to-navy py-[72px] text-white xl:py-[140px]"
    >
      <Reveal className="container-site flex flex-col gap-5 md:items-center md:gap-7 md:text-center">
        <p className="hidden type-overline text-teal md:block">{finalCta.overline}</p>
        <h2 id="cta-title" className="type-h2 max-w-[900px] xl:type-h1">
          {finalCta.title}
        </h2>
        <p className="max-w-[640px] text-base leading-relaxed text-white/72 md:text-lg">
          <span className="md:hidden">{finalCta.bodyMobile}</span>
          <span className="hidden md:inline">{finalCta.body}</span>
        </p>
        <div className="flex flex-col gap-3 pt-2 md:flex-row md:gap-4 md:pt-3">
          <CtaLink href={finalCta.primary.href} icon block className="md:w-auto">
            {finalCta.primary.label}
          </CtaLink>
          <CtaLink href={finalCta.secondary.href} variant="outline-light" icon block className="md:w-auto">
            <span className="md:hidden">{finalCta.secondaryMobile}</span>
            <span className="hidden md:inline">{finalCta.secondary.label}</span>
          </CtaLink>
        </div>
      </Reveal>
    </section>
  )
}
