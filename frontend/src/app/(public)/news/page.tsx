import type { Metadata } from "next"

import { PageHero } from "@/components/public/page-hero"
import { PendingNotice } from "@/components/public/pages/pending-notice"

export const metadata: Metadata = {
  title: "News & Updates",
  description: "News and updates from Arunalu Products.",
  alternates: { canonical: "/news" },
}

/*
 * Figma "News – Desktop": articles are managed in the admin panel (Stage 7)
 * and served by the Laravel API (Stage 9). No articles have been supplied,
 * so an empty state is shown instead of invented posts. The article detail
 * route is added together with the news API.
 */
export default function NewsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "News & Updates" }]}
        overline="News & updates"
        title="News from Arunalu Products."
      />
      <PendingNotice
        title="No news published yet"
        text="Company news, product updates and announcements will appear here. For the latest information, please contact our team."
      />
    </>
  )
}
