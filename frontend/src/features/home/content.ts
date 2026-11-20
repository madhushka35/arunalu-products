/**
 * Homepage content, taken from the approved Figma homepage
 * (Home – Desktop / Tablet / Mobile, Revision 02).
 *
 * Rules applied:
 * - Copy is used as approved. Design-only notes ("placeholder", "to be
 *   confirmed", certification notice, globe caption) are NOT rendered.
 * - Where the design only had placeholder text (capability descriptions,
 *   statistics, stage details), the field is `null` until Arunalu Products
 *   supplies verified content. Nothing is invented.
 */

import { megaMenuCategories, quoteHref } from "@/config/site"

/* ------------------------------------------------------------------ */
/* Illustrative imagery                                                */
/* ------------------------------------------------------------------ */

/**
 * AI-generated illustrative images placed in Figma (Phase 20). They must be
 * exported from Figma (Assets page → "AI Illustrative Images") into
 * /public/images/illustrative/<key>.jpg. Until a file is supplied the value
 * stays `null` and the design's tonal placeholder is shown.
 * NOTE: illustrative only — replace with real Arunalu photography before launch.
 */
export type IllustrativeKey =
  | "processing"
  | "drying"
  | "facility"
  | "packaging"
  | "qa"
  | "grading"
  | "receiving"
  | "storage"
  | "preparation"
  | "team"
  | "distribution"

export const illustrative: Record<IllustrativeKey, string | null> = {
  processing: null,
  drying: null,
  facility: null,
  packaging: null,
  qa: null,
  grading: null,
  receiving: null,
  storage: null,
  preparation: null,
  team: null,
  distribution: null,
}

/* ------------------------------------------------------------------ */

export const hero = {
  overline: "Dried seafood processing & manufacturing",
  overlineMobile: "Dried seafood processing",
  headline: ["From the ocean.", "Crafted for the world."],
  description: "Arunalu Products – Premium Dried Fish and Preserved Seafood.",
  primary: { label: "Explore our products", href: "/products" },
  secondary: { label: "Discover our process", href: "/our-process" },
  secondaryTablet: "Our process",
}

export const brandIntro = {
  overline: "About Arunalu Products",
  title: "Precision in processing. Quality in every pack.",
  lead: "Arunalu Products is a Sri Lankan business specializing in preserved seafood, with a strong focus on the local supply and international export of dried fish products.",
  body: "Building on its experience, Arunalu Products brings together traditional seafood-preservation knowledge and modern processing practices, with a focus on product quality, responsible sourcing and customer satisfaction.",
  cta: { label: "More about us", href: "/about" },
}

export type IconKey =
  | "fish"
  | "sun"
  | "scale"
  | "package"
  | "truck"
  | "globe"

export const pillars: { icon: IconKey; title: string; text: string }[] = [
  { icon: "fish", title: "Seafood processing", text: "Careful preparation of raw material for drying." },
  { icon: "sun", title: "Machine-assisted drying", text: "Drying supported by machinery for consistency." },
  { icon: "scale", title: "Product grading", text: "Sorting by size and quality before packing." },
  { icon: "package", title: "Product packaging", text: "Packing formats for wholesale, retail and export." },
]

function pillarText(title: string) {
  return pillars.find((p) => p.title === title)?.text ?? null
}

export const featured = {
  overline: "Featured products",
  title: "Selected from our dried seafood range.",
  body: "Original Arunalu product photographs. Pack sizes as printed on each pack.",
  titleMobile: "From our dried seafood range.",
  featuredSlug: "head-on-sprats",
  gridSlugs: ["dried-prawns", "headless-sprats", "ready-to-cook-sprats"],
  /** Mobile shows two cards (Figma: Home – Mobile). */
  mobileSlugs: ["head-on-sprats", "dried-prawns"],
  cta: { label: "View all products", href: "/products" },
}

const categoryImage: Record<string, string> = {
  "Dried Fish": "/images/products/head-on-sprats-200g.jpg",
  "Dried Sprats": "/images/products/ready-to-cook-sprats-200g.jpg",
  "Dried Prawns": "/images/products/dried-prawns-100g.jpg",
  "Dried Seafood": "/images/products/baby-shrimp-100g.jpg",
}

const categoryText: Record<string, string> = {
  "Dried Fish": "Head-on & headless sprats",
  "Dried Sprats": "Ready-to-cook sprats",
  "Dried Prawns": "Dried prawns",
  "Dried Seafood": "Baby shrimp & more",
}

