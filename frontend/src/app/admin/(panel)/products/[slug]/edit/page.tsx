import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductForm } from "@/components/admin/product-form"
import { adminProducts, findAdminProduct } from "@/features/admin/sample-data"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return adminProducts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = findAdminProduct((await params).slug)
  return { title: p ? `Edit ${p.name}` : "Edit product" }
}

export default async function AdminEditProductPage({ params }: Props) {
  const product = findAdminProduct((await params).slug)
  if (!product) notFound()
  return <ProductForm product={product} />
}
