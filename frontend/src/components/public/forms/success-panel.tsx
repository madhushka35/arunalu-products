"use client"

import * as React from "react"
import { CircleCheck, Info } from "lucide-react"

import { CtaLink } from "@/components/public/cta-link"

type Props = {
  title: string
  /** Server-generated reference (ARU-ORD/EXP/CON-…). Absent in preview mode. */
  reference?: string
  preview?: boolean
  nextSteps: string[]
}

/**
 * Figma "Success" block: icon, H2, reference number, "What happens next",
 * Continue browsing / Back to home. Focus moves to the heading on mount.
 */
export function SuccessPanel({ title, reference, preview, nextSteps }: Props) {
  const heading = React.useRef<HTMLHeadingElement>(null)
  React.useEffect(() => {
    heading.current?.focus()
    heading.current?.scrollIntoView({ block: "center" })
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 text-center">
      <span className="flex size-[88px] items-center justify-center rounded-full bg-teal/14">
        <CircleCheck aria-hidden className="size-11 text-teal-strong" />
      </span>
      <h2 ref={heading} tabIndex={-1} className="max-w-[640px] type-h2 text-navy outline-none">
        {preview ? "Preview: your request was not sent." : title}
      </h2>

      {preview ? (
        <div className="flex w-full items-start gap-3 rounded-md border border-warning/35 bg-warning/10 p-4 text-left text-sm text-ink">
          <Info aria-hidden className="mt-px size-5 shrink-0 text-warning-strong" />
          <p>
            Preview mode — the website is not connected to the Arunalu Products system yet, so
            nothing was stored or sent and no reference number was created.
          </p>
        </div>
      ) : (
        reference && (
          <div className="flex w-full flex-col items-center gap-1.5 rounded-md border border-line bg-white px-4 py-5 md:w-auto md:px-8">
            <p className="type-overline text-ink-muted">Reference number</p>
            <p className="font-heading text-[24px] font-bold text-navy md:text-[28px]">{reference}</p>
          </div>
        )
      )}

      {!preview && (
        <p className="max-w-[560px] text-base text-ink-muted">
          Our team has been notified. Please keep your reference number for any follow-up.
        </p>
      )}

      <div className="flex w-full flex-col gap-4 rounded-xl border border-line bg-white p-7 text-left">
        <p className="type-overline text-teal-strong">What happens next</p>
        <ol className="flex flex-col gap-4">
          {nextSteps.map((step, i) => (
            <li key={step} className="flex items-start gap-3.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-[13px] text-white">
                {i + 1}
              </span>
              <span className="pt-0.5 text-base text-ink">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
        <CtaLink href="/products" icon block className="md:w-auto">
          Continue browsing
        </CtaLink>
        <CtaLink href="/" variant="outline" block className="md:w-auto">
          Back to home
        </CtaLink>
      </div>
    </div>
  )
}
