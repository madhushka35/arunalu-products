"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { ImageUpload } from "@/components/admin/image-upload"
import { AdminPageHeader, Panel } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { FieldRow, SelectField, TextareaField, TextField } from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { productForms, type AdminProduct } from "@/features/admin/sample-data"
import { categories } from "@/features/products/catalog"
import { cn } from "@/lib/utils"

type Errors = Partial<Record<"name" | "categories" | "short", string>>
type Spec = { id: number; name: string; value: string }

function Card({ title, children, aside, className }: { title: string; children: React.ReactNode; aside?: React.ReactNode; className?: string }) {
  return (
    <Panel className={cn("flex flex-col gap-4 p-5 md:p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-bold text-navy">{title}</h2>
        {aside}
      </div>
      {children}
    </Panel>
  )
}

function CheckOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-ink">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
      {label}
    </label>
  )
}

/**
 * Figma "Admin – 05 Add Product" / "06 Edit Product" (+ tablet / mobile
 * "Edit Product"). Only real product data is pre-filled; descriptions,
 * forms and specifications stay empty until approved copy exists.
 * Saving needs the backend (Stage 8/9): a valid submit shows a preview notice.
 */
export function ProductForm({ product }: { product?: AdminProduct }) {
  const edit = Boolean(product)
  const [errors, setErrors] = React.useState<Errors>({})
  const [notice, setNotice] = React.useState<string | null>(null)
  const [cats, setCats] = React.useState<string[]>(product?.categorySlugs ?? [])
  const [forms, setForms] = React.useState<string[]>([])
  const [specs, setSpecs] = React.useState<Spec[]>([
    { id: 1, name: "Grade / size", value: "" },
    { id: 2, name: "Moisture content", value: "" },
  ])
  const [featured, setFeatured] = React.useState(product?.featured ?? false)
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const bannerRef = React.useRef<HTMLDivElement>(null)
  const nextId = React.useRef(3)

  const focusBanner = () => requestAnimationFrame(() => bannerRef.current?.focus())

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    const draft = submitter?.value === "draft"
    const data = new FormData(e.currentTarget)
    const name = String(data.get("name") ?? "").trim()
    const short = String(data.get("short") ?? "").trim()
    const next: Errors = {}
    if (!name) next.name = "Enter the product name"
    if (!draft) {
      if (!cats.length) next.categories = "Choose at least one category"
      if (!short) next.short = "Enter a short description"
    }
    setErrors(next)
    setNotice(
      Object.keys(next).length
        ? null
        : `Preview only: “${name}” was not ${draft ? "saved as a draft" : edit ? "updated" : "published"}. Products are saved once the backend is connected.`
    )
    focusBanner()
  }

  const hasErrors = Object.keys(errors).some((k) => errors[k as keyof Errors])
  const toggle = (list: string[], v: string, on: boolean) => (on ? [...list, v] : list.filter((x) => x !== v))

  const actionButtons = (
    <>
      <button type="submit" name="intent" value="draft" className={ctaClassName("outline", "h-11 flex-1 md:flex-none")}>
        Save draft
      </button>
      <button type="submit" name="intent" value="publish" className={ctaClassName("primary", "h-11 flex-1 md:flex-none")}>
        {edit ? "Update" : "Publish"}
      </button>
    </>
  )

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-5 xl:gap-6">
      <AdminPageHeader
        title={edit ? "Edit product" : "Add product"}
        subtitle={edit ? `${product!.name} · last updated ${product!.updated} (sample)` : "Only fill technical fields that apply to this product"}
        actions={
          <>
            {edit && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="hidden min-h-11 px-2 text-sm font-semibold text-error-strong outline-none hover:underline focus-visible:underline md:inline-flex md:items-center"
              >
                Delete product
              </button>
            )}
            <span className="hidden gap-3 md:flex">{actionButtons}</span>
          </>
        }
      />

      {hasErrors && (
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
        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5 xl:gap-6">
          <Card title="Basic information">
            <TextField id="name" name="name" label="Product name" required defaultValue={product?.name} placeholder="e.g. Head-on Sprats" error={errors.name} />
            <fieldset className="flex flex-col gap-1.5" aria-describedby={errors.categories ? "categories-error" : undefined}>
              <legend className="mb-1.5 text-sm font-medium text-ink">
                Categories <span className="text-error-strong">*</span>
                <span className="ml-1.5 font-normal text-ink-muted">a product can belong to more than one</span>
              </legend>
              <div className="flex flex-wrap gap-x-6">
                {categories.map((c) => (
                  <CheckOption key={c.slug} label={c.name} checked={cats.includes(c.slug)} onChange={(on) => setCats((l) => toggle(l, c.slug, on))} />
                ))}
              </div>
              {errors.categories && (
                <p id="categories-error" className="text-sm text-error-strong">
                  {errors.categories}
                </p>
              )}
            </fieldset>
            <TextareaField id="short" name="short" label="Short description" required maxLength={160} placeholder="Shown on product cards (max 160 characters)" error={errors.short} className="[&_textarea]:min-h-[96px]" />
            <TextareaField id="description" name="description" label="Full description" maxLength={2000} placeholder="Shown on the product details page" />
          </Card>

          <Card title="Forms, processing & packaging">
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-ink">Available forms</legend>
              <div className="flex flex-wrap gap-x-6">
                {productForms.map((f) => (
                  <CheckOption key={f} label={f} checked={forms.includes(f)} onChange={(on) => setForms((l) => toggle(l, f, on))} />
                ))}
              </div>
            </fieldset>
            <TextareaField id="processing" name="processing" label="Processing information" maxLength={1000} placeholder="Describe processing for this product" />
            <TextareaField id="packaging" name="packaging" label="Packaging options" maxLength={1000} placeholder="Bulk / retail / custom…" />
            <TextareaField id="storage" name="storage" label="Storage information" maxLength={1000} placeholder="Storage instructions" />
          </Card>

          <Card
            title="Specifications (optional, per product)"
            aside={
              <button
                type="button"
                onClick={() => setSpecs((s) => [...s, { id: nextId.current++, name: "", value: "" }])}
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-teal-strong outline-none hover:text-navy focus-visible:underline"
              >
                <Plus aria-hidden className="size-4" /> Add field
              </button>
            }
          >
            {specs.map((s, i) => (
              <div key={s.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <FieldRow>
                    <TextField id={`spec-name-${s.id}`} name="spec_name" label="Field name" defaultValue={s.name} />
                    <TextField id={`spec-value-${s.id}`} name="spec_value" label="Value" placeholder="Leave empty to hide on website" />
                  </FieldRow>
                </div>
                <button
                  type="button"
                  onClick={() => setSpecs((l) => l.filter((x) => x.id !== s.id))}
                  aria-label={`Remove specification ${i + 1}`}
                  className="mb-1 flex size-11 shrink-0 items-center justify-center rounded-lg text-ink-muted outline-none hover:bg-error/8 hover:text-error-strong focus-visible:ring-3 focus-visible:ring-teal/50"
                >
                  <Trash2 aria-hidden className="size-[18px]" />
                </button>
              </div>
            ))}
            <p className="text-xs text-ink-muted">Empty fields are hidden on the product page. Never enter unverified technical values.</p>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:gap-5 xl:w-[380px] xl:shrink-0 xl:gap-6">
          <Card title="Publishing">
            <SelectField id="status" name="status" label="Status" defaultValue={product?.status ?? "Draft"} options={[{ value: "Draft", label: "Draft" }, { value: "Published", label: "Published" }]} />
            <SelectField id="availability" name="availability" label="Availability" defaultValue="on-request" options={[{ value: "on-request", label: "Available on request" }, { value: "unavailable", label: "Currently unavailable" }]} />
            <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm text-ink">
              Featured on homepage
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </label>
          </Card>
          <Card title="Product images">
            <ImageUpload
              id="images"
              label="Product images"
              hint="5:4 · 1600×1280 · WebP/JPG · max 5 MB"
              multiple
              maxMB={5}
              initial={product ? [{ src: product.image, name: `${product.name} photo` }, { src: product.originalImage, name: `${product.name} original photo` }] : []}
            />
            <p className="text-xs text-ink-muted">Recommended 1600×1280 (5:4), WebP/JPG, max 5 MB. First image is the cover. Use original product photos only.</p>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-5 flex gap-3 border-t border-line bg-white px-5 py-3 md:hidden">{actionButtons}</div>
      {edit && (
        <button type="button" onClick={() => setConfirmDelete(true)} className="min-h-11 text-sm font-semibold text-error-strong md:hidden">
          Delete product
        </button>
      )}

      {edit && (
        <ConfirmDialog
          open={confirmDelete}
          onOpenChange={setConfirmDelete}
          title="Delete product?"
          message={<>“{product!.name}” will be removed from the website. This is recorded in the activity log.</>}
          confirmLabel="Delete product"
          danger
          onConfirm={() => {
            setNotice(`Preview only: “${product!.name}” was not deleted. Changes are saved once the backend is connected.`)
            focusBanner()
          }}
        />
      )}
    </form>
  )
}
