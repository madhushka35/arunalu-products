"use client"

import * as React from "react"
import Image from "next/image"
import { Check, PencilLine } from "lucide-react"

import { FormDrawer } from "@/components/admin/form-drawer"
import { ImageUpload } from "@/components/admin/image-upload"
import { AdminPageHeader, ChipFilter, StatusBadge } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { FieldRow, SelectField, TextField } from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { Checkbox } from "@/components/ui/checkbox"
import { galleryCategories, type AdminMedia } from "@/features/admin/sample-data"
import { cn } from "@/lib/utils"

type Tab = "All" | (typeof galleryCategories)[number]
type Drawer = { kind: "upload" } | { kind: "video" } | { kind: "edit"; item: AdminMedia } | null

const categoryOptions = galleryCategories.map((c) => ({ value: c, label: c }))
const statusOptions = [
  { value: "Published", label: "Published" },
  { value: "Draft", label: "Draft" },
]
const VIDEO = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)[\w-]+/

/**
 * Figma "Admin – 13 Gallery Management": category tabs, media grid with
 * selection, upload / video-link actions. Only real Arunalu photos are listed
 * (D-12); AI illustrations must be marked so they are never shown as real.
 */
export function GalleryManager({ media }: { media: AdminMedia[] }) {
  const [tab, setTab] = React.useState<Tab>("All")
  const [selected, setSelected] = React.useState<string[]>([])
  const [drawer, setDrawer] = React.useState<Drawer>(null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [notice, setNotice] = React.useState<string | null>(null)

  const shown = tab === "All" ? media : media.filter((m) => m.category === tab)
  const count = (t: Tab) => (t === "All" ? media.length : media.filter((m) => m.category === t).length)
  const toggle = (id: string, on: boolean) => setSelected((s) => (on ? [...s, id] : s.filter((x) => x !== id)))
  const preview = (what: string) => setNotice(`Preview only: ${what} Changes are saved once the backend is connected.`)
  const open = (d: Drawer) => {
    setErrors({})
    setDrawer(d)
  }

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        subtitle={`${media.length} media items · real product photos only`}
        actions={
          <>
            <button type="button" onClick={() => open({ kind: "video" })} className={ctaClassName("outline", "h-11 flex-1 md:flex-none")}>
              Add video link
            </button>
            <button type="button" onClick={() => open({ kind: "upload" })} className={ctaClassName("primary", "h-11 flex-1 md:flex-none")}>
              Upload media
            </button>
          </>
        }
      />
      {notice && <FormBanner kind="warning">{notice}</FormBanner>}

      <ChipFilter label="Filter by category" value={tab} onChange={setTab} options={(["All", ...galleryCategories] as Tab[]).map((t) => ({ value: t, label: `${t} ${count(t)}` }))} />

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-teal/40 bg-teal/6 px-4 py-3">
          <p className="flex-1 text-sm font-medium text-navy">{selected.length} selected</p>
          <button type="button" onClick={() => preview(`${selected.length} item(s) were not published.`)} className={ctaClassName("outline", "h-10 px-4")}>
            Publish
          </button>
          <button type="button" onClick={() => preview(`${selected.length} item(s) were not unpublished.`)} className={ctaClassName("outline", "h-10 px-4")}>
            Unpublish
          </button>
          <button type="button" onClick={() => preview(`${selected.length} item(s) were not deleted.`)} className="min-h-10 px-3 text-sm font-semibold text-error-strong outline-none hover:underline focus-visible:underline">
            Delete
          </button>
          <button type="button" onClick={() => setSelected([])} className="min-h-10 px-3 text-sm font-semibold text-ink-muted outline-none hover:text-navy focus-visible:underline">
            Clear
          </button>
        </div>
      )}

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-white px-5 py-14 text-center">
          <p className="font-heading text-lg font-bold text-navy">No {tab.toLowerCase()} media yet</p>
          <p className="max-w-[420px] text-sm text-ink-muted">Upload real Arunalu photos for this category. AI illustrations must be marked as illustrative.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
          {shown.map((m) => {
            const on = selected.includes(m.id)
            return (
              <li key={m.id} className={cn("overflow-hidden rounded-xl border bg-white", on ? "border-teal ring-1 ring-teal" : "border-line")}>
                <div className="relative aspect-[4/3] bg-surface">
                  <Image src={m.src} alt={m.alt} fill sizes="(min-width: 1280px) 260px, 50vw" className="object-cover" />
                  <label className="absolute top-1.5 left-1.5 flex size-11 cursor-pointer items-center justify-center">
                    <span className="sr-only">Select {m.file}</span>
                    <Checkbox checked={on} onCheckedChange={(v) => toggle(m.id, Boolean(v))} className="size-5 border-white bg-white/90" />
                  </label>
                </div>
                <div className="flex flex-col gap-2 p-3 md:p-3.5">
                  <p className="truncate text-sm font-medium text-navy" title={m.file}>
                    {m.file}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-ink">{m.category}</span>
                    <StatusBadge status={m.status} />
                    <button
                      type="button"
                      onClick={() => open({ kind: "edit", item: m })}
                      aria-label={`Edit ${m.file}`}
                      className="ml-auto flex size-9 items-center justify-center rounded-md text-ink-muted outline-none hover:bg-surface hover:text-navy focus-visible:ring-3 focus-visible:ring-teal/50"
                    >
                      <PencilLine aria-hidden className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <FormDrawer
        open={drawer?.kind === "upload"}
        onOpenChange={(o) => !o && setDrawer(null)}
        title="Upload media"
        submitLabel="Upload"
        onSubmit={(data) => {
          const e: Record<string, string> = {}
          if (!data.get("category")) e.category = "Choose a category"
          if (!data.get("rights")) e.rights = "Please confirm this before uploading"
          setErrors(e)
          if (Object.keys(e).length) return false
          preview("the files were not uploaded.")
          return true
        }}
      >
        <ImageUpload id="media-files" label="Images" hint="JPG or WebP · max 5 MB each" multiple maxMB={5} />
        <FieldRow>
          <SelectField id="media-category" name="category" label="Category" required placeholder="Select…" options={categoryOptions} error={errors.category} />
          <SelectField id="media-status" name="status" label="Status" defaultValue="Draft" options={statusOptions} />
        </FieldRow>
        <TextField id="media-alt" name="alt" label="Alt text" hint="Describe what the photo shows (for screen readers and SEO)" />
        <label className="flex min-h-11 cursor-pointer items-start gap-2.5 text-sm text-ink">
          <input type="checkbox" name="illustrative" className="mt-0.5 size-4 accent-teal" />
          <span>
            AI-generated / illustrative image
            <span className="block text-xs text-ink-muted">It will carry an “Illustrative” label and is never presented as a real facility, product or staff photo.</span>
          </span>
        </label>
        <div className="flex flex-col gap-1">
          <label className="flex min-h-11 cursor-pointer items-start gap-2.5 text-sm text-ink">
            <input type="checkbox" name="rights" aria-invalid={errors.rights ? true : undefined} aria-describedby={errors.rights ? "media-rights-error" : undefined} className="mt-0.5 size-4 accent-teal" />
            I confirm Arunalu Products owns or may use these files.
          </label>
          {errors.rights && (
            <p id="media-rights-error" className="text-sm text-error-strong">
              {errors.rights}
            </p>
          )}
        </div>
      </FormDrawer>

      <FormDrawer
        open={drawer?.kind === "video"}
        onOpenChange={(o) => !o && setDrawer(null)}
        title="Add video link"
        submitLabel="Add video"
        onSubmit={(data) => {
          const e: Record<string, string> = {}
          if (!VIDEO.test(String(data.get("url") ?? "").trim())) e.url = "Paste a YouTube or Vimeo link (https://…)"
          if (!String(data.get("title") ?? "").trim()) e.title = "Enter a title"
          if (!data.get("category")) e.category = "Choose a category"
          setErrors(e)
          if (Object.keys(e).length) return false
          preview("the video link was not added.")
          return true
        }}
      >
        <TextField id="video-url" name="url" type="url" label="Video URL" required placeholder="https://www.youtube.com/watch?v=…" error={errors.url} />
        <TextField id="video-title" name="title" label="Title" required error={errors.title} />
        <FieldRow>
          <SelectField id="video-category" name="category" label="Category" required placeholder="Select…" options={categoryOptions} error={errors.category} />
          <SelectField id="video-status" name="status" label="Status" defaultValue="Draft" options={statusOptions} />
        </FieldRow>
      </FormDrawer>

      <FormDrawer
        open={drawer?.kind === "edit"}
        onOpenChange={(o) => !o && setDrawer(null)}
        title="Edit media"
        submitLabel="Save changes"
        onSubmit={() => {
          preview(`“${drawer?.kind === "edit" ? drawer.item.file : ""}” was not updated.`)
          return true
        }}
      >
        {drawer?.kind === "edit" && (
          <>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface">
              <Image src={drawer.item.src} alt={drawer.item.alt} fill sizes="420px" className="object-cover" />
            </div>
            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <Check aria-hidden className="size-4 text-success" /> {drawer.item.file}
            </p>
            <TextField id="edit-alt" name="alt" label="Alt text" defaultValue={drawer.item.alt} />
            <FieldRow>
              <SelectField id="edit-category" name="category" label="Category" defaultValue={drawer.item.category} options={categoryOptions} />
              <SelectField id="edit-status" name="status" label="Status" defaultValue={drawer.item.status} options={statusOptions} />
            </FieldRow>
          </>
        )}
      </FormDrawer>
    </>
  )
}
