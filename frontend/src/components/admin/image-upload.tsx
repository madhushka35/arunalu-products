"use client"

import * as React from "react"
import Image from "next/image"
import { ImagePlus, X } from "lucide-react"

import { cn } from "@/lib/utils"

type Item = { key: string; src: string; name: string; file?: File }

type ImageUploadProps = {
  id: string
  label: string
  hint: string
  /** Images already stored (edit mode). */
  initial?: { src: string; name: string }[]
  multiple?: boolean
  maxMB: number
  accept?: string
}

const TYPES = ["image/jpeg", "image/webp"]

/**
 * Figma "File Upload" (Default / Uploaded). Validates type and size in the
 * browser and shows previews; the first image is the cover. Files are only
 * uploaded once the backend exists (server-side validation happens there too).
 */
export function ImageUpload({ id, label, hint, initial = [], multiple = false, maxMB, accept = "image/jpeg,image/webp" }: ImageUploadProps) {
  const [items, setItems] = React.useState<Item[]>(() => initial.map((i) => ({ key: i.src, src: i.src, name: i.name })))
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const urls = React.useRef<string[]>([])

  React.useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), [])

  function onFiles(list: FileList | null) {
    if (!list?.length) return
    const ok: Item[] = []
    const bad: string[] = []
    for (const f of Array.from(list)) {
      if (!TYPES.includes(f.type)) bad.push(`${f.name}: use JPG or WebP`)
      else if (f.size > maxMB * 1024 * 1024) bad.push(`${f.name}: larger than ${maxMB} MB`)
      else {
        const src = URL.createObjectURL(f)
        urls.current.push(src)
        ok.push({ key: `${f.name}-${f.lastModified}-${f.size}`, src, name: f.name, file: f })
      }
    }
    setError(bad.length ? bad.join(" · ") : null)
    setItems((cur) => (multiple ? [...cur, ...ok] : ok.slice(0, 1).concat(ok.length ? [] : cur)))
    if (inputRef.current) inputRef.current.value = ""
  }

  const errId = `${id}-error`
  return (
    <div className="flex flex-col gap-2.5">
      <span id={`${id}-label`} className="text-sm font-medium text-ink">{label}</span>
      {items.length > 0 && (
        <ul className="grid grid-cols-3 gap-2.5" aria-label={`${label}: selected images`}>
          {items.map((it, i) => (
            <li key={it.key} className="relative aspect-[5/4] overflow-hidden rounded-md border border-line bg-surface">
              <Image src={it.src} alt={it.name} fill sizes="120px" className="object-cover" unoptimized={it.src.startsWith("blob:")} />
              {i === 0 && <span className="absolute bottom-1 left-1 rounded-sm bg-navy/85 px-1.5 py-0.5 text-[11px] font-semibold text-white">Cover</span>}
              <button
                type="button"
                onClick={() => setItems((cur) => cur.filter((x) => x.key !== it.key))}
                aria-label={`Remove ${it.name}`}
                className="absolute top-1 right-1 flex size-8 items-center justify-center rounded-full bg-white/90 text-navy outline-none hover:bg-white focus-visible:ring-3 focus-visible:ring-teal/60"
              >
                <X aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <label
        htmlFor={id}
        className={cn(
          "flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-surface/60 px-4 py-5 text-center transition-colors hover:border-teal has-focus-visible:ring-3 has-focus-visible:ring-teal/40",
          error ? "border-error-strong" : "border-line"
        )}
      >
        <ImagePlus aria-hidden className="size-6 text-teal-strong" />
        <span className="text-sm font-semibold text-navy">{items.length && !multiple ? "Replace image" : "Choose image" + (multiple ? "s" : "")}</span>
        <span className="text-xs text-ink-muted">{hint}</span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          aria-labelledby={`${id}-label`}
          aria-describedby={error ? errId : undefined}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onFiles(e.target.files)}
          className="sr-only"
        />
      </label>
      {error && (
        <p id={errId} role="alert" className="text-sm text-error-strong">
          {error}
        </p>
      )}
    </div>
  )
}
