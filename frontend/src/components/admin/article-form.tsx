"use client"

import * as React from "react"

import { ImageUpload } from "@/components/admin/image-upload"
import { AdminPageHeader, Panel } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { SelectField, TextareaField, TextField } from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { newsCategories, type AdminArticle } from "@/features/admin/sample-data"

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

type Errors = Partial<Record<"title" | "slug" | "category" | "body", string>>

/** Article editor (News management). Same card layout as the Figma product form. */
export function ArticleForm({ article }: { article?: AdminArticle }) {
  const edit = Boolean(article)
  const [title, setTitle] = React.useState(article?.title ?? "")
  const [slug, setSlug] = React.useState(article?.slug ?? "")
  const [slugTouched, setSlugTouched] = React.useState(edit)
  const [errors, setErrors] = React.useState<Errors>({})
  const [notice, setNotice] = React.useState<string | null>(null)
  const bannerRef = React.useRef<HTMLDivElement>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const draft = ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value === "draft"
    const data = new FormData(e.currentTarget)
    const next: Errors = {}
    if (!title.trim()) next.title = "Enter a title"
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) next.slug = "Use lowercase letters, numbers and hyphens"
    if (!draft) {
      if (!data.get("category")) next.category = "Choose a category"
      if (!String(data.get("body") ?? "").trim()) next.body = "Write the article before publishing"
    }
    setErrors(next)
    setNotice(Object.keys(next).length ? null : `Preview only: “${title.trim()}” was not ${draft ? "saved as a draft" : "published"}. Articles are saved once the backend is connected.`)
    requestAnimationFrame(() => bannerRef.current?.focus())
  }

  const buttons = (
    <>
      <button type="submit" value="draft" className={ctaClassName("outline", "h-11 flex-1 md:flex-none")}>
        Save draft
      </button>
      <button type="submit" value="publish" className={ctaClassName("primary", "h-11 flex-1 md:flex-none")}>
        {edit ? "Update" : "Publish"}
      </button>
    </>
  )

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-5 xl:gap-6">
      <AdminPageHeader
        title={edit ? "Edit article" : "New article"}
        subtitle={edit ? `${article!.title} · sample` : "News & updates shown on the public News page"}
        actions={<span className="hidden gap-3 md:flex">{buttons}</span>}
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
        <Panel className="flex min-w-0 flex-1 flex-col gap-5 p-5 md:p-6">
          <TextField
            id="title"
            name="title"
            label="Title"
            required
            value={title}
            error={errors.title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (!slugTouched) setSlug(slugify(e.target.value))
            }}
          />
          <TextField
            id="slug"
            name="slug"
            label="Slug"
            hint="Link: /news/slug"
            value={slug}
            error={errors.slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(e.target.value)
            }}
          />
          <TextareaField id="excerpt" name="excerpt" label="Excerpt" maxLength={200} placeholder="Shown on the News list" defaultValue={article?.excerpt} className="[&_textarea]:min-h-[88px]" />
          <TextareaField id="body" name="body" label="Article" required maxLength={20000} placeholder="Write the article…" error={errors.body} className="[&_textarea]:min-h-[320px]" />
        </Panel>
        <div className="flex flex-col gap-4 md:gap-5 xl:w-[380px] xl:shrink-0 xl:gap-6">
          <Panel className="flex flex-col gap-4 p-5 md:p-6">
            <h2 className="font-heading text-lg font-bold text-navy">Publishing</h2>
            <SelectField id="category" name="category" label="Category" required placeholder="Select…" defaultValue={article?.category ?? ""} error={errors.category} options={newsCategories.map((c) => ({ value: c, label: c }))} />
            <SelectField id="status" name="status" label="Status" defaultValue={article?.status ?? "Draft"} options={[{ value: "Draft", label: "Draft" }, { value: "Published", label: "Published" }]} />
          </Panel>
          <Panel className="flex flex-col gap-4 p-5 md:p-6">
            <h2 className="font-heading text-lg font-bold text-navy">Cover image</h2>
            <ImageUpload id="cover" label="Cover image" hint="16:9 · 1600×900 · WebP/JPG · max 2 MB" maxMB={2} />
          </Panel>
          <Panel className="flex flex-col gap-4 p-5 md:p-6">
            <h2 className="font-heading text-lg font-bold text-navy">SEO</h2>
            <TextField id="seo-title" name="seo_title" label="Meta title" hint="Leave empty to use the article title" />
            <TextareaField id="seo-description" name="seo_description" label="Meta description" maxLength={160} className="[&_textarea]:min-h-[88px]" />
          </Panel>
        </div>
      </div>
      <div className="sticky bottom-0 -mx-5 flex gap-3 border-t border-line bg-white px-5 py-3 md:hidden">{buttons}</div>
    </form>
  )
}
