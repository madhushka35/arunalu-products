import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Hammer } from "lucide-react"

import { AdminPageHeader, Panel } from "@/components/admin/ui"
import { CtaLink } from "@/components/public/cta-link"
import { pendingAdminScreens } from "@/features/admin/nav"

type Props = { params: Promise<{ section: string[] }> }

/** Temporary placeholder for admin screens built later in Stage 7 (7b–7e). */
export function generateStaticParams() {
  return Object.keys(pendingAdminScreens).map((k) => ({ section: k.split("/") }))
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const screen = pendingAdminScreens[(await params).section.join("/")]
  return { title: screen?.title ?? "Admin" }
}

export default async function PendingAdminScreen({ params }: Props) {
  const screen = pendingAdminScreens[(await params).section.join("/")]
  if (!screen) notFound()
  return (
    <>
      <AdminPageHeader title={screen.title} />
      <Panel className="flex flex-col items-start gap-4 p-6 md:p-10">
        <span className="flex size-12 items-center justify-center rounded-full bg-sand/70">
          <Hammer aria-hidden className="size-5 text-navy" />
        </span>
        <h2 className="font-heading text-xl font-bold text-navy">This screen is being built</h2>
        <p className="max-w-[560px] text-sm leading-relaxed text-ink-muted">
          {screen.title} is part of admin Stage {screen.stage}. The layout and navigation are ready; the screen itself follows the Figma design in the next step.
        </p>
        <CtaLink href="/admin" variant="outline" className="h-11">Back to dashboard</CtaLink>
      </Panel>
    </>
  )
}
