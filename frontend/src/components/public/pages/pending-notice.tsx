import { Mail } from "lucide-react"

import { CtaLink } from "@/components/public/cta-link"
import { siteConfig } from "@/config/site"

/**
 * Honest placeholder for content the client has not supplied yet
 * (legal text, news articles). Nothing is invented (report §4).
 */
export function PendingNotice({ title, text }: { title: string; text: string }) {
  return (
    <section className="bg-white">
      <div className="container-site section-y">
        <div className="mx-auto flex max-w-[720px] flex-col items-start gap-5 rounded-xl border border-line bg-surface p-6 md:p-10">
          <h2 className="type-h3 text-ink">{title}</h2>
          <p className="text-base leading-relaxed text-ink-muted">{text}</p>
          <div className="flex flex-wrap gap-3">
            <CtaLink href="/contact">Contact us</CtaLink>
            <CtaLink href={`mailto:${siteConfig.contact.email}`} variant="outline" external icon={false}>
              <Mail aria-hidden className="size-4" /> {siteConfig.contact.email}
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  )
}
