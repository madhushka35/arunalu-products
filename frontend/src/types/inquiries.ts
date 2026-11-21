/** Shared inquiry types (frontend ↔ planned Laravel API, report §11). */

export type FieldErrors = Partial<Record<string, string>>

export type InquiryKind = "order" | "export" | "contact"

/** Result returned by the inquiry server actions to the forms. */
export type SubmitResult =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors; values: Record<string, string | string[]> }
  | { status: "sent"; reference: string }
  /** No API configured in development: nothing was stored or sent. */
  | { status: "preview" }
  | { status: "unavailable" }
  | { status: "error"; message: string }

export type OrderRequestPayload = {
  product: string
  quantity: number
  unit: string
  packaging: string
  fullName: string
  company: string | null
  email: string
  phone: string
  country: string
  requirements: string | null
  acknowledged: true
}

export type ExportInquiryPayload = {
  companyName: string
  contactPerson: string
  email: string
  phone: string | null
  country: string
  products: string[]
  destination: string
  estimatedQuantityKg: number | null
  packaging: string | null
  requirements: string | null
}

export type ContactInquiryPayload = {
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
}
