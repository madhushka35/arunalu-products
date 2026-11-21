/**
 * Validation for the three inquiry forms (Figma handoff "Forms & validation").
 * Runs in the browser (instant feedback) AND in the server actions (source of
 * truth). The Laravel API will validate again (report §12).
 */
import { isCountryCode } from "@/features/inquiries/countries"
import {
  contactSubjects,
  packagingOptions,
  quantityUnits,
} from "@/features/inquiries/options"
import { products } from "@/features/products/catalog"
import type {
  ContactInquiryPayload,
  ExportInquiryPayload,
  FieldErrors,
  OrderRequestPayload,
} from "@/types/inquiries"

export const LIMITS = {
  name: 120,
  company: 160,
  email: 254,
  destination: 160,
  text: 1000,
  messageMin: 20,
  quantityMax: 10_000_000,
} as const

export const MESSAGES = {
  required: "This field is required",
  email: "Enter a valid email address",
  businessEmail: "Enter a valid business email",
  phone: "Include country code",
  quantity: "Enter a quantity greater than 0",
  select: "Please select an option",
  product: "Please select a product",
  messageMin: `Message must be at least ${LIMITS.messageMin} characters`,
  tooLong: (max: number) => `Use ${max} characters or fewer`,
  acknowledge: "Please confirm this before sending",
} as const

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type Raw = Record<string, string | string[] | undefined>

const str = (raw: Raw, key: string) => {
  const v = raw[key]
  return (Array.isArray(v) ? v[0] : v ?? "").trim()
}
const list = (raw: Raw, key: string) => {
  const v = raw[key]
  return (Array.isArray(v) ? v : v ? [v] : []).map((s) => s.trim()).filter(Boolean)
}

/** "+94 77 364-4890" → "+94773644890" (E.164) or null when invalid. */
export function normalizePhone(value: string): string | null {
  const compact = value.replace(/[\s\-().]/g, "")
  return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : null
}

class Check {
  errors: FieldErrors = {}
  required(key: string, value: string, max: number) {
    if (!value) this.errors[key] = MESSAGES.required
    else if (value.length > max) this.errors[key] = MESSAGES.tooLong(max)
    return value
  }
  optional(key: string, value: string, max: number) {
    if (value.length > max) this.errors[key] = MESSAGES.tooLong(max)
    return value || null
  }
  email(key: string, value: string, business = false) {
    if (!value) this.errors[key] = MESSAGES.required
    else if (value.length > LIMITS.email || !EMAIL.test(value))
      this.errors[key] = business ? MESSAGES.businessEmail : MESSAGES.email
    return value.toLowerCase()
  }
  phone(key: string, value: string, required: boolean) {
    if (!value) {
      if (required) this.errors[key] = MESSAGES.required
      return null
    }
    const e164 = normalizePhone(value)
    if (!e164) this.errors[key] = MESSAGES.phone
    return e164
  }
  oneOf(key: string, value: string, allowed: readonly string[], message: string = MESSAGES.select) {
    if (!allowed.includes(value)) this.errors[key] = value ? MESSAGES.select : message
    return value
  }
  country(key: string, value: string) {
    if (!value || !isCountryCode(value)) this.errors[key] = MESSAGES.select
    return value
  }
  get ok() {
    return Object.keys(this.errors).length === 0
  }
}

const productSlugs = products.map((p) => p.slug)
const values = <T extends { value: string }>(l: readonly T[]) => l.map((o) => o.value)

/* ---------------------------------------------------------------- */

export function validateContact(raw: Raw) {
  const c = new Check()
  const message = str(raw, "message")
  const data: ContactInquiryPayload = {
    name: c.required("name", str(raw, "name"), LIMITS.name),
    email: c.email("email", str(raw, "email")),
    phone: c.phone("phone", str(raw, "phone"), false),
    subject: c.oneOf("subject", str(raw, "subject"), values(contactSubjects)),
    message,
  }
  if (!message) c.errors.message = MESSAGES.required
  else if (message.length < LIMITS.messageMin) c.errors.message = MESSAGES.messageMin
  else if (message.length > LIMITS.text) c.errors.message = MESSAGES.tooLong(LIMITS.text)
  return { ok: c.ok, errors: c.errors, data }
}

