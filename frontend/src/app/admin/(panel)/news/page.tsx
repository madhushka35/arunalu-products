import type { Metadata } from "next"

import { NewsManager } from "@/components/admin/news-manager"
import { adminArticles } from "@/features/admin/sample-data"

export const metadata: Metadata = { title: "News" }

export default function Page() {
  return <NewsManager articles={adminArticles} />
}
