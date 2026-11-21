/**
 * Option lists for the inquiry forms.
 *
 * PENDING CLIENT CONFIRMATION: quantity units, packaging preferences and
 * contact subjects are working defaults chosen on 2026-11-21 (Stage 5 plan
 * Q4–Q6). Figma only shows sample values ("Kilograms (kg)", "Bulk wholesale
 * pack (sample)", "General inquiry"). Replace when Arunalu Products confirms.
 */

export const quantityUnits = [
  { value: "kg", label: "Kilograms (kg)", short: "kg" },
  { value: "packs", label: "Packs", short: "packs" },
] as const

export const packagingOptions = [
  { value: "retail", label: "Retail packs" },
  { value: "bulk", label: "Bulk wholesale pack" },
  { value: "custom", label: "Custom packaging" },
] as const

export const contactSubjects = [
  { value: "general", label: "General inquiry" },
  { value: "product", label: "Product information" },
  { value: "order", label: "Order request" },
  { value: "export", label: "Export / wholesale" },
  { value: "other", label: "Other" },
] as const

export type QuantityUnit = (typeof quantityUnits)[number]["value"]
export type PackagingOption = (typeof packagingOptions)[number]["value"]
export type ContactSubject = (typeof contactSubjects)[number]["value"]

export const labelOf = (
  list: readonly { value: string; label: string }[],
  value: string
) => list.find((o) => o.value === value)?.label ?? value

/** "500 kg", "120 packs" */
export const formatQuantity = (quantity: string | number, unit: string) => {
  const short = quantityUnits.find((u) => u.value === unit)?.short ?? unit
  return `${quantity} ${short}`.trim()
}
