/*
 * SAMPLE DATA ONLY — copied from the Figma admin frames, where every figure
 * is labelled "sample". Replaced by Laravel API data in Stage 9. Nothing here
 * is a real customer, order or statistic.
 */

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
