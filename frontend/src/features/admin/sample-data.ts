/*
 * SAMPLE DATA ONLY — copied from the Figma admin frames, where every figure
 * is labelled "sample". Replaced by Laravel API data in Stage 9. Nothing here
 * is a real customer, order or statistic.
 */

import { categories, getCategorySlugsFor, products, productCategories, type CatalogProduct, type ProductCategorySlug } from "@/features/products/catalog"

export type RequestStatus = "New" | "Reviewing" | "Contacted" | "Quotation Sent" | "Completed" | "Rejected or Closed"
export type ContentStatus = "Draft" | "Published" | "Active" | "Inactive"
export type AnyStatus = RequestStatus | ContentStatus

export type SampleOrder = {
  reference: string
  customer: string
  product: string
  quantity: string
  country: string
  received: string
  status: RequestStatus
}

export const sampleOrders: SampleOrder[] = [
  { reference: "ARU-ORD-00012", customer: "Sample Buyer A", product: "Headless Sprats", quantity: "500 kg", country: "Country A", received: "19 Nov, 10:42", status: "New" },
  { reference: "ARU-ORD-00011", customer: "Sample Buyer B", product: "Head-on Sprats", quantity: "1,200 kg", country: "Country B", received: "19 Nov, 09:15", status: "New" },
  { reference: "ARU-ORD-00010", customer: "Sample Hotel C", product: "Dried Prawns", quantity: "80 kg", country: "Country A", received: "18 Nov, 16:02", status: "Reviewing" },
  { reference: "ARU-ORD-00009", customer: "Sample Retail D", product: "Ready-to-Cook Sprats", quantity: "300 kg", country: "Country A", received: "18 Nov, 11:20", status: "Contacted" },
  { reference: "ARU-ORD-00008", customer: "Sample Importer E", product: "Head-on Sprats", quantity: "5,000 kg", country: "Country C", received: "17 Nov, 14:48", status: "Quotation Sent" },
  { reference: "ARU-ORD-00007", customer: "Sample Buyer F", product: "Baby Shrimp", quantity: "150 kg", country: "Country A", received: "16 Nov, 08:30", status: "Completed" },
  { reference: "ARU-ORD-00006", customer: "Sample Buyer G", product: "Dried Prawns", quantity: "60 kg", country: "Country D", received: "15 Nov, 17:55", status: "Rejected or Closed" },
]

export type SampleExport = { reference: string; company: string; product: string; quantity: string; destination: string; status: RequestStatus }

export const sampleExports: SampleExport[] = [
  { reference: "ARU-EXP-00005", company: "Sample Import Ltd.", product: "Headless Sprats", quantity: "5,000 kg", destination: "Sample port", status: "New" },
  { reference: "ARU-EXP-00004", company: "Sample Foods Co.", product: "Head-on Sprats", quantity: "10,000 kg", destination: "Sample port", status: "Reviewing" },
  { reference: "ARU-EXP-00003", company: "Sample Trading", product: "Dried Prawns", quantity: "2,000 kg", destination: "Sample city", status: "Quotation Sent" },
  { reference: "ARU-EXP-00002", company: "Sample Wholesale", product: "Ready-to-Cook Sprats", quantity: "3,000 kg", destination: "Sample port", status: "Completed" },
]

export type NotificationKind = "order" | "export" | "contact" | "status"
export type SampleNotification = { id: string; kind: NotificationKind; title: string; description: string; time: string; unread: boolean }

export const sampleNotifications: SampleNotification[] = [
  { id: "n1", kind: "order", title: "New order request · ARU-ORD-00012", description: "Headless Sprats · 500 kg · Sample Buyer A", time: "2 min ago · email sent", unread: true },
  { id: "n2", kind: "export", title: "New export inquiry · ARU-EXP-00005", description: "Headless Sprats · 5,000 kg · Sample Import Ltd.", time: "25 min ago · email sent", unread: true },
  { id: "n3", kind: "order", title: "New order request · ARU-ORD-00011", description: "Head-on Sprats · 1,200 kg", time: "1 h ago · email sent", unread: true },
  { id: "n4", kind: "contact", title: "Contact message · ARU-CON-00008", description: "Subject: General inquiry", time: "Yesterday", unread: false },
  { id: "n5", kind: "status", title: "Status changed · ARU-ORD-00009", description: "Reviewing → Contacted by Admin User", time: "Yesterday", unread: false },
]

