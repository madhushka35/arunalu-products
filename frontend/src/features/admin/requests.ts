/*
 * Admin "requests" (7c): order requests, export inquiries, contact inquiries.
 * SAMPLE DATA ONLY (Figma admin frames). Field names follow the public form
 * payloads in features/inquiries so the Laravel API can return the same shape.
 * Order requests are inquiries — never paid or confirmed orders.
 */
import { sampleExports, sampleOrders, type RequestStatus } from "@/features/admin/sample-data"

export type RequestKind = "order" | "export" | "contact"

export const requestStatuses: RequestStatus[] = ["New", "Reviewing", "Contacted", "Quotation Sent", "Completed", "Rejected or Closed"]

/** Contact messages are not quoted, so "Quotation Sent" does not apply. */
export const statusesFor = (kind: RequestKind) => (kind === "contact" ? requestStatuses.filter((s) => s !== "Quotation Sent") : requestStatuses)

export type HistoryEntry = { status: RequestStatus; note: string; when: string }
export type NoteEntry = { text: string; by: string; when: string }

export type AdminRequest = {
  kind: RequestKind
  reference: string
  status: RequestStatus
  received: string
  /** Person who sent the request. */
  name: string
  company?: string
  email: string
  phone?: string
  country?: string
  /** Order: product + quantity + packaging. Export: products, est. qty, destination. Contact: subject. */
  details: { label: string; value: string }[]
  /** Short line for tables and cards. */
  product?: string
  quantity?: string
  destination?: string
  subject?: string
  message: string
  history: HistoryEntry[]
  notes: NoteEntry[]
}

const historyFor = (status: RequestStatus, received: string): HistoryEntry[] => {
  const h: HistoryEntry[] = [{ status: "New", note: "Received via website", when: received }]
  if (status !== "New") h.push({ status, note: "Updated by Admin User (sample)", when: received.replace(/\d\d:\d\d$/, "15:00") })
  return h
}

const orderRequests: AdminRequest[] = sampleOrders.map((o, i) => ({
  kind: "order",
  reference: o.reference,
  status: o.status,
  received: o.received,
  name: o.customer,
  company: `Sample Trading Co. ${String.fromCharCode(65 + i)}`,
  email: "buyer@example.com",
  phone: "+00 00 000 0000",
  country: o.country,
  product: o.product,
  quantity: o.quantity,
  details: [
    { label: "Product", value: o.product },
    { label: "Quantity", value: o.quantity },
    { label: "Packaging preference", value: "Bulk wholesale pack (sample)" },
  ],
  message: "Sample customer message describing grading, packaging and delivery timeline requirements.",
  history: historyFor(o.status, o.received),
  notes: i === 0 ? [{ text: "Called buyer — wants sample pack first. (sample note)", by: "Admin User", when: "19 Nov, 11:30" }] : [],
}))

const exportReceived = ["19 Nov, 10:20", "18 Nov, 15:05", "17 Nov, 12:40", "15 Nov, 09:30", "14 Nov, 16:10"]

const exportInquiries: AdminRequest[] = [
  ...sampleExports,
  { reference: "ARU-EXP-00001", company: "Sample Distributors", product: "Baby Shrimp", quantity: "500 kg", destination: "Sample city", status: "Rejected or Closed" as RequestStatus },
].map((e, i) => ({
  kind: "export",
  reference: e.reference,
  status: e.status,
  received: exportReceived[i],
  name: "Sample Contact",
  company: e.company,
  email: "imports@example.com",
  phone: "+00 00 000 0000",
  country: "Sample Country",
  product: e.product,
  quantity: e.quantity,
  destination: e.destination,
  details: [
    { label: "Interested products", value: e.product },
    { label: "Estimated quantity", value: e.quantity },
    { label: "Preferred packaging", value: "Bulk wholesale pack (sample)" },
    { label: "Destination", value: e.destination },
  ],
  message: "Sample buyer requirements: grading, packaging, documentation and shipping timeline.",
  history: historyFor(e.status, exportReceived[i]),
  notes: [],
}))

const contactInquiries: AdminRequest[] = [
  { reference: "ARU-CON-00008", subject: "General inquiry", received: "19 Nov, 08:10", status: "New" as RequestStatus },
  { reference: "ARU-CON-00007", subject: "Product information", received: "18 Nov, 13:44", status: "Contacted" as RequestStatus },
  { reference: "ARU-CON-00006", subject: "Export / wholesale", received: "17 Nov, 09:02", status: "Completed" as RequestStatus },
].map((c) => ({
  kind: "contact",
  reference: c.reference,
  status: c.status,
  received: c.received,
  name: "Sample Name",
  email: "name@example.com",
  phone: "+00 00 000 0000",
  subject: c.subject,
  details: [{ label: "Subject", value: c.subject }],
  message: "Sample contact message from the website contact form.",
  history: historyFor(c.status, c.received),
  notes: [],
}))

export const adminRequests: Record<RequestKind, AdminRequest[]> = {
  order: orderRequests,
  export: exportInquiries,
  contact: contactInquiries,
}

export const requestConfig = {
  order: {
    path: "/admin/orders",
    title: "Order requests",
    singular: "order request",
    subtitle: "Guest requests — not paid or confirmed orders",
    detailsTitle: "Request details",
    personTitle: "Customer details",
    messageTitle: "Additional requirements",
    notifyEmail: "sales@example.com",
    search: "Search reference, customer, email…",
  },
  export: {
    path: "/admin/export-inquiries",
    title: "Export inquiries",
    singular: "export inquiry",
    subtitle: "Wholesale and export buyer inquiries · sample data",
    detailsTitle: "Inquiry details",
    personTitle: "Company & contact",
    messageTitle: "Buyer requirements",
    notifyEmail: "export@example.com",
    search: "Search reference or company…",
  },
  contact: {
    path: "/admin/contact-inquiries",
    title: "Contact inquiries",
    singular: "contact message",
    subtitle: "Messages from the website contact form · sample",
    detailsTitle: "Message details",
    personTitle: "Contact details",
    messageTitle: "Message",
    notifyEmail: "info@example.com",
    search: "Search reference, name, email…",
  },
} as const

export const findRequest = (kind: RequestKind, reference: string) => adminRequests[kind].find((r) => r.reference === reference)
export const requestHref = (r: { kind: RequestKind; reference: string }) => `${requestConfig[r.kind].path}/${r.reference}`