export const categories = {
  overline: "Product categories",
  title: "Four categories. One standard of care.",
  overlineMobile: "Categories",
  titleMobile: "Four categories.",
  items: megaMenuCategories.map((c) => ({
    name: c.label,
    href: c.href,
    text: categoryText[c.label],
    image: categoryImage[c.label],
  })),
}

export type Stage = {
  title: string
  image: IllustrativeKey
  /** Approved copy only; null = awaiting verified process details. */
  text: string | null
}

export const journey = {
  overline: "Production journey",
  title: "From the ocean to the pack, in ten controlled stages.",
  titleMobile: "Ten controlled stages.",
  /** Figma shows stage 05 (Machine Drying) as the active stage. */
  initialStage: 4,
  cta: { label: "Discover our process", href: "/our-process" },
  stages: [
    { title: "Raw Material Receiving", image: "receiving", text: "Incoming raw material is checked before processing." },
    { title: "Inspection", image: "qa", text: null },
    { title: "Preparation", image: "preparation", text: "Careful preparation of raw material for drying." },
    { title: "Processing", image: "processing", text: "Hygienic handling and controlled preparation." },
    { title: "Machine Drying", image: "drying", text: "Prepared seafood is dried with machine assistance to support consistent results batch after batch." },
    { title: "Quality Inspection", image: "qa", text: null },
    { title: "Grading", image: "grading", text: "Sorting by size and quality before packing." },
    { title: "Packaging", image: "packaging", text: "Packing formats for wholesale, retail and export." },
    { title: "Storage", image: "storage", text: "Packs are checked before storage and dispatch." },
    { title: "Distribution", image: "distribution", text: null },
  ] satisfies Stage[],
}

export const quality = {
  overline: "Quality & food safety",
  title: "Quality checked at every stage.",
  titleMobile: "Checked at every stage.",
  items: [
    { title: "Raw material inspection", text: "Incoming raw material is checked before processing." },
    { title: "Processing control", text: "Hygienic handling and controlled preparation." },
    { title: "Drying monitoring", text: "Drying is supervised to support consistent quality." },
    { title: "Packaging & storage checks", text: "Packs are checked before storage and dispatch." },
  ],
}

export const capabilities = {
  overline: "Manufacturing capabilities",
  title: "Built around the full dried seafood workflow.",
  items: [
    { icon: "fish", title: "Seafood processing", text: pillarText("Seafood processing") },
    { icon: "sun", title: "Machine-assisted drying", text: pillarText("Machine-assisted drying") },
    { icon: "scale", title: "Product grading", text: pillarText("Product grading") },
    { icon: "package", title: "Product packaging", text: pillarText("Product packaging") },
    { icon: "truck", title: "Local wholesale supply", text: null },
    { icon: "globe", title: "International export", text: null },
  ] satisfies { icon: IconKey; title: string; text: string | null }[],
  /** Statistics band: shown only when verified figures are supplied. */
  statistics: [] as { value: string; label: string }[],
}

export const packaging = {
  overline: "Packaging",
  title: "Packaging built for every market.",
  items: [
    { title: "Bulk wholesale packs", text: "For distributors and wholesale buyers.", image: illustrative.packaging },
    { title: "Retail-ready packs", text: "For supermarkets and retailers.", image: "/images/products/headless-sprats-200g.jpg" },
    { title: "Custom & private label", text: "For importers with specific requirements.", image: illustrative.packaging },
  ] as { title: string; text: string; image: string | null }[],
  brandMessage: "Precision in processing. Quality in every pack.",
}

export const exportSection = {
  overline: "Global business",
  title: "Supplying wholesale and export buyers.",
  titleMobile: "Supplying wholesale & export buyers.",
  body: "Bulk supply, consistent grading and flexible packaging for buyers at home and abroad.",
  buyers: [
    "Seafood importers",
    "Wholesale buyers",
    "Distributors",
    "Supermarkets & retailers",
    "Hotels & restaurants",
    "Food distribution companies",
  ],
  buyersMobile: ["Importers", "Wholesale buyers", "Distributors", "Supermarkets", "Hotels & restaurants"],
  primary: { label: "Export inquiry", href: "/export-inquiry" },
  secondary: { label: "Export information", href: "/export" },
}

export const gallery = {
  overline: "Gallery",
  title: "Inside our production.",
  cta: { label: "View gallery", href: "/gallery" },
}

export const finalCta = {
  overline: "Start a conversation",
  title: "Let's talk about your next order.",
  body: "Send a guest order request or export inquiry — no account needed. Our team will contact you to confirm details.",
  bodyMobile: "Guest order requests — no account needed.",
  primary: { label: "Request a quote", href: quoteHref },
  secondary: { label: "Contact our team", href: "/contact" },
  secondaryMobile: "Contact us",
}