export const sampleStats = [
  { label: "Total Products", value: "5", delta: "1 draft · sample", icon: "package" },
  { label: "New Order Requests", value: "12", delta: "+3 this week · sample", icon: "clipboard" },
  { label: "Export Inquiries", value: "5", delta: "+1 this week · sample", icon: "globe" },
  { label: "Contact Inquiries", value: "8", delta: "2 unread · sample", icon: "mail" },
] as const

export const sampleActivity = [
  { who: "Admin User", what: "changed ARU-ORD-00009 to Contacted", when: "12 min ago" },
  { who: "Editor (sample)", what: "published “Headless Sprats”", when: "1 h ago" },
  { who: "Admin User", what: "uploaded 6 gallery images", when: "Yesterday" },
]

/** Signed-in user shown in the shell until real authentication exists. */
export const sampleAdminUser = { name: "Admin User", role: "Super Admin (sample)", initials: "AU" }

/* ---- Catalogue (7b) -------------------------------------------------------
 * Products and categories come from the real catalogue (features/products).
 * Publishing status, "featured" and "updated" dates are SAMPLE values from the
 * Figma "Product Management" frame until the backend stores them.
 */

export type AdminProduct = CatalogProduct & {
  status: "Published" | "Draft"
  featured: boolean
  updated: string
  categorySlugs: ProductCategorySlug[]
}

export const adminProducts: AdminProduct[] = products.map((p, i) => ({
  ...p,
  status: i === 4 ? "Draft" : "Published",
  featured: i === 0,
  updated: `${18 - i} Nov 2026`,
  categorySlugs: getCategorySlugsFor(p.slug),
}))

export const findAdminProduct = (slug: string) => adminProducts.find((p) => p.slug === slug)

export type AdminCategory = {
  slug: string
  name: string
  order: number
  productCount: number
  status: "Active" | "Inactive"
  description: string
}

export const adminCategories: AdminCategory[] = categories.map((c) => ({
  slug: c.slug,
  name: c.name,
  order: c.order,
  productCount: productCategories.filter((pc) => pc.category === c.slug).length,
  status: "Active",
  description: "",
}))

/** Figma product form: "Available forms" checkboxes (none set yet — no approved data). */
export const productForms = ["Whole", "Split", "Cut pieces", "Powder"] as const

/* ---- Content (7d) ---------------------------------------------------------- */

export const galleryCategories = ["Production", "Machinery", "Products", "Packaging", "Facilities", "Team"] as const
export type GalleryCategory = (typeof galleryCategories)[number]

export type AdminMedia = {
  id: string
  file: string
  src: string
  alt: string
  category: GalleryCategory
  type: "image" | "video"
  status: "Published" | "Draft"
}

/** Only REAL Arunalu photography (D-12): the product photos and their originals. */
export const adminMedia: AdminMedia[] = products.flatMap((p) => [
  { id: `${p.slug}-1`, file: p.image.split("/").pop()!, src: p.image, alt: p.imageAlt, category: "Products" as const, type: "image" as const, status: "Published" as const },
  { id: `${p.slug}-2`, file: `original-${p.originalImage.split("/").pop()!}`, src: p.originalImage, alt: `${p.imageAlt} — original photo`, category: "Products" as const, type: "image" as const, status: "Published" as const },
])

export const newsCategories = ["Company news", "Products", "Export"] as const

export type AdminArticle = {
  id: string
  title: string
  slug: string
  category: (typeof newsCategories)[number]
  author: string
  published: string
  status: "Published" | "Draft"
  excerpt: string
}

