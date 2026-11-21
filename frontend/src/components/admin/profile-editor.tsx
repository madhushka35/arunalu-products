"use client"

import * as React from "react"

import { ImageUpload } from "@/components/admin/image-upload"
import { AdminPageHeader, Panel, StatusBadge } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { FieldRow, TextField } from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { Switch } from "@/components/ui/switch"
import { adminUsers, sampleAdminUser } from "@/features/admin/sample-data"

type Errors = Partial<Record<"name" | "email" | "current" | "next" | "confirm", string>>
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm text-ink">
      {label}
      <Switch defaultChecked={defaultChecked} />
    </label>
  )
}

/** Figma "Admin – 20 Admin Profile": profile card, personal info, password, my notifications. */
export function ProfileEditor() {
  const me = adminUsers[0]
  const [errors, setErrors] = React.useState<Errors>({})
  const [notice, setNotice] = React.useState<string | null>(null)
  const bannerRef = React.useRef<HTMLDivElement>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const get = (k: string) => String(d.get(k) ?? "")
    const next: Errors = {}
    if (!get("name").trim()) next.name = "Enter your name"
    if (!EMAIL.test(get("email").trim())) next.email = "Enter a valid email address"
    const changing = get("current") || get("next") || get("confirm")
    if (changing) {
      if (!get("current")) next.current = "Enter your current password"
      if (get("next").length < 12) next.next = "Use at least 12 characters"
      else if (get("next") === get("current")) next.next = "Choose a different password"
      if (get("confirm") !== get("next")) next.confirm = "Passwords do not match"
    }
    setErrors(next)
    setNotice(Object.keys(next).length ? null : "Preview only: your profile was not saved. Sign-in and passwords are handled by the backend (Stage 9).")
    requestAnimationFrame(() => bannerRef.current?.focus())
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-5 xl:gap-6">
      <AdminPageHeader
        title="My profile"
        subtitle={`${sampleAdminUser.name} · ${sampleAdminUser.role}`}
        actions={
          <button type="submit" className={ctaClassName("primary", "h-11 w-full md:w-auto")}>
            Save changes
          </button>
        }
      />
      {Object.values(errors).some(Boolean) && (
        <FormBanner kind="error" ref={bannerRef}>
          Please check the highlighted fields.
        </FormBanner>
      )}
      {notice && (
        <FormBanner kind="warning" ref={bannerRef}>
          {notice}
        </FormBanner>
      )}
      <div className="flex flex-col gap-4 md:gap-5 xl:flex-row xl:items-start xl:gap-6">
        <Panel className="flex flex-col items-center gap-3 p-6 text-center xl:w-[320px] xl:shrink-0">
          <span aria-hidden className="flex size-24 items-center justify-center rounded-full bg-teal font-heading text-2xl font-bold text-navy">
            {sampleAdminUser.initials}
          </span>
          <p className="font-heading text-lg font-bold text-navy">{me.name}</p>
          <StatusBadge status={me.status} />
          <p className="text-xs text-ink-muted">Last login {me.lastLogin} 2026 (sample)</p>
          <div className="w-full text-left">
            <ImageUpload id="avatar" label="Profile photo" hint="Square JPG/WebP · max 1 MB" maxMB={1} />
          </div>
        </Panel>
        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5 xl:gap-6">
          <Panel className="flex flex-col gap-4 p-5 md:p-6">
            <h2 className="font-heading text-lg font-bold text-navy">Personal information</h2>
            <FieldRow>
              <TextField id="p-name" name="name" label="Full name" defaultValue={me.name} autoComplete="name" error={errors.name} />
              <TextField id="p-email" name="email" type="email" label="Email" defaultValue={me.email} autoComplete="email" error={errors.email} />
            </FieldRow>
          </Panel>
          <Panel className="flex flex-col gap-4 p-5 md:p-6">
            <h2 className="font-heading text-lg font-bold text-navy">Change password</h2>
            <TextField id="p-current" name="current" type="password" label="Current password" autoComplete="current-password" error={errors.current} />
            <FieldRow>
              <TextField id="p-next" name="next" type="password" label="New password" hint="Min. 12 characters" autoComplete="new-password" error={errors.next} />
              <TextField id="p-confirm" name="confirm" type="password" label="Confirm new password" autoComplete="new-password" error={errors.confirm} />
            </FieldRow>
          </Panel>
          <Panel className="flex flex-col gap-2 p-5 md:p-6">
            <h2 className="mb-2 font-heading text-lg font-bold text-navy">My notifications</h2>
            <Toggle label="Email me about new order requests" defaultChecked />
            <Toggle label="Email me about new export inquiries" defaultChecked />
            <Toggle label="Email me about contact messages" />
          </Panel>
        </div>
      </div>
    </form>
  )
}
