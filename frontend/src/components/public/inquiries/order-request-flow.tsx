"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { Breadcrumbs } from "@/components/public/breadcrumbs"
import { FieldRow, SelectField, TextareaField, TextField } from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { MobileProgress, Stepper } from "@/components/public/forms/stepper"
import { OutlineButton, SubmitButton } from "@/components/public/forms/submit-button"
import { SuccessPanel } from "@/components/public/forms/success-panel"
import { OrderSummaryCard } from "@/components/public/inquiries/order-summary-card"
import { siteConfig } from "@/config/site"
import { submitOrderRequest } from "@/features/inquiries/actions"
import { countries, countryName } from "@/features/inquiries/countries"
import { formatQuantity, labelOf, packagingOptions, quantityUnits } from "@/features/inquiries/options"
import { LIMITS, validateOrderStep1, validateOrderStep2 } from "@/features/inquiries/schema"
import { findProduct, productHref, products } from "@/features/products/catalog"
import { cn } from "@/lib/utils"
import type { FieldErrors, SubmitResult } from "@/types/inquiries"

type Values = {
  product: string
  quantity: string
  unit: string
  packaging: string
  fullName: string
  company: string
  email: string
  phone: string
  country: string
  requirements: string
  acknowledged: string
  website: string
}

const STEP1 = ["product", "quantity", "unit", "packaging"]
const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }))
const productOptions = products.map((p) => ({ value: p.slug, label: `${p.name} · ${p.packSize}` }))

/**
 * Guest order request — Figma "Order Request – Step 1…5" (desktop),
 * "Order Request – Mobile – Step 1 / 2 / Success" and "– Tablet (768) – Step 2".
 * A request is an inquiry, not a confirmed or paid order.
 */
