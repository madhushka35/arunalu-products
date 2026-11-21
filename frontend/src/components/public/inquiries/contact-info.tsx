import { Mail, MapPin, MessageCircle, Phone } from "lucide-react"

import { siteConfig } from "@/config/site"

const { contact } = siteConfig

/**
 * Figma "Business Information" cards. "Business hours" is not shown: Figma
 * only has "Hours to be confirmed" (Stage 5 plan Q10).
 */
const ITEMS = [
  { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}`, mobile: true },
  { icon: Phone, label: "Telephone", value: contact.phoneDisplay, href: contact.phoneHref, mobile: true },
  { icon: MessageCircle, label: "WhatsApp", value: contact.phoneDisplay, href: contact.whatsappHref, external: true, mobile: true },
  { icon: MapPin, label: "Address", value: contact.address, mobile: false },
]

export function ContactInfo() {
  return (
    <ul className="flex flex-col gap-3 md:gap-4" aria-label="Contact details">
      {ITEMS.map(({ icon: Icon, label, value, href, external, mobile }) => {
        const body = (
          <>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface">
              <Icon aria-hidden className="size-5 text-teal-strong" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="hidden type-overline text-ink-muted md:block">{label}</span>
              <span className="text-sm font-medium [overflow-wrap:anywhere] text-navy">
                <span className="sr-only md:hidden">{label}: </span>
                {value}
              </span>
            </span>
          </>
        )
        const cls =
          "flex items-center gap-4 rounded-md border border-line bg-white p-4 md:p-5 outline-none transition-colors"
        return (
          <li key={label} className={mobile ? undefined : "hidden md:block"}>
            {href ? (
              <a
                href={href}
                className={`${cls} hover:border-teal focus-visible:ring-3 focus-visible:ring-teal/50`}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {body}
              </a>
            ) : (
              <address className={`${cls} not-italic`}>{body}</address>
            )}
          </li>
        )
      })}
    </ul>
  )
}
