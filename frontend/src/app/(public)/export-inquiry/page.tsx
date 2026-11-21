import { Suspense } from "react"
import type { Metadata } from "next"
import { Mail, MessageCircle } from "lucide-react"

import { Breadcrumbs } from "@/components/public/breadcrumbs"
import { ExportInquiryForm } from "@/components/public/inquiries/export-inquiry-form"
import { ExportInquiryWithProduct } from "@/components/public/inquiries/export-inquiry-with-product"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Export inquiry",
  description: "Send an export or wholesale inquiry to Arunalu Products. No account needed.",
  alternates: { canonical: "/export-inquiry" },
}

/**
 * Export inquiry — Figma "Export – Desktop / Export Inquiry Form Section",
 * "Export Inquiry – Mobile" and "Export – Tablet". The same form will be
 * embedded on /export in Stage 6.
 */
export default function ExportInquiryPage() {
  return (
    <section className="bg-surface">
      <div className="container-site flex flex-col gap-6 py-5 md:py-12 xl:gap-10 xl:py-16">
        <Breadcrumbs
          className="hidden md:block"
          items={[
            { label: "Home", href: "/" },
            { label: "Export", href: "/export" },
            { label: "Export inquiry" },
          ]}
        />
        <div className="grid gap-8 xl:grid-cols-[400px_1fr] xl:gap-16">
          <div className="hidden flex-col gap-6 md:flex">
            <div className="flex flex-col gap-4">
              <p className="type-overline text-teal-strong">Export inquiry</p>
              <h1 className="type-h2 text-navy">Tell us what you need.</h1>
              <p className="text-base leading-relaxed text-ink-muted">
                Submit once — you receive a reference number and our export team is notified.
              </p>
            </div>
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
          <h1 className="sr-only md:hidden">Export inquiry</h1>
          <Suspense fallback={<ExportInquiryForm />}>
            <ExportInquiryWithProduct />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
