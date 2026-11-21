import type { Metadata } from "next"

import { MediaImage } from "@/components/public/media-image"
import { PageHero } from "@/components/public/page-hero"
import { Reveal } from "@/components/public/reveal"
import { SectionHeading } from "@/components/public/section-heading"
import { illustrative, type IllustrativeKey } from "@/features/home/content"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Quality & food safety",
  description: "Quality control points across Arunalu Products’ dried seafood production journey.",
  alternates: { canonical: "/quality" },
}

/*
 * Figma "Quality – Desktop". Rendered: hero, commitment heading and the six
 * control points (Figma titles + one-line descriptions).
 * Not rendered until verified: procedure details, the "to be confirmed"
 * bullet lists, the commitment statement placeholder and the Certifications
 * section (Figma shows empty slots; no certificates have been supplied).
 */
const CONTROL_POINTS: [string, string, IllustrativeKey][] = [
  ["Raw Material Inspection", "Incoming raw material checks.", "receiving"],
  ["Processing Control", "Hygienic preparation and handling.", "processing"],
  ["Drying Process", "Supervised machine-assisted drying.", "drying"],
  ["Product Inspection", "Checks after drying and before grading.", "qa"],
  ["Packaging Quality", "Pack integrity and labelling checks.", "packaging"],
  ["Storage and Handling", "Storage conditions before dispatch.", "storage"],
]

export default function QualityPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Quality" }]}
        overline="Quality & food safety"
        title="Quality checked at every stage."
      />
      <section aria-labelledby="quality-commitment" className="bg-white pt-16 xl:pt-28">
        <div className="container-site">
          <SectionHeading
            id="quality-commitment"
            overline="Quality commitment"
            title="Control points across the production journey."
            titleClassName="max-w-[760px]"
          />
        </div>
      </section>
      {CONTROL_POINTS.map(([title, text, image], i) => {
        const flip = i % 2 === 1
        return (
          <section key={title} aria-labelledby={`cp-${i}`} className={cn("section-y", flip ? "bg-surface" : "bg-white")}>
            <div className="container-site grid items-center gap-8 md:grid-cols-2 xl:gap-20">
              <Reveal className={cn("relative h-[240px] overflow-hidden rounded-md md:h-[320px] xl:h-[460px]", flip && "md:order-2")}>
                <MediaImage src={illustrative[image]} alt={`${title} — illustrative image`} label={`${title} photo`} tone="light" sizes="(min-width: 768px) 50vw, 100vw" />
              </Reveal>
              <Reveal index={1} className="flex flex-col gap-4">
                <p className="type-overline text-teal-strong">Control point {String(i + 1).padStart(2, "0")}</p>
                <h2 id={`cp-${i}`} className="type-h2 text-navy">{title}</h2>
                <p className="text-lg leading-relaxed text-ink-muted">{text}</p>
              </Reveal>
            </div>
          </section>
        )
      })}
    </>
  )
}
