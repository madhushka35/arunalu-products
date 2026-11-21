"use client"

import * as React from "react"
import { PencilLine, Trash2, X } from "lucide-react"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { DataTable } from "@/components/admin/data-table"
import { ImageUpload } from "@/components/admin/image-upload"
import { AdminPageHeader, IconAction, StatusBadge } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { FieldRow, SelectField, TextareaField, TextField } from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import type { AdminCategory } from "@/features/admin/sample-data"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

type Errors = Partial<Record<"name" | "slug" | "order", string>>

type DrawerProps = {
  open: boolean
  onOpenChange: (o: boolean) => void
  category: AdminCategory | null
  existing: AdminCategory[]
  onSaved: (msg: string) => void
  /** Changes every time the drawer opens, so the form starts fresh. */
  session: number
}

function CategoryDrawer(props: DrawerProps) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 bg-white p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[480px]"
      >
        <CategoryForm key={props.session} {...props} />
      </SheetContent>
    </Sheet>
  )
}

function CategoryForm({ onOpenChange, category, existing, onSaved }: DrawerProps) {
  const [name, setName] = React.useState(category?.name ?? "")
  const [slug, setSlug] = React.useState(category?.slug ?? "")
  const [slugTouched, setSlugTouched] = React.useState(Boolean(category))
  const [errors, setErrors] = React.useState<Errors>({})

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const order = Number(data.get("order"))
    const finalSlug = slug || slugify(name)
    const next: Errors = {}
    if (!name.trim()) next.name = "Enter the category name"
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(finalSlug)) next.slug = "Use lowercase letters, numbers and hyphens"
    else if (existing.some((c) => c.slug === finalSlug && c.slug !== category?.slug)) next.slug = "This slug is already used"
    if (!Number.isInteger(order) || order < 1) next.order = "Enter a whole number from 1"
    setErrors(next)
    if (Object.keys(next).length) return
    onOpenChange(false)
    onSaved(`Preview only: category “${name.trim()}” was not saved. Categories are saved once the backend is connected.`)
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line py-4 pr-4 pl-5 md:pl-7">
        <SheetTitle className="font-heading text-lg font-bold text-navy">{category ? "Edit category" : "Add category"}</SheetTitle>
        <SheetDescription className="sr-only">Category details</SheetDescription>
        <SheetClose
          aria-label="Close"
          className="flex size-11 items-center justify-center rounded-full text-navy outline-none hover:bg-surface focus-visible:ring-3 focus-visible:ring-teal/50"
        >
          <X aria-hidden className="size-5" />
        </SheetClose>
      </div>
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5 md:p-7">
        <TextField
          id="cat-name"
          name="name"
          label="Category name"
          required
          placeholder="e.g. Dried Fish"
          value={name}
          error={errors.name}
          onChange={(e) => {
            setName(e.target.value)
            if (!slugTouched) setSlug(slugify(e.target.value))
          }}
        />
        <TextField
          id="cat-slug"
          name="slug"
          label="Slug"
          placeholder="Generated from the name"
          hint="Used in links: /products?category=slug"
          value={slug}
          error={errors.slug}
          onChange={(e) => {
            setSlugTouched(true)
            setSlug(e.target.value)
          }}
        />
        <TextareaField
          id="cat-description"
          name="description"
          label="Description"
          maxLength={200}
          placeholder="Shown in the mega menu and on the catalog"
          defaultValue={category?.description}
          className="[&_textarea]:min-h-[96px]"
        />
        <ImageUpload id="cat-image" label="Category image" hint="JPG or WebP · 1200×800 (3:2) · max 2 MB" maxMB={2} />
        <FieldRow>
          <SelectField
            id="cat-status"
            name="status"
            label="Status"
            defaultValue={category?.status ?? "Active"}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
          <TextField
            id="cat-order"
            name="order"
            label="Display order"
            type="number"
            min={1}
            inputMode="numeric"
            defaultValue={category?.order ?? existing.length + 1}
            error={errors.order}
          />
        </FieldRow>
      </div>
      <div className="flex justify-end gap-3 border-t border-line px-5 py-4 md:px-7">
        <SheetClose className={ctaClassName("outline", "h-11")}>Cancel</SheetClose>
        <button type="submit" className={ctaClassName("primary", "h-11")}>
          Save category
        </button>
      </div>
    </form>
  )
}

/** Figma "Admin – 07 Product Categories" + "07b Add Category Drawer". */
export function CategoriesManager({ categories }: { categories: AdminCategory[] }) {
  const [drawer, setDrawer] = React.useState(false)
  const [editing, setEditing] = React.useState<AdminCategory | null>(null)
  const [toDelete, setToDelete] = React.useState<AdminCategory | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)
  const [session, setSession] = React.useState(0)
  const rows = [...categories].sort((a, b) => a.order - b.order)

  const open = (c: AdminCategory | null) => {
    setEditing(c)
    setSession((n) => n + 1)
    setDrawer(true)
  }

  return (
    <>
      <AdminPageHeader
        title="Product categories"
        subtitle={`${categories.length} categories — a product can belong to more than one`}
        actions={
          <button type="button" onClick={() => open(null)} className={ctaClassName("primary", "h-11 w-full md:w-auto")}>
            Add category
          </button>
        }
      />
      {notice && <FormBanner kind="warning">{notice}</FormBanner>}
      <DataTable
        caption="Product categories"
        rows={rows}
        rowKey={(c) => c.slug}
        firstColumnLink={false}
        columns={[
          { header: "Order", width: "w-[80px]", cell: (c) => c.order },
          { header: "Category", cell: (c) => c.name },
          {
            header: "Slug",
            width: "w-[200px]",
            desktopOnly: true,
            cell: (c) => <code className="text-xs text-ink-muted">{c.slug}</code>,
          },
          {
            header: "Products",
            width: "w-[100px]",
            cell: (c) => c.productCount,
          },
          {
            header: "Status",
            width: "w-[120px]",
            desktopOnly: true,
            cell: (c) => <StatusBadge status={c.status} />,
          },
          {
            header: "Actions",
            width: "w-[112px]",
            cell: (c) => (
              <span className="-my-1.5 flex items-center">
                <IconAction icon={PencilLine} label={`Edit ${c.name}`} onClick={() => open(c)} />
                <IconAction icon={Trash2} label={`Delete ${c.name}`} danger onClick={() => setToDelete(c)} />
              </span>
            ),
          },
        ]}
        card={(c) => ({
          title: c.name,
          badge: <StatusBadge status={c.status} />,
          line1: `${c.productCount} product${c.productCount === 1 ? "" : "s"} · display order ${c.order}`,
          meta: c.slug,
        })}
        onCardSelect={(c) => open(c)}
      />
      <p className="text-xs text-ink-muted">Display order controls the mega menu and catalog filters.</p>

      <CategoryDrawer
        session={session}
        open={drawer}
        onOpenChange={setDrawer}
        category={editing}
        existing={categories}
        onSaved={setNotice}
      />
      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete category?"
        message={
          toDelete && toDelete.productCount > 0
            ? `“${toDelete.name}” has ${toDelete.productCount} products. They stay on the website but are removed from this category.`
            : `“${toDelete?.name}” will be removed.`
        }
        confirmLabel="Delete category"
        danger
        onConfirm={() => setNotice(`Preview only: “${toDelete?.name}” was not deleted. Changes are saved once the backend is connected.`)}
      />
    </>
  )
}
