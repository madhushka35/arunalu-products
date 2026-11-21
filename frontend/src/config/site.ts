/**
 * Static site configuration for the public website.
 *
 * Only approved, client-supplied business details live here. Product data
 * shown in navigation is limited to names, categories and pack sizes that
 * appear in the approved design. Full product data will come from the API.
 */

export const siteConfig = {
  name: "Arunalu Products",
  url: "https://arunaluproducts.lk",
  tagline: "Precision in processing. Quality in every pack.",
  description:
    "Dried fish processing, preserved seafood manufacturing, packaging and supply.",
  contact: {
    email: "arunalu5782@yahoo.com",
    phoneDisplay: "+94 77 364 4890",
    phoneHref: "tel:+94773644890",
    whatsappDisplay: "WhatsApp +94 77 364 4890",
    whatsappHref: "https://wa.me/94773644890",
    address:
      "No. 30/7, Torington Estate, Pahala Kandawala, Thimbirigaskatuwa, Sri Lanka",
  },
} as const

export type NavItem = {
  label: string
  href: string
}

/** Primary navigation, in the order shown in the approved header. */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Our Process", href: "/our-process" },
  { label: "Quality", href: "/quality" },
  { label: "Export", href: "/export" },
  { label: "Gallery", href: "/gallery" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
]

/** Header / footer "Request a quote" → guest order request (Figma prototype link). */
export const quoteHref = "/request-order"

export type CategoryLink = NavItem & {
  description: string
  icon: "fish" | "layers" | "shrimp" | "package"
}

/** Products mega menu: category rows (copy from the approved design). */
export const megaMenuCategories: CategoryLink[] = [
  {
    label: "Dried Fish",
    href: "/products?category=dried-fish",
    description: "Head-on, headless & ready-to-cook sprats",
    icon: "fish",
  },
  {
    label: "Dried Sprats",
    href: "/products?category=dried-sprats",
    description: "Sprats in 200g retail packs",
    icon: "layers",
  },
  {
    label: "Dried Prawns",
    href: "/products?category=dried-prawns",
    description: "Dried prawns · 100g",
    icon: "shrimp",
  },
  {
    label: "Dried Seafood",
    href: "/products?category=dried-seafood",
    description: "Dried prawns & baby shrimp",
    icon: "package",
  },
]

export const megaMenuFeatured = {
  label: "Head-on Sprats",
  packSize: "200g",
  href: "/products/head-on-sprats",
  image: "/images/products/head-on-sprats-200g.jpg",
  imageAlt: "Arunalu Head-on Sprats 200g pack",
}

export const megaMenuExplore: NavItem[] = [
  { label: "Our process", href: "/our-process" },
  { label: "Quality & food safety", href: "/quality" },
  { label: "Export & wholesale", href: "/export" },
  // Homepage "Packaging Showcase" section (Figma has no separate packaging page).
  { label: "Packaging options", href: "/#packaging" },
]

export type FooterColumn = { title: string; links: NavItem[] }

export const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our process", href: "/our-process" },
      { label: "Quality", href: "/quality" },
      { label: "Gallery", href: "/gallery" },
      { label: "News", href: "/news" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Dried fish", href: "/products?category=dried-fish" },
      { label: "Dried sprats", href: "/products?category=dried-sprats" },
      { label: "Dried seafood", href: "/products?category=dried-seafood" },
      { label: "Dried prawns", href: "/products?category=dried-prawns" },
      { label: "View all", href: "/products" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Export", href: "/export" },
      { label: "Request a quote", href: quoteHref },
      { label: "Export inquiry", href: "/export-inquiry" },
      { label: "Contact", href: "/contact" },
    ],
  },
]

export const legalLinks: NavItem[] = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of use", href: "/terms" },
]

/** True when `pathname` is `href` or a child route of it. */
export function isActivePath(pathname: string, href: string): boolean {
  const path = href.split(/[?#]/)[0]
  if (path === "/") return pathname === "/"
  return pathname === path || pathname.startsWith(`${path}/`)
}
