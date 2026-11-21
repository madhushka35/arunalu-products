"use client"

import * as React from "react"
import Image from "next/image"
import { X } from "lucide-react"

import { ImageUpload } from "@/components/admin/image-upload"
import { AdminPageHeader, ChipFilter, Panel } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { FieldRow, TextareaField, TextField } from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { Switch } from "@/components/ui/switch"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

const TABS = ["General", "Contact details", "Notifications", "SEO", "Integrations"] as const
type Tab = (typeof TABS)[number]
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <Panel className={cn("flex flex-col gap-4 p-5 md:p-6", className)}>
      <h2 className="font-heading text-lg font-bold text-navy">{title}</h2>
      {children}
    </Panel>
  )
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm text-ink">
      {label}
      <Switch defaultChecked={defaultChecked} />
    </label>
  )
}

/** Figma "Recipient Input": email chips, Enter adds, × removes. */
function Recipients({ id, initial }: { id: string; initial: string[] }) {
  const [list, setList] = React.useState(initial)
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  function add() {
    const v = value.trim().toLowerCase()
    if (!v) return
    if (!EMAIL.test(v)) return setError("Enter a valid email address")
    if (list.includes(v)) return setError("Already added")
    setList((l) => [...l, v])
    setValue("")
    setError(null)
  }
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        Email recipients
      </label>
      <div className={cn("flex flex-wrap items-center gap-2 rounded-md border bg-white p-2 focus-within:border-teal focus-within:ring-3 focus-within:ring-teal/30", error ? "border-error-strong" : "border-line")}>
        {list.map((e) => (
          <span key={e} className="inline-flex h-9 items-center gap-0.5 rounded-sm bg-surface pl-2.5 text-sm text-ink">
            {e}
            <button type="button" onClick={() => setList((l) => l.filter((x) => x !== e))} aria-label={`Remove ${e}`} className="flex size-9 items-center justify-center rounded-sm text-ink-strong-muted outline-none hover:text-error-strong focus-visible:ring-2 focus-visible:ring-teal/60">
              <X aria-hidden className="size-3.5" />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="email"
          value={value}
          placeholder="Add email address"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-hint`}
          onChange={(e) => {
            setValue(e.target.value)
            setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault()
              add()
            }
          }}
          onBlur={add}
          className="h-9 min-w-[180px] flex-1 bg-transparent px-1 text-sm text-ink outline-none placeholder:text-ink-muted/80"
        />
      </div>
      <p id={`${id}-hint`} className={cn("text-xs", error ? "text-error-strong" : "text-ink-muted")}>
        {error ?? "Press Enter to add another recipient."}
      </p>
    </div>
  )
}

function General() {
  const c = siteConfig.contact
  return (
    <div className="flex flex-col gap-4 md:gap-5 xl:flex-row xl:items-start xl:gap-6">
      <Card title="Company" className="min-w-0 flex-1">
        <FieldRow>
          <TextField id="company" name="company" label="Company name" defaultValue={siteConfig.name} />
          <TextField id="tagline" name="tagline" label="Tagline" defaultValue={siteConfig.tagline} />
        </FieldRow>
        <FieldRow>
          <TextField id="public-email" name="email" type="email" label="Public email" defaultValue={c.email} />
          <TextField id="phone" name="phone" type="tel" label="Telephone" defaultValue={c.phoneDisplay} />
        </FieldRow>
        <FieldRow>
          <TextField id="whatsapp" name="whatsapp" type="tel" label="WhatsApp" defaultValue={c.phoneDisplay} />
          <TextareaField id="address" name="address" label="Address" maxLength={300} defaultValue={c.address} className="[&_textarea]:min-h-[88px]" />
        </FieldRow>
      </Card>
      <Card title="Logo & favicon" className="xl:w-[400px] xl:shrink-0">
        <div className="flex items-center gap-3.5 rounded-md border border-line p-3">
          <span className="relative flex h-14 w-28 shrink-0 items-center justify-center rounded-sm bg-surface">
            <Image src="/images/brand/arunalu-logo-light.png" alt="Current logo" width={640} height={518} sizes="70px" className="h-11 w-auto" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-navy">arunalu-logo.png</span>
            <span className="text-xs text-ink-muted">PNG · transparent background (SVG pending)</span>
          </span>
        </div>
        <ImageUpload id="logo" label="Replace website logo" hint="SVG or PNG · min 400×120 px · max 1 MB" maxMB={1} accept="image/png,image/svg+xml,image/webp" />
        <ImageUpload id="favicon" label="Favicon" hint="Square 512×512 px PNG/SVG/ICO" maxMB={1} accept="image/png,image/svg+xml,image/x-icon" />
        <Toggle label="Show WhatsApp button on mobile" defaultChecked />
        <Toggle label="Maintenance mode" />
      </Card>
    </div>
  )
}

function ContactDetails() {
  return (
    <Card title="Contact page">
      <TextareaField id="hours" name="hours" label="Business hours" maxLength={300} placeholder="To be confirmed by Arunalu Products" className="[&_textarea]:min-h-[88px]" />
      <TextField id="map" name="map" type="url" label="Google Maps link" placeholder="https://maps.google.com/…" hint="Shown as a map on the Contact page once supplied" />
      <FieldRow>
        <TextField id="facebook" name="facebook" type="url" label="Facebook page" placeholder="https://facebook.com/…" />
        <TextField id="instagram" name="instagram" type="url" label="Instagram" placeholder="https://instagram.com/…" />
      </FieldRow>
    </Card>
  )
}

function Notifications() {
  const email = siteConfig.contact.email
  const groups = [
    { id: "orders", title: "Guest order requests", event: "New guest order request", list: [email], emailOn: true },
    { id: "exports", title: "Export inquiries", event: "New export inquiry", list: [email], emailOn: true },
    { id: "contact", title: "Contact messages", event: "New contact message", list: [email], emailOn: false },
  ]
  return (
    <div className="flex flex-col gap-4 md:gap-5 xl:flex-row xl:items-start xl:gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5 xl:gap-6">
        {groups.map((g) => (
          <Card key={g.id} title={g.title}>
            <Toggle label={`${g.event} — dashboard notification`} defaultChecked />
            <Toggle label={`${g.event} — email notification`} defaultChecked={g.emailOn} />
            <Recipients id={`recipients-${g.id}`} initial={g.list} />
          </Card>
        ))}
        <Card title="Customer confirmation emails">
          <Toggle label="Email the reference number to the customer after a guest order request" defaultChecked />
          <Toggle label="Email the reference number after an export inquiry" defaultChecked />
        </Card>
      </div>
      <Card title="Email sender" className="xl:w-[380px] xl:shrink-0">
        <TextField id="sender-name" name="sender_name" label="Sender name" defaultValue="Arunalu Products Website" />
        <TextField id="reply-to" name="reply_to" type="email" label="Reply-to email" defaultValue={email} />
        <button type="button" disabled className={ctaClassName("outline", "h-11 w-full")}>
          Send test email
        </button>
        <FormBanner kind="warning">Email delivery (SMTP / transactional provider) is connected with the backend. Test emails are not available yet.</FormBanner>
      </Card>
    </div>
  )
}

function Seo() {
  return (
    <div className="flex flex-col gap-4 md:gap-5 xl:flex-row xl:items-start xl:gap-6">
      <Card title="Search & sharing" className="min-w-0 flex-1">
        <TextField id="seo-title" name="seo_title" label="Default page title" defaultValue={`${siteConfig.name} – ${siteConfig.tagline}`} />
        <TextareaField id="seo-description" name="seo_description" label="Default meta description" maxLength={160} defaultValue={siteConfig.description} className="[&_textarea]:min-h-[88px]" />
        <TextField id="site-url" name="site_url" type="url" label="Website address" defaultValue={siteConfig.url} hint="Used for canonical links and the sitemap" />
      </Card>
      <Card title="Social share image" className="xl:w-[400px] xl:shrink-0">
        <ImageUpload id="og-image" label="Share image" hint="1200×630 · JPG/WebP · max 1 MB" maxMB={1} />
      </Card>
    </div>
  )
}

function Integrations() {
  return (
    <Card title="Integrations">
      <TextField id="ga" name="ga_id" label="Google Analytics measurement ID" placeholder="G-XXXXXXXXXX" hint="Added only after the cookie / privacy notice is approved" />
      <TextField id="turnstile" name="turnstile_site_key" label="Cloudflare Turnstile site key (public)" placeholder="Decided at deployment (D-09)" />
      <FormBanner kind="warning">Secret keys (Turnstile secret, SMTP password, API tokens) are stored only on the server and are never entered or shown here.</FormBanner>
    </Card>
  )
}

/** Figma "Admin – 18 Website Settings" (+ 18b Notifications, tablet / mobile). Values start from the live site config. */
export function SettingsEditor() {
  const [tab, setTab] = React.useState<Tab>("General")
  const [notice, setNotice] = React.useState(false)
  const bannerRef = React.useRef<HTMLDivElement>(null)
  const subtitle = tab === "Notifications" ? "Who is notified, and how, when customers submit requests" : "Global details used across the website"

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        setNotice(true)
        requestAnimationFrame(() => bannerRef.current?.focus())
      }}
      className="flex flex-col gap-4 md:gap-5 xl:gap-6"
    >
      <AdminPageHeader
        title="Website settings"
        subtitle={subtitle}
        actions={
          <button type="submit" className={ctaClassName("primary", "hidden h-11 md:inline-flex")}>
            Save settings
          </button>
        }
      />
      {notice && (
        <FormBanner kind="warning" ref={bannerRef}>
          Preview only: settings were not saved. They are stored once the backend is connected.
        </FormBanner>
      )}
      <ChipFilter label="Settings section" value={tab} onChange={setTab} options={TABS.map((t) => ({ value: t, label: t }))} />
      <div hidden={tab !== "General"}>
        <General />
      </div>
      <div hidden={tab !== "Contact details"}>
        <ContactDetails />
      </div>
      <div hidden={tab !== "Notifications"}>
        <Notifications />
      </div>
      <div hidden={tab !== "SEO"}>
        <Seo />
      </div>
      <div hidden={tab !== "Integrations"}>
        <Integrations />
      </div>
      <button type="submit" className={ctaClassName("primary", "h-11 w-full md:hidden")}>
        Save settings
      </button>
    </form>
  )
}
