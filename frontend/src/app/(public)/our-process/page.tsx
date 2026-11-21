import type { Metadata } from "next"

import { CtaLink } from "@/components/public/cta-link"
import { PageHero } from "@/components/public/page-hero"
import { ProcessJourney } from "@/components/public/pages/process-journey"

export const metadata: Metadata = {
  title: "Our process",
  description: "From the ocean to the pack: the ten stages of Arunalu Products’ dried seafood production.",
  alternates: { canonical: "/our-process" },
}

/** Our Process — Figma "Our Process – Desktop". Stages are provisional per Figma. */
export default function OurProcessPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Our process" }]}
        overline="Our process"
        title="From the ocean to the pack."
        body="An interactive production journey."
      />
      <ProcessJourney />
      <section aria-labelledby="process-cta" className="bg-sand">
        <div className="container-site flex flex-col gap-6 py-[72px] md:flex-row md:items-center md:justify-between md:gap-12">
          <h2 id="process-cta" className="max-w-[760px] type-h2 text-navy">
            Want to see the process for a specific product?
          </h2>
          <CtaLink href="/contact" variant="dark" icon>
            Contact our team
          </CtaLink>
        </div>
      </section>
    </>
  )
}
