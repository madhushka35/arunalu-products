import type { Metadata } from "next"

import { PageHero } from "@/components/public/page-hero"
import { PendingNotice } from "@/components/public/pages/pending-notice"

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: false },
}

/*
 * The legal text has not been supplied by the client and must not be
 * invented. Replace the notice with the approved text when it is provided.
 */
export default function Page() {
  return (
    <>
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} overline="Privacy policy" title="How we handle your information." />
      <PendingNotice
        title="This page is being prepared"
        text="Our privacy policy is being finalised and will be published here. If you have a question in the meantime, please contact us."
      />
    </>
  )
}
