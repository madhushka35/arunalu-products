/*
 * Website content editor (7d). Values are the CURRENT live copy read from
 * the code (features/home/content.ts, config/site.ts), so the editor shows
 * exactly what the website shows. Editing needs the content API (Stage 9).
 */
import { siteConfig } from "@/config/site"
import { brandIntro, exportSection, featured, finalCta, hero, journey, quality } from "@/features/home/content"

export type ContentField = { key: string; label: string; value: string; kind?: "text" | "textarea" | "image"; max?: number; hint?: string }
export type ContentSection = { id: string; page: string; title: string; fields: ContentField[]; previewImage?: string }

const heading = (s: { overline: string; title: string }) => [
  { key: "overline", label: "Overline", value: s.overline },
  { key: "title", label: "Heading", value: s.title, kind: "textarea" as const, max: 120 },
]

export const contentSections: ContentSection[] = [
  {
    id: "home-hero",
    page: "Homepage",
    title: "Hero",
    previewImage: "/images/products/head-on-sprats-200g.jpg",
    fields: [
      { key: "overline", label: "Overline", value: hero.overline },
      { key: "headline", label: "Headline", value: hero.headline.join(" "), kind: "textarea", max: 80 },
      { key: "description", label: "Description", value: hero.description },
      { key: "primaryLabel", label: "Primary CTA label", value: hero.primary.label },
      { key: "primaryHref", label: "Primary CTA link", value: hero.primary.href },
      { key: "secondaryLabel", label: "Secondary CTA label", value: hero.secondary.label },
      { key: "secondaryHref", label: "Secondary CTA link", value: hero.secondary.href },
      { key: "background", label: "Hero background image", value: "", kind: "image", hint: "16:10 · 2880×1800 · WebP/JPG · max 600 KB" },
    ],
  },
  {
    id: "home-intro",
    page: "Homepage",
    title: "Brand introduction",
    fields: [
      ...heading(brandIntro),
      { key: "lead", label: "Lead paragraph", value: brandIntro.lead, kind: "textarea", max: 400 },
      { key: "body", label: "Body", value: brandIntro.body, kind: "textarea", max: 600 },
    ],
  },
  { id: "home-featured", page: "Homepage", title: "Featured products", fields: [...heading(featured), { key: "body", label: "Body", value: featured.body, kind: "textarea", max: 300 }] },
  { id: "home-journey", page: "Homepage", title: "Production journey", fields: heading(journey) },
  { id: "home-quality", page: "Homepage", title: "Quality & safety", fields: heading(quality) },
  { id: "home-export", page: "Homepage", title: "Export", fields: [...heading(exportSection), { key: "body", label: "Body", value: exportSection.body, kind: "textarea", max: 300 }] },
  { id: "home-cta", page: "Homepage", title: "Final CTA", fields: [...heading(finalCta), { key: "body", label: "Body", value: finalCta.body, kind: "textarea", max: 300 }] },
  {
    id: "contact-details",
    page: "Contact",
    title: "Contact details",
    fields: [
      { key: "email", label: "Email", value: siteConfig.contact.email },
      { key: "phone", label: "Telephone", value: siteConfig.contact.phoneDisplay },
      { key: "address", label: "Address", value: siteConfig.contact.address, kind: "textarea", max: 300 },
    ],
  },
]

/** Pages whose copy is still in the page code; they become editable with the content API. */
export const pendingContentPages = ["About us", "Our process", "Quality", "Export"]
