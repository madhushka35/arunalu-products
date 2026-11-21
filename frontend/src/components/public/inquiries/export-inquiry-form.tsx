"use client"

import * as React from "react"

import {
  FieldRow,
  Honeypot,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/public/forms/fields"
import { ProductMultiSelect } from "@/components/public/forms/product-multi-select"
import { SubmitButton } from "@/components/public/forms/submit-button"
import { SuccessPanel } from "@/components/public/forms/success-panel"
import { useInquiryForm } from "@/components/public/forms/use-inquiry-form"
import { FormStatus } from "@/components/public/inquiries/contact-form"
import { submitExportInquiry } from "@/features/inquiries/actions"
import { countries } from "@/features/inquiries/countries"
import { packagingOptions } from "@/features/inquiries/options"
import { LIMITS, validateExport } from "@/features/inquiries/schema"
import type { SubmitResult } from "@/types/inquiries"

const initial: SubmitResult = { status: "idle" }
const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }))

/** Figma "Export Inquiry Form" (Revision 01: required / optional legend). */
export function ExportInquiryForm({ preselected }: { preselected?: string }) {
  const [state, action, pending] = React.useActionState(submitExportInquiry, initial)
  const f = useInquiryForm("export", state, validateExport, action)

  if (state.status === "sent" || state.status === "preview") {
    return (
      <div className="rounded-xl border border-line bg-surface p-5 md:p-10">
        <SuccessPanel
          title="Your export inquiry has been sent."
          reference={state.status === "sent" ? state.reference : undefined}
          preview={state.status === "preview"}
          nextSteps={[
            "Our export team reviews your inquiry.",
            "We reply by email with questions or next steps.",
            "Quotation and documentation are shared if applicable.",
          ]}
        />
      </div>
    )
  }

  const chosen = f.valueList("products")
  return (
    <form
      action={action}
      onSubmit={f.onSubmit}
      onBlur={f.onBlur}
      onChange={f.onChange}
      noValidate
      className="relative flex flex-col gap-5 rounded-xl border border-line bg-white p-5 md:p-10"
      aria-labelledby="export-form-title"
    >
      <div className="flex flex-col gap-1.5">
        <h2 id="export-form-title" className="font-heading text-[22px] font-bold text-navy md:type-h3">
          Export inquiry
        </h2>
        <p className="text-[13px] text-ink-muted">Fields marked * are required. Everything else is optional.</p>
      </div>
      <FormStatus state={state} count={f.count} bannerRef={f.banner} />
      <Honeypot />
      <FieldRow>
        <TextField id="exp-company" name="companyName" label="Company name" required autoComplete="organization" maxLength={LIMITS.company} defaultValue={f.value("companyName")} error={f.errors.companyName} />
        <TextField id="exp-contact" name="contactPerson" label="Contact person" required autoComplete="name" maxLength={LIMITS.name} defaultValue={f.value("contactPerson")} error={f.errors.contactPerson} />
      </FieldRow>
      <FieldRow>
        <TextField id="exp-email" name="email" type="email" label="Business email" required autoComplete="email" inputMode="email" maxLength={LIMITS.email} placeholder="imports@example.com" defaultValue={f.value("email")} error={f.errors.email} />
        <TextField id="exp-phone" name="phone" type="tel" label="Phone / WhatsApp" autoComplete="tel" inputMode="tel" placeholder="+00 00 000 0000" defaultValue={f.value("phone")} error={f.errors.phone} />
      </FieldRow>
      <FieldRow>
        <SelectField id="exp-country" name="country" label="Country" required autoComplete="country" placeholder="Select country" options={countryOptions} defaultValue={f.value("country") ?? ""} error={f.errors.country} />
        <ProductMultiSelect
          id="exp-products"
          name="products"
          label="Interested product(s)"
          defaultValue={chosen.length ? chosen : preselected ? [preselected] : []}
          error={f.errors.products}
          onChange={() => f.clearError("products")}
        />
      </FieldRow>
      <FieldRow>
        <TextField id="exp-destination" name="destination" label="Destination (port / city)" required maxLength={LIMITS.destination} defaultValue={f.value("destination")} error={f.errors.destination} />
        <TextField id="exp-qty" name="estimatedQuantity" type="number" min={1} step="any" inputMode="decimal" label="Estimated quantity (kg)" placeholder="e.g. 5000" defaultValue={f.value("estimatedQuantity")} error={f.errors.estimatedQuantity} />
      </FieldRow>
      <SelectField id="exp-packaging" name="packaging" label="Preferred packaging" placeholder="Select packaging" options={packagingOptions} defaultValue={f.value("packaging") ?? ""} error={f.errors.packaging} />
      <TextareaField id="exp-req" name="requirements" label="Additional requirements" maxLength={LIMITS.text} placeholder="Grade, labelling, shipping terms, timeline…" defaultValue={f.value("requirements")} error={f.errors.requirements} />
      <div className="flex flex-col gap-4 pt-1 md:flex-row md:items-center md:justify-between">
        <p className="text-[13px] text-ink-muted md:max-w-[380px]">
          No account needed. You receive a reference number and our export team is notified.
        </p>
        <SubmitButton pending={pending} block className="md:w-auto">
          Send export inquiry
        </SubmitButton>
      </div>
    </form>
  )
}
