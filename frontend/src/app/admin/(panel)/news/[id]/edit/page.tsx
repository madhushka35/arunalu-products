import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticleForm } from "@/components/admin/article-form"
import { adminArticles, findArticle } from "@/features/admin/sample-data"

type Props = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return adminArticles.map((a) => ({ id: a.id }))
}

export const metadata: Metadata = { title: "Edit article" }

export default async function Page({ params }: Props) {
  const article = findArticle((await params).id)
  if (!article) notFound()
  return <ArticleForm article={article} />
}
