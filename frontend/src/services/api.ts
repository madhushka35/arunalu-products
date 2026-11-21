/**
 * Server-side client for the planned Laravel REST API (report §11).
 * Imported only from server actions — the API base URL never reaches the browser.
 *
 * Expected API contract (to be implemented in the backend stage):
 *   POST {API_BASE_URL}/order-requests | /export-inquiries | /contact-inquiries
 *   201 → { "data": { "reference": "ARU-ORD-00001" } }
 *   422 → { "errors": { "field_name": ["message"] } }   (Laravel validation)
 */

export type ApiResult =
  | { kind: "created"; reference: string }
  | { kind: "invalid"; errors: Record<string, string> }
  | { kind: "throttled" }
  | { kind: "failed" }

export function apiBaseUrl(): string | null {
  const url = process.env.API_BASE_URL?.trim()
  return url ? url.replace(/\/+$/, "") : null
}

const toSnake = (key: string) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
const toCamel = (key: string) => key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())

function snakeKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(snakeKeys)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [toSnake(k), snakeKeys(v)])
    )
  }
  return value
}

export async function postInquiry(path: string, payload: object): Promise<ApiResult> {
  const base = apiBaseUrl()
  if (!base) return { kind: "failed" }
  try {
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(snakeKeys(payload)),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    })
    if (res.status === 201 || res.status === 200) {
      const json = (await res.json()) as { data?: { reference?: string } }
      const reference = json.data?.reference
      return reference ? { kind: "created", reference } : { kind: "failed" }
    }
    if (res.status === 422) {
      const json = (await res.json()) as { errors?: Record<string, string[]> }
      const errors = Object.fromEntries(
        Object.entries(json.errors ?? {}).map(([k, v]) => [toCamel(k.split(".")[0]), v[0] ?? ""])
      )
      return { kind: "invalid", errors }
    }
    if (res.status === 429) return { kind: "throttled" }
    return { kind: "failed" }
  } catch {
    return { kind: "failed" }
  }
}
