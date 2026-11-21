"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

import { ImageUpload } from "@/components/admin/image-upload"
import { AdminPageHeader, Panel } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { TextareaField, TextField } from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { Switch } from "@/components/ui/switch"
import { contentSections, pendingContentPages, type ContentSection } from "@/features/admin/content-sections"
import { cn } from "@/lib/utils"

/**
 * Figma "Admin – 15 Website Content": pages & sections list, section editor,
 * preview card. Fields start with the live website copy.
 */
export function ContentEditor() {
  const pages = Array.from(new Set(contentSections.map((s) => s.page)))
  const [activeId, setActiveId] = React.useState(contentSections[0].id)
  const [notice, setNotice] = React.useState<string | null>(null)
  const active = contentSections.find((s) => s.id === activeId) as ContentSection
  const bannerRef = React.useRef<HTMLDivElement>(null)
  const show = (msg: string) => {
    setNotice(msg)
    requestAnimationFrame(() => bannerRef.current?.focus())
  }

  return (
    <>
      <AdminPageHeader
        title="Website content"
        subtitle="Edit page sections without code"
        actions={
          <>
            <a href="/" target="_blank" rel="noopener noreferrer" className={ctaClassName("outline", "h-11 flex-1 md:flex-none")}>
              Preview
            </a>
            <button type="submit" form="content-form" className={ctaClassName("primary", "h-11 flex-1 md:flex-none")}>
              Publish changes
            </button>
          </>
        }
      />
      {notice && (
        <FormBanner kind="warning" ref={bannerRef}>
          {notice}
        </FormBanner>
      )}

      <div className="flex flex-col gap-4 md:gap-5 xl:flex-row xl:items-start xl:gap-6">
        <Panel className="xl:w-[300px] xl:shrink-0">
          <label htmlFor="section-select" className="sr-only">
            Section
          </label>
          <div className="relative p-3 xl:hidden">
            <select
              id="section-select"
              value={activeId}
              onChange={(e) => setActiveId(e.target.value)}
              className="h-12 w-full cursor-pointer appearance-none rounded-md border border-line bg-white pr-10 pl-3.5 text-sm font-medium text-ink outline-none focus-visible:border-teal focus-visible:ring-3 focus-visible:ring-teal/30"
            >
              {pages.map((p) => (
                <optgroup key={p} label={p}>
                  {contentSections
                    .filter((s) => s.page === p)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-6 size-4 -translate-y-1/2 text-ink-muted" />
          </div>
          <nav aria-label="Pages and sections" className="hidden flex-col gap-0.5 p-2 xl:flex">
            {pages.map((p) => (
              <div key={p} className="flex flex-col gap-0.5">
                <p className="px-3 pt-3 pb-1 text-sm font-semibold text-navy">{p}</p>
                {contentSections
                  .filter((s) => s.page === p)
                  .map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-current={s.id === activeId ? "true" : undefined}
                      onClick={() => setActiveId(s.id)}
                      className={cn(
                        "flex min-h-10 items-center rounded-md pr-3 pl-7 text-left text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-teal/50",
                        s.id === activeId ? "bg-teal/10 font-medium text-navy" : "text-ink-muted hover:bg-surface hover:text-navy"
                      )}
                    >
                      {s.title}
                    </button>
                  ))}
              </div>
            ))}
            {pendingContentPages.map((p) => (
              <p key={p} className="flex min-h-10 items-center justify-between px-3 text-sm text-ink-muted" title="Editable once the content API is connected">
                {p}
                <span className="text-xs">soon</span>
              </p>
            ))}
          </nav>
        </Panel>

        <Panel className="min-w-0 flex-1 p-5 md:p-6">
          <form
            id="content-form"
            key={active.id}
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              show(`Preview only: “${active.page} · ${active.title}” was not published. Website content is saved once the backend is connected.`)
            }}
            className="flex flex-col gap-5"
          >
            <h2 className="font-heading text-lg font-bold text-navy">
              {active.page} · {active.title}
            </h2>
            {active.fields.map((f) =>
              f.kind === "image" ? (
                <ImageUpload key={f.key} id={`${active.id}-${f.key}`} label={f.label} hint={f.hint ?? ""} maxMB={1} />
              ) : f.kind === "textarea" ? (
                <TextareaField key={f.key} id={`${active.id}-${f.key}`} name={f.key} label={f.label} maxLength={f.max ?? 500} defaultValue={f.value} className="[&_textarea]:min-h-[88px]" />
              ) : (
                <TextField key={f.key} id={`${active.id}-${f.key}`} name={f.key} label={f.label} defaultValue={f.value} />
              )
            )}
            {active.id === "home-hero" && (
              <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm text-ink">
                Enable 3D hero on desktop (static image on mobile and with reduced motion)
                <Switch defaultChecked />
              </label>
            )}
          </form>
        </Panel>

        <Panel className="flex flex-col gap-3 p-5 md:p-6 xl:w-[340px] xl:shrink-0">
          <h2 className="font-heading text-lg font-bold text-navy">Preview</h2>
          <div className="relative flex aspect-[16/10] flex-col justify-end gap-1 overflow-hidden rounded-md bg-gradient-to-b from-ocean to-navy p-4 text-white">
            {active.previewImage && <Image src={active.previewImage} alt="" fill sizes="300px" className="object-cover opacity-30" />}
            <span className="relative text-[10px] font-semibold tracking-wide text-teal uppercase">{active.fields.find((f) => f.key === "overline")?.value}</span>
            <span className="relative font-heading text-base leading-tight font-bold">
              {active.fields.find((f) => f.key === "title" || f.key === "headline")?.value ?? active.title}
            </span>
          </div>
          <p className="text-xs text-ink-muted">Shows the current website copy. Last published: not tracked yet (backend).</p>
        </Panel>
      </div>
    </>
  )
}
