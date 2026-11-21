"use client"

import * as React from "react"

import {
  FieldRow,
  Honeypot,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { SubmitButton } from "@/components/public/forms/submit-button"
import { SuccessPanel } from "@/components/public/forms/success-panel"
import { useInquiryForm } from "@/components/public/forms/use-inquiry-form"
import { siteConfig } from "@/config/site"
import { submitContact } from "@/features/inquiries/actions"
import { contactSubjects } from "@/features/inquiries/options"
import { LIMITS, validateContact } from "@/features/inquiries/schema"
import type { SubmitResult } from "@/types/inquiries"

const initial: SubmitResult = { status: "idle" }

/** Figma "Contact Form" (Send us a message). */
export function ContactForm() {
  const [state, action, pending] = React.useActionState(submitContact, initial)
  const f = useInquiryForm("contact", state, validateContact, action)

  if (state.status === "sent" || state.status === "preview") {
    return (
      <div className="rounded-xl border border-line bg-surface p-5 md:p-10">
        <SuccessPanel
          title="Thanks — your message has been sent."
          reference={state.status === "sent" ? state.reference : undefined}
          preview={state.status === "preview"}
          nextSteps={[
            "We read every message.",
            "We reply by email, usually after review by the right team.",
          ]}
        />
      </div>
    )
  }

  return (
    <form
      action={action}
      onSubmit={f.onSubmit}
      onBlur={f.onBlur}
      onChange={f.onChange}
      noValidate
      className="relative flex flex-col gap-5 rounded-xl border border-line bg-white p-5 md:p-10"
      aria-labelledby="contact-form-title"
    >
      <h2 id="contact-form-title" className="font-heading text-[22px] font-bold text-navy md:type-h3">
        Send us a message
      </h2>
      <FormStatus state={state} count={f.count} bannerRef={f.banner} />
      <Honeypot />
      <FieldRow>
        <TextField id="contact-name" name="name" label="Name" required autoComplete="name" maxLength={LIMITS.name} defaultValue={f.value("name")} error={f.errors.name} />
        <TextField id="contact-email" name="email" type="email" label="Email" required autoComplete="email" inputMode="email" maxLength={LIMITS.email} placeholder="name@example.com" defaultValue={f.value("email")} error={f.errors.email} />
      </FieldRow>
      <FieldRow>
        <TextField id="contact-phone" name="phone" type="tel" label="Phone" autoComplete="tel" inputMode="tel" placeholder="+94 7X XXX XXXX" defaultValue={f.value("phone")} error={f.errors.phone} />
        <SelectField id="contact-subject" name="subject" label="Subject" required options={contactSubjects} defaultValue={f.value("subject") ?? "general"} error={f.errors.subject} />
      </FieldRow>
      <TextareaField id="contact-message" name="message" label="Message" required maxLength={LIMITS.text} placeholder="How can we help?" defaultValue={f.value("message")} error={f.errors.message} />
      <SubmitButton pending={pending} block className="md:w-auto md:self-start">
        Send message
      </SubmitButton>
    </form>
  )
}

/** Error / unavailable banner shared by the single-page forms. */
export function FormStatus({
  state,
  count,
  bannerRef,
}: {
  state: SubmitResult
  count: number
  bannerRef: React.Ref<HTMLDivElement>
}) {
  if (count > 0) {
    return (
      <FormBanner kind="error" ref={bannerRef}>
        {count === 1 ? "Please fix the highlighted field." : `Please fix the ${count} highlighted fields.`}
      </FormBanner>
    )
  }
  if (state.status === "error") {
    return (
      <FormBanner kind="error" ref={bannerRef}>
        {state.message}
      </FormBanner>
    )
  }
  if (state.status === "unavailable") {
    return (
      <FormBanner kind="warning" ref={bannerRef}>
        Online inquiries are temporarily unavailable. Please call or WhatsApp{" "}
        <a className="font-medium underline" href={siteConfig.contact.phoneHref}>
          {siteConfig.contact.phoneDisplay}
        </a>{" "}
        or email{" "}
        <a className="font-medium underline" href={`mailto:${siteConfig.contact.email}`}>
          {siteConfig.contact.email}
        </a>
        .
      </FormBanner>
    )
  }
  return <div ref={bannerRef} tabIndex={-1} className="sr-only" />
}
