import type { Metadata } from "next"

import { PageHero } from "@/components/public/page-hero"
import { PendingNotice } from "@/components/public/pages/pending-notice"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  alternates: { canonical: "/terms" },
  robots: { index: false },
}

/*
 * The legal text has not been supplied by the client and must not be
 * invented. Replace the notice with the approved text when it is provided.
 */
export default function Page() {
  return (
    <>
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} overline="Terms and conditions" title="Terms of using this website." />
      <PendingNotice
        title="This page is being prepared"
        text="Our terms & conditions are being finalised and will be published here. If you have a question in the meantime, please contact us."
      />
    </>
  )
}
