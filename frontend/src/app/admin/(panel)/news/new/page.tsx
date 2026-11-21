import type { Metadata } from "next"

import { ArticleForm } from "@/components/admin/article-form"

export const metadata: Metadata = { title: "New article" }

export default function Page() {
  return <ArticleForm />
}
