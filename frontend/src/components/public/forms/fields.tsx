"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/* Figma "Input" / "Dropdown" / "Textarea": visible label, 52px field,
   4px radius, helper or error text below. Required = "*" in the label. */

const fieldBase =
  "w-full rounded-md border bg-white text-base text-ink outline-none transition-colors placeholder:text-ink-muted/80 focus-visible:ring-3 disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-70"
const okBorder = "border-line hover:border-ink-muted/60 focus-visible:border-teal focus-visible:ring-teal/30"
const errBorder = "border-error-strong focus-visible:border-error-strong focus-visible:ring-error/25"

type ShellProps = {
  id: string
  label: string
  required?: boolean
  hint?: React.ReactNode
  error?: string
  aside?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function FieldShell({ id, label, required, hint, error, aside, className, children }: ShellProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-navy">
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      {children}
      {(error || hint || aside) && (
        <div className="flex items-start justify-between gap-3 text-[13px]">
          {error ? (
            <p id={`${id}-error`} className="text-error-strong">
              {error}
            </p>
          ) : hint ? (
            <p id={`${id}-hint`} className="text-ink-muted">
              {hint}
            </p>
          ) : (
            <span />
          )}
          {aside}
        </div>
      )}
    </div>
  )
}

const describedBy = (id: string, error?: string, hint?: React.ReactNode) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined

type InputProps = Omit<React.ComponentProps<"input">, "id"> & {
  id: string
  label: string
  error?: string
  hint?: React.ReactNode
}

export function TextField({ id, label, error, hint, required, className, ...props }: InputProps) {
  return (
    <FieldShell id={id} label={label} required={required} error={error} hint={hint} className={className}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(fieldBase, "h-[52px] px-4", error ? errBorder : okBorder)}
        {...props}
      />
    </FieldShell>
  )
}

type SelectProps = Omit<React.ComponentProps<"select">, "id"> & {
  id: string
  label: string
  error?: string
  hint?: React.ReactNode
  placeholder?: string
  options: readonly { value: string; label: string }[]
}

export function SelectField({
  id,
  label,
  error,
  hint,
  required,
  placeholder,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <FieldShell id={id} label={label} required={required} error={error} hint={hint} className={className}>
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(fieldBase, "h-[52px] cursor-pointer appearance-none pr-11 pl-4", error ? errBorder : okBorder)}
          {...props}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-muted"
        />
      </div>
    </FieldShell>
  )
}

type TextareaProps = Omit<React.ComponentProps<"textarea">, "id"> & {
  id: string
  label: string
  error?: string
  hint?: React.ReactNode
  maxLength: number
}

/** Textarea with the live "0 / 1000" counter from Figma. */
export function TextareaField({
  id,
  label,
  error,
  hint,
  required,
  maxLength,
  className,
  onChange,
  defaultValue,
  value,
  ...props
}: TextareaProps) {
  const [count, setCount] = React.useState(() => String(value ?? defaultValue ?? "").length)
  const shown = value !== undefined ? String(value).length : count
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
      aside={
        <span className="shrink-0 text-ink-muted tabular-nums" aria-hidden>
          {shown} / {maxLength}
        </span>
      }
    >
      <textarea
        id={id}
        required={required}
        maxLength={maxLength}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(fieldBase, "min-h-[140px] resize-y px-4 py-3", error ? errBorder : okBorder)}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => {
          setCount(e.target.value.length)
          onChange?.(e)
        }}
        {...props}
      />
    </FieldShell>
  )
}

/** Pair of fields side by side from tablet up (Figma "Field Row", gap 20). */
export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2">{children}</div>
}

/** Visually hidden honeypot (leave empty). */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
}
