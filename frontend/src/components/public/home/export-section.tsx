import { CtaLink } from "@/components/public/cta-link"
import { Reveal } from "@/components/public/reveal"
import { exportSection } from "@/features/home/content"

function Globe({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 520 520" fill="none" className={className}>
      <circle cx="260" cy="260" r="250" stroke="#fff" strokeOpacity=".25" />
      <ellipse cx="260" cy="260" rx="90" ry="250" stroke="#fff" strokeOpacity=".15" />
      <ellipse cx="260" cy="260" rx="180" ry="250" stroke="#fff" strokeOpacity=".15" />
      <path
        d="M10 260h500M40 140h440M40 380h440M110 60h300M110 460h300"
        stroke="#fff"
        strokeOpacity=".12"
      />
      <circle
        cx="260"
        cy="260"
        r="18"
        stroke="#16B8B0"
        strokeOpacity=".5"
        className="origin-center motion-safe:animate-[ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite] [transform-box:fill-box]"
      />
      <circle cx="260" cy="260" r="18" stroke="#16B8B0" strokeOpacity=".5" />
      <circle cx="260" cy="260" r="6" fill="#16B8B0" />
    </svg>
  )
}

/** 10 Global Business – Export (ocean). */
export function ExportSection() {
  return (
    <section aria-labelledby="export-title" className="section-y bg-ocean text-white">
      <div className="container-site grid items-center gap-10 xl:grid-cols-[1fr_520px] xl:gap-20">
        <Reveal className="flex flex-col gap-5 md:gap-7">
          <div className="flex flex-col gap-4">
            <p className="type-overline text-sand">{exportSection.overline}</p>
            <h2 id="export-title" className="type-h2 max-w-[600px]">
              <span className="hidden md:inline">{exportSection.title}</span>
              <span className="md:hidden">{exportSection.titleMobile}</span>
            </h2>
            <p className="hidden max-w-[560px] text-lg leading-relaxed text-white/72 md:block">
              {exportSection.body}
            </p>
          </div>
          <ul className="flex max-w-[600px] flex-wrap gap-2" aria-label="Who we supply">
            {exportSection.buyers.map((b) => (
              <li
                key={b}
                className="hidden rounded-sm border border-white/25 px-3 py-[7px] text-[13px] text-white md:block"
              >
                {b}
              </li>
            ))}
            {exportSection.buyersMobile.map((b) => (
              <li
                key={`m-${b}`}
                className="rounded-sm border border-white/25 px-3 py-[7px] text-[13px] text-white md:hidden"
              >
                {b}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 pt-2 md:flex-row">
            <CtaLink href={exportSection.primary.href} icon block className="md:w-auto">
              {exportSection.primary.label}
            </CtaLink>
            <CtaLink
              href={exportSection.secondary.href}
              variant="outline-light"
              icon
              className="hidden md:inline-flex"
            >
              {exportSection.secondary.label}
            </CtaLink>
          </div>
        </Reveal>
        <Reveal index={1} className="hidden justify-center md:flex">
          <Globe className="size-[320px] xl:size-[520px]" />
        </Reveal>
      </div>
    </section>
  )
}
