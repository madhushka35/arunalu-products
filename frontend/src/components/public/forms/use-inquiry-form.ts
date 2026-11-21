"use client"

import * as React from "react"

import { validateField, type Raw } from "@/features/inquiries/schema"
import type { FieldErrors, SubmitResult } from "@/types/inquiries"

type FormName = "contact" | "export"

export function formDataToRaw(form: HTMLFormElement): Raw {
  const fd = new FormData(form)
  const raw: Record<string, string | string[]> = {}
  for (const key of new Set(fd.keys())) {
    const all = fd.getAll(key).filter((v): v is string => typeof v === "string")
    raw[key] = all.length > 1 || key === "products" ? all : (all[0] ?? "")
  }
  return raw
}

/**
 * Client-side validation layered over a server action:
 * - blur → check that field; submit → check all and stop if invalid
 * - server "invalid" results are shown until the person edits that field
 * - the error banner receives focus when errors appear
 */
export function useInquiryForm(
  name: FormName,
  state: SubmitResult,
  validateAll: (raw: Raw) => { ok: boolean; errors: FieldErrors },
  dispatch: (formData: FormData) => void
) {
  const banner = React.useRef<HTMLDivElement>(null)
  // Local errors are tied to the server state they were made against.
  const [local, setLocal] = React.useState<{ for: SubmitResult; errors: FieldErrors }>({
    for: state,
    errors: {},
  })
  const localErrors = local.for === state ? local.errors : {}
  const serverErrors = state.status === "invalid" ? state.errors : {}
  const errors: FieldErrors = { ...serverErrors, ...localErrors }
  const count = Object.values(errors).filter(Boolean).length

  React.useEffect(() => {
    if (state.status === "invalid" || state.status === "error" || state.status === "unavailable") {
      banner.current?.focus()
    }
  }, [state])

  const onBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    const target = e.target as unknown as HTMLInputElement
    if (!target.name || target.type === "checkbox") return
    const message = validateField(name, formDataToRaw(e.currentTarget), target.name)
    setLocal((prev) => ({
      for: state,
      errors: { ...(prev.for === state ? prev.errors : {}), [target.name]: message },
    }))
  }

  /** While a field shows an error, re-check it as the person types, so the
   *  message (and the banner) clear before they reach the submit button. */
  const onChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as unknown as HTMLInputElement
    if (!target.name || !errors[target.name]) return
    const message = validateField(name, formDataToRaw(e.currentTarget), target.name)
    if (message === errors[target.name]) return
    setLocal((prev) => ({
      for: state,
      errors: { ...(prev.for === state ? prev.errors : {}), [target.name]: message },
    }))
  }

  /**
   * With JavaScript the form is submitted here (not by the browser), so React
   * does not reset the fields after a server response. Without JavaScript the
   * <form action> posts natively and the server validates.
   */
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const result = validateAll(formDataToRaw(form))
    if (!result.ok) {
      // A full check is authoritative: clear server errors that are now fixed.
      const cleared = Object.fromEntries(Object.keys(serverErrors).map((k) => [k, undefined]))
      setLocal({ for: state, errors: { ...cleared, ...result.errors } })
      requestAnimationFrame(() => banner.current?.focus())
      return
    }
    const data = new FormData(form)
    React.startTransition(() => dispatch(data))
  }

  const values = state.status === "invalid" ? state.values : {}
  const value = (key: string) => {
    const v = values[key]
    return Array.isArray(v) ? v[0] : v
  }
  const valueList = (key: string) => {
    const v = values[key]
    return Array.isArray(v) ? v : v ? [v] : []
  }
  /** Clear one field's error after a non-blur change (e.g. product checkboxes). */
  const clearError = (key: string) =>
    setLocal((prev) => ({
      for: state,
      errors: { ...(prev.for === state ? prev.errors : {}), [key]: undefined },
    }))

  return { banner, errors, count, onBlur, onChange, onSubmit, value, valueList, clearError }
}
