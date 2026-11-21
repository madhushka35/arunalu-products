import type { Metadata } from "next"

import { PageHero } from "@/components/public/page-hero"
import { ContactForm } from "@/components/public/inquiries/contact-form"
import { ContactInfo } from "@/components/public/inquiries/contact-info"

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, WhatsApp or email Arunalu Products about local supply, wholesale or export orders.",
  alternates: { canonical: "/contact" },
}

/**
 * Contact — Figma "Contact – Desktop / Tablet / Mobile".
 * The map is not rendered: Figma has a placeholder only and no location has
 * been approved (Stage 5 plan Q10).
 */
export default function ContactPage() {
  return (
    <>
      {/* Figma "Contact – Mobile" has no page hero: cards and form only. */}
      <div className="hidden md:block">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
          overline="Contact"
          title="Talk to Arunalu Products."
          body="Call, WhatsApp or email us about local supply, wholesale or export orders."
        />
      </div>
      <h1 className="sr-only md:hidden">Contact Arunalu Products</h1>
      <section className="bg-surface md:bg-white">
        <div className="container-site grid gap-5 py-5 md:gap-10 md:py-16 xl:grid-cols-[420px_1fr] xl:gap-12 xl:py-24">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>
    </>
  )
}
