"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff } from "lucide-react"

import { ctaClassName } from "@/components/public/cta-link"
import { FieldShell, TextField } from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type Errors = { email?: string; password?: string }

/**
 * Figma "Admin – 01 Login" / "01b Validation Errors": empty fields, Remember
 * me unchecked, password visibility toggle, validation on submit.
 *
 * Sign-in itself needs the Laravel backend (Sanctum session, server-side
 * role check). Until then a valid submit only explains that; nothing is sent.
 */
export function AdminLoginForm() {
  const [errors, setErrors] = React.useState<Errors>({})
  const [notice, setNotice] = React.useState<"pending" | "reset" | null>(null)
  const [show, setShow] = React.useState(false)
  const bannerRef = React.useRef<HTMLDivElement>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get("email") ?? "").trim()
    const password = String(data.get("password") ?? "")
    const next: Errors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address"
    if (!password) next.password = "Password is required"
    setErrors(next)
    setNotice(Object.keys(next).length ? null : "pending")
    requestAnimationFrame(() => bannerRef.current?.focus())
  }

  const hasErrors = Boolean(errors.email || errors.password)
  const pwInvalid = Boolean(errors.password)

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
      {hasErrors && (
        <FormBanner kind="error" ref={bannerRef}>
          Please check the highlighted fields and try again.
        </FormBanner>
      )}
      {notice && (
        <FormBanner kind="warning" ref={bannerRef}>
          {notice === "pending"
            ? "Sign-in is not connected yet. It will work once the backend is added — nothing was sent."
            : "Password reset is added together with the backend sign-in."}
        </FormBanner>
      )}

      <TextField id="admin-email" name="email" type="email" label="Email" autoComplete="username" error={errors.email} onChange={() => errors.email && setErrors((x) => ({ ...x, email: undefined }))} />

      <FieldShell id="admin-password" label="Password" error={errors.password}>
        <div className="relative">
          <input
            id="admin-password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={pwInvalid || undefined}
            aria-describedby={pwInvalid ? "admin-password-error" : undefined}
            onChange={() => pwInvalid && setErrors((x) => ({ ...x, password: undefined }))}
            className={cn(
              "h-[52px] w-full rounded-md border bg-white pr-14 pl-4 text-base text-ink outline-none transition-colors focus-visible:ring-3",
              pwInvalid
                ? "border-error-strong focus-visible:ring-error/25"
                : "border-line hover:border-ink-muted/60 focus-visible:border-teal focus-visible:ring-teal/30"
            )}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute top-1/2 right-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-ink-muted outline-none hover:text-navy focus-visible:ring-3 focus-visible:ring-teal/40"
          >
            {show ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}
          </button>
        </div>
      </FieldShell>

      <div className="flex items-center justify-between gap-4">
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-ink">
          <Checkbox name="remember" />
          Remember me
        </label>
        <button
          type="button"
          onClick={() => {
            setNotice("reset")
            requestAnimationFrame(() => bannerRef.current?.focus())
          }}
          className="min-h-11 text-sm font-semibold text-teal-strong outline-none hover:text-navy focus-visible:underline"
        >
          Forgot password?
        </button>
      </div>

      <button type="submit" className={ctaClassName("primary", "w-full")}>
        Sign in
      </button>

      <Link href="/admin" className="inline-flex min-h-11 items-center justify-center gap-1.5 text-sm font-semibold text-ink-muted outline-none hover:text-navy focus-visible:underline">
        Open the admin preview (sample data) <ArrowRight aria-hidden className="size-4" />
      </Link>
    </form>
  )
}