export function validateExport(raw: Raw) {
  const c = new Check()
  const chosen = list(raw, "products").filter((s) => productSlugs.includes(s))
  if (chosen.length === 0) c.errors.products = MESSAGES.product
  const qtyRaw = str(raw, "estimatedQuantity")
  let qty: number | null = null
  if (qtyRaw) {
    qty = Number(qtyRaw)
    if (!Number.isFinite(qty) || qty <= 0 || qty > LIMITS.quantityMax) c.errors.estimatedQuantity = MESSAGES.quantity
  }
  const packaging = str(raw, "packaging")
  if (packaging) c.oneOf("packaging", packaging, values(packagingOptions))
  const data: ExportInquiryPayload = {
    companyName: c.required("companyName", str(raw, "companyName"), LIMITS.company),
    contactPerson: c.required("contactPerson", str(raw, "contactPerson"), LIMITS.name),
    email: c.email("email", str(raw, "email"), true),
    phone: c.phone("phone", str(raw, "phone"), false),
    country: c.country("country", str(raw, "country")),
    products: chosen,
    destination: c.required("destination", str(raw, "destination"), LIMITS.destination),
    estimatedQuantityKg: qty,
    packaging: packaging || null,
    requirements: c.optional("requirements", str(raw, "requirements"), LIMITS.text),
  }
  return { ok: c.ok, errors: c.errors, data }
}

/** Order request, split per step so each step can be checked on "Continue". */
export function validateOrderStep1(raw: Raw) {
  const c = new Check()
  c.oneOf("product", str(raw, "product"), productSlugs, MESSAGES.product)
  const q = Number(str(raw, "quantity"))
  if (!str(raw, "quantity")) c.errors.quantity = MESSAGES.required
  else if (!Number.isFinite(q) || q <= 0 || q > LIMITS.quantityMax) c.errors.quantity = MESSAGES.quantity
  c.oneOf("unit", str(raw, "unit"), values(quantityUnits))
  c.oneOf("packaging", str(raw, "packaging"), values(packagingOptions))
  return c.errors
}

export function validateOrderStep2(raw: Raw) {
  const c = new Check()
  c.required("fullName", str(raw, "fullName"), LIMITS.name)
  c.optional("company", str(raw, "company"), LIMITS.company)
  c.email("email", str(raw, "email"))
  c.phone("phone", str(raw, "phone"), true)
  c.country("country", str(raw, "country"))
  c.optional("requirements", str(raw, "requirements"), LIMITS.text)
  return c.errors
}

export function validateOrder(raw: Raw) {
  const errors: FieldErrors = { ...validateOrderStep1(raw), ...validateOrderStep2(raw) }
  if (str(raw, "acknowledged") !== "yes") errors.acknowledged = MESSAGES.acknowledge
  const data: OrderRequestPayload = {
    product: str(raw, "product"),
    quantity: Number(str(raw, "quantity")),
    unit: str(raw, "unit"),
    packaging: str(raw, "packaging"),
    fullName: str(raw, "fullName"),
    company: str(raw, "company") || null,
    email: str(raw, "email").toLowerCase(),
    phone: normalizePhone(str(raw, "phone")) ?? "",
    country: str(raw, "country"),
    requirements: str(raw, "requirements") || null,
    acknowledged: true,
  }
  return { ok: Object.keys(errors).length === 0, errors, data }
}

/** Single-field check used on blur (same rules as the full validators). */
export function validateField(
  form: "contact" | "export" | "order1" | "order2",
  raw: Raw,
  field: string
): string | undefined {
  const errors =
    form === "contact"
      ? validateContact(raw).errors
      : form === "export"
        ? validateExport(raw).errors
        : form === "order1"
          ? validateOrderStep1(raw)
          : validateOrderStep2(raw)
  return errors[field]
}