/** Figma "Admin – 14 News Management" sample rows. Not shown on the public site (no approved articles). */
export const adminArticles: AdminArticle[] = [
  { id: "a1", title: "Sample headline about a company update", slug: "sample-company-update", category: "Company news", author: "Editor (sample)", published: "12 Nov 2026", status: "Published", excerpt: "" },
  { id: "a2", title: "Sample headline about a product range", slug: "sample-product-range", category: "Products", author: "Editor (sample)", published: "10 Nov 2026", status: "Published", excerpt: "" },
  { id: "a3", title: "Sample headline about export buyers", slug: "sample-export-buyers", category: "Export", author: "Editor (sample)", published: "—", status: "Draft", excerpt: "" },
]

export const findArticle = (id: string) => adminArticles.find((a) => a.id === id)

/* ---- System (7e) — staff accounts only; customers never have accounts ---- */

export const adminRoles = ["Super Admin", "Sales Manager", "Content Editor", "Viewer"] as const
export type AdminRole = (typeof adminRoles)[number]

export type AdminUser = { id: string; name: string; email: string; role: AdminRole; status: "Active" | "Inactive"; lastLogin: string }

/** Figma "Admin – 16 User Management" sample rows (example.com addresses). */
export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Admin User", email: "admin@example.com", role: "Super Admin", status: "Active", lastLogin: "19 Nov, 09:58" },
  { id: "u2", name: "Sales Manager (sample)", email: "sales@example.com", role: "Sales Manager", status: "Active", lastLogin: "19 Nov, 08:20" },
  { id: "u3", name: "Editor (sample)", email: "editor@example.com", role: "Content Editor", status: "Active", lastLogin: "18 Nov, 17:05" },
  { id: "u4", name: "Viewer (sample)", email: "viewer@example.com", role: "Viewer", status: "Inactive", lastLogin: "02 Nov, 10:11" },
]

export const permissionModules = [
  "Dashboard",
  "Products",
  "Categories",
  "Order requests",
  "Export inquiries",
  "Contact inquiries",
  "Gallery",
  "News",
  "Website content",
  "Users",
  "Settings",
  "Activity logs",
] as const
export const permissionActions = ["View", "Create", "Edit", "Delete"] as const
type Matrix = Record<(typeof permissionModules)[number], [number, number, number, number]>

const all = (v: [number, number, number, number]) => Object.fromEntries(permissionModules.map((m) => [m, v])) as Matrix

/** Sample permission matrices ("adjust to Arunalu Products' team"). Sales Manager matches the Figma frame. */
export const rolePermissions: Record<AdminRole, Matrix> = {
  "Super Admin": all([1, 1, 1, 1]),
  "Sales Manager": {
    ...all([0, 0, 0, 0]),
    Dashboard: [1, 0, 0, 0],
    Products: [1, 0, 0, 0],
    Categories: [1, 0, 0, 0],
    "Order requests": [1, 1, 1, 0],
    "Export inquiries": [1, 1, 1, 0],
    "Contact inquiries": [1, 0, 1, 0],
    Gallery: [1, 0, 0, 0],
    News: [1, 0, 0, 0],
    "Activity logs": [1, 0, 0, 0],
  },
  "Content Editor": {
    ...all([0, 0, 0, 0]),
    Dashboard: [1, 0, 0, 0],
    Products: [1, 1, 1, 0],
    Categories: [1, 0, 0, 0],
    Gallery: [1, 1, 1, 1],
    News: [1, 1, 1, 1],
    "Website content": [1, 0, 1, 0],
  },
  Viewer: { ...all([1, 0, 0, 0]), Users: [0, 0, 0, 0], Settings: [0, 0, 0, 0] },
}

/** Figma "Admin – 19 Activity Logs" sample rows. */
export const activityLog = [
  { id: "l1", time: "19 Nov, 11:32", user: "Admin User", action: "Changed status Reviewing → Contacted", entity: "ARU-ORD-00009", ip: "0.0.0.0 (sample)" },
  { id: "l2", time: "19 Nov, 10:15", user: "Editor (sample)", action: "Published product", entity: "Headless Sprats", ip: "0.0.0.0 (sample)" },
  { id: "l3", time: "18 Nov, 16:40", user: "Admin User", action: "Uploaded 6 media files", entity: "Gallery", ip: "0.0.0.0 (sample)" },
  { id: "l4", time: "18 Nov, 09:02", user: "Admin User", action: "Signed in", entity: "Session", ip: "0.0.0.0 (sample)" },
]