export function OrderRequestFlow({ initialProduct }: { initialProduct?: string }) {
  const [values, setValues] = React.useState<Values>({
    product: initialProduct ?? "",
    quantity: "",
    unit: "kg",
    packaging: "",
    fullName: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    requirements: "",
    acknowledged: "",
    website: "",
  })
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [changingProduct, setChangingProduct] = React.useState(!initialProduct)
  const [result, setResult] = React.useState<SubmitResult>({ status: "idle" })
  const [pending, startTransition] = React.useTransition()
  const banner = React.useRef<HTMLDivElement>(null)
  const heading = React.useRef<HTMLHeadingElement>(null)
  const firstRender = React.useRef(true)

  const product = findProduct(values.product)
  const count = Object.values(errors).filter(Boolean).length

  // Move focus to the step heading whenever the step changes (not on first load).
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    heading.current?.focus()
  }, [step])

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target.type === "checkbox" ? ((e.target as HTMLInputElement).checked ? "yes" : "") : e.target.value
    setValues((prev) => ({ ...prev, [key]: v }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }
  const blur = (key: keyof Values) => () => {
    const all = step === 1 ? validateOrderStep1(values) : validateOrderStep2(values)
    setErrors((prev) => ({ ...prev, [key]: all[key] }))
  }
  const showErrors = (e: FieldErrors) => {
    setErrors(e)
    requestAnimationFrame(() => banner.current?.focus())
  }

  const next = () => {
    const e = step === 1 ? validateOrderStep1(values) : validateOrderStep2(values)
    if (Object.keys(e).length) return showErrors(e)
    setErrors({})
    setStep(step === 1 ? 2 : 3)
  }
  const back = () => {
    setErrors({})
    setStep(step === 3 ? 2 : 1)
  }

  const submit = () => {
    if (values.acknowledged !== "yes") return showErrors({ acknowledged: "Please confirm this before sending" })
    startTransition(async () => {
      const r = await submitOrderRequest(values)
      if (r.status === "invalid") {
        setErrors(r.errors)
        setStep(Object.keys(r.errors).some((k) => STEP1.includes(k)) ? 1 : r.errors.acknowledged ? 3 : 2)
        requestAnimationFrame(() => banner.current?.focus())
      } else {
        setResult(r)
        if (r.status === "error" || r.status === "unavailable") requestAnimationFrame(() => banner.current?.focus())
      }
    })
  }

  /* ---------------- success ---------------- */
  if (result.status === "sent" || result.status === "preview") {
    return (
      <section className="bg-surface">
        <div className="container-site flex flex-col items-center gap-8 py-10 md:py-16 xl:pt-20 xl:pb-[120px]">
          <div className="hidden w-full max-w-[760px] md:block">
            <Stepper current={4} />
          </div>
          <SuccessPanel
            title="Your order request has been sent."
            reference={result.status === "sent" ? result.reference : undefined}
            preview={result.status === "preview"}
            nextSteps={[
              "Our team reviews your request.",
              "We contact you by email or WhatsApp to confirm availability and details.",
              "If applicable, we send a quotation. Nothing is charged on this website.",
            ]}
          />
        </div>
      </section>
    )
  }

  const stepTitle = step === 1 ? "Product information" : step === 2 ? "Your details" : "Review your request"
  const nextLabel = step === 1 ? "Continue" : step === 2 ? "Review request" : "Submit request"
  const backLabel = step === 1 ? "Back to product" : "Back"
  const backAction = step === 1 ? null : back

  const actions = (mobile: boolean) => (
    <div
      className={cn(
        "flex items-center gap-3",
        mobile
          ? "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:hidden"
          : "hidden justify-between border-t border-line pt-6 md:flex"
      )}
    >
      {backAction ? (
        <OutlineButton onClick={backAction} disabled={pending} className={mobile ? "px-5" : undefined}>
          {backLabel}
        </OutlineButton>
      ) : (
        <Link
          href={product ? productHref(product.slug) : "/products"}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg border border-navy px-5 type-button text-navy outline-none hover:bg-navy hover:text-white focus-visible:ring-3 focus-visible:ring-teal/60 md:px-6"
        >
          {mobile ? "Back" : product ? backLabel : "Back to products"}
        </Link>
      )}
      <SubmitButton
        type="button"
        onClick={step === 3 ? submit : next}
        pending={pending}
        block={mobile}
        className={mobile ? "flex-1" : undefined}
      >
        {mobile && step === 3 ? "Submit" : nextLabel}
      </SubmitButton>
    </div>
  )

  return (
    <section className="bg-surface">
      <div className="container-site flex flex-col gap-6 pt-5 pb-28 md:gap-8 md:pt-8 md:pb-16 xl:pt-12 xl:pb-24">
        <Breadcrumbs
          className="hidden md:block"
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            ...(product ? [{ label: product.name, href: productHref(product.slug) }] : []),
            { label: "Request order" },
          ]}
        />
        <div className="hidden flex-col gap-2 md:flex">
          <h1 className="font-heading text-[30px] leading-[1.15] font-bold text-navy xl:text-[40px] xl:leading-[1.12]">
            Request an order
          </h1>
          <p className="max-w-[720px] text-base text-ink-muted">
            No account needed. Send your request and our team will contact you to confirm availability and pricing.
          </p>
        </div>
        <h1 className="sr-only md:hidden">Request an order</h1>

        <div className="hidden md:block">
          <Stepper current={step} />
        </div>
        <div className="md:hidden">
          <MobileProgress current={step} />
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[1fr_400px] xl:gap-10">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              if (step === 3) submit()
              else next()
            }}
            className="flex flex-col gap-5 md:gap-6 md:rounded-xl md:border md:border-line md:bg-white md:p-7 xl:p-10"
            aria-labelledby="order-step-title"
          >
            <h2
              id="order-step-title"
              ref={heading}
              tabIndex={-1}
              className="font-heading text-[30px] leading-[1.15] font-bold text-navy outline-none md:text-[28px] md:leading-[1.2]"
            >
              {stepTitle}
            </h2>

            {count > 0 ? (
              <FormBanner kind="error" ref={banner}>
                {count === 1 ? "Please fix the highlighted field." : `Please fix ${count} fields before continuing.`}
              </FormBanner>
            ) : result.status === "error" ? (
              <FormBanner kind="error" ref={banner}>{result.message}</FormBanner>
            ) : result.status === "unavailable" ? (
              <FormBanner kind="warning" ref={banner}>
                Online order requests are temporarily unavailable. Please call or WhatsApp{" "}
                <a className="font-medium underline" href={siteConfig.contact.phoneHref}>{siteConfig.contact.phoneDisplay}</a>{" "}
                or email{" "}
                <a className="font-medium underline" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
              </FormBanner>
            ) : (
              <div ref={banner} tabIndex={-1} className="sr-only" />
            )}

            {/* Honeypot (hidden) */}
            <input type="text" name="website" value={values.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px" />

            {step === 1 && (
              <>
                {product && !changingProduct ? (
                  <div className="flex items-center gap-4 rounded-md bg-surface p-4 md:bg-surface">
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-md bg-white">
                      <Image src={product.image} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <span className="flex flex-1 flex-col gap-0.5">
                      <span className="text-[13px] text-ink-muted">Selected product</span>
                      <span className="text-sm font-medium text-navy">{product.name} · {product.packSize}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setChangingProduct(true)}
                      className="rounded-sm type-button text-teal-strong outline-none hover:text-navy focus-visible:ring-3 focus-visible:ring-teal/60"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <SelectField
                    id="order-product"
                    label="Product"
                    required
                    placeholder="Select product"
                    options={productOptions}
                    value={values.product}
                    onChange={(e) => {
                      set("product")(e)
                      if (e.target.value) setChangingProduct(false)
                    }}
                    onBlur={blur("product")}
                    error={errors.product}
                  />
                )}
                <FieldRow>
                  <TextField id="order-qty" label="Quantity" required type="number" min={1} step="any" inputMode="decimal" value={values.quantity} onChange={set("quantity")} onBlur={blur("quantity")} error={errors.quantity} />
                  <SelectField id="order-unit" label="Quantity unit" required options={quantityUnits} value={values.unit} onChange={set("unit")} onBlur={blur("unit")} error={errors.unit} />
                </FieldRow>
                <SelectField
                  id="order-packaging"
                  label="Packaging preference"
                  required
                  placeholder="Select packaging"
                  options={packagingOptions}
                  value={values.packaging}
                  onChange={set("packaging")}
                  onBlur={blur("packaging")}
                  error={errors.packaging}
                  hint='Not sure? Choose "Custom packaging" and describe your needs in the next step.'
                />
              </>
            )}

            {step === 2 && (
              <>
                <FieldRow>
                  <TextField id="order-name" label="Full name" required autoComplete="name" maxLength={LIMITS.name} value={values.fullName} onChange={set("fullName")} onBlur={blur("fullName")} error={errors.fullName} />
                  <TextField id="order-company" label="Company name (if applicable)" autoComplete="organization" maxLength={LIMITS.company} value={values.company} onChange={set("company")} onBlur={blur("company")} error={errors.company} />
                </FieldRow>
                <FieldRow>
                  <TextField id="order-email" label="Email" required type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} placeholder="name@example.com" value={values.email} onChange={set("email")} onBlur={blur("email")} error={errors.email} />
                  <TextField id="order-phone" label="Phone / WhatsApp" required type="tel" inputMode="tel" autoComplete="tel" placeholder="+94 7X XXX XXXX" value={values.phone} onChange={set("phone")} onBlur={blur("phone")} error={errors.phone} />
                </FieldRow>
                <SelectField id="order-country" label="Country / location" required autoComplete="country" placeholder="Select country" options={countryOptions} value={values.country} onChange={set("country")} onBlur={blur("country")} error={errors.country} />
                <TextareaField id="order-req" label="Additional requirements" maxLength={LIMITS.text} placeholder="Grading, packaging, labelling, delivery timeline…" value={values.requirements} onChange={set("requirements")} onBlur={blur("requirements")} error={errors.requirements} />
              </>
            )}

            {step === 3 && (
              <>
                <ReviewSection
                  title="Product"
                  onEdit={() => setStep(1)}
                  rows={[
                    ["Product", product ? `${product.name} · ${product.packSize}` : "—"],
                    ["Quantity", formatQuantity(values.quantity, values.unit)],
                    ["Packaging", labelOf(packagingOptions, values.packaging)],
                  ]}
                />
                <ReviewSection
                  title="Your details"
                  onEdit={() => setStep(2)}
                  rows={[
                    ["Full name", values.fullName],
                    ["Company", values.company || "—"],
                    ["Email", values.email],
                    ["Phone / WhatsApp", values.phone],
                    ["Country / location", countryName(values.country)],
                    ["Requirements", values.requirements || "—"],
                  ]}
                />
                <div className="flex flex-col gap-2">
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={values.acknowledged === "yes"}
                      onChange={set("acknowledged")}
                      aria-invalid={errors.acknowledged ? true : undefined}
                      aria-describedby={errors.acknowledged ? "order-ack-error" : undefined}
                      className="mt-0.5 size-[18px] shrink-0 cursor-pointer accent-[#16b8b0]"
                    />
                    I understand this is a request, not a confirmed or paid order.
                  </label>
                  {errors.acknowledged && (
                    <p id="order-ack-error" className="pl-[30px] text-[13px] text-error-strong">{errors.acknowledged}</p>
                  )}
                </div>
                {pending && (
                  <p className="text-[13px] text-ink-muted" role="status">
                    Submitting… please don&apos;t close this page. Buttons are disabled to prevent duplicate requests.
                  </p>
                )}
              </>
            )}

            {actions(false)}
          </form>

          <div className="hidden md:block">
            <OrderSummaryCard product={product} quantity={values.quantity} unit={values.unit} packaging={values.packaging} />
          </div>
        </div>
      </div>
      {actions(true)}
    </section>
  )
}

function ReviewSection({ title, rows, onEdit }: { title: string; rows: [string, string][]; onEdit: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="type-overline text-teal-strong">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-sm type-button text-teal-strong outline-none hover:text-navy focus-visible:ring-3 focus-visible:ring-teal/60"
          aria-label={`Edit ${title.toLowerCase()}`}
        >
          Edit
        </button>
      </div>
      <dl className="border-t border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-6 border-b border-line py-3 text-sm">
            <dt className="w-[100px] shrink-0 text-ink-muted md:w-[200px]">{k}</dt>
            <dd className="min-w-0 [overflow-wrap:anywhere] whitespace-pre-line text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
