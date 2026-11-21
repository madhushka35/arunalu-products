"use server"

import { apiBaseUrl, postInquiry } from "@/services/api"
import {
  validateContact,
  validateExport,
  validateOrder,
  type Raw,
} from "@/features/inquiries/schema"
import type { SubmitResult } from "@/types/inquiries"

/** Honeypot field name (hidden from people, filled by naive bots). */
const TRAP = "website"

/**
 * No API yet: development (or an explicit opt-in) shows a clearly labelled
 * preview — nothing is stored or sent and no reference number is shown.
 * Production without an API reports the form as unavailable.
 */
function noApiResult(): SubmitResult {
  const preview =
    process.env.NODE_ENV !== "production" || process.env.INQUIRY_PREVIEW_MODE === "true"
  return preview ? { status: "preview" } : { status: "unavailable" }
}

function formToRaw(formData: FormData): Raw {
  const raw: Record<string, string | string[]> = {}
  for (const key of new Set(formData.keys())) {
    if (key.startsWith("$")) continue // React action metadata
    const all = formData.getAll(key).filter((v): v is string => typeof v === "string")
    raw[key] = all.length > 1 || key === "products" ? all : (all[0] ?? "")
  }
  return raw
}

function echo(raw: Raw): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {}
  for (const [k, v] of Object.entries(raw)) if (k !== TRAP && v !== undefined) out[k] = v
  return out
}

async function submit(
  raw: Raw,
  validate: (raw: Raw) => { ok: boolean; errors: Record<string, string | undefined>; data: object },
  path: string
): Promise<SubmitResult> {
  if (typeof raw[TRAP] === "string" && raw[TRAP]) {
    return { status: "error", message: "Your message could not be sent. Please contact us directly." }
  }
  const { ok, errors, data } = validate(raw)
  if (!ok) return { status: "invalid", errors, values: echo(raw) }
  if (!apiBaseUrl()) return noApiResult()

  const result = await postInquiry(path, data)
  switch (result.kind) {
    case "created":
      return { status: "sent", reference: result.reference }
    case "invalid":
      return { status: "invalid", errors: result.errors, values: echo(raw) }
    case "throttled":
      return { status: "error", message: "Too many requests. Please wait a minute and try again." }
    default:
      return { status: "error", message: "Something went wrong. Please try again or contact us directly." }
  }
}

/* Form actions (work without JavaScript via <form action>). */

export async function submitContact(_prev: SubmitResult, formData: FormData): Promise<SubmitResult> {
  return submit(formToRaw(formData), validateContact, "/contact-inquiries")
}

export async function submitExportInquiry(_prev: SubmitResult, formData: FormData): Promise<SubmitResult> {
  return submit(formToRaw(formData), validateExport, "/export-inquiries")
}

/**
 * The order request is a multi-step client flow; it sends its collected values.
 * One product per request for now (Figma); the API stores it as one
 * order_request_items row (report §10).
 */
export async function submitOrderRequest(raw: Record<string, string>): Promise<SubmitResult> {
  return submit(raw, validateOrder, "/order-requests")
}
