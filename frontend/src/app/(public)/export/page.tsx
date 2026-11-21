import { Suspense } from "react"
import type { Metadata } from "next"
import { Check, ClipboardList, Layers, Mail, MessageCircle, Package, Truck } from "lucide-react"

import { PageHero } from "@/components/public/page-hero"
import { Reveal } from "@/components/public/reveal"
import { SectionHeading } from "@/components/public/section-heading"
import { ExportInquiryForm } from "@/components/public/inquiries/export-inquiry-form"
import { ExportInquiryWithProduct } from "@/components/public/inquiries/export-inquiry-with-product"
import { siteConfig } from "@/config/site"
import { exportSection } from "@/features/home/content"

export const metadata: Metadata = {
  title: "Export & wholesale",
  description: "Bulk supply, grading and packaging for importers, distributors and wholesale buyers.",
  alternates: { canonical: "/export" },
}

/*
 * Figma "Export – Desktop". "(to be confirmed)" notes from Figma are not
 * rendered; the packaging-options and buyer-documentation cards still need
 * client confirmation (see documentation/PROGRESS.md).
 */
const CAPABILITIES = [
  { icon: Package, title: "Product supply", text: "Dried fish, sprats and seafood across our product categories." },
  { icon: Truck, title: "Wholesale solutions", text: "Bulk supply for distributors and wholesale buyers." },
  { icon: Layers, title: "Packaging options", text: "Bulk, retail-ready and custom packaging." },
  { icon: ClipboardList, title: "Buyer documentation", text: "Documentation discussed per destination market." },
]

const INCLUDE = [
  "Product and preferred form",
  "Estimated quantity and frequency",
  "Packaging and labelling requirements",
  "Destination port / city and timeline",
]

export default function ExportPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Export" }]}
        overline="Export & wholesale"
        title="Dried seafood supply for international buyers."
        body="Bulk supply, grading and packaging for importers, distributors and wholesale buyers."
      />

      <section aria-labelledby="export-cap" className="section-y bg-white">
        <div className="container-site flex flex-col gap-10 xl:gap-12">
          <SectionHeading id="export-cap" overline="Export capabilities" title="What we can support." />
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {CAPABILITIES.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" index={i} key={title} className="flex flex-col gap-4 rounded-md border border-line p-8">
                <span className="flex size-[52px] items-center justify-center rounded-md bg-navy">
                  <Icon aria-hidden className="size-6 text-teal" strokeWidth={1.75} />
                </span>
                <h3 className="type-h4 text-navy">{title}</h3>
                <p className="text-sm text-ink-muted">{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="export-buyers" className="section-y bg-surface">
        <div className="container-site grid items-start gap-10 xl:grid-cols-[560px_1fr] xl:gap-20">
          <Reveal className="flex flex-col gap-6">
            <SectionHeading id="export-buyers" overline="Buyer information" title="Who we work with." />
            <ul className="flex flex-wrap gap-2">
              {exportSection.buyers.map((b) => (
                <li key={b} className="rounded-sm border border-line bg-white px-3 py-[7px] text-[13px] text-ink">
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal index={1} className="flex flex-col gap-4 rounded-xl border border-line bg-white p-7 md:p-10">
            <h3 className="type-h4 text-navy">To speed up your inquiry, include:</h3>
            <ul className="flex flex-col gap-3">
              {INCLUDE.map((t) => (
                <li key={t} className="flex items-center gap-3 text-base text-ink">
                  <Check aria-hidden className="size-[18px] shrink-0 text-teal-strong" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="inquiry" aria-labelledby="export-form-heading" className="section-y scroll-mt-24 bg-white">
        <div className="container-site grid items-start gap-10 xl:grid-cols-[400px_1fr] xl:gap-16">
          <div className="flex flex-col gap-6">
            <SectionHeading
              id="export-form-heading"
              overline="Export inquiry"
              title="Tell us what you need."
              body="Submit once — you receive a reference number and our export team is notified."
            />
            <ul className="flex flex-col gap-3 text-base text-ink">
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex items-center gap-2.5 hover:text-teal-strong">
                  <Mail aria-hidden className="size-[18px] text-teal-strong" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-teal-strong">
                  <MessageCircle aria-hidden className="size-[18px] text-teal-strong" />
                  {siteConfig.contact.whatsappDisplay}
                </a>
              </li>
            </ul>
          </div>
          <Suspense fallback={<ExportInquiryForm />}>
            <ExportInquiryWithProduct />
          </Suspense>
        </div>
      </section>
    </>
  )
}
